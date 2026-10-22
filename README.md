# Portfolio

David Khaliqi’s static portfolio, published through GitHub Pages at
https://kletterrn.github.io/.

## Editing and publishing

Edit the HTML pages and the root-level CSS/JavaScript source files. The site does
not need a client-side framework or package installation to run. GitHub Pages
publishes the checked-in files from `main`.

CSS delivery is generated from `scripts/styles-manifest.json`. That manifest
records the exact stylesheet order for each page. After changing styles or
JavaScript, run:

```bash
python scripts/build_styles.py --write
python scripts/refresh_asset_versions.py
python scripts/build_styles.py --check
```

Commit both source changes and the generated files under `assets/styles/`.
Each page loads its shared font stylesheet and one ordered CSS bundle. Do not
edit the generated bundles directly. Add new pages or stylesheet sources to the
manifest before rebuilding.

## Generated assets

The following scripts use the existing local project assets.
They do not fetch dependencies or remote content:

```bash
# Requires fontTools and Python Brotli or Node.js.
python scripts/build_fonts.py

# Requires Pillow.
python scripts/build_social_cards.py

```

The original fonts and their licenses remain in `assets/fonts/`; pages use the
smaller WOFF2 subsets. Re-run the stylesheet/version commands after rebuilding
fonts. Keep `assets/cv.json` and `assets/cv-en.json` in sync with their
corresponding HTML CVs when editing their content.

The current Ignis screenshot is a dated capture of the public pilot. Preserve
its data-status context and update the caption if replacing it. Project status
and validation boundaries should stay aligned with the linked repositories.
