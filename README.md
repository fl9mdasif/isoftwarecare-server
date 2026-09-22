# Interactive Software Care — Server

Backend API for **Interactive Software Care**, an IT/software solutions agency (web development, AI/SaaS builds, app development, digital marketing, CRM/ERP, graphics & video editing). This service powers the agency's own company website: a lead-generation and credibility site. There are no payments and no public customer accounts — the only public-facing write operation is the contact/lead form.

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| Language | TypeScript (`strict`) |
| Database | MongoDB via Mongoose |
| Validation | Zod |
| Auth | JWT (access + refresh) with bcrypt password hashing |
| Security | Helmet, `express-rate-limit`, a hand-rolled Mongo-injection sanitizer |

See [`SERVER-ARCHITECTURE.md`](./SERVER-ARCHITECTURE.md) for the full backend conventions this project follows.

## Features

- **Auth** — staff/admin/superAdmin login, refresh, logout, change password, profile. No public self-registration.
- **User** — superAdmin/admin can provision staff and admin accounts; only a superAdmin can create or promote to `admin`.
- **Category** — shared taxonomy used by services and portfolio items.
- **Service** — the agency's service offerings, publicly listed and admin-managed.
- **Portfolio** — case studies / past work, categorized, publicly listed.
- **Testimonial** — client testimonials with an approval workflow; nothing is public until a staff/admin approves it.
- **Lead** — the public contact-form endpoint. Rate-limited, honeypot spam filtering, and server-side field allowlisting so a submission can never set its own status or internal notes.
- **Settings** — singleton config for marketing pixel IDs (Facebook, GA, GTM, Search Console) and public contact/social info.
- **Sitemap** — `GET /sitemap.xml`, generated from active services and portfolio items, mounted at the app root.

## Roles

| Role | Access |
|---|---|
| `staff` | Manage leads and testimonials; no delete access on published content |
| `admin` | Full content management, including delete |
| `superAdmin` | Everything `admin` can do, plus creating other admins; seeded automatically on first boot |

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (Atlas or self-hosted)

### Install

```bash
npm install
```

### Configure environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port the server listens on |
| `DATABASE_URL` | MongoDB connection string |
| `BCRYPT_SALT_ROUND` | bcrypt hashing cost factor |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | JWT signing secrets — use long random strings |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes (e.g. `10d`, `100d`) |
| `ADMIN_EMAIL` | Public contact email surfaced via the settings module |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASS` | Credentials for the superAdmin account seeded on first boot |
| `SITE_URL` | Public site base URL, used to build `sitemap.xml` |
| `CLIENT_URL` | Comma-separated list of allowed CORS origins for the deployed frontend |

### Run

```bash
npm run dev     # local development, auto-restarts on change
npm run build   # type-check and compile to dist/
npm start       # run the compiled build (after npm run build)
```

On first boot, a `superAdmin` account is automatically seeded from `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASS` if one doesn't already exist.

## API Overview

All routes are mounted under `/api/v1`, except `sitemap.xml` which is served at the app root.

| Module | Base path | Public | Staff | Admin / superAdmin |
|---|---|---|---|---|
| Auth | `/api/v1/auth` | login, refresh, logout | profile, change password | — |
| User | `/api/v1/users` | — | — | create/list/update/deactivate staff accounts |
| Category | `/api/v1/categories` | list, get | — | create, update, delete |
| Service | `/api/v1/services` | list (active), get | — | create, update, delete |
| Portfolio | `/api/v1/portfolio` | list, get | — | create, update, delete |
| Testimonial | `/api/v1/testimonials` | list (approved only) | create, update, approve | delete |
| Lead | `/api/v1/leads` | submit | list, update status | list, update status |
| Settings | `/api/v1/settings` | get | — | update |
| Sitemap | `/sitemap.xml` | get | — | — |

## Security

- `helmet()` on every response, plus an explicit CORS allowlist (never `*`).
- A hand-rolled `sanitizeInput` middleware strips Mongo-operator (`$...`) and dot-path keys from `req.body`/`req.params` — not `express-mongo-sanitize`, which breaks under Express 5.
- Every mutating route is validated with Zod via `validateRequest`.
- Every protected route names its allowed roles explicitly through `auth(...)`.
- `POST /leads`, the only open public write endpoint, is rate-limited, honeypot-filtered, and only ever persists an explicit allowlist of fields — a submission can never set its own `status` or internal `note`.
- `note` on a lead is staff/admin-internal only and is never returned by any endpoint a public client can reach.
- A testimonial's `isApproved` defaults to `false` — nothing appears publicly the moment it's created.

## Project Structure

```
src/
  app.ts                  # Express app: security middleware, CORS, route mounting
  server.ts               # Entry point: DB connect, seed, listen
  app/
    config/                # Environment variable loading
    db/                     # superAdmin seed logic
    errors/                  # AppError class
    interface/                # Shared/global TypeScript types
    middlewares/               # auth, validation, rate limiting, sanitization, error handling
    utils/                       # catchAsync, sendResponse, slugify
    routes/                       # Aggregates and mounts every module's router
    modules/
      auth/ user/ category/ service/ portfolio/ testimonial/ lead/ settings/ sitemap/
```

Each module follows the same file shape: `interface.<name>.ts`, `model.<name>.ts`, `validation.<name>.ts`, `service.<name>.ts`, `controller.<name>.ts`, `route.<name>.ts`.
