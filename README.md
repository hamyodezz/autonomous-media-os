# Autonomous Media OS

A human-supervised AI media operating system for short-form video channels.

## What this repository contains

This repo includes:
- a product specification
- architecture and systems design docs
- database schema
- roadmap
- MVP PRD
- starter monorepo for a bootstrap-friendly implementation

## Tech stack

- Frontend: Next.js + TypeScript + Tailwind
- Backend: Fastify + TypeScript
- Database: PostgreSQL
- Queue/cache: Redis
- AI: OpenAI-compatible API
- Render: FFmpeg job workers

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the web app:

```bash
npm run dev
```

3. Start the API:

```bash
npm run dev:api
```

## Defaults

- Web app runs on http://localhost:3000
- API runs on http://localhost:4000

## Repository structure

```text
apps/
  web/
  api/

docs/
```

## MVP focus

The initial implementation focuses on:
- channel setup
- brief creation
- idea generation + scoring
- script drafting
- review flow
- render queue
- publish pipeline

This intentionally avoids full autonomous publishing in v1.
