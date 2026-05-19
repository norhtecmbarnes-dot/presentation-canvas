# PPTX Export Bug: Slides Render with Uneven Brightness / Bottom Darker Than Top

## Summary

When exporting slides to PPTX, the rendered PNG images have inconsistent brightness — the bottom portion of each slide is noticeably darker than the top. This makes the PPTX output look bad and unusable.

## Architecture

Each slide is a **complete HTML document** stored as a string, e.g.:

```html
<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e0e0e0;}.container{text-align:center;padding:60px;}h1{font-size:52px;margin-bottom:12px;color:#fff;font-weight:700;}</style></head><body><div class="container"><h1>Title</h1></div></body></html>
```

We need to render each slide to a 960x540 PNG, then embed it in a PPTX using PptxGenJS.
Libraries loaded from CDN: html2canvas 1.4.1, html-to-image 1.11.11, PptxGenJS 3.12.0.

## What We've Tried

### Attempt 1: html2canvas on iframe documentElement
```js
const canvas = await html2canvas(iframe.contentDocument.documentElement, {...});
```
Result: Dark/unreadable — CSS from `<style>` tag not picked up.

### Attempt 2: html2canvas on iframe body with backgroundColor
```js
const canvas = await html2canvas(iframe.contentDocument.body, {
    backgroundColor: '#1a1a2e', ...
});
```
Result: First slide looks OK, slides 2+ come out black.

### Attempt 3: html2canvas on iframe body with backgroundColor: null
```js
backgroundColor: null
```
Result: Slides render but bottom is darker than top.

### Attempt 4: html-to-image toPng on iframe body
```js
const dataUrl = await htmlToImage.toPng(iframe.contentDocument.body, {...});
```
Result: Same uneven brightness issue.

### Attempt 5: iframe offscreen (left:-9999px)
Result: Slides 2+ are black — browser doesn't paint offscreen iframes.

### Attempt 6: iframe on-screen behind overlay (z-index)
Result: Same uneven brightness, bottom darker than top.

### Attempt 7: iframe with opacity:0
Result: Black slides — browser skips painting.

### Attempt 8: Div in main document with CSS rewrite (current approach)
Using DOMParser to rewrite `body` → `.slide-wrapper`, `html` → `.slide-wrapper`, render in a `<div>` in the main document:
```js
const wrapper = document.createElement('div');
wrapper.className = 'slide-wrapper';
wrapper.style.cssText = 'width:960px;height:540px;overflow:hidden;...';
wrapper.innerHTML = `<style>${transformedCSS}</style>${bodyContent}`;
document.body.appendChild(wrapper);
const canvas = await html2canvas(wrapper, {...});
```
Result: **Still uneven brightness — bottom darker than top.**

### Attempt 9: Replacing linear-gradient with solid color before rendering
```js
css = css.replace(/background\s*:\s*linear-gradient\(([^)]+)\)/g, (match, grads) => {
    const colors = grads.match(/#[0-9a-fA-F]{3,8}/g);
    return `background: ${colors[0]}`;
});
```
Result: **Still uneven — bottom darker than top even with solid background.**

### Key observation
The uneven brightness happens even with solid background colors (no gradients). It's as if html2canvas is rendering the element with some kind of opacity/alpha blending issue, or the computed background color fades toward the bottom.

## Current Code (export.js)

```js
function renderSlideToPng(slideHtml) {
    return new Promise(async (resolve) => {
        const bgColor = extractBgColor(slideHtml);

        // PRIMARY: Render in a div in the main document
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(slideHtml, 'text/html');
            const styleEl = doc.querySelector('style');
            let css = styleEl ? styleEl.textContent : '';

            // Rewrite selectors: body -> .slide-wrapper, html -> .slide-wrapper
            css = css
                .replace(/(^|[\s{}>,+~])body(?=[\s{}:,.\[#])/gm, '$1.slide-wrapper')
                .replace(/(^|[\s{}>,+~])html(?=[\s{}:,.\[#])/gm, '$1.slide-wrapper')
                .replace(/min-height\s*:\s*100vh/gi, 'min-height:100%')
                .replace(/height\s*:\s*100vh/gi, 'height:100%');

            // Replace gradients
            css = css.replace(/background\s*:\s*linear-gradient\(([^)]+)\)/g, (match, grads) => {
                const colors = grads.match(/#[0-9a-fA-F]{3,8}/g);
                if (colors && colors.length > 0) return `background: ${colors[0]}`;
                return match;
            });

            const wrapper = document.createElement('div');
            wrapper.className = 'slide-wrapper';
            const bodyEl = doc.querySelector('body');
            const bodyInlineStyle = bodyEl ? (bodyEl.getAttribute('style') || '') : '';
            wrapper.style.cssText = `width:960px;height:540px;overflow:hidden;position:fixed;left:-9999px;top:0;z-index:-9999;${bodyInlineStyle}`;
            wrapper.innerHTML = `<style>${css}</style>${bodyEl ? bodyEl.innerHTML : slideHtml}`;
            document.body.appendChild(wrapper);

            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

            const canvas = await html2canvas(wrapper, {
                width: 960, height: 540, scale: 2,
                backgroundColor: bgColor,
                useCORS: true, allowTaint: true,
                logging: false, scrollX: 0, scrollY: 0,
                windowWidth: 960, windowHeight: 540
            });
            wrapper.remove();
            resolve(canvas.toDataURL('image/png'));
        } catch (e) {
            // fallback to iframe approach...
        }
    });
}
```

## What We Need

A working `renderSlideToPng(slideHtml)` function that:
1. Takes a complete HTML document string (with `<!DOCTYPE>`, `<html>`, `<head><style>`, `<body>`)
2. Renders it to a 960x540 PNG at 2x scale
3. Produces consistent brightness across the entire slide
4. Works for multiple slides in sequence (slides 1 through N)
5. Captures all CSS properly: background colors, text colors, flex layouts, fonts
6. Runs entirely client-side in the browser (no backend)

## File Location

The full code is in `C:\ai\canvas\export.js` — the `renderSlideToPng` function starts around line 208.

## Question

**Why does html2canvas produce uneven brightness (top lighter, bottom darker) even with solid background colors and no gradients? And what is the correct way to render a complete HTML document to a PNG client-side with consistent, full-quality output?**