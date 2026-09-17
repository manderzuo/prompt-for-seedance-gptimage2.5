import json
import os
import re
from pathlib import Path

import ctranslate2
from transformers import MarianTokenizer


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / 'data' / 'cases.json'
CACHE_FILE = ROOT / 'work' / 'local-translation-cache-v2.json'
MODEL_DIR = ROOT / 'work' / 'opus-mt-en-zh'
CT2_MODEL_DIR = ROOT / 'work' / 'opus-mt-en-zh-ct2'
MAX_CHARS = 680
BATCH_SIZE = 16


def count_cjk(text):
    return len(re.findall(r'[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]', text or ''))


def keep_original_prompt(source):
    """Do not machine-translate prompts that are already written in CJK text."""
    if not source.strip() or not re.search(r'[A-Za-z]', source):
        return True
    visible_length = len(re.sub(r'\s+', '', source))
    cjk_length = count_cjk(source)
    return cjk_length >= 20 and cjk_length / max(1, visible_length) >= 0.25


def extract_original_chinese(source):
    """Use the hand-authored Chinese block when the source contains bilingual sections."""
    match = re.search(r'\[中文\]\s*(.*?)(?=\s*\[(?:English|英文)\]|$)', source or '', re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ''


def broken_translation(source, translated):
    """Reject outputs that visibly lost the prompt's content or structure."""
    translated = (translated or '').strip()
    if not translated:
        return True

    source_length = len(re.sub(r'\s+', '', source))
    translated_length = len(re.sub(r'\s+', '', translated))
    if source_length >= 40 and translated_length < max(12, int(source_length * 0.12)):
        return True
    if translated_length > max(300, source_length * 3):
        return True

    # Marian occasionally turns a mixed-language prompt into punctuation or
    # repeated braces/underscores. Never expose those artifacts in the UI.
    if re.search(r'([^\s])\1{5,}', translated):
        return True
    if re.search(r'[,，:：;；!?！？_{}[\]()]{6,}', translated):
        return True

    punctuation_count = len(re.findall(r'[,，。.:：;；!?！？{}[\]()_]', translated))
    if translated_length >= 80 and punctuation_count / translated_length > 0.45:
        return True

    # A substantial English prompt should produce at least some Chinese text.
    if source_length >= 40 and count_cjk(translated) == 0:
        return True
    return False


def load_json(path, fallback):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (FileNotFoundError, json.JSONDecodeError):
        return fallback


def save_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def split_text(text):
    chunks = []
    for paragraph in re.split(r'\n+', text.strip()):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        current = ''
        sentences = re.split(r'(?<=[.!?。！？；;])\s+', paragraph)
        for sentence in sentences:
            if not current:
                current = sentence
            elif len(current) + len(sentence) + 1 <= MAX_CHARS:
                current += ' ' + sentence
            else:
                chunks.append(current)
                current = sentence
        if current:
            chunks.append(current)
    result = []
    for chunk in chunks:
        result.extend(chunk[index:index + MAX_CHARS] for index in range(0, len(chunk), MAX_CHARS))
    return result


def translate_chunks(chunks, tokenizer, translator):
    translated = []
    for index in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[index:index + BATCH_SIZE]
        source_tokens = [['>>cmn_Hans<<', *tokenizer.tokenize(text)] for text in batch]
        results = translator.translate_batch(source_tokens, beam_size=1, max_decoding_length=384)
        for result in results:
            target_ids = tokenizer.convert_tokens_to_ids(result.hypotheses[0])
            translated.append(tokenizer.decode(target_ids, skip_special_tokens=True))
    return translated


def main():
    payload = load_json(DATA_FILE, None)
    if not payload or not payload.get('cases'):
        raise SystemExit(f'Cannot read cases from {DATA_FILE}')
    cache = load_json(CACHE_FILE, {})
    tokenizer = MarianTokenizer.from_pretrained(MODEL_DIR)
    translator = ctranslate2.Translator(str(CT2_MODEL_DIR), device='cpu', compute_type='int8', inter_threads=2, intra_threads=3)

    new_count = 0
    cached_count = 0
    for index, item in enumerate(payload['cases']):
        source = str(item.get('promptEn') or item.get('prompt') or '')
        original_chinese = extract_original_chinese(source)
        if original_chinese:
            translated = original_chinese
        elif keep_original_prompt(source):
            translated = source
        elif source in cache:
            translated = cache[source]
            cached_count += 1
        else:
            chunks = split_text(source)
            translated = '\n'.join(translate_chunks(chunks, tokenizer, translator)).strip()
            cache[source] = translated
            save_json(CACHE_FILE, cache)
            new_count += 1

        if not original_chinese and not keep_original_prompt(source) and broken_translation(source, translated):
            translated = source

        item['prompt'] = source
        item['promptEn'] = source
        item['promptZh'] = translated or source
        item['promptPreviewEn'] = item.get('promptPreviewEn') or re.sub(r'\s+', ' ', source)[:220]
        item['promptPreviewZh'] = re.sub(r'\s+', ' ', item['promptZh'])[:220]
        item['promptPreview'] = item['promptPreviewEn']
        if (index + 1) % 5 == 0 or index == len(payload['cases']) - 1:
            save_json(DATA_FILE, payload)
            print(f'Translated {index + 1}/{len(payload["cases"])} cases (new {new_count}, cached {cached_count})', flush=True)

    save_json(DATA_FILE, payload)
    print(f'Completed local Chinese translations: {new_count} new, {cached_count} cached.')


if __name__ == '__main__':
    os.environ.setdefault('TOKENIZERS_PARALLELISM', 'false')
    main()
