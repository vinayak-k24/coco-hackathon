# AGENTS.md — NexaFactory Development Rules

## General

- Preserve existing functionality when modifying UI.
- Do not rewrite completed sections unless explicitly instructed.
- Inspect the existing implementation before making changes.
- Reuse existing components, utilities, tokens, APIs, and data sources.
- Modify the smallest reasonable set of files.
- Do not refactor unrelated code.
- Do not replace working components simply because another implementation is easier.
- Use responsive flex/grid/container layouts instead of arbitrary fixed positioning.
- Run typecheck after meaningful changes (`npx tsc --noEmit`).
- After implementation, report: changed files, components changed, data/API changes, typecheck status, and assumptions.

## Design

NexaFactory uses a clean enterprise SaaS visual language:

- Inter font throughout.
- Blue/white industrial AI aesthetic.
- Compact but breathable layouts.
- Strong visual hierarchy (800 hero → 700 headings → 600 controls → 500 metadata → 400 body).
- Subtle borders and soft blue-gray shadows.
- Rounded cards 10–16px.
- Minimal decoration. No heavy shadows. No excessive gradients/glassmorphism.

### Colors

| Token | Hex |
|-------|-----|
| Primary blue | `#1677E8` |
| Navy | `#172B4D` |
| Dark navy | `#102A4C` |
| Body | `#52677D` |
| Muted | `#8495A7` |
| Success | `#18B276` |
| Warning | `#F2A51A` |
| Critical | `#FF4D5A` |
| Border | `#E2EBF2` |
| Divider | `#E7EEF4` |
| Background | `#F7FBFF` |

### Typography weights

| Weight | Usage |
|--------|-------|
| 400 | Body copy |
| 500 | Secondary text / metadata |
| 600 | Controls / navigation / buttons |
| 700 | Card headings / important values |
| 800 | Major hero headings only |

## Data-Driven UI

- Database/source data is the source of truth.
- Never hardcode values taken from screenshots.
- Never invent fake production data to make the UI look complete.
- Inspect the existing DB/schema/API before implementing data-dependent UI.
- If a field does not exist in the DB/backend, still build the intended UI structure.
- Do not silently fabricate permanent data for missing backend fields.
- Record every missing field, relationship, endpoint, calculation, or backend capability in `docs/data-backend-requirements.md`.
- Clearly distinguish: (1) existing data, (2) derivable data, (3) missing data, (4) temporary UI/mock values.
- Prefer derived values when they can reliably be calculated from existing source data.
- UI development should not be blocked because the final backend field is not yet available.
- When necessary, use a clearly isolated temporary adapter/mock/placeholder.
- Temporary data must be easy to remove or replace later.
- Do not make fake data look like confirmed production data.

## Loading / Error / Empty States

- Handle loading, error, empty, and healthy zero-data states separately.
- Zero data is not automatically an error.
- Alerts and recommendations are separate concepts.
- Do not show "healthy empty" states while data is still loading.

## Backend Requirement Tracking

- Whenever UI work exposes a missing DB field, API endpoint, aggregation, or backend capability, add it to `docs/data-backend-requirements.md`.
- Do not redesign the UI around current backend limitations unless explicitly requested.
- The intended finalized UI/product model drives future backend requirements.
- Update the requirements document as the UI evolves.

## Command Center

- Build progressively section by section.
- When a section is marked COMPLETE, do not modify it unless explicitly requested.

## Project Context

- Database: PDM (Snowflake). Schemas: RAW, CORE, ANALYTICS, ML, APP, SEARCH.
- 3 factories: Pune, Chennai, Coimbatore. Currency: INR (₹).
- 50 assets, 11 lines, 20 products, 8 customers, 20 suppliers.
- See `.cortex/cortex.md` for full schema reference.
- See `.cortex/claude.md` for project architecture and API spec.
