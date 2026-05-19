# Problem: Rendering HTML slides to PNG in browser for PPTX export — slides 2+ come out black

## Context

I have a browser-based presentation app (no backend). Each slide is a **complete HTML document** stored as a string, e.g.:

```html
<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e0e0e0;}.container{text-align:center;padding:60px;}h1{font-size:52px;margin-bottom:12px;color:#fff;font-weight:700;}</style></head><body><div class="container"><h1>Title</h1></div></body></html>
```

I need to render each slide to a PNG image client-side (in the browser), then embed it in a PPTX file using PptxGenJS.

## What happens

- **Slide 1** renders correctly
- **Slides 2, 3, 4, etc.** come out completely black (no background, no text, nothing)
- Sometimes the first slide also comes out dark/unreadable

## Current code (export.js)

```js
function renderSlideToPng(slideHtml) {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        // Visible but behind progress overlay (z-index:9999)
        iframe.style.cssText = 'position:fixed;left:0;top:0;width:960px;height:540px;border:none;z-index:9998;background:white;';
        document.body.appendChild(iframe);

        iframe.onload = () => {
            setTimeout(async () => {
                try {
                    if (typeof htmlToImage !== 'undefined' && htmlToImage.toPng) {
                        const dataUrl = await htmlToImage.toPng(iframe.contentDocument.body, {
                            width: 960,
                            height: 540,
                            pixelRatio: 2,
                            backgroundColor: null
                        });
                        iframe.remove();
                        resolve(dataUrl);
                        return;
                    }
                    if (typeof html2canvas !== 'undefined') {
                        const canvas = await html2canvas(iframe.contentDocument.body, {
                            width: 960,
                            height: 540,
                            scale: 2,
                            backgroundColor: null,
                            useCORS: false,
                            allowTaint: true,
                            logging: false,
                            foreignObjectRendering: true,
                            scrollX: 0,
                            scrollY: 0,
                            windowWidth: 960,
                            windowHeight: 540
                        });
                        iframe.remove();
                        resolve(canvas.toDataURL('image/png'));
                        return;
                    }
                    iframe.remove();
                    resolve(await divRenderFallback(slideHtml));
                } catch (e) {
                    console.warn('iframe render failed, trying div fallback:', e);
                    try { iframe.remove(); } catch(ex) {}
                    resolve(await divRenderFallback(slideHtml));
                }
            }, 500);
        };

        const doc = iframe.contentDocument;
        doc.open();
        doc.write(slideHtml);
        doc.close();
    });
}
```

The PPTX export loop calls this for each slide sequentially:

```js
for (let i = 0; i < slides.length; i++) {
    if (progress) progress.textContent = `Rendering ${i + 1} / ${slides.length}`;
    try {
        const dataUrl = await renderSlideToPng(slides[i]);
        slideImages.push(dataUrl);
    } catch (e) {
        slideImages.push(null);
    }
}
```

Libraries are loaded dynamically from CDN:
- html-to-image: `https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js`
- html2canvas: `https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js`
- PptxGenJS: `https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js`

## What I've tried (all failed)

1. **iframe with `documentElement`** instead of `body` → dark/unreadable
2. **iframe with `sandbox` attribute** → CORS blocks, can't access contentDocument
3. **iframe offscreen (`left:-9999px`)** → slides 2+ are black (browser doesn't paint offscreen iframes)
4. **iframe with `opacity:0`** → same as offscreen, browser skips paint
5. **iframe visible (`opacity:1`, behind overlay)** → still black on slides 2+
6. **`backgroundColor: '#1a1a2e'`** → background color renders but all text/styles missing
7. **`backgroundColor: null`** → transparent/black background, text still missing
8. **div instead of iframe** → CSS targets `body`/`html` selectors which don't apply to a div
9. **DOMParser to rewrite `body` → `.slide-wrapper`** → still broken, other selectors like `*` and compound rules missed
10. **`foreignObjectRendering: true`** → no improvement
11. **`onclone` callback** → cloned doc has same issues
12. **Various wait times** (0ms, 500ms, 2000ms, 3000ms) → same result
13. **`requestAnimationFrame` double-wait** → same result
14. **Replacing `linear-gradient` with solid colors** — helps background but rest of CSS still missing

## The core question

**How do I reliably render a complete HTML document (with its own `<style>` tag targeting `body`, `html`, `*`, etc.) to a PNG image in the browser, such that ALL slides render correctly — not just the first one?**

Why does slide 1 work but slides 2+ come out black? Is there a cleanup issue between slides? Does the browser not repaint iframes that are reused? Something else entirely?

Please provide a complete, working `renderSlideToPng(slideHtml)` function that handles multiple sequential calls correctly.