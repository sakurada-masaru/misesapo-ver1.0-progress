#!/usr/bin/env python3
"""
Simple HTML builder that supports only @include directives (Laravel-like) for static mocks.

Supported directive:
- @include('partials.header')  # ドット表記をパスに変換

Search roots for includes:
- src (absolute path under src)
- src/partials (デフォルトのパーシャル置き場)
- src/layouts（必要ならレイアウト断片も @include で組み合わせる）

Input → Output:
- Reads: src/pages/**/*.html
- Writes: public/**/*.html (same relative path)

Exit codes:
- 0 on success
- 1 on any build error
"""

from __future__ import annotations

import re
import json
import sys
from dataclasses import dataclass
from pathlib import Path
import shutil
from typing import Dict, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
PAGES_DIR = SRC / "pages"
PARTIALS_DIR = SRC / "partials"
LAYOUTS_DIR = SRC / "layouts"
PUBLIC = ROOT / "public"
ASSETS_DIR = SRC / "assets"


RE_INCLUDE = re.compile(r"@include\(['\"](.*?)['\"]\)")
# @json('path/to/data.json', $var) or @json('path/to/data.json', var)
RE_JSON = re.compile(r"@json\(\s*['\"](.*?)['\"]\s*(?:,\s*\$?([A-Za-z_][A-Za-z0-9_]*))?\s*\)")
# @foreach $var ... @endforeach  (also supports @foreach($var))
RE_FOREACH = re.compile(
    r"@foreach(?:\s*\(\s*)?\$?([A-Za-z_][A-Za-z0-9_]*)\s*(?:\)\s*)?(.*?)@endforeach",
    re.DOTALL,
)
# {{ key }} placeholder replacement inside foreach blocks
RE_PLACEHOLDER = re.compile(r"\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}")
## @jsonvar $var  → inline JSON string of a context variable
RE_JSONVAR = re.compile(r"@jsonvar\s+\$?([A-Za-z_][A-Za-z0-9_]*)")


class BuildError(Exception):
    pass


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        raise BuildError(f"File not found: {path}")


def dot_to_path(name: str) -> Path:
    # Prevent directory traversal
    if ".." in name:
        raise BuildError(f"Illegal template name (..): {name}")
    rel = name.replace(".", "/").lstrip("/")
    return Path(rel + ".html") if not rel.endswith(".html") else Path(rel)


def resolve_include(name: str) -> Path:
    rel = dot_to_path(name)
    # Try absolute within src
    candidates = [
        SRC / rel,  # explicit path under src
        PARTIALS_DIR / rel,  # default to partials
        LAYOUTS_DIR / rel,
    ]
    for c in candidates:
        if c.exists():
            return c
    raise BuildError(f"@include target not found: {name} (tried: {', '.join(str(c) for c in candidates)})")


def render_includes(text: str, depth: int = 0, max_depth: int = 20) -> str:
    if depth > max_depth:
        raise BuildError("Include depth exceeded (possible recursion loop)")

    def _sub(m: re.Match) -> str:
        name = m.group(1).strip()
        path = resolve_include(name)
        content = read_text(path)
        # Recurse for nested includes
        return render_includes(content, depth + 1, max_depth)

    while True:
        new = RE_INCLUDE.sub(_sub, text)
        if new == text:
            return new
        text = new


def resolve_data_path(raw: str) -> Path:
    # Support dot or slash, default under src/ if relative
    p = raw.strip()
    if ".." in p:
        raise BuildError(f"Illegal data path (..): {raw}")
    # dot to path
    if "." in p and "/" not in p:
        p = p.replace(".", "/")
    path = Path(p)
    if not path.is_absolute():
        # Prefer src/data then src root
        candidates = [SRC / "data" / path, SRC / path]
        for c in candidates:
            if c.exists():
                return c
        # fallback
        return SRC / path
    return path


def apply_placeholders(fragment: str, context: Dict[str, str]) -> str:
    def _sub(m: re.Match) -> str:
        key = m.group(1)
        val = context.get(key, "")
        return str(val)

    return RE_PLACEHOLDER.sub(_sub, fragment)


def render_foreach_blocks(text: str, context: Dict[str, object]) -> str:
    # Simple scanner to support @foreach $var ... @endforeach (non-nested)
    safety = 0
    while True:
        safety += 1
        if safety > 1000:
            raise BuildError("Too many @foreach expansions (possible loop)")

        start = text.find("@foreach")
        if start == -1:
            return text

        # Parse header directly from this position
        rest = text[start:]
        m_head = re.match(r"@foreach(?:\s*\(\s*)?\s*\$?([A-Za-z_][A-Za-z0-9_]*)", rest)
        if not m_head:
            raise BuildError("Malformed @foreach header. Use @foreach $var or @foreach($var)")
        var = m_head.group(1)
        head_len = m_head.end()

        end = text.find("@endforeach", start + head_len)
        if end == -1:
            raise BuildError("Missing @endforeach for @foreach block")

        body = text[start + head_len:end]

        data = context.get(var)
        if data is None:
            raise BuildError(f"@foreach references undefined variable: ${var}")
        if not isinstance(data, list):
            raise BuildError(f"@foreach expects list for ${var}, got: {type(data).__name__}")

        parts: List[str] = []
        for idx, item in enumerate(data, start=1):
            if isinstance(item, dict):
                item_ctx = {k: v for k, v in item.items()}
            else:
                item_ctx = {"value": item}
            item_ctx["index"] = idx
            rendered = apply_placeholders(body, item_ctx)
            parts.append(rendered)

        text = text[:start] + "".join(parts) + text[end + len("@endforeach"):]


def process_json_directives(text: str, context: Dict[str, object]) -> str:
    # Iterate all json directives and load data into context
    def _sub(m: re.Match) -> str:
        raw_path = m.group(1)
        var = m.group(2)
        path = resolve_data_path(raw_path)
        try:
            data = json.loads(read_text(path))
        except json.JSONDecodeError as e:
            raise BuildError(f"Invalid JSON in {path}: {e}")
        if var is None or not var:
            # derive from filename
            name = path.stem
            var_name = name
        else:
            var_name = var
        context[var_name] = data
        return ""  # directive removed

    return RE_JSON.sub(_sub, text)


def process_jsonvar_directives(text: str, context: Dict[str, object]) -> str:
    def _sub(m: re.Match) -> str:
        var = m.group(1)
        if var not in context:
            raise BuildError(f"@jsonvar references undefined variable: ${var}")
        try:
            return json.dumps(context[var], ensure_ascii=False)
        except Exception as e:
            raise BuildError(f"Failed to serialize ${var} to JSON: {e}")

    return RE_JSONVAR.sub(_sub, text)
def render_page(path: Path) -> str:
    raw = read_text(path)
    # 1) resolve includes first
    text = render_includes(raw)
    # 2) process json + foreach with a simple context
    context: Dict[str, object] = {}
    text = process_json_directives(text, context)
    text = render_foreach_blocks(text, context)
    text = process_jsonvar_directives(text, context)
    return text


def ensure_dir(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def copy_assets(outputs: List[str]) -> None:
    if not ASSETS_DIR.exists():
        return
    for src_path in ASSETS_DIR.rglob("*"):
        if src_path.is_dir():
            continue
        # mirror under public/ stripping the leading 'assets/'
        rel = src_path.relative_to(ASSETS_DIR)
        dst_path = PUBLIC / rel
        ensure_dir(dst_path)
        shutil.copy2(src_path, dst_path)
        outputs.append(str(dst_path))


def build_all() -> List[str]:
    if not PAGES_DIR.exists():
        raise BuildError(f"Missing input directory: {PAGES_DIR}")
    outputs: List[str] = []
    for page in PAGES_DIR.rglob("*.html"):
        rel = page.relative_to(PAGES_DIR)
        out_path = PUBLIC / rel
        html = render_page(page)
        ensure_dir(out_path)
        out_path.write_text(html, encoding="utf-8")
        outputs.append(str(out_path))
    # copy static assets last
    copy_assets(outputs)
    return outputs


def main() -> int:
    try:
        outputs = build_all()
    except BuildError as e:
        print(f"[build:error] {e}")
        return 1
    except Exception as e:
        print(f"[build:exception] {e}")
        return 1

    print("[build] generated files:\n" + "\n".join(outputs))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
