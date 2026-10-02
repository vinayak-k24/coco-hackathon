---
name: pdm-detect
description: Start a predictive-maintenance scenario, score the machines and open an incident. Use when the user says detect, start scenario, trigger a fault, or gives a scenario ID such as S1.
tools:
- sql_execute
- snowflake_sql_execute
---

# When to Use
- The user types `$pdm-detect S1` (or asks to start, trigger or detect a fault scenario).
- Only scenario IDs the backend knows are accepted. If the user gives none, use `S1`.

# What This Skill Does
Takes a scenario trigger as INPUT, runs streaming and scoring as PROCESSING, and returns a new incident as OUTPUT. It never decides what to do about the incident; that is the next skill.

# Instructions
1. Print a short line starting with `INPUT:` that states the scenario ID.
2. Run exactly: `CALL PDM.APP.SP_START_SCENARIO('<scenario_id>')`. If the result has an `error` field, show it and stop. Do not retry with other SQL.
3. Print a line starting with `PROCESSING:` and run exactly: `CALL PDM.APP.SP_SCORE_ASSETS()`. Summarise assets scored and alerts raised in one line.
4. Print a line starting with `OUTPUT:` and show the incident as a small table: incident_id, asset_name, fault, state, severity, hours_to_failure.
5. If any result contains `"_stub": true`, add one line: `NOTE: stub data from the test backend.` Never present stub values as model results.
6. End with: `Next: $pdm-assess-options <incident_id>`.

# Guardrails
- Use only the two procedures above. Do not write to any other table and do not invent numbers.
- Do not choose or recommend an action here.
- If a procedure fails, report the error text exactly and stop.

# Examples
User: `$pdm-detect S1`
Assistant: INPUT / PROCESSING / OUTPUT lines, then the incident table and the next-step line.
