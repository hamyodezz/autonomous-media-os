# Autonomous Media OS — Database Schema

## Overview

This schema supports a human-supervised editorial pipeline for short-form video creation.

The database is intentionally designed for traceability, review, versioning, and incremental risk control.

---

## Core Principles

- Every output must trace back to a brief and channel
- Scripts are versioned, not overwritten
- Reviews and approvals are captured with metadata
- Render jobs must map to a specific approved script version
- Historical state changes are preserved

---

## Entity Relationship Overview

```text
users
  └── channels
       └── briefs
            └── ideas
                 └── script_drafts
                      ├── fact_checks
                      ├── compliance_checks
                      ├── reviews
                      └── render_jobs
                           └── publish_records
```

---

## 1. Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'creator',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Notes
- `role` may be `creator`, `reviewer`, `admin`
- Future-proof for multiple users per channel

---

## 2. Channels

```sql
CREATE TABLE channels (
  id UUID PRIMARY KEY,
  owner_user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  tone VARCHAR(255),
  audience VARCHAR(255),
  brand_guidelines JSONB,
  rules JSONB,
  publishing_defaults JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Examples of `rules`
```json
{
  "allowed_topics": ["AI", "productivity", "creators"],
  "banned_topics": ["politics", "medical advice"],
  "forbidden_claims": ["guaranteed income", "instant results"],
  "asset_restrictions": ["no copyrighted music", "no third-party logos"]
}
```

---

## 3. Briefs

```sql
CREATE TABLE briefs (
  id UUID PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES channels(id),
  created_by_user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  objective TEXT NOT NULL,
  angle TEXT,
  target_audience TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  constraints JSONB,
  source_facts JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Example `constraints`
```json
{
  "max_duration_seconds": 120,
  "required_citations": true,
  "forbidden_claims": ["miracle results"],
  "banned_assets": ["copyrighted music"]
}
```

### Example `source_facts`
```json
[
  {
    "type": "web",
    "url": "https://example.com/article",
    "summary": "AI productivity gains are strongest in repetitive workflows."
  }
]
```

---

## 4. Ideas

```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY,
  brief_id UUID NOT NULL REFERENCES briefs(id),
  title VARCHAR(255) NOT NULL,
  angle TEXT NOT NULL,
  hook TEXT,
  reasoning TEXT,
  brand_fit_score DECIMAL(5,2),
  audience_appeal_score DECIMAL(5,2),
  novelty_score DECIMAL(5,2),
  risk_level VARCHAR(50) DEFAULT 'low',
  status VARCHAR(50) NOT NULL DEFAULT 'generated',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Status options
- `generated`
- `selected`
- `rejected`
- `archived`

---

## 5. Script Drafts

```sql
CREATE TABLE script_drafts (
  id UUID PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id),
  version INT NOT NULL,
  title VARCHAR(255),
  hook TEXT,
  body TEXT,
  cta TEXT,
  claims_used JSONB,
  prompt_version VARCHAR(255),
  model_version VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (idea_id, version)
);
```

### Example `claims_used`
```json
[
  {
    "claim": "AI speeds up repetitive work",
    "source_id": "source-123",
    "status": "approved"
  }
]
```

---

## 6. Fact Checks

```sql
CREATE TABLE fact_checks (
  id UUID PRIMARY KEY,
  script_draft_id UUID NOT NULL REFERENCES script_drafts(id),
  result VARCHAR(50) NOT NULL DEFAULT 'pending',
  summary TEXT,
  claims_checked JSONB,
  conflicts JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Example `claims_checked`
```json
[
  {
    "claim": "AI reduces manual workflow time by 40%",
    "verified": false,
    "issue": "Not in source brief"
  }
]
```

---

## 7. Compliance Checks

```sql
CREATE TABLE compliance_checks (
  id UUID PRIMARY KEY,
  script_draft_id UUID NOT NULL REFERENCES script_drafts(id),
  result VARCHAR(50) NOT NULL DEFAULT 'pending',
  violations JSONB,
  risk_score DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Example `violations`
```json
[
  {
    "type": "brand_rule",
    "message": "Tone is too alarmist for this channel"
  }
]
```

---

## 8. Reviews

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  script_draft_id UUID NOT NULL REFERENCES script_drafts(id),
  reviewer_user_id UUID NOT NULL REFERENCES users(id),
  verdict VARCHAR(50) NOT NULL,
  comments TEXT,
  suggested_changes JSONB,
  risk_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Verdict options
- `approved`
- `rejected`
- `needs_revision`

---

## 9. Render Jobs

```sql
CREATE TABLE render_jobs (
  id UUID PRIMARY KEY,
  script_draft_id UUID NOT NULL REFERENCES script_drafts(id),
  approver_user_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'queued',
  render_config JSONB,
  scene_breakdown JSONB,
  output_url TEXT,
  thumbnail_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
```

### Status options
- `queued`
- `rendering`
- `completed`
- `failed`
- `cancelled`

---

## 10. Publish Records

```sql
CREATE TABLE publish_records (
  id UUID PRIMARY KEY,
  render_job_id UUID NOT NULL REFERENCES render_jobs(id),
  channel_id UUID NOT NULL REFERENCES channels(id),
  platform VARCHAR(50) NOT NULL,
  published_url TEXT,
  approval_trail JSONB,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 11. Activity / Audit Log

```sql
CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  actor_user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  before_state JSONB,
  after_state JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Why this matters
This gives a reliable timeline for:
- brief creation
- idea generation
- review actions
- blame/ownership
- render progress
- publishing decisions

---

## 12. State History (Optional but Recommended)

```sql
CREATE TABLE entity_state_history (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  previous_state VARCHAR(100),
  next_state VARCHAR(100),
  changed_by_user_id UUID REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

This is optional if you prefer centralizing transitions into `audit_events` only.

---

## Suggested Indexes

```sql
CREATE INDEX idx_channels_owner_user_id ON channels(owner_user_id);
CREATE INDEX idx_briefs_channel_id ON briefs(channel_id);
CREATE INDEX idx_ideas_brief_id ON ideas(brief_id);
CREATE INDEX idx_script_drafts_idea_id ON script_drafts(idea_id);
CREATE INDEX idx_reviews_script_draft_id ON reviews(script_draft_id);
CREATE INDEX idx_render_jobs_script_draft_id ON render_jobs(script_draft_id);
CREATE INDEX idx_publish_records_channel_id ON publish_records(channel_id);
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);
```

---

## Recommended JSONB Use Cases

Use JSONB for data that changes shape often:
- `brand_guidelines`
- `rules`
- `constraints`
- `source_facts`
- `metadata`
- `render_config`
- `scene_breakdown`
- `approval_trail`

This keeps the schema flexible while maintaining strong relational anchors.

---

## SQL Example: Simple Query for Brief Overview

```sql
SELECT
  b.id,
  b.title,
  b.status,
  c.name AS channel_name,
  COUNT(i.id) AS idea_count,
  COUNT(DISTINCT sd.id) AS script_count
FROM briefs b
LEFT JOIN channels c ON c.id = b.channel_id
LEFT JOIN ideas i ON i.brief_id = b.id
LEFT JOIN script_drafts sd ON sd.idea_id = i.id
WHERE b.channel_id = :channel_id
GROUP BY b.id, b.title, b.status, c.name;
```

---

## MVP Simplification

For a bootstrap MVP, you can skip the following until later:
- separate `fact_checks` and `compliance_checks` tables if too heavy; combine into single `checks` table
- separate `entity_state_history` table; use `audit_events` only
- reviewer roles and admin roles until multi-user support is necessary

Minimal version can be:
- `users`
- `channels`
- `briefs`
- `ideas`
- `script_drafts`
- `reviews`
- `render_jobs`
- `publish_records`
- `audit_events`

That is enough to build a solid solo-founder MVP.

---

## Final Recommendation

Keep the schema relational and auditable.

For a bootstrap founder, the best balance is:
- core relational tables for business entities
- JSONB for flexible metadata and AI-generated output fields
- explicit audit trail and versioning
- no over-engineering in v1

This gives you the right operational control without making the app fragile.
