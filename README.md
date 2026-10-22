# David Khaliqi — Worlds Worth Building

A static personal portfolio with an Edgerunners-inspired visual direction and **GHOST SIGNAL**, an original interactive narrative prototype dedicated to CD PROJEKT RED.

## Pages

- `/` — portfolio, selected projects, cybersecurity studies, about and contact.
- `/work/ghost-signal/` — playable three-stage mission and design/engineering notes.
- `/work/ignis/` and `/work/orion/` — existing project case studies.
- `/cybersecurity/` — the six existing training case studies.
- `/cv/` and `/cv/en/` — German and English CV.
- `/impressum/` and `/datenschutz/` — existing legal pages.

## Local development

No dependency installation or build step is required. Serve the repository **root**, since the portfolio uses root-relative asset paths:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. The original publishing target is GitHub Pages at `https://kletterrn.github.io/`.

## Presentation

- `edgerunners.css` and `edgerunners.js` own the new home page.
- `edgerunners-legacy.css` supplies screen-only visual continuity for the existing documents. Their content and interaction hooks are preserved, and their original print styling remains active.
- Fonts, artwork and other assets are served locally.
- The ambient-motion toggle is session-local in memory. System reduced-motion preferences take precedence.
- The new pages do not use cookies, browser storage, analytics, accounts, third-party APIs or runtime dependencies. Email copying uses the browser Clipboard API and displays a manual-copy fallback when access is unavailable.

## GHOST SIGNAL

See [the project notes](work/ghost-signal/README.md). Three decisions produce 27 possible paths and four deterministic endings. Route choices update exposure, integrity, the SVG path, the event log and the final scene. Replay and reset start fresh.

This is an independent fan-made portfolio concept, not commissioned by, affiliated with or endorsed by CD PROJEKT RED. Its story and interface graphics are original. It is a browser narrative prototype, not a Cyberpunk 2077 mod.

## Artwork

The city backdrop is official Cyberpunk: Edgerunners 2 promotional artwork, credited in the home-page footer. Source details are in [the artwork credit](assets/edgerunners-art-credit.txt). The file was converted to WebP without visual editing.
