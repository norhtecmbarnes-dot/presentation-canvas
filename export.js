(function () {
    'use strict';

    window.exportToPDF = function (slides, title) {
        if (!slides || slides.length === 0) { alert('No slides to export.'); return; }

        const printWindow = window.open('', '_blank');
        const escapedTitle = (title || 'Presentation').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

        let htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapedTitle}</title>
<style>
@page { size: landscape; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #333; }
.slide-container {
    width: 960px;
    height: 540px;
    overflow: hidden;
    page-break-after: always;
    position: relative;
    margin: 10px auto;
    box-shadow: 0 2px 12px rgba(0,0,0,0.4);
    border-radius: 4px;
    background: #000;
}
.slide-container iframe {
    width: 960px;
    height: 540px;
    border: none;
    transform-origin: top left;
}
.controls {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
    padding: 20px;
    background: rgba(0,0,0,0.85);
    border-radius: 10px;
    font-family: 'Segoe UI', sans-serif;
}
.controls h2 { color: #fff; margin-bottom: 10px; }
.controls p { color: #ccc; margin-bottom: 10px; font-size: 14px; }
.controls button {
    background: #4fc3f7;
    color: #000;
    border: none;
    padding: 10px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin: 4px;
}
.controls button:hover { background: #81d4fa; }
@media print {
    .controls { display: none !important; }
    body { background: #fff; }
    .slide-container { page-break-after: always; box-shadow: none; border-radius: 0; margin: 0; }
}
</style>
</head>
<body>
<div class="controls">
<h2>Export to PDF</h2>
<p>Set margins to "None" and enable "Background Graphics" for best results.</p>
<button onclick="window.print()">Print / Save as PDF</button>
<button onclick="window.close()">Close</button>
</div>
<div id="slides-area">`;

        slides.forEach((slideHtml) => {
            const escaped = slideHtml.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            htmlContent += `<div class="slide-container"><iframe srcdoc="${escaped}" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
        });

        htmlContent += `</div></body></html>`;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    window.exportToPPTX = async function (slides, title) {
        if (!slides || slides.length === 0) { alert('No slides to export.'); return; }

        // Show progress overlay
        const overlay = document.createElement('div');
        overlay.id = 'export-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:"Segoe UI",sans-serif;';
        overlay.innerHTML = '<div style="background:#1a1a2e;border:1px solid #4fc3f7;border-radius:16px;padding:30px 40px;text-align:center;max-width:400px;"><div style="width:32px;height:32px;border:3px solid #333;border-top-color:#4fc3f7;border-radius:50%;animation:gen-spin 0.8s linear infinite;margin:0 auto 16px;"></div><div style="color:#4fc3f7;font-size:16px;font-weight:600;">Rendering slides...</div><div id="pptx-progress" style="color:#a0a0b0;font-size:13px;margin-top:8px;">Preparing 0 / ' + slides.length + '</div></div>';
        document.body.appendChild(overlay);
        const progress = overlay.querySelector('#pptx-progress');

        // Load html2canvas if needed
        if (typeof html2canvas === 'undefined') {
            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            } catch (e) {
                try {
                    await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
                } catch (e2) {
                    overlay.remove();
                    alert('Failed to load html2canvas library. Opening HTML export instead.');
                    fallbackHtmlExport(slides, title);
                    return;
                }
            }
        }

        // Load PptxGenJS if needed
        if (typeof PptxGenJS === 'undefined') {
            try {
                await loadScript('https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js');
            } catch (e) {
                overlay.remove();
                alert('Failed to load PptxGenJS library. Opening HTML export instead.');
                fallbackHtmlExport(slides, title);
                return;
            }
        }

        // Render each slide to an image
        const slideImages = [];
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:10000px;height:10000px;overflow:visible;';
        document.body.appendChild(hiddenContainer);

        for (let i = 0; i < slides.length; i++) {
            if (progress) progress.textContent = `Rendering ${i + 1} / ${slides.length}`;

            try {
                const dataUrl = await renderSlideToPng(slides[i], hiddenContainer);
                slideImages.push(dataUrl);
            } catch (e) {
                console.warn('Failed to render slide', i, e);
                slideImages.push(null);
            }
        }

        hiddenContainer.remove();

        // Build PPTX with slide images
        try {
            const pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches (16:9)
            pptx.title = title || 'Presentation';
            pptx.author = 'Presentation Canvas';

            pptx.subject = 'Generated by Presentation Canvas';
            slideImages.forEach((imgData, i) => {
                const slide = pptx.addSlide();
                if (imgData) {
                    slide.addImage({
                        data: imgData,
                        x: 0,
                        y: 0,
                        w: 13.33,
                        h: 7.5
                    });
                } else {
                    slide.background = { color: '1A1A2E' };
                    slide.addText('Slide ' + (i + 1) + ' - rendering failed', {
                        x: 1, y: 2.5, w: 11.33, h: 2.5,
                        fontSize: 32, color: 'FF0000', align: 'center', bold: true
                    });
                }
            });

            await pptx.writeFile({ fileName: `${(title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_')}.pptx` });

        } catch (e) {
            console.error('PptxGenJS error:', e);
            alert('Error creating PPTX: ' + e.message + '\n\nOpening HTML export instead.');
            fallbackHtmlExport(slides, title);
        }

        overlay.remove();
    };

    function renderSlideToPng(slideHtml, container) {
        return new Promise((resolve) => {
            // Extract background color from the slide HTML for html2canvas
            let bgForCanvas = '#1a1a2e';
            let modifiedHtml = slideHtml;
            try {
                const parser = new DOMParser();
                const parsed = parser.parseFromString(slideHtml, 'text/html');
                const styleEl = parsed.querySelector('style');
                if (styleEl) {
                    const cssText = styleEl.textContent;
                    const varBg = cssText.match(/--bg\s*:\s*([^;}\n]+)/);
                    if (varBg) bgForCanvas = varBg[1].trim();
                    const bodyBg = cssText.match(/body\s*\{[^}]*background(?:-color)?\s*:\s*([^;}\n]+)/);
                    if (bodyBg) bgForCanvas = bodyBg[1].trim();
                    const gradBg = cssText.match(/background\s*:\s*linear-gradient\([^,]+,\s*([^,\s)]+)/);
                    if (gradBg) bgForCanvas = gradBg[1].trim();
                }
                const bodyEl = parsed.querySelector('body');
                if (bodyEl) {
                    const inlineBg = bodyEl.getAttribute('style')?.match(/background(?:-color)?\s*:\s*([^;}"']+)/);
                    if (inlineBg) bgForCanvas = inlineBg[1].trim();
                }
                // Replace linear-gradient backgrounds with solid colors for html2canvas compatibility
                modifiedHtml = modifiedHtml.replace(/background\s*:\s*linear-gradient\(([^)]+)\)/g, (match, grads) => {
                    const colors = grads.match(/#[0-9a-fA-F]{3,8}/g);
                    if (colors && colors.length > 0) {
                        return `background: ${colors[0]}`;
                    }
                    return match;
                });
            } catch (e) { /* use default */ }

            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width:960px;height:540px;border:none;position:absolute;top:0;left:0;z-index:-1;';
            // NO sandbox attribute — html2canvas needs full access to the iframe document
            container.appendChild(iframe);

            const cleanup = () => {
                try { iframe.remove(); } catch (e) { }
            };

            iframe.onload = () => {
                setTimeout(async () => {
                    try {
                        const iframeDoc = iframe.contentDocument;
                        const iframeBody = iframeDoc.body;

                        const canvas = await html2canvas(iframeBody, {
                            width: 960,
                            height: 540,
                            scale: 2,
                            useCORS: true,
                            allowTaint: true,
                            backgroundColor: bgForCanvas,
                            logging: false,
                            windowWidth: 960,
                            windowHeight: 540
                        });

                        cleanup();
                        resolve(canvas.toDataURL('image/png'));
                    } catch (e) {
                        console.warn('html2canvas on iframe failed:', e);
                        cleanup();
                        resolve(await fallbackRender(slideHtml));
                    }
                }, 2000);
            };

            // Write slide HTML directly into the iframe (no sandbox)
            const iframeDoc = iframe.contentDocument;
            iframeDoc.open();
            iframeDoc.write(modifiedHtml);
            iframeDoc.close();
        });
    }

    async function fallbackRender(slideHtml) {
        // Last resort: create a canvas with just the background color
        const parser = new DOMParser();
        const doc = parser.parseFromString(slideHtml, 'text/html');
        const body = doc.querySelector('body');
        const style = doc.querySelector('style');

        let bgColor = '#1a1a2e';
        if (style) {
            const bgMatch = style.textContent.match(/background(?:-color)?\s*:\s*([^;}\n]+)/);
            if (bgMatch) {
                const val = bgMatch[1].trim();
                if (val.startsWith('#')) bgColor = val;
                else if (val.startsWith('linear-gradient')) {
                    const cm = val.match(/#([0-9a-fA-F]{3,8})/);
                    if (cm) bgColor = '#' + cm[1];
                }
            }
        }
        if (body) {
            const bbg = body.getAttribute('style')?.match(/background(?:-color)?\s*:\s*([^;}"']+)/);
            if (bbg) bgColor = bbg[1].trim();
        }

        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 1920, 1080);

        // Extract and draw text
        const headings = doc.querySelectorAll('h1, h2, h3');
        const pars = doc.querySelectorAll('p, li');
        let y = 80;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';

        headings.forEach(h => {
            const sz = h.tagName === 'H1' ? 48 : h.tagName === 'H2' ? 36 : 28;
            ctx.font = `bold ${sz}px "Segoe UI", sans-serif`;
            const color = h.getAttribute('style')?.match(/color\s*:\s*([^;}"']+)/);
            if (color) ctx.fillStyle = color[1].trim();
            ctx.fillText(h.textContent.trim(), 80, y);
            y += sz + 10;
        });

        ctx.font = '18px "Segoe UI", sans-serif';
        pars.forEach(p => {
            if (y > 1040) return;
            const text = p.textContent.trim();
            if (text.length > 100) {
                // Word wrap
                const words = text.split(' ');
                let line = '';
                for (const word of words) {
                    if ((line + ' ' + word).length > 100) {
                        ctx.fillText(line, 80, y);
                        y += 24;
                        line = word;
                    } else {
                        line = line ? line + ' ' + word : word;
                    }
                }
                if (line) ctx.fillText(line, 80, y);
            } else {
                ctx.fillText(text, 80, y);
            }
            y += 24;
        });

        return canvas.toDataURL('image/png');
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function fallbackHtmlExport(slides, title) {
        let htmlContent = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${title || 'Presentation'}</title>
<style>
body { margin: 0; padding: 0; background: #222; }
.slide { width: 960px; height: 540px; margin: 20px auto; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.slide iframe { width: 960px; height: 540px; border: none; }
h1 { text-align: center; color: #fff; font-family: sans-serif; padding: 20px; }
.controls { text-align: center; padding: 10px; }
.controls button { padding: 10px 30px; margin: 5px; font-size: 16px; cursor: pointer; background: #4fc3f7; border: none; border-radius: 6px; }
@media print { .controls { display: none; } .slide { page-break-after: always; box-shadow: none; } }
</style>
</head><body>
<div class="controls">
<h1>${title || 'Presentation'}</h1>
<button onclick="window.print()">Print / Save as PDF</button>
</div>`;

        slides.forEach(slide => {
            const escaped = slide.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            htmlContent += `<div class="slide"><iframe srcdoc="${escaped}" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
        });

        htmlContent += '</body></html>';
        const w = window.open('', '_blank');
        w.document.write(htmlContent);
        w.document.close();
    }
})();