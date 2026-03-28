// ══════════════════════════════
//  SHARED
// ══════════════════════════════

let currentUser = null;

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    showToast("Enter credentials", "⚠️");
    return;
  }

  localStorage.setItem("user_" + username, password);
  localStorage.setItem("currentUser", username);

  currentUser = username;
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('user-display').innerText = "👤 " + username;

  loadSavedStories();
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

function checkLogin() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    currentUser = user;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('user-display').innerText = "👤 " + user;
    loadSavedStories();
  }
}
window.onload = () => {
  checkLogin();

  // Auto demo
  setTimeout(() => {
    setStory("Adani-Hindenburg crisis");
    runStoryArc();
  }, 800);
};

function switchTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
}

function showToast(msg, icon='ℹ️') {
  const t = document.getElementById('toast');
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

async function callClaude(system, userMsg, maxTokens=2000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userMsg }]
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'API error');
  const text = data.content?.[0]?.text || '';
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean);
}

// ══════════════════════════════
//  STORY ARC TRACKER
// ══════════════════════════════
function setStory(s) {
  document.getElementById('story-input').value = s;
}

async function runStoryArc() {
  const story = document.getElementById('story-input').value.trim();
  if (!story) { showToast('Please enter a business story topic', '⚠️'); return; }

  document.getElementById('arc-result').style.display = 'none';
  document.getElementById('arc-loading').style.display = 'block';
  document.getElementById('arc-btn').disabled = true;

  // Animate loading steps
  const steps = ['ls1','ls2','ls3','ls4','ls5'];
  const delays = [0, 800, 1600, 2400, 3200];
  steps.forEach((id, i) => {
    setTimeout(() => {
      document.getElementById(id).classList.add('done');
    }, delays[i]);
  });

  try {
    const system = `You are a business journalist AI for Economic Times India. Given a business story topic, return a detailed JSON analysis. Return ONLY valid JSON, no markdown.

Return this exact structure:
{
  "overview": "2-3 sentence overview of the story",
  "timeline": [
    {"date": "Month Year", "event": "What happened", "sentiment": "positive|negative|neutral"},
    ... (5-7 events)
  ],
  "players": [
    {"name": "Name", "role": "Their role", "stance": "bull|bear|neutral"},
    ... (4-6 players)
  ],
  "sentiment": [
    {"phase": "Phase name", "score": 75, "color": "positive|negative|neutral"},
    ... (4-5 phases)
  ],
  "contrarian": [
    {"title": "Contrarian point title", "text": "Explanation"},
    {"title": "Another angle", "text": "Explanation"}
  ],
  "watchNext": [
    {"icon": "📅", "title": "What to watch", "detail": "Explanation of why this matters"},
    ... (3-4 items)
  ]
}`;

    const result = await callClaude(system, `Analyse My Story: "${story}"`);

    // Render overview
    document.getElementById('story-overview').innerHTML = result.overview || '';

    // Render timeline
    const tlContainer = document.getElementById('timeline-container');
    tlContainer.innerHTML = (result.timeline || []).map(ev => `
      <div class="tl-event">
        <div class="tl-dot ${ev.sentiment === 'negative' ? 'neg' : ev.sentiment === 'neutral' ? 'neutral' : ''}"></div>
        <div class="tl-date">${ev.date}</div>
        <div class="tl-text">${ev.event}</div>
      </div>`).join('');

    // Render players
    const playersContainer = document.getElementById('players-container');
    playersContainer.innerHTML = (result.players || []).map(p => `
      <div class="player-card">
        <div class="player-name">${p.name}</div>
        <div class="player-role">${p.role}</div>
        <span class="player-tag ${p.stance}">${p.stance === 'bull' ? '↑ Bullish' : p.stance === 'bear' ? '↓ Bearish' : '→ Neutral'}</span>
      </div>`).join('');

    // Render sentiment
    const sentContainer = document.getElementById('sentiment-container');
    sentContainer.innerHTML = (result.sentiment || []).map(s => {
      const color = s.color === 'positive' ? '#10b981' : s.color === 'negative' ? '#ef4444' : '#f59e0b';
      return `
      <div class="sent-row">
        <div class="sent-label">${s.phase}</div>
        <div class="sent-bar-wrap">
          <div class="sent-bar" style="width:${s.score}%;background:${color};"></div>
        </div>
        <div class="sent-val">${s.score}%</div>
      </div>`;
    }).join('');

    // Render contrarian
    const contraContainer = document.getElementById('contrarian-container');
    contraContainer.innerHTML = (result.contrarian || []).map(c => `
      <div class="insight-box">
        <strong>${c.title}</strong>${c.text}
      </div>`).join('');

    // Render watch next
    const watchContainer = document.getElementById('watchnext-container');
    watchContainer.innerHTML = (result.watchNext || []).map(w => `
      <div class="watch-item">
        <span class="watch-icon">${w.icon}</span>
        <div class="watch-text"><strong>${w.title}</strong>${w.detail}</div>
      </div>`).join('');

    document.getElementById('arc-loading').style.display = 'none';
    document.getElementById('arc-result').style.display = 'block';
    showToast('Story arc built!', '✅');
    saveStory(story);

  } catch (e) {
    document.getElementById('arc-loading').style.display = 'none';
    showToast('Error: ' + e.message, '❌');
    console.error(e);
  }
  document.getElementById('arc-btn').disabled = false;
  // Reset loading steps
  steps.forEach(id => document.getElementById(id).classList.remove('done'));
}

// ══════════════════════════════
//  VERNACULAR ENGINE
// ══════════════════════════════
let selectedLang = 'hindi';
let selectedLangName = 'हिन्दी';

const sampleArticles = [
  `The Reserve Bank of India's Monetary Policy Committee cut the repo rate by 25 basis points to 6.25% on Friday, marking the first rate reduction in nearly five years. The decision, which was unanimous, signals a shift in the central bank's stance from 'withdrawal of accommodation' to 'neutral' as inflation eases closer to the 4% target. EMIs on home and auto loans are expected to drop in the coming weeks as banks transmit the rate cut.`,
  `Indian benchmark indices Sensex and Nifty 50 surged to record highs on Monday, driven by strong buying in financial and IT stocks. The Sensex jumped 1,200 points to breach the 75,000 mark for the first time, while Nifty 50 crossed 22,800. Foreign institutional investors pumped Rs 4,200 crore into Indian equities, the highest single-day inflow in three months, amid expectations of a US Fed rate pivot.`,
  `Indian startups raised just $8.1 billion in venture capital funding in 2023, a 72% drop from the $29 billion peak in 2021, as investors demanded profitability over growth. Late-stage funding has dried up, forcing unicorns like Byju's and Ola to restructure. However, early-stage deals remain active, with fintech, B2B SaaS, and climate tech attracting the most interest from investors.`,
  `The government is considering a major overhaul of the Goods and Services Tax structure, proposing to collapse the current four-slab system into a simpler two or three-tier model. The reform aims to reduce compliance burden for small businesses and boost consumption. The GST Council will meet next month to deliberate on rationalising rates on over 50 items, including insurance premiums and food processing products.`,
  `India's IT sector is bracing for continued headwinds in 2024 as major companies including TCS, Infosys, and Wipro signal muted revenue growth amid weak demand from the US and European markets. The industry added just 60,000 jobs last year compared to over 4 lakh in 2022. Fresh campus hiring has been deferred, and lateral hiring remains frozen as clients cut discretionary technology spending.`
];

function loadSample(idx) {
  document.getElementById('news-text').value = sampleArticles[idx];
}

function selectLang(lang, name, btn) {
  selectedLang = lang;
  selectedLangName = name;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

async function runTranslation() {
  const article = document.getElementById('news-text').value.trim();
  if (!article) { showToast('Please paste a news article', '⚠️'); return; }

  document.getElementById('trans-placeholder').style.display = 'none';
  document.getElementById('trans-loading').style.display = 'block';
  document.getElementById('trans-result').style.display = 'none';
  document.getElementById('trans-btn').disabled = true;
  document.getElementById('output-lang-title').textContent = `🌐 ${selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1)} Translation`;

  const langInstructions = {
    hindi: `Translate to Hindi (हिन्दी). Use simple, everyday Hindi that a middle-class reader in Delhi or Mumbai would understand. Use analogies from Indian daily life. For financial terms, use the Hindi term with English in brackets if needed.`,
    tamil: `Translate to Tamil (தமிழ்). Use clear, modern Tamil. Add context relevant to Tamil Nadu's business community — manufacturing, IT corridor, agriculture. Reference local institutions like Tamil Nadu government, Chennai stock exchange activity when relevant.`,
    telugu: `Translate to Telugu (తెలుగు). Use modern Telugu that readers in Hyderabad, Vijayawada and Visakhapatnam would relate to. Reference Telangana/AP economic context, local industries like pharma and IT where appropriate.`,
    bengali: `Translate to Bengali (বাংলা). Use standard Bengali. Add context relevant to Bengal — Kolkata business community, jute, manufacturing, startups. Reference West Bengal or Bangladesh economic context where relevant.`
  };

  try {
    const system = `You are a culturally intelligent translation engine for Economic Times. You do NOT do literal translation — you do cultural adaptation. Return ONLY valid JSON, no markdown.

Your job:
1. Translate the article to the target language naturally and fluently
2. Replace Western/generic analogies with India-specific local ones
3. Add a brief "cultural context" note in English explaining what local context you added and why
4. Make complex financial terms understandable to a general audience

Return this exact structure:
{
  "translation": "Full translated article text in the target language",
  "contextAdded": "2-3 sentences in English explaining what cultural context or local analogies you added to make it more relevant to this language's audience"
}`;

    const result = await callClaude(system,
      `${langInstructions[selectedLang]}\n\nArticle to translate:\n${article}`,
      1500
    );

    document.getElementById('trans-loading').style.display = 'none';
    document.getElementById('trans-tag').textContent = `${selectedLangName} · Culturally Adapted`;
    document.getElementById('trans-text').textContent = result.translation || '';
    document.getElementById('trans-context-text').textContent = result.contextAdded || '';
    document.getElementById('trans-result').style.display = 'block';
    document.getElementById('output-lang-badge').textContent = selectedLangName;
    showToast('Translated with cultural context!', '✅');

  } catch (e) {
    document.getElementById('trans-loading').style.display = 'none';
    document.getElementById('trans-placeholder').style.display = 'block';
    showToast('Error: ' + e.message, '❌');
    console.error(e);
  }
  document.getElementById('trans-btn').disabled = false;
}

function saveStory(story) {
  if (!currentUser) return;

  let stories = JSON.parse(localStorage.getItem(currentUser + "_stories") || "[]");

  if (!stories.includes(story)) {
    stories.unshift(story);
    localStorage.setItem(currentUser + "_stories", JSON.stringify(stories));
  }

  loadSavedStories();
}

function loadSavedStories() {
  const container = document.getElementById('saved-stories');
  if (!container) return;

  const stories = JSON.parse(localStorage.getItem(currentUser + "_stories") || "[]");

  container.innerHTML = stories.map(s => `
    <div class="chip" onclick="setStory('${s}')">${s}</div>
  `).join('');
}
// Enter key on story input
document.getElementById('story-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') runStoryArc();
});
