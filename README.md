# TOCA Football Player Portal

A full-stack web app where players log in with their email and instantly see their training history, upcoming sessions, and performance stats — all in a clean, Apple-inspired interface.

---

## Stack

| | |
|---|---|
| **Frontend** | React + TypeScript + Vite |
| **Styling** | TailwindCSS v4 + Shadcn UI |
| **Routing** | React Router v6 |
| **Backend** | Node.js + Fastify + TypeScript |
| **Data** | JSON files (no database) |

---

## Running Locally

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/Krishiv111/TOCA-Football.git
cd TOCA-Football
```

### 2. Install dependencies
```bash
npm install
```

This installs packages for the root, `client/`, and `server/` workspaces in one go.

### 3. Start the dev servers
```bash
npm run dev
```

This runs both servers concurrently:

| Server | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Fastify) | http://localhost:3001 |

Open http://localhost:5173 in your browser and sign in with one of the demo emails below.

---

## Demo Accounts

| Name | Email |
|---|---|
| Sabrina Williams | sabrina.williams@example.com |
| Morgan Johnson | morgan.johnson@example.com |
| Alex Jones | alex.jones@example.com |

---

## Project Structure

```
toca-player-portal/
├── client/                            # React frontend
│   └── src/
│       ├── context/AuthContext.tsx    # Email auth via localStorage
│       ├── layouts/AppLayout.tsx      # Sticky header + nav
│       ├── lib/api.ts                 # Typed fetch helpers
│       └── pages/
│           ├── SignIn.tsx             # Email entry
│           ├── Home.tsx               # Dashboard
│           ├── SessionDetail.tsx      # Single session view
│           ├── Profile.tsx            # Player stats + info
│           └── About.tsx              # About TOCA
│
└── server/                            # Fastify backend
    └── src/
        ├── data/
        │   ├── profiles.json          # Player profiles
        │   ├── trainingSessions.json  # Past sessions
        │   └── appointments.json      # Upcoming appointments
        └── routes/
            ├── players.ts             # GET /api/players/:email
            └── sessions.ts            # GET /api/sessions/:id
                                       # GET /api/players/:email/sessions
                                       # GET /api/players/:email/appointments
```

---

## Pages

**Sign In** — Enter any demo email to access the portal. No password required.

**Home** — Time-aware greeting, quick stat cards (sessions, avg score, best streak), upcoming appointments as gradient cards, and a scrollable training history list with inline score rings.

**Session Detail** — Animated SVG score ring with color-coded performance label (Excellent / Good / Keep Going), plus a full stats grid: balls touched, goals scored, best streak, avg speed, exercises, and duration.

**Profile** — Avatar with initials, stat summary, and a complete details card including DOB, phone, training center, and member since date.

**About** — TOCA mission, global stats, feature highlights, and coaching philosophy.

---

## How Auth Works

There's no real authentication. Entering an email stores it in `localStorage` via `AuthContext`. All inner routes are protected — if no email is stored, the app redirects to the sign-in screen. Clicking "Sign out" clears the stored email.

---

## API

The Vite dev server proxies all `/api/*` requests to `localhost:3001`, so the frontend never hardcodes the backend URL.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/players/:email` | Player profile |
| `GET` | `/api/players/:email/sessions` | Past training sessions |
| `GET` | `/api/players/:email/appointments` | Upcoming appointments |
| `GET` | `/api/sessions/:id` | Single session detail |
