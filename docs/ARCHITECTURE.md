# Autonomous Media OS — Architecture

## Overview

Autonomous Media OS is a human-supervised pipeline for turning a content brief into a reviewed, renderable, and publishable video asset.

The system is intentionally simple for a solo founder: one app, one workflow, one review queue, and clear auditability.

---

## High-Level Architecture

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                             Frontend (Web App)                               │
│                                                                              │
│  - Dashboard                                                                    │
│  - Channel setup                                                               │
│  - Brief creation                                                               │
│  - Idea list + scoring                                                          │
│  - Script review and revisions                                                 │
│  - Render queue and publishing                                                  │
│  - Audit trail                                                                  │
│                                                                              │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │ HTTPS / REST / WebSocket
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                             API Layer (Backend)                                │
│                                                                              │
│  - Auth + sessions                                                              │
│  - Channel/Brief/Idea/Script APIs                                              │
│  - Review & approval workflows                                                │
│  - Render job orchestration                                                    │
│  - Compliance checks                                                          │
│  - Audit log and versioning                                                    │
│                                                                              │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ Core Domain App  │  │ Rule Engine          │  │ AI Orchestration      │
│                  │  │                      │  │                      │
│ - Channel        │  │ - Brand rules        │  │ - Idea generation    │
│ - Brief          │  │ - Compliance         │  │ - Script generation   │
│ - Idea           │  │ - Fact validation     │  │ - Prompt versioning   │
│ - ScriptDraft    │  │ - Risk classification │  │ - Revisions           │
│ - Review         │  │ - Policy checks      │  │ - Structured output  │
│ - RenderJob      │  │                      │  │                      │
│ - PublishRecord  │  │                      │  │                      │
└──────────────────┘  └──────────────────────┘  └──────────────────────┘
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                       Data & Infra Services                                    │
│                                                                              │
│  PostgreSQL: core app and versioned state                                    │
│  Redis: queues, caching, job coordination                                     │
│  Object storage: render outputs, thumbnails, uploads                         │
│  OpenAI / LLM providers: idea + script generation                              │
│  Render service: FFmpeg / video pipeline                                      │
│  Analytics / metrics pipeline                                                 │
│  Notifications: email / push / webhooks                                       │
│                                                                              │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         External Integrations                                  │
│                                                                              │
│  - Google OAuth / Auth provider                                              │
│  - Social publishing platforms                                               │
│  - Analytics providers                                                       │
│  - Optional fact sources / citation providers                                 │
│  - Optional cloud render providers                                            │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Layered Architecture

### 1. Presentation Layer

Responsibilities:
- Authentication and session management
- Dashboard and editor UI
- Channel setup and brief creation
- Idea review and ranking
- Script editing and final review
- Publish and archive flows

Recommended stack for solo-founder MVP:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand or React Query for state

### 2. Application Layer

Responsibilities:
- Orchestrate domain operations
- Validate inputs and business rules
- Invoke AI generation jobs
- Trigger compliance checks
- Manage state transitions and approval flow
- Track audit history

Recommended stack:
- Node.js + NestJS or Fastify
- TypeScript
- Zod validation
- event-driven job orchestration

### 3. Domain Layer

Core entities:
- Channel
- Brief
- Idea
- ScriptDraft
- Review
- RenderJob
- PublishRecord
- FactCheck
- ComplianceCheck

Business rules:
- Brief is source of truth
- AI output only accepted with review
- Publish requires human approval
- Every script has immutable version history
- Render jobs map back to approved script version

### 4. Integration Layer

Responsibilities:
- LLM access
- Render service integration
- Object storage
- Publishing APIs
- Notifications
- Analytics

Typical services:
- OpenAI API or Azure OpenAI
- FFmpeg-based render pipeline
- Cloud object storage (Supabase Storage / AWS S3 / Cloudflare R2)
- Social platform APIs
- PostHog / Mixpanel / GA4 for analytics

### 5. Data Layer

Primary database:
- PostgreSQL

Cache / queue:
- Redis

Storage:
- Object storage for rendered files and uploads

---

## Domain Model Walkthrough

```text
Channel
  └── Brief
      └── Idea
          └── ScriptDraft
              ├── Review
              ├── FactCheck
              ├── ComplianceCheck
              └── RenderJob
                   └── PublishRecord
```

Important rule:
- Every generated artifact inherits the brief context and review trail.
- No artifact should be able to escape the state machine without proper authorization and approval.

---

## Workflow Architecture

### 1. Brief Intake

```text
User -> API -> Brief Service -> Database
                                -> Rule Engine validates constraints
```

### 2. Idea Generation

```text
Brief -> AI Service -> Candidate Ideas -> Scoring Engine -> DB
                                    \-> Risk and compliance checks
```

### 3. Script Drafting

```text
Selected Idea -> AI Service -> ScriptDraft -> FactCheck -> DB
                                          -> ComplianceCheck
```

### 4. Human Review

```text
ScriptDraft -> Review Queue -> Reviewer -> Decision
                                   |-- Approve --> Render Job
                                   |-- Needs Revision --> AI Rewrite
                                   |-- Reject --> Archive
```

### 5. Render + Publish

```text
Approved Script -> Render Service -> Final video asset -> QA -> Publish API
                                                       \-> Metrics collection
```

---

## State Machine

```text
DRAFT
  -> ACTIVE
  -> IDEA_GENERATED
  -> IDEA_SELECTED
  -> SCRIPT_DRAFTED
  -> FACT_CHECKED
  -> COMPLIANCE_CHECKED
  -> IN_REVIEW
  -> APPROVED
  -> RENDER_QUEUED
  -> RENDERING
  -> RENDERED
  -> FINAL_QA
  -> PUBLISHED

REJECTED / NEEDS_REVISION / FAILED can branch from any review or render phase
```

Implementation recommendation:
- Use a strongly typed enum for each state
- Keep a `state_history` table for auditability
- Use event-sourced style for approval transitions if complexity grows

---

## Functional Modules

### Auth & Users
- Login / session management
- User profile and org membership
- Role management

### Channel Module
- Channel creation and editing
- Brand rules management
- Publishing defaults

### Brief Module
- Create and edit brief
- Store constraints and source facts
- Link to candidate ideas and outputs

### Idea Module
- Generate ideas
- Score ideas
- Mark selected or rejected

### Script Module
- Generate draft scripts
- Versioning and revisions
- Compare script versions

### Review Module
- Review queue
- Approval / rejection / revision actions
- Notes and comments

### Validation Module
- Fact-checking
- Compliance check
- Risk scoring

### Render Module
- Job queue
- Task execution
- Artifact storage
- Final QA

### Publishing Module
- Publish to social platform
- Link back to final publish record
- Trigger analytics events

### Metrics & Analytics Module
- Views, watch time, engagement
- Approval rate by channel
- Rejection reasons
- Output performance trends

---

## Technology Recommendations (Bootstrap-Friendly)

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- App Router
- React Query
- shadcn/ui for clean admin interfaces

### Backend
- NestJS or Fastify
- TypeScript
- PostgreSQL ORM (Prisma or TypeORM)
- BullMQ or Redis queue
- Zod validation

### Database
- PostgreSQL
- Prisma schema for migrations
- JSONB used for flexible metadata and AI outputs if needed

### Infra
- Vercel for frontend
- Render / Railway / Fly.io for backend
- PostgreSQL managed service
- Redis managed service
- S3-compatible object storage

### AI
- OpenAI API or Azure OpenAI
- Prompt versioning store
- Model metadata in DB

### Rendering
- FFmpeg + job queue
- Optional cloud render service in v2

---

## Data Flow Diagram

```text
User Action
   ↓
Frontend
   ↓
REST API
   ↓
Application Service
   ├── Domain Validation
   ├── Database writes
   ├── Queue job creation
   ├── AI orchestration trigger
   └── Compliance + review triggers
         ↓
PostgreSQL / Redis / Object Storage
         ↓
AI workers / Render workers
         ↓
Generated artifacts
         ↓
Review + approval
         ↓
Publish pipeline
```

---

## Security & Compliance

### Authentication
- Email auth with magic link / OAuth
- Session-based auth with JWT or secure cookie
- Role-based access to channels and briefs

### Authorization
- Creator owns channel and data
- Reviewer can view assigned content only
- Admins can manage global config

### Auditability
- Log every state transition and action
- Store user, timestamp, source, and change payload
- Keep immutable event trail for outputs

### Privacy
- Avoid storing sensitive personal info in prompts or logs
- Redact or protect user-generated assets

---

## Scalability Considerations

### v1 (solo founder)
- Single app instance
- Single DB
- Single queue worker
- One render worker

### v2
- Multi-tenant support
- Multiple render workers
- More channels and users
- Team review roles and access groups

### v3
- More channels and cross-channel analytics
- AI-driven ranking and content optimization
- Workflow templates and standard operating procedures

---

## Risks & Mitigations

### Risk: Fact hallucination
Mitigation:
- strict input from brief only
- fact checking before review
- source references required for claims

### Risk: Brand drift
Mitigation:
- channel-level style rules
- hard compliance checks
- reviewer signoff before publish

### Risk: Repetitive output
Mitigation:
- prompt variation and variation scoring
- human review for novelty and quality
- feedback loop from published performance

### Risk: Publishing mistakes
Mitigation:
- final QA before publish
- approval trail and log retention
- staged release for cautious channels

---

## Recommended MVP Architecture Summary

For the solo founder / bootstrap build, keep it simple:
- Web app only
- Postgres for all core state
- Redis for background job queues
- One render worker
- One AI generation worker
- Single channel workflow
- Human approval required for publish

This provides a strong foundation without over-engineering.

---

## Suggested Repo Structure

```text
app/
  web/
  api/
  worker/
  render/

packages/
  shared/
  ui/

infra/
  docker/
  scripts/

services/
  llm/
  render/
  analytics/

prisma/
  schema.prisma
```

---

## Bottom Line

The right architecture is not a complicated multi-agent system. It is a clean editorial pipeline with clear state transitions, firm guardrails, and human approval at the final gate.

This keeps the product:
- easier to build
- cheaper to maintain
- safer in production
- stronger for a bootstrap founder

---

## Suggested Next Step

Build the MVP around these core modules:
1. Channel management
2. Brief creation
3. Idea generation + scoring
4. Script drafting
5. Validation
6. Review queue
7. Render + publish

Everything else can wait until there is real usage data.
