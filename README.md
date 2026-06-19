# Go Mentorship Platform (Frontend – Admin Panel)

Administrative dashboard for the Go mentorship platform. Built with React 18, Vite 5, TypeScript, Tailwind CSS, and HeroUI. Manages users, roadmap blocks, materials, achievements, and 1‑on‑1 requests.

## Prerequisites

- Node.js v18+
- Docker v24.0+
- Docker Compose v2.20+

## Quick Start

1. Clone the repository and navigate to the project root directory:
   ```bash
   git clone https://github.com
   cd mentorship-frontend-admin
   ```

2. Production build and deployment via Docker Compose:
   ```bash
   docker compose build --build-arg VITE_PUBLIC_API_URL=http://localhost:8080
   docker compose up -d
   ```
   The admin panel will be available at http://localhost:3001.

## Local Development

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Credentials

Use these pre-seeded credentials for local demo environments:

- **Login**: `admin`
- **Password**: `admin123`

## Tech Stack

- React 18
- Vite 5 (Single Page Application)
- React Router DOM v6 (Client-side routing layout)
- TypeScript
- Tailwind CSS (Dark/Light mode support via CSS variables)
- HeroUI (Table, Card, Button, Modal, Tabs)
- Iconify (Icon system)
- Sonner (Toast notifications)
- next-themes (Theme management mapping)

## Features

- **Dashboard** — Platform statistics including users, students, buddies, 1:1 requests, and issued achievements.
- **User Management** — Complete CRUD operations, soft deletion, role assignment, and buddy-to-student assignments.
- **Roadmap Blocks** — Complete CRUD operations, sorting mechanics, and block activation/deactivation toggles.
- **Study Materials** — Material card management (theory, questions, practice, homework) linked to specific blocks with required/optional status flags.
- **Achievements** — Gamification mechanics including title, description, rewards, custom icons, and user distribution tracking.
- **1:1 Requests** — Approval, rejection, and completion workflows with automated 1,000 bonus point deductions.
- **Progress Overview** — Administrative bypass to approve educational blocks directly without requiring buddy validation.

## Environment Variables

- `VITE_PUBLIC_API_URL` — URL of the backend API service (defaults to http://localhost:8080)
- `VITE_PUBLIC_MAIN_SITE_URL` — URL of the primary student/mentor platform interface

## Verification and Setup

### CORS Configuration

The backend service must accept requests originating from http://localhost:3001. Verify that this origin is explicitly included in the backend `ALLOWED_ORIGINS` configuration.

### API Authentication Probe

Verify API routing and authentication using the login endpoint:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}'
```

### Creating Initial Curriculum Materials

1. Navigate to the Blocks section at port 3001 and create a new block (e.g., "Introduction to Go").
2. Navigate to the Materials section and attach study items (theory, practice exercises) to the newly created block.
3. Once completed, the materials automatically populate the student's roadmap interface on the primary website.

### Seeding Demo Accounts

If the required test profiles are missing from your environment, seed them via the registration API or create them through the user management interface:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"login":"test_student","password":"123","display_name":"Test Student","roles":["student"]}'

curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"login":"test_buddy","password":"123","display_name":"Test Buddy","roles":["buddy"]}'
```
