(function () {
    'use strict';

    const DEFAULT_SLIDE_HTML = `<!DOCTYPE html>
<html><head><style>
:root{--slide-width:960px;--slide-height:540px;--safe-margin:40px;--header-height:90px;--footer-height:40px;}
*{margin:0;padding:0;box-sizing:border-box;}
body{width:var(--slide-width);height:var(--slide-height);overflow:hidden;font-family:'Segoe UI',sans-serif;background:#1a1a2e;color:#e0e0e0;display:flex;align-items:center;justify-content:center;}
.container{width:880px;max-width:calc(var(--slide-width) - 2*var(--safe-margin));text-align:center;}
h1{font-size:48px;margin-bottom:16px;color:#ffffff;}
p{font-size:24px;color:#a0a0b0;}
</style></head><body>
<div class="container"><h1>Presentation Canvas</h1><p>Describe your presentation in the chat panel to get started.</p></div>
</body></html>`;

    const SLIDE_THEMES = {
        dark: { background: '#1a1a2e', color: '#e0e0e0', accent: '#4fc3f7', h1Color: '#ffffff', h2Color: '#4fc3f7', linkColor: '#81d4fa' },
        light: { background: '#ffffff', color: '#222222', accent: '#1976d2', h1Color: '#111111', h2Color: '#1976d2', linkColor: '#1565c0' },
        blue: { background: '#0d47a1', color: '#e3f2fd', accent: '#ffca28', h1Color: '#ffffff', h2Color: '#ffca28', linkColor: '#81d4fa' },
        green: { background: '#1b5e20', color: '#e8f5e9', accent: '#ffca28', h1Color: '#ffffff', h2Color: '#a5d6a7', linkColor: '#c8e6c9' },
        red: { background: '#b71c1c', color: '#ffebee', accent: '#ffcdd2', h1Color: '#ffffff', h2Color: '#ffcdd2', linkColor: '#ef9a9a' }
    };

    const BUILT_IN_TEMPLATES = {
        'blank-presentation': {
            name: 'Blank Presentation',
            description: 'A clean starting point with a title slide',
            theme: 'dark',
            slides: [DEFAULT_SLIDE_HTML]
        },
        'business-pitch': {
            name: 'Business Pitch',
            description: '5-slide pitch deck for startups and business ideas',
            theme: 'dark',
            slides: [
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e0e0e0;}.container{text-align:center;padding:60px;}h1{font-size:52px;margin-bottom:12px;color:#fff;font-weight:700;}p{font-size:22px;color:#4fc3f7;margin-bottom:8px;}.tagline{font-size:18px;color:#a0a0b0;margin-top:16px;}</style></head><body><div class="container"><p>PRESENTING</p><h1>[Company Name]</h1><div class="tagline">Your tagline goes here</div></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e0e0e0;padding:60px;}.title{font-size:36px;margin-bottom:30px;color:#4fc3f7;border-bottom:3px solid #4fc3f7;padding-bottom:10px;display:inline-block;}.problem{font-size:20px;line-height:1.8;margin-bottom:20px;}.stat{display:inline-block;background:rgba(79,195,247,0.15);padding:15px 25px;border-radius:8px;margin:5px;text-align:center;}.stat-num{font-size:32px;font-weight:700;color:#4fc3f7;}.stat-label{font-size:14px;color:#a0a0b0;}</style></head><body><div class="title">The Problem</div><div class="problem">Describe the problem your company solves. Make it relatable and urgent.</div><div><div class="stat"><div class="stat-num">80%</div><div class="stat-label">of companies face this</div></div><div class="stat"><div class="stat-num">$2T</div><div class="stat-label">market size</div></div></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e0e0e0;padding:60px;}.title{font-size:36px;margin-bottom:30px;color:#4fc3f7;border-bottom:3px solid #4fc3f7;padding-bottom:10px;display:inline-block;}.features{display:flex;gap:30px;margin-top:20px;}.feature{flex:1;background:rgba(79,195,247,0.1);padding:30px;border-radius:12px;border:1px solid rgba(79,195,247,0.2);}.feature h3{color:#4fc3f7;margin-bottom:12px;font-size:20px;}.feature p{font-size:16px;line-height:1.6;color:#a0a0b0;}</style></head><body><div class="title">Our Solution</div><div class="features"><div class="feature"><h3>Feature One</h3><p>Describe your first key feature and its benefit to users.</p></div><div class="feature"><h3>Feature Two</h3><p>Describe your second key feature and how it differentiates you.</p></div><div class="feature"><h3>Feature Three</h3><p>Describe your third key feature and the value it delivers.</p></div></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e0e0e0;padding:60px;}.title{font-size:36px;margin-bottom:30px;color:#4fc3f7;border-bottom:3px solid #4fc3f7;padding-bottom:10px;display:inline-block;}.row{display:flex;gap:40px;}.col{flex:1;}.col h3{color:#4fc3f7;margin-bottom:15px;font-size:22px;}.col ul{list-style:none;padding:0;}.col li{font-size:18px;line-height:2;color:#a0a0b0;padding-left:20px;position:relative;}.col li::before{content:'→';position:absolute;left:0;color:#4fc3f7;}</style></head><body><div class="title">Business Model</div><div class="row"><div class="col"><h3>Revenue Streams</h3><ul><li>Subscription tiers</li><li>Enterprise contracts</li><li>Marketplace commissions</li></ul></div><div class="col"><h3>Key Metrics</h3><ul><li>MRR growth rate</li><li>Customer acquisition cost</li><li>Lifetime value</li></ul></div></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e0e0e0;text-align:center;}.container{padding:60px;}h1{font-size:48px;color:#fff;margin-bottom:16px;}.cta{font-size:24px;color:#4fc3f7;margin-bottom:30px;}.contact{font-size:18px;color:#a0a0b0;}.contact a{color:#4fc3f7;text-decoration:none;}</style></head><body><div class="container"><h1>Let's Build Together</h1><div class="cta">Ready to transform your business?</div><div class="contact">hello@company.com | company.com</div></div></body></html>`
            ]
        },
        'tech-overview': {
            name: 'Tech Overview',
            description: 'Technical presentation template with code-style layout',
            theme: 'dark',
            slides: [
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:#0d1117;color:#c9d1d9;}.container{text-align:center;padding:60px;}.badge{display:inline-block;background:#238636;color:#fff;padding:4px 16px;border-radius:20px;font-size:14px;margin-bottom:20px;}h1{font-size:52px;margin-bottom:12px;color:#f0f6fc;font-weight:700;}p{font-size:20px;color:#8b949e;}</style></head><body><div class="container"><div class="badge">OPEN SOURCE</div><h1>Technology Overview</h1><p>A deep dive into our architecture & tech stack</p></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:#0d1117;color:#c9d1d9;padding:60px;}.title{font-size:32px;margin-bottom:30px;color:#58a6ff;border-bottom:2px solid #21262d;padding-bottom:12px;display:inline-block;}.arch{display:flex;flex-direction:column;gap:16px;margin-top:20px;}.layer{display:flex;align-items:center;gap:20px;background:#161b22;padding:20px 24px;border-radius:8px;border:1px solid #21262d;}.layer-label{width:120px;font-weight:700;color:#58a6ff;font-size:16px;}.layer-items{display:flex;gap:10px;flex-wrap:wrap;}.layer-item{background:#21262d;padding:6px 14px;border-radius:6px;font-size:14px;border:1px solid #30363d;}</style></head><body><div class="title">System Architecture</div><div class="arch"><div class="layer"><div class="layer-label">Frontend</div><div class="layer-items"><div class="layer-item">React</div><div class="layer-item">TypeScript</div><div class="layer-item">Next.js</div></div></div><div class="layer"><div class="layer-label">API Gateway</div><div class="layer-items"><div class="layer-item">GraphQL</div><div class="layer-item">REST</div><div class="layer-item">WebSocket</div></div></div><div class="layer"><div class="layer-label">Services</div><div class="layer-items"><div class="layer-item">Auth Service</div><div class="layer-item">Data Pipeline</div><div class="layer-item">ML Engine</div></div></div><div class="layer"><div class="layer-label">Data</div><div class="layer-items"><div class="layer-item">PostgreSQL</div><div class="layer-item">Redis</div><div class="layer-item">S3</div></div></div></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:#0d1117;color:#c9d1d9;padding:60px;}.title{font-size:32px;margin-bottom:30px;color:#58a6ff;border-bottom:2px solid #21262d;padding-bottom:12px;display:inline-block;}.code-block{background:#161b22;border:1px solid #21262d;border-radius:8px;padding:20px;font-family:'Consolas',monospace;font-size:14px;line-height:1.7;overflow-x:auto;margin-top:20px;}.keyword{color:#ff7b72;}.string{color:#a5d6ff;}.comment{color:#8b949e;}.func{color:#d2a8ff;}</style></head><body><div class="title">Code Example</div><div class="code-block"><span class="comment">// Initialize the service</span><br><span class="keyword">const</span> service = <span class="keyword">new</span> <span class="func">DataService</span>({<br>&nbsp;&nbsp;endpoint: <span class="string">'https://api.example.com'</span>,<br>&nbsp;&nbsp;retries: <span class="keyword">3</span>,<br>&nbsp;&nbsp;timeout: <span class="keyword">5000</span>,<br>});<br><br><span class="keyword">const</span> result = <span class="keyword">await</span> service.<span class="func">process</span>(data);<br>console.<span class="func">log</span>(result);</div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:#0d1117;color:#c9d1d9;text-align:center;}.container{padding:60px;}.badge{display:inline-block;background:#1f6feb;color:#fff;padding:4px 16px;border-radius:20px;font-size:14px;margin-bottom:20px;}h1{font-size:42px;color:#f0f6fc;margin-bottom:12px;}.next-steps{display:flex;gap:20px;justify-content:center;margin-top:30px;}.next-step{background:#161b22;border:1px solid #21262d;border-radius:8px;padding:20px 28px;text-align:left;}.next-step h3{color:#58a6ff;font-size:18px;margin-bottom:6px;}.next-step p{color:#8b949e;font-size:14px;}</style></head><body><div class="container"><div class="badge">NEXT STEPS</div><h1>Where We Go From Here</h1><div class="next-steps"><div class="next-step"><h3>Deploy</h3><p>Ship to production</p></div><div class="next-step"><h3>Monitor</h3><p>Track performance</p></div><div class="next-step"><h3>Iterate</h3><p>Improve & scale</p></div></div></div></body></html>`
            ]
        },
        'education': {
            name: 'Education',
            description: 'Lecture and educational presentation template',
            theme: 'light',
            slides: [
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1565c0 0%,#1976d2 100%);color:#fff;}.container{text-align:center;padding:60px;}.subject{font-size:18px;text-transform:uppercase;letter-spacing:3px;opacity:0.8;margin-bottom:10px;}h1{font-size:52px;margin-bottom:12px;font-weight:700;}.subtitle{font-size:20px;opacity:0.9;}.meta{margin-top:30px;font-size:16px;opacity:0.7;}</style></head><body><div class="container"><div class="subject">Course Title</div><h1>Lesson Name</h1><div class="subtitle">A comprehensive overview</div><div class="meta">Instructor Name | Date</div></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:#f5f5f5;color:#222;padding:60px;}.title{font-size:36px;margin-bottom:30px;color:#1565c0;border-bottom:3px solid #1565c0;padding-bottom:10px;display:inline-block;}.objectives{list-style:none;padding:0;}.objectives li{font-size:20px;line-height:2.2;padding-left:30px;position:relative;}.objectives li::before{content:'✓';position:absolute;left:0;color:#1565c0;font-weight:bold;}</style></head><body><div class="title">Learning Objectives</div><ul class="objectives"><li>Understand the core concepts</li><li>Apply knowledge to real problems</li><li>Analyze and evaluate outcomes</li><li>Create original solutions</li></ul></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:#f5f5f5;color:#222;padding:60px;}.title{font-size:36px;margin-bottom:30px;color:#1565c0;border-bottom:3px solid #1565c0;padding-bottom:10px;display:inline-block;}.two-col{display:flex;gap:40px;}.col{flex:1;background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);}.col h3{color:#1565c0;margin-bottom:15px;font-size:22px;}.col p{font-size:18px;line-height:1.8;color:#555;}</style></head><body><div class="title">Key Concepts</div><div class="two-col"><div class="col"><h3>Concept A</h3><p>Explanation of the first key concept with examples and connections to prior knowledge.</p></div><div class="col"><h3>Concept B</h3><p>Explanation of the second key concept with examples and connections to prior knowledge.</p></div></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1565c0 0%,#1976d2 100%);color:#fff;text-align:center;}.container{padding:60px;}h1{font-size:48px;margin-bottom:12px;}.subtitle{font-size:22px;opacity:0.9;margin-bottom:30px;}.review-points{display:flex;gap:20px;justify-content:center;margin-top:20px;}.point{background:rgba(255,255,255,0.15);padding:20px;border-radius:8px;min-width:140px;}.point h3{font-size:18px;margin-bottom:4px;}.point p{font-size:14px;opacity:0.8;}</style></head><body><div class="container"><h1>Summary & Review</h1><div class="subtitle">What we covered today</div><div class="review-points"><div class="point"><h3>Concept 1</h3><p>Key takeaway</p></div><div class="point"><h3>Concept 2</h3><p>Key takeaway</p></div><div class="point"><h3>Concept 3</h3><p>Key takeaway</p></div></div></div></body></html>`
            ]
        },
        'photo-gallery': {
            name: 'Photo Gallery',
            description: 'Image-focused presentation template',
            theme: 'dark',
            slides: [
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:#111;color:#fff;text-align:center;}.container{padding:60px;}h1{font-size:56px;font-weight:300;letter-spacing:4px;margin-bottom:12px;}.line{width:60px;height:3px;background:#4fc3f7;margin:0 auto 16px;}.subtitle{font-size:20px;color:#888;font-weight:300;}</style></head><body><div class="container"><h1>GALLERY</h1><div class="line"></div><div class="subtitle">A visual journey</div></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:#111;color:#fff;padding:40px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:12px;}.photo{background:#222;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#666;min-height:200px;position:relative;overflow:hidden;}.photo:nth-child(1){grid-row:1/3;}</style></head><body><div class="photo">Upload image here</div><div class="photo">Upload image here</div><div class="photo">Upload image here</div><div class="photo">Upload image here</div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;min-height:100vh;font-family:'Segoe UI',sans-serif;background:#111;color:#fff;}.left{width:50%;display:flex;align-items:center;justify-content:center;background:#222;font-size:18px;color:#666;}.right{width:50%;padding:60px;display:flex;flex-direction:column;justify-content:center;}.right h2{font-size:36px;font-weight:300;margin-bottom:20px;letter-spacing:1px;}.right p{font-size:20px;line-height:1.8;color:#aaa;}</style></head><body><div class="left">Upload image here</div><div class="right"><h2>Story Behind</h2><p>Add your description here. Tell the story behind the image and what makes it meaningful.</p></div></body></html>`,
                `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:#111;color:#fff;text-align:center;}.container{padding:60px;}h1{font-size:48px;font-weight:300;letter-spacing:3px;margin-bottom:12px;}.line{width:60px;height:3px;background:#4fc3f7;margin:0 auto 16px;}.subtitle{font-size:18px;color:#888;}</style></head><body><div class="container"><h1>THANK YOU</h1><div class="line"></div><div class="subtitle">contact@example.com</div></div></body></html>`
            ]
        }
    };

    async function loadExternalTemplates() {
        try {
            const response = await fetch('templates.json');
            if (response.ok) {
                const data = await response.json();
                if (data.templates) {
                    Object.keys(data.templates).forEach(key => {
                        if (!BUILT_IN_TEMPLATES[key]) {
                            BUILT_IN_TEMPLATES[key] = data.templates[key];
                        }
                    });
                }
            }
        } catch (e) {
            console.log('External templates not loaded:', e);
        }
        renderTemplateButtons();
    }

    function renderTemplateButtons() {
        const container = document.getElementById('templates-list');
        if (!container) return;
        container.innerHTML = '';
        Object.keys(BUILT_IN_TEMPLATES).forEach(key => {
            const tpl = BUILT_IN_TEMPLATES[key];
            const btn = document.createElement('button');
            btn.className = 'template-btn';
            btn.dataset.template = key;
            btn.textContent = tpl.name || key;
            btn.title = tpl.description || '';
            btn.addEventListener('click', () => loadTemplate(key));
            container.appendChild(btn);
        });
    }

    let state = {
        slides: [],
        currentSlideIndex: 0,
        uploadedImages: [],
        logo: null,
        chatHistory: [],
        isGenerating: false,
        abortController: null,
        currentMode: 'generate',
        currentSessionId: null,
        sessions: [],
        sidebarOpen: true,
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
        currentTheme: 'dark',
        useLargePrompt: true
    };

    function loadSettings() {
        try {
            const saved = localStorage.getItem('canvas_settings');
            if (saved) Object.assign(state.settings, JSON.parse(saved));
        } catch (e) { }
    }

    function saveSettings() {
        localStorage.setItem('canvas_settings', JSON.stringify(state.settings));
    }

    function loadSessions() {
        try {
            const saved = localStorage.getItem('canvas_sessions');
            if (saved) state.sessions = JSON.parse(saved);
        } catch (e) { }
        const currentId = localStorage.getItem('canvas_current_session');
        if (currentId) state.currentSessionId = currentId;
        try {
            localStorage.removeItem('canvas_slides');
            localStorage.removeItem('canvas_chat_history');
        } catch (e) { }
    }

    function saveSessions() {
        localStorage.setItem('canvas_sessions', JSON.stringify(state.sessions));
        if (state.currentSessionId) {
            localStorage.setItem('canvas_current_session', state.currentSessionId);
        }
    }

    function createSession(title) {
        const id = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        const session = {
            id: id,
            title: title || 'Untitled Presentation',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slides: [],
            currentSlideIndex: 0,
            theme: 'dark',
            chatHistory: []
        };
        state.sessions.unshift(session);
        state.currentSessionId = id;
        state.chatHistory = [];
        state.uploadedImages = [];
        state.slides = [];
        state.currentSlideIndex = 0;
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.innerHTML = '';
        document.getElementById('presentation-title').value = session.title;
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) themeSelect.value = state.currentTheme;
        const modeSelect = document.getElementById('gen-mode-select');
        if (modeSelect) modeSelect.value = state.currentMode || 'slides';
        saveSessions();
        renderAll();
        renderSessionList();
        return id;
    }

    function switchSession(sessionId) {
        saveCurrentSession();
        state.currentSessionId = sessionId;
        localStorage.setItem('canvas_current_session', sessionId);
        const session = state.sessions.find(s => s.id === sessionId);
        if (session) {
            loadSessionIntoState(session);
            renderSessionList();
            renderAll();
        }
    }

    function loadSessionIntoState(session) {
        state.slides = [...(session.slides || [DEFAULT_SLIDE_HTML])];
        state.currentSlideIndex = session.currentSlideIndex || 0;
        state.currentTheme = session.theme || 'dark';
        state.chatHistory = [...(session.chatHistory || [])];
        state.uploadedImages = [];
        document.getElementById('presentation-title').value = session.title || 'Untitled Presentation';
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.innerHTML = '';
        state.chatHistory.forEach(msg => {
            const msgEl = document.createElement('div');
            msgEl.className = `chat-msg ${msg.role}`;
            msgEl.textContent = msg.content;
            messagesDiv.appendChild(msgEl);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        setMode(state.currentMode);
    }

    function saveCurrentSession() {
        if (!state.currentSessionId) return;
        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (!session) return;
        session.slides = [...state.slides];
        session.currentSlideIndex = state.currentSlideIndex;
        session.theme = state.currentTheme;
        session.chatHistory = [...state.chatHistory];
        session.title = document.getElementById('presentation-title').value || 'Untitled Presentation';
        session.updatedAt = new Date().toISOString();
        saveSessions();
    }

    function deleteSession(sessionId) {
        if (state.sessions.length <= 1) return;
        state.sessions = state.sessions.filter(s => s.id !== sessionId);
        if (state.currentSessionId === sessionId) {
            state.currentSessionId = state.sessions[0].id;
            localStorage.setItem('canvas_current_session', state.currentSessionId);
            loadSessionIntoState(state.sessions[0]);
            renderAll();
        }
        saveSessions();
        renderSessionList();
    }

    function finishRename(inputEl, session) {
        var newTitle = inputEl.value.trim() || session.title || 'Untitled';
        session.title = newTitle;
        saveSessions();
        if (session.id === state.currentSessionId) {
            document.getElementById('presentation-title').value = newTitle;
        }
        renderSessionList();
    }

    function renderSessionList() {
        var container = document.getElementById('session-list');
        if (!container) return;
        container.innerHTML = '';
        state.sessions.forEach(function (session) {
            var item = document.createElement('div');
            item.className = 'session-item' + (session.id === state.currentSessionId ? ' active' : '');
            var date = new Date(session.updatedAt || session.createdAt);
            var timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            var slideCount = session.slides ? session.slides.length : 0;
            var isDefault = (slideCount === 1 && session.slides && session.slides[0] === DEFAULT_SLIDE_HTML);
            var pinBtn = '<button class="session-item-pin' + (session.pinned ? ' pinned' : '') + '" data-id="' + session.id + '" title="' + (session.pinned ? 'Unpin' : 'Pin') + '">' + (session.pinned ? '\u2605' : '\u2606') + '</button>';
            var downloadBtn = (!isDefault) ? '<button class="session-item-download" data-id="' + session.id + '" title="Download HTML">&#8595;</button>' : '';
            item.innerHTML = '<div class="session-item-title">' + escapeHtml(session.title || 'Untitled') + '</div><div class="session-item-meta">' + slideCount + ' slides &middot; ' + timeStr + '</div><div class="session-item-actions">' + pinBtn + downloadBtn + '<button class="session-item-delete" data-id="' + session.id + '" title="Delete">&times;</button></div>';
            item.addEventListener('click', function (e) {
                if (!e.target.classList.contains('session-item-delete') && !e.target.classList.contains('session-item-download') && !e.target.classList.contains('session-item-pin')) {
                    switchSession(session.id);
                }
            });
            container.appendChild(item);
        });
        container.querySelectorAll('.session-item-delete').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                deleteSession(btn.dataset.id);
            });
        });
        container.querySelectorAll('.session-item-download').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                downloadSessionHTML(btn.dataset.id);
            });
        });
        container.querySelectorAll('.session-item-pin').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                togglePinSession(btn.dataset.id);
            });
        });
        updateSidebarHeader();
    }

    function updateSidebarHeader() {
        var header = document.getElementById('session-sidebar-header');
        if (!header) return;
        var countEl = header.querySelector('.session-count');
        if (!countEl) {
            countEl = document.createElement('span');
            countEl.className = 'session-count';
            header.appendChild(countEl);
        }
        countEl.textContent = '(' + state.sessions.length + ')';
    }

    function clearAllSessions() {
        if (state.sessions.length <= 1) return;
        state.sessions = state.sessions.filter(function (s) { return s.pinned || s.id === state.currentSessionId; });
        if (state.sessions.length === 0) {
            createSession('Welcome');
        } else {
            var pinned = state.sessions.filter(function (s) { return s.pinned; });
            if (pinned.length === 0 && state.currentSessionId) {
                state.currentSessionId = state.sessions[0].id;
                loadSessionIntoState(state.sessions[0]);
            }
        }
        saveSessions();
        renderSessionList();
        renderAll();
        addSystemMessage('Cleared unpinned sessions. Pinned sessions preserved.');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function saveSlides() {
        saveCurrentSession();
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
        const htmlEditor = document.getElementById('slide-html-editor');

        if (state.slides.length === 0) {
            previewArea.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:18px;">No slides yet. Use the chat to generate slides.</div>';
            htmlEditor.value = '';
            return;
        }

        const slideHtml = state.slides[state.currentSlideIndex] || DEFAULT_SLIDE_HTML;

        // Always rebuild the iframe to clear previous content
        previewArea.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.sandbox = 'allow-scripts allow-same-origin';
        previewArea.appendChild(iframe);
        iframe.srcdoc = slideHtml;
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
        const noImagesHint = document.getElementById('no-images-hint');
        const imageCountBadge = document.getElementById('image-count-badge');
        container.innerHTML = '';
        slideImages.innerHTML = '';

        if (state.uploadedImages.length === 0) {
            if (noImagesHint) noImagesHint.style.display = 'block';
            if (imageCountBadge) imageCountBadge.textContent = '';
        } else {
            if (noImagesHint) noImagesHint.style.display = 'none';
            if (imageCountBadge) imageCountBadge.textContent = `(${state.uploadedImages.length})`;
        }

        state.uploadedImages.forEach((img, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'uploaded-img-thumb';
            thumb.innerHTML = `<img src="${img.data}" alt="${img.name}"><button class="remove-img" data-idx="${idx}">x</button>`;
            container.appendChild(thumb);

            const item = document.createElement('div');
            item.className = 'slide-image-item';
            const slideNum = state.currentSlideIndex + 1;
            item.innerHTML = `<img src="${img.data}" alt="${img.name}"><span class="image-name">${img.name}</span><button class="to-slide-btn" data-idx="${idx}" title="Insert into slide ${slideNum}">To Slide ${slideNum}</button>`;
            slideImages.appendChild(item);
        });

        container.querySelectorAll('.remove-img').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                state.uploadedImages.splice(idx, 1);
                renderUploadedImages();
            });
        });

        slideImages.querySelectorAll('.to-slide-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                const img = state.uploadedImages[idx];
                addImageToCurrentSlide(img);
            });
        });

        renderLogoPreview();
    }

    function addImageToCurrentSlide(img) {
        if (state.slides.length === 0) return;
        const currentHtml = state.slides[state.currentSlideIndex];
        const imgTag = `<img src="${img.data}" style="max-width:80%;max-height:60vh;display:block;margin:20px auto;border-radius:8px;" alt="${img.name}">`;
        const updated = currentHtml.replace('</body>', `${imgTag}</body>`);
        state.slides[state.currentSlideIndex] = updated;
        saveCurrentSession();
        renderSlidePreview();
        renderThumbnails();
    }

    function loadLogo() {
        try {
            const saved = localStorage.getItem('canvas_logo');
            if (saved) state.logo = JSON.parse(saved);
        } catch (e) { }
    }

    function saveLogo() {
        if (state.logo) {
            localStorage.setItem('canvas_logo', JSON.stringify(state.logo));
        } else {
            localStorage.removeItem('canvas_logo');
        }
    }

    function renderLogoPreview() {
        const preview = document.getElementById('logo-preview');
        const previewImg = document.getElementById('logo-preview-img');
        if (!preview || !previewImg) return;

        if (state.logo) {
            preview.style.display = 'block';
            previewImg.src = state.logo.data;
            document.getElementById('logo-position').value = state.logo.position || 'bottom-right';
            document.getElementById('logo-size').value = state.logo.size || '90';
        } else {
            preview.style.display = 'none';
        }
    }

    function applyFooterLabel() {
        var label = document.getElementById('footer-label-input').value.trim();
        var t = SLIDE_THEMES[state.currentTheme];
        state.slides = state.slides.map(function(html, i) {
            html = html.replace(/<div[^>]*class="canvas-footer"[^>]*>[^<]*<\/div>/g, '');
            html = html.replace(/<div[^>]*data-canvas-footer[^>]*>[^<]*<\/div>/g, '');
            if (label) {
                var footerDiv = '<div class="canvas-footer" data-canvas-footer style="position:absolute;bottom:8px;right:16px;font-size:10px;opacity:0.6;color:' + t.color + ';pointer-events:none;">' + escapeHtml(label) + '</div>';
                if (html.indexOf('</body>') !== -1) {
                    html = html.replace('</body>', footerDiv + '</body>');
                } else {
                    html = html + footerDiv;
                }
                if (!html.match(/position\s*:\s*relative/i) && !html.match(/position\s*:\s*absolute/i)) {
                    html = html.replace(/<body/i, '<body style="position:relative;"');
                }
            }
            return html;
        });
        saveCurrentSession();
        renderSlidePreview();
        renderThumbnails();
    }

    function applyLogoToAllSlides() {
        if (!state.logo || state.slides.length === 0) return;

        const position = document.getElementById('logo-position').value;
        const size = parseInt(document.getElementById('logo-size').value);
        state.logo.position = position;
        state.logo.size = size;
        saveLogo();

        const posStyles = {
            'top-left': 'top:16px;left:16px;',
            'top-right': 'top:16px;right:16px;',
            'bottom-left': 'bottom:16px;left:16px;',
            'bottom-right': 'bottom:16px;right:16px;'
        };
        const posStyle = posStyles[position] || posStyles['bottom-right'];

        const logoHtml = `<img src="${state.logo.data}" style="position:absolute;${posStyle}width:${size}px;height:auto;z-index:999;pointer-events:none;" alt="Logo" class="canvas-logo">`;

        state.slides = state.slides.map(html => {
            let updated = html.replace(/<img[^>]*class="canvas-logo"[^>]*>/g, '');
            updated = updated.replace('</body>', `${logoHtml}</body>`);
            if (!updated.includes('position:relative') && !updated.includes('position: relative')) {
                updated = updated.replace('<body', '<body style="position:relative;"');
            }
            return updated;
        });

        saveCurrentSession();
        renderSlidePreview();
        renderThumbnails();
    }

    function removeLogoFromAllSlides() {
        state.logo = null;
        saveLogo();

        state.slides = state.slides.map(html => {
            return html.replace(/<img[^>]*class="canvas-logo"[^>]*>/g, '');
        });

        saveCurrentSession();
        renderSlidePreview();
        renderThumbnails();
        renderLogoPreview();
    }

    function renderAll() {
        renderSlidePreview();
        renderThumbnails();
        renderUploadedImages();
        updateSlideProps();
    }

    function updateSlideProps() {
        document.getElementById('theme-select').value = state.currentTheme;
    }

    function setMode(mode) {
        state.currentMode = mode;
        const genBtn = document.getElementById('mode-generate-btn');
        const editBtn = document.getElementById('mode-edit-btn');
        const chatInput = document.getElementById('chat-input');
        const genModeSelect = document.getElementById('gen-mode-select');

        genBtn.classList.toggle('active', mode === 'generate');
        editBtn.classList.toggle('active', mode === 'edit');
        editBtn.classList.toggle('mode-btn-edit', mode === 'edit');

        if (mode === 'generate') {
            chatInput.placeholder = 'Describe your presentation... e.g. "Create a 5-slide presentation about renewable energy"';
            genModeSelect.style.display = '';
        } else {
            chatInput.placeholder = 'Describe changes for the current slide... e.g. "Change the title to Introduction" or "Add a bullet list"';
            genModeSelect.style.display = 'none';
        }
    }

    function addChatMessage(role, content) {
        const messagesDiv = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        msg.className = `chat-msg ${role}`;
        msg.textContent = content;
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        if (role === 'user' || role === 'assistant') {
            state.chatHistory.push({ role, content });
        }
    }

    async function doResearch(topic) {
        var model = state.currentModel || document.getElementById('model-select').value;
        if (!model) {
            addErrorMessage('No model selected for research.');
            return '';
        }
        addSystemMessage('Researching: ' + topic);
        try {
            var researchPrompt = 'Research the following topic thoroughly and provide a detailed summary with key facts, statistics, dates, names, and data that would be useful for a presentation. Be factual and specific.\n\nTopic: ' + topic;
            var response = await fetch(state.settings.ollamaUrl + '/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: model, prompt: researchPrompt, stream: false }),
                signal: AbortSignal.timeout(60000)
            });
            if (!response.ok) throw new Error('Research request failed');
            var data = await response.json();
            var result = data.response || '';
            if (result) {
                addSystemMessage('Research complete (' + result.length + ' chars gathered)');
            }
            return result;
        } catch (e) {
            console.warn('Research failed:', e);
            addSystemMessage('Research skipped (could not fetch data). Continuing without research.');
            return '';
        }
    }

    function handleToolCommand(prompt) {
        var addMatch = prompt.match(/add\s+(?:a\s+)?(?:new\s+)?slide\s+about\s+(.+?)\s+after\s+(?:slide\s+)?(\d+)/i);
        if (addMatch) {
            var topic = addMatch[1].replace(/[.?]$/, '').trim();
            var position = parseInt(addMatch[2]);
            if (position < 0 || position > state.slides.length) {
                addErrorMessage('Invalid slide position: ' + position + '. Slides go from 1 to ' + state.slides.length + '.');
                return true;
            }
            var t = SLIDE_THEMES[state.currentTheme];
            var newSlide = '<!DOCTYPE html><html><head><style>body{width:960px;height:540px;overflow:hidden;font-family:\'Segoe UI\',sans-serif;background:' + t.background + ';color:' + t.color + ';display:flex;align-items:center;justify-content:center;text-align:center;padding:60px;}h1{font-size:42px;color:' + t.h1Color + ';}p{font-size:22px;margin-top:12px;}</style></head><body><div><h1>' + escapeHtml(topic) + '</h1><p>Content to be filled</p></div></body></html>';
            state.slides.splice(position, 0, newSlide);
            state.currentSlideIndex = position;
            saveSlides();
            renderAll();
            addSystemMessage('Added slide at position ' + (position + 1) + ': ' + topic);
            return true;
        }
        var delMatch = prompt.match(/delete\s+(?:slide\s+)?(\d+)/i);
        if (delMatch) {
            var idx = parseInt(delMatch[1]) - 1;
            if (idx < 0 || idx >= state.slides.length) {
                addErrorMessage('Invalid slide number: ' + delMatch[1] + '.');
                return true;
            }
            deleteSlide(idx);
            addSystemMessage('Deleted slide ' + delMatch[1]);
            return true;
        }
        var moveMatch = prompt.match(/move\s+(?:slide\s+)?(\d+)\s+(?:to\s+)?(?:position\s+)?(\d+)/i);
        if (moveMatch) {
            var from = parseInt(moveMatch[1]) - 1;
            var to = parseInt(moveMatch[2]) - 1;
            if (from < 0 || from >= state.slides.length || to < 0 || to >= state.slides.length) {
                addErrorMessage('Invalid slide position.');
                return true;
            }
            moveSlide(from, to);
            addSystemMessage('Moved slide ' + moveMatch[1] + ' to position ' + moveMatch[2]);
            return true;
        }
        return false;
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

    function showGenerationOverlay(show) {
        let overlay = document.getElementById('generation-overlay');
        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'generation-overlay';
                overlay.innerHTML = '<div class="gen-overlay-content"><div class="gen-spinner" id="gen-overlay-spinner"></div><div class="gen-overlay-status"><div class="gen-overlay-text" id="gen-overlay-text">Generating presentation...</div><div class="gen-overlay-count" id="gen-overlay-count"></div></div></div>';
                document.body.appendChild(overlay);
            }
            const spinner = document.getElementById('gen-overlay-spinner');
            if (spinner) spinner.style.display = '';
            const text = document.getElementById('gen-overlay-text');
            if (text) text.textContent = 'Generating presentation...';
            const count = document.getElementById('gen-overlay-count');
            if (count) count.textContent = '';
            overlay.className = 'gen-active';
            overlay.style.display = '';
        } else {
            if (overlay) overlay.style.display = 'none';
        }
    }

    function updateGenerationOverlay(slideCount) {
        const countEl = document.getElementById('gen-overlay-count');
        const textEl = document.getElementById('gen-overlay-text');
        if (countEl) countEl.textContent = `Slide ${slideCount} completed`;
        if (textEl) textEl.textContent = 'Generating...';
    }

    function showGenerationComplete(totalSlides) {
        let overlay = document.getElementById('generation-overlay');
        if (!overlay) return;

        const spinner = document.getElementById('gen-overlay-spinner');
        const text = document.getElementById('gen-overlay-text');
        const count = document.getElementById('gen-overlay-count');

        if (spinner) spinner.style.display = 'none';
        if (text) text.innerHTML = '&#10003; Complete!';
        if (count) count.textContent = `${totalSlides} slide(s) generated`;

        overlay.className = 'gen-complete';

        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                overlay.style.animation = 'gen-fadeout 0.5s ease forwards';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    overlay.style.animation = '';
                    overlay.className = 'gen-active';
                }, 500);
            }
        }, 3000);
    }

    function showGenerationError(message) {
        let overlay = document.getElementById('generation-overlay');
        if (!overlay) return;

        const spinner = document.getElementById('gen-overlay-spinner');
        const text = document.getElementById('gen-overlay-text');
        const count = document.getElementById('gen-overlay-count');

        if (spinner) spinner.style.display = 'none';
        if (text) text.innerHTML = '&#10007; Error';
        if (count) count.textContent = message;

        overlay.className = 'gen-error';

        setTimeout(() => {
            if (overlay) {
                overlay.style.display = 'none';
                overlay.className = 'gen-active';
            }
        }, 5000);
    }

    async function fetchOllamaModels() {
        try {
            const response = await fetch(`${state.settings.ollamaUrl}/api/tags`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) {
                console.error('Ollama API error:', response.status, response.statusText);
                addErrorMessage(`Failed to fetch Ollama models: HTTP ${response.status}. Make sure Ollama is running at ${state.settings.ollamaUrl}`);
                return [];
            }
            const data = await response.json();
            const models = data.models || [];
            return models.map(m => m.name || m.model).filter(Boolean);
        } catch (e) {
            console.error('Failed to fetch Ollama models:', e);
            addErrorMessage(`Could not connect to Ollama at ${state.settings.ollamaUrl}. Make sure Ollama is running. Error: ${e.message}`);
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
            models = ['glm-4', 'glm-4-flash', 'glm-4-plus', 'glm-4v', state.settings.zhipuModel].filter((v, i, a) => a.indexOf(v) === i);
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
            if (provider === 'ollama') return await streamOllama(prompt, systemPrompt, model);
            else if (provider === 'openai') return await streamOpenAICompat(state.settings.openaiUrl, state.settings.openaiKey, prompt, systemPrompt, model);
            else if (provider === 'zhipu') return await streamOpenAICompat('https://open.bigmodel.cn/api/paas/v4/chat/completions', `Bearer ${state.settings.zhipuKey}`, prompt, systemPrompt, model);
            else if (provider === 'custom') return await streamOpenAICompat(state.settings.customUrl, state.settings.customKey ? `Bearer ${state.settings.customKey}` : null, prompt, systemPrompt, model);
        } catch (e) {
            if (e.name === 'AbortError') {
                addSystemMessage('Generation stopped.');
                return null;
            }
            throw e;
        }
    }

    function buildMessages(systemPrompt, prompt) {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        const maxHistory = state.currentMode === 'edit' ? 10 : 4;
        const recentHistory = state.chatHistory.slice(-maxHistory);
        recentHistory.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                messages.push({ role: msg.role, content: msg.content });
            }
        });
        messages.push({ role: 'user', content: prompt });
        return messages;
    }

    async function streamOllama(prompt, systemPrompt, model) {
        const response = await fetch(`${state.settings.ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, messages: buildMessages(systemPrompt, prompt), stream: true }),
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
                        if (state.onStreamToken) state.onStreamToken(fullContent);
                    }
                } catch (e) { }
            }
        }

        return fullContent;
    }

    async function streamOpenAICompat(baseUrl, authHeader, prompt, systemPrompt, model) {
        const headers = { 'Content-Type': 'application/json' };
        if (authHeader) headers['Authorization'] = authHeader;

        const isZhipu = baseUrl.includes('bigmodel.cn');
        const url = isZhipu ? baseUrl : (baseUrl.endsWith('/chat/completions') ? baseUrl : baseUrl + '/chat/completions');

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({ model, messages: buildMessages(systemPrompt, prompt), stream: true }),
            signal: state.abortController.signal
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API error ${response.status}: ${errText.substring(0, 200)}`);
        }

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
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data:')) continue;
                const data = trimmed.slice(5).trim();
                if (data === '[DONE]') continue;

                try {
                    const json = JSON.parse(data);
                    const delta = json.choices?.[0]?.delta?.content;
                    if (delta) {
                        fullContent += delta;
                        if (state.onStreamToken) state.onStreamToken(fullContent);
                    }
                } catch (e) { }
            }
        }

        return fullContent;
    }

    function getImageContext() {
        let context = '';
        if (state.uploadedImages.length > 0) {
            context += '\n\nImages available for embedding:';
            var maxChars = isSmallModel() ? 30 : 80;
            state.uploadedImages.forEach(function(img, i) {
                context += '\n- Image ' + (i + 1) + ': "' + img.name + '" (' + img.width + 'x' + img.height + ') - src="' + img.data.substring(0, maxChars) + '..."';
            });
            context += '\nTo embed: <img src="FULL_BASE64_DATA" style="max-width:80%;max-height:60vh;display:block;margin:20px auto;border-radius:8px;">';
        }
        if (state.logo) {
            context += '\n\nA logo is uploaded - it will be added to all slides automatically. Do NOT include it in slide HTML.';
        }
        return context;
    }

    function isSmallModel() {
        var m = (state.currentModel || '').toLowerCase();
        if (/3b|4b|tiny|small|mini|nano|1b|2b|3\\.2b|3\\.1b|3-4b/.test(m)) return true;
        if (/gemma2|gemma-2|qwen2\\.5:3|phi|smollm|stablelm/.test(m)) return true;
        return false;
    }

    function getSlideSystemPrompt(mode) {
        const t = SLIDE_THEMES[state.currentTheme];
        const bg = t.background, c = t.color, ac = t.accent, h1c = t.h1Color;
        const showSlideNumbers = document.getElementById('show-slide-numbers').checked;

        const ICONS = {
            check: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M4 10l4 4 8-8" stroke="%ac%" stroke-width="2" fill="none"/></svg>',
            star: '<svg viewBox="0 0 20 20" width="20" height="20"><polygon points="10,1 13,7 19,8 14,13 15,19 10,16 5,19 6,13 1,8 7,7" fill="%ac%"/></svg>',
            person: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="7" r="4" fill="%ac%"/><path d="M2 19c0-5 3.5-8 8-8s8 3 8 8" fill="%ac%"/></svg>',
            clock: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8" stroke="%ac%" stroke-width="1.5" fill="none"/><line x1="10" y1="10" x2="10" y2="6" stroke="%ac%" stroke-width="1.5"/><line x1="10" y1="10" x2="13" y2="10" stroke="%ac%" stroke-width="1.5"/></svg>',
            gear: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 1l1.5 3.1 3.4.5-.5 3.4 3.1 1.5-.5 3.4-3.4.5L10 19l-3.1-1.5-3.4-.5.5-3.4L1 10l.5-3.4 3.4-.5L10 1z" stroke="%ac%" stroke-width="1" fill="none"/><circle cx="10" cy="10" r="3" fill="%ac%"/></svg>',
            shield: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 1L3 5v6c0 4 3 7 7 8 4-1 7-4 7-8V5L10 1z" fill="%ac%"/></svg>',
            chart: '<svg viewBox="0 0 20 20" width="20" height="20"><rect x="2" y="12" width="4" height="6" fill="%ac%"/><rect x="8" y="6" width="4" height="12" fill="%ac%"/><rect x="14" y="3" width="4" height="15" fill="%ac%"/></svg>',
            target: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8" stroke="%ac%" fill="none"/><circle cx="10" cy="10" r="5" stroke="%ac%" fill="none"/><circle cx="10" cy="10" r="2" fill="%ac%"/></svg>',
            arrow: '<svg viewBox="0 0 20 20" width="20" height="20"><line x1="3" y1="10" x2="16" y2="10" stroke="%ac%" stroke-width="2"/><polyline points="11,6 16,10 11,14" stroke="%ac%" stroke-width="2" fill="none"/></svg>',
            lock: '<svg viewBox="0 0 20 20" width="20" height="20"><rect x="4" y="9" width="12" height="9" rx="1" fill="%ac%"/><path d="M7 9V6a3 3 0 016 0v3" stroke="%ac%" stroke-width="2" fill="none"/></svg>'
        };
        var iconCss = '';
        for (var ik in ICONS) { iconCss += '- ' + ik + ': ' + ICONS[ik].replace(/%ac%/g, ac) + '\n'; }

        const exampleSlide = '<!DOCTYPE html>\n<html><head><style>\n' +
            ':root{--slide-width:960px;--slide-height:540px;--safe-margin:40px;--header-height:90px;--footer-height:40px;}\n' +
            '*{margin:0;padding:0;box-sizing:border-box;}\n' +
            'body{width:var(--slide-width);height:var(--slide-height);overflow:hidden;font-family:\'Segoe UI\',sans-serif;background:' + bg + ';color:' + c + ';display:flex;align-items:center;justify-content:center;}\n' +
            '.container{width:880px;max-width:calc(var(--slide-width) - 2*var(--safe-margin));text-align:center;}\n' +
            'h1{font-size:48px;color:' + h1c + ';margin-bottom:16px;}\n' +
            'p{font-size:22px;}\n' +
            '</style></head><body>\n' +
            '<div class="container"><h1>Title</h1><p>Content here</p></div>\n' +
            '</body></html>';

        const govBg = '#0a2342', govAccent = '#00b4d8';

        const basePrompt =
`You are a presentation designer. Create complete HTML slides.

EVERY SLIDE is its own HTML document wrapped in these markers:
<<<SLIDE>>>
[full HTML from <!DOCTYPE html> to </html>]
<<<END_SLIDE>>>

MANDATORY RULES:
1. Slide is 960x540 pixels. body { width:960px; height:540px; overflow:hidden; }
2. All CSS inside a single <style> tag. No external links, no <script>, no JavaScript.
3. Output ONLY <<<SLIDE>>>...<<<END_SLIDE>>> blocks. No other text.
4. Each slide MUST be under 3000 characters total.

═══════════════════════════
SMART LAYOUT ENGINE (PERMANENT - ALL SLIDES)
═══════════════════════════
Every slide MUST follow these layout rules:

A) CSS VARIABLES — Define at the top of every <style> tag:
   :root{--slide-width:960px;--slide-height:540px;--safe-margin:40px;--header-height:90px;--footer-height:40px;}

B) BODY — Always use these exact properties:
   body{width:var(--slide-width);height:var(--slide-height);overflow:hidden;display:flex;flex-direction:column;...}

C) SAFE MARGINS — Minimum 40px left/right, 35px top/bottom. Content must never touch edges.
   Use max-width:calc(var(--slide-width) - 2*var(--safe-margin)) on content containers.

D) VERTICAL ZONES:
   - Header zone: top 80-100px (title + subtitle)
   - Content zone: center, between header and footer, vertically centered
   - Footer zone: bottom 35-45px (slide number, classification label)
   For title-only slides: center content in the full slide height.
   For content slides: center content within the area between header and footer.

E) CENTERING — Always use flexbox centering:
   For title slides: body{display:flex;align-items:center;justify-content:center;}
   For content slides: body{display:flex;flex-direction:column;...} with a content wrapper that has flex:1;display:flex;align-items:center;justify-content:center;

F) TEXT OVERFLOW PREVENTION:
   - Use max-width on all text containers
   - Use line-height:1.5-1.8 for body text
   - Keep body text at 16-22px, headings at 28-48px
   - Max 6-7 lines of text per slide

G) FORMAT AWARENESS:
   - Default: 960x540px (16:9) — U.S. Letter context
   - If user says "A4" or "international": same 16:9 but note A4 export
   - If user says "print" or "Letter": maintain 16:9 ratio for on-screen viewing

Current theme colors: background=${bg} text=${c} accent=${ac} headings=${h1c}
Use these EXACT color values in your CSS (not CSS variables).

EXAMPLE of a valid slide (note the CSS variables and centered layout):
${exampleSlide}

DESIGN RULES:
- Use solid background colors only. NO linear-gradient, NO radial-gradient.
- Use display:flex or display:grid for layout. Always center content properly.
- Fonts: 'Segoe UI', Arial, Helvetica, sans-serif only.
- Maximum 6-7 lines of text per slide. Be concise.
- Always include the CSS variables (:root block) in every slide's <style> tag.
- Always use flexbox centering with safe margins. Content must never touch slide edges.
- Title slides: center vertically in full slide. Content slides: center within the content zone (between header and footer).
- Add a small footer on content slides: position absolute, bottom:8px, right:16px, font-size:10px, opacity:0.6. ${showSlideNumbers ? 'Show slide number in the footer.' : 'DO NOT include slide numbers in the footer.'}

═══════════════════════════
BUILT-IN SVG ICONS (copy these into your slides):
═══════════════════════════
${iconCss}

To use an icon, copy the SVG code and set width/height as needed.
For example, a checkmark: <svg viewBox="0 0 20 20" width="24" height="24"><path d="M4 10l4 4 8-8" stroke="${ac}" stroke-width="2" fill="none"/></svg>

══════════════════════════════════════════════════════
GLOBAL KEYWORD TRIGGER TABLE (PERMANENT — ALL MODES)
═══════════════════════════
These triggers activate ANYWHERE — in Generate, Edit, Script, or Markdown mode — not just in Government Bid Mode. Multiple features can combine in one deck.

| Keyword(s) | Feature |
|---|---|
| "gov bid", "proposal", "compact bid", "RFP", "government" | Government Bid Mode (see below) |
| "quad chart", "quadrant", "2x2" | Quad Chart |
| "Gantt", "project schedule", "timeline chart", "milestone chart", "project plan" | Gantt Chart |
| "RACI", "responsibility matrix", "who does what", "team roles", "work assignment" | RACI Matrix |
| "cost", "budget", "pricing", "financials", "cost breakdown" | Cost / Pricing Table |
| "bar chart", "column chart", "comparison", "survey", "results" | Bar / Column Chart |
| "pie chart", "donut chart", "percentage", "breakdown", "proportion" | Pie or Donut Chart |
| "SWOT", "strengths weaknesses", "strategic" | SWOT Analysis |
| "KPI", "dashboard", "metrics", "scorecard" | KPI Dashboard |
| "org chart", "organization chart", "reporting structure", "hierarchy" | Org Chart |
| "comparison table", "feature comparison", "vs" | Feature Comparison Table |
| "timeline", "roadmap" | Horizontal Timeline |
| "risk matrix", "risk assessment" | Risk Matrix |

When a keyword is detected, you MUST include the corresponding chart/table/feature in the generated slides.

═══════════════════════════
GOVERNMENT BID MODE (activated by: "gov bid", "proposal", "compact bid", "RFP", "government")
═══════════════════════════
Rules:
- Default 5 slides unless user specifies a number. Use that exact number.
- Theme override: background=${govBg} text=#ffffff accent=${govAccent} headings=#ffffff
- Maximum 4 bullets per slide. Large fonts. Minimal text. No decoration.
- Government style: dark navy background, white text, strong contrast, clean lines.
- Auto-include: If the topic relates to scheduling, add a Gantt chart slide. If it relates to team roles, add a RACI matrix. If it relates to costs, add a costing slide.

═══════════════════════════
CHART TYPES — SVG / HTML Examples (copy and adapt for ANY presentation)
═══════════════════════════

=== BAR / COLUMN CHART (comparisons, survey results) ===
Trigger: "bar chart", "column chart", "comparison", "survey", "results"
<svg width="700" height="280" viewBox="0 0 700 280">
  <!-- 3 bars, heights adjusted to data -->
  <rect x="60" y="80" width="70" height="160" fill="${ac}" rx="3"/>
  <text x="95" y="70" text-anchor="middle" fill="${c}" font-size="14">42%</text>
  <text x="95" y="255" text-anchor="middle" fill="${c}" font-size="12">Label A</text>
  <rect x="180" y="120" width="70" height="120" fill="${ac}" rx="3" opacity="0.7"/>
  <text x="215" y="110" text-anchor="middle" fill="${c}" font-size="14">31%</text>
  <text x="215" y="255" text-anchor="middle" fill="${c}" font-size="12">Label B</text>
  <rect x="300" y="60" width="70" height="180" fill="${ac}" rx="3" opacity="0.5"/>
  <text x="335" y="50" text-anchor="middle" fill="${c}" font-size="14">27%</text>
  <text x="335" y="255" text-anchor="middle" fill="${c}" font-size="12">Label C</text>
  <!-- Axis -->
  <line x1="40" y1="20" x2="40" y2="240" stroke="${c}" stroke-width="1" opacity="0.3"/>
  <line x1="40" y1="240" x2="400" y2="240" stroke="${c}" stroke-width="1" opacity="0.3"/>
</svg>

=== PIE / DONUT CHART (percentages, breakdown) ===
Trigger: "pie chart", "donut chart", "percentage", "breakdown", "proportion"
<svg width="240" height="240" viewBox="0 0 240 240">
  <!-- Slice 1: 45% = 0..162 degrees -->
  <path d="M120 120 L120 30 A90 90 0 0 1 202 174 Z" fill="${ac}"/>
  <!-- Slice 2: 30% = 162..270 degrees -->
  <path d="M120 120 L202 174 A90 90 0 0 1 37 174 Z" fill="${ac}" opacity="0.6"/>
  <!-- Slice 3: 25% = 270..360 degrees -->
  <path d="M120 120 L37 174 A90 90 0 0 1 120 30 Z" fill="${ac}" opacity="0.3"/>
  <!-- Legend -->
  <rect x="180" y="180" width="12" height="12" fill="${ac}"/><text x="196" y="190" fill="${c}" font-size="11">45% A</text>
  <rect x="180" y="196" width="12" height="12" fill="${ac}" opacity="0.6"/><text x="196" y="206" fill="${c}" font-size="11">30% B</text>
  <rect x="180" y="212" width="12" height="12" fill="${ac}" opacity="0.3"/><text x="196" y="222" fill="${c}" font-size="11">25% C</text>
</svg>

=== GANTT CHART (project schedule, timeline) ===
Trigger: "Gantt", "project schedule", "timeline chart", "milestone chart", "project plan"
<svg width="900" height="280" viewBox="0 0 900 280">
  <!-- Month headers -->
  <text x="220" y="30" fill="${c}" font-size="12">Jun</text>
  <text x="360" y="30" fill="${c}" font-size="12">Jul</text>
  <text x="500" y="30" fill="${c}" font-size="12">Aug</text>
  <text x="640" y="30" fill="${c}" font-size="12">Sep</text>
  <!-- Grid lines -->
  <line x1="200" y1="40" x2="200" y2="250" stroke="${c}" stroke-width="1" opacity="0.15"/>
  <line x1="340" y1="40" x2="340" y2="250" stroke="${c}" stroke-width="1" opacity="0.15"/>
  <line x1="480" y1="40" x2="480" y2="250" stroke="${c}" stroke-width="1" opacity="0.15"/>
  <line x1="620" y1="40" x2="620" y2="250" stroke="${c}" stroke-width="1" opacity="0.15"/>
  <!-- Task 1 -->
  <text x="10" y="80" fill="${c}" font-size="14">Research</text>
  <rect x="200" y="65" width="170" height="22" fill="#4fc3f7" rx="3"/>
  <!-- Task 2 -->
  <text x="10" y="150" fill="${c}" font-size="14">Development</text>
  <rect x="220" y="135" width="260" height="22" fill="#66bb6a" rx="3"/>
  <!-- Task 3 -->
  <text x="10" y="220" fill="${c}" font-size="14">Testing</text>
  <rect x="350" y="205" width="180" height="22" fill="#ffa726" rx="3"/>
</svg>

=== TIMELINE (roadmap, history, milestones) ===
Trigger: "timeline", "roadmap"
<svg width="900" height="160" viewBox="0 0 900 160">
  <!-- Horizontal line -->
  <line x1="50" y1="80" x2="850" y2="80" stroke="${ac}" stroke-width="3"/>
  <!-- Mile 1 -->
  <circle cx="120" cy="80" r="14" fill="${ac}"/>
  <text x="120" y="115" text-anchor="middle" fill="${c}" font-size="12" font-weight="bold">Q1 2026</text>
  <text x="120" y="130" text-anchor="middle" fill="${c}" font-size="11">Launch MVP</text>
  <!-- Mile 2 -->
  <circle cx="350" cy="80" r="14" fill="${ac}" opacity="0.7"/>
  <text x="350" y="115" text-anchor="middle" fill="${c}" font-size="12" font-weight="bold">Q2 2026</text>
  <text x="350" y="130" text-anchor="middle" fill="${c}" font-size="11">First customers</text>
  <!-- Mile 3 -->
  <circle cx="600" cy="80" r="14" fill="${ac}" opacity="0.5"/>
  <text x="600" y="115" text-anchor="middle" fill="${c}" font-size="12" font-weight="bold">Q3 2026</text>
  <text x="600" y="130" text-anchor="middle" fill="${c}" font-size="11">Scale to 10K</text>
  <!-- Mile 4 -->
  <circle cx="820" cy="80" r="14" fill="${ac}" opacity="0.3"/>
  <text x="820" y="115" text-anchor="middle" fill="${c}" font-size="12" font-weight="bold">Q4 2026</text>
  <text x="820" y="130" text-anchor="middle" fill="${c}" font-size="11">Series A</text>
</svg>

=== RACI MATRIX (responsibilities, who does what) ===
Trigger: "RACI", "responsibility matrix", "who does what", "team roles", "work assignment"
Use a simple HTML <table>:
<table style="width:100%;border-collapse:collapse;font-size:14px;">
  <tr><th style="background:${ac};color:#fff;padding:8px;">Task</th><th style="background:${ac};color:#fff;padding:8px;">Alice</th><th style="background:${ac};color:#fff;padding:8px;">Bob</th><th style="background:${ac};color:#fff;padding:8px;">Carol</th></tr>
  <tr><td style="padding:6px;border:1px solid ${c}22;">Strategy</td><td style="text-align:center;background:#1565c0;color:#fff;font-weight:bold;">A</td><td style="text-align:center;background:#2e7d32;color:#fff;">R</td><td style="text-align:center;background:#757575;color:#fff;">I</td></tr>
  <tr><td style="padding:6px;border:1px solid ${c}22;">Design</td><td style="text-align:center;background:#ef6c00;color:#fff;">C</td><td style="text-align:center;background:#1565c0;color:#fff;font-weight:bold;">A</td><td style="text-align:center;background:#2e7d32;color:#fff;">R</td></tr>
  <tr><td style="padding:6px;border:1px solid ${c}22;">Development</td><td style="text-align:center;background:#757575;color:#fff;">I</td><td style="text-align:center;background:#ef6c00;color:#fff;">C</td><td style="text-align:center;background:#1565c0;color:#fff;font-weight:bold;">A</td></tr>
</table>
R=Responsible (green #2e7d32)  A=Accountable (blue #1565c0)  C=Consulted (orange #ef6c00)  I=Informed (gray #757575)

=== COST TABLE (budget, pricing, financials) ===
Trigger: "cost", "budget", "pricing", "financials", "cost breakdown"
<table style="width:100%;border-collapse:collapse;font-size:14px;">
  <tr><th style="background:${ac};color:#fff;padding:8px;text-align:left;">Item</th><th style="background:${ac};color:#fff;padding:8px;">Qty</th><th style="background:${ac};color:#fff;padding:8px;">Unit</th><th style="background:${ac};color:#fff;padding:8px;text-align:right;">Total</th></tr>
  <tr><td style="padding:6px;border-bottom:1px solid ${c}33;">Item A</td><td style="text-align:center;padding:6px;border-bottom:1px solid ${c}33;">10</td><td style="text-align:center;padding:6px;border-bottom:1px solid ${c}33;">$500</td><td style="text-align:right;padding:6px;border-bottom:1px solid ${c}33;">$5,000</td></tr>
  <tr><td style="padding:6px;border-bottom:1px solid ${c}33;">Item B</td><td style="text-align:center;padding:6px;border-bottom:1px solid ${c}33;">3</td><td style="text-align:center;padding:6px;border-bottom:1px solid ${c}33;">$2,000</td><td style="text-align:right;padding:6px;border-bottom:1px solid ${c}33;">$6,000</td></tr>
  <tr><td colspan="3" style="padding:8px;font-weight:bold;color:${ac};text-align:right;font-size:20px;">Grand Total:</td><td style="padding:8px;font-weight:bold;color:${ac};text-align:right;font-size:20px;">$11,000</td></tr>
</table>

=== SWOT ANALYSIS (strategic planning) ===
Trigger: "SWOT", "strengths weaknesses", "strategic"
Use a 2x2 CSS Grid:
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:20px;">
  <div style="background:#2e7d3244;padding:16px;border-radius:8px;border-left:4px solid #2e7d32;">
    <h3 style="color:#2e7d32;margin-bottom:8px;">STRENGTHS</h3>
    <ul style="font-size:14px;line-height:1.7;list-style:none;padding:0;"><li>&#8226; Point one</li><li>&#8226; Point two</li></ul>
  </div>
  <div style="background:#ef6c0044;padding:16px;border-radius:8px;border-left:4px solid #ef6c00;">
    <h3 style="color:#ef6c00;margin-bottom:8px;">WEAKNESSES</h3>
    <ul style="font-size:14px;line-height:1.7;list-style:none;padding:0;"><li>&#8226; Point one</li><li>&#8226; Point two</li></ul>
  </div>
  <div style="background:#1565c044;padding:16px;border-radius:8px;border-left:4px solid #1565c0;">
    <h3 style="color:#1565c0;margin-bottom:8px;">OPPORTUNITIES</h3>
    <ul style="font-size:14px;line-height:1.7;list-style:none;padding:0;"><li>&#8226; Point one</li><li>&#8226; Point two</li></ul>
  </div>
  <div style="background:#b71c1c44;padding:16px;border-radius:8px;border-left:4px solid #b71c1c;">
    <h3 style="color:#ef5350;margin-bottom:8px;">THREATS</h3>
    <ul style="font-size:14px;line-height:1.7;list-style:none;padding:0;"><li>&#8226; Point one</li><li>&#8226; Point two</li></ul>
  </div>
</div>

=== KPI DASHBOARD (metrics, stats, numbers at a glance) ===
Trigger: "KPI", "dashboard", "metrics", "scorecard"
<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;padding:40px;">
  <div style="text-align:center;background:${bg};padding:24px 12px;border-radius:10px;border:1px solid ${c}33;">
    <div style="font-size:36px;font-weight:bold;color:${ac};">$4.2M</div>
    <div style="font-size:13px;color:${c};margin-top:4px;">Revenue</div>
    <div style="font-size:12px;color:#66bb6a;">+18% YoY</div>
  </div>
  <div style="text-align:center;background:${bg};padding:24px 12px;border-radius:10px;border:1px solid ${c}33;">
    <div style="font-size:36px;font-weight:bold;color:${ac};">124K</div>
    <div style="font-size:13px;color:${c};margin-top:4px;">Users</div>
    <div style="font-size:12px;color:#66bb6a;">+24% YoY</div>
  </div>
  <div style="text-align:center;background:${bg};padding:24px 12px;border-radius:10px;border:1px solid ${c}33;">
    <div style="font-size:36px;font-weight:bold;color:${ac};">3.8%</div>
    <div style="font-size:13px;color:${c};margin-top:4px;">Conversion</div>
    <div style="font-size:12px;color:#66bb6a;">+0.5pp</div>
  </div>
  <div style="text-align:center;background:${bg};padding:24px 12px;border-radius:10px;border:1px solid ${c}33;">
    <div style="font-size:36px;font-weight:bold;color:${ac};">2.1%</div>
    <div style="font-size:13px;color:${c};margin-top:4px;">Churn</div>
    <div style="font-size:12px;color:#ef5350;">+0.3pp</div>
  </div>
</div>

=== ORG CHART (team structure, reporting) ===
Trigger: "org chart", "organization chart", "reporting structure", "hierarchy"
<div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:30px;">
  <div style="background:${ac};color:#fff;padding:12px 28px;border-radius:8px;font-size:16px;font-weight:bold;">CEO</div>
  <svg width="240" height="24"><line x1="120" y1="0" x2="120" y2="24" stroke="${c}" stroke-width="1"/></svg>
  <div style="display:flex;gap:40px;">
    <div style="text-align:center;">
      <svg width="120" height="24"><line x1="60" y1="0" x2="60" y2="24" stroke="${c}" stroke-width="1"/></svg>
      <div style="background:${ac}88;color:${c};padding:8px 18px;border-radius:6px;font-size:14px;">CTO</div>
    </div>
    <div style="text-align:center;">
      <svg width="120" height="24"><line x1="60" y1="0" x2="60" y2="24" stroke="${c}" stroke-width="1"/></svg>
      <div style="background:${ac}88;color:${c};padding:8px 18px;border-radius:6px;font-size:14px;">CFO</div>
    </div>
  </div>
</div>

=== QUAD CHART (2x2 comparison) ===
Trigger: "quad chart", "quadrant", "2x2"
<div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px;flex:1;padding:12px 8px 8px;">
  <div style="padding:14px;background:${bg};border:1px solid ${c}33;">
    <h3 style="color:${ac};font-size:16px;margin-bottom:6px;">PROBLEM</h3>
    <ul style="font-size:13px;line-height:1.7;list-style:none;padding:0;"><li>&#8226; Key point</li><li>&#8226; Key point</li></ul>
  </div>
  <div style="padding:14px;background:${bg};border:1px solid ${c}33;">
    <h3 style="color:${ac};font-size:16px;margin-bottom:6px;">SOLUTION</h3>
    <ul style="font-size:13px;line-height:1.7;list-style:none;padding:0;"><li>&#8226; Key point</li><li>&#8226; Key point</li></ul>
  </div>
  <div style="padding:14px;background:${bg};border:1px solid ${c}33;">
    <h3 style="color:${ac};font-size:16px;margin-bottom:6px;">BENEFITS</h3>
    <ul style="font-size:13px;line-height:1.7;list-style:none;padding:0;"><li>&#8226; Key point</li><li>&#8226; Key point</li></ul>
  </div>
  <div style="padding:14px;background:${bg};border:1px solid ${c}33;">
    <h3 style="color:${ac};font-size:16px;margin-bottom:6px;">NEXT STEPS</h3>
    <ul style="font-size:13px;line-height:1.7;list-style:none;padding:0;"><li>&#8226; Key point</li><li>&#8226; Key point</li></ul>
  </div>
</div>

=== COMPARISON TABLE (vs, alternatives, features) ===
Trigger: "comparison table", "feature comparison", "vs"
<table style="width:100%;border-collapse:collapse;font-size:14px;">
  <tr><th style="background:${ac};color:#fff;padding:8px;text-align:left;">Feature</th><th style="background:${ac};color:#fff;padding:8px;">Option A</th><th style="background:${ac};color:#fff;padding:8px;">Option B</th></tr>
  <tr><td style="padding:6px;border-bottom:1px solid ${c}33;">Feature 1</td><td style="text-align:center;padding:6px;border-bottom:1px solid ${c}33;color:#66bb6a;">&#10003;</td><td style="text-align:center;padding:6px;border-bottom:1px solid ${c}33;color:#ef5350;">&#10007;</td></tr>
  <tr><td style="padding:6px;border-bottom:1px solid ${c}33;">Feature 2</td><td style="text-align:center;padding:6px;border-bottom:1px solid ${c}33;color:#ef5350;">&#10007;</td><td style="text-align:center;padding:6px;border-bottom:1px solid ${c}33;color:#66bb6a;">&#10003;</td></tr>
</table>

=== RISK MATRIX (risk assessment, probability vs impact) ===
Trigger: "risk matrix", "risk assessment"
<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr;gap:2px;padding:20px;">
  <!-- Header row -->
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:12px;font-weight:bold;">Impact →</div>
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:11px;">Negligible</div>
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:11px;">Minor</div>
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:11px;">Moderate</div>
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:11px;">Major</div>
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:11px;">Catastrophic</div>
  <!-- Row: Very Likely -->
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:11px;font-weight:bold;">Very Likely</div>
  <div style="background:#ffca28;padding:8px;text-align:center;font-size:11px;color:#333;">Medium</div>
  <div style="background:#ff9800;padding:8px;text-align:center;font-size:11px;color:#fff;">High</div>
  <div style="background:#f44336;padding:8px;text-align:center;font-size:11px;color:#fff;">Extreme</div>
  <div style="background:#b71c1c;padding:8px;text-align:center;font-size:11px;color:#fff;">Extreme</div>
  <div style="background:#b71c1c;padding:8px;text-align:center;font-size:11px;color:#fff;">Extreme</div>
  <!-- Row: Likely -->
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:11px;font-weight:bold;">Likely</div>
  <div style="background:#66bb6a;padding:8px;text-align:center;font-size:11px;color:#fff;">Low</div>
  <div style="background:#ffca28;padding:8px;text-align:center;font-size:11px;color:#333;">Medium</div>
  <div style="background:#ff9800;padding:8px;text-align:center;font-size:11px;color:#fff;">High</div>
  <div style="background:#f44336;padding:8px;text-align:center;font-size:11px;color:#fff;">Extreme</div>
  <div style="background:#b71c1c;padding:8px;text-align:center;font-size:11px;color:#fff;">Extreme</div>
  <!-- Row: Possible -->
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:11px;font-weight:bold;">Possible</div>
  <div style="background:#66bb6a;padding:8px;text-align:center;font-size:11px;color:#fff;">Low</div>
  <div style="background:#66bb6a;padding:8px;text-align:center;font-size:11px;color:#fff;">Low</div>
  <div style="background:#ffca28;padding:8px;text-align:center;font-size:11px;color:#333;">Medium</div>
  <div style="background:#ff9800;padding:8px;text-align:center;font-size:11px;color:#fff;">High</div>
  <div style="background:#f44336;padding:8px;text-align:center;font-size:11px;color:#fff;">Extreme</div>
  <!-- Row: Unlikely -->
  <div style="background:${ac};color:#fff;padding:8px;text-align:center;font-size:11px;font-weight:bold;">Unlikely</div>
  <div style="background:#66bb6a;padding:8px;text-align:center;font-size:11px;color:#fff;">Low</div>
  <div style="background:#66bb6a;padding:8px;text-align:center;font-size:11px;color:#fff;">Low</div>
  <div style="background:#66bb6a;padding:8px;text-align:center;font-size:11px;color:#fff;">Low</div>
  <div style="background:#ffca28;padding:8px;text-align:center;font-size:11px;color:#333;">Medium</div>
  <div style="background:#ff9800;padding:8px;text-align:center;font-size:11px;color:#fff;">High</div>
</div>
Risk levels: Low=#66bb6a  Medium=#ffca28  High=#ff9800  Extreme=#f44336/#b71c1c
CONTENT RULES:
- Max 6-7 lines per slide. Big fonts (16-24px for body, 28-48px for headings).
- Logical flow: title slide -> agenda/overview -> content slides -> summary.${showSlideNumbers ? '\n- Small footer on every content slide: "Slide N | Title" at bottom-right.' : '\n- Footer on content slides: DO NOT include any slide numbers. Use page-agnostic labels only.'}
- Use meaningful content, never lorem ipsum.`;

        var result;
        if (mode === 'script') {
            result = basePrompt + '\n\nMODE: SCRIPT\nFirst output a numbered outline (1. Title, 2. Title...), then output all <<<SLIDE>>> blocks.';
        } else if (mode === 'markdown') {
            result = basePrompt + '\n\nMODE: MARKDOWN\nFirst output the deck with ---SLIDE--- separators in markdown, then output all <<<SLIDE>>> blocks.';
        } else {
            result = basePrompt + '\n\nMODE: SLIDES\nGenerate slide HTML blocks directly. Output ONLY <<<SLIDE>>>...<<<END_SLIDE>>> blocks.';
        }

        if (isSmallModel()) {
            result = getCompactPrompt(mode, t, govBg, govAccent);
        }

        return result;
    }

    function getCompactPrompt(mode, t, govBg, govAccent) {
        var bg = t.background, c = t.color, ac = t.accent, h1c = t.h1Color;
        var exampleSlide = '<!DOCTYPE html><html><head><style>:root{--slide-width:960px;--slide-height:540px;--safe-margin:40px;--header-height:90px;--footer-height:40px;}*{margin:0;padding:0;box-sizing:border-box;}body{width:var(--slide-width);height:var(--slide-height);overflow:hidden;font-family:\'Segoe UI\',sans-serif;background:'+bg+';color:'+c+';display:flex;align-items:center;justify-content:center;}.container{width:880px;max-width:calc(var(--slide-width) - 2*var(--safe-margin));text-align:center;}h1{font-size:48px;color:'+h1c+';}p{font-size:20px;}</style></head><body><div class="container"><h1>Slide Title</h1><p>Your content here</p></div></body></html>';
        var gov = '';

        if (/gov bid|proposal|compact bid|RFP|quad chart|government/.test(state.chatHistory.slice(-1)[0]?.content || '')) {
            gov = '\n\nGOV MODE: Use background='+govBg+' text=#ffffff. Max 5 slides unless told otherwise.';
        }

        var prompt = 'Create HTML slides. Each slide = 960x540px. Wrap each in <<<SLIDE>>>...<<<END_SLIDE>>>.\n\n' +
            'LAYOUT RULES (EVERY SLIDE):\n' +
            '1. Define CSS variables: :root{--slide-width:960px;--slide-height:540px;--safe-margin:40px;--header-height:90px;--footer-height:40px;}\n' +
            '2. body { width:var(--slide-width);height:var(--slide-height);overflow:hidden; }\n' +
            '3. Safe margins: 40px left/right, 35px top/bottom. Content NEVER touches edges.\n' +
            '4. Title slides: center content in full slide height.\n' +
            '5. Content slides: content centered between header (top 90px) and footer (bottom 40px).\n' +
            '6. Use flexbox centering. max-width content containers.\n' +
            '7. All CSS in one <style> tag. No external files. No JS.\n' +
            '8. Output ONLY markers and HTML. No extra text.\n' +
            '9. Use ONLY solid background colors. No gradients.\n' +
            '10. Each slide under 3000 characters.\n\n' +
            'Colors: background='+bg+' text='+c+' accent='+ac+'\n\n' +
            'EXAMPLE (copy this pattern):\n'+
            exampleSlide + '\n\n' +
            gov;

        if (mode === 'script') prompt += '\n\nFirst list slide titles (1,2,3...), then output <<<SLIDE>>> blocks.';
        else if (mode === 'markdown') prompt += '\n\nFirst output a markdown outline with ---SLIDE--- separators, then <<<SLIDE>>> blocks.';
        else prompt += '\n\nOutput <<<SLIDE>>>...<<<END_SLIDE>>> blocks directly.';

        return prompt;
    }

    function getEditSystemPrompt() {
        const t = SLIDE_THEMES[state.currentTheme];
        if (isSmallModel()) {
            return 'You are editing a slide. Return the COMPLETE modified HTML.\n\n' +
                'RULES:\n' +
                '1. <!DOCTYPE html>...<style>...</style><body>...</body></html>\n' +
                '2. 960x540px. Single <style> tag. No JS.\n' +
                '3. Colors: bg=' + t.background + ' text=' + t.color + ' accent=' + t.accent + '\n' +
                '4. Wrap in <<<SLIDE>>>...<<<END_SLIDE>>>.\n' +
                '5. Only the changes requested. Keep everything else.\n' +
                '6. Under 3000 chars.\n' +
                '7. If a chart or SVG is too complex, use a simple table or list instead.\n' +
                '8. Always include CSS variables: :root{--slide-width:960px;--slide-height:540px;--safe-margin:40px;--header-height:90px;--footer-height:40px;}\n' +
                '9. Center content with flexbox. Safe margins 40px. Content never touches edges.';
        }
        var prompt = 'You are editing a presentation slide. The user wants a specific change.\n\n' +
            'RULES:\n' +
            '1. Return the COMPLETE modified HTML document with <!DOCTYPE html>, <html>, <head> with <style>, and <body>.\n' +
            '2. All CSS in a single <style> tag. No external links, no JavaScript.\n' +
            '3. Current theme colors for reference: background=' + t.background + ' text=' + t.color + ' accent=' + t.accent + '\n' +
            '4. 960x540 pixels. body { width:960px; height:540px; overflow:hidden; }\n' +
            '5. Wrap the slide in <<<SLIDE>>> / <<<END_SLIDE>>> markers.\n' +
            '6. Output ONLY the markers and HTML. No explanations.\n' +
            '7. Make ONLY the requested changes. Keep everything else exactly as-is.\n' +
            '8. Slide must be under 3000 characters.\n\n' +
            'SMART LAYOUT RULES:\n' +
            '- Always include CSS variables in :root: --slide-width:960px; --slide-height:540px; --safe-margin:40px; --header-height:90px; --footer-height:40px;\n' +
            '- Safe margins: 40px left/right, 35px top/bottom minimum.\n' +
            '- Title slides: center content vertically in full slide height.\n' +
            '- Content slides: center content between header (top 80-100px) and footer (bottom 35-45px).\n' +
            '- Use flexbox centering. Never let content touch slide edges.\n' +
            '- max-width on content containers: 880px (960 - 2*40).\n' +
            '- If the slide already follows these layout rules, preserve them. If not, add them.';

        var footerLabel = document.getElementById('footer-label-input').value.trim();
        if (footerLabel) {
            prompt += '\n\nFOOTER LABEL: This slide must include a footer with the text "' + footerLabel + '" in small font, typically at the bottom-right or bottom-center. This label should be subtle but legible (e.g. font-size:10px, opacity:0.6, color matching the text). If the slide already has this footer, preserve it. If not, add it.';
        }

        return prompt;
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
                const t = SLIDE_THEMES[state.currentTheme];
                slides.push(`<!DOCTYPE html><html><head><style>body{margin:0;padding:0;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:${t.background};color:${t.color};}</style></head><body>${bodyContent}</body></html>`);
            }
        }

        return slides;
    }

    function parseMarkdownToSlides(markdown) {
        const sections = markdown.split(/^---\s*$/m).filter(s => s.trim());
        const t = SLIDE_THEMES[state.currentTheme];
        return sections.map(section => {
            const lines = section.trim().split('\n');
            let title = '';
            let content = [];
            lines.forEach(line => {
                const h1Match = line.match(/^#\s+(.+)/);
                const h2Match = line.match(/^##\s+(.+)/);
                if (h1Match && !title) {
                    title = h1Match[1];
                } else if (h2Match && !title) {
                    title = h2Match[1];
                } else {
                    content.push(line);
                }
            });
            const bodyContent = content.join('<br>\n');
            return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:${t.background};color:${t.color};display:flex;flex-direction:column;justify-content:center;padding:60px;}.slide-title{font-size:36px;color:${t.h1Color};margin-bottom:24px;}.slide-content{font-size:20px;line-height:1.8;color:${t.color};}</style></head><body>${title ? `<div class="slide-title">${title}</div>` : ''}<div class="slide-content">${bodyContent}</div></body></html>`;
        });
    }

    function togglePinSession(sessionId) {
        const session = state.sessions.find(function (s) { return s.id === sessionId; });
        if (!session) return;
        session.pinned = !session.pinned;
        saveSessions();
        renderSessionList();
    }

    function downloadSessionHTML(sessionId) {
        const session = state.sessions.find(s => s.id === sessionId);
        if (!session || !session.slides || session.slides.length === 0) return;
        const title = session.title || 'Untitled';
        let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #111; overflow: hidden; }
.slide { width: 960px; height: 540px; page-break-after: always; }
</style>
</head>
<body>
`;
        session.slides.forEach((slide, i) => {
            html += `<div class="slide"><iframe srcdoc="${escapeHtml(slide)}" width="960" height="540" style="border:none;"></iframe></div>\n`;
        });
        html += `</body>\n</html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = title.replace(/[^a-z0-9]/gi, '_') + '.html';
        a.click();
        URL.revokeObjectURL(url);
    }

    async function handleGenerate() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const stopBtn = document.getElementById('chat-stop-btn');
        const prompt = input.value.trim();

        if (!prompt) return;

        const isDefault = (state.slides.length === 1 && state.slides[0] === DEFAULT_SLIDE_HTML);

        if (!isDefault && state.slides.length > 0) {
            saveCurrentSession();
            var currentSess = state.sessions.find(function (s) { return s.id === state.currentSessionId; });
            if (currentSess && !currentSess.pinned) {
                currentSess.pinned = true;
                saveSessions();
            }
            var newTitle = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;
            createSession(newTitle);
        }

        // Always clear slides before generating — we're replacing them
        state.slides = [];
        state.currentSlideIndex = 0;
        renderAll();

        addChatMessage('user', prompt);
        input.value = '';

        state.isGenerating = true;
        sendBtn.disabled = true;
        sendBtn.style.display = 'none';
        stopBtn.style.display = '';
        showGenerationOverlay(true);

        const streamMsg = document.createElement('div');
        streamMsg.className = 'chat-msg assistant';
        document.getElementById('chat-messages').appendChild(streamMsg);

        let lastParsedCount = 0;
        let allParsedSlides = [];

        state.onStreamToken = (fullContent) => {
            const slides = parseSlidesFromResponse(fullContent);
            const newSlides = slides.slice(lastParsedCount);

            for (const slideHtml of newSlides) {
                allParsedSlides.push(slideHtml);
                state.slides.push(slideHtml);
                state.currentSlideIndex = state.slides.length - 1;
                lastParsedCount = allParsedSlides.length;
                saveSlides();
                renderAll();
            }

            if (allParsedSlides.length > 0) {
                streamMsg.textContent = `Generating... Slide ${allParsedSlides.length} completed`;
                updateGenerationOverlay(allParsedSlides.length);
            } else {
                streamMsg.innerHTML = '<span class="loading-dots">Generating</span>';
            }
            document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
        };

        try {
            var researchChecked = document.getElementById('research-checkbox').checked;
            var researchContext = '';

            if (researchChecked && state.currentProvider === 'ollama') {
                streamMsg.textContent = 'Researching topic...';
                updateGenerationOverlay(0);
                var genText = document.getElementById('gen-overlay-text');
                if (genText) genText.textContent = 'Researching...';
                researchContext = await doResearch(prompt);
                if (genText) genText.textContent = 'Generating presentation...';
            }

            const mode = document.getElementById('gen-mode-select').value;
            let systemPrompt = getSlideSystemPrompt(mode) + getImageContext();

            if (researchContext) {
                systemPrompt += '\n\nRESEARCH DATA (use this factual information in your slides):\n' + researchContext;
            }

            const maxSlides = document.getElementById('max-slides-input').value;
            if (maxSlides && parseInt(maxSlides) > 0) {
                systemPrompt += `\n\nUSER-SPECIFIED MAXIMUM: Generate exactly ${parseInt(maxSlides)} slides. Do not exceed this number.`;
            }

            const footerLabel = document.getElementById('footer-label-input').value.trim();
            if (footerLabel) {
                systemPrompt += `\n\nFOOTER LABEL: Every slide (except title slides) must include a footer with the text "${footerLabel}" in small font, typically at the bottom-right or bottom-center. This label should be subtle but legible (e.g. font-size:10px, opacity:0.6, color matching the text). For government/military presentations, common labels include: CUI (Controlled Unclassified Information), Company Sensitive, Do Not Distribute, For Official Use Only, etc.`;
            }

            const response = await sendToLLM(prompt, systemPrompt);

            state.onStreamToken = null;

            if (response) {
                const parsedSlides = parseSlidesFromResponse(response);
                const finalCount = parsedSlides.length;
                const alreadyAdded = allParsedSlides.length;

                if (finalCount > alreadyAdded) {
                    const remaining = parsedSlides.slice(alreadyAdded);
                    for (const slideHtml of remaining) {
                        state.slides.push(slideHtml);
                    }
                }

                if (finalCount > 0) {
                    state.currentSlideIndex = 0;
                    saveSlides();
                    renderAll();
                    streamMsg.textContent = 'Done. ' + finalCount + ' slide(s) generated.';
                    showGenerationComplete(finalCount);
                } else {
                    streamMsg.textContent = 'Could not parse slides from the response. Try rephrasing or using a different generation mode.';
                    showGenerationError('No slides parsed');
                }
            } else {
                streamMsg.textContent = allParsedSlides.length > 0
                    ? 'Stopped after ' + allParsedSlides.length + ' slide(s).'
                    : 'Generation cancelled.';
                showGenerationComplete(allParsedSlides.length);
            }
        } catch (e) {
            state.onStreamToken = null;
            if (e.name !== 'AbortError') {
                streamMsg.textContent = 'Error: ' + e.message;
                showGenerationError(e.message);
            }
        } finally {
            state.isGenerating = false;
            sendBtn.disabled = false;
            sendBtn.style.display = '';
            stopBtn.style.display = 'none';
            state.abortController = null;
            state.onStreamToken = null;
        }
    }

    async function handleEdit() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const stopBtn = document.getElementById('chat-stop-btn');
        const prompt = input.value.trim();

        if (!prompt) return;
        if (state.slides.length === 0) {
            addErrorMessage('No slides to edit. Generate slides first or switch to Generate mode.');
            return;
        }

        if (handleToolCommand(prompt)) {
            input.value = '';
            return;
        }

        addChatMessage('user', prompt);
        input.value = '';

        state.isGenerating = true;
        sendBtn.disabled = true;
        sendBtn.style.display = 'none';
        stopBtn.style.display = '';

        const streamMsg = document.createElement('div');
        streamMsg.className = 'chat-msg assistant';
        streamMsg.innerHTML = '<span class="loading-dots">Editing slide</span>';
        document.getElementById('chat-messages').appendChild(streamMsg);

        showGenerationOverlay(true);
        const textEl = document.getElementById('gen-overlay-text');
        if (textEl) textEl.textContent = 'Editing slide...';
        const countEl = document.getElementById('gen-overlay-count');
        if (countEl) countEl.textContent = `Slide ${state.currentSlideIndex + 1} of ${state.slides.length}`;

        let editSlideReceived = false;

        state.onStreamToken = (fullContent) => {
            const slides = parseSlidesFromResponse(fullContent);
            if (slides.length > 0) {
                state.slides[state.currentSlideIndex] = slides[slides.length - 1];
                editSlideReceived = true;
                saveSlides();
                renderAll();
                streamMsg.textContent = 'Applying changes...';
                const ct = document.getElementById('gen-overlay-count');
                if (ct) ct.textContent = 'Updating preview...';
            }
            document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
        };

        try {
            const currentSlide = state.slides[state.currentSlideIndex];
            const editPrompt = `Here is the current slide HTML (slide ${state.currentSlideIndex + 1} of ${state.slides.length}):\n\n${currentSlide}\n\nUser request: ${prompt}\n\nPlease return the modified slide HTML wrapped in <<<SLIDE>>> and <<<END_SLIDE>>> markers.`;

            const response = await sendToLLM(editPrompt, getEditSystemPrompt());

            state.onStreamToken = null;

            if (response) {
                const parsedSlides = parseSlidesFromResponse(response);
                if (parsedSlides.length > 0) {
                    state.slides[state.currentSlideIndex] = parsedSlides[parsedSlides.length - 1];
                    saveSlides();
                    renderAll();
                    streamMsg.textContent = 'Slide updated.';
                    showGenerationComplete(1);
                } else if (editSlideReceived) {
                    streamMsg.textContent = 'Slide updated.';
                    showGenerationComplete(1);
                } else {
                    streamMsg.textContent = 'Could not parse the edited slide. Try being more specific.';
                    showGenerationError('No slide parsed');
                }
            }
        } catch (e) {
            state.onStreamToken = null;
            if (e.name !== 'AbortError') {
                streamMsg.textContent = `Error: ${e.message}`;
                showGenerationError(e.message);
            }
        } finally {
            state.isGenerating = false;
            sendBtn.disabled = false;
            sendBtn.style.display = '';
            stopBtn.style.display = 'none';
            state.abortController = null;
            state.onStreamToken = null;
            showGenerationOverlay(false);
        }
    }

    function handleSend() {
        const input = document.getElementById('chat-input').value.trim();
        if (!input) return;

        if (state.currentMode === 'generate') {
            handleGenerate();
        } else {
            handleEdit();
        }
    }

    function applyThemeToSlide(slideHtml, theme) {
        const t = SLIDE_THEMES[theme];
        if (!t) return slideHtml;

        let html = slideHtml;

        const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
        if (!styleMatch) return html;

        let css = styleMatch[1];

        // Replace CSS variable definitions
        css = css.replace(/--bg\s*:\s*[^;}]+/g, `--bg:${t.background}`);
        css = css.replace(/--text\s*:\s*[^;}]+/g, `--text:${t.color}`);
        css = css.replace(/--accent\s*:\s*[^;}]+/g, `--accent:${t.accent}`);
        css = css.replace(/--h1\s*:\s*[^;}]+/g, `--h1:${t.h1Color}`);
        css = css.replace(/--h2\s*:\s*[^;}]+/g, `--h2:${t.h2Color}`);
        css = css.replace(/--(bg-secondary|border)\s*:\s*[^;}]+/g, (match, varName) => {
            return `--${varName}:${t.background}`;
        });

        // Replace direct color values from the old theme
        const allThemes = Object.values(SLIDE_THEMES);
        for (const old of allThemes) {
            if (old.background === t.background) continue;
            // Background colors
            css = css.replace(new RegExp(escapeRegex(old.background), 'g'), t.background);
            css = css.replace(new RegExp(escapeRegex(old.color), 'g'), t.color);
            css = css.replace(new RegExp(escapeRegex(old.accent), 'g'), t.accent);
            html = html.replace(new RegExp(escapeRegex(old.background), 'g'), t.background);
            html = html.replace(new RegExp(escapeRegex(old.color), 'g'), t.color);
            html = html.replace(new RegExp(escapeRegex(old.accent), 'g'), t.accent);
        }

        // Also handle linear-gradient backgrounds that use theme colors
        for (const old of allThemes) {
            if (old.background === t.background) continue;
            html = html.replace(new RegExp(`linear-gradient\\([^)]*${escapeRegex(old.background)}[^)]*\\)`, 'g'), t.background);
        }

        // Put the modified CSS back
        html = html.replace(styleMatch[1], css);

        // Also update inline styles on body
        html = html.replace(/(<body[^>]*style="[^"]*?)background:\s*[^;"']+/g, `$1background:${t.background}`);
        html = html.replace(/(<body[^>]*style="[^"]*?)color:\s*[^;"']+/g, `$1color:${t.color}`);

        return html;
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function switchView(view) {
        state.currentView = view;
        const previewArea = document.getElementById('slide-preview-area');
        const htmlArea = document.getElementById('slide-html-area');
        const applyBtn = document.getElementById('apply-html-btn');

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        if (view === 'html') {
            previewArea.style.display = 'none';
            htmlArea.style.display = '';
            applyBtn.style.display = '';
            document.getElementById('slide-html-editor').value = state.slides[state.currentSlideIndex] || '';
        } else {
            previewArea.style.display = '';
            htmlArea.style.display = 'none';
            applyBtn.style.display = 'none';
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
        document.getElementById('pres-counter').textContent = `${state.currentSlideIndex + 1} / ${state.slides.length}`;
    }

    function endPresentation() {
        document.getElementById('presentation-mode').style.display = 'none';
    }

    function loadTemplate(templateId) {
        const template = BUILT_IN_TEMPLATES[templateId];
        if (!template) return;

        state.slides = [...template.slides];
        state.currentSlideIndex = 0;
        state.currentTheme = template.theme || 'dark';
        saveSlides();
        renderAll();
        setMode('edit');
        addSystemMessage(`Loaded template: ${template.name} (${template.slides.length} slides). Switch to Edit mode to customize.`);
    }

    function handleImport() {
        const sourceType = document.getElementById('import-source-select').value;
        const replaceAll = document.getElementById('import-replace-checkbox').checked;

        if (sourceType === 'clipboard') {
            const text = document.getElementById('import-clipboard-text').value.trim();
            if (!text) { addErrorMessage('No content to import.'); return; }
            importContent(text, 'auto', replaceAll);
        } else {
            const fileInput = document.getElementById('import-file');
            if (!fileInput.files || !fileInput.files.length) { addErrorMessage('No file selected.'); return; }
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                importContent(e.target.result, sourceType, replaceAll);
            };
            reader.readAsText(file);
        }

        document.getElementById('import-modal').style.display = 'none';
    }

    function importContent(content, sourceType, replaceAll) {
        let newSlides = [];
        let newTheme = null;

        var isJson = (sourceType === 'template-json');
        if (!isJson && sourceType === 'auto') {
            isJson = /^\s*\{/.test(content) && /\}\s*$/.test(content.trim());
        }

        if (isJson) {
            try {
                var data = JSON.parse(content);
                if (data.slides && Array.isArray(data.slides)) {
                    var rawSlides = data.slides.filter(function (s) {
                        return typeof s === 'string' && s.trim().length > 0;
                    });
                    if (rawSlides.length === 0) {
                        addErrorMessage('Template JSON has a "slides" array but it is empty.');
                        return;
                    }
                    for (var i = 0; i < rawSlides.length; i++) {
                        if (!/<!DOCTYPE|<html|<style/i.test(rawSlides[i])) {
                            addErrorMessage('Slide ' + (i + 1) + ' in the template does not appear to be valid HTML (missing DOCTYPE or <html>).');
                            return;
                        }
                        if (rawSlides[i].length < 50) {
                            addErrorMessage('Slide ' + (i + 1) + ' is too short (' + rawSlides[i].length + ' chars). Each slide should be a full HTML document.');
                            return;
                        }
                    }
                    newSlides = rawSlides;
                    if (data.theme && SLIDE_THEMES[data.theme]) {
                        newTheme = data.theme;
                    } else if (data.theme) {
                        addSystemMessage('Warning: Theme "' + data.theme + '" is not recognized. Using current theme. Valid themes: dark, light, blue, green, red.');
                    }
                } else if (data.slides && !Array.isArray(data.slides)) {
                    addErrorMessage('Template JSON has a "slides" field but it is not an array.');
                    return;
                } else {
                    addErrorMessage('Template JSON is missing a "slides" array. The JSON must have {"slides": ["<slide HTML>", ...]}.');
                    return;
                }
                if (data.name && !data.slides) {
                    addErrorMessage('Template has a "name" but no "slides" array. Did the LLM omit the slides? Check the format in the Import dialog.');
                    return;
                }
            } catch (e) {
                if (sourceType === 'template-json') {
                    addErrorMessage('Invalid JSON: ' + e.message);
                    return;
                }
            }
        }

        if (newSlides.length === 0 && (sourceType === 'slides-html' || sourceType === 'auto')) {
            const htmlRegex = /<!DOCTYPE\s+html[^>]*>[\s\S]*?<\/html>/gi;
            let match;
            while ((match = htmlRegex.exec(content)) !== null) {
                newSlides.push(match[0].trim());
            }
            if (newSlides.length === 0 && content.includes('<html')) {
                newSlides.push(content.trim());
            }
        }

        if (newSlides.length === 0 && (sourceType === 'slides-markdown' || sourceType === 'auto')) {
            if (content.includes('---') || content.includes('#')) {
                newSlides = parseMarkdownToSlides(content);
            }
        }

        if (newSlides.length === 0) {
            addErrorMessage('Could not parse any slides. Supported formats: Template JSON with "slides" array, HTML documents, or Markdown with --- separators.');
            return;
        }

        if (replaceAll) {
            state.slides = newSlides;
        } else {
            state.slides = state.slides.concat(newSlides);
        }

        if (newTheme) {
            state.currentTheme = newTheme;
        }

        state.currentSlideIndex = 0;
        saveSlides();
        renderAll();
        var msg = 'Imported ' + newSlides.length + ' slide(s).';
        if (newTheme) msg += ' Theme set to "' + newTheme + '".';
        addSystemMessage(msg);
    }

    function handleExportTemplate() {
        const title = document.getElementById('presentation-title').value || 'My Template';
        const template = {
            name: title,
            description: `Exported from Presentation Canvas on ${new Date().toLocaleDateString()}`,
            theme: state.currentTheme,
            slides: state.slides
        };
        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addSystemMessage('Template exported successfully.');
    }

    function initEventListeners() {
        document.getElementById('sidebar-toggle-btn').addEventListener('click', () => {
            state.sidebarOpen = !state.sidebarOpen;
            document.getElementById('session-sidebar').classList.toggle('open', state.sidebarOpen);
            localStorage.setItem('canvas_sidebar_open', state.sidebarOpen);
        });

        document.getElementById('new-session-btn').addEventListener('click', () => {
            saveCurrentSession();
            createSession('New Presentation');
            addSystemMessage('Started a new presentation session.');
        });

        document.getElementById('clear-sessions-btn').addEventListener('click', () => {
            clearAllSessions();
        });

        document.getElementById('session-sidebar').addEventListener('dblclick', (e) => {
            var titleEl = e.target.closest('.session-item-title');
            if (!titleEl) return;
            var item = titleEl.closest('.session-item');
            var sessionId = item.querySelector('.session-item-pin, .session-item-download, .session-item-delete').dataset.id;
            var session = state.sessions.find(function (s) { return s.id === sessionId; });
            if (!session) return;
            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'session-title-edit';
            input.value = session.title;
            input.style.cssText = 'width:100%;background:var(--bg-tertiary);color:var(--text-primary);border:1px solid var(--accent);padding:2px 6px;border-radius:3px;font-size:13px;font-family:inherit;';
            titleEl.innerHTML = '';
            titleEl.appendChild(input);
            input.focus();
            input.select();
            input.addEventListener('blur', function () { finishRename(input, session); });
            input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); finishRename(input, session); } });
        });

        document.getElementById('server-info-btn').addEventListener('click', () => {
            document.getElementById('server-info-modal').style.display = '';
        });

        document.getElementById('server-info-close-btn').addEventListener('click', () => {
            document.getElementById('server-info-modal').style.display = 'none';
        });

        document.getElementById('presentation-title').addEventListener('change', () => {
            saveCurrentSession();
            renderSessionList();
        });

        document.getElementById('provider-select').addEventListener('change', (e) => {
            state.currentProvider = e.target.value;
            refreshModels();
        });

        document.getElementById('model-select').addEventListener('change', (e) => {
            state.currentModel = e.target.value;
        });

        document.getElementById('refresh-models-btn').addEventListener('click', refreshModels);

        document.getElementById('mode-generate-btn').addEventListener('click', () => setMode('generate'));
        document.getElementById('mode-edit-btn').addEventListener('click', () => setMode('edit'));

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
                        state.uploadedImages.push({ name: file.name, data: ev.target.result, width: img.width, height: img.height });
                        renderUploadedImages();
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            });
            e.target.value = '';
        });

        document.getElementById('logo-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                state.logo = { data: ev.target.result, name: file.name, position: 'bottom-right', size: 90 };
                saveLogo();
                renderLogoPreview();
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        });

        document.getElementById('footer-label-input').addEventListener('input', debounceFooterLabel);
        document.getElementById('footer-label-input').addEventListener('change', applyFooterLabel);

        document.getElementById('logo-apply-btn').addEventListener('click', applyLogoToAllSlides);
        document.getElementById('logo-remove-btn').addEventListener('click', removeLogoFromAllSlides);

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });

        document.getElementById('slide-html-editor').addEventListener('input', (e) => {
            debounceUpdateSlide(e.target.value);
        });

        document.getElementById('apply-html-btn').addEventListener('click', () => {
            const val = document.getElementById('slide-html-editor').value;
            state.slides[state.currentSlideIndex] = val;
            saveSlides();
            renderSlidePreview();
            renderThumbnails();
            addSystemMessage('HTML changes applied.');
        });

        document.getElementById('add-slide-btn').addEventListener('click', () => addSlide());
        document.getElementById('delete-slide-btn').addEventListener('click', () => deleteSlide(state.currentSlideIndex));
        document.getElementById('move-slide-up-btn').addEventListener('click', () => moveSlide(state.currentSlideIndex, state.currentSlideIndex - 1));
        document.getElementById('move-slide-down-btn').addEventListener('click', () => moveSlide(state.currentSlideIndex, state.currentSlideIndex + 1));

        document.getElementById('theme-select').addEventListener('change', (e) => {
            const newTheme = e.target.value;
            const oldTheme = state.currentTheme;
            state.currentTheme = newTheme;
            // Apply theme to all existing slides
            state.slides = state.slides.map(html => applyThemeToSlide(html, newTheme));
            saveSlides();
            renderAll();
        });

        document.getElementById('layout-select').addEventListener('change', (e) => {
            if (state.slides.length === 0) return;
            const layout = e.target.value;
            if (!layout) return;
            const theme = SLIDE_THEMES[state.currentTheme];
            const v = ':root{--slide-width:960px;--slide-height:540px;--safe-margin:40px;--header-height:90px;--footer-height:40px;}';
            const layouts = {
                'title': `<!DOCTYPE html><html><head><style>${v}*{margin:0;padding:0;box-sizing:border-box;}body{width:960px;height:540px;overflow:hidden;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};display:flex;align-items:center;justify-content:center;}.container{width:880px;max-width:880px;text-align:center;}h1{font-size:56px;margin-bottom:16px;color:${theme.h1Color};}p{font-size:24px;color:${theme.color};opacity:0.8;}</style></head><body><div class="container"><h1>Title Here</h1><p>Subtitle goes here</p></div></body></html>`,
                'title-content': `<!DOCTYPE html><html><head><style>${v}*{margin:0;padding:0;box-sizing:border-box;}body{width:960px;height:540px;overflow:hidden;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};display:flex;flex-direction:column;}.header{padding:35px 40px 0;}.header h2{font-size:36px;color:${theme.h2Color};border-bottom:3px solid ${theme.accent};padding-bottom:10px;display:inline-block;}.content{flex:1;display:flex;align-items:center;justify-content:center;padding:0 40px 35px;}.content-inner{width:880px;font-size:20px;line-height:1.8;}</style></head><body><div class="header"><h2>Slide Title</h2></div><div class="content"><div class="content-inner"><p>Content goes here</p></div></div></body></html>`,
                'two-column': `<!DOCTYPE html><html><head><style>${v}*{margin:0;padding:0;box-sizing:border-box;}body{width:960px;height:540px;overflow:hidden;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};display:flex;flex-direction:column;}.header{padding:35px 40px 0;}.header h2{font-size:36px;color:${theme.h2Color};border-bottom:3px solid ${theme.accent};padding-bottom:10px;display:inline-block;}.content{flex:1;display:flex;align-items:center;justify-content:center;padding:0 40px 35px;}.columns{width:880px;display:flex;gap:40px;}.column{flex:1;}.column h3{color:${theme.accent};margin-bottom:12px;}.column p{font-size:18px;line-height:1.6;}</style></head><body><div class="header"><h2>Two Column Slide</h2></div><div class="content"><div class="columns"><div class="column"><h3>Left Column</h3><p>Content here</p></div><div class="column"><h3>Right Column</h3><p>Content here</p></div></div></div></body></html>`,
                'image-left': `<!DOCTYPE html><html><head><style>${v}*{margin:0;padding:0;box-sizing:border-box;}body{width:960px;height:540px;overflow:hidden;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};display:flex;}.image-side{width:40%;display:flex;align-items:center;justify-content:center;background:#333;}.content-side{flex:1;display:flex;flex-direction:column;justify-content:center;padding:40px 40px 35px;max-width:560px;}.content-side h2{font-size:36px;margin-bottom:20px;color:${theme.h2Color};}.content-side p{font-size:20px;line-height:1.8;}</style></head><body><div class="image-side"><p style="color:#aaa;text-align:center;">Image</p></div><div class="content-side"><h2>Slide Title</h2><p>Content goes here</p></div></body></html>`,
                'image-right': `<!DOCTYPE html><html><head><style>${v}*{margin:0;padding:0;box-sizing:border-box;}body{width:960px;height:540px;overflow:hidden;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};display:flex;}.content-side{flex:1;display:flex;flex-direction:column;justify-content:center;padding:40px 40px 35px;max-width:560px;}.content-side h2{font-size:36px;margin-bottom:20px;color:${theme.h2Color};}.content-side p{font-size:20px;line-height:1.8;}.image-side{width:40%;display:flex;align-items:center;justify-content:center;background:#333;}</style></head><body><div class="content-side"><h2>Slide Title</h2><p>Content goes here</p></div><div class="image-side"><p style="color:#aaa;text-align:center;">Image</p></div></body></html>`,
                'full-image': `<!DOCTYPE html><html><head><style>${v}*{margin:0;padding:0;box-sizing:border-box;}body{width:960px;height:540px;overflow:hidden;font-family:'Segoe UI',sans-serif;background:#333;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;}.overlay{padding:40px;max-width:880px;}.overlay h1{font-size:48px;margin-bottom:16px;}.overlay p{font-size:24px;opacity:0.9;}</style></head><body><div class="overlay"><h1>Full Image Slide</h1><p>Add an image behind this overlay</p></div></body></html>`,
                'blank': `<!DOCTYPE html><html><head><style>${v}*{margin:0;padding:0;box-sizing:border-box;}body{width:960px;height:540px;overflow:hidden;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};display:flex;align-items:center;justify-content:center;}.container{width:880px;text-align:center;}</style></head><body><div class="container"><h2 style="color:${theme.h2Color};font-size:32px;">Blank Slide</h2><p style="font-size:20px;margin-top:20px;">Add your content here</p></div></body></html>`
            };
            const layoutHtml = layouts[layout] || layouts['blank'];
            state.slides[state.currentSlideIndex] = layoutHtml;
            saveSlides();
            renderAll();
            e.target.value = '';
        });



        document.getElementById('import-template-btn').addEventListener('click', () => {
            document.getElementById('import-modal').style.display = '';
        });

        document.getElementById('import-source-select').addEventListener('change', (e) => {
            const val = e.target.value;
            document.getElementById('import-file-area').style.display = (val === 'clipboard') ? 'none' : '';
            document.getElementById('import-clipboard-area').style.display = (val === 'clipboard') ? '' : 'none';
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            const fileName = e.target.files.length > 0 ? e.target.files[0].name : 'No file selected';
            document.getElementById('import-file-name').textContent = fileName;
        });

        document.getElementById('import-confirm-btn').addEventListener('click', handleImport);
        document.getElementById('import-cancel-btn').addEventListener('click', () => {
            document.getElementById('import-modal').style.display = 'none';
        });

        document.getElementById('copy-llm-prompt-btn').addEventListener('click', () => {
            const pre = document.getElementById('llm-template-prompt');
            navigator.clipboard.writeText(pre.textContent).then(() => {
                addSystemMessage('LLM prompt copied to clipboard. Paste it into Gemini, ChatGPT, or any LLM to generate a template.');
            }).catch(() => {
                pre.select();
                addSystemMessage('Prompt selected. Press Ctrl+C to copy.');
            });
        });

        document.getElementById('export-template-btn').addEventListener('click', handleExportTemplate);

        document.getElementById('present-btn').addEventListener('click', startPresentation);
        document.getElementById('pres-prev-btn').addEventListener('click', () => {
            if (state.currentSlideIndex > 0) { state.currentSlideIndex--; showPresentationSlide(); }
        });
        document.getElementById('pres-next-btn').addEventListener('click', () => {
            if (state.currentSlideIndex < state.slides.length - 1) { state.currentSlideIndex++; showPresentationSlide(); }
        });
        document.getElementById('pres-exit-btn').addEventListener('click', endPresentation);

        document.addEventListener('keydown', (e) => {
            if (document.getElementById('presentation-mode').style.display !== 'none') {
                if (e.key === 'ArrowRight' || e.key === ' ') {
                    if (state.currentSlideIndex < state.slides.length - 1) { state.currentSlideIndex++; showPresentationSlide(); }
                } else if (e.key === 'ArrowLeft') {
                    if (state.currentSlideIndex > 0) { state.currentSlideIndex--; showPresentationSlide(); }
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

        document.getElementById('export-editable-pptx-btn').addEventListener('click', () => {
            if (typeof window.exportToEditablePPTX === 'function') {
                window.exportToEditablePPTX(state.slides, document.getElementById('presentation-title').value);
            } else {
                addErrorMessage('Export module not loaded.');
            }
        });
    }

    let debounceTimer;
    let footerDebounceTimer;
    function debounceFooterLabel() {
        clearTimeout(footerDebounceTimer);
        footerDebounceTimer = setTimeout(applyFooterLabel, 600);
    }
    function debounceUpdateSlide(value) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.slides[state.currentSlideIndex] = value;
            saveSlides();
        }, 500);
    }

    function init() {
        loadSettings();
        loadSessions();
        loadLogo();
        if (state.sessions.length === 0) {
            createSession('Welcome Presentation');
        } else {
            if (!state.currentSessionId || !state.sessions.find(s => s.id === state.currentSessionId)) {
                state.currentSessionId = state.sessions[0].id;
            }
            var session = state.sessions.find(s => s.id === state.currentSessionId);
            if (session) {
                loadSessionIntoState(session);
            } else {
                createSession('Welcome Presentation');
            }
        }
        if (state.slides.length === 0) {
            state.slides = [DEFAULT_SLIDE_HTML];
            state.currentSlideIndex = 0;
        }
        state.sidebarOpen = localStorage.getItem('canvas_sidebar_open') !== 'false';
        document.getElementById('session-sidebar').classList.toggle('open', state.sidebarOpen);
        renderAll();
        renderSessionList();
        refreshModels();
        initEventListeners();
        setMode('generate');
        renderTemplateButtons();
        loadExternalTemplates();
        addSystemMessage('Welcome to Presentation Canvas! Select a model and describe your presentation, or choose a template.');
    }

    window.addEventListener('DOMContentLoaded', init);
})();