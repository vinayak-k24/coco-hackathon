# 🏭 CoCo Hackathon - AI Industrial Command Center

An AI-driven Manufacturing Intelligence & Operational Command Center built for industrial enterprises. The platform integrates real-time fleet telematics, predictive maintenance, supply chain risk forecasting, order impact analysis, and an interactive Gemini Copilot for intelligent plant operations.

---

## ✨ Features

- 📊 **Executive Hero & Operational Status Briefing**:
  - Real-time fleet metrics (OEE, Total Factories, Connected Assets, Active Alerts, Fleet Health).
  - AI-generated voice & text briefings with cost avoidance insights and automated report generation.
- ⚡ **Copilot Command Center & AI Intelligence**:
  - Gemini-powered interactive assistant capable of answering complex operational queries, retrieving data specs, and recommending proactive interventions.
- 🚚 **Supply Chain Risk Forecasting**:
  - Live tracking of critical component suppliers, supplier health scores, lead time variance, and affected machines.
- 📦 **Order Impact Analysis**:
  - Relational mapping of customer order commitments against manufacturing line availability and revenue exposure.
- ⚙️ **Synthetic Industrial Data Engine**:
  - High-fidelity Python generator for multi-plant master data, line telemetry, maintenance logs, and supply chain records.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with smooth modern UI aesthetics & custom animations
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK

### **Backend & Data Pipeline**
- **Language**: Python 3.10+
- **Data Engineering**: `pandas`, `numpy`, `faker`
- **Output**: Relational CSV data schemas covering plants, lines, equipment, maintenance, and order fulfillment.

---

## 📂 Repository Structure

```
coco-hackathon/
├── Frontend/                 # Next.js 15 Web Application
│   ├── app/                  # App Router pages & API routes (/api/copilot)
│   ├── components/           # UI Components (HeroBriefing, SupplyChainRisk, OrderImpact, Copilot)
│   ├── public/               # Static assets & icons
│   ├── package.json          # Dependencies & scripts
│   └── .env.local            # Local environment configuration
├── csv_data/                 # Generated CSV datasets for industrial metrics
├── data_generation.py        # Python script to generate synthetic industrial data
├── .gitignore                # Root gitignore rules
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17+` or `v20+`
- **npm** / **yarn** / **pnpm**
- **Python**: `3.9+` (for data generation)

---

### 1. Frontend Setup

1. **Navigate to the Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file inside the `Frontend` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the Command Center.

---

### 2. Data Generation (Optional)

To regenerate the industrial CSV datasets:

1. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```

2. Install required packages:
   ```bash
   pip install pandas numpy faker
   ```

3. Run the generator script:
   ```bash
   python data_generation.py
   ```
   *Generated datasets will be saved into the `csv_data/` directory.*

---

## 📜 Available Scripts

In `Frontend/`:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches Next.js dev server with hot-reload at `http://localhost:3000` |
| `npm run build` | Compiles and builds the production app |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint check |

---

## 🤝 Contributing & Git Workflow

Before pushing to GitHub:
```bash
git add .
git commit -m "feat: complete command center dashboard with AI copilot & data engine"
git push origin main
```
