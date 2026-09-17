# WUDAU 🚀
>
> **Where Rhythm![alt text](image.png) Meets Raw Potential** — A next-generation social talent discovery platform for dancers, choreographers, and creative performers.

[![CI/CD Pipeline](https://github.com/wolinet-renatus/wudau/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/wolinet-renatus/wudau/actions/workflows/ci-cd.yml)
[![Production Domain](https://img.shields.io/badge/Production-https%3A%2F%2Fwudao.wolinet.com-FF4B1F)](https://wudao.wolinet.com/)
[![Docker Compose](https://img.shields.io/badge/Deploy-Dokploy%201--Click-FF9F00)](https://dokploy.com)

---

## 🌟 Overview

**WUDAU** breaks away from generic, passive short-form video feeds and TikTok clones with:

- **Kinetic Solar Blaze (`#FF4B1F`) & Hyper Gold (`#FF9F00`) Brand Identity**: An electric, warm aesthetic purpose-built for dance, stage performance, and creator spotlighting.
- **Talent-Favoring Discovery Algorithm**: Replaces naive random feeds with an engagement-velocity engine prioritizing high-intent shares ($4\times$) and comments ($2.5\times$), talent tags (`#dance`, `#choreography`, `#afrobeats`, `#freestyle`), cold-start 72h exploration runways, and deterministic session pagination.
- **Unified Architecture**: Next.js 14 Web & Admin Portal, Node.js Express + Socket.IO Real-Time Backend, and Flutter Cross-Platform Mobile App.

---

## 🏗️ Architecture

```
                          Internet Traffic
                                 │
                                 ▼
                     https://wudao.wolinet.com/
                                 │
               ┌─────────────────┴─────────────────┐
               │    Dokploy Traefik Reverse Proxy   │ (Automatic Let's Encrypt SSL)
               └─────────────────┬─────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      wudau-gateway      │ (Port 80, Nginx, 300MB uploads)
                    └────────────┬────────────┘
                                 │
       ┌─────────────────────────┴─────────────────────────┐
       │                                                   │
       ▼                                                   ▼
┌──────────────┐                                   ┌──────────────┐
│wudau-frontend│                                   │wudau-backend │
│ (Next.js 14) │                                   │ (Express API)│
│  Port: 5001  │                                   │  Port: 5050  │
└──────────────┘                                   └───────┬──────┘
                                                           │
                                                           ▼
                                                   ┌──────────────┐
                                                   │ wudau-mongo  │ (MongoDB 7.0)
                                                   │  Port: 27017 │
                                                   └──────────────┘
```

---

## 🚀 1-Click Deployment on Dokploy

1. In your **Dokploy** dashboard (`https://wudao.wolinet.com/`):
   - Create Service $\rightarrow$ **Compose**.
   - Repository: `https://github.com/wolinet-renatus/wudau`
   - Branch: `main`
   - Compose Path: `docker-compose.yml`
2. Configure Environment Variables (from `.env.production.example`):

   ```env
   PROJECT_NAME=WUDAU
   BASE_URL=https://wudao.wolinet.com/
   SECRET_KEY=5TIvw5cpc0
   JWT_SECRET=2FhKmINItB
   EMAIL=kodebookapp@gmail.com
   APP_PASSWORD=nohwrpybgiuhqjfy
   MONGO_URI=mongodb://mongo:27017/shortie
   NEXT_PUBLIC_BASE_URL=https://wudao.wolinet.com/
   NEXT_PUBLIC_SECRET_KEY=5TIvw5cpc0
   NEXT_PUBLIC_PROJECT_NAME=WUDAU
   ```

3. Set Domain to `wudao.wolinet.com` (Port 80) with **Let's Encrypt HTTPS**.
4. Click **Deploy**!

For detailed instructions, see [DOKPLOY_DEPLOYMENT_GUIDE.md](./DOKPLOY_DEPLOYMENT_GUIDE.md).

---

## 🔄 CI/CD Automation

GitHub Actions ([.github/workflows/ci-cd.yml](./.github/workflows/ci-cd.yml)) automatically runs:

1. **CI**: Backend syntax check, Next.js production build, and `docker compose config` verification on every PR and push.
2. **CD**: Triggers your Dokploy deployment webhook (`DOKPLOY_WEBHOOK_URL`) on push to `main` for zero-downtime automated redeployments.

---

## 📱 Mobile App (Flutter)

To run the mobile app on iOS Simulator or Android:

```bash
cd app
flutter pub get
flutter run
```

Production endpoint is configured in `app/lib/utils/api.dart` pointing to `https://wudao.wolinet.com/`.

---

## 📄 License

All rights reserved © 2026 WUDAU / Wolinet.
