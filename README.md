# Presentation Canvas

**AI-powered slide builder for government proposals, business pitches, and professional presentations.**

![Version](https://img.shields.io/badge/version-2.1-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![No Backend Required](https://img.shields.io/badge/backend-none-orange) ![Browser Only](https://img.shields.io/badge/platform-browser-purple)

---

## Why Presentation Canvas?

Government bids demand specific formats — quad charts, RACI matrices, Gantt timelines, cost breakdowns. These are painful to build by hand. Presentation Canvas generates them from a single prompt using AI.

- **No server required** — Open `index.html` and start. All processing happens in-browser.
- **Multi-provider AI** — Ollama (local), OpenAI, Zhipu (GLM), or any OpenAI-compatible endpoint.
- **Government-ready slides** — Auto-detects bid/proposal keywords and enforces concise, evaluator-friendly formatting.
- **Edit in Canvas, deliver as PDF** — Create here, export PDF for submission or PPTX for live briefings.
- **Session history** — Every presentation auto-archived. Switch between decks instantly.

---

## Features

### Core

- **Multi-Provider LLM** — Ollama (local), OpenAI, Zhipu (GLM), or any OpenAI-compatible API
- **Three Generation Modes** — Script, Slides, or Markdown
- **Edit Mode** — AI-powered edits on individual slides
- **Preview / HTML Toggle** — Rendered view or raw HTML editing
- **5 Professional Themes** — Dark, Light, Blue, Green, Red (applies live to all slides)
- **7 Built-in Layouts** — Title, Title+Content, Two Column, Image Left/Right, Full Image, Blank

### Government & Business

| Keyword | Mode | Behavior |
|---------|------|----------|
| "gov bid", "proposal", "compact bid" | Government Bid | Asks for max slide count (default 5), concise bullets, professional styling |
| "quad chart", "quadrant chart" | Quad Chart | 2×2 matrix with titled quadrants |
| "Gantt", "timeline", "project schedule" | Gantt Chart | Inline SVG horizontal bar chart |
| "RACI", "responsibility matrix" | RACI Matrix | Color-coded responsibility assignment table |
| "cost", "budget", "pricing" | Costing | Split table + pie/bar chart with grand total |
| "pptx", "powerpoint" | PPTX Export | Simplified absolute-positioned HTML for converter |

### Session & Organization

- **Session Sidebar** — Auto-archives previous presentations. Switch between decks instantly. Sidebar opens by default.
- **Max Slides** — Number input in the mode bar controls deck length before generation.
- **Footer Label** — Add "CUI", "Company Sensitive", "Do Not Distribute" labels to every slide.
- **Logo System** — Upload once, pick position and size, apply to all slides with one click.
- **Image Upload** — Upload images and insert into specific slides with "To Slide N" button.
- **HTML Download** — Download any session as a standalone viewer HTML file.

### Export

- **PDF** — Print-optimized with landscape layout and background color support
- **PPTX** — Each slide rendered as a high-fidelity image inside a PowerPoint deck. Full visual fidelity, not text-editable.
- **Template Import/Export** — JSON, HTML, Markdown, or clipboard

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
ollama pull llama3      # General purpose
ollama pull mistral     # Fast, capable
ollama pull glm4        # Excellent for structured output
```

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
5. Slides stream in one at a time as the AI generates them

### Edit a Slide

1. Switch to **Edit** mode
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

Type in the **Footer Label** field (e.g. "CUI", "Company Sensitive", "Do Not Distribute"). The label is included in every generated slide footer.

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
├── app.js          # Core logic: LLM, sessions, slides, prompts
├── export.js       # PDF and PPTX export
├── templates.json  # External templates
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

---

## Integration with PersonalAI-Dashboard

Presentation Canvas is designed to work standalone or as a companion to the [PersonalAI-Dashboard](https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard) project. It shares the same LLM provider architecture and can be embedded as a module.

---

## License

MIT