(function () {
    'use strict';

    const EMU_PER_INCH = 914400;
    const SLIDE_WIDTH_EMU = 12192000;
    const SLIDE_HEIGHT_EMU = 6858000;

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
                    const colorMatch = val.match(/(?:to\s+\w+\s*,)?\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|[\w]+)/);
                    if (colorMatch) bgColor = resolveColor(colorMatch[1]);
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
            texts.push({
                type: 'title',
                text: h.textContent.trim(),
                fontSize: getComputedFontSize(h),
                bold: true,
                color: col
            });
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
                const match = src.match(/^data:(image\/\w+);base64,(.+)$/);
                if (match) {
                    imageData.push({
                        mimeType: match[1],
                        base64: match[2],
                        ext: match[1].replace('image/', '').replace('jpeg', 'jpg')
                    });
                }
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

    function buildPptx(slides, presentationTitle) {
        const escapeXml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        const parsedSlides = slides.map(html => parseSlideHtml(html));

        let imageCounter = 0;
        const slideParts = [];
        const slideRelParts = [];
        const imageParts = [];

        parsedSlides.forEach((slide, i) => {
            let shapes = '';
            let imageRels = '';
            let relCount = 1;
            let shapeId = 1;

            if (slide.bgColor) {
                shapeId++;
                shapes += `<p:sp>
<p:nvSpPr><p:cNvPr id="${shapeId}" name="BG${i+1}"/><p:cNvSpPr/><p:nvPr/></p:nvPr></p:nvSpPr>
<p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${SLIDE_WIDTH_EMU}" cy="${SLIDE_HEIGHT_EMU}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${slide.bgColor}"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr>
</p:sp>`;
            }

            let currentY = 457200;

            const titleTexts = slide.texts.filter(t => t.type === 'title');
            if (titleTexts.length > 0) {
                shapeId++;
                const titleColor = titleTexts[0].color || (isLightColor(slide.bgColor) ? '000000' : 'FFFFFF');
                const titleSize = titleTexts[0].fontSize || 44;
                const titleHeight = Math.round(titleSize * 12700 * 1.4);

                let paras = '';
                titleTexts.forEach(t => {
                    const col = t.color || titleColor;
                    paras += `<a:p><a:r><a:rPr lang="en-US" sz="${titleSize * 100}" b="1" dirty="0"><a:solidFill><a:srgbClr val="${col}"/></a:solidFill><a:latin typeface="Calibri Light"/></a:rPr><a:t>${escapeXml(t.text)}</a:t></a:r></a:p>`;
                });

                shapes += `<p:sp>
<p:nvSpPr><p:cNvPr id="${shapeId}" name="Title ${i+1}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title" idx="0"/></p:nvPr></p:nvSpPr>
<p:spPr><a:xfrm><a:off x="457200" y="${currentY}"/><a:ext cx="${SLIDE_WIDTH_EMU - 914400}" cy="${titleHeight}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
<p:txBody><a:bodyPr anchor="b" lIns="91440" tIns="45720" rIns="91440" bIns="45720"/><a:lstStyle/>${paras}</p:txBody>
</p:sp>`;

                currentY += titleHeight + 114300;
            }

            const bodyTexts = slide.texts.filter(t => t.type !== 'title');
            if (bodyTexts.length > 0) {
                shapeId++;
                const bodyColor = bodyTexts[0].color || (isLightColor(slide.bgColor) ? '000000' : 'FFFFFF');

                let paras = '';
                bodyTexts.forEach(t => {
                    const sz = t.fontSize ? t.fontSize * 100 : 1800;
                    const isBullet = t.type === 'bullet';
                    const buChar = isBullet ? '<a:buChar char="&#x2022;"/>' : '';
                    const col = t.color || bodyColor;
                    paras += `<a:p>${buChar}<a:r><a:rPr lang="en-US" sz="${sz}" dirty="0"><a:solidFill><a:srgbClr val="${col}"/></a:solidFill><a:latin typeface="Calibri"/></a:rPr><a:t>${escapeXml(t.text)}</a:t></a:r></a:p>`;
                });

                const bodyHeight = SLIDE_HEIGHT_EMU - currentY - 228600;

                shapes += `<p:sp>
<p:nvSpPr><p:cNvPr id="${shapeId}" name="Content ${i+1}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr>
<p:spPr><a:xfrm><a:off x="457200" y="${currentY}"/><a:ext cx="${SLIDE_WIDTH_EMU - 914400}" cy="${bodyHeight > 0 ? bodyHeight : 2286000}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
<p:txBody><a:bodyPr lIns="91440" tIns="45720" rIns="91440" bIns="45720"/><a:lstStyle/>${paras}</p:txBody>
</p:sp>`;
                shapeId++;
            }

            slide.images.forEach(img => {
                imageCounter++;
                shapeId++;
                const imgRid = `rId${relCount + 1}`;
                relCount++;

                const imgWidth = 5000000;
                const imgHeight = 3750000;
                const imgX = Math.round((SLIDE_WIDTH_EMU - imgWidth) / 2);
                const imgY = Math.round((SLIDE_HEIGHT_EMU - imgHeight) / 2);

                shapes += `<p:pic>
<p:nvPicPr><p:cNvPr id="${shapeId}" name="Image ${imageCounter}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>
<p:blipFill><a:blip r:embed="${imgRid}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
<p:spPr><a:xfrm><a:off x="${imgX}" y="${imgY}"/><a:ext cx="${imgWidth}" cy="${imgHeight}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
</p:pic>`;

                imageRels += `<Relationship Id="${imgRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${imageCounter}.${img.ext}"/>`;

                try {
                    const binaryStr = atob(img.base64);
                    const bytes = new Uint8Array(binaryStr.length);
                    for (let j = 0; j < binaryStr.length; j++) {
                        bytes[j] = binaryStr.charCodeAt(j);
                    }
                    imageParts.push({ name: `ppt/media/image${imageCounter}.${img.ext}`, content: bytes });
                } catch (e) {
                    console.warn('Failed to decode image for PPTX:', e);
                }
            });

            const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${shapes}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;

            slideParts.push(slideXml);

            const slideRelXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
${imageRels}</Relationships>`;

            slideRelParts.push(slideRelXml);
        });

        const numSlides = parsedSlides.length;

        const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Default Extension="jpg" ContentType="image/jpeg"/>
<Default Extension="jpeg" ContentType="image/jpeg"/>
<Default Extension="gif" ContentType="image/gif"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
${parsedSlides.map((_, i) => `<Override PartName="/ppt/slides/slide${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('\n')}
</Types>`;

        const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;

        const presentationRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
${parsedSlides.map((_, i) => `<Relationship Id="rId${i+3}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i+1}.xml"/>`).join('\n')}
</Relationships>`;

        const presentation = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" saveSubsetFonts="1">
<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
<p:sldIdLst>${parsedSlides.map((_, i) => `<p:sldId id="${256+i}" r:id="rId${i+3}"/>`).join('')}</p:sldIdLst>
<p:sldSz cx="${SLIDE_WIDTH_EMU}" cy="${SLIDE_HEIGHT_EMU}"/>
<p:notesSz cx="${SLIDE_HEIGHT_EMU}" cy="${SLIDE_WIDTH_EMU}"/>
</p:presentation>`;

        const slideMasterRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`;

        const slideLayoutRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`;

        const slideMasterXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`;

        const slideLayoutXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">
<p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;

        const themeXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Canvas Theme">
<a:themeElements>
<a:clrScheme name="Canvas"><a:dk1><a:srgbClr val="000000"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1A1A2E"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4FC3F7"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme>
<a:fontScheme name="Canvas"><a:majorFont><a:latin typeface="Calibri Light"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>
<a:fmtScheme name="Canvas"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw rotWithShape="1" blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="100000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme>
</a:themeElements>
<a:objectDefaults/><a:extraClrSchemeLst/>
</a:theme>`;

        return {
            rootRels, contentTypes, presentation, presentationRels,
            slideMaster: slideMasterXml, slideMasterRels,
            slideLayout: slideLayoutXml, slideLayoutRels,
            slideParts, slideRelParts, themeXml, imageParts
        };
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
        const pptxData = buildPptx(slides, title || 'Presentation');
        downloadPptx(pptxData, `${(title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_')}.pptx`, slides);
    };

    function downloadPptx(pptxData, filename, slides) {
        const JSZip = window.JSZip;
        if (!JSZip) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => createZipAndDownload(pptxData, filename);
            script.onerror = () => {
                alert('Failed to load JSZip. Opening HTML export instead.');
                fallbackHtmlExport(slides, filename);
            };
            document.head.appendChild(script);
        } else {
            createZipAndDownload(pptxData, filename);
        }
    }

    async function createZipAndDownload(pptxData, filename) {
        const zip = new JSZip();
        zip.file('[Content_Types].xml', pptxData.contentTypes);
        zip.file('_rels/.rels', pptxData.rootRels);
        zip.file('ppt/presentation.xml', pptxData.presentation);
        zip.file('ppt/_rels/presentation.xml.rels', pptxData.presentationRels);
        zip.file('ppt/slideMasters/slideMaster1.xml', pptxData.slideMaster);
        zip.file('ppt/slideMasters/_rels/slideMaster1.xml.rels', pptxData.slideMasterRels);
        zip.file('ppt/slideLayouts/slideLayout1.xml', pptxData.slideLayout);
        zip.file('ppt/slideLayouts/_rels/slideLayout1.xml.rels', pptxData.slideLayoutRels);
        zip.file('ppt/theme/theme1.xml', pptxData.themeXml);

        pptxData.slideParts.forEach((content, i) => {
            zip.file(`ppt/slides/slide${i+1}.xml`, content);
            zip.file(`ppt/slides/_rels/slide${i+1}.xml.rels`, pptxData.slideRelParts[i]);
        });

        pptxData.imageParts.forEach(img => {
            zip.file(img.name, img.content);
        });

        const blob = await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        });

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
            const escaped = slide.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            htmlContent += `<div class="slide"><iframe srcdoc="${escaped}" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
        });

        htmlContent += '</body></html>';
        const w = window.open('', '_blank');
        w.document.write(htmlContent);
        w.document.close();
    }
})();