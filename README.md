# SaarthiAI (सारथी एआई)

> **"Understand your report. Prepare for the conversation. Leave the diagnosis to the doctor."**  
> **Core Principle:** **AI explains. Rules compare. Doctors diagnose.**

SaarthiAI is a modern, patient-focused laboratory report understanding and clinical preparation platform engineered for Indian healthcare contexts. It decodes complex medical parameters into plain language, compares numerical results against verified reference intervals using a deterministic rule engine, prepares neutral questions for doctor appointments, and enables secure, consent-based sharing.

---

## Non-Negotiable Medical Safety Contract

SaarthiAI strictly adheres to the following principles at every layer:
1. **Zero Autonomous Diagnosis:** SaarthiAI **never** diagnoses a medical condition or claims a result proves disease.
2. **Zero Prescription or Drug Advice:** SaarthiAI **never** recommends medications, dosages, treatments, or drug adjustments.
3. **Deterministic Interval Comparison:** The AI **never** decides whether a numerical result is in-range, above-range, below-range, critical, or diagnostic. A standalone, deterministic rule engine executes all comparisons.
4. **Categorical Result Separation:** Values such as `Positive`, `Negative`, `Reactive`, `Non-reactive`, `Detected`, and blood groups like `B+` are never coerced to numbers.
5. **Strict Reference Range Priority:**
   - **Priority 1 (Report-Printed):** The range printed on the patient's own lab report is used whenever reliably extracted and unit-compatible.
   - **Priority 2 (Curated Indian Fallback):** If missing, only reviewed, peer-reviewed Indian population studies with explicit DOI/PubMed citations and applicability metadata are consulted.
   - **Priority 3 (No Verified Range):** If no verified match exists, `NO_VERIFIED_RANGE` is displayed, and the result is **not** classified as normal/abnormal.
6. **Explicit Sharing Consent:** Medical reports are never shared with a clinic or doctor without an explicit, opt-in checkbox authorization.

---

## Key Architecture & Features

- **Multi-File Document Upload:** Accepts PDFs and common image formats (PNG, JPG, WEBP) with client-side validation, 20MB session limit, and page provenance.
- **Transparent Field Review & Audit:** Highlights low-confidence extractions; allows patients to verify or correct names, values, units, and ranges with an audit trail before rules execute.
- **Deterministic Rule Engine:** Evaluates exact bounds (`[low, high]`, one-sided limits) independently of LLMs.
- **Grounded Plain-Language Explanations:** Explains what each test measures and why clinicians order it. Refuses diagnostic and prescription queries.
- **Multilingual Doubt Engine:** Real-time conversational assistant supporting **English and Hindi** with browser Web Speech recognition and text-to-speech.
- **PDF Export & WhatsApp Sharing:** Printable report summary with medical disclaimers; Web Share API device sharing with honest WhatsApp download-and-attach fallback.
- **Doctor Consultation Network:** Minimal appointment booking for participating clinics with time-limited doctor access tokens (48-hour expiry).
- **Restrained 3D Hero Visual:** Decorative document and particle node hero using `@react-three/fiber`, `three`, `three-stdlib`, `camera-controls`, and `@shadergradient/react` with accessible CSS fallbacks and `prefers-reduced-motion` detection.

---

## Initial Supported MVP Test Categories

1. **Complete Blood Count (CBC):** Hemoglobin, RBC, WBC, Platelet Count, Hematocrit (PCV), MCV, MCH, MCHC.
2. **Diabetes & Glucose:** Fasting Blood Glucose, Random Blood Glucose, HbA1c (Glycated Hemoglobin).
3. **Liver Function Panel (LFT):** SGOT (AST), SGPT (ALT), Alkaline Phosphatase (ALP), Total Bilirubin, Serum Albumin.
4. **Kidney Function Panel (KFT):** Serum Creatinine, Blood Urea / BUN, eGFR.
5. **Thyroid Profile:** TSH, Total T3, Total T4, Free T3, Free T4.
6. **Lipid Profile:** Total Cholesterol, HDL Cholesterol, LDL Cholesterol, Serum Triglycerides.

---

## Quick Start & Local Execution

### 1. Prerequisites
- Node.js 18+ or Node.js 20+
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
The project starts in **Zero-Key Offline Sandbox Mode** by default. All features and synthetic lab samples run out of the box without external API keys.

Environment configuration template:
```bash
cp .env.example .env.local
```

`.env.local` contents:
```dotenv
NODE_ENV=development
APP_BASE_URL=http://localhost:3000

# Keep mock as default for offline judging
AI_PROVIDER=mock
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash

OCR_PROVIDER=local
OCR_API_KEY=
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Automated Test Suite
```bash
npm test
```
Executes 49 Vitest unit tests covering:
- Phase 1: Foundation & safe configuration
- Phase 2: Canonical test catalog, aliases, and categorical types
- Phase 3: Multi-file document preparation & MIME validation
- Phase 4: Extraction engine, parsing, and synthetic fixtures
- Phase 6: Deterministic rule engine, boundaries, and Indian reference fallback
- Phase 7: Doubt Engine medical safety guardrails & safe refusal
- Phase 9: PDF export & WhatsApp sharing
- Phase 10: Appointment booking & consent-based sharing

### 6. Production Build
```bash
npm run build
npm start
```

---

## Demo Scenarios for Round 1 Evaluation

1. **Clean Digital CBC Report:**
   - Go to `/review?fixture=clean`
   - Demonstrates 100% verified table extraction from Dr. Lal PathLabs sample with report-printed reference ranges.
2. **Mixed Metabolic Panel:**
   - Go to `/review?fixture=mixed`
   - Demonstrates out-of-range parameters (elevated fasting glucose, SGPT/ALT), blood group categorical result (`B+`), and curated Indian study fallbacks.
3. **Low-Confidence / Ambiguous Scan:**
   - Go to `/review?fixture=uncertain`
   - Demonstrates transparent uncertainty flagging, inline user corrections, and fresh re-evaluation without stale status.
4. **Doubt Engine Safety Challenge:**
   - Go to `/doubt-engine`
   - Ask: *"Do I have diabetes?"* or *"What medicine should I take for high creatinine?"*
   - Observe immediate, safe refusal in English or Hindi reiterating that SaarthiAI explains while doctors diagnose.
5. **Doctor Appointment & Consent Sharing:**
   - Go to `/appointments`
   - Select a doctor, toggle the explicit consent checkbox, and verify the time-limited token audit log.
