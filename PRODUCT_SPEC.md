# Autonomous Media OS — Product Specification

## Executive Summary

**Autonomous Media OS** is a human-supervised AI media operating system for short-form video channels.

It turns brand briefs into approved, traceable, reviewable video outputs with human control at every stage.

**Not:** A fully autonomous content generator.
**Yes:** A production platform where AI handles generation, scoring, and validation—but humans make final editorial decisions.

---

## Problem

Content creators and channel operators face a production bottleneck:
- scripting is slow and repetitive
- quality consistency is hard to maintain
- fact-checking is manual and error-prone
- brand drift happens without strict guardrails
- publishing without review is risky

Current solutions:
- AI tools generate one thing at a time (slow iteration)
- No integrated review or approval flow
- No traceability from brief → script → final output
- No brand enforcement layer

---

## Solution

A structured editorial pipeline that:
1. Takes a brand brief
2. Generates 5–20 candidate ideas
3. Scores them on brand fit, audience value, and risk
4. Generates scripts for top candidates
5. Validates facts and compliance
6. Routes to human review
7. Renders and publishes only after approval

**Key insight:** The AI is a production tool, not a decision-maker.

---

## Core Value Proposition

- **Speed:** 5–10x faster from brief to approved script
- **Consistency:** Brand rules are enforced at every stage
- **Safety:** Every claim is traceable and fact-checked before review
- **Control:** Human approval required before anything goes live
- **Scalability:** One person can run multiple channels with this system

---

## Target User

**Primary:** Solo content creators and small teams operating 1–5 channels.

**Secondary:** In-house content teams at media companies, SaaS companies, YouTube networks.

**For MVP:** Solo founder or 2-person team managing a single short-form video channel (YouTube Shorts, TikTok, Instagram Reels, or similar).

---

## Core Features (MVP)

### 1. Channel Management
- Create and configure a channel
- Set brand identity: tone, audience, style guide
- Define content rules: allowed topics, banned claims, restricted assets
- Configure publishing settings: platform, schedule, compliance rules

### 2. Brief Creation
- Create a brief with objective, story angle, constraints
- Attach or reference source facts
- Set compliance rules for this brief
- Mark rejected patterns or banned claims

### 3. Idea Generation
- AI generates 5–20 candidate ideas from the brief
- Each idea includes: title, angle, hook, reasoning
- Each idea is scored on: brand fit, audience appeal, novelty, risk level
- Ideas ranked by score
- Human can approve, reject, or iterate on ideas

### 4. Script Generation
- AI generates script draft from selected idea
- Script includes: hook, narrative arc, CTA, supporting claims
- All claims are tagged with source references
- Script is versioned (immutable history)
- Revision history tracked

### 5. Fact & Compliance Check
- Automated validation against:
  - Brief constraints
  - Brand rules
  - Platform policy (no identifiable people, no third-party logos, etc.)
  - Factual accuracy (fact references vs. brief sources)
- Flagged issues: factual conflicts, policy violations, tone drift
- Pass/fail decision before review

### 6. Human Review
- Review dashboard shows: idea, script, fact checks, compliance status
- Reviewer can: approve, reject, request revisions
- Comments and suggestions attached to review
- Revision flow: AI rewrites, reviewer approves or iterates
- Final approval gates render + publish

### 7. Render & Publish
- Approved script queued for rendering
- Generate voiceover, subtitles, scene breakdown
- Render final video asset
- Final QA check (brand, quality, compliance)
- Publish only after final sign-off

### 8. Audit & History
- Immutable record of: brief → idea → script → review → render → publish
- Every change is versioned and traceable
- Approval trail visible (who approved what, when, why)
- Search and filter by brief, idea, script version, reviewer

---

## What We're Not Building (MVP)

- Fully autonomous publishing (always human-gated)
- Multi-channel orchestration (one channel at a time)
- Advanced personalization (one tone per channel)
- Real-time audience feedback loop (v2+)
- Complicated AI agent choreography (start simple)
- Complex rendering (outsource or use simple templates initially)

---

## Success Metrics

### Operational Metrics
- **Approval rate:** % of generated scripts that become publishable (target: 60%+)
- **Revision cycles:** Avg. iterations before approval (target: 1–2)
- **Time-to-publish:** Days from brief to approved, rendered video (target: 1–3 days)
- **Factual error rate:** % of published videos with factual issues (target: <2%)

### Quality Metrics
- **Brand fit score:** Human rating of whether output matches channel (target: 4.5+/5)
- **Audience engagement:** Views, watch time, engagement rate post-publish (baseline varies by channel)
- **Compliance violations:** % of videos flagged by platform policy (target: <1%)

### Business Metrics
- **Content velocity:** Videos published per week (target: 5–10 for solo founder)
- **Retention:** % of users who stay active after 30 days
- **NPS:** Net promoter score from early users

---

## User Workflows

### Workflow 1: Brief to Approved Script (Happy Path)

```
1. Creator logs in
2. Creates or selects channel
3. Creates brief:
   - Topic: "AI safety myths debunked"
   - Angle: "Why AI isn't going to steal your job (yet)"
   - Audience: Tech-curious, non-experts
   - Constraints: Max 2 minutes, no copyright music, cite sources
4. System generates 10 ideas
5. Creator picks top 3
6. System generates 3 script drafts
7. Fact checker validates claims
8. Creator reviews and approves best script
9. Script sent to render queue
10. Creator gets notification when video is ready
11. Creator reviews final render
12. Creator hits "Publish"
13. Video goes live, metrics tracked
```

**Time:** 2–4 hours for a solo creator (mostly waiting for AI).

### Workflow 2: Brief to Revision (Rejection Path)

```
1. Creator creates brief
2. System generates ideas
3. Creator selects idea
4. System generates script
5. Fact checker flags: "Claim 'AI will replace 50% of jobs by 2030' not in brief sources"
6. System flags: "Tone too alarmist for this channel"
7. Creator reviews and sees issues
8. Creator clicks "Request Revision"
9. System regenerates script with feedback
10. Fact checker re-validates
11. Creator approves v2
12. Script sent to render
```

**Time:** +1–2 hours for revision cycle.

### Workflow 3: Managing Multiple Briefs

```
1. Creator has 3 briefs in progress
2. Dashboard shows status of each:
   - Brief A: "Approved, rendering"
   - Brief B: "In review, waiting for approval"
   - Brief C: "Needs revision, 1 issue flagged"
3. Creator can jump between any brief
4. Each one maintains separate state/history
```

---

## Core Entities & Relationships

```
Channel
├── Brief (1 to many)
│   ├── Idea (1 to many)
│   │   ├── ScriptDraft (1 to many, versioned)
│   │   └── Review (1 to many)
│   ├── ComplianceCheck
│   ├── FactCheck
│   └── RenderJob
│       └── PublishRecord

Channel:
  - id
  - name
  - brand_identity (tone, audience, style)
  - rules (allowed topics, banned claims, asset restrictions)
  - platform (YouTube, TikTok, Instagram, etc.)

Brief:
  - id
  - channel_id
  - title, objective, angle
  - target_audience
  - constraints (max length, banned claims, required facts)
  - source_facts (references, citations)
  - status (draft, active, archived)

Idea:
  - id
  - brief_id
  - title, angle, hook
  - brand_fit_score, audience_appeal_score, risk_level
  - reasoning
  - status (generated, selected, rejected)

ScriptDraft:
  - id
  - idea_id
  - version
  - content (hook, body, cta)
  - claims_used (list of fact references)
  - prompt_version (which prompt generated this)
  - model_version (which model generated this)
  - created_at
  - revised_at

Review:
  - id
  - script_draft_id
  - reviewer_id
  - verdict (approved, rejected, needs_revision)
  - comments
  - suggested_changes
  - risk_notes
  - created_at

ComplianceCheck:
  - id
  - script_draft_id
  - violations (list of policy violations)
  - status (passed, failed)

FactCheck:
  - id
  - script_draft_id
  - claims_checked
  - conflicts (claims not in brief sources)
  - status (passed, failed)

RenderJob:
  - id
  - script_draft_id
  - status (queued, rendering, completed, failed)
  - scene_breakdown
  - voiceover_config
  - output_type (mp4, etc.)
  - final_artifact_url
  - created_at, completed_at

PublishRecord:
  - id
  - render_job_id
  - url (published video link)
  - platform
  - published_at
  - approval_trail (chain of approvals)
```

---

## User Roles (MVP)

### Creator
- Full access: create channels, briefs, review scripts, approve publish

### (Future) Reviewer
- Can review and approve/reject scripts, but cannot publish

### (Future) Admin
- Can manage channels, users, compliance rules

---

## Non-Functional Requirements

- **Performance:** Idea generation <30s, script generation <2min, fact check <10s
- **Reliability:** 99%+ uptime for review dashboard, <1% rendering failures
- **Security:** SSO (Google OAuth), encrypted brief content, audit logs
- **Scalability:** Support 100+ channels and 1,000s of briefs by end of Year 1

---

## Constraints & Guardrails

1. **AI never invents facts.** Every claim must reference a brief source.
2. **Human approval is required before publish.** No autonomous publishing.
3. **Brand rules are enforced at every stage.** Tone, audience, restrictions.
4. **Everything is versioned and traceable.** Immutable history.
5. **Compliance is checked before review.** No policy violations make it to human review.
6. **Facts are checked before review.** No hallucinations make it to human review.

---

## Pricing Model (Future)

- **Freemium:** 2 briefs/month, 1 render job/month (MVP is free)
- **Pro:** $49/month, unlimited briefs, 20 render jobs/month
- **Studio:** $199/month, multiple channels, team collaboration, priority rendering

(Focus on free MVP first, pricing conversation after product-market fit.)

---

## Go-to-Market Strategy (Solo Founder)

### Phase 1: Validation (Weeks 1–8)
- Build MVP
- Invite 5–10 beta users (friends, content creators, channels you know)
- Get feedback on workflow, speed, quality
- Fix critical bugs

### Phase 2: Early Adopters (Weeks 9–16)
- Open beta to 50–100 users
- Build case studies
- Refine onboarding
- Gather testimonials

### Phase 3: Public Launch (Weeks 17–20)
- Launch publicly with free tier
- Monetize with Pro tier
- Build community (Discord, Twitter, Product Hunt)

---

## Success Criteria

**MVP is successful if:**
- Solo creator can go from brief to approved, publishable script in <4 hours
- Approval rate is 60%+
- Factual error rate is <2%
- User retention after 30 days is 70%+
- User NPS is 40+

---

## Next Steps

1. Build MVP (Weeks 1–8)
2. Invite beta testers
3. Iterate based on feedback
4. Launch publicly (Week 16–20)
5. Gather early customer feedback
6. Plan Phase 2 features based on usage patterns
