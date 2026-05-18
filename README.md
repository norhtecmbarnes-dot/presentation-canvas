# Canvas - AI Presentation Generator

A local-first AI-powered presentation builder that runs entirely in your browser. Create, edit, and export slides using local or cloud LLMs.

![Canvas](https://img.shields.io/badge/version-1.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Multi-Provider LLM Support** — Connect to Ollama (local), OpenAI, Zhipu (GLM), or any OpenAI-compatible API
- **Three Generation Modes**
  - **Script** — AI writes a full presentation script, then generates slides from it
  - **Slides** — AI creates slides directly
  - **Markdown** — AI generates markdown-formatted slides
- **Slide Edit Mode** — After generating, switch to Edit mode to request LLM-powered changes to individual slides
- **Preview / HTML Toggle** — View rendered slides or edit raw HTML directly
- **Built-in Templates** — Business Pitch, Tech Overview, Education, Photo Gallery, and more
- **Template Import/Export** — Import from JSON template files, HTML files, or Markdown; export your slides as reusable templates
- **Image Upload** — Upload images and embed them directly into slides
- **5 Themes** — Dark, Light, Blue, Green, Red
- **7 Slide Layouts** — Title, Title+Content, Two Column, Image Left/Right, Full Image, Blank
- **Presentation Mode** — Full-screen slideshow with keyboard navigation
- **Export** — PDF (via browser print) and PPTX (PowerPoint) export

## Quick Start

### 1. Prerequisites

- A modern web browser (Chrome, Firefox, Edge)
- **For local AI:** [Ollama](https://ollama.com) installed and running with at least one model pulled

### 2. Install Ollama (for local models)

```bash
# Install Ollama from https://ollama.com

# Pull a model (recommended: llama3, mistral, or glm4)
ollama pull llama3

# Verify Ollama is running
ollama list
```

### 3. Launch Canvas

Option A — Just open the file:
```
Double-click index.html in your browser
```

Option B — Use a local server (recommended for best compatibility):
```bash
# Using Python
cd canvas
python -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

### 4. Connect Your LLM

1. Click **Settings** in the top bar
2. Configure your provider:
   - **Ollama:** Default URL is `http://localhost:11434` — works out of the box if Ollama is running
   - **OpenAI:** Enter your API key (`sk-...`)
   - **Zhipu (GLM):** Enter your GLM API key
   - **Custom API:** Enter any OpenAI-compatible endpoint URL and key
3. Click **Save**
4. Click **Refresh** next to the model selector to load available models
5. Select your model from the dropdown

## Usage

### Creating a Presentation

1. Select **Generate** mode in the chat panel
2. Choose a generation format: **Script**, **Slides**, or **Markdown**
3. Type your request in the chat, e.g.:
   - "Create a 5-slide presentation about renewable energy"
   - "Make a business pitch deck for a SaaS startup"
   - "Build a tutorial presentation on Python basics"
4. The AI will generate slides — they appear in the preview and thumbnails
5. Add more slides by asking for additional content

### Editing Slides

1. Once you have slides, switch to **Edit** mode
2. Select the slide you want to edit in the thumbnails
3. Describe your changes in the chat, e.g.:
   - "Change the title to 'Introduction'"
   - "Add a bullet list with 4 key points"
   - "Make the background blue and increase the font size"
4. The AI will modify only the selected slide

### Using Templates

Click any template button in the right panel:
- **Blank Presentation** — Start fresh with a single title slide
- **Business Pitch** — 5-slide pitch deck template
- **Tech Overview** — Technical presentation template
- **Education** — Educational lecture template
- **Photo Gallery** — Image-focused layout

### Importing Templates

1. Click **Import** in the top bar
2. Choose a source type:
   - **Template (.json)** — Canvas template format
   - **HTML Slides** — One or more HTML files as slides
   - **Markdown** — Markdown with `---` slide separators
   - **Clipboard** — Paste HTML or Markdown directly
3. Choose whether to replace all slides or append
4. Click **Import**

### Exporting

- **Export Template** — Save current slides as a reusable JSON template
- **PDF** — Opens a print-friendly view; use Ctrl+P to save as PDF
- **PPTX** — Downloads as a PowerPoint file

### Presentation Mode

Click **Present** to enter fullscreen slideshow. Use:
- **Arrow keys** or **Space** to navigate
- **Escape** to exit
- On-screen controls appear on hover at the bottom

### Manual Editing

1. Switch to **HTML** view using the toggle at the top of the workspace
2. Edit the raw HTML of any slide
3. Click **Apply HTML** to save changes
4. Switch back to **Preview** to see the result

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Send chat message |
| `Shift+Enter` | New line in chat |
| `←` / `→` | Navigate slides (presentation mode) |
| `Space` | Next slide (presentation mode) |
| `Escape` | Exit presentation mode |

## Configuration

Settings are saved to your browser's local storage and persist between sessions.

### Ollama

| Setting | Default | Description |
|---------|---------|-------------|
| Base URL | `http://localhost:11434` | Ollama API endpoint |

### OpenAI

| Setting | Default | Description |
|---------|---------|-------------|
| API Key | — | Your OpenAI API key |
| Base URL | `https://api.openai.com/v1` | API endpoint (change for proxies) |
| Model | `gpt-4o` | Model to use |

### Zhipu (GLM)

| Setting | Default | Description |
|---------|---------|-------------|
| API Key | — | Your Zhipu API key |
| Model | `glm-4` | GLM model to use |

### Custom API

| Setting | Default | Description |
|---------|---------|-------------|
| Base URL | — | Any OpenAI-compatible endpoint |
| API Key | — | Bearer token (optional) |
| Model | — | Model identifier |

## Template Format

Canvas templates are JSON files with this structure:

```json
{
  "name": "My Template",
  "description": "A custom template",
  "theme": "dark",
  "slides": [
    "<!DOCTYPE html><html>...</html>",
    "<!DOCTYPE html><html>...</html>"
  ]
}
```

Each slide is a complete HTML document with embedded styles.

## Markdown Import Format

Use `---` on its own line to separate slides:

```markdown
# Slide Title

Content for the first slide

---

## Second Slide

- Bullet point 1
- Bullet point 2

---

## Final Slide

Thank you!
```

## Project Structure

```
canvas/
├── index.html      # Main application HTML
├── styles.css      # All styling
├── app.js           # Core application logic (LLM chat, slide management, templates)
├── export.js        # PDF and PPTX export functionality
└── .gitignore       # Git ignore rules
```

## Troubleshooting

### Ollama models not loading
- Make sure Ollama is running: `ollama serve`
- Check the URL in Settings (default: `http://localhost:11434`)
- Click **Refresh** next to the model selector

### Slides not generating
- Verify your model is selected in the dropdown
- Check the browser console (F12) for errors
- Try a different generation mode (Script, Slides, or Markdown)

### CORS errors with cloud APIs
- OpenAI and Zhipu APIs work directly from the browser
- For custom APIs, the endpoint must support CORS headers
- Consider using a proxy server if CORS is blocked

### Images not embedding
- Large images may slow down the LLM context — try resizing before uploading
- Base64 images are embedded directly into slide HTML

## License

MIT