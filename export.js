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

        // Load html2canvas for slide rendering
        if (typeof html2canvas === 'undefined') {
            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            } catch (e) {
                try {
                    await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
                } catch (e2) {
                    overlay.remove();
                    alert('Failed to load rendering library. Opening HTML export instead.');
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

        for (let i = 0; i < slides.length; i++) {
            if (progress) progress.textContent = `Rendering ${i + 1} / ${slides.length}`;

            try {
                const dataUrl = await renderSlideToPng(slides[i]);
                slideImages.push(dataUrl);
            } catch (e) {
                console.warn('Failed to render slide', i, e);
                slideImages.push(null);
            }
        }

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

    function extractBgColor(slideHtml) {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(slideHtml, 'text/html');
            var style = doc.querySelector('style');
            if (style) {
                var css = style.textContent.replace(/\n/g, ' ');
                var match = css.match(/background(?:-color)?\s*:\s*([^;}]*(?:\([^)]*\)[^;}]*)*)/);
                if (match) {
                    var val = match[1].trim();
                    var full = val.match(/#[0-9a-fA-F]{6}/);
                    if (full) return full[0];
                    var short = val.match(/#[0-9a-fA-F]{3}/);
                    if (short) {
                        var h = short[0];
                        return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
                    }
                }
            }
        } catch (e) {}
        return '#1a1a2e';
    }

    function gradientToSolid(css) {
        return css.replace(/background(?:-image)?\s*:\s*linear-gradient\s*\([\s\S]*?\)/g, function (match) {
            var raw = match.match(/^[^(]*\(([\s\S]*)\)/);
            if (!raw) return match;
            var stops = [];
            var depth = 0, start = 0;
            for (var i = 0; i < raw[1].length; i++) {
                if (raw[1][i] === '(') depth++;
                else if (raw[1][i] === ')') depth--;
                else if (raw[1][i] === ',' && depth === 0) {
                    stops.push(raw[1].substring(start, i).trim());
                    start = i + 1;
                }
            }
            stops.push(raw[1].substring(start).trim());
            stops = stops.filter(function (s) {
                return /#|rgb|hsl/.test(s);
            });
            if (stops.length >= 2) return 'background: ' + stops[1];
            if (stops.length === 1) return 'background: ' + stops[0];
            return match;
        });
    }

    function renderSlideToPng(slideHtml) {
        return new Promise(function (resolve) {
            var bgColor = extractBgColor(slideHtml);

            var sizedHtml = gradientToSolid(slideHtml);
            sizedHtml = sizedHtml.replace('</head>',
                '<style>html,body{width:960px!important;height:540px!important;min-height:540px!important;overflow:hidden!important;margin:0!important;padding:0!important;}</style></head>');

            var iframe = document.createElement('iframe');
            // Position at viewport origin behind the export overlay (z-index:9999)
            iframe.style.cssText = 'position:fixed;left:0;top:0;width:960px;height:540px;border:none;z-index:2;background:transparent;';

            iframe.onload = function () {
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                setTimeout(function () {
                    if (typeof html2canvas === 'undefined') {
                        try { document.body.removeChild(iframe); } catch (ex) {}
                        resolve(createSolidColorSlide(slideHtml, bgColor));
                        return;
                    }
                    html2canvas(iframeDoc.body, {
                        width: 960, height: 540, scale: 2,
                        backgroundColor: bgColor,
                        useCORS: true, allowTaint: true,
                        logging: false,
                        scrollX: 0, scrollY: 0,
                        windowWidth: 960, windowHeight: 540
                    }).then(function (canvas) {
                        document.body.removeChild(iframe);
                        resolve(canvas.toDataURL('image/png'));
                    }).catch(function (err) {
                        console.warn('html2canvas iframe render failed:', err);
                        try { document.body.removeChild(iframe); } catch (ex) {}
                        resolve(createSolidColorSlide(slideHtml, bgColor));
                    });
                }, 200);
            };

            iframe.onerror = function () {
                try { document.body.removeChild(iframe); } catch (ex) {}
                createSolidColorSlide(slideHtml, bgColor).then(resolve);
            };

            document.body.appendChild(iframe);
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(sizedHtml);
            doc.close();
        });
    }

    function createSolidColorSlide(slideHtml, bgColor) {
        return new Promise(function (resolve) {
            try {
                var parser = new DOMParser();
                var doc = parser.parseFromString(slideHtml, 'text/html');
                var canvas = document.createElement('canvas');
                canvas.width = 1920;
                canvas.height = 1080;
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, 1920, 1080);

                var headings = doc.querySelectorAll('h1, h2, h3');
                var pars = doc.querySelectorAll('p, li');
                var y = 80;
                ctx.textAlign = 'left';
                ctx.fillStyle = '#ffffff';

                headings.forEach(function (h) {
                    var sz = h.tagName === 'H1' ? 52 : h.tagName === 'H2' ? 36 : 28;
                    ctx.font = 'bold ' + sz + 'px "Segoe UI", sans-serif';
                    var colorAttr = h.getAttribute('style');
                    if (colorAttr) {
                        var cm = colorAttr.match(/color\s*:\s*([^;}"']+)/);
                        if (cm) ctx.fillStyle = cm[1].trim();
                    }
                    ctx.fillText(h.textContent.trim(), 80, y);
                    ctx.fillStyle = '#ffffff';
                    y += sz + 12;
                });

                ctx.font = '18px "Segoe UI", sans-serif';
                pars.forEach(function (p) {
                    if (y > 1040) return;
                    var text = p.textContent.trim();
                    if (text.length > 100) {
                        var words = text.split(' ');
                        var line = '';
                        for (var wi = 0; wi < words.length; wi++) {
                            var word = words[wi];
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

                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                var canvas2 = document.createElement('canvas');
                canvas2.width = 1920;
                canvas2.height = 1080;
                var ctx2 = canvas2.getContext('2d');
                ctx2.fillStyle = bgColor;
                ctx2.fillRect(0, 0, 1920, 1080);
                resolve(canvas2.toDataURL('image/png'));
            }
        });
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