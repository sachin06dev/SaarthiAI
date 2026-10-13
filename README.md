# SaarthiAI (सारथी एआई) 🩺✨

> **"Understand your report. Prepare for the conversation. Leave the diagnosis to the doctor."**  
> **Core Principle:** **AI explains. Rules compare. Doctors diagnose.**

[![Live App](https://img.shields.io/badge/Live_App-saarthi--ai--team--sj2.vercel.app-0070F3?style=for-the-badge&logo=vercel)](https://saarthi-ai-team-sj2.vercel.app)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.12-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-50%2F50%20Passing-brightgreen?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://saarthi-ai-team-sj2.vercel.app)

---

## 🌐 Live Deployed Application

🚀 **Live Production URL:** **[https://saarthi-ai-team-sj2.vercel.app](https://saarthi-ai-team-sj2.vercel.app)**

> Experience SaarthiAI deployed live on Vercel with zero-install accessibility, multi-file report extraction, interactive 3D hero visualization, certified reference range evaluation, and bilingual Doubt Engine voice queries.

---

## 🎥 Video Demonstration

Experience SaarthiAI in action — from multi-file medical report parsing and deterministic rule engine verification to the multilingual Doubt Engine and consent-based doctor sharing:

🎬 **[Watch the Full SaarthiAI Demo Video (Google Drive)](https://drive.google.com/file/d/1MbV_OiW4DVcfRElELPBlHiI-R_r3_RaR/view?usp=sharing)**

*(Direct Link: `https://drive.google.com/file/d/1MbV_OiW4DVcfRElELPBlHiI-R_r3_RaR/view?usp=sharing`)*

---

## 🌟 What is SaarthiAI?

**SaarthiAI** is a patient-centric laboratory report comprehension and clinical consultation preparation platform engineered specifically for the Indian healthcare context. 

Patients often face anxiety and confusion when reading raw lab numbers or searching online for alarming, decontextualized diagnoses. SaarthiAI transforms dense medical reports into clear, empathetic, multilingual explanations, deterministically verifies values against certified reference intervals, suggests neutral talking points for upcoming appointments, and upholds uncompromising safety guardrails.

### 🛡️ Non-Negotiable Medical Safety Contract

1. **Zero Autonomous Diagnosis:** SaarthiAI **never** claims a test value confirms a specific medical disorder or disease.
2. **Zero Medication or Prescription Advice:** SaarthiAI **never** recommends drugs, dosages, over-the-counter remedies, or lifestyle modifications in place of clinical consultation.
3. **Deterministic Interval Comparison:** The LLM **never** decides whether a parameter is "Normal" or "High/Low". A deterministic TypeScript rule engine executes every comparison based on certified bounds.
4. **Categorical Result Isolation:** Categorical values (e.g., `Positive`, `Negative`, `Reactive`, `Non-reactive`, `Detected`, and blood groups like `B+`) are never parsed as numeric values.
5. **Reference Range Hierarchy:**
   - **Priority 1 (Report-Printed):** The range printed on the patient's own diagnostic report is always prioritized when present and unit-compatible.
   - **Priority 2 (Curated Indian Fallback):** If missing from the report, only peer-reviewed Indian population reference intervals with verified DOI and PubMed citations are consulted.
   - **Priority 3 (No Verified Range):** If neither is available, `NO_VERIFIED_RANGE` is explicitly displayed, avoiding any misleading classification.
6. **Explicit Sharing Consent:** Patient records are never shared with a clinic or practitioner without explicit, opt-in consent checkboxes.

---

## 🧰 APIs & Cloud Services Used

| API / Service | Provider | Purpose & Implementation Details |
|---|---|---|
| **Gemini 2.5 Flash / 1.5 Pro Multimodal API** | Google AI | Extracts structured lab tables from high-resolution PDF/image documents (`lib/services/gemini-multimodal-extractor.ts`), powers grounded plain-language explanations, and drives the conversational Doubt Engine (`lib/providers/gemini-ai-provider.ts`). |
| **Supabase PostgreSQL & SSR Auth** | Supabase | Manages relational database persistence (`supabase_schema.sql`), user audit trails, doctor access token lifecycle (48-hour expiration), and Row Level Security (RLS) data governance. |
| **Next.js Internal Route APIs** | Next.js Serverless | `/api/reports/ocr` handles multipart/form-data upload parsing with graceful fallbacks; `/api/system-status` monitors latency and provider health. |
| **Web Speech Recognition & Synthesis API** | Native Browser API | Provides zero-install voice input (Speech-to-Text) and vocal output (Text-to-Speech) in both English and Hindi for hands-free patient queries in the Doubt Engine. |
| **Web Share API & WhatsApp Click-to-Chat API** | Native / Meta | Enables single-tap mobile sharing of verified summaries, with graceful fallback to downloadable formatted summaries and pre-composed WhatsApp messages. |

---

## 📦 Libraries & Technology Stack

### ⚡ Core Framework & Runtime
- **[Next.js 15.1.12](https://nextjs.org/)** — React framework with App Router, Server Components, and Serverless Route Handlers.
- **[React 19.0.0](https://react.dev/)** — Modern component lifecycle, React Server Components, and concurrent rendering.
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** — End-to-end strict static type safety across test models, schemas, and rule engines.

### 🎨 Styling, UI & Design System
- **[Tailwind CSS 3.4.17](https://tailwindcss.com/)** — Utility-first styling with custom dark-mode healthcare color palettes, smooth glassmorphism, and responsive layouts.
- **[Lucide React 1.56.0](https://lucide.dev/)** — Cohesive medical, navigation, and audit iconography.
- **[clsx 2.1.1](https://github.com/lukeed/clsx)** & **[tailwind-merge 3.7.0](https://github.com/dcastil/tailwind-merge)** — Dynamic, collision-free Tailwind class management.
- **[PostCSS 8.5.30](https://postcss.org/)** & **[Autoprefixer 10.6.1](https://github.com/postcss/autoprefixer)** — Modern CSS post-processing and cross-browser vendor prefixing.

### 🌐 3D Graphics & Visual Aesthetics
- **[Three.js 0.186.1](https://threejs.org/)** — WebGL 3D rendering engine.
- **[@react-three/fiber 9.8.1](https://docs.pmnd.rs/react-three-fiber)** — Declarative Three.js scene graph inside React.
- **[three-stdlib 2.36.1](https://github.com/pmndrs/three-stdlib)** — Modern Three.js shader and math extensions.
- **[camera-controls 3.1.2](https://github.com/yomotsu/camera-controls)** — Smooth cinematic camera movements and interactions.
- **[@shadergradient/react 2.4.20](https://www.shadergradient.co/)** — Organic animated background gradients with accessible `prefers-reduced-motion` fallbacks.

### 🗄️ Backend, Database & Storage Client
- **[@supabase/supabase-js 2.117.3](https://supabase.com/docs/reference/javascript)** — Postgres database queries, schema interaction, and token management.
- **[@supabase/ssr 0.12.7](https://supabase.com/docs/guides/auth/server-side/nextjs)** — Server-side cookie-based Supabase authentication and session management.

### 🧪 Testing & Code Quality
- **[Vitest 5.0.4](https://vitest.dev/)** — Blazing-fast Vite-native unit and integration test runner (50 automated tests across all 10 architecture phases).

### 🚀 Deployment & CLI
- **[Vercel CLI 63.1.2](https://vercel.com/docs/cli)** — Preview builds, serverless deployment automation, and continuous delivery.

---

## 📋 Comprehensive Feature Walkthrough

### 1. Multi-File Document Upload (`/`)
- Accepts PDF, PNG, JPG, and WEBP lab reports.
- Enforces strict MIME validation, 20MB session boundary, and document page provenance.
- Clean visual dropzone with instant fixture shortcuts for offline testing.

### 2. Transparent Extraction Review & Audit (`/review`)
- Highlights low-confidence extractions with amber warning badges.
- Allows patients to edit or correct extracted names, numerical values, units, and printed ranges before rule execution.
- Generates an immutable client-side audit trail tracking all manual modifications.

### 3. Deterministic Clinical Rule Engine (`/results`)
- Categorizes parameters into **CBC**, **Diabetes / Glucose**, **Liver Function (LFT)**, **Kidney Function (KFT)**, **Lipid Profile**, and **Thyroid Profile**.
- Verifies exact intervals (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`) using mathematical inequalities without LLM hallucinations.
- Surfaces curated Indian population studies with verified PubMed/DOI references for missing ranges.

### 4. Multilingual Doubt Engine (`/doubt-engine`)
- Real-time Q&A assistant in **English and Hindi (हिंदी)**.
- Equipped with **Voice Input (STT)** and **Voice Output (TTS)** using Web Speech APIs.
- Strict refusal mechanisms: if a patient asks *"Do I have diabetes?"* or *"What medicine should I take?"*, the system immediately declines to diagnose or prescribe, guiding them to consult their clinician.

### 5. PDF Export & Patient-Doctor Summary
- Generates printable, clean report summaries complete with mandatory statutory medical disclaimers.
- Web Share API and WhatsApp quick-sharing for family members and caregivers.

### 6. Doctor Consultation Network & Consent-Based Sharing (`/appointments`)
- Search participating clinics and practitioners.
- Explicit opt-in checkbox requirement for medical record sharing.
- Generates secure, cryptographically hashed 48-hour access tokens for doctor viewing.

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- **Node.js**: `v18.x` or `v20.x` or higher
- **npm**: `v9.x` or higher

### 2. Clone & Install
```bash
git clone https://github.com/sachin06dev/SaarthiAI.git
cd SaarthiAI
npm install
```

### 3. Environment Variables
SaarthiAI defaults to **Zero-Key Offline Sandbox Mode**, allowing immediate testing without requiring API keys:

```bash
cp .env.example .env.local
```

*(Optional) Configure your `.env.local` for live AI services:*
```dotenv
NODE_ENV=development
APP_BASE_URL=http://localhost:3000

# AI Provider: 'gemini' or 'mock'
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# OCR Provider: 'gemini', 'google-vision', or 'local'
OCR_PROVIDER=gemini
OCR_API_KEY=your_gemini_api_key_here

# Supabase (Optional for cloud sync)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Run Test Suite
```bash
npm test
```
Executes all **50 automated Vitest unit and integration tests**:
- Phase 1: Environment & safe configuration
- Phase 2: Canonical test catalog, synonyms, and categorical isolation
- Phase 3: Multi-file document upload & MIME validation
- Phase 4: Extraction engine, parsing, and synthetic fixtures
- Phase 6: Deterministic rule engine, boundary evaluation, and Indian reference fallback
- Phase 7: Doubt Engine medical safety guardrails & safe refusal checks
- Phase 9: PDF export & WhatsApp sharing workflows
- Phase 10: Appointment booking & consent-based sharing tokens

### 6. Production Build
```bash
npm run build
npm start
```

---

## 🧪 Interactive Demo Scenarios (Click to Test Live)

| Scenario | Live Production Route | Description |
|---|---|---|
| **1. Clean Digital CBC Report** | [Open Scenario 1](https://saarthi-ai-team-sj2.vercel.app/review?fixture=clean) | 100% verified extraction from a standard CBC report with printed reference ranges. |
| **2. Mixed Metabolic Panel** | [Open Scenario 2](https://saarthi-ai-team-sj2.vercel.app/review?fixture=mixed) | Demonstrates out-of-range parameters (fasting glucose, SGPT), categorical `B+` blood group, and Indian population fallbacks. |
| **3. Low-Confidence Scan** | [Open Scenario 3](https://saarthi-ai-team-sj2.vercel.app/review?fixture=uncertain) | Showcases transparent uncertainty badges, inline manual correction, and dynamic re-evaluation. |
| **4. Safety Challenge (Doubt Engine)** | [Open Doubt Engine](https://saarthi-ai-team-sj2.vercel.app/doubt-engine) | Test guardrails by asking: *"Can you prescribe medicine for my high cholesterol?"* — watch the instant safe refusal. |
| **5. Doctor Consultation** | [Open Appointments](https://saarthi-ai-team-sj2.vercel.app/appointments) | Select a clinician, verify consent enforcement, and inspect the 48-hour access token audit log. |

---

## 📄 License & Attribution

Developed with ❤️ for patient empowerment and clinical clarity.  
All medical references cite published, peer-reviewed Indian population literature (AIIMS, ICMR, NABL-accredited diagnostic benchmarks).
