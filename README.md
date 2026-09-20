# Life in Receipts — Interactive Digital-Life Story

> **"Your life leaves traces. We turned them into a story."**
> 
> A person's digital life is made up of hundreds of tiny moments: music played, places visited, things purchased, notes, and routines. *Life in Receipts* is an interactive digital museum and personal archive that reconstructs fragments of someone's digital life into **chapters, moments, routines, and connections**.

---

## ✦ Primary Product Philosophy

The goal is **NOT**:
$$\text{Raw Data} \longrightarrow \text{Timeline}$$

The goal **IS**:
$$\text{Raw Data} \longrightarrow \text{Insights} \longrightarrow \text{Connections} \longrightarrow \text{Story}$$

Rather than presenting a generic analytics dashboard or a chronological list of transactions, *Life in Receipts* functions as an archaeological instrument that answers:
* **What periods were unusually active?**
* **What kinds of activity appeared together?**
* **What routines repeated across days and weeks?**
* **When did behavior shift?**
* **Which moments connect different data sources?**
* **What patterns emerge only after connecting multiple receipts?**

---

## ✦ Core Features & Architecture

### 1. Living Story Chapters (`/story`)
* **5 Data-Synthesized Eras (2013–2024)**: Not hardcoded fictional stories, but narrative chapters synthesized directly from empirical density shifts, platform transitions, and spending patterns.
  * **Chapter 1: The First Tracks (2013–2015)** — Web player and desktop discovery of indie rock, synth-pop, and early anthems.
  * **Chapter 2: The Commute & The Routine (2015–2018)** — Android mobile streaming emerges alongside train transit, chai, groceries, and Netflix subscriptions.
  * **Chapter 3: The Soundtrack (2018–2020)** — Intense album marathons (The Beatles, The Strokes) and late-night listening clusters.
  * **Chapter 4: The Quiet Months (2020–2021)** — Shift to home focus, reflective playlists, and domestic routines.
  * **Chapter 5: The Modern Canvas (2022–2024)** — Multi-facet era: multi-city travel, entertainment bookings, and late-night lifestyle convergence.
* **"Why This Matters" Micro-Narrative**:
  * **Observed**: What the dataset directly shows.
  * **Connected**: What other receipts are temporally or categorically related.
  * **Story**: Restrained, data-grounded interpretation without unsupported causality claims.

### 2. Time Explorer — Activity River
* Compressed timeline representing receipt density from 2013 to 2024.
* Highlights periods of cross-source convergence with visual anchor nodes.
* Interactive scrubbing and filtering that dynamically focuses the entire application.

### 3. Convergent Moments (`/moments`)
* Pinpoints exact dates where 2 or 3 distinct datasets recorded activity simultaneously (e.g., *Music + Card Spend*, *Music + Household Transit*).
* Displays multi-source receipt snapshots and empirical convergence metrics.

### 4. Signature Interaction: TRACE (`TracePanel`)
* Inspect any moment or individual receipt with one click.
* **Relationship Path**: Highlights the selected receipt, links connected receipts, and provides explicit reasons for each link:
  * `Within 3 Hours`: Rapid cross-source temporal proximity.
  * `Same Day Window`: Activities converging within the same 24-hour cycle.
  * `Shared Category`: Thematic alignment across periods.
  * `Recurring Cadence`: Day-of-week routines (e.g., Friday evenings).

### 5. Pattern Engine (`/patterns`)
* **Listening Rhythms**: Morning, Afternoon, Evening, and Late-Night (23:00–03:00). Empirically proves that **18.4%** of streams occurred in the late-night window.
* **Weekly Cadence**: Day-of-week distribution identifying peak listening and spending routines.
* **Top Sounds**: Ranking top artists (The Beatles, The Strokes, Coldplay) and recurring tracks.
* **Spending Concentration**: Category distribution across entertainment, travel, dining, and daily household transit.
* **Cross-Source Overlaps**: 45 verified multi-source intersection days.

### 6. Digital Constellation (`/constellation`)
* Interactive SVG relationship map connecting high-value nodes: Chapters, Music Clusters, Spending Categories, Routines, and Moments.
* Hover highlighting of connected threads and dimming of unrelated nodes.
* Full keyboard accessibility (`Enter`/`Space` to inspect, `Escape` to dismiss) and textual alternatives.

### 7. Receipts Explorer (`/receipts`)
* Fast searchable data explorer.
* Multi-attribute filtering:
  * **Search**: Track, artist, merchant, category, note, subcategory.
  * **Source**: Spotify Music, Card Transactions, Household Entries.
  * **Time of Day**: Morning, Afternoon, Evening, Late Night.
  * **Sorting**: Newest, Oldest, Largest Amount, Longest Stream.
* Paginated and virtualized to guarantee 60 FPS performance without DOM bloat.

### 8. Global Search Command (`Ctrl/Cmd + K`)
* Universal command palette that instantly searches across:
  * **Music History**: Tracks and artists.
  * **Connected Moments**: Convergent dates and multi-source events.
  * **Story Chapters**: Eras and thematic keywords.

### 9. Dataset Diagnostics & Privacy Verification
* Dedicated inspector accessible via the masthead database icon.
* Verifies record counts and confirms strict privacy scrubbing compliance.

---

## ✦ Privacy, Security & Ethical Storytelling

* **Strict Privacy Scrubbing**: Sensitive fields in the raw datasets (`cc_num`, `customer_id`, `street`, `dob`, `lat`, `long`, `merch_lat`, `merch_long`, `first`, `last`, `job`, `is_fraud`) are completely scrubbed during ingestion. They are never rendered or stored in client memory.
* **Sanitized Merchant Names**: Synthetic `fraud_` prefixes are stripped for clean, realistic merchant representation.
* **Restrained Interpretive Language**:
  * **Allowed**: *"Late-night listening increased during this period."* | *"Entertainment spending appeared more frequently on these dates."* | *"These receipts happened within the same time window."*
  * **Prohibited**: *"This person was lonely."* | *"This person was financially irresponsible."* | *"This purchase proves they were struggling."*
* **Zero External Dependencies**: 100% frontend-only. No backend, no databases, no external API calls, no analytics tracking, no secrets.

---

## ✦ Design Aesthetics: Archival Paper & Ink

* **Strictly Zero Purple**: No purple, violet, lavender, or generic "AI SaaS" gradients.
* **Editorial Archival Palette**:
  * **Background**: Warm paper / ivory (`#FBF9F5`, `#F2ECE4`)
  * **Primary Ink**: Near-black ink (`#181715`)
  * **Accents**: Burnt orange (`#D95D39`), deep teal (`#1B4958`), slate navy (`#3A506B`), warm amber (`#C97A2B`)
  * **Receipt Details**: Serrated dividers, dashed borders, ink stamp badges, and monospace metadata tags (`JetBrains Mono`).
* **Accessibility**:
  * Visible focus rings (`2px solid var(--accent-orange)` with `outline-offset: 2px`).
  * Minimum touch targets: 44×44 CSS pixels.
  * Full support for `prefers-reduced-motion: reduce`.
  * Semantic HTML (`nav`, `main`, `section`, `article`, `header`, `button`).

---

## ✦ Data Pipeline & Performance

```
                           [ Raw Datasets ]
            ┌─────────────────────┼─────────────────────┐
            ▼                     ▼                     ▼
     Spotify History      Household Entries     Card Transactions
     (149,860 rows)         (2,461 rows)          (10,267 rows)
            │                     │                     │
            └─────────────────────┼─────────────────────┘
                                  ▼
                      scripts/prepare-data.cjs
           ┌──────────────────────┴──────────────────────┐
           ▼                                             ▼
  [ Pre-Aggregated Summaries ]                  [ Curated Index ]
   • spotify-summary.json                        • sample-receipts.json (4,987)
   • transaction-summary.json                    • moments.json (45)
   • household-summary.json                      • chapters.json (5)
   • patterns.json                               • constellation.json
           │
           ▼
  [ Browser Client (React 18 + Vite + TypeScript) ]
  • Instant initial load (<100ms)
  • Zero main-thread lag
  • Paginated receipts explorer
```

---

## ✦ Getting Started

### Prerequisites
* Node.js v18+ (tested on Node v22)
* npm v9+

### Installation & Run
```bash
# 1. Clone the repository
git clone https://github.com/tnex0734-ops/life-in-receipts.git
cd life-in-receipts

# 2. Install dependencies
npm install

# 3. Ingest data and generate summary artifacts
npm run prepare-data

# 4. Launch development server
npm run dev

# 5. Open http://localhost:5173 in your browser
```

### Running Tests & Verification
```bash
# Run unit tests (Vitest)
npm test

# Verify TypeScript type checking & build production bundle
npm run build
```

---

## ✦ Testing & Validation Summary

| Test Suite | Tests | Result | Description |
| :--- | :---: | :---: | :--- |
| `tests/normalize.test.ts` | 5 | **Passed** | Tests null-safe date/currency/duration formatting, time-of-day binning, and string sanitization. |
| `tests/connections.test.ts` | 4 | **Passed** | Tests cross-source proximity detection (within 3h), same-day temporal window, shared category co-occurrence, and multi-step trace generation. |
| `tests/patterns.test.ts` | 2 | **Passed** | Tests late-night time threshold calculation (23:00–03:00) and percentage rounding precision. |

---

## ✦ License

MIT License. Designed and engineered for the Hackathon Challenge.
