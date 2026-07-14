# Run and deploy your Personal Finance Management System

This app stores all finance data in **PostgreSQL running in Docker**.

## Prerequisites

- Node.js
- Docker Desktop (or Docker Engine + Compose)

## Run Locally

1. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy env file and set your Gemini key (optional for AI features):
   ```bash
   cp .env.example .env.local
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

Open http://localhost:3000 — you'll be asked to **sign up** or **log in**. Each user has their own isolated finance data.

## Database

| Setting | Default |
|---------|---------|
| Host | `localhost` |
| Port | `5433` |
| Database | `personal_finance` |
| User | `pfms` |
| Password | `pfms_secret` |

Schema is applied automatically on first container start from `db/init/01-schema.sql`.

Useful commands:
```bash
docker compose ps
docker compose logs -f postgres
docker compose down
```
