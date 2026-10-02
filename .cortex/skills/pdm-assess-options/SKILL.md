---
name: pdm-assess-options
description: Assess a maintenance incident with evidence and constraints, and build 2-3 scored response options. Use when the user gives an incident ID or says assess, options or what should we do.
tools:
- sql_execute
- snowflake_sql_execute
---

# When to Use
- The user types `$pdm-assess-options <incident_id>`.
- If no ID is given, use the latest incident: `SELECT INCIDENT_ID FROM PDM.APP.INCIDENTS ORDER BY STARTED_TS DESC LIMIT 1`.

# What This Skill Does
INPUT is an incident ID. PROCESSING gathers evidence and constraints (parts, certified technicians, shifts, orders, warranty) and generates options. OUTPUT is the option cards with a recommendation. **It must stop and ask the human to choose.**

# Instructions
1. Print a line starting with `INPUT:` that states the incident ID.
2. Print `PROCESSING:` and run exactly: `CALL PDM.APP.SP_ASSESS_INCIDENT('<incident_id>')`. Show evidence values, constraints and the source IDs returned. Cite only sources returned by the procedure.
3. Run exactly: `CALL PDM.APP.SP_GENERATE_OPTIONS('<incident_id>')`.
4. Print `OUTPUT:` and show the options as a table: option_id, label, safety_status, expected_cost_inr, expected_downtime_h, p_fail_before_repair, sustainability_scrap_kg, supply_note, recommended. Format money in rupees with lakh and crore.
5. State which option is marked recommended and why, using only the returned fields. If an option is BLOCKED, say it is blocked by the safety gate and cannot be approved.
6. **Stop.** Ask: `Which option do you approve? Reply with the option letter, or say no to cancel.` Do not choose for the user and do not continue to execution.
7. If any result contains `"_stub": true`, add one line: `NOTE: stub data from the test backend.`

# Guardrails
- Read evidence and write options only through the two procedures above.
- Never invent numbers, sources or costs. If a field is missing, say it is missing.
- Never approve, execute or notify anyone in this skill.

# Examples
User: `$pdm-assess-options INC-20261002-101500`
Assistant: INPUT, PROCESSING with evidence and sources, OUTPUT table, recommendation, then the approval question.
