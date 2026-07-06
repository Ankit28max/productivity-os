# ProductivityOS — Production Deployment Guide

This document outlines the step-by-step instructions to compile, configure, and deploy the **ProductivityOS** full-stack application (Vite React + Express.js + MongoDB) to production servers.

---

## 1. Environment Variables Configuration

Create a `.env` file in your hosting environment (or configure these settings in your host console dashboard: e.g. Render/Heroku):

| Variable | Description | Production Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Tells Express to serve static assets and enable gzip/cache optimization. | `production` |
| `PORT` | The port the Express gateway listening server runs on. | `5000` (or dynamic `$PORT`) |
| `MONGODB_URI` | MongoDB connection URL. | `mongodb+srv://user:pass@cluster.mongodb.net/prod` |
| `JWT_SECRET` | Secret key used to sign and verify user JWT sessions. | `yourSuperSecretLongRandomTokenStringHere` |
| `VITE_GEMINI_API_KEY` | (Frontend) Google Gemini API Key used by the AI Coach. | `AIzaSyYourSecretKey...` |

---

## 2. Option A: Monolithic Deployment (Single Server Host)

In this approach, the Express server serves both the Backend API endpoints and the compiled React frontend static files on a single port. This is the **easiest and most cost-effective way** to deploy on Render, Railway, Heroku, or a VPS.

### Step 1: Compile React Frontend
Run the build script in the root directory to generate the optimized static bundle in the `/dist` directory:
```bash
npm run build
```

### Step 2: Configure Monolithic Root scripts
To support hosts that start from the git root directory, verify your root `package.json` contains scripts to build the client and start the server:
```json
"scripts": {
  "build": "vite build",
  "start": "node server/server.js"
}
```

### Step 3: Deploy to Render / Railway
1. Create a new **Web Service** pointing to your GitHub repository.
2. Select environment type: **Node**.
3. Set Build Command:
   ```bash
   npm install && npm run build && cd server && npm install
   ```
4. Set Start Command:
   ```bash
   npm start
   ```
5. In the **Environment Tab**, define the variables (`NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`).
6. Launch! The server will host the frontend at your root URL `https://your-app.onrender.com/` and API endpoints at `https://your-app.onrender.com/api/`.

---

## 3. Option B: Split Deployment (Frontend on Vercel + Backend on Render)

In this approach, you deploy the React client statically to Vercel/Netlify for fast globally-distributed load times, and host the Express API server separately on Render.

### Step 1: Deploy React to Vercel
1. Link your git repo on the **Vercel Dashboard**.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables: Define `VITE_GEMINI_API_KEY`.
6. Deploy! Vercel gives you a frontend URL (e.g., `https://productivity-os.vercel.app`).

### Step 2: Deploy Express to Render
1. Create a **Web Service** on Render.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Define variables (`MONGODB_URI`, `JWT_SECRET`).
6. Deploy! Render gives you a backend API URL (e.g., `https://productivity-api.onrender.com`).

> [!NOTE]
> When doing a split deployment, make sure to update your API request host URL inside React services (e.g. login hooks) to point to your deployed Render server URL instead of `localhost:5000`.
