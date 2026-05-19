# Presentation Canvas

**AI-powered slide builder for government proposals, business pitches, and professional presentations.**

Presentation Canvas solves a specific problem: building complex, visually compelling presentation slides that government evaluators love — fast. It uses AI to generate complete slide decks with proper formatting, color schemes, and specialized slide types that government bids require.

![Version](https://img.shields.io/badge/version-2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![No Backend Required](https://img.shields.io/badge/backend-none-green)

---

## Why Presentation Canvas?

- **Government bids demand specific formats** — Quad charts, RACI matrices, Gantt timelines, cost breakdowns. These are painful to build by hand. Presentation Canvas generates them from a single prompt.
- **Color schemes matter** — Bad colors kill credibility. Every theme is designed for high contrast, readability, and professional appearance on projectors and printed handouts.
- **Beautiful and simple** — No bloat. No account required. No server. Open `index.html` and start.
- **AI does the work** — Describe what you need. The AI writes the content, designs the layout, and produces complete slides. You review and refine.
- **Edit in Canvas, deliver as PDF** — Create here, export PDF for government submission, export PPTX for live briefings.

---

## Features

### Core
- **Multi-Provider LLM** — Ollama (local), OpenAI, Zhipu (GLM), or any OpenAI-compatible API
- **Three Generation Modes** — Script, Slides, or Markdown
- **Edit Mode** — AI-powered edits on individual slides
- **Preview / HTML Toggle** — Rendered view or raw HTML editing
- **5 Professional Themes** — Dark, Light, Blue, Green, Red

### Government & Business
- **Government Bid Mode** — Auto-activates on keywords like "gov bid", "proposal", "compact bid". Enforces concise slides, professional styling, and ask-first slide count (default 5).
- **Quad Chart** — Triggered by "quad chart" or "quadrant chart". Generates a 2x2 matrix with titled quadrants (Problem/Solution/Benefits/Timeline by default).
- **Gantt Chart** — Triggered by "Gantt", "timeline", "project schedule". Inline SVG horizontal Gantt bars with task names and time scales.
- **RACI Matrix** — Triggered by "RACI", "responsibility matrix", "work assignments". Color-coded R/A/C/I cells in a professional table.
- **Costing / Budget** — Triggered by "cost", "budget", "pricing", "financials". Split table + SVG pie/bar chart with grand total.
- **PPTX Export Mode** — Auto-activates on "pptx", "powerpoint", "export to pptx". Simplified HTML layout using absolute positioning for converter compatibility.

### Session & Organization
- **Session History** — Auto-archives previous presentations in the sidebar. Switch between sessions instantly.
- **HTML Download** — Download any session as a viewer HTML file with all slides.
- **Logo System** — Upload a logo, pick position (corner), pick size, apply to all slides with one click.
- **Image Upload** — Upload images, insert into specific slides with "To Slide N" button.

### Export
- **PDF** — Print-optimized with landscape layout and background color support
- **PPTX** — Each slide rendered as a high-fidelity image in a PowerPoint deck. Ready for live presentations.
- **Template Import/Export** — JSON, HTML, Markdown, or clipboard

### Presentation
- **Full-screen Mode** — Keyboard navigation, on-screen controls
- **7 Built-in Layouts** — Title, Title+Content, Two Column, Image Left/Right, Full Image, Blank

---

## Quick Start

### 1. Prerequisites

- A modern browser (Chrome, Firefox, Edge)
- **For local AI:** [Ollama](https://ollama.com) installed with a model

### 2. Install Ollama (local models)

```bash
ollama pull llama3      # General purpose
ollama pull mistral      # Fast, capable
ollama pull glm4         # Excellent for structured output
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
3. Type your request:
   - "Create a 5-slide government bid deck for a cybersecurity contract"
   - "Make a quad chart for our cloud migration proposal"
   - "Build a Gantt chart slide for project timeline Q3-Q4"
   - "Generate a RACI matrix for the development team"
4. Slides stream in one at a time as the AI generates them

### Edit a Slide

1. Switch to **Edit** mode
2. Select the slide
3. Describe changes: "Add a cost breakdown table", "Change background to navy blue", "Make the title larger"

### Logo

1. Click **+ Upload Logo** in the chat panel
2. Choose position (top-left, top-right, bottom-left, bottom-right)
3. Choose size (Small, Medium, Large)
4. Click **Apply** — logo appears on every slide
5. Click **Remove** to strip it from all slides

### Export

- **PDF** — Click Export > PDF. Set margins to "None" and enable "Background Graphics" for dark themes.
- **PPTX** — Click Export > PPTX. Each slide becomes a high-res image in the PowerPoint deck. Use for live presentations, not for text editing.
- **HTML** — Click the download arrow on any session in the sidebar.

---

## Special Modes Reference

| Keyword | Mode Activated | Behavior |
|---------|---------------|----------|
| "gov bid", "proposal", "compact bid" | Government Bid | Max slides (asks user, default 5), concise bullets, navy/white theme, suggests quad/Gantt/RACI |
| "quad chart", "quadrant chart" | Quad Chart | 2x2 matrix slide with labeled quadrants |
| "Gantt", "timeline", "project schedule" | Gantt Chart | Inline SVG horizontal bar chart |
| "RACI", "responsibility matrix" | RACI Matrix | Color-coded responsibility table |
| "cost", "budget", "pricing" | Costing | Split table + chart with grand total |
| "pptx", "powerpoint", "ppt" | PPTX Export | Simplified absolute-positioned HTML for converter compatibility |

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