#!/usr/bin/env python3
"""
sync-locales.py — populate de/fr/it locale files from en.json using DeepL,
respecting a hand-written overrides file for brand-voiced strings and a
local cache so unchanged content is never re-translated.

Reusable across every brand website we build. Copy to `scripts/` in any
new brand repo; add `npm run i18n:sync` to package.json; set
DEEPL_API_KEY in .env.local.

Usage:
    python3 scripts/sync-locales.py             # sync all locales
    python3 scripts/sync-locales.py --locale de # sync one locale only
    python3 scripts/sync-locales.py --dry-run   # print what would change, don't write
    python3 scripts/sync-locales.py --clear-cache # invalidate cache

Setup:
    pip install deepl python-dotenv
    cp .env.local.example .env.local   # then edit to add DEEPL_API_KEY
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

try:
    import deepl
except ImportError:
    print("ERROR: deepl package missing. Install with: pip install deepl python-dotenv")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv(".env.local")
    load_dotenv(".env")
except ImportError:
    pass  # optional — env vars may already be set

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
LOCALES_DIR = REPO_ROOT / "src" / "i18n" / "locales"
OVERRIDES_PATH = REPO_ROOT / "i18n-overrides.json"
CACHE_PATH = REPO_ROOT / ".i18n-cache.json"

SOURCE_LOCALE = "en"
TARGET_LOCALES = ["de", "fr", "it"]

# DeepL target-language codes differ slightly from our keys
DEEPL_TARGETS = {"de": "DE", "fr": "FR", "it": "IT"}

# Brand-specific: words DeepL should never translate (proper nouns, product
# names, cities, sub-brand names). These are preserved verbatim by wrapping
# them in <ignore> tags before sending to DeepL.
DO_NOT_TRANSLATE = [
    "U-CALM", "U-Calm", "Cool CALM", "U-CALM Concierge",
    "U-CALM Aviation", "Ascent Aviation", "Consider it done.",
    "Ultimate Concierge and Lifestyle Management",
    "Lugano", "Paradiso", "Gandria", "Saanen", "Ticino",
    "TASIS", "Franklin University Switzerland",
    "Mendrisio", "Cap Ferrat", "Monte Brè", "Monte San Salvatore",
    "Parco Ciani", "Valle Verzasca", "Collina d'Oro", "Serene Teal",
    "Via Nassa", "Castagnola",
]

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    with path.open() as f:
        return json.load(f)


def save_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def walk(obj: Any, prefix: str = "") -> list[tuple[str, str]]:
    """Yield (dotted_key, string_value) for every leaf string in a nested dict."""
    items: list[tuple[str, str]] = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            key = f"{prefix}.{k}" if prefix else k
            items.extend(walk(v, key))
    elif isinstance(obj, str):
        items.append((prefix, obj))
    return items


def set_at(obj: dict, dotted_key: str, value: str) -> None:
    """Write value at a dotted path in a nested dict, creating intermediate
    dicts as needed."""
    parts = dotted_key.split(".")
    cur = obj
    for p in parts[:-1]:
        cur = cur.setdefault(p, {})
    cur[parts[-1]] = value


def apply_do_not_translate(text: str) -> str:
    """Wrap proper nouns in <x> tags so DeepL preserves them."""
    for term in DO_NOT_TRANSLATE:
        text = text.replace(term, f"<x>{term}</x>")
    return text


def strip_do_not_translate(text: str) -> str:
    """Remove the <x> tags from DeepL's response."""
    return text.replace("<x>", "").replace("</x>", "")


# -----------------------------------------------------------------------------
# Core
# -----------------------------------------------------------------------------


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync locale files from en.json.")
    parser.add_argument("--locale", choices=TARGET_LOCALES, help="Sync only one target locale.")
    parser.add_argument("--dry-run", action="store_true", help="Report changes, don't write.")
    parser.add_argument("--clear-cache", action="store_true", help="Invalidate translation cache.")
    args = parser.parse_args()

    # Load source of truth
    en_path = LOCALES_DIR / "en.json"
    if not en_path.exists():
        print(f"ERROR: {en_path} not found. English source of truth is required.")
        return 1
    en = load_json(en_path)
    en_leaves = walk(en)
    print(f"Source: en.json with {len(en_leaves)} strings.")

    # Load overrides + cache
    overrides = load_json(OVERRIDES_PATH)
    cache: dict = {} if args.clear_cache else load_json(CACHE_PATH)
    if args.clear_cache:
        print("Cache cleared.")

    # Set up DeepL
    api_key = os.getenv("DEEPL_API_KEY")
    if not api_key:
        print("ERROR: DEEPL_API_KEY not set. Add it to .env.local (free key at deepl.com/pro-api).")
        return 1
    translator = deepl.Translator(api_key)

    targets = [args.locale] if args.locale else TARGET_LOCALES

    for locale in targets:
        deepl_target = DEEPL_TARGETS[locale]
        locale_overrides = overrides.get(locale, {})
        result: dict = {}
        used_override = used_cache = used_deepl = 0

        for dotted_key, source_text in en_leaves:
            # 1. Override wins
            if dotted_key in locale_overrides:
                translation = locale_overrides[dotted_key]
                used_override += 1
            else:
                cache_key = f"{locale}|{source_text}"
                cached = cache.get(cache_key)
                # 2. Cache hit (source unchanged)
                if cached is not None:
                    translation = cached
                    used_cache += 1
                # 3. DeepL call
                else:
                    tagged = apply_do_not_translate(source_text)
                    resp = translator.translate_text(
                        tagged,
                        target_lang=deepl_target,
                        source_lang="EN",
                        tag_handling="xml",
                        ignore_tags=["x"],
                        formality="prefer_more",
                    )
                    translation = strip_do_not_translate(resp.text)
                    cache[cache_key] = translation
                    used_deepl += 1
                    print(f"  [deepl {locale}] {dotted_key}")

            set_at(result, dotted_key, translation)

        locale_path = LOCALES_DIR / f"{locale}.json"
        if args.dry_run:
            print(f"  (dry-run) would write {locale_path}")
        else:
            save_json(locale_path, result)
            print(f"  wrote {locale_path}")

        print(
            f"  {locale}: {used_override} overrides + {used_cache} cached + {used_deepl} DeepL = "
            f"{used_override + used_cache + used_deepl} total"
        )

    # Persist cache
    if not args.dry_run:
        save_json(CACHE_PATH, cache)

    # Structural sanity check — every locale must have the same key shape
    print("\nValidating key-shape parity across locales...")
    en_keys = {k for k, _ in en_leaves}
    ok = True
    for locale in TARGET_LOCALES:
        loc_path = LOCALES_DIR / f"{locale}.json"
        if not loc_path.exists():
            continue
        loc = load_json(loc_path)
        loc_keys = {k for k, _ in walk(loc)}
        missing = en_keys - loc_keys
        extra = loc_keys - en_keys
        if missing or extra:
            ok = False
            print(f"  {locale}: MISMATCH — missing {len(missing)}, extra {len(extra)}")
            for m in sorted(missing)[:5]:
                print(f"    missing: {m}")
        else:
            print(f"  {locale}: OK ({len(loc_keys)} keys)")
    if not ok:
        print("Structural validation failed — locale files do not match en.json.")
        return 2

    print("\nDone.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
