# WUDAU Dokploy Live Production Deployment Guide

Deploy the **WUDAU** web application, admin portal, Node.js REST & Socket.IO backend, and persistent MongoDB database to your Dokploy server at **`https://wudao.wolinet.com/`** with 1-click deployment.

---

## 1. Architecture Overview

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

- **Single Domain (`https://wudao.wolinet.com/`)**:
  - Web UI & Admin Console: Handled by `frontend`
  - Mobile & Web API (`/client/*`, `/admin/*`): Handled by `backend`
  - Storage Uploads (`/storage/*`): Direct to `backend` with persistent volume `wudau_backend_storage`
  - Real-Time WebSockets (`/socket.io/*`): Direct to `backend` with full connection upgrade
- **Data Persistence**: Both MongoDB (`wudau_mongo_data`) and video/image storage (`wudau_backend_storage`) run on named Docker volumes, ensuring data is never lost across redeployments.

---

## 2. Setting Up in Dokploy (Step-by-Step)

### Step 1: Create a Project in Dokploy
1. Log in to your Dokploy dashboard.
2. Click **Create Project** and name it **`wudau`** (or select your existing project).

### Step 2: Create a Compose Application
1. In the project, click **Create Service** and select **Compose**.
2. Set the service name to **`wudau-app`**.
3. Under **Source Code**:
   - Choose **Git Provider** (e.g., GitHub or GitLab).
   - Select your repository: `<your-username>/wudau` (or your Git repository URL).
   - Branch: **`main`**.
   - Compose Path: **`docker-compose.yml`**.

### Step 3: Configure Environment Variables
1. Go to the **Environment** tab of your Compose application in Dokploy.
2. Paste the following production configuration:

```env
# Public Domain
PROJECT_NAME=WUDAU
BASE_URL=https://wudao.wolinet.com/

# Security Keys
SECRET_KEY=5TIvw5cpc0
JWT_SECRET=2FhKmINItB

# Email Service
EMAIL=kodebookapp@gmail.com
APP_PASSWORD=nohwrpybgiuhqjfy

# Frontend Variables
NEXT_PUBLIC_BASE_URL=https://wudao.wolinet.com/
NEXT_PUBLIC_SECRET_KEY=5TIvw5cpc0
NEXT_PUBLIC_PROJECT_NAME=WUDAU

# Database & Ports
MONGO_URI=mongodb://mongo:27017/shortie
GATEWAY_PORT=80
```

### Step 4: Configure Domain in Dokploy
1. Go to the **Domains** tab in Dokploy (or let the Traefik labels in `docker-compose.yml` handle it automatically).
2. Add domain: **`wudao.wolinet.com`**.
3. Target Port: **`80`** (the `gateway` service).
4. Certificate: **Let's Encrypt** (enable HTTPS).

### Step 5: Click "Deploy"!
1. Click the **Deploy** button in the top right.
2. Dokploy will pull the latest code, build the multi-stage images, seed the database, and launch all containers with SSL.
3. Once the build logs complete with "Success", visit **`https://wudao.wolinet.com/`**!

---

## 3. Automated CI/CD with GitHub Actions

Whenever you push new changes or talent algorithms to `main`, GitHub Actions can automatically trigger Dokploy to redeploy without manual intervention:

1. In Dokploy, go to your Compose application's **General** or **Deployments** tab.
2. Copy the **Deploy Webhook URL**.
3. In your GitHub repository:
   - Navigate to **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**.
   - Click **New repository secret**.
   - Name: `DOKPLOY_WEBHOOK_URL`
   - Value: `<paste-the-dokploy-webhook-url>`
4. Now, every push to `main` will:
   - Automatically run syntax and build validation checks.
   - Automatically trigger Dokploy to pull and build the update.

---

## 4. Mobile App Production Configuration

When building your Flutter mobile app for iOS App Store or Android Google Play:
1. In `app/lib/utils/api.dart`:
   ```dart
   static const baseUrl = "https://wudao.wolinet.com/";
   ```
2. Because the gateway proxies `/client/*` and `/storage/*`, the mobile app talks directly to `https://wudao.wolinet.com/` over secure HTTPS with no extra ports needed.

---

## 5. Maintenance & Useful Commands

### Viewing Logs in Dokploy
- Go to the **Logs** tab in Dokploy to see live unified logs from `gateway`, `frontend`, `backend`, and `mongo`.

### Backup Database
To create a MongoDB database backup:
```bash
docker exec -t wudau-mongo mongodump --db shortie --out /data/db/backup
```
