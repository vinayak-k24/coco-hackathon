# Adding the three pdm skills to CoCo CLI

## 0. Check your account first
CoCo CLI is **not available on standard Snowflake trial accounts**. You need a paid account or the dedicated CoCo CLI trial (https://signup.snowflake.com/cortex-code), or whatever account the hackathon gave you. The user needs the SNOWFLAKE.CORTEX_USER (or CORTEX_AGENT_USER) database role and the Snowflake CLI (`snow`) installed.

## 1. Install and connect
- macOS, Linux, WSL: `curl -LsS https://ai.snowflake.com/static/cc-scripts/install.sh | sh`
- Windows (PowerShell): `irm https://ai.snowflake.com/static/cc-scripts/install.ps1 | iex`
- Run `cortex`. The setup wizard lets you pick or create a connection (stored in `~/.snowflake/connections.toml`, shared with the Snowflake CLI).
- First request to test: `What can I do with Cortex Code?`

## 2. Put the kit in your project
Copy this folder's contents into your project root so you have:
```
.cortex/skills/pdm-detect/SKILL.md
.cortex/skills/pdm-assess-options/SKILL.md
.cortex/skills/pdm-execute-recover/SKILL.md
snowflake/00_incident_backend_stub.sql
docs/COCO_LOG.md
```
Start `cortex` from the project root. (CoCo also reads `.claude/skills/` if you prefer that folder.)

## 3. Create the backend the skills call
The skills only call stored procedures; they do not contain logic. Load the stub backend:
- In CoCo: `Run @snowflake/00_incident_backend_stub.sql and fix any errors`, or
- In a shell: `snow sql -f snowflake/00_incident_backend_stub.sql`

The SQL was written without a live account, so it is **untested**. Expect to fix small errors; letting CoCo do that is a good entry for `docs/COCO_LOG.md`.

## 4. Check the skills loaded
In the CoCo session type `$$` (lists skills) or `/skill list`. You should see `pdm-detect`, `pdm-assess-options`, `pdm-execute-recover`. If not: the folder name must equal the `name:` in the frontmatter, the file must be named exactly `SKILL.md`, and you must start CoCo from the project root. Tool names in `tools:` are lowercase and case-sensitive (unrecognised ones are skipped silently).

## 5. Run the flow
```
CALL PDM.APP.SP_RESET_DEMO();        -- before every take
$pdm-detect S1
$pdm-assess-options <incident_id>    -- stops and asks which option to approve
$pdm-execute-recover <incident_id>   -- asks you to type APPROVE <letter>, then runs
```

## 6. Replace the stubs with real logic (do this before recording)
Every stub result carries `"_stub": true` and the skills print a note when they see it. Replace, in this order, by asking CoCo to rewrite each procedure against your real tables:
1. `SP_SCORE_ASSETS` and `SP_START_SCENARIO`: read the scoring output (`PRED_ASSET_SCORES`) and open the incident from real scores.
2. `SP_ASSESS_INCIDENT`: query real evidence (sensor features, parts stock, certifications, shifts, orders, warranty) and return source IDs from Cortex Search.
3. `SP_GENERATE_OPTIONS`: compute option scores (safety gate, cost, production, customers, sustainability) from SQL.
4. `SP_EXECUTE_OPTION`, `SP_VERIFY_RECOVERY`, `SP_RETURN_TO_GUARD`: write real work orders, supply requests and watch state, and compute before/after metrics.
Keep the same procedure names and return shapes so the skills do not change. Do not show stub values as results in the video.

## 7. Before recording
- Run all three skills at least five times; reset between runs.
- Use large terminal fonts and hide account identifiers.
- If CoCo is in plan mode it asks you to confirm every action; switch modes before recording (check `/help` for the toggle) and keep a backup run.
- Keep the warehouse on auto-suspend to limit credit use.
