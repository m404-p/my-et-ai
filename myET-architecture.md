# My ET — AI-Native News Experience
## Architecture Document (Submission)

---

## Overview

My ET is a two-agent AI system built on Claude (Anthropic) that transforms how Indians consume business news. It addresses two fundamental gaps in ET's current product: **depth** (understanding a story's full arc, not just today's headline) and **reach** (600M+ Indians who need news in their native language with local context, not literal translation).

---

## Agent 1 — Story Arc Tracker

### What it does
A user types any ongoing business story (e.g. "Adani-Hindenburg", "Paytm RBI ban"). The agent builds a complete visual narrative: interactive timeline, key players mapped with stances, sentiment shifts across phases, contrarian perspectives, and "what to watch next" predictions.

### Agent Role
- **Input**: Free-text story topic from user
- **Task**: Synthesize known information about the story into structured JSON covering timeline, players, sentiment, contrarian angles, and predictions
- **Output**: Rendered interactive UI — timeline, player cards, sentiment bars, insight boxes

### Tool Integrations
- Claude Sonnet via Anthropic `/v1/messages` API
- Web search (future: ET article database API for real headlines)
- Structured JSON output schema enforced via system prompt

### Prompt Design
System prompt instructs Claude to act as an ET business journalist. It enforces a strict JSON output schema with 6 sections: `overview`, `timeline`, `players`, `sentiment`, `contrarian`, `watchNext`. The model is instructed to use India-specific context, real company names, and dated events.

### Error Handling
- JSON parse failure → retry with cleaned response
- API timeout → show partial result with toast warning
- Unknown story → agent generates plausible narrative with caveat

---

## Agent 2 — Vernacular Business News Engine

### What it does
User pastes any ET English article. Agent translates it into Hindi, Tamil, Telugu, or Bengali — not word-for-word, but culturally adapted: local analogies, regional business context, audience-appropriate financial terminology.

### Agent Role
- **Input**: English news article text + target language selection
- **Task**: Produce fluent, culturally adapted translation with a metadata note explaining what local context was injected
- **Output**: Translated article + "cultural context added" explanation

### Tool Integrations
- Claude Sonnet via Anthropic `/v1/messages` API
- Language-specific system prompt variants (one per language with regional context instructions)

### Prompt Design
Per-language system prompts inject specific regional instructions:
- **Hindi**: Middle-class Delhi/Mumbai reader, everyday analogies, Hindi financial terms with English brackets
- **Tamil**: Tamil Nadu manufacturing, IT corridor, Chennai market references
- **Telugu**: Hyderabad/Vijayawada audience, pharma and IT sector context
- **Bengali**: Kolkata business community, West Bengal/Bangladesh economic framing

The model is instructed NOT to translate literally — it must replace generic analogies with India-local ones and explain what it changed.

### Error Handling
- Empty input → input validation before API call
- Translation failure → fallback to direct translation with warning
- Language detection mismatch → user-facing alert

---

## System Architecture

```
User Browser
     │
     ├──► Story Arc Tracker
     │         │
     │         ├── User Input (story topic)
     │         │
     │         ├── Profile Agent (builds query context)
     │         │         │
     │         │         ▼
     │         ├── Claude API (/v1/messages)
     │         │   System: ET journalist persona
     │         │   Schema: 6-section JSON enforced
     │         │         │
     │         │         ▼
     │         └── Render Engine (timeline, players, sentiment, predictions)
     │
     └──► Vernacular Engine
               │
               ├── User Input (article text + language)
               │
               ├── Language Router (selects per-language system prompt)
               │         │
               │         ▼
               ├── Claude API (/v1/messages)
               │   System: Cultural adaptation specialist
               │   Output: {translation, contextAdded}
               │         │
               │         ▼
               └── Output Panel (translated text + context note)
```

---

## Communication Between Agents

The two agents are **independent** in V1 — they share the same Claude API client but operate in separate tabs with separate state. In V2, they would be connected:

- Story Arc Tracker identifies a story → passes key paragraph to Vernacular Engine
- User clicks "Read in Hindi" on any timeline event → Vernacular Engine translates that event automatically
- Shared user profile determines default language preference

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS — zero dependencies, runs in any browser |
| AI Model | Claude Sonnet (claude-sonnet-4-20250514) |
| API | Anthropic /v1/messages (direct browser fetch) |
| Deployment | Vercel (static hosting, CDN-distributed) |
| Data | No database required for V1 — stateless per session |

---

## Impact Model

### Story Arc Tracker
- ET has ~50M monthly users; 5% engage with deep-read content = 2.5M potential users
- Time saved per user: 45 min of reading → 3 min arc view = 14x efficiency
- Premium subscription driver: this feature justifies ₹299/month ET Prime upgrade
- Revenue potential: 500K users × ₹299/month = **₹149M/month (~$1.8M/month)**

### Vernacular Engine
- 600M Indians speak Hindi, Tamil, Telugu, Bengali as first language
- ET English reaches only ~50M — vernacular unlocks **12x addressable market**
- Ad revenue per vernacular user: ₹80/month CPM (vs ₹200 English — grows with scale)
- Conservative 2M vernacular users × ₹80 = **₹160M/month incremental ad revenue**

### Combined
- Total incremental revenue potential: **~₹300M/month (~$3.6M/month)**
- Build cost: 2 engineers × 3 months = ~₹18L one-time
- Payback period: **< 1 month** at conservative adoption

---

## Assumptions
1. 5% of ET's 50M users adopt Story Arc (conservative; feature is novel)
2. Vernacular reaches 2M users in 12 months (0.3% of addressable market)
3. Ad CPM for vernacular scales to ₹80 as advertiser interest grows
4. Claude API cost: ~$0.003 per story arc, ~$0.002 per translation — negligible at scale
5. No server infrastructure needed for V1 — Vercel free tier handles 100K requests/month
