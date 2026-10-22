#!/usr/bin/env python3
"""Refresh content hashes in local CSS/JS/SVG links after source changes.

Run build_styles.py --write first. Uses its page manifest to avoid preview files.
"""
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


def main():
    pages = json.loads((ROOT / "scripts/styles-manifest.json").read_text())["pages"]
    count = 0
    for name in pages:
        path = ROOT / name
        source = path.read_text()

        def replace(match):
            attr, quote, value = match.groups()
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or not parsed.path.startswith("/"):
                return match.group()
            asset = ROOT / parsed.path.lstrip("/")
            if asset.suffix not in {".css", ".js", ".svg"} or not asset.is_file():
                return match.group()
            version = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
            query = [part for part in parsed.query.split("&") if part and not part.startswith("v=")]
            query.append("v=" + version)
            revised = parsed.path + "?" + "&".join(query)
            if parsed.fragment:
                revised += "#" + parsed.fragment
            return attr + "=" + quote + revised + quote

        result = re.sub(r'''\b(href|src)=(["'])([^"']+)\2''', replace, source)
        if result != source:
            path.write_text(result)
            count += 1
    print(f"Updated local asset versions in {count} pages.")


if __name__ == "__main__":
    main()
