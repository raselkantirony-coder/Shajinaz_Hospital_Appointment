(() => {
const $ = s => document.querySelector(s), API = window.SH_CONFIG.API_URL;
const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let tok = sessionStorage.getItem('sh_tok'), tab = 'b', seen = +sessionStorage.getItem('sh_seen') || 0, docs = [], SITE = null, OPEN = {}, timer = null;
const role = () => sessionStorage.getItem('sh_role');
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 4200) };
async function call(a, p = {}) {
  if (!API) throw Error('config.js এ API_URL বসানো হয়নি');
  const r = await (await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action: a, token: tok, ...p }) })).json();
  if (!r.ok) throw Error(r.error); return r;
}
const keepScroll = fn => { const y = scrollY; fn(); scrollTo(0, y) };

/* ---------- লগইন / সাইন আপ ---------- */
document.querySelectorAll('.lgt button').forEach(b => b.onclick = () => {
  const up = b.dataset.m == 'up'; $('#lf').hidden = up; $('#sf').hidden = !up;
  document.querySelectorAll('.lgt button').forEach(x => x.className = 'btn ' + (x == b ? 'pri' : 'ghost'));
});
$('#lf').onsubmit = async e => {
  e.preventDefault();
  try {
    const r = await call('login', Object.fromEntries(new FormData(e.target)));
    tok = r.token; sessionStorage.setItem('sh_tok', tok); sessionStorage.setItem('sh_user', r.name || r.user); sessionStorage.setItem('sh_role', r.role || 'staff'); show();
  } catch (x) { toast(x.message) }
};
$('#sf').onsubmit = async e => {
  e.preventDefault();
  try {
    const r = await call('signup', Object.fromEntries(new FormData(e.target)));
    e.target.reset(); $('.lgt button[data-m=in]').click();
    $('#lmsg').className = 'ok2';
    $('#lmsg').textContent = r.pending ? 'সাইন আপ সম্পন্ন হয়েছে। মূল অ্যাডমিন অনুমোদন দিলে ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।' : 'সাইন আপ সম্পন্ন! এখন ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।';
  } catch (x) { toast(x.message) }
};
$('#out').onclick = () => { sessionStorage.clear(); location.reload() };

/* ---------- ট্যাব ---------- */
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
  tab = b.dataset.t; document.querySelectorAll('.tabs button').forEach(x => x.className = 'btn ' + (x == b ? 'pri' : 'ghost')); load();
});
function show() {
  $('#lg').hidden = true; $('#app').hidden = false;
  $('#who').textContent = 'লগইন: ' + sessionStorage.getItem('sh_user') + (role() == 'super' ? ' (মূল অ্যাডমিন)' : '');
  $('#tabA').hidden = role() != 'super';
  load(); clearInterval(timer); timer = setInterval(poll, 30000);
}
async function poll() {
  try {
    const r = await call('bookings'), n = r.data.filter(b => b.status == 'Pending').length;
    $('#nb').hidden = !n; $('#nb').textContent = n;
    if (n > seen) { toast('নতুন অ্যাপয়েন্টমেন্ট রিকোয়েস্ট এসেছে'); document.title = '(' + n + ') নতুন বুকিং'; if (tab == 'b') render(r.data) }
    seen = n; sessionStorage.setItem('sh_seen', n);
    if (role() == 'super') { const u = await call('users'), p = u.data.filter(x => x.status == 'pending').length; $('#nu').hidden = !p; $('#nu').textContent = p }
  } catch (e) { }
}
async function load() {
  try {
    $('#v').innerHTML = 'লোড হচ্ছে…';
    if (tab == 'b') { const r = await call('bookings'); seen = r.data.filter(b => b.status == 'Pending').length; render(r.data) }
    else if (tab == 'd') { docs = (await call('doctors')).data; dview() }
    else if (tab == 'c') await cview(true)
    else if (tab == 'a') await aview();
    else await uview();
  } catch (x) { $('#v').innerHTML = '<p class="err">' + E(x.message) + '</p>'; if (/সেশন/.test(x.message)) { sessionStorage.clear(); setTimeout(() => location.reload(), 1500) } }
}

/* ---------- বুকিং ---------- */
function render(b) {
  $('#nb').hidden = !seen; $('#nb').textContent = seen;
  $('#v').innerHTML = b.map(x => `<div class="row ${x.status == 'Pending' ? 'new' : ''}"><div><b>${E(x.patientName)}</b><br><a href="tel:${E(x.mobile)}">${E(x.mobile)}</a></div><div>${E(x.doctorName)}<br><span class="s">${E(String(x.date).slice(0, 10))} · ${E(x.bookingId)}</span></div><div class="s">বয়স ${E(x.age)}${x.pharmacy ? ' · ফার্মেসি: ' + E(x.pharmacy) : ''}${x.agentName ? '<br>এজেন্ট: ' + E(x.agentName) + ' ' + E(x.agentPhone) + ' ' + E(x.agentAddress) : ''}</div><select data-b="${E(x.bookingId)}">${['Pending', 'Confirmed', 'Cancelled', 'Done'].map(s => `<option ${s == x.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>`).join('') || '<p>কোনো বুকিং নেই।</p>';
  document.querySelectorAll('[data-b]').forEach(s => s.onchange = async () => { try { await call('setStatus', { bookingId: s.dataset.b, status: s.value }); toast('আপডেট হয়েছে') } catch (x) { toast(x.message) } });
}

/* ---------- ডাক্তার ---------- */
const slotTxt = d => (d.slots || []).map(s => s.days.join(',') + ' ' + s.start + '-' + s.end).join('\n');
function dview() {
  $('#v').innerHTML = `<button class="btn pri" id="nd">+ নতুন ডাক্তার</button> ${docs.length ? '' : '<button class="btn ghost" id="imp">ডিফল্ট ডাক্তার ইমপোর্ট করুন</button>'}<div id="df"></div>` + docs.map(d => `<div class="row"><b>${E(d.name)}</b><span class="s">${E(d.department)} ${d.active ? '' : '(লুকানো)'}</span><button class="btn ghost" data-e="${E(d.id)}">এডিট</button></div>`).join('');
  $('#nd').onclick = () => form({ gender: 'M', active: true, slots: [] });
  if ($('#imp')) $('#imp').onclick = async () => { try { await call('importDoctors', { list: window.SH_DOCTORS.map(d => ({ ...d, photo: d.photo ? new URL(d.photo, location.href).href : '' })) }); toast('ইমপোর্ট হয়েছে'); load() } catch (x) { toast(x.message) } };
  document.querySelectorAll('[data-e]').forEach(b => b.onclick = () => form(docs.find(d => d.id == b.dataset.e)));
}
function form(d) {
  $('#df').innerHTML = `<form class="box" id="f"><input name="name" placeholder="নাম" value="${E(d.name)}" required><input name="department" placeholder="বিভাগ (English, যেমন Cardiology)" value="${E(d.department)}"><input name="degree" placeholder="ডিগ্রি" value="${E(d.degree)}"><select name="gender"><option value="M" ${d.gender == 'M' ? 'selected' : ''}>পুরুষ</option><option value="F" ${d.gender == 'F' ? 'selected' : ''}>মহিলা</option></select><textarea name="slots" rows="4" placeholder="প্রতি লাইনে একটি: Sat,Mon,Wed 18:00-21:00">${E(slotTxt(d))}</textarea><label class="fl2">ছবি <input type="file" accept="image/*" id="ph"></label><label class="fl2"><input type="checkbox" name="active" ${d.active ? 'checked' : ''}> সাইটে দেখান</label><button class="btn pri">সেভ করুন</button></form>`;
  $('#f').onsubmit = async e => {
    e.preventDefault(); const fd = new FormData(e.target);
    try {
      const slots = fd.get('slots').split('\n').map(l => l.trim()).filter(Boolean).map(l => { const m = l.match(/^([A-Za-z, ]+)\s+(\d\d:\d\d)-(\d\d:\d\d)$/); if (!m) throw Error('সময়সূচি ফরম্যাট ভুল: ' + l); return { days: m[1].split(',').map(x => x.trim()), start: m[2], end: m[3] } });
      let photoData = ''; const f = $('#ph').files[0]; if (f) photoData = await shrink(f, 600);
      await call('saveDoctor', { doctor: { id: d.id, name: fd.get('name'), department: fd.get('department'), degree: fd.get('degree'), gender: fd.get('gender'), slots, active: !!fd.get('active'), photo: d.photo, photoData } });
      toast('সেভ হয়েছে'); load();
    } catch (x) { toast(x.message) }
  };
}
function shrink(f, max = 600) {
  return new Promise((ok, no) => {
    const i = new Image();
    i.onload = () => { const s = Math.min(1, max / Math.max(i.width, i.height)), c = document.createElement('canvas'); c.width = Math.round(i.width * s); c.height = Math.round(i.height * s); const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(i, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', .86).split(',')[1]) };
    i.onerror = () => no(Error('ছবি পড়া যায়নি')); i.src = URL.createObjectURL(f);
  });
}

/* ---------- সাইট কনটেন্ট এডিটর ---------- */
const getp = (o, p) => p.split('.').reduce((a, k) => a == null ? a : a[k], o);
const setp = (o, p, v) => { const k = p.split('.'), l = k.pop(); k.reduce((a, x) => a[x], o)[l] = v };
const TYPES = [['doctors', 'ডাক্তার সংখ্যা (অটো)'], ['depts', 'বিভাগ সংখ্যা (অটো)'], ['today', 'আজ কতজন বসছেন (অটো)'], ['manual', 'নিজে সংখ্যা লিখব']];
function fld(p, label, type = 'text', opts = []) {
  const v = getp(SITE, p), a = `data-p="${p}" data-t="${type}"`;
  if (type == 'check') return `<label class="fl2"><input type="checkbox" ${a} ${v !== false && v ? 'checked' : ''}> ${label}</label>`;
  if (type == 'area') return `<label class="fl2">${label}<textarea rows="3" ${a}>${E(v)}</textarea></label>`;
  if (type == 'select') return `<label class="fl2">${label}<select ${a}>${opts.map(o => `<option value="${E(o[0])}" ${String(o[0]) == String(v) ? 'selected' : ''}>${E(o[1])}</option>`).join('')}</select></label>`;
  if (type == 'img') return `<div class="fl2">${label}<input data-p="${p}" data-t="text" value="${E(v)}" placeholder="ছবির লিংক বসান, অথবা নিচে থেকে ছবি আপলোড করুন"><div class="thumb">${v ? `<img src="${E(v)}" alt="">` : '<span class="s">ডিফল্ট ছবি</span>'}<input type="file" accept="image/*" data-up="${p}"></div></div>`;
  return `<label class="fl2">${label}<input type="${type == 'color' ? 'color' : type == 'num' ? 'number' : 'text'}" ${a} value="${E(v || (type == 'color' ? '#2c6fd1' : ''))}"></label>`;
}
const ctl = (l, i, n) => `<span><button type="button" class="btn ghost" data-a="up" data-l="${l}" data-i="${i}" ${i ? '' : 'disabled'}>↑</button> <button type="button" class="btn ghost" data-a="down" data-l="${l}" data-i="${i}" ${i < n - 1 ? '' : 'disabled'}>↓</button> <button type="button" class="btn ghost" data-a="del" data-l="${l}" data-i="${i}">মুছুন</button></span>`;
const stat = (base, i, icon) => `<div class="it"><div class="ih"><b>কাউন্টার ${i + 1}</b></div><div class="g2">${icon ? fld(`${base}.${i}.icon`, 'আইকন (ইমোজি)') : ''}${fld(`${base}.${i}.label`, 'লেখা')}${fld(`${base}.${i}.type`, 'সংখ্যা কোথা থেকে', 'select', TYPES)}${fld(`${base}.${i}.value`, 'নিজে লিখলে সংখ্যা', 'num')}${fld(`${base}.${i}.suf`, 'সংখ্যার পরে চিহ্ন (যেমন +)')}</div></div>`;
async function cview(fetchIt) {
  if (fetchIt) { const r = await call('getSite'); SITE = window.SH_MERGE(window.SH_SITE, r.data) }
  const S = SITE, G = (id, t, body) => `<details class="g" data-id="${id}" ${OPEN[id] ? 'open' : ''}><summary>${t}</summary><div class="gi">${body}</div></details>`;
  const sv = S.services.items, st = S.steps.items;
  $('#v').innerHTML = `<p class="s">এখানে যা বদলাবেন সাইটের হিরো, সেবা, ধাপ ও ব্যান্ডে সেটাই দেখাবে। ছবি আপলোড দিলে Google Drive এ জমা হয়। শেষে নিচের "সেভ করুন" চাপুন।</p>`
    + G('anim', '⚡ অ্যানিমেশন সেটিং', fld('anim.on', 'অ্যানিমেশন চালু রাখুন (বন্ধ করলে সাইট স্থির থাকবে)', 'check') + fld('anim.speed', 'হিরোর ছবি ঘোরার গতি', 'select', [[0.5, 'খুব ধীর'], [0.8, 'ধীর'], [1, 'স্বাভাবিক'], [1.6, 'দ্রুত'], [2.4, 'খুব দ্রুত']]))
    + G('hero', '🏠 হিরো লেখা', fld('hero.tag', 'ছোট ট্যাগ') + fld('hero.title', 'প্রধান শিরোনাম') + fld('hero.lead', 'ছোট বর্ণনা', 'area') + `<div class="g2">${fld('hero.cta1', 'প্রথম বাটনের লেখা')}${fld('hero.cta2', 'দ্বিতীয় বাটনের লেখা')}</div>`)
    + G('bld', '🏥 হসপিটালের ভবন কার্ড (হিরোতে সবচেয়ে বড় কার্ড)', `<div class="g2">${fld('building.title', 'নাম')}${fld('building.sub', 'ছোট লেখা')}</div>${fld('building.icon', 'আইকন (ইমোজি)')}${fld('building.img', 'ভবনের ছবি', 'img')}`)
    + G('kpi', '🔢 হিরোর কাউন্টার', S.kpis.map((k, i) => stat('kpis', i, true)).join(''))
    + G('quick', '🔗 হিরোর নিচের ৪টি কুইক কার্ড', S.quick.map((q, i) => `<div class="it"><div class="ih"><b>কার্ড ${i + 1}</b></div><div class="g2">${fld(`quick.${i}.icon`, 'আইকন')}${fld(`quick.${i}.title`, 'শিরোনাম')}${fld(`quick.${i}.sub`, 'ছোট লেখা')}${fld(`quick.${i}.href`, 'লিংক (#doctors, tel:+880…, https://…)')}</div></div>`).join(''))
    + G('svc', '🛏️ সেবাসমূহ (কার্ড ও হিরোর ঘূর্ণন)', `<div class="g2">${fld('services.eyebrow', 'ছোট শিরোনাম')}${fld('services.title', 'মূল শিরোনাম')}</div>` + sv.map((s, i) => `<div class="it"><div class="ih"><b>${E(s.icon)} ${E(s.title)}</b>${ctl('services.items', i, sv.length)}</div><div class="g2">${fld(`services.items.${i}.title`, 'নাম')}${fld(`services.items.${i}.sub`, 'ছোট বর্ণনা')}${fld(`services.items.${i}.icon`, 'আইকন (ইমোজি)')}${fld(`services.items.${i}.color`, 'কার্ডের রং', 'color')}${fld(`services.items.${i}.badge`, 'ব্যাজ (যেমন ২৪/৭, ফাঁকা রাখলে নেই)')}</div>${fld(`services.items.${i}.img`, 'ছবি', 'img')}<div class="g2">${fld(`services.items.${i}.on`, 'সেবা তালিকায় দেখান', 'check')}${fld(`services.items.${i}.hero`, 'হিরোতে ঘুরবে', 'check')}</div></div>`).join('') + `<button type="button" class="btn pri" data-a="add" data-l="services.items">+ নতুন সেবা</button>`)
    + G('steps', '📋 অ্যাপয়েন্টমেন্টের ধাপ', `<div class="g2">${fld('steps.eyebrow', 'ছোট শিরোনাম')}${fld('steps.title', 'মূল শিরোনাম')}</div>` + st.map((s, i) => `<div class="it"><div class="ih"><b>ধাপ ${i + 1}</b>${ctl('steps.items', i, st.length)}</div><div class="g2">${fld(`steps.items.${i}.icon`, 'আইকন')}${fld(`steps.items.${i}.title`, 'শিরোনাম')}</div>${fld(`steps.items.${i}.text`, 'বর্ণনা', 'area')}</div>`).join('') + `<button type="button" class="btn pri" data-a="add" data-l="steps.items">+ নতুন ধাপ</button>`)
    + G('band', '🌟 "স্বাস্থ্যসেবায় উৎকর্ষতা" ব্যান্ড', fld('band.title', 'শিরোনাম') + fld('band.text', 'বর্ণনা', 'area') + S.band.stats.map((k, i) => stat('band.stats', i, false)).join(''))
    + `<div class="savebar"><button type="button" class="btn pri" data-a="save">সেভ করুন</button><button type="button" class="btn ghost" data-a="reset">ডিফল্টে ফিরুন</button></div>`;
}
const v = $('#v');
v.addEventListener('toggle', e => { if (e.target.dataset && e.target.dataset.id) OPEN[e.target.dataset.id] = e.target.open }, true);
v.addEventListener('input', e => {
  const t = e.target; if (tab != 'c' || !SITE || !t.dataset.p) return;
  let val = t.type == 'checkbox' ? t.checked : t.value;
  if (t.dataset.t == 'num' || /\.speed$/.test(t.dataset.p)) val = Number(val) || 0;
  setp(SITE, t.dataset.p, val);
});
v.addEventListener('change', async e => {
  const t = e.target; if (tab != 'c' || !t.dataset.up) return;
  const f = t.files[0]; if (!f) return;
  try { toast('ছবি আপলোড হচ্ছে…'); const r = await call('uploadImage', { data: await shrink(f, 1200) }); setp(SITE, t.dataset.up, r.url); keepScroll(() => cview()); toast('ছবি আপলোড হয়েছে। এখন "সেভ করুন" চাপুন।') } catch (x) { toast(x.message) }
});
v.addEventListener('click', async e => {
  const b = e.target.closest('[data-a]'); if (!b || tab != 'c') return;
  const a = b.dataset.a, i = +b.dataset.i, list = b.dataset.l ? getp(SITE, b.dataset.l) : null;
  if (a == 'up' && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
  else if (a == 'down' && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
  else if (a == 'del') { if (list.length < 2) return toast('অন্তত একটি থাকতে হবে'); if (!confirm('মুছে ফেলবেন?')) return; list.splice(i, 1) }
  else if (a == 'add') list.push(b.dataset.l == 'steps.items' ? { icon: '⭐', title: 'নতুন ধাপ', text: '' } : { key: 'c' + Date.now().toString(36), title: 'নতুন সেবা', sub: 'ছোট বর্ণনা লিখুন', icon: '⭐', color: '#2c6fd1', badge: '', img: '', on: true, hero: true });
  else if (a == 'reset') { if (!confirm('সব কনটেন্ট ডিফল্টে ফিরবে (সেভ না করা পর্যন্ত সাইটে বদলাবে না)। নিশ্চিত?')) return; SITE = JSON.parse(JSON.stringify(window.SH_SITE)) }
  else if (a == 'save') { try { b.disabled = true; await call('saveSite', { site: SITE }); toast('সেভ হয়েছে। সাইট রিফ্রেশ করলেই নতুন কনটেন্ট দেখাবে।') } catch (x) { toast(x.message) } b.disabled = false; return }
  else return;
  keepScroll(() => cview());
});

/* ---------- ফার্মাসিস্ট (এজেন্ট) ---------- */
async function aview() {
  if (role() != 'super') { $('#v').innerHTML = '<p class="s">ফার্মাসিস্ট ম্যানেজমেন্ট শুধু মূল অ্যাডমিনের জন্য।</p>'; return }
  const r = await call('agents');
  $('#v').innerHTML = `<p class="s">ফার্মাসিস্টরা সাইটে সাইন আপ করলে এখানে দেখা যায়। তাদের নাম, ফোন ও ঠিকানা প্রতিটি বুকিংয়ের সাথে নিজে নিজেই Sheet এ যায়। সন্দেহ হলে "বন্ধ করুন" চাপুন।</p>` + (r.data.map(g => `<div class="row"><div><b>${E(g.name)}</b> · ${E(g.pharmacy)}<br><span class="s">${E(g.mobile)} · ${E(g.email)}<br>${E(g.address)}</span></div><div><span class="st ${g.status == 'active' ? 'active' : 'disabled'}">${g.status == 'active' ? 'সক্রিয়' : 'বন্ধ'}</span> <span class="s">${g.bookings} টি বুকিং</span></div><div><button class="btn ghost" data-ag="${E(g.agentId)}" data-st="${g.status == 'active' ? 'disabled' : 'active'}">${g.status == 'active' ? 'বন্ধ করুন' : 'চালু করুন'}</button> <button class="btn ghost" data-rp="${E(g.agentId)}">পাসওয়ার্ড রিসেট</button> <button class="btn ghost" data-da="${E(g.agentId)}">মুছুন</button></div></div>`).join('') || '<p>এখনো কোনো ফার্মাসিস্ট সাইন আপ করেননি।</p>');
  document.querySelectorAll('[data-ag]').forEach(b => b.onclick = async () => { try { await call('setAgentStatus', { agentId: b.dataset.ag, status: b.dataset.st }); aview() } catch (x) { toast(x.message) } });
  document.querySelectorAll('[data-rp]').forEach(b => b.onclick = async () => { const pw = prompt('নতুন পাসওয়ার্ড (৮+ অক্ষর):'); if (!pw) return; try { await call('resetAgentPassword', { agentId: b.dataset.rp, password: pw }); toast('পাসওয়ার্ড বদলেছে, ফার্মাসিস্টকে জানিয়ে দিন') } catch (x) { toast(x.message) } });
  document.querySelectorAll('[data-da]').forEach(b => b.onclick = async () => { if (confirm('এই ফার্মাসিস্টের অ্যাকাউন্ট মুছে ফেলবেন? (পুরনো বুকিং থাকবে)')) try { await call('deleteAgent', { agentId: b.dataset.da }); aview() } catch (x) { toast(x.message) } });
}

/* ---------- ইউজার ---------- */
const SL = { active: 'সক্রিয়', pending: 'অনুমোদনের অপেক্ষায়', disabled: 'বন্ধ' };
async function uview() {
  let html = '';
  if (role() == 'super') {
    const r = await call('users'), pend = r.data.filter(u => u.status == 'pending').length; $('#nu').hidden = !pend; $('#nu').textContent = pend;
    html += '<h3>স্টাফ তালিকা</h3>' + r.data.map(u => { const s = u.status || 'active', mine = u.username == r.me, sup = u.role == 'super'; return `<div class="row"><div><b>${E(u.name || u.username)}</b>${mine ? ' <span class="s">(আপনি)</span>' : ''}<br><span class="s">${E(u.email || u.username)}${u.mobile ? ' · ' + E(u.mobile) : ''}</span></div><div><span class="st ${E(s)}">${SL[s] || E(s)}</span> <span class="s">${sup ? 'মূল অ্যাডমিন' : 'স্টাফ'}</span></div><div>${mine || sup ? '' : `${s != 'active' ? `<button class="btn pri" data-us="active" data-u="${E(u.username)}">অনুমোদন দিন</button> ` : `<button class="btn ghost" data-us="disabled" data-u="${E(u.username)}">বন্ধ করুন</button> `}<button class="btn ghost" data-del="${E(u.username)}">মুছুন</button>`}</div></div>` }).join('')
      + `<form class="box" id="uf"><h3>সরাসরি নতুন স্টাফ তৈরি (অনুমোদন ছাড়াই সক্রিয়)</h3><input name="username" placeholder="ইউজারনেম বা ইমেইল" required><input name="password" type="password" placeholder="পাসওয়ার্ড (৮+ অক্ষর)" required><button class="btn pri">তৈরি করুন</button></form>`;
  } else html += '<p class="s">ইউজার ম্যানেজমেন্ট শুধু মূল অ্যাডমিনের জন্য।</p>';
  html += `<form class="box" id="pf"><h3>আমার পাসওয়ার্ড বদলান</h3><input name="password" type="password" placeholder="নতুন পাসওয়ার্ড (৮+ অক্ষর)" required><button class="btn pri">বদলান</button></form>`;
  $('#v').innerHTML = html;
  if ($('#uf')) $('#uf').onsubmit = async e => { e.preventDefault(); try { await call('createUser', Object.fromEntries(new FormData(e.target))); toast('তৈরি হয়েছে'); uview() } catch (x) { toast(x.message) } };
  $('#pf').onsubmit = async e => { e.preventDefault(); try { await call('changePassword', Object.fromEntries(new FormData(e.target))); toast('পাসওয়ার্ড বদলেছে'); e.target.reset() } catch (x) { toast(x.message) } };
  document.querySelectorAll('[data-us]').forEach(b => b.onclick = async () => { try { await call('setUserStatus', { username: b.dataset.u, status: b.dataset.us }); toast('আপডেট হয়েছে'); uview() } catch (x) { toast(x.message) } });
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (confirm('মুছে ফেলবেন?')) try { await call('deleteUser', { username: b.dataset.del }); uview() } catch (x) { toast(x.message) } });
}
if (tok) show();
})();
