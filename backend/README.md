# The Living Lab - Production-Ready Backend API

A production-ready, secure, scalable REST API built with Node.js, Express, MongoDB (Mongoose), and modern ES Modules architecture for **The Living Lab** website.

---

## 1. Architecture & Folder Structure

```
backend/
├── .env.example               # Template for environment configuration
├── .gitignore                  # Git ignore rules for node_modules, logs, and secrets
├── package.json                # Project dependencies, scripts, and metadata
├── README.md                   # Complete documentation and deployment guide
├── src/
│   ├── app.js                  # Express application factory & middleware pipeline
│   ├── server.js               # Server bootstrap, 0.0.0.0 binding, graceful shutdown
│   ├── config/
│   │   ├── database.js         # Mongoose connection with honest status reporting
│   │   └── env.js              # Zod-validated environment configuration
│   ├── controllers/
│   │   └── health.controller.js# HTTP request handlers for health endpoints
│   ├── middleware/
│   │   ├── error.middleware.js # Centralized error handler (hides stack in prod)
│   │   ├── notFound.middleware.js # 404 route-not-found handler
│   │   ├── rateLimiter.middleware.js # Public IP rate limiting (Helmet & anti-DDoS)
│   │   └── validation.middleware.js # Generic Zod schema validation middleware
│   ├── models/
│   │   └── index.js            # Clean models registry for future data schemas
│   ├── routes/
│   │   ├── health.routes.js    # Routes for /api/health
│   │   └── index.js            # Central API router mounted at /api
│   ├── services/
│   │   └── health.service.js   # Business logic for system & DB diagnostics
│   ├── utils/
│   │   ├── logger.js           # Structured timestamped logging utility
│   │   └── response.js         # Consistent standard JSON response helpers
│   └── validators/
│       └── health.validator.js # Request schema validators
└── tests/
    └── health.test.js          # Automated integration test suite
```

---

## 2. Technology Stack & Security Features

- **Runtime:** Node.js (v18+ compatible, ES Modules)
- **Framework:** Express.js v4
- **Database:** MongoDB with Mongoose v8
- **Validation:** Zod v3
- **Security:**
  - `helmet`: Comprehensive HTTP security headers (nosniff, dns-prefetch, frameguard, etc.)
  - `cors`: Configurable allowed origins (via `CORS_ORIGIN`)
  - `express-rate-limit`: Prevents brute force and denial of service (100 req / 15 min default)
  - Safe payload size limits (`10kb`) to block JSON buffer overflow attacks
- **Diagnostics:** Honest database reporting — server boots seamlessly even when MongoDB is unconfigured or offline without crashing.

---

## 3. How to Install Dependencies

Navigate to the `backend` directory and install the packages:

```bash
cd backend
npm install
```

---

## 4. How to Configure Environment Variables

1. Copy the `.env.example` file to create your local `.env`:

```bash
cd backend
copy .env.example .env     # On Windows Command Prompt / PowerShell
# OR
cp .env.example .env       # On Linux / macOS / Git Bash
```

2. Open `.env` and adjust the variables as needed:

| Variable | Required? | Default | Description |
|---|---|---|---|
| `PORT` | Optional | `5000` | Port for the Express server to listen on |
| `HOST` | Optional | `0.0.0.0` | Host interface to bind to (`0.0.0.0` for Render) |
| `NODE_ENV` | Optional | `development` | Environment: `development`, `production`, `test` |
| `MONGODB_URI` | Optional | `""` (Empty) | MongoDB Atlas connection string |
| `CORS_ORIGIN` | Optional | `http://localhost:5173` | Allowed frontend origin(s), comma-separated |
| `RATE_LIMIT_WINDOW_MS` | Optional | `900000` (15m) | Window time for rate limiting in ms |
| `RATE_LIMIT_MAX` | Optional | `100` | Max requests per IP per window |

> **Note:** Never commit the `.env` file to Git. It is already added to `.gitignore`.

---

## 5. How to Run Locally

### Start in Production Mode
```bash
npm start
```

### Start in Development Mode (Live reload on file changes)
```bash
npm run dev
```

### Run Automated Tests
```bash
npm test
```

When started, you will see:
```text
===============================================
 The Living Lab API Server Started Successfully
 Environment : development
 Listening on: http://0.0.0.0:5000
 Health check: http://0.0.0.0:5000/api/health
===============================================
```

---

## 6. How to Configure MongoDB Atlas Later

When you are ready to connect MongoDB Atlas:

1. **Create Cluster:**
   - Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
   - Create a free or dedicated cluster (e.g. M0 sandbox).

2. **Database User:**
   - Go to **Database Access** -> **Add New Database User**.
   - Select Password authentication, create a username and strong password.
   - Assign `Read and write to any database` privilege.

3. **Network Access:**
   - Go to **Network Access** -> **Add IP Address**.
   - For local development and Render deployment, choose **Allow Access from Anywhere** (`0.0.0.0/0`).

4. **Get Connection String:**
   - Go to **Database** -> Click **Connect** on your cluster.
   - Choose **Drivers** -> Node.js (version 5.5 or later).
   - Copy the URI string formatted like:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/livinglab?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.
   - Set the database name (e.g., `livinglab`).

5. **Update Environment Variable:**
   - Locally: Paste the connection string into your `backend/.env` under `MONGODB_URI`.
   - On Render: Add `MONGODB_URI` in Render's Environment settings.

---

## 7. How to Deploy on Render Later

To deploy this backend as a Web Service on Render:

1. **Push your code to GitHub / GitLab:**
   Make sure the `backend` folder is pushed to your repository (without `.env`).

2. **Create New Web Service:**
   - Go to your [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** -> **Web Service**.
   - Connect your repository.

3. **Configure Settings:**
   - **Name:** `the-living-lab-backend` (or your preferred name)
   - **Root Directory:** `backend` *(Important: set this so Render runs inside the backend folder)*
   - **Environment:** `Node`
   - **Region:** Choose closest to your users (e.g., Singapore, Frankfurt, Oregon)
   - **Branch:** `main` (or your active branch)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Configure Environment Variables in Render:**
   In the **Environment Variables** tab, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default or leave it to let Render assign)
   - `HOST`: `0.0.0.0`
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://the-living-lab.onrender.com` or `*`)
   - `MONGODB_URI`: Your MongoDB Atlas connection string (once configured)

5. **Deploy:**
   - Click **Create Web Service**.
   - Once deployed, your health check endpoint will be live at:
     `https://<your-service-name>.onrender.com/api/health`

---

## 8. Implemented API Endpoints

### 1. Root Welcome Route
- **Method:** `GET`
- **Path:** `/`
- **Description:** Returns basic service overview and link to health check.
- **Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Welcome to The Living Lab API Service",
  "data": {
    "name": "The Living Lab API",
    "version": "1.0.0",
    "status": "operational",
    "healthCheck": "/api/health",
    "docs": "See backend/README.md for API documentation and deployment instructions"
  }
}
```

---

### 2. System Health & Database Diagnostics
- **Method:** `GET`
- **Path:** `/api/health`
- **Query Parameters:** None required. Optional `verbose=true`.
- **Description:** Returns real-time health diagnostics for the server, API, and MongoDB connection.
- **Response Example (200 OK - When MongoDB is not yet configured):**
```json
{
  "success": true,
  "message": "System operational",
  "data": {
    "server": {
      "status": "healthy",
      "uptimeSeconds": 42,
      "environment": "development",
      "nodeVersion": "v26.13.0",
      "memoryUsage": {
        "rssMb": "48.25",
        "heapUsedMb": "18.30",
        "heapTotalMb": "24.50"
      }
    },
    "api": {
      "status": "active",
      "version": "1.0.0",
      "service": "The Living Lab API"
    },
    "database": {
      "status": "unconfigured",
      "configured": false,
      "host": null,
      "databaseName": null,
      "readyState": "disconnected"
    },
    "timestamp": "2026-11-14T16:35:00.000Z"
  }
}
```

- **Response Example (200 OK - When MongoDB Atlas is connected):**
```json
{
  "success": true,
  "message": "System operational",
  "data": {
    "server": {
      "status": "healthy",
      "uptimeSeconds": 120,
      "environment": "production",
      "nodeVersion": "v26.13.0",
      "memoryUsage": {
        "rssMb": "62.10",
        "heapUsedMb": "28.45",
        "heapTotalMb": "35.20"
      }
    },
    "api": {
      "status": "active",
      "version": "1.0.0",
      "service": "The Living Lab API"
    },
    "database": {
      "status": "connected",
      "configured": true,
      "host": "cluster0.abcde.mongodb.net",
      "databaseName": "livinglab",
      "readyState": "connected"
    },
    "timestamp": "2026-11-14T16:35:00.000Z"
  }
}
```

---

### 3. Error Responses (Standard Format)
- **404 Not Found:**
```json
{
  "success": false,
  "message": "Cannot GET /api/unknown - Route not found"
}
```

- **429 Too Many Requests (Rate limit exceeded):**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## 9. How to Test APIs Using Postman

1. **Install & Open Postman:**
   Download from [postman.com](https://www.postman.com/) or open the Web Client / Desktop App.

2. **Test Root Route:**
   - **Method:** `GET`
   - **URL:** `http://localhost:5000/`
   - Click **Send**.
   - Verify `Status: 200 OK` and `{ success: true }`.

3. **Test Health Endpoint:**
   - **Method:** `GET`
   - **URL:** `http://localhost:5000/api/health`
   - Click **Send**.
   - Verify:
     - `server.status` is `"healthy"`
     - `database.status` is `"unconfigured"` (or `"connected"` once MongoDB is configured)
     - `timestamp` reflects current time.

4. **Test 404 Route:**
   - **Method:** `GET`
   - **URL:** `http://localhost:5000/api/non-existent-route`
   - Click **Send**.
   - Verify `Status: 404 Not Found` and `success: false`.

5. **Test Rate Limiting (Optional):**
   - In Postman, use the **Collection Runner** to send 105 rapid GET requests to `http://localhost:5000/api/health`.
   - The first 100 will return `200 OK`.
   - Requests 101+ will return `429 Too Many Requests`.
