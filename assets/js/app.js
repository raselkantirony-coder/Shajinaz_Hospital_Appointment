(()=>{
const $=s=>document.querySelector(s),API=window.SH_CONFIG.API_URL,WA=window.SH_CONFIG.WHATSAPP,PAGE=12;
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],BD={Sun:'রবি',Mon:'সোম',Tue:'মঙ্গল',Wed:'বুধ',Thu:'বৃহঃ',Fri:'শুক্র',Sat:'শনি'};
const DEPT={'Medicine':'মেডিসিন','Critical Care':'ক্রিটিক্যাল কেয়ার','Transfusion Medicine':'ট্রান্সফিউশন মেডিসিন','ENT':'নাক-কান-গলা','Gynae and Obs':'গাইনি ও প্রসূতি','Diabetes and Endocrinology':'ডায়াবেটিস ও হরমোন','Nephrology':'কিডনি','Gastroenterology':'গ্যাস্ট্রো','Cardiology':'হৃদরোগ','Dermatology':'চর্মরোগ','Pediatric':'শিশু','Neurology':'নিউরোলজি','Neuro-Surgery':'নিউরোসার্জারি','Urology':'ইউরোলজি','Orthopedic':'অর্থোপেডিক','Surgery':'সার্জারি','Hematology':'হেমাটোলজি','Oncology':'ক্যান্সার','Chest & Respiratory Medicine':'বক্ষব্যাধি'};
const IC={'Medicine':'🩺','Critical Care':'🫀','Transfusion Medicine':'🩸','ENT':'👂','Gynae and Obs':'🤰','Diabetes and Endocrinology':'🧪','Nephrology':'🫘','Gastroenterology':'🍽️','Cardiology':'❤️','Dermatology':'🧴','Pediatric':'🧸','Neurology':'🧠','Neuro-Surgery':'🧠','Urology':'💧','Orthopedic':'🦴','Surgery':'🔪','Hematology':'🩸','Oncology':'🎗️','Chest & Respiratory Medicine':'🫁'};

const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,$$=s=>[...document.querySelectorAll(s)];
const safe=u=>/^(https?:\/\/|assets\/|tel:|mailto:|#)/i.test(String(u||''))?u:'';
window.shErr=(el,key)=>{if(key&&!el.dataset.f){el.dataset.f=1;el.src='assets/services/'+String(key).replace(/[^a-z0-9_-]/gi,'')+'.svg'}else el.remove()};
// ===== সাইট কনটেন্ট (অ্যাডমিন থেকে বদলানো যায়) =====
let SITE=window.SH_MERGE(window.SH_SITE,(()=>{try{return JSON.parse(localStorage.getItem('sh_site'))}catch(e){return null}})()),ALL=[];
const bn=n=>String(n).replace(/\d/g,d=>'০১২৩৪৫৬৭৮৯'[d]),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tm=t=>{let[h,m]=t.split(':').map(Number),p=h>=12?'PM':'AM';h=h%12||12;return bn(h+':'+String(m).padStart(2,'0'))+' '+p};
const dhaka=d=>new Date(d.toLocaleString('en-US',{timeZone:'Asia/Dhaka'})),todayK=()=>DAYS[dhaka(new Date()).getDay()];
const av=g=>`<svg viewBox="0 0 100 100" role="img" aria-label="ছবি নেই"><defs><linearGradient id="g${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g=='F'?'#f6d3e2':'#cfe6fb'}"/><stop offset="1" stop-color="${g=='F'?'#e7a9c4':'#8fb8e8'}"/></linearGradient></defs><rect width="100" height="100" fill="url(#g${g})"/>${g=='F'?'<path d="M26 66c-6-30 6-46 24-46s30 16 24 46c-4-10-8-16-24-16S30 56 26 66z" fill="#4a2f3a"/>':'<path d="M33 42c0-14 8-20 17-20s17 6 17 20z" fill="#2f3a4a"/>'}<circle cx="50" cy="45" r="15" fill="#f2c9a5"/><path d="M18 100c2-20 14-30 32-30s30 10 32 30z" fill="#fff"/><path d="M42 72l8 14 8-14" fill="none" stroke="#14307a" stroke-width="3"/></svg>`;
const dio=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');dio.unobserve(x.target)}}),{threshold:.08,rootMargin:'0px 0px -4% 0px'});
let dept='সব',list=[],shown=PAGE;
const sitting=d=>(d.slots||[]).some(s=>s.days.includes(todayK())),pic=d=>d.photo?`<img loading="lazy" src="${esc(d.photo)}" alt="${esc(d.name)}">`:av(d.gender);
function render(){const q=$('#q').value.trim().toLowerCase(),t=$('#today').checked;
list=ALL.filter(d=>(dept=='সব'||d.department==dept)&&(!t||sitting(d))&&(!q||(d.name+' '+d.department+' '+(DEPT[d.department]||'')).toLowerCase().includes(q)));
$('#meta').textContent=`${bn(list.length)} জন ডাক্তার`;
$('#grid').innerHTML=list.slice(0,shown).map((d,i)=>`<article class="dc" data-id="${d.id}" tabindex="0" style="animation-delay:${(i%4)*90}ms"><div class="ph">${pic(d)}${sitting(d)?'<span class="live">আজ বসছেন</span>':''}<span class="bk">অ্যাপয়েন্টমেন্ট নিন</span></div><div class="nm"><h3>${esc(d.name)}</h3><span>${esc((IC[d.department]||'')+' '+(DEPT[d.department]||d.department))}</span></div></article>`).join('')||'<p>কোনো ডাক্তার পাওয়া যায়নি।</p>';
document.querySelectorAll('#grid .dc').forEach(c=>dio.observe(c));$('#more').hidden=list.length<=shown;$('#more').textContent=`আরও ডাক্তার দেখুন (${bn(list.length-shown)})`}
function chips(){const cnt={};ALL.forEach(d=>d.department&&(cnt[d.department]=(cnt[d.department]||0)+1));$('#deptSel').innerHTML=`<option value="সব">সব বিভাগ (${bn(ALL.length)})</option>`+Object.keys(cnt).map(x=>`<option value="${esc(x)}" ${x==dept?'selected':''}>${esc((IC[x]||'')+' '+(DEPT[x]||x))} (${bn(cnt[x])})</option>`).join('')}
$('#deptSel').onchange=e=>{dept=e.target.value;shown=PAGE;render()};
$('#q').oninput=()=>{shown=PAGE;render()};$('#today').onchange=()=>{shown=PAGE;render()};$('#more').onclick=()=>{shown+=PAGE;render()};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),3500)};
// card tilt
$('#grid').addEventListener('pointermove',e=>{const c=e.target.closest('.dc');if(!c||e.pointerType=='touch')return;const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*8+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*8+'deg')});
$('#grid').addEventListener('pointerout',e=>{const c=e.target.closest('.dc');if(c){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}});

// ===== রেন্ডার ফাংশন =====
const imgTag=(src,key,alt)=>`<img src="${esc(safe(src)||('assets/services/'+key+'.jpg'))}" alt="${esc(alt)}" loading="lazy" draggable="false" onerror="shErr(this,'${esc(key||'')}')">`;
const statVal=k=>k.type=='doctors'?ALL.length:k.type=='depts'?new Set(ALL.map(d=>d.department)).size:k.type=='today'?ALL.filter(sitting).length:(+k.value||0);
const cio=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){const el=x.target;count(el,+el.dataset.count);el.dataset.shown=el.dataset.count;cio.unobserve(el)}}),{threshold:.5});
function count(el,n){let t0;const suf=el.dataset.suf||'',f=t=>{t0??=t;const p=Math.min((t-t0)/1700,1),e=1-Math.pow(1-p,3);el.textContent=bn(Math.round(n*e))+(p>=1?suf:'');if(p<1)requestAnimationFrame(f)};RM||SITE.anim.on===false?(el.textContent=bn(n)+suf):requestAnimationFrame(f)}
function fillStats(){$$('[data-stat]').forEach(el=>{const k=(el.dataset.src=='band'?SITE.band.stats:SITE.kpis)[+el.dataset.stat];if(!k)return;if(k.type!='manual'&&!ALL.length)return;const n=statVal(k);if(el.dataset.shown==n)return;el.dataset.count=n;el.dataset.suf=k.suf||'';cio.observe(el)})}
let lastTitle='';
function renderSite(){const S=SITE,H=S.hero;
document.documentElement.classList.toggle('calm',S.anim.on===false);
$('#hTag').textContent=H.tag;$('#hLead').textContent=H.lead;
$('#hC1').textContent=H.cta1;$('#hC2').textContent=H.cta2;
if(H.title!==lastTitle){lastTitle=H.title;$('#h1').innerHTML=H.title.split(' ').map((w,i)=>`<span style="animation-delay:${.15+i*.12}s">${esc(w)}</span>`).join(' ')}
$('#kp').innerHTML=S.kpis.map((k,i)=>`<div><i>${esc(k.icon)}</i><b data-stat="${i}" data-src="kpis">০</b><span>${esc(k.label)}</span></div>`).join('');
$('#quick').innerHTML=S.quick.map(q=>`<a href="${esc(safe(q.href)||'#')}"${q.act?` data-act="${esc(q.act)}"`:''}><i>${esc(q.icon)}</i><span><b>${esc(q.title)}</b><small>${esc(q.sub)}</small></span></a>`).join('');
const sv=S.services.items.filter(x=>x.on!==false);
$('#svE').textContent=S.services.eyebrow;$('#svH').textContent=S.services.title;
$('#svRing').innerHTML=sv.map(s=>`<article class="sc" style="--c:${/^#[0-9a-f]{3,8}$/i.test(s.color)?s.color:'#2c6fd1'}"><div class="im"><span class="em" aria-hidden="true">${esc(s.icon)}</span><div class="cl">${imgTag(s.img,s.key,s.title)}</div><span class="ic2">${esc(s.icon)}</span>${s.badge?`<span class="rib">${esc(s.badge)}</span>`:''}</div><div class="tx"><h3>${esc(s.title)}</h3><p>${esc(s.sub)}</p></div><i class="bar"></i></article>`).join('');
const m=sv.map(s=>`<span>${esc(s.icon)} ${esc(s.title)}</span>`).join('');$('#mq').innerHTML=m+m;
$('#stE').textContent=S.steps.eyebrow;$('#stH').textContent=S.steps.title;
$('#steps').innerHTML=S.steps.items.map((s,i)=>`<li class="rv" data-i="${i*2}"><span class="ico">${esc(s.icon)}</span><b>${bn(i+1)}</b><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('');
$$('#steps .rv').forEach(e=>io.observe(e));
$('#bH').textContent=S.band.title;$('#bT').textContent=S.band.text;
$('#bn').innerHTML=S.band.stats.map((k,i)=>`<div><b data-stat="${i}" data-src="band">০</b><span>${esc(k.label)}</span></div>`).join('');
buildRing();svcRing.build();fillStats()}
// ===== ফার্মাসিস্ট (এজেন্ট) লগইন =====
const dlg=$('#dlg'),dbody=$('#dbody'),ST={Pending:'অপেক্ষমাণ',Confirmed:'নিশ্চিত',Cancelled:'বাতিল',Done:'সম্পন্ন'};
let AG=null,AGB=[];try{AG=JSON.parse(localStorage.getItem('sh_ag'))}catch(e){}
const saveAg=()=>{try{AG?localStorage.setItem('sh_ag',JSON.stringify(AG)):localStorage.removeItem('sh_ag')}catch(e){}};
async function api(a,p={}){if(!API)throw Error('সিস্টেম এখনো সংযুক্ত নয়, সরাসরি কল করুন: 01886 338 811');const r=await(await fetch(API,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({action:a,...p})})).json();if(!r.ok)throw Error(r.error);return r}
function agUI(){$('#agBtn').innerHTML=AG?`<span aria-hidden="true">👤</span><span class="lb">${esc(AG.profile.name.split(' ')[0])}</span>`:`<span aria-hidden="true">🔑</span><span class="lb">ফার্মাসিস্ট লগইন</span>`;$('#agBtn').classList.toggle('in',!!AG);bell()}
function bell(){const n=$('#bellN'),pn=AGB.filter(x=>x.status=='Pending').length;n.hidden=!pn;n.textContent=bn(pn);
$('#notes').innerHTML=!AG?'<p>অ্যাপয়েন্টমেন্ট নেওয়া ও দেখতে <b>ফার্মাসিস্ট লগইন</b> করুন।</p>':AGB.length?AGB.map(x=>`<p><b>${esc(x.doctor)}</b><br>${esc(x.patient)} · ${esc(x.date)}<br><span class="stt ${esc(x.status)}">${ST[x.status]||esc(x.status)}</span> · ${esc(x.id)}</p>`).join(''):'<p>এখনো কোনো অ্যাপয়েন্টমেন্ট নেই।</p>'}
async function refreshAg(){if(!AG)return agUI();try{const r=await api('agentMe',{agentToken:AG.token});AG.profile=r.profile;AGB=r.bookings;saveAg()}catch(e){if(/সেশন|লগইন|অ্যাকাউন্ট/.test(e.message)){AG=null;AGB=[];saveAg()}}agUI()}
$('#bell').onclick=()=>{$('#notes').hidden=!$('#notes').hidden;if(!$('#notes').hidden)refreshAg()};
function authHTML(note){const f=(l,n,x='')=>`<label class="f">${l}<input class="t" name="${n}" required ${x}></label>`;
return `<div class="auth"><div class="atabs"><button type="button" data-am="in" class="on">লগইন</button><button type="button" data-am="up">সাইন আপ</button></div><p class="anote" id="anote">${note}</p>
<form id="alf">${f('মোবাইল নম্বর বা ইমেইল','identifier','autocomplete="username"')}${f('পাসওয়ার্ড','password','type="password" autocomplete="current-password"')}<button class="btn pri wide">লগইন করুন</button></form>
<form id="asf" hidden><div class="fg">${f('আপনার নাম','name','maxlength="80" autocomplete="name"')}${f('ফার্মেসির নাম','pharmacy','maxlength="100"')}<label class="f w">মোবাইল নম্বর<input class="t" name="mobile" required inputmode="numeric" pattern="01[0-9]{9}" placeholder="01XXXXXXXXX" autocomplete="tel"></label><label class="f w">ইমেইল<input class="t" type="email" name="email" required autocomplete="email"></label><label class="f w">ফার্মেসির ঠিকানা<input class="t" name="address" required minlength="5" maxlength="200" autocomplete="street-address"></label><label class="f w">পাসওয়ার্ড (৮+ অক্ষর)<input class="t" type="password" name="password" required minlength="8" autocomplete="new-password"></label></div><input class="hp" name="website" tabindex="-1" autocomplete="off"><button class="btn pri wide">সাইন আপ করুন</button></form></div>`}
function wireAuth(after){const L=$('#alf'),Sg=$('#asf'),note=$('#anote');
const mode=m=>{L.hidden=m!='in';Sg.hidden=m!='up';document.querySelectorAll('.atabs button').forEach(b=>b.classList.toggle('on',b.dataset.am==m))};
document.querySelectorAll('.atabs button').forEach(b=>b.onclick=()=>mode(b.dataset.am));
L.onsubmit=async e=>{e.preventDefault();const b=L.querySelector('button');b.disabled=true;try{const r=await api('agentLogin',Object.fromEntries(new FormData(L)));AG={token:r.token,profile:r.profile};saveAg();toast('স্বাগতম, '+AG.profile.name);await refreshAg();after()}catch(x){b.disabled=false;note.className='anote err';note.textContent=x.message}};
Sg.onsubmit=async e=>{e.preventDefault();const b=Sg.querySelector('button');b.disabled=true;const fd=Object.fromEntries(new FormData(Sg));try{await api('agentSignup',fd);b.disabled=false;mode('in');L.identifier.value=fd.mobile;note.className='anote ok';note.textContent='সাইন আপ সম্পন্ন! এখন পাসওয়ার্ড দিয়ে লগইন করুন।';L.password.focus()}catch(x){b.disabled=false;note.className='anote err';note.textContent=x.message}}}
function openAuth(note,after){dbody.innerHTML=`<h3>ফার্মাসিস্ট লগইন</h3>`+authHTML(note);dlg.showModal();wireAuth(after||(()=>dlg.close()))}
function account(){dbody.innerHTML=`<h3>👤 ${esc(AG.profile.name)}</h3><div class="acc"><p>🏪 ${esc(AG.profile.pharmacy)}</p><p>📞 ${esc(AG.profile.mobile)}</p><p>✉️ ${esc(AG.profile.email)}</p><p>📍 ${esc(AG.profile.address)}</p></div><h4>আমার সাম্প্রতিক অ্যাপয়েন্টমেন্ট</h4><div id="myb">${AGB.length?AGB.map(x=>`<div class="mb"><b>${esc(x.doctor)}</b><span>${esc(x.patient)} · ${esc(x.date)}</span><span class="stt ${esc(x.status)}">${ST[x.status]||esc(x.status)}</span></div>`).join(''):'<p>এখনো কোনো অ্যাপয়েন্টমেন্ট নেই।</p>'}</div><button class="btn ghost wide" id="lgo" style="margin-top:16px">লগআউট</button>`;dlg.showModal();$('#lgo').onclick=()=>{AG=null;AGB=[];saveAg();agUI();dlg.close();toast('লগআউট হয়েছে')};refreshAg().then(()=>{if(AG&&dlg.open&&$('#myb')&&AGB.length)$('#myb').innerHTML=AGB.map(x=>`<div class="mb"><b>${esc(x.doctor)}</b><span>${esc(x.patient)} · ${esc(x.date)}</span><span class="stt ${esc(x.status)}">${ST[x.status]||esc(x.status)}</span></div>`).join('')})}
$('#agBtn').onclick=()=>AG?account():openAuth('ফার্মাসিস্টরা সাইন আপ করে লগইন করলে অ্যাপয়েন্টমেন্ট দিতে পারবেন।');
// ===== অ্যাপয়েন্টমেন্ট বুকিং =====
function nextDates(d){const out=[],now=dhaka(new Date());for(let i=0;i<21&&out.length<8;i++){const x=new Date(now);x.setDate(now.getDate()+i);const k=DAYS[x.getDay()];if(d.slots.some(s=>s.days.includes(k)))out.push({v:x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'),l:i?BD[k]:'আজ',n:bn(x.getDate())+'/'+bn(x.getMonth()+1)})}return out}
function open(id){const d=ALL.find(x=>x.id==id),ds=nextDates(d);
const head=`<div class="dh"><div class="ph">${pic(d)}</div><div><h3>${esc(d.name)}</h3><span class="dept">${esc(DEPT[d.department]||d.department)}</span>${d.degree?`<div class="sl">${esc(d.degree)}</div>`:''}</div></div>`+d.slots.map(s=>`<div class="sl">🕒 ${s.days.map(x=>BD[x]).join(', ')}: ${tm(s.start)}–${tm(s.end)}</div>`).join('');
if(!ds.length){dbody.innerHTML=head+`<p>এই ডাক্তারের সময়সূচি এখনো যোগ হয়নি। অনুগ্রহ করে <a href="tel:+8801886338811"><b>01886 338 811</b></a> নম্বরে কল করুন।</p>`;return dlg.showModal()}
if(!AG){dbody.innerHTML=head+`<h4>অ্যাপয়েন্টমেন্ট নিতে ফার্মাসিস্ট লগইন করুন</h4>`+authHTML('অ্যাপয়েন্টমেন্ট শুধু নিবন্ধিত ফার্মাসিস্টদের মাধ্যমে নেওয়া যায়। নতুন হলে "সাইন আপ" চাপুন।');dlg.showModal();return wireAuth(()=>open(id))}
const P=AG.profile;
dbody.innerHTML=head+`<form id="bf"><div class="agi"><b>✅ ফার্মাসিস্ট হিসেবে লগইন আছেন</b><span>${esc(P.name)} · ${esc(P.pharmacy)}</span><span>📞 ${esc(P.mobile)}</span><span>📍 ${esc(P.address)}</span><small>এই তথ্য অ্যাপয়েন্টমেন্টের সাথে নিজে নিজেই যাবে।</small></div><h4>তারিখ বেছে নিন</h4><div class="days">${ds.map((x,i)=>`<label><input type="radio" name="date" value="${x.v}" ${i?'':'checked'}><span>${x.l}<br>${x.n}</span></label>`).join('')}</div>
<h4>রোগীর তথ্য</h4><div class="fg"><label class="f w">রোগীর নাম<input class="t" name="patientName" required maxlength="100" autocomplete="off"></label><label class="f">রোগীর বয়স<input class="t" name="age" required inputmode="numeric" pattern="[0-9]{1,3}" maxlength="3"></label><label class="f">রোগীর মোবাইল<input class="t" name="mobile" required inputmode="numeric" pattern="01[0-9]{9}" placeholder="01XXXXXXXXX" autocomplete="off"></label></div>
<input class="hp" name="website" tabindex="-1" autocomplete="off"><button class="btn pri wide" style="margin-top:18px" id="sb">রিকোয়েস্ট পাঠান</button></form>`;
dlg.showModal();const f=$('#bf');
f.onsubmit=async ev=>{ev.preventDefault();const fd=Object.fromEntries(new FormData(f)),sb=$('#sb');sb.disabled=true;sb.textContent='পাঠানো হচ্ছে…';
try{const r=await api('book',{doctorId:d.id,agentToken:AG.token,...fd});
AGB.unshift({id:r.id,doctor:d.name,date:fd.date,patient:fd.patientName,status:'Pending'});bell();
dbody.innerHTML=`<div class="ok"><svg class="tick" viewBox="0 0 72 72"><circle cx="36" cy="36" r="31"/><path d="M22 37l10 10 19-21"/></svg><h3>রিকোয়েস্ট পাঠানো হয়েছে</h3><p>বুকিং আইডি: <b>${esc(r.id)}</b><br>${esc(d.name)} · ${esc(fd.date)}<br>রোগী: ${esc(fd.patientName)}<br>হসপিটাল থেকে যোগাযোগ করা হবে।</p></div>`}
catch(err){sb.disabled=false;sb.textContent='রিকোয়েস্ট পাঠান';if(/সেশন|লগইন|অ্যাকাউন্ট/.test(err.message)){AG=null;saveAg();agUI();dlg.close();toast(err.message);return}toast('পাঠানো যায়নি: '+err.message)}}}
$('#grid').onclick=e=>{const c=e.target.closest('.dc');if(c)open(c.dataset.id)};$('#grid').onkeydown=e=>{if(e.key=='Enter'){const c=e.target.closest('.dc');if(c)open(c.dataset.id)}};
// ===== ৩ডি ঘূর্ণায়মান ক্যারোসেল (হিরো ও সেবা) =====
const RINGS=[];
function Ring(o){const st=o.stage,rg=o.ring,dt=o.dots;let cds=[],dts=[],N=1,STEP=360,ang=0,tgt=null,hold=0,drag=null,act=-1,R=480;
const norm=a=>((a%360)+540)%360-180;
const api={build(){cds=[...rg.children];N=Math.max(cds.length,1);STEP=360/N;act=-1;dt.innerHTML=cds.map((_,i)=>`<button aria-label="${i+1}" data-i="${i}"></button>`).join('');dts=[...dt.children];api.size()},
size(){if(!cds.length)return;const W=st.clientWidth,[cw,ch]=o.dim(W);R=Math.round(cw/2/Math.tan(Math.PI/Math.max(N,3))*1.08);st.style.setProperty('--cw',cw+'px');st.style.setProperty('--ch',ch+'px');st.style.height=o.h(ch)+'px';cds.forEach((c,i)=>c.style.transform=`rotateY(${i*STEP}deg) translateZ(${R}px)${o.main&&i===0?' scale(1.16)':''}`)},
go(d){tgt=(Math.round(ang/STEP)+d)*STEP;hold=performance.now()+4500},
tick(t){if(!cds.length)return;const r=st.getBoundingClientRect();if(r.bottom<-100||r.top>innerHeight+100)return;
if(tgt!==null){const d=norm(tgt-ang);ang+=d*.1;if(Math.abs(d)<.2)tgt=null}else if(!drag&&!RM&&SITE.anim.on!==false&&t>hold&&!st.matches(':hover'))ang+=o.speed*(+SITE.anim.speed||1);
rg.style.transform=`translateZ(${-R}px) rotateY(${-ang}deg)`;let best=0,bd=999;
cds.forEach((c,i)=>{const d=Math.abs(norm(i*STEP-ang)),cs=Math.cos(d*Math.PI/180);c.style.opacity=Math.max(0,(cs+.3)/1.3)**1.4;c.style.filter=d>20?`saturate(${.6+.4*Math.max(cs,0)})`:'none';if(d<bd){bd=d;best=i}});
if(best!==act){act=best;dts.forEach((x,k)=>x.classList.toggle('on',k===best));cds.forEach((c,k)=>c.classList.toggle('act',k===best));o.onAct&&o.onAct(best)}}};
dt.addEventListener('click',e=>{const b=e.target.closest('button');if(b){tgt=+b.dataset.i*STEP;hold=performance.now()+4500}});
st.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;drag={x:e.clientX,a:ang};st.setPointerCapture(e.pointerId);st.classList.add('grab')});
st.addEventListener('pointermove',e=>{if(drag){ang=drag.a-(e.clientX-drag.x)*.35;tgt=null}});
const end=()=>{if(drag){drag=null;hold=performance.now()+2500;st.classList.remove('grab')}};st.addEventListener('pointerup',end);st.addEventListener('pointercancel',end);
addEventListener('resize',api.size);RINGS.push(api);return api}
const stage=$('#show'),ring=$('#ring');let SHOW=[];
const heroRing=Ring({stage,ring,dots:$('#dots'),speed:.22,main:true,dim:W=>{const cw=Math.round(Math.min(268,Math.max(160,W<560?W*.52:W*.4)));return[cw,Math.round(cw*1.2)]},h:ch=>Math.round(ch*1.12+118),onAct:i=>{if(SHOW[i]){$('#capT').textContent=SHOW[i].t;$('#capS').textContent=SHOW[i].s}}});
const svcRing=Ring({stage:$('#svs'),ring:$('#svRing'),dots:$('#svDots'),speed:.16,dim:W=>{const cw=Math.round(Math.min(310,Math.max(214,W<560?W*.66:W*.26)));return[cw,Math.round(cw*1.3)]},h:ch=>ch+60});
$('#svPrev').onclick=()=>svcRing.go(-1);$('#svNext').onclick=()=>svcRing.go(1);
function buildRing(){const b=SITE.building;SHOW=[{t:b.title,s:b.sub,i:b.icon,img:b.img,key:'',main:true}].concat(SITE.services.items.filter(x=>x.on!==false&&x.hero!==false).map(x=>({t:x.title,s:x.sub,i:x.icon,img:x.img,key:x.key})));
ring.innerHTML=SHOW.map(s=>`<figure class="cd${s.main?' main':''}"><span class="em" aria-hidden="true">${esc(s.i)}</span>${imgTag(s.img,s.key,s.t)}<figcaption><i>${esc(s.i)}</i><span><b>${esc(s.t)}</b><small>${esc(s.s)}</small></span></figcaption></figure>`).join('');heroRing.build()}
function frame(t){RINGS.forEach(r=>r.tick(t));requestAnimationFrame(frame)}requestAnimationFrame(frame);
// ===== হিরো স্পটলাইট, স্ক্রল প্রগ্রেস =====
const hero=$('#hero');if(!RM)hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--sx',e.clientX-r.left+'px');hero.style.setProperty('--sy',e.clientY-r.top+'px')});
addEventListener('scroll',()=>{const h=document.documentElement;$('#prog').style.transform=`scaleX(${scrollY/(h.scrollHeight-innerHeight||1)})`;document.querySelector('.top').classList.toggle('sc',scrollY>8)},{passive:true});
$('#quick').addEventListener('click',e=>{const a=e.target.closest('a[data-act="today"]');if(a){$('#today').checked=true;shown=PAGE;render()}});
// ===== স্ক্রল রিভিল =====
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.style.transitionDelay=(x.target.dataset.i||0)*80+'ms';x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
$$('.rv').forEach(e=>io.observe(e));
function strip(){const t=ALL.filter(sitting).slice(0,16),k=todayK();$('#tdy').hidden=!t.length;
const h=t.map(d=>{const sl=d.slots.find(x=>x.days.includes(k));return `<button class="tp" data-id="${esc(d.id)}"><span class="av">${pic(d)}</span><span><b>${esc(d.name)}</b><small>${esc(DEPT[d.department]||d.department)}${sl?' · '+tm(sl.start):''}</small></span></button>`}).join('');$('#tdyIn').innerHTML=h+h}
$('#tdyIn').onclick=e=>{const b=e.target.closest('.tp');if(b)open(b.dataset.id)};
// ===== চালু করা =====
renderSite();agUI();refreshAg();
(async()=>{ALL=window.SH_DOCTORS.filter(d=>d.active);
const get=async a=>{try{return await(await fetch(API+'?action='+a)).json()}catch(e){return null}};
if(API){const [dr,sr]=await Promise.all([get('doctors'),get('site')]);
 if(dr&&dr.ok&&dr.data.length)ALL=dr.data;
 if(sr&&sr.ok){try{localStorage.setItem('sh_site',JSON.stringify(sr.data))}catch(e){}const n=window.SH_MERGE(window.SH_SITE,sr.data);if(JSON.stringify(n)!==JSON.stringify(SITE)){SITE=n;renderSite()}}}
fillStats();chips();render();strip()})();
})();
