(function () {
    'use strict';

    function extractTextContent(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const headings = doc.querySelectorAll('h1, h2, h3');
        const paragraphs = doc.querySelectorAll('p');
        const listItems = doc.querySelectorAll('li');

        let textContent = '';
        headings.forEach(h => { textContent += h.textContent.trim() + '\n'; });
        paragraphs.forEach(p => { textContent += p.textContent.trim() + '\n'; });
        listItems.forEach(li => { textContent += '• ' + li.textContent.trim() + '\n'; });

        return textContent.trim();
    }

    function extractImages(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const images = doc.querySelectorAll('img');
        const result = [];

        images.forEach(img => {
            result.push({
                src: img.getAttribute('src') || '',
                alt: img.getAttribute('alt') || ''
            });
        });

        return result;
    }

    function extractTitle(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const h1 = doc.querySelector('h1');
        if (h1) return h1.textContent.trim();
        const h2 = doc.querySelector('h2');
        if (h2) return h2.textContent.trim();
        const title = doc.querySelector('title');
        if (title) return title.textContent.trim();
        return 'Slide';
    }

    function createPrintWindow(slides) {
        const printWindow = window.open('', '_blank');
        let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Presentation Export</title>
<style>
@page { size: 960px 540px; margin: 0; }
body { margin: 0; padding: 0; }
.slide-page { width: 960px; height: 540px; page-break-after: always; overflow: hidden; }
.slide-page:last-child { page-break-after: avoid; }
.slide-page iframe { width: 960px; height: 540px; border: none; }
@media print {
    body { margin: 0; }
    .slide-page { page-break-after: always; }
    .no-print { display: none; }
}
</style>
</head>
<body>
<div class="no-print" style="padding:20px;font-family:sans-serif;text-align:center;">
<h1>Presentation Export</h1>
<p>Use Ctrl+P (Cmd+P on Mac) to print/save as PDF.</p>
<p>Set page size to landscape and margins to none for best results.</p>
<button onclick="window.print()" style="padding:10px 30px;font-size:16px;cursor:pointer;margin:10px;">Print / Save as PDF</button>
</div>`;

        slides.forEach(slideHtml => {
            html += `<div class="slide-page"><iframe srcdoc="${escapeAttr(slideHtml)}" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
        });

        html += `</body></html>`;
        printWindow.document.write(html);
        printWindow.document.close();
        return printWindow;
    }

    function escapeAttr(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    window.exportToPDF = function (slides, title) {
        if (!slides || slides.length === 0) {
            alert('No slides to export.');
            return;
        }

        const printWindow = window.open('', '_blank');
        let htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeAttr(title || 'Presentation')}</title>
<style>
@page { size: landscape; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #fff; }
.slide-container {
    width: 960px;
    height: 540px;
    overflow: hidden;
    page-break-after: always;
    position: relative;
    margin: 0 auto;
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
    background: rgba(0,0,0,0.8);
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
    .slide-container { page-break-after: always; }
}
</style>
</head>
<body>
<div class="controls">
<h2>Export to PDF</h2>
<p>Use your browser's print function (Ctrl+P / Cmd+P)</p>
<p>Set margins to "None" and enable "Background Graphics"</p>
<button onclick="window.print()">Print / Save as PDF</button>
<button onclick="window.close()">Close</button>
</div>
<div id="slides-area">`;

        slides.forEach((slideHtml, i) => {
            htmlContent += `<div class="slide-container"><iframe srcdoc="${escapeAttr(slideHtml)}" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
        });

        htmlContent += `</div></body></html>`;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    window.exportToPPTX = function (slides, title) {
        if (!slides || slides.length === 0) {
            alert('No slides to export.');
            return;
        }

        const slideData = slides.map((slideHtml, index) => {
            const textContent = extractTextContent(slideHtml);
            const title = extractTitle(slideHtml);
            const images = extractImages(slideHtml);
            return {
                index: index + 1,
                title: title,
                content: textContent,
                images: images,
                html: slideHtml
            };
        });

        const pptxXml = generatePptxXml(slideData, title || 'Presentation');

        const blob = new Blob([pptxXml], {
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    function generatePptxXml(slides, title) {
        const escapeXml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

        let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<presentation xmlns="http://schemas.openxmlformats.org/presentationml/2006/main"
    xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:presentationPr/>
<sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
</sldMasterIdLst>
<sldIdLst>`;

        slides.forEach((slide, i) => {
            xml += `\n    <p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`;
        });

        xml += `\n</sldIdLst>
<sldSz cx="9144000" cy="6858000" type="screen4x3"/>
<notesSz cx="6858000" cy="9144000"/>
</presentation>`;

        return xml;
    }

    window.exportToPPTX = function (slides, title) {
        if (!slides || slides.length === 0) {
            alert('No slides to export.');
            return;
        }

        const slideData = slides.map((slideHtml, index) => {
            const textContent = extractTextContent(slideHtml);
            const slideTitle = extractTitle(slideHtml);
            return {
                title: slideTitle,
                content: textContent,
                html: slideHtml
            };
        });

        const pptxContent = generateSimplePptx(slideData, title || 'Presentation');
        downloadFile(pptxContent, `${(title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_')}.pptx`);
    };

    function generateSimplePptx(slides, title) {
        const SLIDE_WIDTH = 9144000;
        const SLIDE_HEIGHT = 6858000;

        let rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;

        let contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>`;

        let slideRels = [];
        let slideParts = [];

        slides.forEach((slide, i) => {
            contentTypes += `\n<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
        });

        contentTypes += `\n</Types>`;

        let presentationRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>`;

        slides.forEach((slide, i) => {
            presentationRels += `\n<Relationship Id="rId${i + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`;
        });

        presentationRels += `\n</Relationships>`;

        let slideMasterRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme1.xml"/>
</Relationships>`;

        let slideLayoutRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`;

        let presentation = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" saveSubsetFonts="1">
<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
<p:sldIdLst>`;

        slides.forEach((slide, i) => {
            presentation += `<p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`;
        });

        presentation += `</p:sldIdLst>
<p:sldSz cx="${SLIDE_WIDTH}" cy="${SLIDE_HEIGHT}"/>
</p:presentation>`;

        const escapeXml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

        slides.forEach((slide, i) => {
            const lines = slide.content.split('\n').filter(l => l.trim());
            let shapes = '';

            if (slide.title) {
                shapes += `<p:sp>
<p:nvSpPr><p:cNvPr id="1" name="Title ${i + 1}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title" idx="0"/></p:nvPr></p:nvSpPr>
<p:spPr><a:xfrm><a:off x="457200" y="274638"/><a:ext cx="8229600" cy="1143000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" sz="4400" b="1" dirty="0"/><a:t>${escapeXml(slide.title)}</a:t></a:r></a:p></p:txBody>
</p:sp>`;
            }

            if (lines.length > 0) {
                let bodyParagraphs = '';
                lines.forEach((line, li) => {
                    if (line !== slide.title) {
                        bodyParagraphs += `<a:p><a:r><a:rPr lang="en-US" sz="1800" dirty="0"/><a:t>${escapeXml(line)}</a:t></a:r></a:p>`;
                    }
                });

                if (bodyParagraphs) {
                    shapes += `<p:sp>
<p:nvSpPr><p:cNvPr id="2" name="Content ${i + 1}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr>
<p:spPr><a:xfrm><a:off x="457200" cy="1600200"/><a:ext cx="8229600" cy="4572000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
<p:txBody><a:bodyPr/><a:lstStyle/>${bodyParagraphs}</p:txBody>
</p:sp>`;
                }
            }

            const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${shapes}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;

            slideParts.push({
                name: `ppt/slides/slide${i + 1}.xml`,
                content: slideXml
            });

            slideRels.push(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`);
        });

        const slideMasterXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`;

        const slideLayoutXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">
<p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;

        return {
            rels,
            contentTypes,
            presentation,
            presentationRels,
            slideMaster: slideMasterXml,
            slideMasterRels,
            slideLayout: slideLayoutXml,
            slideLayoutRels,
            slideParts,
            slideRels,
            slides
        };
    }

    function downloadFile(pptxData, filename) {
        const JSZip = window.JSZip;
        if (!JSZip) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => createAndDownloadPptx(pptxData, filename);
            script.onerror = () => {
                alert('Failed to load JSZip library. Trying alternative method...');
                fallbackHtmlExport(pptxData.slides, filename);
            };
            document.head.appendChild(script);
        } else {
            createAndDownloadPptx(pptxData, filename);
        }
    }

    async function createAndDownloadPptx(pptxData, filename) {
        const zip = new JSZip();

        zip.file('[Content_Types].xml', pptxData.contentTypes);
        zip.file('_rels/.rels', pptxData.rels);
        zip.file('ppt/presentation.xml', pptxData.presentation);
        zip.file('ppt/_rels/presentation.xml.rels', pptxData.presentationRels);
        zip.file('ppt/slideMasters/slideMaster1.xml', pptxData.slideMaster);
        zip.file('ppt/slideMasters/_rels/slideMaster1.xml.rels', pptxData.slideMasterRels);
        zip.file('ppt/slideLayouts/slideLayout1.xml', pptxData.slideLayout);
        zip.file('ppt/slideLayouts/_rels/slideLayout1.xml.rels', pptxData.slideLayoutRels);

        pptxData.slideParts.forEach((slide, i) => {
            zip.file(`ppt/slides/slide${i + 1}.xml`, slide.content);
            zip.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, pptxData.slideRels[i]);
        });

        const themeXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Canvas Theme">
<a:themeElements><a:clrScheme name="Canvas"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Canvas"><a:majorFont><a:latin typeface="Calibri Light"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme><a:fmtScheme name="Canvas"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:shade val="93000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`;

        zip.file('ppt/theme/theme1.xml', themeXml);

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function fallbackHtmlExport(slides, title) {
        let htmlContent = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${title}</title>
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
<h1>${title}</h1>
<button onclick="window.print()">Print / Save as PDF</button>
</div>`;

        slides.forEach(slide => {
            const escaped = slide.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
            htmlContent += `<div class="slide"><iframe srcdoc="${escaped}" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
        });

        htmlContent += '</body></html>';

        const w = window.open('', '_blank');
        w.document.write(htmlContent);
        w.document.close();
    }
})();