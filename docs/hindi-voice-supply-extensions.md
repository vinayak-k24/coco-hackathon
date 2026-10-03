# Section 16: Hindi, Voice and Supply-Chain Extensions

Status: designed 1 Oct 2026. **Build only after the incident flow (section 3b) works end to end.** Cut order if time runs short: (1) spoken replies, (2) voice input, (3) export-order risk chip, (4) inter-plant transfer. Never cut: Hindi templates for the technician notification and the safety warning, and the supply actions inside the options.

## 16.1 Scope decisions (final)
- **Languages: English and Hindi only.** Marathi, Tamil, Telugu, Kannada and others go on the roadmap slide as "via a pluggable language gateway (for example Bhashini)". Do not build them. Do not claim support for 22 languages.
- **Voice: Hindi, push-to-talk, read-and-acknowledge only.** Voice never approves an option and never stops or starts a machine.
- **Supply chain: a mock connector scoped to maintenance-relevant supply** (spares inbound, inter-plant transfer, export commitments at risk). It is **not** a full import/export or trade-compliance system. Say "mock SCM connector; in production this maps to SAP, Oracle or EDI" in the video and deck.

## 16.2 Verified Snowflake facts (from docs, 1 Oct 2026)
- `AI_TRANSLATE(text, source_lang, target_lang [, return_error_details])`. Hindi code `'hi'`. The **only** Indian language in its list is Hindi (no Marathi, Tamil, Telugu, Kannada). Empty source language `''` auto-detects. Supports mixed-language text. Returns NULL on error unless `return_error_details` is TRUE. Up to 100,000 input tokens. Needs `SNOWFLAKE.CORTEX_USER`. The older `SNOWFLAKE.CORTEX.TRANSLATE` is legacy (deprecation planned by end of 2026); use `AI_TRANSLATE`.
- Docs for the older translate function state Cortex functions do not support **dynamic tables**. Assume the same for `AI_TRANSLATE`: call it from stored procedures or the app layer, never inside a Dynamic Table.
- `AI_TRANSCRIBE(TO_FILE('@stage','file'))` transcribes **audio files on a stage**, auto-detects language, speech must **start within the first five seconds**, files up to two hours. Hindi appears in the supported list (the list was truncated in the page I read, so other languages are unconfirmed). Output includes `text` and `audio_duration`. Billing per the docs: about 50 tokens per second of audio with a one-minute minimum, so keep clips short and cache demo transcripts.
- Media AI functions need a stage with server-side encryption and a directory table: `CREATE STAGE ... DIRECTORY=(ENABLE=TRUE) ENCRYPTION=(TYPE='SNOWFLAKE_SSE')`. They are **incompatible with custom network policies**; if the account has one, `AI_TRANSCRIBE` may fail (check in the preflight).
- **Not verified:** the accepted audio formats for `AI_TRANSCRIBE` (convert to 16 kHz mono WAV to be safe and check the docs); any text-to-speech function in Snowflake (none found); browser Hindi speech quality on our devices.

## 16.3 Rules (hard)
1. Safety-critical text (lockout/tagout steps, warnings, "stop", "do not run") comes **only from reviewed Hindi templates**, never live machine translation. If no reviewed template exists, show English and flag it.
2. Asset IDs, part IDs, numbers, units, currency symbols and dates are **protected tokens**: they must appear unchanged in translated output (ASCII digits, `CNC-02`, `₹`, `mm/s`).
3. Always show English alongside Hindi and label machine-translated text "AI अनुवाद, अंग्रेज़ी पाठ देखें" (AI translated, see English).
4. A native Hindi speaker must review every template and glossary entry before the video. All Hindi in this file is a **draft**.
5. Voice commands are limited to the whitelist in 16.7. Anything that changes physical state needs an on-screen confirmation by an authenticated user with the right role.
6. Log every voice interaction (transcript, intent, confidence, action) to `APP.VOICE_LOG`. Do not store audio longer than 7 days; mask nothing silently.
7. No external language or speech service without checking the event T&Cs. Default is Snowflake-native plus the browser.

## 16.4 Data changes (generator patch; keep existing tables byte-identical)
Add a function `build_supply_extensions()` at the **end** of `generate()` in `generate_factory_data.py`, using a **separate RNG** (`np.random.default_rng(seed + 1)`) so the existing 48 tables do not change. After the patch, verify by checksum that files 01-48 are unchanged, except for the added columns listed below. Table count becomes **51**; update every "48 tables" mention (brief, deck, docs).

**Add columns (append at the end; do not alter existing values)**
- `44_purchase_orders`: `Origin_Country`, `Incoterm`, `Is_Import` (bool). Rule: `Is_Import = True` for parts with unit cost over Rs 20,000 or lead time of 21 days or more, **plus both story POs** (`PO_0058` bearing set: origin Germany; `PO_0068` spindle grease: origin Germany). Domestic POs: origin India.
- `46_customer_orders`: `Is_Export` (bool), `Destination_Country`, `Port_Cutoff_Date`, `Export_Docs_Status`. Rule: `Is_Export = True` where `Customer_Tier == "Platinum"`; destination Germany; `Port_Cutoff_Date = Due_Date - 3 days`; docs status "Ready" or "Pending". For the verified L001 orders this makes only **SO-0014 (Bharat Drivetrain, due 7 Oct)** an export order with cut-off **4 Oct**. Quantities, values and due dates stay as in section 6.

**New tables**
- `49_inbound_shipments`: `Shipment_ID`, `PO_ID`, `Part_ID`, `Origin_Country`, `Transport_Mode` (Air/Sea/Road), `Carrier`, `Incoterm`, `Status` (Ordered, In transit, At port, Customs cleared, Out for delivery, Delivered), `Customs_Status`, `ETA_Original`, `ETA_Current`, `Delay_Reason`, `Freight_Cost_INR`. One row for each PO that is Shipped or Approved (8 open POs) and recent imports. Story: `PO_0058` (bearing set 7014, qty 4): In transit, customs pre-clearance filed, **ETA 9 Oct unchanged**. `PO_0068` (grease, qty 10): status Ordered, ETA 5 Oct. Do not change any verified ETA.
- `50_supply_actions_catalog`: `Action_ID`, `Action_Type` (`INTER_PLANT_TRANSFER`, `LOCAL_PURCHASE`, `EXPEDITE_AIR`, `ALTERNATE_SUPPLIER`), `Part_ID`, `Source` (plant or supplier ID), `Qty_Available`, `Lead_Time_Hours`, `Cost_INR`, `OEM_Approved` (bool), `Notes`. Costs and lead times are **synthetic constants set in the generator** and labelled as such. Story rows (use these exact values):

| Part | Action | Source | Lead time | Cost | OEM approved | Note |
|---|---|---|---|---|---|---|
| `PART_0052` spindle grease | `INTER_PLANT_TRANSFER` | `PLANT_02`, qty 3 | 12 h (air courier) | Rs 9,500 | yes | |
| `PART_0052` spindle grease | `LOCAL_PURCHASE` | `SUP_018` (look up the EP2 grease part ID by name "Lithium-complex EP2 grease") | 3 h | Rs 2,000 | **no** | Substitute; lubrication exclusion and warranty risk |
| `PART_0052` spindle grease | `EXPEDITE_AIR` on `PO_0068` | `SUP_010` | ETA 5 Oct -> 2 Oct 12:00 | Rs 18,500 | yes | Too late for same-day repair |
| `PART_0001` bearing set 7014 | `INTER_PLANT_TRANSFER` | `PLANT_02`, qty 2 | 12 h | Rs 9,500 | yes | Buffer for the 5 CNC spindles |

For other parts below their reorder point, generate seeded rows by rule: an inter-plant transfer if another plant holds stock; a local purchase if the part is a consumable.

- `51_inter_plant_stock`: `Plant_ID`, `Part_ID`, `Qty_On_Hand`, `Transfer_Lead_Hours`, `Transfer_Cost_INR`. Seeded random quantities for `PLANT_02` and `PLANT_03`; story overrides: `PART_0052` at `PLANT_02` = 3, `PART_0001` at `PLANT_02` = 2.

Update `validate_data.py`: foreign keys for the new tables, `Port_Cutoff_Date` not after `Due_Date`, and the story rows above exist. Keep 27/27 existing checks green.

## 16.5 Snowflake objects (APP schema unless noted)
- Tables: `USER_PREFS` (user_id, language `'en'|'hi'`), `HINDI_TEMPLATES` (template_key, en_text, hi_text, safety_critical, reviewed_by, reviewed_ts), `GLOSSARY` (en_term, hi_term, keep_english), `TRANSLATION_CACHE` (text_hash, target_lang, translated_text, integrity_ok, created_ts), `VOICE_LOG` (voice_id, user_id, ts, stage_path, transcript, lang_detected, intent, confidence, action_taken), `SUPPLY_REQUESTS` (request_id, incident_id, action_type, part_id, qty, source, cost_inr, eta_ts, status `REQUESTED|IN_TRANSIT|RECEIVED|CANCELLED`, requested_by, approved_by).
- Stage: `APP.VOICE_STAGE` (server-side encrypted, directory table enabled).
- Views: `ANALYTICS.VW_SUPPLY_OPTIONS(part_id, need_by_ts)` returns feasible actions with arrival time, cost and OEM flag; `ANALYTICS.VW_EXPORT_RISK(incident_id)` returns export orders whose projected completion falls after the port cut-off.
- Procedures: `SP_TRANSLATE_TEXT`, `SP_VOICE_TRANSCRIBE`, `SP_VOICE_INTENT`, `SP_GET_SUPPLY_PLAN(incident_id, option_id)`, and updates to `SP_GENERATE_OPTIONS` and `SP_EXECUTE_OPTION`.
- Add to `CFG_POLICY`: `prefer_oem_approved=true`, `export_miss_delay_days=7` (synthetic assumption), `voice_min_confidence=0.75`, `voice_audio_retention_days=7`.

## 16.6 Hindi: how it works
**Static UI:** `react-i18next`, English and Hindi catalogs, key names like `incident.option.title.A`. Persist the choice in `USER_PREFS` through `PUT /api/v1/me/prefs`. Language toggle `EN | हिं` in the top bar. Bundle Noto Sans Devanagari locally. Allow 30-40% longer text in layouts. Keep Rs and Indian digit grouping; in Hindi use "करोड़" and "लाख" (for example "Rs 4.44 करोड़", "Rs 1.78 लाख"). Technician profiles default to Hindi.

**Dynamic text** through `SP_TRANSLATE_TEXT(text, 'hi', context)`:
1. If a reviewed template matches the key, return it.
2. Check `TRANSLATION_CACHE`.
3. If the text is safety-critical and no template exists, return English with a flag; do not translate.
4. Replace protected tokens with placeholders, call `AI_TRANSLATE(text, 'en', 'hi')`, restore tokens, apply glossary replacements.
5. **Integrity check:** every protected token appears exactly once and unchanged; no Devanagari numerals; no new digits. Fail -> return English, flag, log.
6. Store in the cache with `integrity_ok`.
Test placeholder survival in the 16.10 smoke test; if `AI_TRANSLATE` mangles placeholders, fall back to templates only.

**Draft Hindi templates (REVIEW REQUIRED before recording; load into `HINDI_TEMPLATES`)**

| Key | English | Hindi (draft) |
|---|---|---|
| `alert.summary` | {asset}: {fault} detected. Failure expected in about {hours} hours. | {asset}: {fault} पाया गया। लगभग {hours} घंटे में खराबी की आशंका है। |
| `fault.bearing_wear` | Bearing wear | बेयरिंग घिसाव |
| `fault.misalignment` | Shaft misalignment | शाफ्ट संरेखण में गड़बड़ी |
| `fault.overheating` | Motor overheating | मोटर का अधिक गर्म होना |
| `fault.lube_starvation` | Lubrication starvation | स्नेहन की कमी |
| `fault.cavitation` | Pump cavitation | पंप में कैविटेशन |
| `severity.critical` / `high` / `medium` / `low` | Critical / High / Medium / Low | गंभीर / उच्च / मध्यम / निम्न |
| `option.A.title` | Stop now and repair | अभी रोकें और मरम्मत करें |
| `option.B.title` | Run at reduced load, repair on the Afternoon shift | कम गति पर चलाएं, दोपहर की शिफ्ट में मरम्मत करें |
| `option.C.title` | Keep running normally | सामान्य रूप से चलाते रहें |
| `option.blocked` | Blocked by safety gate | सुरक्षा कारणों से अवरुद्ध |
| `criteria.safety` / `cost` / `production` / `customer` / `people` / `parts` / `quality` / `compliance` | Safety / Cost / Production / Customer / People / Parts / Quality / Compliance | सुरक्षा / लागत / उत्पादन / ग्राहक / कर्मचारी / पुर्जे / गुणवत्ता / अनुपालन |
| `technician.notify` | {tech}, please perform {job} on {asset}. Lockout/tagout is mandatory before starting. Say "acknowledge" to confirm. | {tech}, कृपया {asset} पर {job} करें। शुरू करने से पहले लॉकआउट-टैगआउट अनिवार्य है। पुष्टि के लिए "स्वीकार" बोलें। |
| `safety.loto` (**safety-critical**) | Caution: before starting, stop the machine, isolate all energy sources, apply your lock and tag, and verify zero energy. | सावधानी: काम शुरू करने से पहले मशीन बंद करें, सभी ऊर्जा स्रोत अलग करें, अपना ताला और टैग लगाएं, और जाँचें कि कोई ऊर्जा शेष नहीं है। |
| `confirm.option` | Do you confirm running Option {option}? | क्या आप विकल्प {option} चलाने की पुष्टि करते हैं? |
| `mode.guard` / `mode.incident` | Guard mode / Incident | निगरानी मोड / घटना |
| `label.ai_translated` | AI translated, see English | AI अनुवाद, अंग्रेज़ी पाठ देखें |
| `ack.recorded` | Acknowledgement recorded. | स्वीकृति दर्ज की गई। |

Glossary seed (`GLOSSARY`; review needed): bearing = बेयरिंग (keep English), spindle = स्पिंडल (keep English), vibration = कंपन, lubrication = स्नेहन, grease = ग्रीस, coolant = कूलेंट, work order = वर्क ऑर्डर, lockout/tagout = लॉकआउट-टैगआउट, technician = तकनीशियन, operator = ऑपरेटर, alert = अलर्ट, risk = जोखिम, repair = मरम्मत, shift = शिफ्ट, spare part = पुर्जा, warranty = वारंटी, derate = लोड कम करना, stop = रोकें, inspection = निरीक्षण, shipment = खेप, customs = सीमा शुल्क, expedite = शीघ्र मंगवाना.

## 16.7 Voice (Hindi, push-to-talk)

### Pipeline
1. Browser: hold-to-talk button, `MediaRecorder`, at most 15 s. Browsers usually record WebM/Opus.
2. Gateway: convert to 16 kHz mono WAV with ffmpeg; upload to `@APP.VOICE_STAGE`; name the file with the `voice_id`.
3. `SP_VOICE_TRANSCRIBE`: `AI_TRANSCRIBE(TO_FILE('@APP.VOICE_STAGE', file))`; read `text`; log language and duration. If speech starts after 5 s, ask the user to repeat.
4. `SP_VOICE_INTENT(transcript)`: `AI_CLASSIFY` or `AI_COMPLETE` with a strict JSON schema into the whitelist below, plus slots (asset, option). Below `voice_min_confidence` ask the user to repeat; never guess.
5. Call the **same backend functions as the UI** (no separate logic).
6. Reply text: reviewed Hindi templates plus slots for status, plan and steps; for free-form Copilot answers use `SP_TRANSLATE_TEXT`. Always show Hindi and English text.
7. Spoken reply (open question, in order of preference): browser `speechSynthesis` with `lang='hi-IN'` (test on the demo device); else **pre-recorded audio for the fixed phrases only**, disclosed as pre-recorded in the deck.

### Whitelisted intents
| Intent | Example Hindi utterance (draft) | Effect |
|---|---|---|
| `STATUS` | "CNC-02 की स्थिति बताओ" | Read asset status and risk |
| `EXPLAIN` | "यह अलर्ट क्यों आया?" | Read the short cited explanation |
| `PLAN` | "योजना क्या है?" | Read the chosen option |
| `STEPS` | "काम के चरण पढ़ो" | Read the work-order steps, starting with the LOTO warning |
| `ACK` | "स्वीकार" / "समझ गया" / "ठीक है" / "acknowledge" | Record acknowledgement of the technician notification |
| `CONFIRM_YES` / `CONFIRM_NO` | "हाँ" / "नहीं" | Only to answer a pending on-screen confirmation for **non-physical** steps |

Anything else: "यह आदेश समर्थित नहीं है" ("this command is not supported") and no action.
Asset aliases for matching spoken names: `CNC-02` = "सीएनसी 02", "सीएनसी दो", "CNC 2"; keep a small alias table for the demo assets only.

**Do not** let voice approve an option, stop, derate or restart a machine, or create/approve a work order.

## 16.8 Supply chain: how it works

**Adapter pattern:** `backend/scm/` with an abstract `ScmAdapter` (`get_shipment(po_id)`, `quote_expedite(po_id)`, `find_alternates(part_id)`, `check_inter_plant(part_id, qty)`, `place_request(...)`, `update_export_commit(order_id, new_date)`) and a `MockScmAdapter` that reads the tables above and writes `APP.SUPPLY_REQUESTS`. The same functions are exposed as stored procedures so the Cortex Agent can answer "when will the bearing arrive?" (and, as a roadmap item, over MCP).

**Options engine integration:** each option's plan lists the parts it needs and the time each is needed. `SP_GET_SUPPLY_PLAN` queries `VW_SUPPLY_OPTIONS` and picks, per part: the **cheapest OEM-approved action that arrives in time**; if none, the cheapest feasible action **with a warranty/compliance warning**; if none, the option is marked supply-blocked. Policy `prefer_oem_approved=true`. Show the alternatives in the option card. Also add `VW_EXPORT_RISK`: if an option's projected completion makes an export order miss its port cut-off, add a chip and `export_miss_delay_days` of penalty exposure (synthetic assumption).

**Expected S1 behaviour** (assume "now" = 00:05 data time on the Night shift; the numbers must come from SQL, not be typed):
- Bearing set: stock 1, reserve it (arrival immediate).
- Option A (stop now; certified technician called out; repair starts about 01:45; grease needed about 04:15): only the **local substitute grease (arrives about 03:05)** is in time; it is **not OEM-approved**, so the option shows a **warranty risk** warning (lubrication exclusion in `CON_002`).
- Option B (derate; repair at 14:00; grease needed about 16:30): **inter-plant transfer (arrives about 12:05, OEM-approved, Rs 9,500)** is chosen.
- Option C (run normally until the PO arrives): fails the safety gate and is blocked.
- Export risk: `SO-0014` (cut-off 4 Oct) is flagged if a branch outcome delays completion past the cut-off.

If the engine produces different results, fix the data or logic; do not edit the output by hand.

**Execution:** `SP_EXECUTE_OPTION` creates `SUPPLY_REQUESTS` rows (`REQUESTED`). The simulator advances statuses on the scenario clock (`IN_TRANSIT`, `RECEIVED`). UI: supply panel in the Incident Room (action, cost, arrival, OEM flag, status) and a shipments timeline with customs status on Inventory and Supply.

## 16.9 Backend endpoints
`GET/PUT /api/v1/me/prefs` | `POST /api/v1/translate` | `POST /api/v1/voice/query` (multipart audio -> transcript, intent, reply_hi, reply_en, optional audio) | `POST /api/v1/voice/confirm` | `GET /api/v1/supply/shipments` | `GET /api/v1/supply/options?part_id&need_by` | `POST /api/v1/supply/requests` | `GET /api/v1/orders/export-risk?incident_id`. All writes are audited.

## 16.10 15-minute smoke test (run before committing to this scope)
1. **Translation:** run `AI_TRANSLATE(<each sentence in the 16.6 table with a real asset ID and number>, 'en', 'hi', TRUE)`. Check that Hindi reads naturally, that `CNC-02`, numbers and Rs survive, and that no Devanagari numerals appear.
2. **Placeholder test:** translate "Check ID_001 at 5.8 mm/s on PART_0001" and confirm tokens survive. If not, use templates only.
3. **Transcription:** record a 5-10 s Hindi clip in the browser; convert to 16 kHz mono WAV; `PUT` it to `@APP.VOICE_STAGE`; run `SELECT AI_TRANSCRIBE(TO_FILE('@APP.VOICE_STAGE','clip.wav'));`. Record accepted formats and any network-policy error. Try a Hindi sentence with English technical words ("CNC-02 का bearing खराब है").
4. **Browser Hindi speech:** run `speechSynthesis.getVoices().filter(v => v.lang.startsWith('hi'))` on the demo laptop and phone; speak one template. If no Hindi voice exists, use the pre-recorded fallback.
5. Record the results in `docs/COCO_LOG.md` and update this section.

## 16.11 Automated tests (add to the golden-test suite)
- Every template has the same placeholders in English and Hindi; no template is empty; `safety_critical` templates have `reviewed_by` set.
- `SP_TRANSLATE_TEXT` rejects output that drops or alters a protected token and returns English with a flag.
- Safety-critical text with no reviewed template is never machine translated.
- `SP_VOICE_INTENT` on 10 recorded utterances (Hindi and Hindi-English mixed) returns the expected intents; unknown input returns no action; low confidence asks to repeat.
- Voice cannot trigger approve, stop, derate or restart (attempts are refused and logged).
- S1 supply plan: option A shows the substitute grease with a warranty warning; option B selects the inter-plant transfer; the expedite action is shown but infeasible; option C is blocked.
- `SO-0014` is the only L001 export order; its cut-off is 4 Oct; existing checks 27/27 still pass; files 01-48 unchanged apart from the added columns.

## 16.12 Demo script update (replaces timings in section 10; total about 4:35, limit 5:00)
- 0:00-0:20 Context, guard mode, all green.
- 0:20-0:55 Skill 1 `$pdm-detect S1`.
- 0:55-2:10 Skill 2 `$pdm-assess-options`: evidence, cited cause, three options plus do-nothing, line-stop panel, **supply panel (about 15 s: substitute grease with warranty warning vs inter-plant transfer; export cut-off chip)**.
- 2:10-2:30 Human decision (skill stops and asks; approve B).
- 2:30-3:35 Skill 3 `$pdm-execute-recover`: actions execute; **technician phone view in Hindi, alert read aloud, technician says "स्वीकार" and the tracker turns green (about 25 s)**; recovery panel; back to guard mode.
- 3:35-4:15 Branch replay and outcome scorecard; Model and ROI page with the honest banner.
- 4:15-4:35 Close.

If spoken replies are cut, show the Hindi text and voice input only; say so plainly.

## 16.13 Skills (no new skills; keep to three)
- `pdm-assess-options`: add steps "call `SP_GET_SUPPLY_PLAN` and `VW_EXPORT_RISK`; show the supply plan and export chips".
- `pdm-execute-recover`: add steps "create supply requests; send the technician notification using `USER_PREFS.language`; wait for acknowledgement (voice or click); record in `VOICE_LOG`".

## 16.14 Effort and order of work (after the incident flow works)
1. Hindi: i18n skeleton, templates, glossary, `SP_TRANSLATE_TEXT`, technician notification (about 0.5 day, plus review time).
2. Supply: generator patch, validator update, views, `SP_GET_SUPPLY_PLAN`, options integration, supply panel (about 0.5 day).
3. Voice in (transcribe, intents, ack) (about 0.5 day).
4. Spoken replies and polish (about 0.25 day).
5. Tests and the smoke-test log (about 0.25 day).

Total about 2 days of work: **do not start voice until steps 1-2 are done and the base demo is recorded once as a backup.**

## 16.15 Risks and mitigations
- Machine translation errors on technical terms -> templates for fixed content, glossary, integrity check, English alongside, native review.
- Noise, accents and code-mixing -> push-to-talk, short whitelist, confidence threshold, repeat prompts, test with real clips.
- Network policy or format failures in `AI_TRANSCRIBE` -> found by the smoke test; fall back to typed Hindi input and say so.
- No Hindi voice available on the demo device -> pre-recorded phrases, disclosed.
- Scope creep -> follow the cut order at the top of this section.
- Overclaiming -> say "Hindi" not "all Indian languages"; "mock SCM connector" not "integrated with SAP"; "AI translated" labels; synthetic data banner.

## 16.16 Done criteria
Hindi toggle works across Incident Room, technician view and alert text; all safety text comes from reviewed templates; the S1 supply plan behaves as in 16.8 from SQL; the technician can acknowledge in Hindi by voice (or by click if voice is cut); the smoke-test results are logged; golden tests pass; the video fits in 5:00.

## 16.17 Edits to make elsewhere in CLAUDE.md after appending this section
- Section 6: change "48 tables" to 51 and list `49_inbound_shipments`, `50_supply_actions_catalog`, `51_inter_plant_stock`; note the added columns on files 44 and 46.
- Section 3b: add the supply panel and the language toggle to the Incident Room description.
- Section 10: replace the demo timings with 16.12.
- Section 11: replace the brief with the text below (905 characters with the placeholder; keep the final under 1000):
```
Plant Sentinel is a Snowflake-native predictive maintenance and OEE command center for discrete
manufacturing. It fuses sensor streams with ERP, CMMS, inventory, shift, contract and supply-chain
data to predict failures days ahead and explain root cause with citations. When a fault develops it
opens an incident: the AI compares 2-3 options on safety, cost, production, customer and
export-order impact, technician certification and spare-part supply (expedite, inter-plant transfer),
including what happens if the line is stopped or not. A human approves one; the system executes it,
verifies recovery, and returns to guard mode. Technicians get alerts in Hindi with voice
acknowledgement. Built on Snowflake Cortex (Search, Agents, AI_TRANSLATE, AI_TRANSCRIBE),
Snowpark ML and Dynamic Tables, driven by three CoCo CLI skills. Synthetic data: 51 tables.
[UPDATE: backtest X of Y caught, Z days warning]
```
- Section 12 (deck): add a slide "Built for the frontline: Hindi, voice, supply chain" and a roadmap line "more Indian languages via a pluggable language gateway (for example Bhashini)".
- Section 14: add "Do we have a native Hindi reviewer for the templates?" and "Does the Snowflake account have a network policy that blocks `AI_TRANSCRIBE`?"
