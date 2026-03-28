# my-et-ai
# My ET — AI-Native News Experience 🗞️

> **Economic Times Hackathon Submission**
> Built for the "AI-Native News Experience" problem statement

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20App-orange)](https://your-vercel-link.vercel.app)
[![Built with Claude](https://img.shields.io/badge/AI-Claude%20Sonnet-blueviolet)](https://anthropic.com)

---

## What We Built

Two AI agents that make ET news smarter, deeper, and accessible to 600M+ Indians:

### 🔍 Agent 1 — Story Arc Tracker
Pick any ongoing business story. AI builds a complete visual narrative:
- **Interactive timeline** — key events plotted chronologically
- **Key players mapped** — who did what and their stance (bullish/bearish)
- **Sentiment shifts** — how media/market tone changed over time
- **Contrarian perspectives** — the opposite view, surfaced by AI
- **"What to watch next"** — AI predictions for the next 30–90 days

**Try it with:** Adani-Hindenburg · Paytm RBI ban · Byju's collapse · Jio vs Airtel 5G

### 🌐 Agent 2 — Vernacular Business News Engine
Paste any ET English article → get culturally adapted translation in:
- **Hindi** (हिन्दी) — 528M speakers
- **Tamil** (தமிழ்) — 75M speakers  
- **Telugu** (తెలుగు) — 95M speakers
- **Bengali** (বাংলা) — 230M speakers

Not literal translation — **cultural adaptation**: local analogies, regional business context, audience-appropriate financial terminology.

---

## Demo

### Story Arc Tracker
1. Open the app → click "Story Arc Tracker" tab
2. Type any business story: `"Paytm RBI banking licence ban"`
3. Click "Build Story Arc →"
4. See: timeline, players, sentiment bars, contrarian view, predictions — all AI-generated

### Vernacular Engine
1. Click "Vernacular Engine" tab
2. Click any sample article chip (e.g. "RBI rate cut")
3. Select a language (e.g. Hindi)
4. Click "Translate with Cultural Context →"
5. See translated article + what cultural context AI injected

---

## Setup Instructions

### Option A — Open directly in browser (no setup)
```bash
# Download myET-prototype.html
# Open in any browser — it works immediately
```

### Option B — Deploy to Vercel
```bash
# 1. Clone this repo
git clone https://github.com/yourusername/my-et-ai

# 2. Rename the file
mv myET-prototype.html index.html

# 3. Deploy to Vercel
# Go to vercel.com → New Project → import repo → Deploy
# Your app is live at yourproject.vercel.app
```

### No API key needed
The app uses the Anthropic API directly from the browser. The API key is handled by the claude.ai environment for demo purposes.

---

## Architecture

```
User Browser
├── Story Arc Tracker Agent
│   ├── Input: story topic (free text)
│   ├── Claude Sonnet API → structured JSON (6 sections)
│   └── Rendered: timeline + players + sentiment + predictions
│
└── Vernacular Engine Agent
    ├── Input: English article + language selection
    ├── Language Router → per-language system prompt
    ├── Claude Sonnet API → {translation, contextAdded}
    └── Rendered: translated text + cultural context note
```

See `myET-architecture.md` for full 2-page architecture document.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Vanilla HTML/CSS/JS | Zero dependencies, runs anywhere |
| AI | Claude Sonnet | Best-in-class reasoning + multilingual |
| API | Anthropic /v1/messages | Direct browser fetch, no backend needed |
| Hosting | Vercel | Free, instant, CDN-global |

---

## Impact Model

| Metric | Story Arc Tracker | Vernacular Engine |
|--------|------------------|-------------------|
| Addressable users | 2.5M (5% of ET's 50M) | 600M+ vernacular speakers |
| Revenue potential | ₹149M/month | ₹160M/month |
| Market expansion | Depth play | 12x reach expansion |

**Combined incremental revenue: ~₹300M/month (~$3.6M/month)**
**Build cost: ~₹18L · Payback: < 1 month**

See `myET-architecture.md` for full assumptions.

---

## Commit History

| Commit | Description |
|--------|-------------|
| `feat: initial UI scaffold` | Base layout, tabs, topbar |
| `feat: story arc tracker agent` | Claude API integration, JSON schema |
| `feat: timeline + players render` | Visual components for arc results |
| `feat: vernacular engine agent` | 4-language translation with cultural adaptation |
| `feat: cultural context injection` | Per-language system prompts |
| `fix: JSON parse robustness` | Strip markdown fences from API response |
| `feat: sample articles + story chips` | Demo-ready without typing |
| `polish: loading states + toast` | UX improvements |

---

## By
Muskan Patel

---

## License
MIT
