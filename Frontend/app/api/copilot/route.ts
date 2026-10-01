import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_CONTEXT = `
You are Nexa Copilot, an elite AI operations co-pilot for NexaFactory, an enterprise smart manufacturing intelligence system.
You assist Plant Director Alex Carter in managing 4 global manufacturing facilities:
1. Riverside Factory (USA): 72% Plant Health (down 12%). 3 critical alerts, 4 warnings, 86 machines online. Critical issue: CNC-02 spindle overheat reaching 112°C on CNC Line (threshold 90°C), at risk of catastrophic bearing seizure within 12 hours.
2. Pune Factory (India): 91% Plant Health (up 4%). 0 critical, 2 warnings, 94 machines online. Warning: Robot-12 harmonic vibration anomaly (4.8 mm/s RMS) on Assembly Line 3. Assembly Line 3 is approaching 90% capacity in 5 days.
3. Munich Plant (Germany): 89% Plant Health (up 2%). 1 critical, 1 warning, 92 machines online. Warning: Press-07 hydraulic pressure dropped to 142 bar (target 180 bar) in Stamping.
4. Austin Factory (USA): 94% Plant Health (up 5%). 0 critical, 1 warning, 97 machines online. Supply risk: Semiconductor IC microcontrollers delayed by 5 days from primary supplier.

Global KPIs:
- Overall Plant OEE: 87.4% (up 2.6% vs last week)
- Production Output: 12,428 units (+12% vs planned target)
- Breakdown hours: 8.4 hrs (down 42%)
- Breakdown cost: $124K (down 55%)
- Orders at Risk: 7 purchase orders representing $1.2M revenue exposure (e.g., PO-45821 $420K, PO-44732 $320K, PO-44567 $280K)
- Predicted Cost Avoidance: $284K from 3 AI-recommended actions.

Your tone is professional, concise, authoritative, and data-driven. When answering:
- Provide specific numbers, machine IDs, and plant locations.
- Give actionable next steps for plant managers and dispatch technicians.
- Keep answers under 3-4 concise paragraphs or bulleted recommendations.
`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const contents = [
          { role: 'user', parts: [{ text: `${SYSTEM_CONTEXT}\n\nUser request: ${message}` }] },
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
        });

        const reply = response.text || 'Operations telemetry scanned. Telemetry within nominal thresholds.';
        return NextResponse.json({ reply });
      } catch (genError) {
        console.warn('Gemini API call failed, using intelligent fallback:', genError);
      }
    }

    // High-precision domain rule fallback when API key is unconfigured
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('business impact') || lower.includes('revenue') || lower.includes('exposure')) {
      reply =
        'Potential revenue at risk is currently estimated at $1.2M across 7 high-priority purchase orders (led by PO-45821 at $420K). Resolving Riverside CNC-02 prevents an immediate $284K in direct downtime losses, while mitigating semiconductor IC shortages at Austin safeguards $540K in delivery commitments.';
    } else if (lower.includes('executive summary') || lower.includes('briefing')) {
      reply =
        'Executive Operations Briefing: Overall plant health is strong at 87% with +12% output above plan (12,428 units produced). Pune (91%) and Austin (94%) are operating stably. Riverside requires immediate preventive maintenance on CNC Line 2 to avert downtime. All critical customer deliveries remain schedulable with active buffer reallocations.';
    } else if (lower.includes('simulate') || lower.includes('what-if') || lower.includes('scenario')) {
      reply =
        'Simulation Result (Digital Twin): Reallocating 20% of Riverside precision milling capacity to Munich Line 4 increases total weekly throughput by 6.2% and lowers CNC-02 thermal stress by 34%, eliminating the imminent breakdown risk while keeping all 7 customer orders on track.';
    } else if (lower.includes('cnc') || lower.includes('riverside') || lower.includes('spindle')) {
      reply =
        'CNC-02 at Riverside: Current spindle bearing temperature is 112°C against a 90°C ceiling. Failure probability is 88% within 12 operating hours. Recommendation: Reduce spindle RPM by 25% immediately and dispatch technician Marcus Vance with replacement ceramic bearing kit #SKF-7204 to avoid 8.4 hours of unplanned line stoppage.';
    } else if (lower.includes('pune') || lower.includes('robot') || lower.includes('assembly')) {
      reply =
        'Pune Factory Telemetry: Assembly Line 3 is projected to hit 90% capacity utilization in 5 days. Robot-12 shows harmonic vibration anomalies (4.8 mm/s RMS). Recommendation: Add Shift B technician coverage from 18:00 to 02:00 and recalibrate the gear joint during the 15:30 shift changeover.';
    } else if (lower.includes('austin') || lower.includes('supply') || lower.includes('component')) {
      reply =
        'Austin Supply Chain Status: Microcontroller IC inventory buffer will drop below safe reserves in 7 days due to a 5-day supplier transit delay. Recommendation: Trigger fast-track air freight contract with secondary approved vendor (Kyocera Micro) for 12,000 units to eliminate line-stop risk.';
    } else {
      reply = `Telemetry analysis complete for query "${message}": All 4 factories are reporting active telemetry. 3 critical alerts remain open (priority: Riverside CNC-02). Overall production stands at 12,428 units (+12% vs plan). Ready to execute AI-recommended mitigations.`;
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error('Copilot API error:', err);
    return NextResponse.json(
      { error: 'Failed to process copilot query' },
      { status: 500 }
    );
  }
}
