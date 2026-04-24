# Repository Guidelines

## Project Structure & Module Organization
This repository is a self-contained frontend app with no build framework or package manifest. The entrypoint is [`app.js`](./app.js), which bootstraps the controller layer. Core behavior lives in root modules such as `controller-*.js`, `model.js`, and the small shared stores `*-store.js`. UI-specific logic is split under [`ui/`](./ui), while [`tests/run.mjs`](./tests/run.mjs) contains the Node-based verification harness. Static assets and visual reference images live at the repository root, including `index.html`, `styles.css`, `favicon.svg`, and the `*.png` screenshots.

## Build, Test, and Development Commands
- `node local-server.cjs`: starts the local preview server on `http://127.0.0.1:4173`.
- `node dev-server.cjs`: starts the same preview server on `4173` and `4174` for side-by-side checking.
- `node tests/run.mjs`: runs the repository's assertions against the model, UI modules, and HTML structure.

There is no dedicated build step; changes are served directly from source files.

## Coding Style & Naming Conventions
Use modern ES modules, 2-space indentation, semicolons, and double quotes, matching the existing codebase. Prefer small, focused modules and keep filenames descriptive. Current naming patterns are:
- `controller-*.js` for orchestration helpers
- `ui/*.js` for presentation and DOM helpers
- `*-store.js` for shared state holders
- `tests/run.mjs` for scripted verification

## Testing Guidelines
Tests use plain Node `assert` rather than a framework. Add coverage by extending [`tests/run.mjs`](./tests/run.mjs) with small, named checks that describe behavior. Keep assertions focused on exported helpers, generated state, and stable HTML/text markers. Run the test file directly after changes that affect rendering, ranking, or state transitions.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit messages, often in Spanish, and usually describes one logical change at a time, for example: `Separar render de topics` or `Corregir bootstrap y tema`. Keep PRs narrow, explain what changed, and include screenshots when the UI changes. If a change affects layout or mobile behavior, note the affected view and the validation command you ran.

## Agent-Specific Instructions
Avoid introducing new tooling unless necessary. Prefer editing the existing root modules and `ui/` helpers rather than adding abstraction layers. When changing behavior, update or extend `tests/run.mjs` so the repository keeps a fast, deterministic check.
