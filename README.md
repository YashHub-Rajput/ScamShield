# ScamShield

AI-powered scam detection platform that analyzes messages, emails, and URLs in real time.

Live Demo: https://scamshield-beta.vercel.app

---

## What is ScamShield?

ScamShield is a  project that solves a real world problem — online scams.
India loses over 1,750 crore every year to cyber scams. ScamShield helps everyday users
identify scam messages instantly using a three layer AI detection system.

Paste any suspicious message, email, or URL and get:
- A scam probability score (0-100%)
- Specific reasons why it looks suspicious
- A plain English AI explanation
- Full scan history saved to database

---

## Three Layer Detection System

### Layer 1 — Rule Engine (Custom Built)
Our own scam detection logic that instantly checks for urgency tactics, prize and reward claims, personal information requests, financial scam patterns, threat and fear tactics, and impersonation attempts.

### Layer 2 — URL Scanner (VirusTotal)
Any URLs in the message are scanned against 70+ security databases in real time to check for phishing and malware.

### Layer 3 — AI Analysis (Groq + LLaMA 70B)
A large language model reads the full message with context from Layers 1 and 2 to generate a final risk score and plain English explanation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| AI Model | LLaMA 3.3 70B via Groq API |
| URL Scanner | VirusTotal API |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## Project Structure

    scamshield/
    ├── app/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── Hero.tsx
    │   │   ├── Stats.tsx
    │   │   ├── Analyzer.tsx
    │   │   ├── HowItWorks.tsx
    │   │   ├── WhatWeDetect.tsx
    │   │   ├── Footer.tsx
    │   │   └── Background.tsx
    │   ├── api/
    │   │   └── analyze/
    │   │       └── route.ts
    │   ├── history/
    │   │   └── page.tsx
    │   └── lib/
    │       ├── ruleEngine.ts
    │       ├── urlScanner.ts
    │       └── supabase.ts

---

## Features

- Real time scam analysis using AI
- Three independent detection layers
- URL threat scanning against 70+ databases
- Scan history saved to database
- Clean responsive dark themed UI
- Works on mobile and desktop

---

## Real World Impact

ScamShield detects:
- Phishing URLs disguised as trusted brands
- Fake prize and lottery scams
- Urgency tricks designed to bypass thinking
- Impersonation of banks and government
- Financial fraud and advance fee scams
- Social engineering attempts

---


## Getting Started Locally

1. Clone the repository

    git clone https://github.com/YashHub-Rajput/ScamShield.git
    cd ScamShield

2. Install dependencies

    npm install

3. Create .env.local and add your keys

    GROQ_API_KEY=your_groq_key
    VIRUSTOTAL_API_KEY=your_virustotal_key
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Run the development server

    npm run dev

5. Open http://localhost:3000

---

## Built By

Yash Rajput 

---

## License

This project is open source and available under the MIT License.