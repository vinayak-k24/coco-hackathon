---
name: pdm-execute-recover
description: Execute the approved response option for a maintenance incident, verify recovery and return to guard mode. Use only after a human has chosen an option.
tools:
- sql_execute
- snowflake_sql_execute
---

# When to Use
- The user types `$pdm-execute-recover <incident_id>` after choosing an option in `$pdm-assess-options`.

# What This Skill Does
INPUT is an incident ID with a human-approved option. PROCESSING executes the actions and verifies recovery. OUTPUT shows the actions, before and after metrics, and that the system is back in guard mode. **It refuses to run without a recorded human approval.**

# Instructions
1. Print `INPUT:` with the incident ID and the option the user chose in this conversation.
2. Check approval: `SELECT STATE, CHOSEN_OPTION, APPROVED_BY FROM PDM.APP.INCIDENTS WHERE INCIDENT_ID = '<incident_id>'`.
3. If there is no recorded approval, show the chosen option and ask the user to type exactly `APPROVE <option letter>`. Wait for that reply. Only after it, run: `CALL PDM.APP.SP_RECORD_APPROVAL('<incident_id>', '<option>', CURRENT_USER())`. If the result has an `error` field (for example a blocked option), show it and stop.
4. Print `PROCESSING:` and run exactly: `CALL PDM.APP.SP_EXECUTE_OPTION('<incident_id>')`. If it returns an `error`, show it and stop. Show each action with its status.
5. Run exactly: `CALL PDM.APP.SP_VERIFY_RECOVERY('<incident_id>')`. Show before and after metrics side by side.
6. Run exactly: `CALL PDM.APP.SP_RETURN_TO_GUARD('<incident_id>')`.
7. Print `OUTPUT:` with a short summary: actions completed, metrics before and after, and the mode (guard, with heightened watch).
8. If any result contains `"_stub": true`, add one line: `NOTE: stub data from the test backend.`

# Guardrails
- Never execute without a recorded approval row and an explicit `APPROVE` reply from the user in this conversation.
- Never approve for the user, never choose a BLOCKED option, and never stop or derate a machine by any means other than the procedures above.
- Report procedure errors exactly and stop.

# Examples
User: `$pdm-execute-recover INC-20261002-101500`
Assistant: asks for `APPROVE B` if not yet recorded; then runs the steps and prints the OUTPUT summary.
