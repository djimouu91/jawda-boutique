// ═══════════════════════════════════════════
// JAWDA ADSPILOT — app.js
// ═══════════════════════════════════════════

// ── STATE ─────────────────────────────────
let state = {
  products: [],    // evaluated + validated products
  campaigns: [],   // ad campaigns
  orders: [],      // customer orders
  evalHistory: []  // product evaluations
};

// ── LOAD / SAVE ───────────────────────────
function save() {
  localStorage.setItem('jawda_adspilot', JSON.stringify(state));
}
function load() {
  const raw = localStorage.getItem('jawda_adspilot');
  if (raw) {
    const parsed = JSON.parse(raw);
    state = { ...state, ...parsed };
  }
  // Seed with WinFinder data from last research session
  if (!state.products.length) seedWinFinder();
}

// ── SEED WINFINDER (from 2026-05-21 research) ──
function seedWinFinder() {
  state.products = [
    { id: 'wf1', name: 'VLift Invisible Lifting Tape', niche: 'beauty', costMin: 1.20, costMax: 2.00, price: 29, score: 175, timing: 'URGENT — 2 sem', signal: '$39,585/mois GMV US', leadMarket: '🇺🇸 US → CA', hook: 'POV: you finally found the tape that actually lifts without surgery', terme1688: '隐形提拉胶带女', verdict: null, validated: false, source: 'Pipiads' },
    { id: 'wf2', name: 'Seamless Sculpting Bodysuit', niche: 'clothing', costMin: 8.00, costMax: 12.00, price: 58, score: 170, timing: 'URGENT — 3 sem', signal: 'YIANNA $4.7M GMV Q1 2026 TikTok US', leadMarket: '🇺🇸 US → CA', hook: 'POV: you finally found the bodysuit that actually sculpts', terme1688: '无缝收腹连体衣女', verdict: null, validated: false, source: 'Pipiads' },
    { id: 'wf3', name: 'Lace Trim Bodysuit', niche: 'clothing', costMin: 5.50, costMax: 8.00, price: 44, score: 165, timing: 'URGENT — 3 sem', signal: 'Google Trends all-time high "lace trim top"', leadMarket: '🇺🇸 US → CA', hook: 'This lace bodysuit had me looking like a Paris editorial in 2 seconds', terme1688: '蕾丝吊带背心女夏内搭', verdict: null, validated: false, source: 'Pipiads' },
    { id: 'wf4', name: 'Gold Butterfly Hair Clips 6pc', niche: 'accessories', costMin: 1.50, costMax: 3.00, price: 28, score: 167, timing: '2-3 sem', signal: 'Google Trends all-time high "butterfly hair clips"', leadMarket: '🇺🇸 US → CA', hook: 'Why are Canadian girls obsessed with these butterfly clips?', terme1688: '蝴蝶发夹女金色套装', verdict: null, validated: false, source: 'WebSearch' },
    { id: 'wf5', name: 'Statement Bold Hoop Earrings', niche: 'accessories', costMin: 1.80, costMax: 3.50, price: 32, score: 164, timing: '3-4 sem', signal: 'WhoWhatWear Top Trend Summer 2026', leadMarket: '🇬🇧 UK → CA', hook: 'Outfits look completely different with these statement hoops', terme1688: '夸张大圆圈耳环女简约', verdict: null, validated: false, source: 'WebSearch' },
    { id: 'wf6', name: 'Korean Collagen Firming Serum', niche: 'beauty', costMin: 6.00, costMax: 9.00, price: 42, score: 161, timing: '3-4 sem', signal: 'TikTok Shop Beauty CA rising Q2 2026', leadMarket: '🇺🇸 US → CA', hook: '97% of women don\'t know this Korean serum exists in Canada', terme1688: '胶原蛋白紧致精华液女', verdict: null, validated: false, source: 'Pipiads' },
    { id: 'wf7', name: 'French Pin Pearl Hair Comb', niche: 'accessories', costMin: 1.20, costMax: 2.50, price: 24, score: 162, timing: '3-4 sem', signal: 'Google Trends all-time high "french pin"', leadMarket: '🇫🇷 FR → CA', hook: 'The French girl hair secret that costs $3 in Paris and $0.01 to copy', terme1688: '珍珠法式发插发梳', verdict: null, validated: false, source: 'WebSearch' },
    { id: 'wf8', name: 'Knit Longline Maxi Dress', niche: 'clothing', costMin: 11.00, costMax: 15.00, price: 72, score: 163, timing: '4-5 sem', signal: 'TikTok "knit maxi dress" 890M views', leadMarket: '🇺🇸 US → CA', hook: 'This $12 knit dress looks like a $200 Toteme from Holt Renfrew', terme1688: '针织长款连衣裙女夏', verdict: null, validated: false, source: 'Pipiads' },
    { id: 'wf9', name: 'Printed Silk Scarf', niche: 'accessories', costMin: 3.50, costMax: 5.00, price: 34, score: 160, timing: '4-5 sem', signal: 'WhoWhatWear Summer 2026 must-have', leadMarket: '🇺🇸 US → CA', hook: 'How I style my $4 silk scarf 6 different ways for summer', terme1688: '印花真丝方巾女夏', verdict: null, validated: false, source: 'WebSearch' },
    { id: 'wf10', name: 'Plus-Size Knit Wrap Dress', niche: 'clothing', costMin: 12.00, costMax: 16.00, price: 66, score: 158, timing: '5-6 sem', signal: 'Body-positive trend TikTok US Q2 2026', leadMarket: '🇺🇸 US → CA', hook: 'Finally a wrap dress that actually works for every body type', terme1688: '针织连衣裙大码女夏包臀', verdict: null, validated: false, source: 'WebSearch' }
  ];
  save();
}

// ── NAVIGATION ─────────────────────────────
function showPage(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    analyze: 'Analyse Produit & Création Ads',
    evaluate: 'Évaluer un Produit',
    winfinder: 'WinFinder — Produits Winners',
    campaigns: 'Campagnes Publicitaires',
    products: 'Produits Validés',
    orders: 'Commandes'
  };
  document.getElementById('pageTitle').textContent = titles[name] || name;

  if (name === 'dashboard') refreshDashboard();
  if (name === 'winfinder') renderWinFinder();
  if (name === 'campaigns') renderCampaigns();
  if (name === 'products') renderValidated();
  if (name === 'orders') renderOrders();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ── SCORE ENGINE ───────────────────────────
function getSliderVal(id) { return parseInt(document.getElementById(id).value); }

// ══════════════════════════════════════════
// ANALYSE & ADS ENGINE
// ══════════════════════════════════════════

let selectedAngle = null;
let currentAnalysis = {};

function goStep(n) {
  if (n === 2 && !document.getElementById('a-name').value.trim()) { showToast('⚠️ Entre le nom du produit d\'abord'); return; }
  if (n === 3) buildAngles();
  if (n === 4) { if (!selectedAngle && selectedAngle !== 0) { showToast('⚠️ Choisis un angle marketing d\'abord'); return; } buildAdCopy(); }
  document.querySelectorAll('.ana-step').forEach(s => s.style.display = 'none');
  document.getElementById('ana-step-' + n).style.display = 'block';
  document.querySelectorAll('.step').forEach((s, i) => { s.classList.remove('active','done'); if (i+1 < n) s.classList.add('done'); if (i+1 === n) s.classList.add('active'); });
}

function collectProductData() {
  const lifestyles = Array.from(document.querySelectorAll('#lifestyle-grid input:checked')).map(c => c.value);
  currentAnalysis = {
    name: document.getElementById('a-name').value.trim(),
    niche: document.getElementById('a-niche').value,
    what: document.getElementById('a-what').value.trim(),
    problem: document.getElementById('a-problem').value.trim(),
    wow: document.getElementById('a-wow').value.trim(),
    price: parseFloat(document.getElementById('a-price').value) || 0,
    market: document.getElementById('a-market').value,
    comp: document.getElementById('a-comp').value.trim(),
    age: document.getElementById('a-age').value,
    gender: document.getElementById('a-gender').value,
    lifestyles,
    pain: document.getElementById('a-pain').value,
    when: document.getElementById('a-when').value.trim(),
    interests: document.getElementById('a-interests').value.trim(),
  };
  return currentAnalysis;
}

const ANGLE_TEMPLATES = [
  { type:'PAS — Problème-Agitation-Solution', emoji:'🔥', power:92, bestFor:'Facebook Feed · Reels · TikTok',
    titleFn:(d)=>`"J'ai souffert de ce problème pendant des années…"`,
    descFn:(d)=>`Démarre sur la douleur liée à "${d.problem||d.what||'ce problème'}". On agite la frustration, puis le produit arrive comme la solution parfaite. L'angle le plus efficace pour les femmes 25-44 ans.`,
    hookFn:(d)=>`POV : tu trouves enfin le produit qui règle ${d.problem?d.problem.substring(0,55):'ce problème que personne ne comprend'}…` },
  { type:'IDENTITÉ — "Pour les femmes qui…"', emoji:'👑', power:88, bestFor:'TikTok · Instagram Reels · Stories',
    titleFn:(d)=>`Pour les femmes qui refusent de se laisser freiner`,
    descFn:(d)=>`Cet angle vend une identité, pas un produit. Ta cliente se reconnaît immédiatement. Très fort sur TikTok et chez les 25-35 ans.`,
    hookFn:(d)=>`If you're the type of woman who refuses to compromise on confidence — this one's for you.` },
  { type:'SOCIAL PROOF — "Des milliers de femmes…"', emoji:'⭐', power:85, bestFor:'Facebook Feed · Email · Google',
    titleFn:(d)=>`"Des milliers de Canadiennes l'ont déjà adopté"`,
    descFn:(d)=>`La preuve sociale massive comme déclencheur. Les chiffres réels créent la FOMO. Idéal si tu as déjà des ventes ou des données Pipiads.`,
    hookFn:(d)=>`Why are thousands of Canadian women buying ${d.name||'this product'} right now?` },
  { type:'BEFORE / AFTER — Transformation visible', emoji:'✨', power:90, bestFor:'TikTok Shop · Reels · Stories',
    titleFn:(d)=>`La transformation en 10 secondes`,
    descFn:(d)=>`${d.wow||'Le résultat est visible instantanément'}. Montre le avant/après de façon dramatique. L'image dit tout. L'angle le plus viral sur TikTok.`,
    hookFn:(d)=>`Watch what happens in 10 seconds ✨ [show ${d.name||'product'} transformation]` },
  { type:'FOMO URGENCE — Stock / Offre limitée', emoji:'⏰', power:78, bestFor:'Retargeting · Email · Stories',
    titleFn:(d)=>`L'offre que tu regretteras de rater`,
    descFn:(d)=>`Urgence temporelle ou de stock. Fonctionne très bien en retargeting — pour les personnes qui ont déjà vu le produit.`,
    hookFn:(d)=>`⚠️ Free shipping Canada ends this weekend — don't miss out on ${d.name||'this'}` },
  { type:'UGC / AUTHENTIQUE — Style "J\'ai découvert…"', emoji:'📱', power:87, bestFor:'TikTok · Reels · Budget test',
    titleFn:(d)=>`"J'aurais voulu découvrir ça plus tôt"`,
    descFn:(d)=>`Style vidéo authentique filmée à la maison. Pas de production. Le registre conversationnel désarme la méfiance et booste le taux de complétion. Parfait pour un premier test à petit budget.`,
    hookFn:(d)=>`I was today years old when I found this and I'm honestly upset nobody told me sooner` },
];

function buildAngles() {
  const d = collectProductData();
  selectedAngle = null;
  document.getElementById('btn-gen-copy').textContent = 'Générer Ad Copy pour l\'angle choisi →';
  const grid = document.getElementById('angles-grid');
  grid.innerHTML = ANGLE_TEMPLATES.map((tpl, i) => `
    <div class="angle-card" onclick="selectAngle(${i})" id="angle-card-${i}">
      <div class="angle-selected-check">✓</div>
      <div class="angle-type">${tpl.emoji} ${tpl.type}</div>
      <div class="angle-title">${tpl.titleFn(d)}</div>
      <div class="angle-desc">${tpl.descFn(d)}</div>
      <div class="angle-hook">"${tpl.hookFn(d)}"</div>
      <div class="angle-power"><span>Puissance</span><div class="power-bar"><div class="power-fill" style="width:${tpl.power}%"></div></div><span style="font-weight:700;color:var(--accent)">${tpl.power}/100</span></div>
      <div style="margin-top:8px;font-size:11px;color:var(--text-muted)">✓ ${tpl.bestFor}</div>
    </div>`).join('');
}

function selectAngle(i) {
  selectedAngle = i;
  document.querySelectorAll('.angle-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('angle-card-' + i).classList.add('selected');
  document.getElementById('btn-gen-copy').textContent = `Générer Ad Copy "${ANGLE_TEMPLATES[i].emoji} ${ANGLE_TEMPLATES[i].type}" →`;
}

function buildAdCopy() {
  const d = currentAnalysis;
  const tpl = ANGLE_TEMPLATES[selectedAngle];
  const hook = tpl.hookFn(d);
  const name = d.name || 'ce produit';
  const price = d.price ? `CA$${d.price}` : '';
  const copies = [
    { label:'PAS Court — Test initial',
      text:`${hook}\n\nLes femmes qui ont essayé ${name} nous disent la même chose :\n"Pourquoi je n'ai pas trouvé ça plus tôt ?"\n\n✅ ${d.wow||'Résultat immédiat'}\n✅ Simple à utiliser\n✅ Livraison gratuite Canada dès CA$65\n\n🇨🇦 En stock — Expédié au Canada\n👉 Commander maintenant → jawda.ca` },
    { label:'Storytelling — Mid-funnel',
      text:`Tu connais ce sentiment de ${d.problem||'ne pas avoir la solution parfaite'}?\n\nJe l'ai vécu aussi.\n\nJusqu'à ce que je découvre ${name}.\n\n${d.what||'Ce produit change tout.'}\n\n${d.wow||'Le résultat parle de lui-même'}.\n\nDes milliers de femmes canadiennes l'ont déjà adopté.\n\n🚚 Livraison gratuite Canada | ✅ Retours 30 jours\n👉 Voir ${name} sur jawda.ca →` },
    { label:'Social Proof + Urgence — Retargeting',
      text:`⭐⭐⭐⭐⭐ "Meilleur achat de l'année" — Marie, Ottawa\n\n${name} — le produit dont tout le monde parle.\n\n❌ Avant : ${d.problem||'Le problème persiste'}\n✅ Après : ${d.wow||'Résultat immédiat'}\n\n${price ? 'Prix : '+price : ''}\n🎁 Livraison gratuite dès CA$65\n⚠️ Stock limité\n\n→ jawda.ca` }
  ];
  const script = [
    { time:'[0–3s]',   action:'HOOK visuel',     text:`${hook} — Gros plan produit en main.` },
    { time:'[3–8s]',   action:'Le problème',     text:`Montre rapidement ${d.problem||'le problème'}. Pas de discours — contexte en image.` },
    { time:'[8–15s]',  action:'La démo',         text:`Utilisation du produit. ${d.wow||'Transformation visible.'}` },
    { time:'[15–22s]', action:'Le résultat',     text:`Réaction authentique. Laisse les expressions parler.` },
    { time:'[22–27s]', action:'Preuve sociale',  text:`"Des milliers de femmes canadiennes l'ont déjà commandé — lien dans la bio."` },
    { time:'[27–30s]', action:'CTA',             text:`"Lien dans la bio 🔗 | Livraison gratuite Canada | Stock limité ⚠️"` },
  ];
  const nicheInt = { beauty:['Sephora','L\'Oréal','skincare','beauty tips'], clothing:['ZARA','H&M','SHEIN','Fashion Nova'], accessories:['jewelry','fashion blogger','Pinterest fashion','accessories'], fitness:['Lululemon','yoga','fitness','activewear'], home:['home decor','IKEA','interior design'], tech:['Amazon','gadgets','tech deals'] };
  const interests = [...(nicheInt[d.niche]||[]), ...(d.interests?d.interests.split(',').map(s=>s.trim()).slice(0,3):[])];
  const price2 = d.price || 30;
  const cpaT = Math.round(price2 * 0.35);
  const killR = Math.round(price2 * 0.55);
  const budget = [
    { label:'💵 Budget test total (3 jours)', val:'CA$135' },
    { label:'📊 Structure', val:'3 Ad Sets × CA$15/j × 3 jours' },
    { label:'🎯 CPA cible', val:`CA$${cpaT}` },
    { label:'⚠️ Kill Rule', val:`CPA > CA$${killR} → couper` },
    { label:'📈 ROAS minimum', val:`${(price2/cpaT).toFixed(1)}x` },
    { label:'🚀 Si ROAS > 3x → scaler', val:'CA$50/j sur l\'ad set gagnant' },
  ];

  document.getElementById('adcopy-output').className = 'adcopy-output';
  document.getElementById('adcopy-output').innerHTML = `
    <div class="copy-section">
      <div class="copy-section-header"><h4>${tpl.emoji} Angle : ${tpl.type} — Puissance ${tpl.power}/100</h4></div>
      <div class="copy-body"><div style="font-size:14px;font-style:italic;color:var(--accent)">"${hook}"</div><div style="font-size:12px;color:var(--text-muted);margin-top:6px">✓ ${tpl.bestFor}</div></div>
    </div>
    <div class="copy-section">
      <div class="copy-section-header"><h4>📝 3 Variantes Ad Copy Facebook / Instagram</h4></div>
      <div class="copy-body">${copies.map((c,i)=>`<div class="copy-variant"><button class="btn-copy-text" onclick="copyText('copy-${i}')">Copier</button><div class="copy-variant-label">Variante ${i+1} — ${c.label}</div><div class="copy-text" id="copy-${i}">${c.text}</div></div>`).join('')}</div>
    </div>
    <div class="copy-section">
      <div class="copy-section-header"><h4>🎬 Script TikTok / Reels (30 secondes)</h4><button class="btn-copy-text" onclick="copyText('tt-script')">Copier</button></div>
      <div class="copy-body"><div id="tt-script">${script.map(l=>`<div class="script-line"><span class="script-time">${l.time}</span><span class="script-action">${l.action}</span><span class="script-text">${l.text}</span></div>`).join('')}</div></div>
    </div>
    <div class="copy-section">
      <div class="copy-section-header"><h4>🎯 Ciblage Facebook / TikTok</h4></div>
      <div class="copy-body">
        <div class="targeting-grid">
          <div class="targeting-item"><h5>Âge & Genre</h5><div class="targeting-tags"><span class="targeting-tag">${d.gender==='women'?'Femmes':'Tous'} ${d.age}</span><span class="targeting-tag">🇨🇦 ${d.market==='canada-fr'?'Québec FR':'Canada'}</span></div></div>
          <div class="targeting-item"><h5>Intérêts</h5><div class="targeting-tags">${interests.slice(0,6).map(t=>`<span class="targeting-tag">${t}</span>`).join('')}</div></div>
          <div class="targeting-item"><h5>Comportements</h5><div class="targeting-tags"><span class="targeting-tag">Online shoppers</span><span class="targeting-tag">Engaged shoppers</span><span class="targeting-tag">Returning customers</span></div></div>
          <div class="targeting-item"><h5>Exclusions</h5><div class="targeting-tags"><span class="targeting-tag" style="background:rgba(239,68,68,.1);color:#ff6b6b">Déjà acheteurs</span><span class="targeting-tag" style="background:rgba(239,68,68,.1);color:#ff6b6b">Moins de 18 ans</span></div></div>
        </div>
        <div style="margin-top:14px;background:var(--bg3);border-radius:8px;padding:12px 14px;font-size:13px;line-height:1.8">
          <strong>Structure :</strong> 3 Ad Sets × CA$15/j × 3 jours<br>
          • Ad Set 1 : Intérêts larges (${interests[0]||'niche'} + ${interests[1]||'lifestyle'})<br>
          • Ad Set 2 : Lookalike 1% (visiteurs site 90j)<br>
          • Ad Set 3 : Retargeting (vus produit, pas acheté)
        </div>
      </div>
    </div>
    <div class="copy-section">
      <div class="copy-section-header"><h4>💰 Budget test</h4></div>
      <div class="copy-body"><table class="budget-table">${budget.map(r=>`<tr><td>${r.label}</td><td>${r.val}</td></tr>`).join('')}</table></div>
    </div>
    <button class="btn-primary" style="width:100%;margin-top:4px" onclick="saveAnalysis()">💾 Sauvegarder dans WinFinder</button>`;
}

function copyText(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText||el.textContent).then(()=>showToast('Copié ✅'));
}

function saveAnalysis() {
  const d = currentAnalysis;
  if (!d.name) return;
  const exists = state.products.find(p => p.name.toLowerCase() === d.name.toLowerCase());
  if (!exists) {
    state.products.push({ id:'an'+Date.now(), name:d.name, niche:d.niche, price:d.price, costMin:0, costMax:0, score:0, timing:'', signal:'', leadMarket:'', hook:ANGLE_TEMPLATES[selectedAngle].hookFn(d), validated:false, source:'Analyse Ads', terme1688:'', verdict:null });
    save(); showToast(`"${d.name}" sauvegardé dans WinFinder ✅`);
  } else { showToast('Produit déjà dans le WinFinder'); }
}

// ── SCORE ENGINE ───────────────────────────
function updateScore() {
  const wow   = getSliderVal('s-wow');
  const prob  = getSliderVal('s-prob');
  const ca    = getSliderVal('s-ca');
  const sat   = getSliderVal('s-sat');
  const saison= getSliderVal('s-saison');
  const logi  = getSliderVal('s-logi');
  const legal = getSliderVal('s-legal');

  document.getElementById('v-wow').textContent   = wow   + '/10';
  document.getElementById('v-prob').textContent  = prob  + '/10';
  document.getElementById('v-ca').textContent    = ca    + '/10';
  document.getElementById('v-sat').textContent   = sat   + '/10';
  document.getElementById('v-saison').textContent= saison+ '/10';
  document.getElementById('v-logi').textContent  = logi  + '/10';
  document.getElementById('v-legal').textContent = legal + '/10';

  // Marge score from price/cost
  const cost  = parseFloat(document.getElementById('e-cost').value)  || 0;
  const price = parseFloat(document.getElementById('e-price').value) || 0;
  let margeScore = 5;
  if (cost > 0 && price > 0) {
    const ratio = price / cost;
    if (ratio >= 4) margeScore = 10;
    else if (ratio >= 3) margeScore = 8;
    else if (ratio >= 2.5) margeScore = 6;
    else if (ratio >= 2) margeScore = 4;
    else margeScore = 2;
  }

  const total = (wow * 3) + (prob * 3) + (margeScore * 3) + (ca * 2) + (sat * 2) + (saison * 1) + (logi * 2) + (legal * 2);

  // Update circle
  const pct = (total / 180) * 100;
  const circle = document.getElementById('score-circle');
  circle.style.setProperty('--pct', pct);
  document.getElementById('score-number').textContent = total;

  // Verdict
  const verdictEl = document.getElementById('score-verdict');
  if (total >= 160) {
    verdictEl.textContent = '🔥 MUST TEST';
    verdictEl.style.background = 'rgba(239,68,68,.15)';
    verdictEl.style.color = '#ff6b6b';
  } else if (total >= 150) {
    verdictEl.textContent = '✅ TEST';
    verdictEl.style.background = 'rgba(34,197,94,.15)';
    verdictEl.style.color = '#22c55e';
  } else if (total >= 140) {
    verdictEl.textContent = '⚡ À VALIDER';
    verdictEl.style.background = 'rgba(245,158,11,.15)';
    verdictEl.style.color = '#f59e0b';
  } else {
    verdictEl.textContent = '⏭ PASSER';
    verdictEl.style.background = 'rgba(123,131,160,.1)';
    verdictEl.style.color = '#7b83a0';
  }

  // Breakdown
  document.getElementById('b-wow').textContent   = (wow * 3)    + '/30';
  document.getElementById('b-prob').textContent  = (prob * 3)   + '/30';
  document.getElementById('b-marge').textContent = (margeScore * 3) + '/30';
  document.getElementById('b-ca').textContent    = (ca * 2)     + '/20';
  document.getElementById('b-sat').textContent   = (sat * 2)    + '/20';
  document.getElementById('b-saison').textContent= saison        + '/10';
  document.getElementById('b-logi').textContent  = (logi * 2)   + '/20';
  document.getElementById('b-legal').textContent = (legal * 2)  + '/20';

  // Financial
  updateFinancial(cost, price);

  return total;
}

function updateFinancial(cost, price) {
  const fin = document.getElementById('fin-analysis');
  if (!cost || !price) {
    fin.innerHTML = '<p style="color:var(--text-muted);font-size:13px">Entre un coût et un prix de vente pour voir la marge.</p>';
    return;
  }
  const gross = price - cost;
  const grossPct = ((gross / price) * 100).toFixed(0);
  const adsCost = price * 0.30;
  const netProfit = gross - adsCost;
  const netPct = ((netProfit / price) * 100).toFixed(0);
  const roas = (price / adsCost).toFixed(1);
  const isGoodMarge = parseFloat(grossPct) >= 70;
  const isGoodNet = netProfit > 0;

  fin.innerHTML = `
    <div class="fin-row"><span>Coût 1688</span><span>CA$${cost.toFixed(2)}</span></div>
    <div class="fin-row"><span>Prix vente JAWDA</span><span>CA$${price.toFixed(2)}</span></div>
    <div class="fin-row ${isGoodMarge ? 'highlight' : ''}"><span>Marge brute</span><span>${grossPct}%</span></div>
    <div class="fin-row"><span>Budget pub (30%)</span><span>- CA$${adsCost.toFixed(2)}</span></div>
    <div class="fin-row ${isGoodNet ? 'highlight' : 'highlight bad'}"><span>Profit net/vente</span><span>CA$${netProfit.toFixed(2)} (${netPct}%)</span></div>
    <div class="fin-row"><span>ROAS minimum</span><span>${roas}x</span></div>
  `;
}

// ── EVALUATE PRODUCT ──────────────────────
function evaluerProduit(e) {
  e.preventDefault();
  const score = updateScore();
  const name  = document.getElementById('e-name').value.trim();
  const niche = document.getElementById('e-niche').value;
  const market= document.getElementById('e-market').value;
  const cost  = parseFloat(document.getElementById('e-cost').value) || 0;
  const price = parseFloat(document.getElementById('e-price').value) || 0;
  const signal= document.getElementById('e-signal').value.trim();
  const hook  = document.getElementById('e-hook').value.trim();

  // Verdict
  let verdict = 'passer';
  if (score >= 160) verdict = 'must';
  else if (score >= 150) verdict = 'test';
  else if (score >= 140) verdict = 'validate';

  const entry = {
    id: 'ev' + Date.now(),
    name, niche, leadMarket: market,
    costMin: cost, costMax: cost,
    price, score, timing: '',
    signal, hook, verdict,
    validated: false,
    source: 'Évaluation manuelle',
    date: new Date().toLocaleDateString('fr-CA')
  };

  // Push to products if worth testing
  if (score >= 140) {
    const exists = state.products.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!exists) {
      state.products.push(entry);
    }
    showToast(`"${name}" ajouté au WinFinder (${score}/180)`);
  } else {
    showToast(`Score ${score}/180 — produit passé`);
  }

  // History
  state.evalHistory.unshift({ id: entry.id, name, score, verdict, date: entry.date });
  if (state.evalHistory.length > 20) state.evalHistory.pop();

  addActivity('blue', `Produit évalué : ${name} — ${score}/180`);
  save();
  renderEvalHistory();
}

function renderEvalHistory() {
  const el = document.getElementById('eval-history');
  if (!state.evalHistory.length) {
    el.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:8px 0">Aucune évaluation encore.</p>';
    return;
  }
  el.innerHTML = state.evalHistory.map(h => {
    const color = h.score >= 160 ? '#ff6b6b' : h.score >= 150 ? '#22c55e' : h.score >= 140 ? '#f59e0b' : '#7b83a0';
    return `<div class="eval-hist-item">
      <span class="eval-hist-name">${h.name}</span>
      <span class="eval-hist-score" style="color:${color}">${h.score}/180</span>
      <span style="font-size:11px;color:var(--text-muted)">${h.date}</span>
    </div>`;
  }).join('');
}

// ── WINFINDER ──────────────────────────────
function renderWinFinder(list) {
  const grid = document.getElementById('wf-grid');
  const items = list || state.products;
  if (!items.length) {
    grid.innerHTML = `<div class="empty-state full" style="grid-column:1/-1">
      <p>Aucun produit dans le WinFinder.</p>
    </div>`;
    return;
  }

  const sorted = [...items].sort((a,b) => b.score - a.score);
  grid.innerHTML = sorted.map(p => {
    const margin = p.price && p.costMin ? (((p.price - p.costMin) / p.price) * 100).toFixed(0) : '—';
    let badgeClass = 'badge-pass', badgeText = `${p.score}/180`;
    if (p.score >= 160)     { badgeClass = 'badge-must';  badgeText = `🔥 ${p.score}/180`; }
    else if (p.score >= 150){ badgeClass = 'badge-test';  badgeText = `✅ ${p.score}/180`; }
    else if (p.score >= 140){ badgeClass = 'badge-valid'; badgeText = `⚡ ${p.score}/180`; }

    const nicheLabels = { clothing:'👗 Clothing', accessories:'💍 Accessoires', beauty:'✨ Beauté', kitchen:'🍳 Cuisine', bathroom:'🛁 Salle de Bain' };

    const url1688 = p.terme1688 ? `https://s.1688.com/selloffer/offerlist.htm?keywords=${encodeURIComponent(p.terme1688)}` : '#';
    const urlTaobao = p.terme1688 ? `https://s.taobao.com/search?q=${encodeURIComponent(p.terme1688)}&ie=utf8` : '#';

    return `<div class="wf-card" id="wfc-${p.id}">
      <div class="wf-card-top">
        <div class="wf-name">${p.name}</div>
        <div class="wf-score-badge ${badgeClass}">${badgeText}</div>
      </div>
      <div class="wf-niche-tag">${nicheLabels[p.niche] || p.niche}</div>
      <div class="wf-meta">
        <strong>Signal :</strong> ${p.signal || '—'}<br>
        <strong>Lead Market :</strong> ${p.leadMarket || '—'}<br>
        <strong>Timing CA :</strong> ${p.timing || '—'}<br>
        <strong>Source :</strong> ${p.source || '—'}
      </div>
      <div class="wf-prices">
        <div class="wf-price-item">
          <div class="wf-price-label">Coût 1688</div>
          <div class="wf-price-val">${p.costMin ? 'CA$' + p.costMin.toFixed(2) : '—'}</div>
        </div>
        <div class="wf-price-item">
          <div class="wf-price-label">Prix JAWDA</div>
          <div class="wf-price-val accent">${p.price ? 'CA$' + p.price : '—'}</div>
        </div>
        <div class="wf-price-item">
          <div class="wf-price-label">Marge</div>
          <div class="wf-price-val green">${margin}%</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:10px">
        <a href="${url1688}" target="_blank" style="flex:1;text-align:center;padding:5px;background:rgba(239,68,68,.1);color:#ff6b6b;border-radius:5px;font-size:11px;font-weight:600;text-decoration:none">1688 →</a>
        <a href="${urlTaobao}" target="_blank" style="flex:1;text-align:center;padding:5px;background:rgba(245,158,11,.1);color:#f59e0b;border-radius:5px;font-size:11px;font-weight:600;text-decoration:none">Taobao →</a>
      </div>
      <div class="wf-actions">
        <button class="wf-btn-val" onclick="validateProduct('${p.id}')">✅ Valider</button>
        <button class="wf-btn-test" onclick="createCampFromProduct('${p.id}')">📣 Tester pub</button>
      </div>
    </div>`;
  }).join('');
}

function filterWinFinder() {
  const search = document.getElementById('wf-search').value.toLowerCase();
  const niche  = document.getElementById('wf-niche').value;
  const scoreMin = parseInt(document.getElementById('wf-score').value) || 0;

  const filtered = state.products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search) || (p.signal || '').toLowerCase().includes(search);
    const matchNiche  = niche === 'all' || p.niche === niche;
    const matchScore  = p.score >= scoreMin;
    return matchSearch && matchNiche && matchScore;
  });
  renderWinFinder(filtered);
}

function addWinFinderProduct() {
  showPage('evaluate', document.querySelector('[onclick*="evaluate"]'));
}

// ── VALIDATE PRODUCT ──────────────────────
function validateProduct(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  p.validated = true;
  p.verdict = 'ok';
  addActivity('green', `Produit validé : ${p.name} → ajouté à Produits Validés`);
  save();
  renderWinFinder();
  updateDashStats();
  showToast(`"${p.name}" validé ✅`);
}

// ── CAMPAIGNS ──────────────────────────────
function openCampaignModal() {
  document.getElementById('c-start').value = new Date().toISOString().split('T')[0];
  document.getElementById('campModal').classList.add('open');
}
function closeCampaignModal() {
  document.getElementById('campModal').classList.remove('open');
}

function saveCampaign(e) {
  e.preventDefault();
  const camp = {
    id: 'c' + Date.now(),
    product: document.getElementById('c-product').value.trim(),
    platform: document.getElementById('c-platform').value,
    budget: parseFloat(document.getElementById('c-budget').value),
    cpaTarget: parseFloat(document.getElementById('c-cpa-target').value) || 15,
    killRule: parseFloat(document.getElementById('c-kill').value) || 25,
    angle: document.getElementById('c-angle').value.trim(),
    start: document.getElementById('c-start').value,
    status: 'active',
    spent: 0, revenue: 0, orders: 0,
    cpa: 0, roas: 0
  };
  state.campaigns.push(camp);
  addActivity('purple', `Campagne créée : ${camp.product} sur ${camp.platform}`);
  save();
  closeCampaignModal();
  renderCampaigns();
  updateDashStats();
  showToast(`Campagne "${camp.product}" créée ✅`);
}

function createCampFromProduct(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  showPage('campaigns', document.querySelector('[onclick*="campaigns"]'));
  setTimeout(() => {
    document.getElementById('c-product').value = p.name;
    document.getElementById('c-angle').value = p.hook || '';
    document.getElementById('c-start').value = new Date().toISOString().split('T')[0];
    document.getElementById('campModal').classList.add('open');
  }, 100);
}

function renderCampaigns(filter) {
  const list = document.getElementById('camp-list');
  let camps = state.campaigns;
  if (filter && filter !== 'all') camps = camps.filter(c => c.status === filter);

  if (!camps.length) {
    list.innerHTML = `<div class="empty-state full"><svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg><p>Aucune campagne${filter && filter!=='all' ? ' dans cette catégorie' : ''}.</p></div>`;
    return;
  }

  const platformMap = { facebook:'platform-facebook', tiktok:'platform-tiktok', both:'platform-both' };
  const platformLabel = { facebook:'📘 Facebook', tiktok:'🎵 TikTok', both:'📘+🎵 FB+TT' };
  const statusMap = { active:'status-active', paused:'status-paused', stopped:'status-stopped', scaling:'status-scaling' };
  const statusLabel = { active:'✅ Active', paused:'⏸ Pausée', stopped:'🛑 Stoppée', scaling:'🚀 Scaling' };

  list.innerHTML = camps.map(c => {
    const cpa  = c.orders ? (c.spent / c.orders).toFixed(2) : '—';
    const roas = c.spent  ? (c.revenue / c.spent).toFixed(1) : '—';
    const roasNum = c.spent ? c.revenue / c.spent : 0;
    const margin = c.revenue - c.spent;
    const isKill = c.orders && parseFloat(cpa) > c.killRule;

    return `<div class="camp-card">
      <div class="camp-card-top">
        <div>
          <div class="camp-name">${c.product}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${c.angle || 'Pas d\'angle défini'}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="camp-platform ${platformMap[c.platform]}">${platformLabel[c.platform]}</span>
          <span class="status-chip ${statusMap[c.status]}">${statusLabel[c.status]}</span>
          ${isKill ? '<span style="background:rgba(239,68,68,.15);color:#ff6b6b;padding:3px 8px;border-radius:5px;font-size:11px;font-weight:700">⚠️ KILL RULE</span>' : ''}
        </div>
      </div>
      <div class="camp-metrics">
        <div class="camp-metric">
          <div class="camp-metric-val">CA$${c.spent.toFixed(0)}</div>
          <div class="camp-metric-lbl">Dépensé</div>
        </div>
        <div class="camp-metric">
          <div class="camp-metric-val ${c.revenue > c.spent ? 'good' : 'bad'}">CA$${c.revenue.toFixed(0)}</div>
          <div class="camp-metric-lbl">Revenus</div>
        </div>
        <div class="camp-metric">
          <div class="camp-metric-val">${c.orders}</div>
          <div class="camp-metric-lbl">Commandes</div>
        </div>
        <div class="camp-metric">
          <div class="camp-metric-val ${parseFloat(cpa) <= c.cpaTarget ? 'good' : isKill ? 'bad' : 'ok'}">CA$${cpa}</div>
          <div class="camp-metric-lbl">CPA</div>
        </div>
        <div class="camp-metric">
          <div class="camp-metric-val ${roasNum >= 3 ? 'good' : roasNum > 0 && roasNum < 2 ? 'bad' : 'ok'}">${roas}x</div>
          <div class="camp-metric-lbl">ROAS</div>
        </div>
      </div>
      <div class="camp-actions">
        <span style="font-size:12px;color:var(--text-muted)">Budget: CA$${c.budget}/j · Kill rule: CPA>CA$${c.killRule} · Depuis: ${c.start}</span>
        <div style="margin-left:auto;display:flex;gap:6px">
          <button class="btn-sm" onclick="openUpdateModal('${c.id}')">Résultats</button>
          <button class="btn-sm" onclick="changeCampStatus('${c.id}','${c.status === 'active' ? 'paused' : 'active'}')">${c.status === 'active' ? '⏸ Pause' : '▶ Activer'}</button>
          <button class="btn-sm" onclick="changeCampStatus('${c.id}','stopped')" style="color:var(--red)">🛑 Stop</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterCamp(f, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCampaigns(f);
}

function openUpdateModal(id) {
  document.getElementById('u-id').value = id;
  const c = state.campaigns.find(x => x.id === id);
  if (c) {
    document.getElementById('u-spent').value = c.spent || '';
    document.getElementById('u-revenue').value = c.revenue || '';
    document.getElementById('u-orders').value = c.orders || '';
    document.getElementById('u-status').value = c.status;
  }
  document.getElementById('updateModal').classList.add('open');
}

function saveUpdate(e) {
  e.preventDefault();
  const id = document.getElementById('u-id').value;
  const c = state.campaigns.find(x => x.id === id);
  if (!c) return;
  c.spent   = parseFloat(document.getElementById('u-spent').value) || 0;
  c.revenue = parseFloat(document.getElementById('u-revenue').value) || 0;
  c.orders  = parseInt(document.getElementById('u-orders').value) || 0;
  c.status  = document.getElementById('u-status').value;
  c.cpa  = c.orders ? c.spent / c.orders : 0;
  c.roas = c.spent  ? c.revenue / c.spent : 0;

  addActivity('blue', `Campagne "${c.product}" mise à jour — ROAS: ${c.roas.toFixed(1)}x`);
  save();
  document.getElementById('updateModal').classList.remove('open');
  renderCampaigns();
  updateDashStats();
  showToast('Résultats mis à jour ✅');
}

function changeCampStatus(id, status) {
  const c = state.campaigns.find(x => x.id === id);
  if (c) { c.status = status; save(); renderCampaigns(); updateDashStats(); }
}

// ── VALIDATED PRODUCTS ────────────────────
function renderValidated() {
  const el = document.getElementById('validated-list');
  const validated = state.products.filter(p => p.validated);
  if (!validated.length) {
    el.innerHTML = `<div class="empty-state full"><svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><p>Valide des produits depuis WinFinder.</p></div>`;
    return;
  }
  el.innerHTML = `<table><thead><tr>
    <th>#</th><th>Produit</th><th>Niche</th><th>Coût</th><th>Prix</th><th>Marge</th><th>Score</th><th>Terme 1688</th>
  </tr></thead><tbody>
  ${validated.map((p,i) => {
    const margin = p.price && p.costMin ? (((p.price - p.costMin) / p.price) * 100).toFixed(0) + '%' : '—';
    return `<tr>
      <td>${i+1}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.niche}</td>
      <td>CA$${p.costMin || '—'}</td>
      <td>CA$${p.price || '—'}</td>
      <td style="color:var(--green);font-weight:700">${margin}</td>
      <td><strong style="color:var(--accent)">${p.score}/180</strong></td>
      <td style="font-size:12px;color:var(--text-muted)">${p.terme1688 || '—'}</td>
    </tr>`;
  }).join('')}
  </tbody></table>`;
}

function exportToStore() {
  const validated = state.products.filter(p => p.validated);
  if (!validated.length) { showToast('Aucun produit validé à exporter'); return; }
  const nicheMap = { clothing:'clothing', accessories:'accessories', beauty:'accessories', kitchen:'home', bathroom:'home' };
  const code = validated.map(p => `  {\n    id: '${p.id}', category: '${nicheMap[p.niche]||p.niche}',\n    name: '${p.name}',\n    desc: 'Description à rédiger.',\n    price: ${p.price}, orig: null, badge: 'New',\n    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',\n    angle: '"${p.hook || 'Hook à définir'}"\n  }`).join(',\n');
  const full = `// Produits validés Jawda AdsPilot — ${new Date().toLocaleDateString('fr-CA')}\n// Ajouter dans FALLBACK_PRODUCTS de app.js\n[\n${code}\n]`;
  const blob = new Blob([full], {type: 'text/javascript'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `jawda-products-${new Date().toISOString().split('T')[0]}.js`;
  a.click();
  showToast(`${validated.length} produit(s) exporté(s) ✅`);
}

// ── ORDERS ─────────────────────────────────
function openOrderModal() {
  document.getElementById('orderModal').classList.add('open');
}

function saveOrder(e) {
  e.preventDefault();
  const order = {
    id: 'ORD-' + String(state.orders.length + 1).padStart(3, '0'),
    name: document.getElementById('o-name').value.trim(),
    product: document.getElementById('o-product').value.trim(),
    amount: parseFloat(document.getElementById('o-amount').value),
    phone: document.getElementById('o-phone').value.trim(),
    address: document.getElementById('o-address').value.trim(),
    source: document.getElementById('o-source').value,
    status: 'pending',
    date: new Date().toLocaleDateString('fr-CA')
  };
  state.orders.unshift(order);
  addActivity('orange', `Commande ${order.id} — ${order.name} — CA$${order.amount}`);
  save();
  document.getElementById('orderModal').classList.remove('open');
  renderOrders();
  updateDashStats();
  showToast(`Commande ${order.id} enregistrée ✅`);
  e.target.reset();
}

function renderOrders(list) {
  const el = document.getElementById('orders-list');
  const orders = list || state.orders;
  if (!orders.length) {
    el.innerHTML = `<div class="empty-state full"><p>Aucune commande encore.</p></div>`;
    return;
  }
  const statusOptions = ['pending','confirmed','shipped','delivered','cancelled'].map(s =>
    `<option value="${s}">${{pending:'⏳ En attente',confirmed:'✅ Confirmée',shipped:'📦 Expédiée',delivered:'🎉 Livrée',cancelled:'❌ Annulée'}[s]}</option>`
  ).join('');
  el.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-id">${o.id}</div>
      <div class="order-name">${o.name}</div>
      <div class="order-product">${o.product}</div>
      <span class="order-source source-${o.source}">${o.source}</span>
      <div class="order-amount">CA$${o.amount.toFixed(2)}</div>
      <select class="order-status-select" onchange="updateOrderStatus('${o.id}', this.value)">
        ${statusOptions.replace(`value="${o.status}"`, `value="${o.status}" selected`)}
      </select>
      <div style="font-size:11px;color:var(--text-muted)">${o.date}</div>
    </div>`).join('');
}

function filterOrders(q) {
  const filtered = state.orders.filter(o =>
    o.name.toLowerCase().includes(q.toLowerCase()) ||
    o.product.toLowerCase().includes(q.toLowerCase()) ||
    o.id.toLowerCase().includes(q.toLowerCase())
  );
  renderOrders(filtered);
}

function updateOrderStatus(id, status) {
  const o = state.orders.find(x => x.id === id);
  if (o) { o.status = status; save(); }
}

// ── DASHBOARD ──────────────────────────────
function refreshDashboard() {
  updateDashStats();
  renderUrgentProducts();
  renderDashCampaigns();
}

function updateDashStats() {
  const winners = state.products.filter(p => p.score >= 150).length;
  const activeCamps = state.campaigns.filter(c => c.status === 'active' || c.status === 'scaling').length;
  const totalRevenue = state.campaigns.reduce((s,c) => s + (c.revenue || 0), 0);
  const roas = state.campaigns.length
    ? state.campaigns.reduce((s,c) => s + (c.roas || 0), 0) / state.campaigns.length
    : 0;

  document.getElementById('stat-winners').textContent = winners;
  document.getElementById('stat-campaigns').textContent = activeCamps;
  document.getElementById('stat-revenue').textContent = 'CA$' + totalRevenue.toFixed(0);
  document.getElementById('stat-roas').textContent = roas ? roas.toFixed(1) + 'x' : '—';
}

function renderUrgentProducts() {
  const el = document.getElementById('urgent-list');
  const urgent = state.products
    .filter(p => p.score >= 160)
    .sort((a,b) => b.score - a.score)
    .slice(0, 5);

  if (!urgent.length) {
    el.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><p>Évalue des produits pour voir les winners urgents.</p></div>`;
    return;
  }
  el.innerHTML = urgent.map(p => {
    const margin = p.price && p.costMin ? (((p.price - p.costMin) / p.price) * 100).toFixed(0) : '—';
    return `<div class="activity-item">
      <div class="activity-dot" style="background:#ff6b6b"></div>
      <div class="activity-text"><strong>${p.name}</strong> — ${p.score}/180 · CA$${p.price} · ${margin}% marge</div>
      <div class="activity-time" style="color:#f59e0b;font-weight:600">${p.timing || ''}</div>
    </div>`;
  }).join('');
}

function renderDashCampaigns() {
  const el = document.getElementById('dash-campaigns');
  const active = state.campaigns
    .filter(c => c.status === 'active' || c.status === 'scaling')
    .slice(0, 4);

  if (!active.length) {
    el.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg><p>Aucune campagne active.</p></div>`;
    return;
  }
  el.innerHTML = active.map(c => {
    const roas = c.spent ? (c.revenue / c.spent).toFixed(1) : '—';
    const roasOk = parseFloat(roas) >= 3;
    return `<div class="activity-item">
      <div class="activity-dot ${c.status === 'scaling' ? 'purple' : 'green'}"></div>
      <div class="activity-text"><strong>${c.product}</strong> · ROAS: <span style="color:${roasOk ? 'var(--green)' : 'var(--orange)'}">${roas}x</span></div>
      <div class="activity-time">CA$${c.budget}/j</div>
    </div>`;
  }).join('');
}

// ── ACTIVITY LOG ───────────────────────────
const activityLog = [];
function addActivity(color, text) {
  const now = new Date();
  const time = now.toLocaleTimeString('fr-CA', {hour:'2-digit', minute:'2-digit'});
  activityLog.unshift({ color, text, time });
  if (activityLog.length > 50) activityLog.pop();

  const el = document.getElementById('activity-log');
  if (el) {
    el.innerHTML = activityLog.slice(0, 10).map(a =>
      `<div class="activity-item"><div class="activity-dot ${a.color}"></div><div class="activity-text">${a.text}</div><div class="activity-time">${a.time}</div></div>`
    ).join('');
  }
}

// ── TOAST ──────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── INIT ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Date
  document.getElementById('todayDate').textContent = new Date().toLocaleDateString('fr-CA', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });

  load();
  updateScore();
  refreshDashboard();
  renderEvalHistory();
});
