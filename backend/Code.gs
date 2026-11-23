/** Shajinaz Hospital backend — Google Apps Script (Spreadsheet-bound; যে Google অ্যাকাউন্টে ডেপ্লয় করবেন সেটাই মালিক)
 *  Deploy: Web app, Execute as Me, Access Anyone.
 *  এই ফাইল পাবলিক GitHub রিপোতে দেবেন না (ডিফল্ট পাসওয়ার্ড আছে)।
 *  নতুন ভার্সন ডেপ্লয়ের পর একবার setup() চালান (Users শিটে নতুন কলাম ও Settings শিট তৈরি হবে)। */
const WA_PHONE = '8801886338811', DEF_USER = 'shajinaz_admin', DEF_PASS = 'Shajinaz@2026';
const DC = ['id', 'name', 'department', 'degree', 'slots', 'active', 'photo', 'gender'],
  BC = ['bookingId', 'createdAt', 'patientName', 'mobile', 'age', 'doctorId', 'doctorName', 'date', 'pharmacy', 'agentName', 'agentPhone', 'agentAddress', 'status', 'agentId'],
  AC = ['agentId', 'createdAt', 'name', 'pharmacy', 'mobile', 'email', 'address', 'salt', 'hash', 'status'],
  UC = ['username', 'salt', 'hash', 'createdAt', 'email', 'mobile', 'name', 'status', 'role'],
  SC = ['key', 'value'];
const SP = () => PropertiesService.getScriptProperties(),
  SS = () => { const i = SP().getProperty('SPREADSHEET_ID'); return i ? SpreadsheetApp.openById(i) : SpreadsheetApp.getActiveSpreadsheet() };
/** নোটিফিকেশন ইমেইল যায় ডেপ্লয়কারী অ্যাকাউন্টে (Script property NOTIFY_EMAIL দিলে সেখানে) */
const owner_ = () => SP().getProperty('NOTIFY_EMAIL') || Session.getEffectiveUser().getEmail();
function sh_(n, h) { let s = SS().getSheetByName(n) || SS().insertSheet(n); if (!s.getLastRow()) { s.appendRow(h); s.setFrozenRows(1) } return s }
function fmt_(s, cols, widths) {
  s.getRange(1, 1, 1, cols.length).setValues([cols]).setBackground('#12306f').setFontColor('#ffffff').setFontWeight('bold').setVerticalAlignment('middle');
  s.setFrozenRows(1); s.setRowHeight(1, 32); widths.forEach((w, i) => s.setColumnWidth(i + 1, w));
}
function statusRules_(s, col, map, list) {
  const r = s.getRange(2, col, 1000, 1);
  r.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(list, true).build());
  s.setConditionalFormatRules(Object.keys(map).map(k => SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(k).setBackground(map[k]).setRanges([r]).build()));
}
function setup() {
  const d = sh_('Doctors', DC), b = sh_('Bookings', BC), g = sh_('Agents', AC), u = sh_('Users', UC), t = sh_('Settings', SC);
  fmt_(d, DC, [90, 220, 160, 280, 320, 70, 260, 70]);
  fmt_(b, BC, [190, 150, 160, 120, 60, 90, 200, 100, 160, 150, 120, 220, 110, 100]);
  b.getRange(2, 2, 1000, 1).setNumberFormat('dd MMM yyyy, hh:mm'); b.getRange(2, 4, 1000, 1).setNumberFormat('@');
  statusRules_(b, BC.indexOf('status') + 1, { Pending: '#fff3cd', Confirmed: '#d4edda', Cancelled: '#f8d7da', Done: '#d6e4ff' }, ['Pending', 'Confirmed', 'Cancelled', 'Done']);
  fmt_(g, AC, [100, 150, 170, 190, 120, 210, 260, 80, 80, 90]); g.hideColumns(8, 2);
  g.getRange(2, 5, 1000, 1).setNumberFormat('@');
  statusRules_(g, AC.indexOf('status') + 1, { active: '#d4edda', disabled: '#f8d7da' }, ['active', 'disabled']);
  fmt_(u, UC, [160, 80, 80, 150, 200, 120, 160, 90, 90]); u.hideColumns(2, 2); u.getRange(2, 6, 1000, 1).setNumberFormat('@');
  fmt_(t, SC, [120, 500]);
  if (u.getLastRow() < 2) addUser_({ username: DEF_USER, password: DEF_PASS, name: 'মূল অ্যাডমিন', status: 'active', role: 'super' });
  else { const r = rows_('Users', UC).find(x => x.username === DEF_USER); if (r) u.getRange(r._row, 8, 1, 2).setValues([['active', 'super']]) }
  SS().rename(SS().getName().indexOf('Untitled') === 0 || SS().getName().indexOf('শিরোনামহীন') === 0 ? 'Shajinaz Hospital — Data' : SS().getName());
  return 'Ready. Admin login: ' + DEF_USER + ' / ' + DEF_PASS + ' | নোটিফিকেশন ইমেইল: ' + owner_();
}
function hash_(p, s) { return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s + p)) }
function addUser_(o) {
  const s = Utilities.getUuid();
  sh_('Users', UC).appendRow([o.username, s, hash_(o.password, s), new Date(), o.email || '', o.mobile ? "'" + o.mobile : '', o.name || '', o.status || 'active', o.role || 'staff']);
}
function rows_(n, c) { const s = sh_(n, c), v = s.getDataRange().getValues(); return v.slice(1).filter(r => r[0] !== '').map((r, i) => { const o = { _row: i + 2 }; c.forEach((k, j) => o[k] = r[j]); return o }) }
function docs_() { return rows_('Doctors', DC).map(d => ({ id: String(d.id), name: d.name, department: d.department, degree: d.degree, slots: JSON.parse(d.slots || '[]'), active: d.active === true || String(d.active) == 'true', photo: d.photo, gender: d.gender || 'M' })) }
const out_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const cl_ = (v, n) => { const s = String(v == null ? '' : v).trim().slice(0, n); return /^[=+@\-]/.test(s) ? "'" + s : s };
const lc_ = s => String(s || '').trim().toLowerCase();
const stat_ = u => u.status || 'active';   // পুরনো ইউজারের status ফাঁকা = সক্রিয়
const isSuper_ = u => u.role === 'super' || u.username === DEF_USER;

/* ---------- পাবলিক GET: ডাক্তার ও সাইট কনটেন্ট ---------- */
function doGet(e) {
  try {
    const a = (e.parameter || {}).action;
    if (a === 'doctors') return out_({ ok: true, data: docs_().filter(d => d.active) });
    if (a === 'site') {
      const c = CacheService.getScriptCache(); let s = c.get('site');
      if (!s) { s = JSON.stringify(getSite_()); if (s.length < 90000) c.put('site', s, 600) }
      return out_({ ok: true, data: JSON.parse(s) });
    }
    throw Error('Unsupported');
  } catch (x) { return out_({ ok: false, error: x.message }) }
}
function getSite_() { const r = rows_('Settings', SC).find(x => x.key === 'site'); try { return r ? JSON.parse(r.value) : null } catch (e) { return null } }
function saveSite_(site) {
  if (!site || typeof site !== 'object' || Array.isArray(site)) throw Error('Invalid');
  const s = JSON.stringify(site); if (s.length > 45000) throw Error('ডেটা অনেক বড়, কিছু লেখা ছোট করুন');
  const sh = sh_('Settings', SC), r = rows_('Settings', SC).find(x => x.key === 'site');
  r ? sh.getRange(r._row, 2).setValue(s) : sh.appendRow(['site', s]);
  CacheService.getScriptCache().remove('site'); return { ok: true };
}

/* ---------- POST ---------- */
function auth_(p) { const u = CacheService.getScriptCache().get('t:' + p.token); if (!u) throw Error('সেশন শেষ, আবার লগইন করুন'); return u }
function superOnly_(me) { const u = rows_('Users', UC).find(x => x.username === me); if (!u || !isSuper_(u)) throw Error('শুধু মূল অ্যাডমিন এটি করতে পারবেন') }
function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents || '{}'), a = p.action;
    if (a === 'book') return out_(book_(p));
    if (a === 'login') return out_(login_(p));
    if (a === 'signup') return out_(signup_(p));
    if (a === 'agentSignup') return out_(agentSignup_(p));
    if (a === 'agentLogin') return out_(agentLogin_(p));
    if (a === 'agentMe') return out_(agentMe_(p));
    const me = auth_(p);
    if (a === 'doctors') return out_({ ok: true, data: docs_() });
    if (a === 'bookings') return out_({ ok: true, data: rows_('Bookings', BC).reverse().slice(0, 300) });
    if (a === 'setStatus') { const s = sh_('Bookings', BC), r = rows_('Bookings', BC).find(x => x.bookingId === p.bookingId); if (!r || !['Pending', 'Confirmed', 'Cancelled', 'Done'].includes(p.status)) throw Error('Invalid'); s.getRange(r._row, BC.indexOf('status') + 1).setValue(p.status); return out_({ ok: true }) }
    if (a === 'saveDoctor') return out_(saveDoc_(p.doctor));
    if (a === 'importDoctors') { if (docs_().length) throw Error('ডাক্তার তালিকা ফাঁকা নয়'); p.list.forEach(d => saveDoc_(d)); return out_({ ok: true, n: p.list.length }) }
    if (a === 'getSite') return out_({ ok: true, data: getSite_() });
    if (a === 'saveSite') return out_(saveSite_(p.site));
    if (a === 'uploadImage') return out_({ ok: true, url: drive_(p.data, 'Shajinaz Site', 'site-', 1200) });
    if (a === 'changePassword') { if (String(p.password).length < 8 || String(p.password).length > 100) throw Error('পাসওয়ার্ড ৮+ অক্ষর'); const x = rows_('Users', UC).find(u => u.username === me), s = Utilities.getUuid(); sh_('Users', UC).getRange(x._row, 2, 1, 2).setValues([[s, hash_(p.password, s)]]); return out_({ ok: true }) }
    // নিচের কাজগুলো শুধু মূল অ্যাডমিন
    superOnly_(me);
    if (a === 'users') return out_({ ok: true, me, data: rows_('Users', UC).map(u => ({ username: u.username, name: u.name, email: u.email, mobile: String(u.mobile || '').replace(/^'/, ''), status: stat_(u), role: isSuper_(u) ? 'super' : 'staff' })) });
    if (a === 'createUser') { const n = cl_(p.username, 120); if (!/^[A-Za-z0-9_.@+-]{3,120}$/.test(n) || String(p.password).length < 8) throw Error('ইউজারনেম ৩+ অক্ষর, পাসওয়ার্ড ৮+ অক্ষর'); if (rows_('Users', UC).some(u => lc_(u.username) === lc_(n) || lc_(u.email) === lc_(n))) throw Error('আগে থেকেই আছে'); addUser_({ username: n, password: String(p.password), email: n.indexOf('@') > 0 ? n : '', name: n, status: 'active', role: 'staff' }); return out_({ ok: true }) }
    if (a === 'setUserStatus') { const x = rows_('Users', UC).find(u => u.username === p.username); if (!x || isSuper_(x) || x.username === me || !['active', 'disabled'].includes(p.status)) throw Error('এটি করা যাবে না'); sh_('Users', UC).getRange(x._row, 8).setValue(p.status); return out_({ ok: true }) }
    if (a === 'agents') { const bk = rows_('Bookings', BC); return out_({ ok: true, data: rows_('Agents', AC).map(g => ({ agentId: g.agentId, name: g.name, pharmacy: g.pharmacy, mobile: String(g.mobile || '').replace(/^'/, ''), email: g.email, address: g.address, status: g.status || 'active', bookings: bk.filter(b => b.agentId === g.agentId).length })) }) }
    if (a === 'setAgentStatus') { const g = rows_('Agents', AC).find(x => x.agentId === p.agentId); if (!g || !['active', 'disabled'].includes(p.status)) throw Error('Invalid'); sh_('Agents', AC).getRange(g._row, AC.indexOf('status') + 1).setValue(p.status); return out_({ ok: true }) }
    if (a === 'resetAgentPassword') { const g = rows_('Agents', AC).find(x => x.agentId === p.agentId); if (!g || String(p.password).length < 8 || String(p.password).length > 100) throw Error('পাসওয়ার্ড ৮+ অক্ষর'); const sl = Utilities.getUuid(); sh_('Agents', AC).getRange(g._row, 8, 1, 2).setValues([[sl, hash_(String(p.password), sl)]]); return out_({ ok: true }) }
    if (a === 'deleteAgent') { const g = rows_('Agents', AC).find(x => x.agentId === p.agentId); if (!g) throw Error('Invalid'); sh_('Agents', AC).deleteRow(g._row); return out_({ ok: true }) }
    if (a === 'deleteUser') { const x = rows_('Users', UC).find(u => u.username === p.username); if (!x || isSuper_(x) || x.username === me) throw Error('এটি মোছা যাবে না'); sh_('Users', UC).deleteRow(x._row); return out_({ ok: true }) }
    throw Error('Unsupported');
  } catch (x) { return out_({ ok: false, error: x.message }) }
}
function login_(p) {
  const c = CacheService.getScriptCache(), id = lc_(p.username), k = 'f:' + id;
  if (+c.get(k) >= 5) throw Error('অনেকবার ভুল হয়েছে, ১৫ মিনিট পরে চেষ্টা করুন');
  const u = rows_('Users', UC).find(x => lc_(x.username) === id || (x.email && lc_(x.email) === id));
  if (!u || hash_(String(p.password), u.salt) !== u.hash) { c.put(k, String((+c.get(k) || 0) + 1), 900); throw Error('ইউজারনেম/ইমেইল বা পাসওয়ার্ড ভুল') }
  if (stat_(u) === 'pending') throw Error('আপনার অ্যাকাউন্ট এখনো অনুমোদনের অপেক্ষায় আছে');
  if (stat_(u) !== 'active') throw Error('এই অ্যাকাউন্ট বন্ধ করা হয়েছে');
  const t = Utilities.getUuid() + Utilities.getUuid(); c.put('t:' + t, u.username, 21600);
  return { ok: true, token: t, user: u.username, name: u.name || u.username, role: isSuper_(u) ? 'super' : 'staff' };
}
function signup_(p) {
  if (p.website) throw Error('Rejected');
  const c = CacheService.getScriptCache(), n = +c.get('su') || 0; if (n >= 10) throw Error('অনেক বেশি অনুরোধ এসেছে, পরে চেষ্টা করুন');
  const name = cl_(p.name, 80), email = lc_(p.email), mob = String(p.mobile || '').trim(), pw = String(p.password || '');
  if (!name || !/^[A-Za-z0-9][^\s@]{0,60}@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120 || !/^01\d{9}$/.test(mob) || pw.length < 8 || pw.length > 100) throw Error('নাম, সঠিক ইমেইল, 01XXXXXXXXX মোবাইল নম্বর ও ৮+ অক্ষরের পাসওয়ার্ড দিন');
  const L = LockService.getScriptLock(); L.waitLock(20000);
  try {
    if (rows_('Users', UC).some(u => lc_(u.username) === email || lc_(u.email) === email || String(u.mobile || '').replace(/^'/, '') === mob)) throw Error('এই ইমেইল বা মোবাইল দিয়ে আগেই সাইন আপ হয়েছে');
    const auto = SP().getProperty('AUTO_APPROVE') === 'true';
    addUser_({ username: email, password: pw, email: email, mobile: mob, name: name, status: auto ? 'active' : 'pending', role: 'staff' });
    c.put('su', String(n + 1), 3600);
    try { MailApp.sendEmail(owner_(), 'নতুন স্টাফ সাইন আপ: ' + name, name + '\n' + email + '\n' + mob + '\n\n' + (auto ? 'স্বয়ংক্রিয়ভাবে অনুমোদিত।' : 'অ্যাডমিন প্যানেল > ইউজার ট্যাব থেকে অনুমোদন দিন।')) } catch (e) { }
    return { ok: true, pending: !auto };
  } finally { L.releaseLock() }
}

/* ---------- ফার্মাসিস্ট (এজেন্ট) অ্যাকাউন্ট ---------- */
function secret_() { let s = SP().getProperty('SECRET'); if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); SP().setProperty('SECRET', s) } return s }
const sign_ = m => Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(m, secret_()));
const agTok_ = id => { const m = id + '.' + (Date.now() + 30 * 864e5); return m + '.' + sign_(m) };
function agFrom_(t) {
  const p = String(t || '').split('.'); if (p.length !== 3) throw Error('অ্যাপয়েন্টমেন্ট নিতে ফার্মাসিস্ট লগইন করুন');
  const m = p[0] + '.' + p[1]; if (sign_(m) !== p[2] || +p[1] < Date.now()) throw Error('সেশন শেষ, আবার লগইন করুন');
  const a = rows_('Agents', AC).find(x => x.agentId === p[0]); if (!a) throw Error('অ্যাকাউন্ট পাওয়া যায়নি');
  if ((a.status || 'active') !== 'active') throw Error('এই অ্যাকাউন্ট বন্ধ আছে, হসপিটালে যোগাযোগ করুন'); return a;
}
const prof_ = a => ({ id: a.agentId, name: a.name, pharmacy: a.pharmacy, mobile: String(a.mobile || '').replace(/^'/, ''), email: a.email, address: a.address });
function agentSignup_(p) {
  if (p.website) throw Error('Rejected');
  const c = CacheService.getScriptCache(), n = +c.get('asu') || 0; if (n >= 30) throw Error('অনেক বেশি অনুরোধ এসেছে, পরে চেষ্টা করুন');
  const name = cl_(p.name, 80), ph = cl_(p.pharmacy, 100), mob = String(p.mobile || '').trim(), em = lc_(p.email), ad = cl_(p.address, 200), pw = String(p.password || '');
  if (name.length < 2 || ph.length < 2 || !/^01\d{9}$/.test(mob) || !/^[A-Za-z0-9][^\s@]{0,60}@[^\s@]+\.[^\s@]{2,}$/.test(em) || ad.length < 5 || pw.length < 8 || pw.length > 100) throw Error('সব তথ্য সঠিকভাবে দিন (মোবাইল 01XXXXXXXXX, পাসওয়ার্ড ৮+ অক্ষর)');
  const L = LockService.getScriptLock(); L.waitLock(20000);
  try {
    if (rows_('Agents', AC).some(g => String(g.mobile || '').replace(/^'/, '') === mob || lc_(g.email) === em)) throw Error('এই মোবাইল বা ইমেইল দিয়ে আগেই সাইন আপ হয়েছে');
    const id = 'AG-' + Utilities.getUuid().slice(0, 6).toUpperCase(), sl = Utilities.getUuid();
    sh_('Agents', AC).appendRow([id, new Date(), name, ph, "'" + mob, em, ad, sl, hash_(pw, sl), 'active']);
    c.put('asu', String(n + 1), 3600);
    try { MailApp.sendEmail(owner_(), 'নতুন ফার্মাসিস্ট সাইন আপ: ' + ph, name + '\n' + ph + '\n' + mob + '\n' + em + '\n' + ad) } catch (e) { }
    return { ok: true };
  } finally { L.releaseLock() }
}
function agentLogin_(p) {
  const c = CacheService.getScriptCache(), id = lc_(p.identifier), k = 'af:' + id;
  if (+c.get(k) >= 5) throw Error('অনেকবার ভুল হয়েছে, ১৫ মিনিট পরে চেষ্টা করুন');
  const g = rows_('Agents', AC).find(x => String(x.mobile || '').replace(/^'/, '') === id || lc_(x.email) === id);
  if (!g || hash_(String(p.password), g.salt) !== g.hash) { c.put(k, String((+c.get(k) || 0) + 1), 900); throw Error('মোবাইল/ইমেইল বা পাসওয়ার্ড ভুল') }
  if ((g.status || 'active') !== 'active') throw Error('এই অ্যাকাউন্ট বন্ধ আছে, হসপিটালে যোগাযোগ করুন');
  return { ok: true, token: agTok_(g.agentId), profile: prof_(g) };
}
function agentMe_(p) {
  const a = agFrom_(p.agentToken);
  const mine = rows_('Bookings', BC).filter(b => b.agentId === a.agentId).reverse().slice(0, 10).map(b => ({ id: b.bookingId, doctor: b.doctorName, date: String(b.date).slice(0, 10), patient: b.patientName, status: b.status }));
  return { ok: true, profile: prof_(a), bookings: mine };
}

/* ---------- ছবি আপলোড (Drive) ---------- */
function drive_(b64, folder, prefix, size) {
  if (!b64 || String(b64).length > 4000000) throw Error('ছবি অনেক বড়');
  const b = Utilities.newBlob(Utilities.base64Decode(b64), 'image/jpeg', prefix + Date.now() + '.jpg'),
    it = DriveApp.getFoldersByName(folder), f = it.hasNext() ? it.next() : DriveApp.createFolder(folder), fl = f.createFile(b);
  fl.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return 'https://drive.google.com/thumbnail?id=' + fl.getId() + '&sz=w' + size;
}
function saveDoc_(d) {
  const n = cl_(d.name, 120); if (!n) throw Error('নাম দিন');
  const sl = (d.slots || []).filter(s => s.days && s.days.length && /^\d\d:\d\d$/.test(s.start) && /^\d\d:\d\d$/.test(s.end));
  let photo = cl_(d.photo, 300); if (d.photoData) photo = drive_(d.photoData, 'Shajinaz Doctors', 'doctor-', 600);
  const id = d.id || 'SH-D' + Utilities.getUuid().slice(0, 6).toUpperCase(),
    row = [id, n, cl_(d.department, 90), cl_(d.degree, 180), JSON.stringify(sl), d.active !== false, photo, d.gender === 'F' ? 'F' : 'M'],
    r = rows_('Doctors', DC).find(x => String(x.id) === String(id)), s = sh_('Doctors', DC);
  r ? s.getRange(r._row, 1, 1, 8).setValues([row]) : s.appendRow(row); return { ok: true, id };
}

/* ---------- বুকিং ---------- */
function book_(p) {
  if (p.website) throw Error('Rejected');
  const ag = agFrom_(p.agentToken), cc = CacheService.getScriptCache(), bk = 'bk:' + ag.agentId + Utilities.formatDate(new Date(), 'Asia/Dhaka', 'yyyyMMdd');
  if ((+cc.get(bk) || 0) >= 60) throw Error('আজকের সর্বোচ্চ বুকিং সীমা শেষ');
  const name = cl_(p.patientName, 100), mob = String(p.mobile || '').trim(), age = String(p.age || '').trim(), date = String(p.date || '');
  if (!name || !/^01\d{9}$/.test(mob) || !/^\d{1,3}$/.test(age) || !/^\d{4}-\d\d-\d\d$/.test(date)) throw Error('তথ্য সঠিক নয়');
  const today = Utilities.formatDate(new Date(), 'Asia/Dhaka', 'yyyy-MM-dd'); if (date < today) throw Error('অতীতের তারিখ');
  const d = docs_().find(x => x.id === String(p.doctorId) && x.active), wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date + 'T12:00:00+06:00').getUTCDay()];
  if (!d || !d.slots.some(s => s.days.includes(wd))) throw Error('এই দিনে ডাক্তার বসেন না');
  const L = LockService.getScriptLock(); L.waitLock(20000);
  try {
    const id = 'SH-' + date.replace(/-/g, '') + '-' + Utilities.getUuid().slice(0, 5).toUpperCase(), P = prof_(ag);
    // এজেন্টের নাম, ফোন, ঠিকানা লগইন করা অ্যাকাউন্ট থেকেই বসে (ফর্মের ডেটা বিশ্বাস করা হয় না)
    sh_('Bookings', BC).appendRow([id, new Date(), name, "'" + mob, age, d.id, d.name, date, cl_(P.pharmacy, 100), cl_(P.name, 100), "'" + P.mobile, cl_(P.address, 200), 'Pending', P.id]);
    cc.put(bk, String((+cc.get(bk) || 0) + 1), 90000);
    const msg = '🏥 নতুন অ্যাপয়েন্টমেন্ট ' + id + '\nডাক্তার: ' + d.name + '\nতারিখ: ' + date + '\nরোগী: ' + name + ' (' + age + ' বছর)\nরোগীর মোবাইল: ' + mob + '\n\nফার্মেসি: ' + P.pharmacy + '\nএজেন্ট: ' + P.name + ' · ' + P.mobile + '\nঠিকানা: ' + P.address;
    try { MailApp.sendEmail(owner_(), 'নতুন অ্যাপয়েন্টমেন্ট: ' + d.name, msg) } catch (e) { }
    try { if (P.email) MailApp.sendEmail(P.email, 'অ্যাপয়েন্টমেন্ট রিকোয়েস্ট পাঠানো হয়েছে: ' + id, 'সাজিনাস হসপিটাল\n\n' + msg + '\n\nহসপিটাল থেকে যোগাযোগ করা হবে। জরুরি প্রয়োজনে: 01886 338 811') } catch (e) { }
    const k = SP().getProperty('CALLMEBOT_KEY');
    if (k) try { UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone=' + WA_PHONE + '&apikey=' + k + '&text=' + encodeURIComponent(msg)) } catch (e) { }
    return { ok: true, id, notified: !!k };
  } finally { L.releaseLock() }
}
