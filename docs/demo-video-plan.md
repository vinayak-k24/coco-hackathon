# NexaFactory demo video: Google Vids production plan (team SnowFlake Legends)

English only. Target 4:40 (limit 5:00). The form requires an end-to-end workflow run through CoCo CLI, screen-recorded, with Input, Processing and Output, at least one fully working workflow and 2-3 modular skills. The CoCo scenes are kept short and the **What-If Scenario Builder is the centrepiece**: build a scenario, run it, read the AI insights, then execute the plan there.

## 1. Rule that keeps the video honest
Every sentence must match something you actually show. If a feature is not working at recording time, delete its scene and its sentence. Say "synthetic data" once near the end.

## 2. The three CoCo CLI skills (from `pdm_coco_skills_kit/.cortex/skills/`)

All three skills live in the project and are loaded automatically when CoCo starts from the project root. They only call stored procedures in `PDM.APP` — no logic lives in the skills themselves. The backend stub (`snowflake/00_incident_backend_stub.sql`) must be deployed first.

### Skill 1: `$pdm-detect` (detect and open incident)
- **Trigger:** `$pdm-detect S1`
- **INPUT:** Scenario ID (only S1 available in the stub)
- **PROCESSING:** Calls `SP_START_SCENARIO('S1')` → opens incident on ASSET_002 (CNC-02), bearing_wear, severity 0.80, 25.4 hours to failure. Then calls `SP_SCORE_ASSETS()` → scores 16 assets, 1 alert raised.
- **OUTPUT:** Incident table (incident_id, asset_name CNC-02, fault bearing_wear, severity 0.80, hours_to_failure 25.4). Ends with: "Next: `$pdm-assess-options <incident_id>`"
- **Tables written:** `INCIDENTS`, `INCIDENT_EVENTS`, `WATCH_STATE` (mode changes to INCIDENT)

### Skill 2: `$pdm-assess-options` (evidence, constraints, scored options)
- **Trigger:** `$pdm-assess-options <incident_id>`
- **INPUT:** Incident ID
- **PROCESSING:** Calls `SP_ASSESS_INCIDENT()` → returns evidence (RMS 5.79 mm/s vs baseline 1.59, kurtosis 7.50, crest factor 5.41, bearing outer temp 68.1C), constraints (bearing stock 1, grease stock 0, no night-shift certified tech, 3 orders at risk worth Rs 4.44 crore, warranty lubrication exclusion CON_002), sources (SOP-001, SOP-002, CON_002, WO_0090). Then calls `SP_GENERATE_OPTIONS()` → three options:

| Option | Label | Safety | Cost (Rs) | Downtime | P(fail) | Scrap (kg) | Supply note | Recommended |
|---|---|---|---|---|---|---|---|---|
| A | Stop now and repair tonight (technician call-out) | OK | 3,42,000 | 6.0 h | 0.00 | 0 | Only substitute grease arrives in time: warranty risk | No |
| B | Run at reduced load, repair on Afternoon shift | OK | 2,96,000 | 4.0 h | 0.18 | 410 | Inter-plant grease transfer arrives before repair | **Yes** |
| C | Keep running normally until grease PO arrives | **BLOCKED** | 14,20,000 | 22.0 h | 0.95 | 1800 | PO arrives after predicted failure | No |

- **OUTPUT:** Options table with recommendation. Then **stops and asks:** "Which option do you approve? Reply with the option letter, or say no to cancel."
- **Critical:** Does NOT continue to execution. Human must choose.

### Skill 3: `$pdm-execute-recover` (approve, execute, verify, guard)
- **Trigger:** `$pdm-execute-recover <incident_id>`
- **INPUT:** Incident ID + the option the user chose
- **PROCESSING (approval gate):** Checks `INCIDENTS` for recorded approval. If none, asks user to type exactly `APPROVE B`. Calls `SP_RECORD_APPROVAL()`. Blocked options are rejected.
- **PROCESSING (execution):** Calls `SP_EXECUTE_OPTION()` → 5 actions:
  1. NOTIFY_TECHNICIAN → TECH_011 → ACKNOWLEDGED
  2. SET_MACHINE_STATE → ASSET_002 → DERATED (option B) or STOPPED (option A)
  3. RESERVE_PARTS → PART_0001 spindle bearing set x1 → RESERVED
  4. SUPPLY_REQUEST → PART_0052 grease, inter-plant transfer → REQUESTED
  5. CREATE_WORK_ORDER → Predictive WO draft for CNC-02 → CREATED
- **PROCESSING (verify):** Calls `SP_VERIFY_RECOVERY()` → before/after metrics:
  - Before: severity 0.80, RMS 5.79 mm/s, risk score 94, orders at risk Rs 4.44 crore
  - After: severity 0.05, RMS 1.62 mm/s, risk score 8, orders at risk Rs 0
- **PROCESSING (guard):** Calls `SP_RETURN_TO_GUARD()` → GUARD mode with heightened watch on ASSET_002 for two shifts
- **OUTPUT:** Summary of all actions, before/after comparison, mode = GUARD

### Reset between takes
```
CALL PDM.APP.SP_RESET_DEMO();
```
Truncates all incident tables and sets WATCH_STATE to GUARD.

### Stub warning
All stub results carry `"_stub": true`. Skills print: `NOTE: stub data from the test backend.` Replace stubs with real computed logic before recording.

## 3. Scene plan and narration (about 430 words; plain text, paste straight into Vids)

| # | Time | On screen | Narration | Clips |
|---|---|---|---|---|
| 1 | 0:00-0:20 | Title card, then problem slide | "Unplanned machine failures cost factories downtime, scrap and missed orders. In our test plant, eighteen failures meant two hundred ninety five hours of downtime and one point two eight crore rupees. This is NexaFactory, built by team SnowFlake Legends on Snowflake with CoCo CLI." | V01, V02 |
| 2 | 0:20-0:40 | Command Center, press Listen | "The Command Center shows all sixteen monitored machines in guard mode. Press listen and the shift briefing is read aloud. Every number is checked against a verified facts record before it is spoken." | V03 |
| 3 | 0:40-1:05 | CoCo CLI: `$pdm-detect S1` | "Now the CoCo CLI workflow. Input: we type dollar pdm detect S1 to trigger a bearing fault on CNC-02. Processing: the scenario starts, readings stream into Snowflake, and sixteen machines are scored. Output: an incident opens, severity zero point eight, twenty five hours to failure." | V04 |
| 4 | 1:05-1:35 | CoCo CLI: `$pdm-assess-options` | "Skill two assesses the incident. It gathers the evidence, RMS vibration at five point eight versus baseline one point six, kurtosis seven point five. It checks constraints: one bearing in stock, no grease, no certified night shift technician, three orders at risk worth four point four crore rupees, and a warranty exclusion. Three options come back scored on safety, cost, downtime, failure probability and sustainability. Option C is blocked by the safety gate. The AI recommends option B and stops to ask." | V05 |
| 5 | 1:35-1:45 | Approval in terminal: type `APPROVE B` | "We approve option B, run at reduced load and repair on the afternoon shift. Skill three will not run without this recorded approval." | V06 |
| 6 | 1:45-2:10 | CoCo CLI: `$pdm-execute-recover` | "Skill three executes. Five actions: notify the technician, derate the machine, reserve the bearing, place the inter-plant grease transfer, and create the work order. Recovery is verified: risk drops from ninety four to eight, orders at risk fall to zero. The system returns to guard mode with heightened watch." | V07 |
| 7 | 2:10-2:22 | Vision Center check (optional) | "Before repair starts, the Vision Center checks that the lock and tag are visible and the area is clear. A human confirms." | V08 |
| 8a | 2:22-2:42 | What-If: build the scenario | "Now the part we are most proud of, the What-If Scenario Builder. Planners build a scenario here. Pick a scenario type, or describe it in plain words. For example, the grease shipment slips five days, demand rises twenty percent, and only one certified technician is available." | W1 |
| 8b | 2:42-2:57 | What-If: run and results | "Run the simulation. Cost, downtime, late orders and safety risk update for each choice, using the same engine that scored the incident options." | W2 |
| 8c | 2:57-3:27 | What-If: AI insights | "The AI insights panel explains what drives the result, with sources. Here the shipment delay and the missing night shift technician are the main risks. It recommends moving the repair to the afternoon shift and requesting an inter plant transfer of the grease, and it shows the cost of waiting." | W3 |
| 8d | 3:27-3:52 | What-If: approve and execute | "Now execute. We approve the recommended plan. The transfer request is placed, the work order is scheduled and the technician is notified. The risk and the orders at risk fall on screen." | W4 |
| 9 | 3:52-4:04 | Asset 360 for CNC-02 | "Asset 360 shows CNC-02 end to end, with health, sensors, maintenance history and rupee impact." | V09 |
| 10 | 4:04-4:24 | Sustainability slide | "Sustainability matters too. In our data, machines running degraded produced eighteen percent of all scrap, about twelve tonnes in forty five days. Acting at first detection could avoid up to nine and a half tonnes. Energy is tracked, but we do not claim savings there." | V10 |
| 11 | 4:24-4:39 | End card | "NexaFactory moves from alert to approved action to verified recovery, governed inside Snowflake. All data is synthetic, and real plant systems are the next step. Thank you." | V11 |

**Cut order if time or features run short:** V08 (Vision), then V09 (Asset 360), then V03 (voice brief). Never cut scenes 3 to 6 (the CoCo workflow) or 8a to 8d (What-If).

## 4. Exact terminal commands for recording

Before every take:
```
CALL PDM.APP.SP_RESET_DEMO();
```

Scene 3 (Skill 1):
```
$pdm-detect S1
```
Expected output: INPUT line, PROCESSING line (16 scored, 1 alert), OUTPUT table with INC-XXXXXXXX-XXXXXX, CNC-02, bearing_wear, DETECTED, 0.80, 25.4. Copy the incident_id.

Scene 4 (Skill 2):
```
$pdm-assess-options INC-XXXXXXXX-XXXXXX
```
Expected output: evidence block (RMS, kurtosis, crest factor, bearing temp), constraints block (stock, technicians, orders, warranty), options table (A/B/C with scores), recommendation B, then the approval question.

Scene 5 (Approval — still in skill 2 or start of skill 3):
```
B
```
or when skill 3 asks:
```
APPROVE B
```

Scene 6 (Skill 3):
```
$pdm-execute-recover INC-XXXXXXXX-XXXXXX
```
Expected output: approval check, 5 actions with status, before/after metrics, GUARD mode.

## 5. Clips to add in Google Vids

| ID | Clip | Scene | Length | Source | What must be visible |
|---|---|---|---|---|---|
| V01 | Title card | 1 | 5 s | Exported image | NexaFactory, team SnowFlake Legends, Problem 03 |
| V02 | Problem slide | 1 | 15 s | Slide 2 as PNG | The four stat cards (18 failures, 295 h, Rs 1.28 Cr) |
| V03 | Command Center, press Listen | 2 | 20 s | Screen recording with system audio | 16 assets healthy, guard-mode chip, brief playing |
| V04 | `$pdm-detect S1` | 3 | 25 s | Terminal recording | The command, SP_START_SCENARIO output, SP_SCORE_ASSETS output, incident table |
| V05 | `$pdm-assess-options` | 4 | 30 s | Terminal recording | Evidence values, constraints, sources, three-option table, recommendation, approval question |
| V06 | `APPROVE B` | 5 | 10 s | Terminal recording | The question, typing APPROVE B, approval confirmed |
| V07 | `$pdm-execute-recover` | 6 | 25 s | Terminal recording | 5 actions with status, before/after metrics, GUARD mode |
| V08 | Vision Center lockout check (optional) | 7 | 12 s | Browser recording | Lock and tag visible, area clear, human confirmation |
| W1 | What-If: build the scenario | 8a | 20 s | Browser recording | Scenario type selected, sliders or plain-language text entered |
| W2 | What-If: run and results | 8b | 15 s | Browser recording | Run pressed, results cards for each option update |
| W3 | What-If: AI insights | 8c | 30 s | Browser recording | Drivers, cited sources, recommendation, cost of waiting |
| W4 | What-If: approve and execute | 8d | 25 s | Browser recording | Approval step, execution list, risk and orders at risk falling |
| V09 | Asset 360 for CNC-02 | 9 | 12 s | Browser recording | Health, sensors, history, impact |
| V10 | Sustainability slide | 10 | 20 s | Slide 9 as PNG | The three green numbers |
| V11 | End card | 11 | 15 s | Slide 10 as PNG | Thank you |

**Total:** 20 + 20 + 25 + 30 + 10 + 25 + 12 + 90 + 12 + 20 + 15 = 279 s = 4:39.

## 6. What the What-If clips need to show (so the narration is true)

- **W1:** a scenario type (machine failure, delayed maintenance, inventory shortage, demand surge, supplier disruption) and parameters (repair delay, spare availability, demand change, technician availability, supplier lead time, overtime). Your existing builder has these. The plain-language box is the extra: the AI turns the sentence into parameters, the app checks the ranges, and SQL calculates.
- **W2:** results per option from the same engine as the incident options (cost, downtime, late orders, safety). These should match the shape of `INCIDENT_OPTIONS` — same columns.
- **W3 (to build):** an AI insights panel written from the computed results only, listing the drivers, the sources it used, a recommendation and the cost of waiting. Do not show numbers the engine did not return.
- **W4 (to build):** an "Approve and execute" button. It must ask for confirmation, then call the same procedures as the CoCo skills (`SP_RECORD_APPROVAL`, `SP_EXECUTE_OPTION`, `SP_VERIFY_RECOVERY`, `SP_RETURN_TO_GUARD`) and show an execution list (supply request, work order, technician notified) with status, then refresh risk and orders at risk. Write an audit entry to `INCIDENT_EVENTS`.

If W3 or W4 is not finished by recording time, delete those scenes and their narration.

## 7. Backend setup before recording

### Deploy the stub
```
snow sql -f pdm_coco_skills_kit/snowflake/00_incident_backend_stub.sql
```
Or in CoCo: `Run @snowflake/00_incident_backend_stub.sql and fix any errors`

### Verify skills loaded
In CoCo type `$$` or `/skill list`. You should see: `pdm-detect`, `pdm-assess-options`, `pdm-execute-recover`.

### Replace stubs with real logic (before recording)
Priority order:
1. `SP_SCORE_ASSETS` and `SP_START_SCENARIO` — read from `PRED_ASSET_SCORES` and real sensor data
2. `SP_ASSESS_INCIDENT` — query real evidence (sensor features, parts stock, certifications, shifts, orders, warranty) and return source IDs from Cortex Search
3. `SP_GENERATE_OPTIONS` — compute option scores from SQL (safety gate, cost, production, customers, sustainability)
4. `SP_EXECUTE_OPTION`, `SP_VERIFY_RECOVERY`, `SP_RETURN_TO_GUARD` — write real work orders, supply requests and watch state

Keep the same procedure names and return shapes so the skills do not change.

### Tables created by the stub
- `PDM.APP.INCIDENTS` — one row per incident
- `PDM.APP.INCIDENT_OPTIONS` — options per incident (A/B/C)
- `PDM.APP.INCIDENT_ACTIONS` — execution steps per incident
- `PDM.APP.INCIDENT_EVENTS` — audit log
- `PDM.APP.WATCH_STATE` — current system mode (GUARD/INCIDENT/HEIGHTENED_WATCH)

## 8. Recording checklist

- 1920x1080, browser zoom 110-125 percent, terminal font at least 18 pt, notifications off, other tabs closed.
- Hide account identifiers and keys (use environment variables; blur the terminal prompt if needed).
- **Reset before every take:** `CALL PDM.APP.SP_RESET_DEMO();`
- Run each skill and the What-If flow five times before recording.
- Record each scene separately, two or three takes each; keep one full uninterrupted run as backup.
- Replace dashboard hard-coded dollar figures with computed rupee values, or label them sample.
- Confirm the English voice brief plays and is captured; otherwise show the brief text and narrate over it.
- Hold each UI shot still for at least 3 seconds; do not narrate over typing.
- Add overlays: INPUT, PROCESSING, OUTPUT on the terminal clips; "Human approval" on V06 and W4; "Synthetic data" small on every scene.
- If any procedure still returns `"_stub": true`, either replace it or acknowledge "stub backend" in the narration.

## 9. Steps in Google Vids (from Google's help pages; menus can change)

1. Create a new video (16:9) in Google Vids.
2. Create one scene per row of the scene table and set each length.
3. Upload your recordings, slide PNGs and any vision clips; drop each into its scene.
4. Add the overlays above.
5. Open the Scripts or Voiceover panel, paste each scene's narration, then record yourself or generate an AI voiceover. AI voiceover takes plain text only (no emojis or symbols) and is English-only. Check "NexaFactory", "CoCo", "Snowflake", "crore".
6. Keep the voice brief clip's original audio.
7. Trim to 4:40 or less and play it once with headphones.
8. File > Download as MP4, or Export to Drive. Set sharing to anyone with the link and test it in a private window. If you export to YouTube, change Private to Unlisted.
9. Paste the link into the submission form.

## 10. CoCo CLI build log

Log every CoCo interaction in `pdm_coco_skills_kit/docs/COCO_LOG.md` — judges can read it.

| Date | Prompt given to CoCo | What CoCo produced | What we changed |
|---|---|---|---|
| 2 Oct | "Run @snowflake/00_incident_backend_stub.sql and fix any errors" | | |
| | `$pdm-detect S1` | | |
| | `$pdm-assess-options <id>` | | |
| | `$pdm-execute-recover <id>` | | |
