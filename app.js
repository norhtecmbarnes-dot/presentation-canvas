(function () {
    'use strict';

    const DEFAULT_SLIDE_HTML = `<!DOCTYPE html>
<html><head><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Segoe UI', sans-serif; background: #1a1a2e; color: #e0e0e0; }
.container { text-align: center; padding: 40px; }
h1 { font-size: 48px; margin-bottom: 16px; color: #ffffff; }
p { font-size: 24px; color: #a0a0b0; }
</style></head><body>
<div class="container"><h1>Canvas</h1><p>Describe your presentation in the chat panel to get started.</p></div>
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
        chatHistory: [],
        isGenerating: false,
        abortController: null,
        currentMode: 'generate',
        currentSessionId: null,
        sessions: [],
        sidebarOpen: false,
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
            slides: [DEFAULT_SLIDE_HTML],
            currentSlideIndex: 0,
            theme: 'dark',
            chatHistory: []
        };
        state.sessions.unshift(session);
        state.currentSessionId = id;
        state.chatHistory = [];
        state.uploadedImages = [];
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.innerHTML = '';
        saveSessions();
        loadSessionIntoState(session);
        addSlide(DEFAULT_SLIDE_HTML);
        state.currentSlideIndex = 0;
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

    function renderSessionList() {
        const container = document.getElementById('session-list');
        if (!container) return;
        container.innerHTML = '';
        state.sessions.forEach(session => {
            const item = document.createElement('div');
            item.className = 'session-item' + (session.id === state.currentSessionId ? ' active' : '');
            const date = new Date(session.updatedAt || session.createdAt);
            const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            item.innerHTML = `<div class="session-item-title">${escapeHtml(session.title || 'Untitled')}</div><div class="session-item-meta">${session.slides ? session.slides.length : 0} slides | ${timeStr}</div><button class="session-item-delete" data-id="${session.id}" title="Delete">&times;</button>`;
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('session-item-delete')) {
                    switchSession(session.id);
                }
            });
            container.appendChild(item);
        });
        container.querySelectorAll('.session-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSession(btn.dataset.id);
            });
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function loadSlides() {
        if (state.currentSessionId) {
            const session = state.sessions.find(s => s.id === state.currentSessionId);
            if (session && session.slides && session.slides.length > 0) {
                loadSessionIntoState(session);
                return true;
            }
        }
        return false;
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
            if (provider === 'ollama') return await sendToOllama(prompt, systemPrompt, model);
            else if (provider === 'openai') return await sendToOpenAI(prompt, systemPrompt, model);
            else if (provider === 'zhipu') return await sendToZhipu(prompt, systemPrompt, model);
            else if (provider === 'custom') return await sendToCustom(prompt, systemPrompt, model);
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
        const recentHistory = state.chatHistory.slice(-10);
        recentHistory.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                messages.push({ role: msg.role, content: msg.content });
            }
        });
        messages.push({ role: 'user', content: prompt });
        return messages;
    }

    async function sendToOllama(prompt, systemPrompt, model) {
        const response = await fetch(`${state.settings.ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, messages: buildMessages(systemPrompt, prompt), stream: false }),
            signal: state.abortController.signal
        });
        const data = await response.json();
        return data.message?.content || '';
    }

    async function sendToOpenAI(prompt, systemPrompt, model) {
        const response = await fetch(`${state.settings.openaiUrl}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.settings.openaiKey}` },
            body: JSON.stringify({ model, messages: buildMessages(systemPrompt, prompt), stream: false }),
            signal: state.abortController.signal
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }

    async function sendToZhipu(prompt, systemPrompt, model) {
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.settings.zhipuKey}` },
            body: JSON.stringify({ model, messages: buildMessages(systemPrompt, prompt), stream: false }),
            signal: state.abortController.signal
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }

    async function sendToCustom(prompt, systemPrompt, model) {
        const headers = { 'Content-Type': 'application/json' };
        if (state.settings.customKey) headers['Authorization'] = `Bearer ${state.settings.customKey}`;
        const response = await fetch(`${state.settings.customUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ model, messages: buildMessages(systemPrompt, prompt), stream: false }),
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
        context += '\nTo embed an uploaded image in a slide, use an <img> tag with the src starting with "data:image/..." and include the full base64 data.';
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
1. Plan the presentation by outlining slide titles and key points.
2. Then generate each slide as a complete HTML document.
3. Output each slide wrapped in <<<SLIDE>>> at the start and <<<END_SLIDE>>> at the end.
4. You may include brief commentary between slides explaining your design choices.`;
        } else if (mode === 'markdown') {
            return basePrompt + `\n\nYou are in MARKDOWN mode. Generate slide content using markdown with ---SLIDE--- separators:

---SLIDE---
# Title
Content here
---SLIDE---

Then also generate the complete HTML for each slide wrapped in <<<SLIDE>>> and <<<END_SLIDE>>> markers.`;
        } else {
            return basePrompt + `\n\nYou are in SLIDES mode. Generate complete slide HTML documents directly.
Output each slide wrapped in <<<SLIDE>>> at the start and <<<END_SLIDE>>> at the end.`;
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
                    addChatMessage('assistant', `Generated ${parsedSlides.length} slide(s). Switch to Edit mode to make changes.`);
                } else {
                    addChatMessage('assistant', 'Could not parse slides from the response. Try rephrasing or using a different generation mode.');
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
            addErrorMessage('No slides to edit. Generate slides first or switch to Generate mode.');
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
            const editPrompt = `Here is the current slide HTML (slide ${state.currentSlideIndex + 1} of ${state.slides.length}):\n\n${currentSlide}\n\nUser request: ${prompt}\n\nPlease return the modified slide HTML wrapped in <<<SLIDE>>> and <<<END_SLIDE>>> markers.`;

            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'chat-msg assistant';
            loadingMsg.innerHTML = '<span class="loading-dots">Editing slide</span>';
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
                    addChatMessage('assistant', 'Could not parse the edited slide. Try being more specific.');
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

        if (state.currentMode === 'generate') {
            handleGenerate();
        } else {
            handleEdit();
        }
    }

    function applyThemeToSlide(slideHtml, theme) {
        return slideHtml;
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

        if (sourceType === 'template-json' || sourceType === 'auto') {
            try {
                const data = JSON.parse(content);
                if (data.slides && Array.isArray(data.slides)) {
                    newSlides = data.slides;
                    if (data.theme) state.currentTheme = data.theme;
                }
            } catch (e) {
                if (sourceType === 'template-json') {
                    addErrorMessage('Invalid template JSON file.');
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
            addErrorMessage('Could not parse any slides from the imported content.');
            return;
        }

        if (replaceAll) {
            state.slides = newSlides;
        } else {
            state.slides = state.slides.concat(newSlides);
        }

        state.currentSlideIndex = 0;
        saveSlides();
        renderAll();
        addSystemMessage(`Imported ${newSlides.length} slide(s).`);
    }

    function handleExportTemplate() {
        const title = document.getElementById('presentation-title').value || 'My Template';
        const template = {
            name: title,
            description: `Exported from Canvas on ${new Date().toLocaleDateString()}`,
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
        });

        document.getElementById('new-session-btn').addEventListener('click', () => {
            saveCurrentSession();
            createSession('New Presentation');
            addSystemMessage('Started a new presentation session.');
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
            state.currentTheme = e.target.value;
            saveSlides();
            renderAll();
        });

        document.getElementById('layout-select').addEventListener('change', (e) => {
            if (state.slides.length === 0) return;
            const layout = e.target.value;
            if (!layout) return;
            const theme = SLIDE_THEMES[state.currentTheme];
            const layouts = {
                'title': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};}.container{text-align:center;padding:60px;}h1{font-size:56px;margin-bottom:16px;color:${theme.h1Color};}p{font-size:24px;color:${theme.color};opacity:0.8;}</style></head><body><div class="container"><h1>Title Here</h1><p>Subtitle goes here</p></div></body></html>`,
                'title-content': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};padding:60px;}.title{font-size:36px;margin-bottom:30px;color:${theme.h2Color};border-bottom:3px solid ${theme.accent};padding-bottom:10px;display:inline-block;}.content{font-size:20px;line-height:1.8;}</style></head><body><div class="title">Slide Title</div><div class="content"><p>Content goes here</p></div></body></html>`,
                'two-column': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};padding:60px;}.title{font-size:36px;margin-bottom:30px;color:${theme.h2Color};}.columns{display:flex;gap:40px;}.column{flex:1;}.column h3{color:${theme.accent};margin-bottom:12px;}.column p{font-size:18px;line-height:1.6;}</style></head><body><div class="title">Two Column Slide</div><div class="columns"><div class="column"><h3>Left Column</h3><p>Content here</p></div><div class="column"><h3>Right Column</h3><p>Content here</p></div></div></body></html>`,
                'image-left': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};}.image-side{width:40%;background:#333;display:flex;align-items:center;justify-content:center;}.content-side{flex:1;padding:60px;display:flex;flex-direction:column;justify-content:center;}.content-side h2{font-size:36px;margin-bottom:20px;color:${theme.h2Color};}.content-side p{font-size:20px;line-height:1.8;}</style></head><body><div class="image-side"><p style="color:#aaa;text-align:center;">Image</p></div><div class="content-side"><h2>Slide Title</h2><p>Content goes here</p></div></body></html>`,
                'image-right': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{display:flex;min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};}.content-side{flex:1;padding:60px;display:flex;flex-direction:column;justify-content:center;}.content-side h2{font-size:36px;margin-bottom:20px;color:${theme.h2Color};}.content-side p{font-size:20px;line-height:1.8;}.image-side{width:40%;background:#333;display:flex;align-items:center;justify-content:center;}</style></head><body><div class="content-side"><h2>Slide Title</h2><p>Content goes here</p></div><div class="image-side"><p style="color:#aaa;text-align:center;">Image</p></div></body></html>`,
                'full-image': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:#333;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;}.overlay{padding:40px;z-index:1;}.overlay h1{font-size:48px;margin-bottom:16px;}.overlay p{font-size:24px;opacity:0.9;}</style></head><body><div class="overlay"><h1>Full Image Slide</h1><p>Add an image behind this overlay</p></div></body></html>`,
                'blank': `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;font-family:'Segoe UI',sans-serif;background:${theme.background};color:${theme.color};display:flex;align-items:center;justify-content:center;}</style></head><body><div style="padding:60px;text-align:center;"><h2 style="color:${theme.h2Color};font-size:32px;">Blank Slide</h2><p style="font-size:20px;margin-top:20px;">Add your content here</p></div></body></html>`
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
    }

    let debounceTimer;
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
        if (state.sessions.length === 0) {
            createSession('Welcome Presentation');
        } else {
            if (!state.currentSessionId || !state.sessions.find(s => s.id === state.currentSessionId)) {
                state.currentSessionId = state.sessions[0].id;
            }
            const session = state.sessions.find(s => s.id === state.currentSessionId);
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
        renderAll();
        renderSessionList();
        refreshModels();
        initEventListeners();
        setMode('generate');
        renderTemplateButtons();
        loadExternalTemplates();
        addSystemMessage('Welcome to Canvas! Select a model and describe your presentation, or choose a template.');
    }

    window.addEventListener('DOMContentLoaded', init);
})();