# TOCA-Football

What It Is
A TOCA Football Player Portal — a web app where players log in with their email and can see their training history, upcoming sessions, and profile stats.

Architecture: Two Separate Servers

root/
├── client/   ← React frontend (Vite, port 5173)
└── server/   ← Node.js backend (Fastify, port 3001)
Running npm run dev at the root starts both simultaneously using concurrently.

Backend (server/)
Built with Fastify (a fast Node.js HTTP framework). It has two route files:

players.ts — one endpoint:

GET /api/players/:email → looks up a player by email in profiles.json, returns their profile
sessions.ts — three endpoints:

GET /api/sessions/:id → returns a single training session by ID
GET /api/players/:email/sessions → returns all past sessions for a player (filtered by startTime <= now)
GET /api/players/:email/appointments → returns all future appointments (filtered by startTime > now)
All data comes from three JSON files in server/src/data/:

File	Contains
profiles.json	Player info (name, email, DOB, phone, center)
trainingSessions.json	Past sessions (score, balls, goals, streak, speed)
appointments.json	Future bookings (trainer, start/end time)
Frontend (client/)
Built with React + TypeScript, using React Router for navigation and TailwindCSS for styling.

Auth Flow
AuthContext.tsx stores the player's email in localStorage. It's not real authentication — just a way to remember who's "signed in" so pages know which player's data to fetch.

Page Structure

/ (SignIn)     ← enter your email
/home          ← past sessions + upcoming appointments
/sessions/:id  ← detail view for one training session
/about         ← info about TOCA
/profile       ← player profile + stats
App.tsx wraps the inner routes in a ProtectedRoute that redirects to / if no email is stored. All inner pages share the AppLayout (header + nav).

Data Flow
api.ts has typed fetch helpers. Each page calls those helpers on mount (useEffect), stores the result in useState, and renders it. For example:

Home calls getPlayer() + getSessions() + getAppointments()
Profile calls getPlayer() + getSessions() (to compute avg score, best streak, total balls)
SessionDetail calls getSession(id) using the ID from the URL
The client runs on port 5173, but calls to /api/... are proxied by Vite to localhost:3001 — so the React code never needs to hardcode the backend URL.

The UI
Apple-inspired design system:

#f5f5f7 light gray background
White rounded-2xl cards with subtle shadows
Sticky frosted-glass header (backdrop-blur)
SVG score ring on the session detail page (animated arc showing score out of 100)
Color-coded scores: green ≥ 90, blue ≥ 75, amber below
