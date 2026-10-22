#!/usr/bin/env python3
"""Build and validate the portfolio's self-hosted WOFF2 font subsets.

Run from any directory with Python 3 and fontTools installed. Brotli compression
uses the Python brotli/brotlicffi package when available, otherwise Node.js's
built-in zlib implementation. No fonts or packages are fetched from the network.
The original TTFs and their license files stay in assets/fonts for rebuilding.
"""

from __future__ import annotations

import html
from pathlib import Path
import shutil
import subprocess

from fontTools import subset
from fontTools.ttLib import TTFont, woff2


ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = ROOT / "assets" / "fonts"


def enable_brotli() -> None:
    """Use an existing Brotli implementation without installing dependencies."""
    if woff2.haveBrotli:
        return
    node = shutil.which("node")
    if not node:
        raise SystemExit("WOFF2 needs Python brotli/brotlicffi or Node.js on PATH.")

    class NodeBrotli:
        MODE_TEXT = 1
        MODE_FONT = 2

        @staticmethod
        def run(operation: str, data: bytes, mode: int = 0, quality: int = 11) -> bytes:
            script = """
const zlib = require('node:zlib');
const fs = require('node:fs');
const [operation, mode, quality] = process.argv.slice(1);
const data = fs.readFileSync(0);
const result = operation === 'decompress'
  ? zlib.brotliDecompressSync(data)
  : zlib.brotliCompressSync(data, {params: {
      [zlib.constants.BROTLI_PARAM_MODE]: Number(mode),
      [zlib.constants.BROTLI_PARAM_QUALITY]: Number(quality)
    }});
process.stdout.write(result);
"""
            return subprocess.run(
                [node, "-e", script, operation, str(mode), str(quality)],
                input=data, capture_output=True, check=True,
            ).stdout

        @staticmethod
        def compress(data: bytes, mode: int = 0, quality: int = 11) -> bytes:
            return NodeBrotli.run("compress", data, mode, quality)

        @staticmethod
        def decompress(data: bytes) -> bytes:
            return NodeBrotli.run("decompress", data)

    woff2.brotli = NodeBrotli
    woff2.haveBrotli = True


def required_codepoints() -> set[int]:
    # Latin, including German umlauts/ß, punctuation, currency and UI symbols.
    ranges = (
        (0x0020, 0x024F), (0x1E00, 0x1EFF), (0x2000, 0x206F),
        (0x20A0, 0x20CF), (0x2100, 0x214F), (0x2190, 0x22FF),
        (0x25A0, 0x25FF), (0xFB00, 0xFB06),
    )
    codepoints = {point for start, end in ranges for point in range(start, end + 1)}
    codepoints.update((0xFEFF, 0xFFFD))
    # Also retain any additional supported characters used by the actual site.
    for path in sorted(ROOT.rglob("*.html")):
        if set(path.relative_to(ROOT).parts).intersection({".git", ".openai", "preview-public"}):
            continue
        codepoints.update(map(ord, html.unescape(path.read_text(encoding="utf-8"))))
    return codepoints


def build_font(source: Path, required: set[int]) -> tuple[int, int]:
    destination = source.with_suffix(".woff2")
    with TTFont(source, recalcTimestamp=False) as font:
        original_map = font.getBestCmap()
        retained = set(original_map).intersection(required)
        widths = {point: font["hmtx"][original_map[point]][0] for point in retained}
        options = subset.Options()
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.name_languages = ["*"]
        options.name_legacy = True
        options.recalc_timestamp = False
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=retained)
        subsetter.subset(font)
        font.flavor = "woff2"
        font.save(destination)

    # Decode the result and verify glyph coverage and text advance widths.
    with TTFont(destination) as rebuilt:
        rebuilt_map = rebuilt.getBestCmap()
        missing = retained.difference(rebuilt_map)
        if missing:
            raise RuntimeError(f"{destination.name}: missing codepoints {sorted(missing)}")
        for point, width in widths.items():
            if rebuilt["hmtx"][rebuilt_map[point]][0] != width:
                raise RuntimeError(f"{destination.name}: changed width for U+{point:04X}")

    before, after = source.stat().st_size, destination.stat().st_size
    if after >= before:
        raise RuntimeError(f"{destination.name}: subset did not reduce the file size")
    print(f"{source.name}: {before:,} → {after:,} bytes; {len(retained)} codepoints verified")
    return before, after


def main() -> None:
    enable_brotli()
    required = required_codepoints()
    sources = [FONT_DIR / f"portfolio-{index}.ttf" for index in range(10)]
    for source in sources:
        if not source.is_file():
            raise SystemExit(f"Missing original font: {source}")
    sizes = [build_font(source, required) for source in sources]
    before = sum(original for original, _ in sizes)
    after = sum(optimized for _, optimized in sizes)
    print(f"Total: {before:,} → {after:,} bytes ({(1 - after / before) * 100:.1f}% smaller)")


if __name__ == "__main__":
    main()
