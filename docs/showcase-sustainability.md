# Section 17: Showcase Focus and Sustainability Lens

Status: designed 2 Oct 2026. Deadline 4 Oct (submit by noon). About two days remain; **scope is cut hard**. This section overrides earlier scope where it conflicts.

## 17.1 Name
The existing dashboard is branded **NexaFactory**; earlier documents say "Plant Sentinel". **Pick one name** and use it in the app, MVP brief, deck, video and this file. Placeholder below: `[PRODUCT NAME]`.

## 17.2 What we showcase (priority order) and what we cut
**Showcase (in the video and deck):**
1. **Incident flow through the three CoCo CLI skills** (detect, assess-options, execute-recover). Required by the form. Highest priority.
2. **Command Center with a spoken briefing** (English, and a short Hindi line).
3. **What-If scenario generator** wired to the same options engine.
4. **Asset 360 for one machine (CNC-02)**.
5. **Vision safety verification gate**: only if real or clearly disclosed footage exists (see 17.8).
6. **Sustainability lens** on all of the above (17.3 to 17.6).

**Keep slim:** Supply Chain (one panel in the Incident Room plus a small page), Insights (Model and ROI page only), Finance and Executive (a ROI card and a role toggle on the Command Center).
**Cut (do not build, do not demo):** Insights sub-tabs other than Model and ROI, Vision sub-tabs other than the gate and a short events list, Finance budgeting and forecasting views, multi-plant tenancy, extra languages. Restore only two things: a docked **Ask (Copilot)** drawer and a small **Policy and Audit** page, so Cortex Agents and governance are visible.
**Cut order if time runs out:** Vision, then Hindi spoken replies, then supply extras, then the Insights page. Never cut the incident flow, Command Center, Asset 360 or What-If.

## 17.3 Sustainability: principles
- Sustainability here means **using fewer natural resources per unit of good output**: material (scrap), energy, spares and consumables, and asset life. Predictive maintenance helps mainly by **stopping defective output and wasted material** and by replacing parts at the right time.
- **Compute, don't claim.** Every sustainability number must come from a query on our data and be labelled synthetic. Report **tonnes of material and rupees** unless a cited emission factor exists.
- **Be honest about where the value is.** In our data, running degraded machines wastes **material** (scrap and rework) far more than **electricity**. Do not claim energy savings from predictive maintenance. Energy is shown as a monitoring KPI, not a headline saving.
- The relationship "defect rate rises as a machine degrades" is **built into the synthetic generator** (defect rate = 1.2% baseline plus a mode-specific term times severity). The figures below demonstrate the method and the mechanism; on real data the relationship would be learned from inspection tables 21 and 22. Say this on the slide.
- Do not claim certification or compliance (ISO 14001, ISO 50001). You may say the metrics "support" such management systems.

## 17.4 Verified figures (computed 2 Oct 2026 from `csv_data_v2`, 45 days, 16 monitored assets; synthetic)
| Metric | Value | Source tables |
|---|---|---|
| Material consumed / scrap | 2,710,516 kg / 66,237 kg (2.44%) | 21 |
| Units produced / defective | 1,137,992 / 19,084 (1.68%) | 18 |
| Electricity, monitored assets | 152,847 kWh; 134.3 kWh per 1,000 units | 11, 18 |
| Excess scrap while running degraded (all events) | 12,026 kg = 18.2% of all scrap (failed events 9,934 kg = 15.0%; averted 1,341; active 752) | 21, 47, 18 |
| Excess scrap after the first-detectable point (upper-bound avoidable) | 9,556 kg (failed events 8,102 kg = 12.2% of all scrap) | 21, 47 |
| Excess defective units while degraded / after first-detectable | 5,236 (27.4% of defective units), Rs 29.5 lakh / 4,246 (22.2%), Rs 23.8 lakh | 18, 07, 47 |
| Excess electricity while degraded | 529 kWh = 0.35% of total (negligible) | 11, 47 |
| Breakdown time and cost | 295 h, Rs 1.28 crore (18 failures) | 47 |
| Average parts cost: predictive vs corrective/emergency WOs | Rs 12,808 (5 WOs) vs Rs 14,892 | 25 (small sample, label as such) |
| Plant meters, 45 days | water 7,959 m3; gas 23,631 m3; compressed air 649,701 m3; steam 258,038 kg | 35 |
| Electricity CO2e at 0.727 kg/kWh | about 111 t | grid factor is a **parameter**; see 17.5 |

"Avoidable" assumes action as soon as the fault is first detectable (severity 0.25). It is an **upper bound**; real avoidance would be lower. State this wherever it is shown.

## 17.5 Parameters (put in `APP.CFG_POLICY`; show source on screen)
- `grid_ef_kg_co2_per_kwh = 0.727` **placeholder** from a secondary news summary of the CEA CO2 Baseline Database (weighted average, adjusted for renewables). **Verify against the current CEA release (v22.0) before publishing** and update the label with year and version. CO2e from electricity = kWh x factor (CO2 only).
- No material emission factors are set. If you add embodied CO2e for scrap, cite the source for each factor; otherwise show tonnes only.
- `derate_severity_slowdown = 0.5` (synthetic assumption: running at reduced load slows degradation); used only in the simulator and options engine.

## 17.6 What to build (small; about half a day)

### Snowflake
- `ANALYTICS.DT_SUSTAINABILITY_ASSET_SHIFT`: per asset and shift: kWh (from file 11 power x time), units and defective units (18), material kg and scrap kg (21).
- `ANALYTICS.VW_SUSTAINABILITY_KPI`: scrap rate %, kWh per 1,000 units, scrap kg trend, excess scrap attributed to degraded running (join to events by severity window; use the **model's alerts and scores in the live app**, not the ground-truth file; ground truth is only for the backtest).
- `ANALYTICS.VW_INCIDENT_SUSTAINABILITY(incident_id, option_id)`: expected scrap kg, defective units, rupee value, kWh and CO2e **for each option over its horizon**.
- Options engine: add criterion **sustainability** (expected material waste plus kWh) with a **low default weight (0.10)**, editable in policy. Formula per option: `expected_excess_scrap_kg = sum over hours of (units per hour x derate factor x max(0, defect_rate(severity) - baseline_rate) x kg per unit)`; stopping gives zero scrap but loses output; running to failure accumulates the most scrap. Defect-rate parameters come from the fitted relation on tables 21/22.
- Keep Cortex AI functions out of Dynamic Tables; compute in procedures.

### UI
- Command Center: a **Sustainability strip** of four tiles: scrap rate %, kWh per 1,000 units, excess scrap from degraded running (kg, 45 days), estimated electricity CO2e (with the factor and year shown).
- Incident Room: a **sustainability bar** on each option card and, at recovery, a **Sustainability impact card**: scrap kg avoided, defective units avoided, rupees, kWh, "estimate" label.
- Asset 360 Impact tab: asset scrap and energy per 1,000 units.
- ROI card (merged Finance/Executive): add scrap tonnes and rupees next to downtime cost.
- Do **not** add decorative eco badges or unexplained "green scores".

## 17.7 Resource-efficiency story for the deck (all supportable)
Material: less scrap and rework from running degraded. Spares: right-time replacement and **reusing sister-plant stock** instead of buying and importing new. Consumables: correct lubrication reduces bearing failures (and protects warranty). Asset life: fixing bearing wear before secondary damage. Energy and water: tracked per unit as a KPI, **not** claimed as savings. Roadmap (say "roadmap"): compressed-air leak detection and idle-energy recommendations (needs new signals in the data).

## 17.8 Vision (only if footage exists; otherwise move to the roadmap slide)
- One use case: **LOTO verification gate** before repair starts and a **restart clearance check** afterwards. A frame (camera still or technician photo) is staged and checked with a multimodal `AI_COMPLETE` call that must return strict JSON: `{"lock_and_tag_visible": bool, "area_clear": bool, "confidence": number, "notes": string}`. A human confirms; repair cannot start without confirmation (override needs a reason, logged).
- Footage: team-filmed photos or clips (best), or clearly disclosed generated images. No unlicensed stock, no face recognition, zone-level events only.
- Plus a short seeded events list (PPE missing, forklift in restricted zone) labelled synthetic. Table `APP.VISION_EVENTS`.
- Constraints to check in the preflight: media functions need an encrypted stage with a directory table and do not work with custom network policies; model availability varies by region. Audio/video via `AI_COMPLETE` is in preview.
- Vision assists; it does not replace physical zero-energy verification. Say so.
- Cut: vehicle management, heatmaps and movement tracking, incident management, investigate/search.

## 17.9 Dashboard fixes before recording
- Replace hard-coded "$4.8M", "$1.2M", "3.0x", "92/100" and similar with values computed from the dataset, or label them **sample**. Use rupees. Defensible: Rs 1.28 crore breakdown cost, Rs 4.44 crore orders at risk, 12,026 kg excess scrap, Rs 23.8-29.5 lakh excess defective output (labelled synthetic estimates).
- Add the "Synthetic demo data" banner on every page.
- Use a generic machine illustration, not copyrighted photos.
- Voice brief: build from a facts record in SQL; verify every number in the generated text against the record; fall back to a template if it does not match.

## 17.10 Tests and done criteria
- Sustainability numbers on screen equal the SQL result (spot-check three).
- Option cards show a sustainability bar; changing the weight in policy re-ranks options.
- The recovery card shows avoided scrap and rupees with the "estimate / upper bound" label.
- No page shows an emission figure without its factor and source.
- The voice brief reads only numbers that exist in the facts record.
- All earlier checks still pass (27/27 data checks; golden tests).
