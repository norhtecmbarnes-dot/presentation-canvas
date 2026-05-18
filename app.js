(function () {
    'use strict';

    const DEFAULT_SLIDE_HTML = `<!DOCTYPE html>
<html><head><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Segoe UI', sans-serif; background: #ffffff; color: #222; }
.container { text-align: center; padding: 40px; }
h1 { font-size: 48px; margin-bottom: 16px; color: #333; }
p { font-size: 24px; color: #666; }
</style></head><body>
<div class="container"><h1>New Slide</h1><p>Start describing your presentation in the chat panel.</p></div>
</body></html>`;

    const SLIDE_THEMES = {
        dark: {
            background: '#1a1a2e', color: '#e0e0e0', accent: '#4fc3f7',
            h1Color: '#ffffff', h2Color: '#4fc3f7', linkColor: '#81d4fa'
        },
        light: {
            background: '#ffffff', color: '#222222', accent: '#1976d2',
            h1Color: '#111111', h2Color: '#1976d2', linkColor: '#1565c0'
        },
        blue: {
            background: '#0d47a1', color: '#e3f2fd', accent: '#ffca28',
            h1Color: '#ffffff', h2Color: '#ffca28', linkColor: '#81d4fa'
        },
        green: {
            background: '#1b5e20', color: '#e8f5e9', accent: '#ffca28',
            h1Color: '#ffffff', h2Color: '#a5d6a7', linkColor: '#c8e6c9'
        },
        red: {
            background: '#b71c1c', color: '#ffebee', accent: '#ffcdd2',
            h1Color: '#ffffff', h2Color: '#ffcdd2', linkColor: '#ef9a9a'
        }
    };

    let state = {
        slides: [],
        currentSlideIndex: 0,
        uploadedImages: [],
        chatHistory: [],
        isGenerating: false,
        abortController: null,
        settings: {
            ollamaUrl: 'http://localhost:11434',
            openaiKey: '',
            openaiUrl: 'https://api.openai.com/v1',
            openaiModel: 'gpt-4o',
            zhipuKey: '',
            zhipuModel: 'glm-4',
            customUrl: '',
            customKey: '',
            customModel: ''
        },
        currentProvider: 'ollama',
        currentModel: '',
        currentView: 'preview',
        currentTheme: 'dark'
    };

    function loadSettings() {
        try {
            const saved = localStorage.getItem('canvas_settings');
            if (saved) Object.assign(state.settings, JSON.parse(saved));
        } catch (e) { /* ignore */ }
    }

    function saveSettings() {
        localStorage.setItem('canvas_settings', JSON.stringify(state.settings));
    }

    function loadSlides() {
        try {
            const saved = localStorage.getItem('canvas_slides');
            if (saved) {
                state.slides = JSON.parse(saved);
                if (state.slides.length > 0) return true;
            }
        } catch (e) { /* ignore */ }
        return false;
    }

    function saveSlides() {
        localStorage.setItem('canvas_slides', JSON.stringify(state.slides));
    }

    function addSlide(html) {
        state.slides.push(html || DEFAULT_SLIDE_HTML);
        state.currentSlideIndex = state.slides.length - 1;
        saveSlides();
        renderAll();
    }

    function deleteSlide(index) {
        if (state.slides.length <= 1) return;
        state.slides.splice(index, 1);
        if (state.currentSlideIndex >= state.slides.length) {
            state.currentSlideIndex = state.slides.length - 1;
        }
        saveSlides();
        renderAll();
    }

    function moveSlide(from, to) {
        if (to < 0 || to >= state.slides.length) return;
        const [slide] = state.slides.splice(from, 1);
        state.slides.splice(to, 0, slide);
        state.currentSlideIndex = to;
        saveSlides();
        renderAll();
    }

    function updateCurrentSlide(html) {
        if (state.slides.length === 0) {
            state.slides.push(html);
        } else {
            state.slides[state.currentSlideIndex] = html;
        }
        saveSlides();
        renderSlidePreview();
        renderThumbnails();
    }

    function renderSlidePreview() {
        const previewArea = document.getElementById('slide-preview-area');
        const htmlArea = document.getElementById('slide-html-area');
        const htmlEditor = document.getElementById('slide-html-editor');

        if (state.slides.length === 0) {
            previewArea.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:18px;">No slides yet. Use the chat to generate slides.</div>';
            htmlEditor.value = '';
            return;
        }

        const slideHtml = state.slides[state.currentSlideIndex] || DEFAULT_SLIDE_HTML;

        let existingIframe = previewArea.querySelector('iframe');
        if (!existingIframe) {
            previewArea.innerHTML = '';
            existingIframe = document.createElement('iframe');
            existingIframe.sandbox = 'allow-scripts allow-same-origin';
            previewArea.appendChild(existingIframe);
        }
        existingIframe.srcdoc = slideHtml;

        htmlEditor.value = slideHtml;
    }

    function renderThumbnails() {
        const container = document.getElementById('slide-thumbnails');
        container.innerHTML = '';
        state.slides.forEach((slide, i) => {
            const thumb = document.createElement('div');
            thumb.className = 'slide-thumb' + (i === state.currentSlideIndex ? ' active' : '');
            thumb.innerHTML = `<span class="slide-thumb-number">${i + 1}</span>`;

            const iframe = document.createElement('iframe');
            iframe.sandbox = 'allow-scripts allow-same-origin';
            iframe.srcdoc = slide;
            thumb.appendChild(iframe);
            thumb.addEventListener('click', () => {
                state.currentSlideIndex = i;
                renderAll();
            });
            container.appendChild(thumb);
        });
    }

    function renderUploadedImages() {
        const container = document.getElementById('uploaded-images');
        const slideImages = document.getElementById('slide-images');
        container.innerHTML = '';
        slideImages.innerHTML = '';

        state.uploadedImages.forEach((img, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'uploaded-img-thumb';
            thumb.innerHTML = `<img src="${img.data}" alt="${img.name}"><button class="remove-img" data-idx="${idx}">x</button>`;
            container.appendChild(thumb);

            const item = document.createElement('div');
            item.className = 'slide-image-item';
            item.innerHTML = `<img src="${img.data}" alt="${img.name}"><span class="image-name">${img.name}</span><button class="add-to-slide-btn" data-idx="${idx}">Add</button>`;
            slideImages.appendChild(item);
        });

        container.querySelectorAll('.remove-img').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                state.uploadedImages.splice(idx, 1);
                renderUploadedImages();
            });
        });

        slideImages.querySelectorAll('.add-to-slide-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                const img = state.uploadedImages[idx];
                addImageToCurrentSlide(img);
            });
        });
    }

    function addImageToCurrentSlide(img) {
        if (state.slides.length === 0) return;
        const currentHtml = state.slides[state.currentSlideIndex];
        const imgTag = `<img src="${img.data}" style="max-width:80%;max-height:60vh;display:block;margin:20px auto;border-radius:8px;" alt="${img.name}">`;
        const updated = currentHtml.replace('</body>', `${imgTag}</body>`);
        state.slides[state.currentSlideIndex] = updated;
        saveSlides();
        renderSlidePreview();
        renderThumbnails();
    }

    function renderAll() {
        renderSlidePreview();
        renderThumbnails();
        renderUploadedImages();
        updateSlideProps();
    }

    function updateSlideProps() {
        const layoutSelect = document.getElementById('layout-select');
        const themeSelect = document.getElementById('theme-select');
        const transitionSelect = document.getElementById('transition-select');
        themeSelect.value = state.currentTheme;
    }

    function addChatMessage(role, content) {
        const messagesDiv = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        msg.className = `chat-msg ${role}`;
        msg.textContent = content;
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        state.chatHistory.push({ role, content });
    }

    function addSystemMessage(content) {
        const messagesDiv = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        msg.className = 'chat-msg system';
        msg.textContent = content;
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function addErrorMessage(content) {
        const messagesDiv = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        msg.className = 'chat-msg error';
        msg.textContent = content;
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    async function fetchOllamaModels() {
        try {
            const response = await fetch(`${state.settings.ollamaUrl}/api/tags`);
            const data = await response.json();
            return data.models.map(m => m.name) || [];
        } catch (e) {
            console.error('Failed to fetch Ollama models:', e);
            return [];
        }
    }

    async function fetchOpenAIModels() {
        try {
            const headers = { 'Authorization': `Bearer ${state.settings.openaiKey}` };
            const response = await fetch(`${state.settings.openaiUrl}/models`, { headers });
            const data = await response.json();
            return (data.data || []).map(m => m.id);
        } catch (e) {
            console.error('Failed to fetch OpenAI models:', e);
            return [];
        }
    }

    async function refreshModels() {
        const modelSelect = document.getElementById('model-select');
        modelSelect.innerHTML = '<option value="">Loading...</option>';

        const provider = state.currentProvider;
        let models = [];

        if (provider === 'ollama') {
            models = await fetchOllamaModels();
        } else if (provider === 'openai') {
            models = await fetchOpenAIModels();
        } else if (provider === 'zhipu') {
            models = [state.settings.zhipuModel, 'glm-4', 'glm-4-flash', 'glm-4-plus', 'glm-4v'];
        } else if (provider === 'custom') {
            models = [state.settings.customModel].filter(Boolean);
        }

        modelSelect.innerHTML = '';
        if (models.length === 0) {
            modelSelect.innerHTML = '<option value="">No models found</option>';
            return;
        }

        models.forEach(m => {
            const option = document.createElement('option');
            option.value = m;
            option.textContent = m;
            modelSelect.appendChild(option);
        });

        state.currentModel = modelSelect.value;
    }

    async function sendToLLM(prompt, systemPrompt) {
        const provider = state.currentProvider;
        const model = state.currentModel || document.getElementById('model-select').value;

        if (!model) {
            addErrorMessage('No model selected. Please select a model or check your settings.');
            return null;
        }

        state.abortController = new AbortController();

        try {
            if (provider === 'ollama') {
                return await sendToOllama(prompt, systemPrompt, model);
            } else if (provider === 'openai') {
                return await sendToOpenAI(prompt, systemPrompt, model);
            } else if (provider === 'zhipu') {
                return await sendToZhipu(prompt, systemPrompt, model);
            } else if (provider === 'custom') {
                return await sendToCustom(prompt, systemPrompt, model);
            }
        } catch (e) {
            if (e.name === 'AbortError') {
                addSystemMessage('Generation stopped.');
                return null;
            }
            throw e;
        }
    }

    async function sendToOllama(prompt, systemPrompt, model) {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

        const recentHistory = state.chatHistory.slice(-10);
        recentHistory.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                messages.push({ role: msg.role, content: msg.content });
            }
        });
        messages.push({ role: 'user', content: prompt });

        const response = await fetch(`${state.settings.ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, messages, stream: false }),
            signal: state.abortController.signal
        });

        const data = await response.json();
        return data.message?.content || '';
    }

    async function sendToOllamaStream(prompt, systemPrompt, model) {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

        const recentHistory = state.chatHistory.slice(-10);
        recentHistory.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                messages.push({ role: msg.role, content: msg.content });
            }
        });
        messages.push({ role: 'user', content: prompt });

        const response = await fetch(`${state.settings.ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, messages, stream: true }),
            signal: state.abortController.signal
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json.message?.content) {
                        fullContent += json.message.content;
                    }
                } catch (e) { /* skip non-JSON lines */ }
            }
        }

        return fullContent;
    }

    async function sendToOpenAI(prompt, systemPrompt, model) {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

        const recentHistory = state.chatHistory.slice(-10);
        recentHistory.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                messages.push({ role: msg.role, content: msg.content });
            }
        });
        messages.push({ role: 'user', content: prompt });

        const response = await fetch(`${state.settings.openaiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.settings.openaiKey}`
            },
            body: JSON.stringify({ model, messages, stream: false }),
            signal: state.abortController.signal
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }

    async function sendToZhipu(prompt, systemPrompt, model) {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

        const recentHistory = state.chatHistory.slice(-10);
        recentHistory.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                messages.push({ role: msg.role, content: msg.content });
            }
        });
        messages.push({ role: 'user', content: prompt });

        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.settings.zhipuKey}`
            },
            body: JSON.stringify({ model, messages, stream: false }),
            signal: state.abortController.signal
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }

    async function sendToCustom(prompt, systemPrompt, model) {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

        const recentHistory = state.chatHistory.slice(-10);
        recentHistory.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                messages.push({ role: msg.role, content: msg.content });
            }
        });
        messages.push({ role: 'user', content: prompt });

        const headers = { 'Content-Type': 'application/json' };
        if (state.settings.customKey) {
            headers['Authorization'] = `Bearer ${state.settings.customKey}`;
        }

        const response = await fetch(`${state.settings.customUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ model, messages, stream: false }),
            signal: state.abortController.signal
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }

    function getImageContext() {
        if (state.uploadedImages.length === 0) return '';
        let context = '\n\nThe user has uploaded the following images that can be referenced in slides:\n';
        state.uploadedImages.forEach((img, i) => {
            context += `- Image ${i + 1}: "${img.name}" (${img.width}x${img.height})\n`;
        });
        context += '\nTo embed an uploaded image in a slide, use an <img> tag with the src starting with "data:image/..." and include the full base64 data. You can reference the image data directly.';
        return context;
    }

    function getSlideSystemPrompt(mode) {
        const theme = SLIDE_THEMES[state.currentTheme];

        const basePrompt = `You are an expert presentation creator. You create beautiful, professional HTML slides.

CRITICAL RULES:
- Each slide MUST be a COMPLETE, standalone HTML document with <!DOCTYPE html>, <html>, <head>, <style>, and <body> tags.
- Do NOT use any external CSS frameworks or JavaScript libraries. All styling must be inline or in <style> tags.
- Do NOT use external images unless the user provides them. Use CSS for decorations and visual elements.
- Each slide should be 960px wide and 540px tall (16:9 aspect ratio).
- Use modern, clean design principles.
- Ensure text is readable and well-spaced.
- Use the theme colors: background="${theme.background}", text color="${theme.color}", accent="${theme.accent}", h1="${theme.h1Color}", h2="${theme.h2Color}".
- Make slides visually engaging with gradients, shapes, and typography.`;

        if (mode === 'script') {
            return basePrompt + `\n\nYou are in SCRIPT mode. The user will describe a topic, and you must:
1. First, plan the presentation by outlining slide titles and key points.
2. Then generate each slide as a complete HTML document.
3. Output each slide wrapped in special markers: <<<SLIDE>>> at the start and <<<END_SLIDE>>> at the end of each slide HTML.
4. You may include brief commentary between slides explaining your design choices.`;
        } else if (mode === 'markdown') {
            return basePrompt + `\n\nYou are in MARKDOWN mode. Generate slide content using markdown-like syntax with special slide separators:

---SLIDE---
# Title
Content here
---SLIDE---
## Next Slide
More content
---SLIDE---

After generating the markdown, also generate the complete HTML for each slide, wrapped in <<<SLIDE>>> and <<<END_SLIDE>>> markers.`;
        } else {
            return basePrompt + `\n\nYou are in SLIDES mode. Generate complete slide HTML documents directly.
Output each slide wrapped in <<<SLIDE>>> at the start and <<<END_SLIDE>>> at the end.
Generate beautiful, complete slides with all styling included.`;
        }
    }

    function getEditSystemPrompt() {
        const theme = SLIDE_THEMES[state.currentTheme];
        return `You are an expert slide editor. The user wants to modify an existing slide. 

RULES:
- Return the COMPLETE modified HTML document with <!DOCTYPE html>, <html>, <head>, <style>, and <body> tags.
- Do NOT use external CSS frameworks or JavaScript libraries.
- Each slide should be 960px wide and 540px tall.
- Use the theme colors: background="${theme.background}", text color="${theme.color}", accent="${theme.accent}", h1="${theme.h1Color}", h2="${theme.h2Color}".
- Wrap the modified slide in <<<SLIDE>>> and <<<END_SLIDE>>> markers.
- Only change what the user asks you to change, keep the rest intact.`;
    }

    function parseSlidesFromResponse(response) {
        const slides = [];
        const slideRegex = /<<<SLIDE>>>([\s\S]*?)<<<END_SLIDE>>>/g;
        let match;

        while ((match = slideRegex.exec(response)) !== null) {
            let html = match[1].trim();
            if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
                html = '<!DOCTYPE html>' + html;
            }
            slides.push(html);
        }

        if (slides.length === 0) {
            const htmlRegex = /<!DOCTYPE\s+html[^>]*>[\s\S]*?<\/html>/gi;
            while ((match = htmlRegex.exec(response)) !== null) {
                slides.push(match[0].trim());
            }
        }

        if (slides.length === 0) {
            const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/gi;
            while ((match = bodyRegex.exec(response)) !== null) {
                const bodyContent = match[1];
                slides.push(`<!DOCTYPE html><html><head><style>body{margin:0;padding:0;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:${SLIDE_THEMES[state.currentTheme].background};color:${SLIDE_THEMES[state.currentTheme].color};}</style></head><body>${bodyContent}</body></html>`);
            }
        }

        return slides;
    }

    async function handleGenerate() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const stopBtn = document.getElementById('chat-stop-btn');
        const prompt = input.value.trim();

        if (!prompt) return;

        addChatMessage('user', prompt);
        input.value = '';

        state.isGenerating = true;
        sendBtn.disabled = true;
        sendBtn.style.display = 'none';
        stopBtn.style.display = '';

        try {
            const mode = document.getElementById('gen-mode-select').value;
            const systemPrompt = getSlideSystemPrompt(mode) + getImageContext();

            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'chat-msg assistant';
            loadingMsg.innerHTML = '<span class="loading-dots">Generating</span>';
            document.getElementById('chat-messages').appendChild(loadingMsg);
            document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;

            const response = await sendToLLM(prompt, systemPrompt);

            document.getElementById('chat-messages').removeChild(loadingMsg);

            if (response) {
                const parsedSlides = parseSlidesFromResponse(response);

                if (parsedSlides.length > 0) {
                    if (state.slides.length === 1 && state.slides[0] === DEFAULT_SLIDE_HTML) {
                        state.slides = parsedSlides;
                    } else {
                        state.slides = state.slides.concat(parsedSlides);
                    }
                    state.currentSlideIndex = 0;
                    saveSlides();
                    renderAll();

                    const commentary = response.replace(/<<<SLIDE>>>[\s\S]*?<<<END_SLIDE>>>/g, '').trim();
                    if (commentary) {
                        addChatMessage('assistant', `Generated ${parsedSlides.length} slide(s). ${commentary.substring(0, 200)}...`);
                    } else {
                        addChatMessage('assistant', `Generated ${parsedSlides.length} slide(s). You can now edit them or ask for changes.`);
                    }
                } else {
                    addChatMessage('assistant', response.substring(0, 500));
                    addSystemMessage('Could not parse slides from the response. Try rephrasing or using a different generation mode.');
                }
            }
        } catch (e) {
            if (e.name !== 'AbortError') {
                addErrorMessage(`Error: ${e.message}`);
            }
        } finally {
            state.isGenerating = false;
            sendBtn.disabled = false;
            sendBtn.style.display = '';
            stopBtn.style.display = 'none';
            state.abortController = null;
        }
    }

    async function handleEdit() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const stopBtn = document.getElementById('chat-stop-btn');
        const prompt = input.value.trim();

        if (!prompt) return;
        if (state.slides.length === 0) {
            addErrorMessage('No slides to edit. Generate slides first.');
            return;
        }

        addChatMessage('user', prompt);
        input.value = '';

        state.isGenerating = true;
        sendBtn.disabled = true;
        sendBtn.style.display = 'none';
        stopBtn.style.display = '';

        try {
            const currentSlide = state.slides[state.currentSlideIndex];
            const editPrompt = `Here is the current slide HTML:\n\n${currentSlide}\n\nUser request: ${prompt}\n\nPlease return the modified slide HTML wrapped in <<<SLIDE>>> and <<<END_SLIDE>>> markers.`;

            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'chat-msg assistant';
            loadingMsg.innerHTML = '<span class="loading-dots">Editing</span>';
            document.getElementById('chat-messages').appendChild(loadingMsg);

            const response = await sendToLLM(editPrompt, getEditSystemPrompt());

            document.getElementById('chat-messages').removeChild(loadingMsg);

            if (response) {
                const parsedSlides = parseSlidesFromResponse(response);
                if (parsedSlides.length > 0) {
                    state.slides[state.currentSlideIndex] = parsedSlides[0];
                    saveSlides();
                    renderAll();
                    addChatMessage('assistant', 'Slide updated successfully.');
                } else {
                    addChatMessage('assistant', 'Could not parse the edited slide. The response may still contain useful content.');
                    addChatMessage('assistant', response.substring(0, 300));
                }
            }
        } catch (e) {
            if (e.name !== 'AbortError') {
                addErrorMessage(`Error: ${e.message}`);
            }
        } finally {
            state.isGenerating = false;
            sendBtn.disabled = false;
            sendBtn.style.display = '';
            stopBtn.style.display = 'none';
            state.abortController = null;
        }
    }

    function handleSend() {
        const input = document.getElementById('chat-input').value.trim();
        if (!input) return;

        if (state.slides.length === 0) {
            handleGenerate();
        } else {
            handleEdit();
        }
    }

    function applyThemeToSlide(slideHtml, theme) {
        const t = SLIDE_THEMES[theme];
        let html = slideHtml;

        html = html.replace(/(background(?:-color)?\s*:\s*)([^;{}]+)([;}])/gi, `$1${t.background}$3`);
        html = html.replace(/(color\s*:\s*)([^;{}]+)([;}])/gi, (match, prop, val, suff) => {
            if (val.trim().toLowerCase() === t.accent.toLowerCase() || val.trim().toLowerCase() === t.h1Color.toLowerCase()) {
                return match;
            }
            return `${prop}${t.color}${suff}`;
        });

        return html;
    }

    function switchView(view) {
        state.currentView = view;
        const previewArea = document.getElementById('slide-preview-area');
        const htmlArea = document.getElementById('slide-html-area');
        const buttons = document.querySelectorAll('.view-btn');

        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        if (view === 'html') {
            previewArea.style.display = 'none';
            htmlArea.style.display = '';
            document.getElementById('slide-html-editor').value = state.slides[state.currentSlideIndex] || '';
        } else {
            previewArea.style.display = '';
            htmlArea.style.display = 'none';
        }
    }

    function startPresentation() {
        if (state.slides.length === 0) return;
        state.currentSlideIndex = 0;
        showPresentationSlide();
        document.getElementById('presentation-mode').style.display = '';
    }

    function showPresentationSlide() {
        const container = document.getElementById('presentation-slide');
        const iframe = document.createElement('iframe');
        iframe.sandbox = 'allow-scripts allow-same-origin';
        iframe.srcdoc = state.slides[state.currentSlideIndex];

        container.innerHTML = '';
        container.appendChild(iframe);

        document.getElementById('pres-counter').textContent =
            `${state.currentSlideIndex + 1} / ${state.slides.length}`;
    }

    function endPresentation() {
        document.getElementById('presentation-mode').style.display = 'none';
    }

    function initEventListeners() {
        document.getElementById('provider-select').addEventListener('change', (e) => {
            state.currentProvider = e.target.value;
            refreshModels();
        });

        document.getElementById('model-select').addEventListener('change', (e) => {
            state.currentModel = e.target.value;
        });

        document.getElementById('refresh-models-btn').addEventListener('click', refreshModels);

        document.getElementById('chat-send-btn').addEventListener('click', handleSend);
        document.getElementById('chat-stop-btn').addEventListener('click', () => {
            if (state.abortController) state.abortController.abort();
        });

        document.getElementById('chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });

        document.getElementById('image-upload').addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        state.uploadedImages.push({
                            name: file.name,
                            data: ev.target.result,
                            width: img.width,
                            height: img.height
                        });
                        renderUploadedImages();
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            });
            e.target.value = '';
        });

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });

        document.getElementById('slide-html-editor').addEventListener('input', (e) => {
            debounceUpdateSlide(e.target.value);
        });

        document.getElementById('add-slide-btn').addEventListener('click', () => addSlide());
        document.getElementById('delete-slide-btn').addEventListener('click', () => deleteSlide(state.currentSlideIndex));
        document.getElementById('move-slide-up-btn').addEventListener('click', () => moveSlide(state.currentSlideIndex, state.currentSlideIndex - 1));
        document.getElementById('move-slide-down-btn').addEventListener('click', () => moveSlide(state.currentSlideIndex, state.currentSlideIndex + 1));

        document.getElementById('theme-select').addEventListener('change', (e) => {
            state.currentTheme = e.target.value;
            state.slides = state.slides.map(html => applyThemeToSlide(html, state.currentTheme));
            saveSlides();
            renderAll();
        });

        document.getElementById('present-btn').addEventListener('click', startPresentation);
        document.getElementById('pres-prev-btn').addEventListener('click', () => {
            if (state.currentSlideIndex > 0) {
                state.currentSlideIndex--;
                showPresentationSlide();
            }
        });
        document.getElementById('pres-next-btn').addEventListener('click', () => {
            if (state.currentSlideIndex < state.slides.length - 1) {
                state.currentSlideIndex++;
                showPresentationSlide();
            }
        });
        document.getElementById('pres-exit-btn').addEventListener('click', endPresentation);

        document.addEventListener('keydown', (e) => {
            if (document.getElementById('presentation-mode').style.display !== 'none') {
                if (e.key === 'ArrowRight' || e.key === ' ') {
                    if (state.currentSlideIndex < state.slides.length - 1) {
                        state.currentSlideIndex++;
                        showPresentationSlide();
                    }
                } else if (e.key === 'ArrowLeft') {
                    if (state.currentSlideIndex > 0) {
                        state.currentSlideIndex--;
                        showPresentationSlide();
                    }
                } else if (e.key === 'Escape') {
                    endPresentation();
                }
            }
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            document.getElementById('ollama-url').value = state.settings.ollamaUrl;
            document.getElementById('openai-key').value = state.settings.openaiKey;
            document.getElementById('openai-url').value = state.settings.openaiUrl;
            document.getElementById('openai-model').value = state.settings.openaiModel;
            document.getElementById('zhipu-key').value = state.settings.zhipuKey;
            document.getElementById('zhipu-model').value = state.settings.zhipuModel;
            document.getElementById('custom-url').value = state.settings.customUrl;
            document.getElementById('custom-key').value = state.settings.customKey;
            document.getElementById('custom-model').value = state.settings.customModel;
            document.getElementById('settings-modal').style.display = '';
        });

        document.getElementById('settings-save-btn').addEventListener('click', () => {
            state.settings.ollamaUrl = document.getElementById('ollama-url').value;
            state.settings.openaiKey = document.getElementById('openai-key').value;
            state.settings.openaiUrl = document.getElementById('openai-url').value;
            state.settings.openaiModel = document.getElementById('openai-model').value;
            state.settings.zhipuKey = document.getElementById('zhipu-key').value;
            state.settings.zhipuModel = document.getElementById('zhipu-model').value;
            state.settings.customUrl = document.getElementById('custom-url').value;
            state.settings.customKey = document.getElementById('custom-key').value;
            state.settings.customModel = document.getElementById('custom-model').value;
            saveSettings();
            document.getElementById('settings-modal').style.display = 'none';
            addSystemMessage('Settings saved.');
            refreshModels();
        });

        document.getElementById('settings-cancel-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'none';
        });

        document.getElementById('layout-select').addEventListener('change', (e) => {
            if (state.slides.length === 0) return;
            const layout = e.target.value;
            const theme = SLIDE_THEMES[state.currentTheme];
            let layoutHtml = '';

            const layouts = {
                'title': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};}.container{text-align:center;padding:60px;}h1{font-size:56px;margin-bottom:16px;color:${theme.h1Color};}p{font-size:24px;color:${theme.color};opacity:0.8;}</style></head><body><div class="container"><h1>Title Here</h1><p>Subtitle goes here</p></div></body></html>`,
                'title-content': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};padding:60px;}.title{font-size:36px;margin-bottom:30px;color:${theme.h2Color};border-bottom:3px solid ${theme.accent};padding-bottom:10px;display:inline-block;}.content{font-size:20px;line-height:1.8;}</style></head><body><div class="title">Slide Title</div><div class="content"><p>Content goes here</p></div></body></html>`,
                'two-column': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};padding:60px;}.title{font-size:36px;margin-bottom:30px;color:${theme.h2Color};}.columns{display:flex;gap:40px;}.column{flex:1;}.column h3{color:${theme.accent};margin-bottom:12px;}.column p{font-size:18px;line-height:1.6;}</style></head><body><div class="title">Two Column Slide</div><div class="columns"><div class="column"><h3>Left Column</h3><p>Content here</p></div><div class="column"><h3>Right Column</h3><p>Content here</p></div></div></body></html>`,
                'image-left': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};}.image-side{width:40%;background:#333;display:flex;align-items:center;justify-content:center;}.content-side{flex:1;padding:60px;display:flex;flex-direction:column;justify-content:center;}.content-side h2{font-size:36px;margin-bottom:20px;color:${theme.h2Color};}.content-side p{font-size:20px;line-height:1.8;}</style></head><body><div class="image-side"><p style="color:#aaa;text-align:center;">Image</p></div><div class="content-side"><h2>Slide Title</h2><p>Content goes here</p></div></body></html>`,
                'image-right': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};}.content-side{flex:1;padding:60px;display:flex;flex-direction:column;justify-content:center;}.content-side h2{font-size:36px;margin-bottom:20px;color:${theme.h2Color};}.content-side p{font-size:20px;line-height:1.8;}.image-side{width:40%;background:#333;display:flex;align-items:center;justify-content:center;}</style></head><body><div class="content-side"><h2>Slide Title</h2><p>Content goes here</p></div><div class="image-side"><p style="color:#aaa;text-align:center;">Image</p></div></body></html>`,
                'full-image': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:#333;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;}.overlay{padding:40px;z-index:1;}.overlay h1{font-size:48px;margin-bottom:16px;}.overlay p{font-size:24px;opacity:0.9;}</style></head><body><div class="overlay"><h1>Full Image Slide</h1><p>Add an image behind this overlay</p></div></body></html>`,
                'blank': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};display:flex;align-items:center;justify-content:center;}</style></head><body><div style="padding:60px;text-align:center;"><h2 style="color:${theme.h2Color};font-size:32px;">Blank Slide</h2><p style="font-size:20px;margin-top:20px;">Add your content here</p></div></body></html>`
            };

            layoutHtml = layouts[layout] || layouts['blank'];

            if (state.slides.length === 0) {
                addSlide(layoutHtml);
            } else {
                state.slides[state.currentSlideIndex] = layoutHtml;
                saveSlides();
                renderAll();
            }
        });

        document.getElementById('export-pdf-btn').addEventListener('click', () => {
            if (typeof window.exportToPDF === 'function') {
                window.exportToPDF(state.slides, document.getElementById('presentation-title').value);
            } else {
                addErrorMessage('Export module not loaded.');
            }
        });

        document.getElementById('export-pptx-btn').addEventListener('click', () => {
            if (typeof window.exportToPPTX === 'function') {
                window.exportToPPTX(state.slides, document.getElementById('presentation-title').value);
            } else {
                addErrorMessage('Export module not loaded.');
            }
        });
    }

    let debounceTimer;
    function debounceUpdateSlide(value) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.slides[state.currentSlideIndex] = value;
            saveSlides();
            renderSlidePreview();
        }, 500);
    }

    function init() {
        loadSettings();
        if (!loadSlides()) {
            addSlide(DEFAULT_SLIDE_HTML);
        } else {
            state.slides = JSON.parse(localStorage.getItem('canvas_slides') || '[]');
            if (state.slides.length === 0) addSlide(DEFAULT_SLIDE_HTML);
        }
        renderAll();
        refreshModels();
        initEventListeners();
        addSystemMessage('Welcome to Canvas! Select a model provider and describe your presentation.');
    }

    window.addEventListener('DOMContentLoaded', init);
})();