(function () {
    'use strict';

    function parseSlideHtml(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const styleTag = doc.querySelector('style');
        const css = styleTag ? styleTag.textContent : '';

        const cssVars = {};
        const varMatches = css.matchAll(/--([\w-]+)\s*:\s*([^;}\n]+)/g);
        for (const m of varMatches) {
            let val = m[2].trim();
            for (const [k, v] of Object.entries(cssVars)) {
                val = val.replace(`var(--${k})`, v);
            }
            cssVars[m[1]] = val;
        }

        function resolveColor(str) {
            if (!str) return null;
            str = str.trim();
            const varRef = str.match(/var\(--([\w-]+)\)/);
            if (varRef) {
                const resolved = cssVars[varRef[1]];
                if (resolved) str = resolved;
            }
            return parseCssColor(str);
        }

        let bgColor = null;
        let textColor = null;

        const bodyEl = doc.querySelector('body');
        if (bodyEl) {
            const bs = bodyEl.style;
            if (bs.background) bgColor = resolveColor(bs.background.split(',')[0]);
            if (bs.backgroundColor) bgColor = resolveColor(bs.backgroundColor);
            if (bs.color) textColor = resolveColor(bs.color);
        }

        if (styleTag && !bgColor) {
            const bgMatch = css.match(/body\s*\{[^}]*background(?:-color)?\s*:\s*([^;}]+)/);
            if (bgMatch) {
                let val = bgMatch[1].trim();
                if (val.startsWith('linear-gradient')) {
                    const cm = val.match(/(?:to\s+\w+\s*,)?\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|[\w]+)/);
                    if (cm) bgColor = resolveColor(cm[1]);
                } else {
                    bgColor = resolveColor(val);
                }
            }
        }
        if (styleTag && !textColor) {
            const colorMatch = css.match(/body\s*\{[^}]*\bcolor\s*:\s*([^;}]+)/);
            if (colorMatch) textColor = resolveColor(colorMatch[1].trim());
        }

        if (!bgColor) bgColor = 'FFFFFF';
        if (!textColor) textColor = '000000';

        const headings = doc.querySelectorAll('h1, h2, h3');
        const title = headings.length > 0 ? headings[0].textContent.trim() : 'Slide';

        const texts = [];
        headings.forEach(h => {
            const col = resolveColor(h.getAttribute('style')?.match(/color\s*:\s*([^;}"']+)/)?.[1]) || textColor;
            texts.push({ type: 'title', text: h.textContent.trim(), fontSize: getComputedFontSize(h), bold: true, color: col });
        });

        const paragraphs = doc.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (p.querySelector('h1,h2,h3,h4,h5,h6')) return;
            const t = p.textContent.trim();
            if (!t) return;
            const col = resolveColor(p.getAttribute('style')?.match(/color\s*:\s*([^;}"']+)/)?.[1]) || textColor;
            texts.push({ type: 'body', text: t, fontSize: getComputedFontSize(p), bold: false, color: col });
        });

        const listItems = doc.querySelectorAll('li');
        listItems.forEach(li => {
            const t = li.textContent.trim();
            if (!t) return;
            const col = resolveColor(li.getAttribute('style')?.match(/color\s*:\s*([^;}"']+)/)?.[1]) || getColorFromAncestors(li) || textColor;
            texts.push({ type: 'bullet', text: t, fontSize: getComputedFontSize(li), bold: false, color: col });
        });

        const images = doc.querySelectorAll('img');
        const imageData = [];
        images.forEach(img => {
            const src = img.getAttribute('src') || '';
            if (src.startsWith('data:image')) {
                imageData.push(src);
            }
        });

        return { title, texts: texts.filter(t => t.text.length > 0), bgColor, textColor, images: imageData };
    }

    function getColorFromAncestors(el) {
        let current = el.parentElement;
        while (current && current.tagName !== 'BODY') {
            const style = current.getAttribute('style') || '';
            const m = style.match(/color\s*:\s*([^;}"']+)/);
            if (m) return parseCssColor(m[1].trim());
            current = current.parentElement;
        }
        return null;
    }

    function parseCssColor(str) {
        if (!str) return null;
        str = String(str).trim();
        let hexMatch = str.match(/#([0-9a-fA-F]{3,8})/);
        if (hexMatch) {
            let hex = hexMatch[1];
            if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            if (hex.length >= 6) hex = hex.substring(0, 6);
            return hex.toUpperCase();
        }
        const rgbMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
            const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
            const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
            return (r + g + b).toUpperCase();
        }
        const namedColors = {
            white: 'FFFFFF', black: '000000', red: 'FF0000', green: '008000',
            blue: '0000FF', navy: '000080', gray: '808080', grey: '808080',
            yellow: 'FFFF00', orange: 'FFA500', purple: '800080', cyan: '00FFFF',
            transparent: null
        };
        if (namedColors[str.toLowerCase()] !== undefined) return namedColors[str.toLowerCase()];
        return null;
    }

    function getComputedFontSize(el) {
        const style = el.getAttribute('style') || '';
        const m = style.match(/font-size\s*:\s*(\d+)/);
        if (m) return parseInt(m[1]);
        const tag = el.tagName.toLowerCase();
        if (tag === 'h1') return 44;
        if (tag === 'h2') return 32;
        if (tag === 'h3') return 24;
        if (tag === 'li') return 18;
        return 18;
    }

    function isLightColor(hex) {
        if (!hex) return true;
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 > 128;
    }

    function hexToRgb(hex) {
        if (!hex) return 'FFFFFF';
        return hex;
    }

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

    window.exportToPPTX = function (slides, title) {
        if (!slides || slides.length === 0) { alert('No slides to export.'); return; }

        if (typeof PptxGenJS === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js';
            script.onload = () => doPptxExport(slides, title);
            script.onerror = () => {
                alert('Failed to load PptxGenJS library. Opening HTML export instead.');
                fallbackHtmlExport(slides, title);
            };
            document.head.appendChild(script);
        } else {
            doPptxExport(slides, title);
        }
    };

    function doPptxExport(slides, title) {
        try {
            const pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_WIDE';
            pptx.title = title || 'Presentation';
            pptx.author = 'Canvas';
            pptx.subject = 'Generated by Canvas AI';

            const parsedSlides = slides.map(html => parseSlideHtml(html));

            parsedSlides.forEach((slide) => {
                const pptSlide = pptx.addSlide();

                if (slide.bgColor) {
                    pptSlide.background = { color: hexToRgb(slide.bgColor) };
                }

                const hasDarkBg = slide.bgColor && !isLightColor(slide.bgColor);

                let yPos = 0.5;

                const titleTexts = slide.texts.filter(t => t.type === 'title');
                if (titleTexts.length > 0) {
                    const titleSize = Math.min(titleTexts[0].fontSize, 44);
                    const titleColor = titleTexts[0].color || (hasDarkBg ? 'FFFFFF' : '000000');

                    const titleStr = titleTexts.map(t => t.text).join('\n');
                    pptSlide.addText(titleStr, {
                        x: 0.5,
                        y: yPos,
                        w: '90%',
                        h: titleSize * 0.03,
                        fontSize: titleSize,
                        bold: true,
                        color: hexToRgb(titleColor),
                        fontFace: 'Calibri Light',
                        valign: 'bottom'
                    });
                    yPos += titleSize * 0.03 + 0.15;
                }

                const bodyTexts = slide.texts.filter(t => t.type !== 'title');
                if (bodyTexts.length > 0) {
                    const bodyColor = bodyTexts[0].color || (hasDarkBg ? 'FFFFFF' : '000000');

                    const textRows = bodyTexts.map(t => {
                        const sz = Math.min(t.fontSize || 18, 24);
                        return {
                            text: t.text,
                            options: {
                                fontSize: sz,
                                color: hexToRgb(t.color || bodyColor),
                                bullet: t.type === 'bullet',
                                bold: t.type === 'title',
                                fontFace: 'Calibri'
                            }
                        };
                    });

                    const remainingHeight = 7.5 - yPos - 0.3;
                    pptSlide.addText(textRows, {
                        x: 0.5,
                        y: yPos,
                        w: '90%',
                        h: remainingHeight > 0 ? remainingHeight : 3,
                        valign: 'top',
                        fontFace: 'Calibri'
                    });
                }

                slide.images.forEach(imgSrc => {
                    try {
                        pptSlide.addImage({ data: imgSrc, x: 1.5, y: 1.5, w: 4, h: 3 });
                    } catch (e) {
                        console.warn('Could not add image to slide:', e);
                    }
                });
            });

            pptx.writeFile({ fileName: `${(title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_')}.pptx` });

        } catch (e) {
            console.error('PptxGenJS error:', e);
            alert('Error creating PPTX: ' + e.message + '\n\nOpening HTML export instead.');
            fallbackHtmlExport(slides, title);
        }
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