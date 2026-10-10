# Day Trip AI: Cloud Deployment Guide (Vercel & Render)

This guide provides step-by-step instructions to deploy the **Day Trip AI** full-stack travel platform to **Render** (Backend API + MySQL) and **Vercel** (Frontend React SPA).

---

## 1. Push Code to GitHub

Open a terminal (in VS Code or PowerShell) and run:

### Push Backend:
```powershell
cd c:\daytrip-ai-system\backend
git push -u origin main
```

### Push Frontend:
```powershell
cd c:\daytrip-ai-system\frontend
git push -u origin main
```

*(If prompted by Git Credential Manager, click **Authorize** in your browser to sign in to your GitHub account `jaalasurya6-svg`).*

---

## 2. Deploy Backend to Render

### Step 2.1: Create Free MySQL Database on Render (or Aiven)
1. Go to **[dashboard.render.com](https://dashboard.render.com/)** and sign in.
2. Click **New +** $\rightarrow$ **PostgreSQL** or connect to a free MySQL provider:
   - **Recommended Free MySQL Options**:
     - **Aiven.io** (Free MySQL database, 5GB)
     - **Clever Cloud** (Free MySQL addon)
     - Or Render Web Service with an external database.
3. Note your connection details:
   - Host, Port (3306), Database name, Username, Password.

### Step 2.2: Create Backend Web Service on Render
1. In Render Dashboard, click **New +** $\rightarrow$ **Web Service**.
2. Select your repository: **`jaalasurya6-svg/data-trip-ai-backend`**.
3. Render will auto-detect the **`Dockerfile`**.
4. Configure service settings:
   - **Name**: `data-trip-ai-backend`
   - **Region**: Choose closest to you (e.g., Singapore or Frankfurt).
   - **Instance Type**: **Free**.
5. Under **Environment Variables**, click **Add Environment Variable**:
   | Key | Value | Description |
   |---|---|---|
   | `PORT` | `8080` | Server listening port |
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<host>:<port>/<dbname>?useSSL=false&allowPublicKeyRetrieval=true` | MySQL JDBC Connection String |
   | `SPRING_DATASOURCE_USERNAME` | `<db-username>` | Database username |
   | `SPRING_DATASOURCE_PASSWORD` | `<db-password>` | Database password |
   | `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit HMAC key |
   | `AI_PROVIDER` | `gemini` | AI Provider (or `fallback`) |
   | `GEMINI_API_KEY` | *(Optional Google Gemini API key)* | Optional |
6. Click **Create Web Service**.
7. Render will build the Docker container and start your Spring Boot application.
8. Once deployed, copy your backend URL:
   - Example: **`https://data-trip-ai-backend.onrender.com`**
   - Health check: `https://data-trip-ai-backend.onrender.com/api/v1/health`

---

## 3. Deploy Frontend to Vercel

1. Go to **[vercel.com](https://vercel.com/)** and sign in with GitHub.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your repository: **`jaalasurya6-svg/data-trip-ai-frontend`**.
4. Configure Project Settings:
   - **Framework Preset**: **Vite** *(auto-detected)*.
   - **Root Directory**: `./` *(default)*.
   - **Build Command**: `npm run build` *(auto-detected)*.
   - **Output Directory**: `dist` *(auto-detected)*.
5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://<YOUR-RENDER-BACKEND-URL>/api/v1` |
   *(e.g., `https://data-trip-ai-backend.onrender.com/api/v1`)*
6. Click **Deploy**.
7. In ~45 seconds, your application will be live at:
   - Example: **`https://data-trip-ai-frontend.vercel.app`**

---

## 4. Key Deployment Features Already Configured in Code

- ✅ **`frontend/vercel.json`**: Configured with SPA rewrite rules so direct navigation or refreshing on `/destinations`, `/trips`, and `/favorites` will not result in 404 errors.
- ✅ **`backend/Dockerfile`**: Configured with multi-stage build (Maven + Java 21 Temurin Alpine) for minimal container size and fast startup.
- ✅ **`SecurityConfig.java`**: Configured with `setAllowedOriginPatterns` to automatically permit CORS requests from all `https://*.vercel.app` domains.
- ✅ **`application.properties`**: Fully configured to read `PORT`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` directly from Render environment variables.
