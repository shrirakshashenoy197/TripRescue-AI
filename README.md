# TripRescue AI

**Recover your journey. Compare smarter alternatives.**

TripRescue AI is a beginner-friendly hackathon prototype that helps travellers compare illustrative alternatives after a travel disruption. It uses a React/Vite frontend and a Node.js/Express backend. The backend runs a transparent, rule-based recovery engine against sample journey data.

> **Prototype disclaimer:** All routes, fares, durations, arrival times, and connection details are illustrative sample data. This project does not use live railway or bus schedules, live traffic, live ticket availability, confirmed prices, ticket booking, or transport-operator integrations. The recovery engine is rule-based; it does not call a paid AI API and should not be described as a fully autonomous AI agent.

## Problem

When a journey is delayed, cancelled, or otherwise disrupted, travellers may need to compare alternatives quickly while balancing cost, duration, arrival deadlines, and connection feasibility.

## Proposed solution

TripRescue AI accepts a sample journey, disruption type, budget, and required arrival deadline. Its backend scores the sample alternatives using explicit rules and returns a ranked comparison with reasons and feasibility warnings.

## Features

- Responsive dashboard for laptop and mobile screens.
- Sample journeys: Mangaluru–Bengaluru, Bengaluru–Mysuru, and Mangaluru–Udupi.
- Disruption choices: delay, cancellation, missed connection, and route unavailable.
- Budget and required arrival deadline inputs.
- Backend API validation and error handling.
- Transparent suitability score and ranked alternatives.
- Feasibility indicators and reasons explaining budget/deadline/connection issues.
- No paid API keys or external service account required.

## Technology stack

- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express, CORS
- Data: local sample data in `server/sampleData.js`

## Folder structure

```text
TripRescue-AI/
├── README.md
├── .gitignore
├── client/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── styles.css
└── server/
    ├── package.json
    ├── server.js
    ├── sampleData.js
    └── recoveryEngine.js
```

## Prerequisites

1. Install a current **Node.js LTS** release (Node.js 20 or newer recommended). npm is included with Node.js.
2. Install Visual Studio Code.
3. Extract `TripRescue-AI.zip` to a folder on your laptop.

## Installation

Open the extracted **TripRescue-AI** folder in VS Code.

### 1. Install backend dependencies

Open **Terminal → New Terminal** in VS Code and run:

```bash
cd server
npm install
```

### 2. Install frontend dependencies

Open a **second terminal** in VS Code (Terminal → New Terminal) and run:

```bash
cd client
npm install
```

## Run the project

### Start backend

In the first terminal, from the project root:

```bash
cd server
npm start
```

The backend should report that it is listening at `http://localhost:5000`.

### Start frontend

In the second terminal, from the project root:

```bash
cd client
npm run dev
```

Vite will show a local URL, normally `http://localhost:5173`. Open that URL in your browser. Keep both terminals running while you use the app.

## Test the recovery flow

1. Open `http://localhost:5173`.
2. Choose a journey.
3. Choose a disruption type.
4. Enter a non-negative budget (for example, `1500`).
5. Choose the required arrival deadline. The default is set to a future date/time for convenience; adjust it if needed.
6. Click **Find recovery options**.
7. The page sends a POST request to the Express backend and displays the returned ranked alternatives.
8. Try a very low budget or an early deadline to see why options may be unsuitable.

## Local URLs

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/api/health`
- Journeys: `http://localhost:5000/api/journeys`
- Disruptions: `http://localhost:5000/api/disruptions`

The Vite development server proxies `/api` requests to the backend at port 5000.

## API endpoints

### `GET /api/health`

Returns a simple backend status response.

### `GET /api/journeys`

Returns the sample journey list and available alternative options.

### `GET /api/disruptions`

Returns supported disruption types.

### `POST /api/recover`

Example request body:

```json
{
  "journeyId": "mangaluru-bengaluru",
  "disruption": "delay",
  "budget": 1500,
  "arrivalDeadline": "2027-01-01T20:00"
}
```

The endpoint validates the input and returns ranked sample alternatives, the scoring explanation, and whether each option satisfies the budget, deadline, and connection requirements.

## Recovery score (0–100)

The score is calculated from the alternative's sample cost, duration, estimated arrival, and connection feasibility:

- **Cost (0–35 points):** lower cost relative to the user's budget receives more points. If the option exceeds the budget, it receives zero cost points.
- **Duration (0–30 points):** shorter estimated journeys receive more points, based on the sample duration range.
- **Deadline (0–25 points):** options arriving by the user's deadline receive full deadline points; later arrivals receive zero.
- **Connection (0–10 points):** options marked as having a feasible connection receive these points.

The score is a comparison aid, not a guarantee. Feasibility is separately reported. Options satisfying all three constraints (budget, deadline, and connection) are ranked before infeasible options; then score and cost are used to order results. If no option satisfies every constraint, the UI says so and still shows alternatives with reasons.

## Sample-data disclaimer

All journey data is fictional/illustrative for demonstration. Estimated costs and arrival times are not verified transport information. Do not use the results to make real travel decisions without checking official transport providers.

## Current limitations

- No live railway, bus, airline, traffic, or weather feeds.
- No ticket availability checks or actual booking.
- No verified fare or timetable information.
- Rule-based scoring, not a trained machine-learning model or autonomous AI agent.
- Sample alternatives are limited to the routes bundled with the project.

## Future enhancements

- Integrate authorised live transport and disruption APIs.
- Add user preferences such as accessibility, number of transfers, and preferred transport mode.
- Add verified fare and timetable freshness timestamps.
- Add a map view and clearer transfer buffers.
- Evaluate ranking quality with real, permissioned datasets.
- Add optional notifications after integrating a trusted service.

## Upload to GitHub

1. Create a repository on GitHub. Do not add secrets or private personal information.
2. Open the extracted `TripRescue-AI` folder in VS Code.
3. Open a terminal in the project root and run:

```bash
git init
git add .
git commit -m "Initial TripRescue AI prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the example remote URL with the URL of your own empty GitHub repository. If Git is not installed, install it first. You can also use VS Code's Source Control panel.

## Troubleshooting

- **`npm` is not recognized:** install Node.js LTS, then fully restart VS Code.
- **Port 5000 is busy:** stop the other process or change the backend port and the Vite proxy target together.
- **Frontend says it cannot connect:** make sure the backend terminal is still running at port 5000.
- **Dependencies fail to install:** check your internet connection and Node.js version, then run `npm install` again in the relevant folder.


## Deploy online (free-tier options; provider terms may change)

A simple setup is to host the backend on **Render** and the frontend on **Vercel**. You will need a GitHub account and will first push this project to a GitHub repository. This does not add live travel data; the deployed app still uses illustrative sample data.

### A. Push the project to GitHub

Follow the GitHub steps above. Make sure the repository contains both `client/` and `server/` folders.

### B. Deploy the backend on Render

1. Open the official Render website and sign in.
2. Choose **New → Web Service**, then connect your GitHub repository.
3. If asked to choose a root directory, set it to `server`.
4. Use these settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Create the service and wait for deployment to finish.
6. Copy the service URL, for example `https://your-service-name.onrender.com`.
7. Test `https://YOUR-BACKEND-URL/api/health` in a browser. It should return JSON with `"status":"ok"`.

The backend uses the `PORT` value supplied by the host. No API key is required. On some free hosting plans, the service may sleep when idle and take a little time to wake up.

### C. Deploy the frontend on Vercel

1. Open the official Vercel website and sign in.
2. Choose **Add New → Project** and import the same GitHub repository.
3. Set **Root Directory** to `client`.
4. Framework preset should be **Vite**. Use the default build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Before deploying, add this environment variable in the project settings:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** the full Render backend URL, e.g. `https://your-service-name.onrender.com`
   - Do not add `/api` at the end and do not add a trailing slash.
6. Deploy the project. Open the Vercel URL after deployment finishes.

If you add or change the environment variable after deployment, redeploy the frontend so the new value is included in the build.

### D. Verify the deployed app

1. Open the Vercel frontend URL.
2. The top-right status should show **Prototype online** after the backend responds.
3. Select a journey and disruption, enter a budget and future arrival deadline, then click **Find recovery options**.
4. If the frontend says the backend is offline, first open the Render `/api/health` URL. If that does not return JSON, check the Render deployment logs and service URL.
5. If health works but the frontend cannot fetch results, confirm `VITE_API_BASE_URL` is exactly the Render base URL, save the setting, and redeploy.

### Important deployment notes

- The frontend is configured to use `VITE_API_BASE_URL` when deployed. If it is blank during local development, Vite's `/api` proxy forwards requests to `http://localhost:5000`.
- The backend currently permits cross-origin requests with CORS for this student prototype. For a production service with private data, restrict CORS to your actual frontend domain.
- Free hosting policies and limits can change. Check each provider's current plan details before relying on it for a demo.
- This is a prototype with sample data and rule-based scoring—not live travel information, actual bookings, or a fully autonomous AI agent.

### live demo
 Frontend: https://triprescue-ai.onrender.com
 Backend: https://triprescue-ai.onrender.com
