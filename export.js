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
        return css.replace(/background(?:-image)?\s*:\s*linear-gradient\s*\(/g, function () {
            var depth = 1;
            var i = arguments[arguments.length - 2] + arguments[0].length;
            var start = i;
            while (i < css.length && depth > 0) {
                if (css[i] === '(') depth++;
                else if (css[i] === ')') depth--;
                i++;
            }
            var gradientContent = css.substring(start, i - 1);
            var stops = [];
            var d = 0, s = 0;
            for (var j = 0; j < gradientContent.length; j++) {
                if (gradientContent[j] === '(') d++;
                else if (gradientContent[j] === ')') d--;
                else if (gradientContent[j] === ',' && d === 0) {
                    stops.push(gradientContent.substring(s, j).trim());
                    s = j + 1;
                }
            }
            stops.push(gradientContent.substring(s).trim());
            stops = stops.filter(function (stop) {
                return /#|rgb|hsl/.test(stop);
            });
            if (stops.length >= 1) {
                var color = stops[0].match(/#[0-9a-fA-F]{3,8}/);
                if (color) return 'background: ' + color[0];
                var hex = stops[0].match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
                if (hex) return 'background: ' + rgbToHex(parseInt(hex[1]), parseInt(hex[2]), parseInt(hex[3]));
            }
            return 'background: #1a1a2e';
        });
    }

    function rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function renderSlideToPng(slideHtml) {
        return new Promise(function (resolve) {
            var processedHtml = processSlideHtml(slideHtml);
            var bgColor = extractBgColor(processedHtml);

            var iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:fixed;left:0;top:0;width:960px;height:540px;border:none;z-index:2;background:transparent;visibility:hidden;';

            iframe.onload = function () {
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframe.style.visibility = 'visible';
                setTimeout(function () {
                    if (typeof html2canvas === 'undefined') {
                        try { document.body.removeChild(iframe); } catch (ex) {}
                        resolve(createSolidColorSlide(processedHtml, bgColor));
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
                        resolve(createSolidColorSlide(processedHtml, bgColor));
                    });
                }, 300);
            };

            iframe.onerror = function () {
                try { document.body.removeChild(iframe); } catch (ex) {}
                createSolidColorSlide(processedHtml, bgColor).then(resolve);
            };

            document.body.appendChild(iframe);
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(processedHtml);
            doc.close();
        });
    }

    function processSlideHtml(slideHtml) {
        var result = slideHtml;
        result = result.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, function (full, attrs, css) {
            return '<style' + attrs + '>' + gradientToSolid(css) + '</style>';
        });
        result = result.replace(/style\s*=\s*"([^"]*)"/g, function (full, inline) {
            var fixed = gradientToSolid(inline);
            if (fixed !== inline) return 'style="' + fixed + '"';
            return full;
        });
        return result;
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

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    }

    function sanitizeColorForPptx(color) {
        if (!color) return 'FFFFFF';
        var match = color.match(/#[0-9a-fA-F]{6}/);
        if (match) return match[0].replace('#', '');
        match = color.match(/#[0-9a-fA-F]{3}/);
        if (match) {
            var h = match[0];
            return h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
        }
        return 'FFFFFF';
    }

    function resolveStyle(el, cssRules, prop) {
        var inline = (el.getAttribute('style') || '').match(new RegExp(prop + '\\s*:\\s*([^;]+)', 'i'));
        if (inline) return inline[1].trim();
        var tag = el.tagName.toLowerCase();
        var classes = el.className && typeof el.className === 'string' ? el.className.split(/\s+/) : [];
        for (var r = 0; r < cssRules.length; r++) {
            var sel = cssRules[r].selector;
            var match = cssRules[r].css.match(new RegExp(prop + '\\s*:\\s*([^;}]+)', 'i'));
            if (!match) continue;
            var value = match[1].trim();
            if (sel === tag || sel === el.tagName) return value;
            for (var cl = 0; cl < classes.length; cl++) {
                if (sel === '.' + classes[cl]) return value;
            }
            if (sel === tag + ' ' + sel || tag + '.' + sel) {
                for (var cl2 = 0; cl2 < classes.length; cl2++) {
                    if (sel.indexOf('.' + classes[cl2]) !== -1) return value;
                }
            }
        }
        var parent = el.parentElement;
        if (parent && parent !== el.ownerDocument.body && parent !== el.ownerDocument.documentElement) {
            for (var r2 = 0; r2 < cssRules.length; r2++) {
                var psel = cssRules[r2].selector;
                var pmatch = cssRules[r2].css.match(new RegExp(prop + '\\s*:\\s*([^;}]+)', 'i'));
                if (pmatch && psel.indexOf(tag) !== -1) return pmatch[1].trim();
            }
        }
        return null;
    }

    function parseCssRules(styleText) {
        var rules = [];
        var cleaned = styleText.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n/g, ' ');
        var blocks = cleaned.match(/([^{]+)\{([^}]+)\}/g) || [];
        blocks.forEach(function (block) {
            var parts = block.match(/([^{]+)\{([^}]+)\}/);
            if (parts) {
                var selectors = parts[1].split(',').map(function (s) { return s.trim(); });
                selectors.forEach(function (sel) {
                    rules.push({ selector: sel, css: parts[2] });
                });
            }
        });
        return rules;
    }

    function pptxFontFromHtml(pxSize) {
        return Math.min(72, Math.max(8, Math.round(pxSize * 1.33)));
    }

    window.exportToEditablePPTX = async function (slides, title) {
        if (!slides || slides.length === 0) { alert('No slides to export.'); return; }

        var overlay = document.createElement('div');
        overlay.id = 'export-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:"Segoe UI",sans-serif;';
        overlay.innerHTML = '<div style="background:#1a1a2e;border:1px solid #4fc3f7;border-radius:16px;padding:30px 40px;text-align:center;max-width:400px;"><div style="width:32px;height:32px;border:3px solid #333;border-top-color:#4fc3f7;border-radius:50%;animation:gen-spin 0.8s linear infinite;margin:0 auto 16px;"></div><div style="color:#4fc3f7;font-size:16px;font-weight:600;">Building editable PPTX...</div><div id="editable-pptx-progress" style="color:#a0a0b0;font-size:13px;margin-top:8px;">Processing 0 / ' + slides.length + '</div></div>';
        document.body.appendChild(overlay);
        var progress = overlay.querySelector('#editable-pptx-progress');

        if (typeof PptxGenJS === 'undefined') {
            try {
                await loadScript('https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js');
            } catch (e) {
                overlay.remove();
                alert('Failed to load PptxGenJS.');
                return;
            }
        }

        var DEFAULT_TAG_SIZES = { H1: 48, H2: 36, H3: 28, H4: 22, H5: 18, H6: 16, P: 18, LI: 16, TD: 14, TH: 16, SPAN: 14, DIV: 16 };

        try {
            var pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_WIDE';
            pptx.title = title || 'Presentation';
            pptx.author = 'Presentation Canvas';

            for (var i = 0; i < slides.length; i++) {
                if (progress) progress.textContent = 'Processing ' + (i + 1) + ' / ' + slides.length;

                var parser = new DOMParser();
                var doc = parser.parseFromString(slides[i], 'text/html');
                var body = doc.querySelector('body');
                var styleEl = doc.querySelector('style');
                var cssRules = styleEl ? parseCssRules(styleEl.textContent) : [];
                var slide = pptx.addSlide();

                var bgColor = '1A1A2E';
                if (body) {
                    var bodyStyle = body.getAttribute('style') || '';
                    var bgMatch = bodyStyle.match(/background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})/i) ||
                        (styleEl && styleEl.textContent.match(/body\s*\{[^}]*background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})/i));
                    if (bgMatch) bgColor = sanitizeColorForPptx(bgMatch[1]);
                }
                slide.background = { color: bgColor };

                var bodyChildren = body ? Array.from(body.children) : [];
                var currentY = 0.4;
                var LEFT_MARGIN = 0.5;
                var RIGHT_MARGIN = 0.5;
                var FULL_WIDTH = 12.33;
                var slideBottom = 7.1;
                var imageCount = 0;

                bodyChildren.forEach(function (container) {
                    if (container.tagName === 'IMG') return;

                    var headings = container.querySelectorAll('h1,h2,h3,h4,h5,h6');
                    var paragraphs = container.querySelectorAll('p');
                    var lists = container.querySelectorAll('ul,ol');
                    var tables = container.querySelectorAll('table');
                    var images = container.querySelectorAll('img');

                    headings.forEach(function (h) {
                        var text = h.textContent.trim();
                        if (!text) return;
                        var tag = h.tagName.toUpperCase();
                        var fontSize = parseInt(resolveStyle(h, cssRules, 'font-size')) || DEFAULT_TAG_SIZES[tag] || 36;
                        var pptxFs = pptxFontFromHtml(fontSize);
                        var color = resolveStyle(h, cssRules, 'color');
                        var pptxColor = color ? sanitizeColorForPptx(color) : 'FFFFFF';
                        var isBold = tag === 'H1' || tag === 'H2' || tag === 'H3' ||
                            (resolveStyle(h, cssRules, 'font-weight') || '').match(/bold|700|800|900/);
                        var marginBottom = tag === 'H1' ? 0.15 : tag === 'H2' ? 0.1 : 0.06;

                        slide.addText(text, {
                            x: LEFT_MARGIN, y: currentY, w: FULL_WIDTH,
                            h: (pptxFs / 72) + marginBottom,
                            fontSize: pptxFs, color: pptxColor, bold: !!isBold,
                            align: 'left', fontFace: 'Calibri'
                        });
                        currentY += (pptxFs / 72) + marginBottom + 0.06;
                    });

                    paragraphs.forEach(function (p) {
                        var text = p.textContent.trim();
                        if (!text) return;
                        var fontSize = parseInt(resolveStyle(p, cssRules, 'font-size')) || 18;
                        var pptxFs = pptxFontFromHtml(fontSize);
                        var color = resolveStyle(p, cssRules, 'color');
                        var pptxColor = color ? sanitizeColorForPptx(color) : 'FFFFFF';
                        var isBold = (resolveStyle(p, cssRules, 'font-weight') || '').match(/bold|700|800|900/);
                        var lineH = (pptxFs / 72) + 0.04;
                        var estLines = Math.max(1, Math.ceil(text.length / 90));
                        var textH = estLines * lineH;

                        slide.addText(text, {
                            x: LEFT_MARGIN, y: currentY, w: FULL_WIDTH,
                            h: textH, fontSize: pptxFs, color: pptxColor, bold: !!isBold,
                            align: 'left', fontFace: 'Calibri'
                        });
                        currentY += textH + 0.08;
                    });

                    lists.forEach(function (list) {
                        var items = list.querySelectorAll('li');
                        if (items.length === 0) return;
                        var textLines = [];
                        items.forEach(function (li) {
                            var t = li.textContent.trim();
                            if (t) textLines.push({ text: '\u2022 ' + t, options: { bullet: true } });
                        });
                        if (textLines.length === 0) return;
                        var liFontSize = parseInt(resolveStyle(items[0], cssRules, 'font-size')) || 16;
                        var liPptxFs = pptxFontFromHtml(liFontSize);
                        var liColor = resolveStyle(items[0], cssRules, 'color');
                        var liPptxColor = liColor ? sanitizeColorForPptx(liColor) : 'FFFFFF';
                        var lineH = (liPptxFs / 72) + 0.06;
                        var listH = textLines.length * lineH;

                        slide.addText(textLines, {
                            x: LEFT_MARGIN + 0.25, y: currentY, w: FULL_WIDTH - 0.25,
                            h: listH, fontSize: liPptxFs, color: liPptxColor,
                            align: 'left', fontFace: 'Calibri', bullet: true
                        });
                        currentY += listH + 0.1;
                    });

                    tables.forEach(function (table) {
                        var rows = table.querySelectorAll('tr');
                        if (rows.length === 0) return;
                        var pptxRows = [];
                        var colCount = 0;
                        rows.forEach(function (row) {
                            var cells = row.querySelectorAll('td,th');
                            colCount = Math.max(colCount, cells.length);
                            var pptxRow = [];
                            cells.forEach(function (cell) {
                                pptxRow.push({ text: cell.textContent.trim(), options: { bold: cell.tagName === 'TH', fontSize: 12, align: 'center', color: '333333', fill: { color: cell.tagName === 'TH' ? 'E0E0E0' : 'FFFFFF' } } });
                            });
                            pptxRows.push(pptxRow);
                        });
                        var tableH = Math.min(3, rows.length * 0.4);
                        var colW = FULL_WIDTH / Math.max(1, colCount);
                        try {
                            slide.addTable(pptxRows, {
                                x: LEFT_MARGIN, y: currentY, w: FULL_WIDTH,
                                border: { pt: 0.5, color: 'CCCCCC' },
                                colW: colW, rowH: 0.35,
                                fontSize: 12, fontFace: 'Calibri'
                            });
                            currentY += tableH + 0.15;
                        } catch (e) {
                            console.warn('Table add failed for slide ' + i, e);
                        }
                    });

                    images.forEach(function (img) {
                        var src = img.getAttribute('src');
                        if (!src || (!src.startsWith('data:image/') && !src.startsWith('http'))) return;
                        try {
                            slide.addImage({
                                data: src,
                                x: 1.5 + (imageCount % 2) * 5,
                                y: currentY + Math.floor(imageCount / 2) * 3,
                                w: 4.5, h: 2.8,
                                sizing: { type: 'contain', w: 4.5, h: 2.8 }
                            });
                            imageCount++;
                        } catch (e) {
                            console.warn('Image skipped in slide ' + i, e);
                        }
                    });
                    if (images.length > 0) {
                        currentY += Math.ceil(images.length / 2) * 3 + 0.2;
                    }
                });

                if (body) {
                    var directImages = body.querySelectorAll(':scope > img');
                    directImages.forEach(function (img) {
                        var src = img.getAttribute('src');
                        if (!src || (!src.startsWith('data:image/') && !src.startsWith('http'))) return;
                        try {
                            slide.addImage({
                                data: src, x: 1.5 + (imageCount % 2) * 5,
                                y: currentY + Math.floor(imageCount / 2) * 3,
                                w: 4.5, h: 2.8,
                                sizing: { type: 'contain', w: 4.5, h: 2.8 }
                            });
                            imageCount++;
                        } catch (e) {}
                    });
                }
            }

            await pptx.writeFile({ fileName: (title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_') + '_editable.pptx' });
        } catch (e) {
            console.error('Editable PPTX error:', e);
            alert('Error creating editable PPTX: ' + e.message);
        }

        overlay.remove();
    };
})();