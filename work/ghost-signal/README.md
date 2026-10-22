# GHOST SIGNAL

An original browser narrative and signal-routing prototype by David Khaliqi. A personal fan project inspired by Cyberpunk 2077 and dedicated to CD PROJEKT RED. It is not affiliated with, commissioned by, or endorsed by the studio.

## Run locally

Serve the portfolio repository with a normal static HTTP server, then open `/work/ghost-signal/`. The page uses local fonts from `/fonts.css`. No package installation, API key, build step, or external service is required.

## Structure

- `index.html`: mission brief, accessible SVG route map, meter semantics, project case study, and legal links.
- `ghost-signal.css`: standalone responsive styling, keyboard focus, and reduced-motion behavior.
- `ghost-signal.js`: stage content, pure state transitions, deterministic ending rules, and DOM rendering.

The script is an ES module. `createState`, `chooseRoute`, `getEnding`, `STAGES`, and `ENDINGS` are exported so the story model can be verified separately from the browser interface. Browser setup is guarded with `typeof document` for that purpose.

## State and outcomes

A run begins at 12 exposure and 72 integrity. There are three stages and three choices per stage. A valid choice advances exactly one stage and records the chosen node. Each metric is clamped to 0–100 after each choice. The UI shows the same state through its graph, route summary, meters, log, and final debrief.

Ending precedence:

1. Exposure at least 65 → `traced`.
2. Otherwise, integrity at least 85 → `complete`.
3. Otherwise, integrity below 58 → `fragment`.
4. Otherwise → `quiet`.

All 27 routes have been enumerated: 5 traced, 6 complete, 5 fragment, and 11 quiet. There are no random outcomes or timers. Invalid inputs and further choices after the third stage leave state unchanged. Replay starts a new run; reset returns to the mission brief. The browser retains no progress after reload.

## Accessibility and scope

Choices are native buttons with visible focus. Stage headings receive focus as choices advance, and a polite status region announces state changes. Meters have explicit labels, and the route is written in text alongside the SVG. The demo is untimed and respects reduced-motion preferences.

The network is fictional. No real systems are accessed. All narrative text and interface artwork in the prototype are original; no studio logos, character art, or game assets are included.
