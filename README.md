# Presentation Canvas

**Privacy-first AI slide builder for government proposals, business pitches, and professional presentations. Runs locally with Ollama — your data never leaves your machine.**

![Version](https://img.shields.io/badge/version-3.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![No Backend Required](https://img.shields.io/badge/backend-none-orange) ![Browser Only](https://img.shields.io/badge/platform-browser-purple) ![Ollama](https://img.shields.io/badge/ollama-compatible-brightgreen)

> **Keywords:** AI presentation generator, slide builder, Ollama slides, local AI, privacy-first, government proposal, RFP response, quad chart, RACI matrix, Gantt chart, SWOT analysis, KPI dashboard, risk matrix, PPTX export, PDF export, no-cloud, offline presentation, LLM slide generator, browser-based presentation tool, AI-powered slides, open-source presentation maker, self-hosted slides

---

## Screenshot

<p align="center">
  <img src="https://raw.githubusercontent.com/norhtecmbarnes-dot/presentation-canvas/main/samples/preview.png" alt="Presentation Canvas screenshot" width="800">
</p>

<p align="center"><em>Generate government-ready slides from a single prompt — no cloud, no accounts, no data leaving your machine.</em></p>

---

## Why Presentation Canvas?

Unlike most presentation tools that send your data to cloud servers, Presentation Canvas runs on **local models via Ollama** — your data never leaves your computer. It also works with foundational models (OpenAI, Zhipu/GLM, or any OpenAI-compatible API) when you need them. This gives you far more control over your slides than other programs: you pick the model, the theme, the layout, and every detail of the output.

Government bids demand specific formats — quad charts, RACI matrices, Gantt timelines, cost breakdowns. These are painful to build by hand. Presentation Canvas generates them from a single prompt using AI.

- **Privacy-first** — Runs on local models so your data never leaves your computer. No cloud, no accounts, no tracking.
- **Built on Ollama** — First-class support for local LLMs. Works out of the box with any Ollama model.
- **Foundation models too** — Connect to OpenAI, Zhipu (GLM), or any OpenAI-compatible endpoint when you need more power.
- **More control than other slide programs** — You choose the theme, layout, max slides, footer labels, and every detail. The AI works for you, not the other way around.
- **No server required** — Open `index.html` and start. All processing happens in-browser.
- **Government-ready slides** — Auto-detects bid/proposal keywords and enforces concise, evaluator-friendly formatting.
- **Edit in Canvas, deliver as PDF** — Create here, export PDF for submission or PPTX for live briefings.
- **Session history** — Every presentation auto-archived. Switch between decks instantly.
- **Smart Layout Engine** — Every slide is perfectly centered with safe margins, proper header/footer zones, and CSS variables for consistent formatting.
- **Risk Matrix** — Generate color-coded 5×5 risk assessment matrices from a single prompt.

---

## Features

### Core

- **Multi-Provider LLM** — Ollama (local), OpenAI, Zhipu (GLM), or any OpenAI-compatible API
- **Three Generation Modes** — Script, Slides, or Markdown
- **Edit Mode** — AI-powered edits on individual slides
- **Preview / HTML Toggle** — Rendered view or raw HTML editing
- **5 Professional Themes** — Dark, Light, Blue, Green, Red (applies live to all slides)
- **7 Built-in Layouts** — Title, Title+Content, Two Column, Image Left/Right, Full Image, Blank
- **Smart Slide Layout Engine** — Automatic centering, safe margins (40px sides, 35px top/bottom), header/content/footer zones, CSS variables for consistent formatting across all slides

### Smart Slide Layout Engine

Every generated slide follows these permanent layout rules:

| Rule | Detail |
|------|--------|
| **Slide dimensions** | 960×540px (16:9, U.S. Letter) |
| **CSS variables** | `--slide-width`, `--slide-height`, `--safe-margin`, `--header-height`, `--footer-height` defined in every `:root` |
| **Safe margins** | 40px left/right, 35px top/bottom minimum |
| **Header zone** | Top 80–100px for titles and subtitles |
| **Content zone** | Vertically centered between header and footer |
| **Footer zone** | Bottom 35–45px for slide numbers and classification labels |
| **Centering** | Title slides: centered in full height. Content slides: centered between header and footer |
| **Overflow prevention** | `max-width: 880px` on content, `line-height: 1.5–1.8`, 6–7 lines max per slide |
| **Format awareness** | A4 or Letter defaults; 16:9 ratio maintained unless user specifies print layout |

### Global Keyword Trigger System

All special slide types and chart modes trigger **globally** — in any generation mode (Generate, Edit, Script, Markdown) — not just in Government Bid Mode. Multiple features can be combined in one deck.

| Keyword(s) | Generated Feature |
|---|---|
| "gov bid", "proposal", "compact bid", "RFP", "government" | Government Bid Mode (dark navy theme, max 5 slides, corporate sensitive footer, auto-includes relevant charts) |
| "quad chart", "quadrant", "2x2" | Quad Chart (2×2 grid with titled quadrants) |
| "Gantt", "project schedule", "timeline chart", "milestone chart", "project plan" | Gantt Chart (SVG horizontal bar chart) |
| "RACI", "responsibility matrix", "who does what", "team roles", "work assignment" | RACI Matrix (color-coded responsibility table) |
| "cost", "budget", "pricing", "financials", "cost breakdown" | Cost / Pricing Table (with grand total) |
| "bar chart", "column chart", "comparison", "survey", "results" | Bar / Column Chart (SVG) |
| "pie chart", "donut chart", "percentage", "breakdown", "proportion" | Pie / Donut Chart (SVG + legend) |
| "SWOT", "strengths weaknesses", "strategic" | SWOT Analysis (2×2 color-coded quadrants) |
| "KPI", "dashboard", "metrics", "scorecard" | KPI Dashboard (4-card metric grid with deltas) |
| "org chart", "organization chart", "reporting structure", "hierarchy" | Org Chart (flexbox hierarchy with SVG connectors) |
| "comparison table", "feature comparison", "vs" | Feature Comparison Table (check/cross indicators) |
| "timeline", "roadmap" | Horizontal Timeline (SVG milestones with dates) |
| "risk matrix", "risk assessment" | Risk Matrix (color-coded 5×5 probability vs. impact grid) |

### Session & Organization

- **Session Sidebar** — Auto-pins previous presentations when starting a new one. Pin/unpin sessions with ★, clear all unpinned in one click, double-click to rename any session. Sidebar state persists across reloads.
- **Template Import** — Import from clipboard or file with auto-detection of JSON, HTML, or Markdown. Includes a copy-pasteable LLM prompt for generating templates via Gemini, ChatGPT, or any AI. Validates slide quality on import.
- **Max Slides** — Number input in the mode bar controls deck length before generation.
- **Footer Label** — Add "CUI", "Company Sensitive", "Do Not Distribute" labels to every slide. Labels are auto-injected into all slides when typed, and included in the LLM prompt during generation and editing.
- **Logo System** — Upload once, pick position and size, apply to all slides with one click.
- **Image Upload** — Upload images and insert into specific slides with "To Slide N" button.
- **HTML Download** — Download any session as a standalone viewer HTML file.

### Export

- **PDF** — Print-optimized with landscape layout and background color support
- **PPTX** — Each slide rendered as a high-fidelity image inside a PowerPoint deck. Full visual fidelity, not text-editable. Uses html2canvas with solid-color rendering for reliability.
- **Template Import/Export** — JSON, HTML, Markdown, or clipboard with auto-detection

### Presentation

- **Full-screen Mode** — Keyboard navigation with arrow keys, spacebar, and escape
- **Streamed Generation** — Slides appear one at a time as the AI generates them

---

## Quick Start

### 1. Prerequisites

- A modern browser (Chrome, Firefox, Edge)
- **For local AI:** [Ollama](https://ollama.com) installed with a model pulled

### 2. Pull a Model (Ollama)

```bash
ollama pull llama3      # General purpose (recommended — fast, capable)
ollama pull mistral     # Fast, capable
ollama pull glm4        # Excellent for structured output
```

> **Small models** (tiny, phi, gemma2:2b, 3B-4B models) will work but get a simplified prompt to fit within their context window. They can produce clean text slides but will rarely produce complex SVG charts (Gantt, pie, etc.). For charts and rich formatting, use 7B+ models.

### 3. Launch

```bash
cd canvas

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
2. Pick **Script**, **Slides**, or **Markdown** format
3. Set **Max Slides** if you want to limit the deck length
4. Type your request:
   - *"Create a 5-slide government bid deck for a cybersecurity contract"*
   - *"Make a quad chart for our cloud migration proposal"*
   - *"Build a Gantt chart slide for project timeline Q3-Q4"*
   - *"Generate a RACI matrix for the development team"*
   - *"Create a risk matrix for our compliance review"*
   - *"Build a presentation with a Gantt chart, RACI, and pricing table"*
5. Slides stream in one at a time as the AI generates them

### Edit a Slide

1. Switch to **Edit** mode (button highlights orange)
2. Select the slide
3. Describe changes: *"Add a cost breakdown table"*, *"Change background to navy blue"*, *"Make the title larger"*

### Apply a Theme

1. Select a theme from the **Theme** dropdown (Dark, Light, Blue, Green, Red)
2. All existing slides update immediately
3. The theme also informs the AI when generating new slides

### Logo

1. Click **+ Upload Logo** in the chat panel
2. Choose position (top-left, top-right, bottom-left, bottom-right)
3. Choose size (Small, Medium, Large)
4. Click **Apply** — logo appears on every slide
5. Click **Remove** to strip it from all slides

### Footer Labels

Type in the **Footer Label** field (e.g. "CUI", "Company Sensitive", "Do Not Distribute"). Labels are:
- **Auto-injected** into every slide as a subtle `<div>` at the bottom-right
- **Included in the LLM prompt** during both generation and editing
- **Debounced** — updates all slides 600ms after you stop typing

### Export

- **PDF** — Click Export > PDF. Set margins to "None" and enable "Background Graphics" for dark themes.
- **PPTX** — Click Export > PPTX. Each slide becomes a high-res image in the PowerPoint deck. Use for live presentations, not for text editing.
- **HTML** — Click the download arrow on any session in the sidebar.

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

## Project Structure

```
canvas/
├── index.html      # Main application UI
├── styles.css      # Dark theme, layout, components
├── app.js          # Core logic: LLM, sessions, slides, prompts, layout engine
├── export.js       # PDF and PPTX export
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
| Theme not applying to slides | Select theme from dropdown — it updates all existing slides live |
| CORS errors with custom APIs | Endpoint must support CORS headers, or use a proxy |
| Dark theme not showing in PDF | Enable "Background Graphics" in browser print dialog |
| PPTX looks wrong | PPTX exports slides as images — edit in Canvas, not PowerPoint |
| Images too large | Resize images before uploading — they're embedded as base64 |
| Edit mode not working | Make sure you click the Edit button (highlights orange) and a slide is selected |
| Footer labels not appearing | Type in the Footer Label field — it auto-injects into all slides after 600ms |
| Slides not centered | All new slides use the Smart Layout Engine with CSS variables and safe margins |

---

## Changelog

### v3.0

- **Smart Slide Layout Engine** — Every slide now uses CSS variables (`--slide-width`, `--slide-height`, `--safe-margin`, `--header-height`, `--footer-height`) for consistent centering, safe margins, and proper header/content/footer zones
- **Global Keyword Trigger System** — All chart types and special modes now trigger globally in any generation mode (Generate, Edit, Script, Markdown), not just in Government Bid Mode
- **Risk Matrix** — New chart type triggered by "risk matrix" or "risk assessment" — generates a color-coded 5×5 probability vs. impact grid
- **Expanded trigger keywords** — Added "column chart", "donut chart", "cost breakdown", "responsibility matrix", "work assignment", "organization chart", "feature comparison", "scorecard", "timeline chart", "milestone chart"
- **Footer labels** — Now auto-injected into all slides when typed (debounced 600ms), and included in edit mode prompts
- **Edit mode fix** — Edit button now correctly highlights orange when active

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