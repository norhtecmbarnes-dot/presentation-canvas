# Problem: html2canvas renders slides as dark/unreadable in PPTX export

## Context
I have a browser-based presentation app. Each slide is a complete HTML document stored as a string, like:

```html
<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e0e0e0;}.container{text-align:center;padding:60px;}h1{font-size:52px;margin-bottom:12px;color:#fff;font-weight:700;}</style></head><body><div class="container"><h1>Title</h1></div></body></html>
```

I need to render each slide to a PNG image at 960x540, then embed it in a PPTX file using PptxGenJS.

## Current Approach
I'm using html2canvas 1.4.1. I create a non-sandboxed iframe, write the slide HTML into it via `iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();`, wait 2 seconds, then call:

```js
const canvas = await html2canvas(iframe.contentDocument.body, {
    width: 960, height: 540, scale: 2,
    backgroundColor: '#1a1a2e',
    useCORS: true, allowTaint: true,
    windowWidth: 960, windowHeight: 540
});
```

## Problem
The rendered output is very dark and unreadable. html2canvas doesn't seem to be reading the CSS from the iframe's `<style>` tag properly. The background renders (sometimes as solid), but text colors, fonts, layout, and flex positioning are all wrong or missing.

## What I've Tried
1. **Sandboxed iframe** — html2canvas can't access `contentDocument` at all (CORS)
2. **Non-sandboxed iframe** with `doc.write()` — current approach, CSS not being picked up
3. **Direct div** (no iframe) — CSS targets `body` selectors so nothing applies correctly
4. **`backgroundColor: null`** — makes background transparent/black
5. **Replacing `linear-gradient` with solid colors** — helps with background but rest still broken

## Question
What is the correct/reliable way to use html2canvas to render a complete HTML document (with its own `<style>` tag targeting `body`, `h1`, etc.) that's in an iframe? Or is there a better library/approach to screenshot an HTML document to a high-res PNG client-side in the browser?