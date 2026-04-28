# Secure-Guard
🛡️ SecureGuard – Security dashboard + encrypted vault with OpenCV face unlock. Password health, breach monitor, phishing detector, 2FA, security score.

## 🔐 SecureGuard – Core Security & Protection Platform

**Your personal cybersecurity command center.**  
SecureGuard is a full‑stack web application that helps individuals and small teams assess, monitor, and improve their digital security posture – all from one clean dashboard.

## ✨ Features

- **🔑 Password Health Checker** – Analyze password strength, detect reuse, and generate strong alternatives.
- **📡 Breach Monitor** – Check if your email appears in known data breaches (HaveIBeenPwned API).
- **🔗 Phishing URL Detector** – Scan suspicious links for malicious patterns and blacklists.
- **📝 Encrypted Secure Vault** – Store sensitive notes with client‑side AES‑256 encryption (zero‑knowledge).
- **🔢 TOTP 2FA Manager** – Generate time‑based one‑time passwords for your online accounts.
- **📊 Security Score** – Dynamic score (0–100) that rewards secure behaviour.
- **👤 OpenCV Face Unlock** – Secure your vault with face recognition + liveness detection.

## ⚙️ Tech Stack

| Layer          | Technology |
|----------------|------------|
| Frontend       | Next.js, Tailwind CSS, Framer Motion |
| Backend        | Next.js API Routes (Serverless) |
| Database       | Supabase / SQL |
| Auth           | Supabase Auth |
| Deployment     | Vercel |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
