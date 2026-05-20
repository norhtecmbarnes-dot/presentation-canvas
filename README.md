# Presentation Canvas v4.0

**Privacy-first AI slide builder for government proposals, business pitches, and professional presentations. Runs locally with Ollama — your data never leaves your machine.**

![Version](https://img.shields.io/badge/version-4.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![No Backend Required](https://img.shields.io/badge/backend-none-orange) ![Browser Only](https://img.shields.io/badge/platform-browser-purple) ![Ollama](https://img.shields.io/badge/ollama-compatible-brightgreen)

> **Keywords:** AI presentation generator, slide builder, Ollama slides, local AI, privacy-first, government proposal, RFP response, quad chart, RACI matrix, Gantt chart, SWOT analysis, KPI dashboard, risk matrix, PPTX export, PDF export, no-cloud, offline presentation, LLM slide generator, browser-based presentation tool, AI-powered slides, open-source presentation maker, self-hosted slides

---

## Screenshot

<p align="center">
  <img src="https://raw.githubusercontent.com/norhtecmbarnes-dot/presentation-canvas/main/samples/preview.png" alt="Presentation Canvas screenshot" width="800">
</p>

<p align="center"><em>Generate government-ready slides from a single prompt — no cloud, no accounts, no data leaving your machine.</em></p>

---

## Why Presentation Canvas?

Unlike most presentation tools that send your data to cloud servers, Presentation Canvas runs on **local models via Ollama** — your data never leaves your computer. It also works with foundation models (OpenAI, Zhipu/GLM, or any OpenAI-compatible API) when you need them.

Government bids demand specific formats — quad charts, RACI matrices, Gantt timelines, cost breakdowns. These are painful to build by hand. Presentation Canvas generates them from a single prompt using AI.

- **Privacy-first** — Runs on local models so your data never leaves your computer. No cloud, no accounts, no tracking.
- **Research mode** — The LLM can research your topic before generating slides, pulling in real facts, data, and statistics.
- **Brand Voice profiles** — Save company name, address, contact info, and background. Injected into every slide generation.
- **WYSIWYG editor** — Click directly on text in slides to edit inline. No code required.
- **Tool commands** — Add/delete/move slides with natural language in Edit mode.
- **More control than other slide programs** — You choose the theme, layout, max slides, footer labels, and every detail.
- **No server required** — Open `index.html` and start. All processing happens in-browser.
- **Small model awareness** — Detects small/lightweight models and warns when complex charts won't render correctly.
- **Session history** — Every presentation auto-archived. Switch between decks instantly.

---

## Features

### Core

- **Multi-Provider LLM** — Ollama (local), OpenAI, Zhipu (GLM), or any OpenAI-compatible API
- **Three Generation Modes** — Script, Slides, or Markdown format
- **Three Views** — Preview (rendered), Edit (WYSIWYG inline editing), HTML (raw code)
- **Research toggle** — Let the LLM research your topic before generating for factual, data-rich slides
- **Brand Voice** — Saved profiles with company name, address, contact, background — auto-injected into prompts
- **Tool Commands** — "add a slide about X after slide 3", "delete slide 2", "move slide 4 to position 1" in Edit mode
- **5 Professional Themes** — Dark, Light, Blue, Green, Red (applies live to all slides)
- **Smart Layout Engine** — Automatic centering, safe margins, header/content/footer zones, CSS variables
- **Footer Labels** — Auto-inject classification labels (CUI, Company Sensitive, etc.) into every slide
- **Small model detection** — Warns if your model is too small for complex charts, offers research mode as fallback
- **Optional slide numbers** — Checkbox to include or suppress "Slide N" numbering on content slides

### Chart & Matrix Generation (Keyword-Triggered)

All special chart types trigger **globally** — in any generation mode. Multiple features can combine in one deck.

| Keyword(s) | Generated Feature |
|---|---|
| "gov bid", "proposal", "RFP", "government" | Government Bid Mode (dark navy, 5 slides, auto-charts) |
| "quad chart", "quadrant", "2x2" | Quad Chart (2×2 grid with titled quadrants) |
| "Gantt", "project schedule", "timeline chart", "project plan" | Gantt Chart (SVG horizontal bar chart) |
| "RACI", "responsibility matrix", "who does what" | RACI Matrix (color-coded responsibility table) |
| "cost", "budget", "pricing", "financials" | Cost / Pricing Table (with grand total) |
| "bar chart", "column chart", "comparison" | Bar / Column Chart (SVG) |
| "pie chart", "donut chart", "percentage", "breakdown" | Pie / Donut Chart (SVG + legend) |
| "SWOT", "strengths weaknesses", "strategic" | SWOT Analysis (2×2 color-coded quadrants) |
| "KPI", "dashboard", "metrics", "scorecard" | KPI Dashboard (4-card metric grid with deltas) |
| "org chart", "organization chart", "hierarchy" | Org Chart (flexbox hierarchy) |
| "comparison table", "feature comparison", "vs" | Feature Comparison Table |
| "timeline", "roadmap" | Horizontal Timeline (SVG milestones) |
| "risk matrix", "risk assessment" | Risk Matrix (5×5 color-coded grid) |

### Export

- **PDF** — Print-optimized, landscape layout, background graphics support
- **PPTX (Image)** — High-fidelity screenshots of each slide. Pixel-perfect visual fidelity.
- **PPTX (Editable)** — Native text boxes, bullet lists, tables. Text remains editable in PowerPoint.
- **Template Import/Export** — JSON, HTML, Markdown, or clipboard with auto-detection
- **HTML Download** — Download any session as a standalone viewer HTML file

### Presentation

- **Full-screen Present mode** — Slides scale to fill the entire screen, keyboard navigation (arrows, space, escape)
- **Streamed Generation** — Slides appear one at a time as the AI generates them

---

## Quick Start

### 1. Prerequisites

- A modern browser (Chrome, Firefox, Edge)
- **For local AI:** [Ollama](https://ollama.com) installed with a model pulled

### 2. Pull a Model (Ollama)

```bash
ollama pull llama3      # General purpose (recommended)
ollama pull mistral     # Fast, capable
ollama pull gemma3      # Modern, strong reasoning
```

> **Small models** (tiny, phi, gemma2:2b, 3B-4B models) will be detected automatically. You'll see a warning that complex SVG charts (Gantt, pie, risk matrices) may not render. They can still produce clean text-only slides. For full capabilities, use 7B+ models.

### 3. Launch

```bash
cd C:\ai\canvas

# Option A: Just open index.html in your browser

# Option B: Local server (recommended for Ollama CORS)
python -m http.server 8080
# Then open http://localhost:8080
```

> **CORS note:** Ollama requires serving from HTTP (not `file://`). Set `OLLAMA_ORIGINS=*` if you have CORS issues.

### 4. Connect Your LLM

1. Click **Settings** in the top bar
2. Choose provider and enter credentials:
   - **Ollama:** `http://localhost:11434` (default, works out of the box)
   - **OpenAI:** Enter API key
   - **Zhipu (GLM):** Enter API key
   - **Custom:** Any OpenAI-compatible endpoint
3. Click **Save**, then **Refresh** models
4. Select your model from the dropdown

---

## Usage

### Generate a Presentation

1. Choose **Generate** mode
2. Optionally check **Research** — the LLM will gather facts about your topic first
3. Pick **Script**, **Slides**, or **Markdown** format
4. Set **Max Slides** if you want to limit the deck length (default: 10)
5. Type your request:
   - *"Create a 5-slide government bid deck for a cybersecurity contract"*
   - *"Make a quad chart for our cloud migration proposal"*
   - *"Build a Gantt chart slide for project timeline Q3-Q4"*
   - *"Generate a RACI matrix for the development team"*
   - *"Create a risk matrix for our compliance review"*
   - *"Build a presentation with a Gantt chart, RACI, and pricing table"*
6. Slides stream in one at a time

### Brand Voice

Expand the **Brand Voice** section above the chat to set up company details:

1. Fill in company name, tagline, address, phone, email, website, and background
2. Click **Save** to persist the profile
3. Create multiple profiles (+ New) for different contexts
4. Switch between profiles using the dropdown
5. Brand details are automatically injected into every slide generation prompt

### Edit a Slide (AI)

1. Switch to **Edit** mode (button highlights orange)
2. Select the slide you want to modify
3. Describe changes: *"Add a cost breakdown table"*, *"Change background to navy blue"*, *"Make the title larger"*

### Edit a Slide (WYSIWYG)

1. Click the **Edit** view button (middle button in the workspace toolbar)
2. Click directly on any text in the slide
3. Type to modify
4. Switch back to Preview or HTML view — changes auto-save

### Tool Commands (Edit Mode)

In Edit mode, type any of these natural language commands:
- **"add a slide about team structure after slide 3"** — inserts a new slide
- **"delete slide 2"** — removes a slide
- **"move slide 4 to position 1"** — reorders slides

### Apply a Theme

1. Select a theme from the **Theme** dropdown (Dark, Light, Blue, Green, Red)
2. All existing slides update immediately

### Logo

1. Click **+ Upload Logo** in the chat panel
2. Choose position (top-left, top-right, bottom-left, bottom-right)
3. Choose size (Small, Medium, Large)
4. Click **Apply** — logo appears on every slide

### Footer Labels

Type in the **Footer Label** field (e.g. "CUI", "Company Sensitive"). Labels auto-inject into every slide. Use the **Show Slide Numbers** checkbox to include or suppress "Slide N" numbering.

### Export

- **PDF** — Set margins to "None" and enable "Background Graphics" for dark themes
- **PPTX (Image)** — Pixel-perfect screenshots for final delivery
- **PPTX (Editable)** — Native text boxes and tables for content editing in PowerPoint
- **HTML** — Click the download arrow on any session in the sidebar

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Send chat message |
| `Shift+Enter` | New line in chat |
| `←` / `→` | Navigate slides (presentation mode) |
| `Space` | Next slide (presentation mode) |
| `Escape` | Exit presentation mode |

---

## Test Script

Paste these one at a time into the chat panel to test various features:

```
Create a SWOT analysis for launching a drone delivery service
```
```
Build a Gantt chart for a 6-month software product launch
```
```
Create a RACI matrix for a cross-functional DevOps team
```
```
Generate a KPI dashboard showing revenue, users, churn, and conversion
```
```
Create a 5x5 risk matrix for a cloud migration project
```
```
Create a compact bid proposal for a cybersecurity audit contract
```
```
Create a 5-slide investor pitch for an AI-powered logistics startup
```

**Research mode:** Check the **Research** checkbox first:
```
Create a presentation on the current state of nuclear fusion energy
```

**Edit mode tool commands:** Switch to Edit mode:
```
add a slide about team org chart after slide 3
```
```
delete slide 2
```

---

## How It Compares to Commercial Solutions

Commercial AI slide tools (Gamma, Beautiful.ai, Tome, Canva AI) share a common approach: generate from templates with limited user control. Presentation Canvas takes a fundamentally different path:

| Capability | Commercial Tools | Presentation Canvas |
|---|---|---|
| **Arbitrary chart generation** | Manual creation only | Auto-generates RACI, Gantt, SWOT, KPI, risk matrices from keywords |
| **Research before generation** | No — generic filler content | Yes — LLM researches topic, injects real data |
| **Privacy / data handling** | Cloud processing, data leaves your machine | Local-first (Ollama), data never leaves |
| **No account / no cost** | Subscription required | Free, open-source, no account needed |
| **Control granularity** | Fixed templates and guardrails | Full HTML/CSS control, editable at any level |
| **Government/enterprise ready** | Vendor lock-in, cloud dependency | Self-hosted, offline-capable, no external dependencies |
| **Multi-model support** | Single proprietary model | Ollama (any local model), OpenAI, Zhipu, custom APIs |
| **Brand voice persistence** | Limited or none | Multiple saved profiles, auto-injected into every prompt |
| **WYSIWYG slide editing** | Some support | Click-to-edit directly on slides, no code required |
| **Vendor lock-in** | Yes — export only | Open format (HTML), full export to PDF/PPTX/HTML |

---

## Project Structure

```
canvas/
├── index.html      # Main application UI
├── styles.css      # Dark theme, layout, components
├── app.js          # Core logic: LLM, sessions, slides, prompts, layout engine
├── export.js       # PDF, PPTX (image), PPTX (editable), HTML export
├── templates.json  # External templates
├── samples/        # Sample presentations
└── README.md       # This file
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Ollama models not loading | Run `ollama serve`, check URL in Settings, click Refresh |
| Slides not generating | Verify model is selected, try a different generation mode |
| Small model warning on charts | Use a 7B+ model for SVG charts (Gantt, pie, risk matrices) |
| Controls clipped in chat bar | Mode bar now wraps to multiple rows — resize or use a wider window |
| Present mode doesn't fill screen | Fixed in v4.0 — slides now scale to fit the entire viewport |
| PPTX (Editable) looks rough | HTML flexbox/grid layouts don't map 1:1 to PowerPoint. Use PPTX (Image) for visual fidelity, or edit in the browser first. |
| Theme not applying to slides | Select theme from dropdown — it updates all existing slides live |
| CORS errors with custom APIs | Endpoint must support CORS headers, or use a proxy |
| Dark theme not showing in PDF | Enable "Background Graphics" in browser print dialog |
| Images too large | Resize images before uploading — they're embedded as base64 |
| Footer labels not appearing | Type in Footer Label field — auto-injects after 600ms |

---

## Changelog

### v4.0

- **Research mode** — LLM researches topic before generating for factual, data-rich slides
- **Brand Voice profiles** — Multiple saved profiles with company name, address, contact, background
- **WYSIWYG editor** — Click-to-edit text directly on slides (third view button: Edit)
- **Tool commands** — "add a slide about X after slide N", "delete slide N", "move slide N to position M"
- **Small model awareness** — Warns when model is too small for complex SVG charts
- **PPTX (Editable) export** — Native text boxes, bullet lists, tables (text editable in PowerPoint)
- **Presentation scaling** — Present mode now fills the entire screen
- **Default max slides** — Set to 10
- **Label bar layout fix** — Show Slide Numbers checkbox no longer clips

### v3.0

- Smart Slide Layout Engine with CSS variables and safe margins
- Global Keyword Trigger System — charts trigger in any generation mode
- Risk Matrix, expanded trigger keywords
- Footer labels auto-injected into all slides

### v2.2

- Initial release with Ollama, OpenAI, Zhipu/GLM support
- 5 themes, 7 layouts, 4 built-in templates, session history
- PDF and PPTX export, logo system, image upload
- Government Bid Mode, quad charts, Gantt, RACI, KPI dashboards

---

## Integration with PersonalAI-Dashboard

Presentation Canvas is designed to work standalone or as a companion to the [PersonalAI-Dashboard](https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard) project. It shares the same LLM provider architecture and can be embedded as a module.

---

## License

MIT
