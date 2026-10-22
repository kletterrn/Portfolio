#!/usr/bin/env python3
"""Build deterministic 1200 × 630 sharing cards from the portfolio assets.

Requires Pillow. Run from any directory: python scripts/build_social_cards.py
Existing project images are placed as evidence, without changing their content.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "social"
SIZE = (1200, 630)
INK = "#101010"
PAPER = "#f1f1e9"
MUTED = "#b2b4bc"
BLUE = "#3153ff"


def font(number, size):
    return ImageFont.truetype(str(ROOT / "assets" / "fonts" / f"portfolio-{number}.ttf"), size)


def base(section):
    card = Image.new("RGB", SIZE, INK)
    draw = ImageDraw.Draw(card)
    draw.rectangle((60, 53, 69, 71), fill=BLUE)
    draw.text((84, 48), "DAVID KHALIQI", fill=PAPER, font=font(1, 19))
    draw.text((780, 51), section, fill=MUTED, font=font(0, 14))
    draw.line((60, 566, 1140, 566), fill="#393a40", width=1)
    draw.text((60, 589), "KLETTER RN.GITHUB.IO".replace(" ", ""), fill=MUTED, font=font(0, 13))
    draw.text((934, 589), "DESIGN + DEVELOPMENT", fill=MUTED, font=font(0, 13))
    return card, draw


def placed(card, path, box):
    """Contain the complete source image inside a fixed panel."""
    x, y, width, height = box
    source = Image.open(ROOT / "assets" / path).convert("RGB")
    fitted = ImageOps.contain(source, (width, height), Image.Resampling.LANCZOS)
    card.paste(fitted, (x + (width - fitted.width) // 2, y + (height - fitted.height) // 2))


def save(card, name):
    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / (name + ".png")
    card.save(target, optimize=True)
    print(f"{target.relative_to(ROOT)}: {target.stat().st_size:,} bytes, 1200 × 630")


def main():
    card, draw = base("PORTFOLIO / AUSBILDUNG 2027")
    placed(card, "prism-hero.webp", (640, 105, 535, 360))
    draw.text((60, 149), "A designer’s eye.", fill=PAPER, font=font(6, 69))
    draw.text((60, 240), "A developer’s", fill=PAPER, font=font(2, 71))
    draw.text((60, 320), "curiosity.", fill=PAPER, font=font(2, 71))
    draw.rectangle((60, 456, 64, 527), fill=BLUE)
    draw.text((83, 455), "AUSBILDUNG 2027", fill="#b4c7ff", font=font(1, 18))
    draw.text((83, 492), "Fachinformatiker für Anwendungsentwicklung", fill=PAPER, font=font(4, 24))
    save(card, "portfolio")

    card, draw = base("CASE STUDY / DATA + WEB")
    draw.text((60, 147), "IGNIS.", fill=PAPER, font=font(7, 108))
    draw.text((63, 292), "Making satellite observations", fill=PAPER, font=font(4, 28))
    draw.text((63, 330), "understandable.", fill=PAPER, font=font(2, 39))
    draw.text((63, 438), "PYTHON · DATA WORKFLOWS · UI", fill="#b4c7ff", font=font(0, 16))
    draw.text((63, 476), "Working prototype / Public pilot", fill=MUTED, font=font(4, 20))
    draw.rectangle((620, 125, 1140, 514), fill="#192029", outline="#454c5c", width=1)
    placed(card, "project-ignis-current.webp", (625, 131, 510, 378))
    save(card, "ignis")

    card, draw = base("CASE STUDY / MODELLING + SYSTEMS")
    draw.text((60, 147), "ORION.", fill=PAPER, font=font(7, 108))
    draw.text((63, 292), "From original geometry", fill=PAPER, font=font(4, 28))
    draw.text((63, 330), "to clear interaction.", fill=PAPER, font=font(2, 39))
    draw.text((63, 438), "BLENDER · ARMA REFORGER · UI", fill="#b4c7ff", font=font(0, 16))
    draw.text((63, 476), "Aircraft model / In development", fill=MUTED, font=font(4, 20))
    placed(card, "orion-aircraft.webp", (610, 130, 550, 380))
    save(card, "orion")


if __name__ == "__main__":
    main()
