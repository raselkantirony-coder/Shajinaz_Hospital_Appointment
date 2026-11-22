(()=>{
const $=s=>document.querySelector(s),API=window.SH_CONFIG.API_URL,WA=window.SH_CONFIG.WHATSAPP,PAGE=12;
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],BD={Sun:'রবি',Mon:'সোম',Tue:'মঙ্গল',Wed:'বুধ',Thu:'বৃহঃ',Fri:'শুক্র',Sat:'শনি'};
const DEPT={'Medicine':'মেডিসিন','Critical Care':'ক্রিটিক্যাল কেয়ার','Transfusion Medicine':'ট্রান্সফিউশন মেডিসিন','ENT':'নাক-কান-গলা','Gynae and Obs':'গাইনি ও প্রসূতি','Diabetes and Endocrinology':'ডায়াবেটিস ও হরমোন','Nephrology':'কিডনি','Gastroenterology':'গ্যাস্ট্রো','Cardiology':'হৃদরোগ','Dermatology':'চর্মরোগ','Pediatric':'শিশু','Neurology':'নিউরোলজি','Neuro-Surgery':'নিউরোসার্জারি','Urology':'ইউরোলজি','Orthopedic':'অর্থোপেডিক','Surgery':'সার্জারি','Hematology':'হেমাটোলজি','Oncology':'ক্যান্সার','Chest & Respiratory Medicine':'বক্ষব্যাধি'};
const IC={'Medicine':'🩺','Critical Care':'🫀','Transfusion Medicine':'🩸','ENT':'👂','Gynae and Obs':'🤰','Diabetes and Endocrinology':'🧪','Nephrology':'🫘','Gastroenterology':'🍽️','Cardiology':'❤️','Dermatology':'🧴','Pediatric':'🧸','Neurology':'🧠','Neuro-Surgery':'🧠','Urology':'💧','Orthopedic':'🦴','Surgery':'🔪','Hematology':'🩸','Oncology':'🎗️','Chest & Respiratory Medicine':'🫁'};
const SVC=[['emergency','২৪/৭ ইমার্জেন্সি','জরুরি রোগীর তাৎক্ষণিক সেবা','🚑','big'],['icu','ICU','নিবিড় পরিচর্যা ইউনিট','🛏️'],['ambulance','অ্যাম্বুলেন্স সার্ভিস','দ্রুত ও নিরাপদ পরিবহন','🚐'],['nicu','NICU','নবজাতকের বিশেষ যত্ন','👶','c4'],['picu','PICU','শিশুদের নিবিড় পরিচর্যা','🧒','c5'],['bloodbank','ব্লাড ব্যাংক','নিরাপদ রক্ত, সার্বক্ষণিক','🩸'],['diagnostics','ডায়াগনস্টিক','আধুনিক পরীক্ষা-নিরীক্ষা','🔬'],['transfusion','ট্রান্সফিউশন মেডিসিন','রক্ত সঞ্চালন বিশেষজ্ঞ সেবা','💉'],['gynae','গাইনি ও প্রসূতি','মা ও শিশুর সুরক্ষা','🤰','c4'],['pediatrics','শিশু রোগ','অভিজ্ঞ শিশু বিশেষজ্ঞ','🧸','c2'],['surgery','জেনারেল সার্জারি','অভিজ্ঞ সার্জন টিম','🩺','c3'],['thalassemia','থ্যালাসেমিয়া ক্লিনিক','নিয়মিত পরিচর্যা ও পরামর্শ','🎗️','c1 wide']];
$('#svc').innerHTML=SVC.map(s=>`<div class="sv ${s[4]||''}"><img src="assets/services/${s[0]}.jpg" alt="${s[1]}" loading="lazy" onerror="this.onerror=function(){this.remove()};this.src='assets/services/${s[0]}.svg'"><div><h3>${s[1]}</h3><p>${s[2]}</p></div></div>`).join('');
const bn=n=>String(n).replace(/\d/g,d=>'০১২৩৪৫৬৭৮৯'[d]),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('#mq').innerHTML=(()=>{const h=SVC.map(s=>`<span>${s[3]} ${s[1]}</span>`).join('');return h+h})();
const tm=t=>{let[h,m]=t.split(':').map(Number),p=h>=12?'PM':'AM';h=h%12||12;return bn(h+':'+String(m).padStart(2,'0'))+' '+p};
const dhaka=d=>new Date(d.toLocaleString('en-US',{timeZone:'Asia/Dhaka'})),todayK=()=>DAYS[dhaka(new Date()).getDay()];
const av=g=>`<svg viewBox="0 0 100 100" role="img" aria-label="ছবি নেই"><defs><linearGradient id="g${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g=='F'?'#f6d3e2':'#cfe6fb'}"/><stop offset="1" stop-color="${g=='F'?'#e7a9c4':'#8fb8e8'}"/></linearGradient></defs><rect width="100" height="100" fill="url(#g${g})"/>${g=='F'?'<path d="M26 66c-6-30 6-46 24-46s30 16 24 46c-4-10-8-16-24-16S30 56 26 66z" fill="#4a2f3a"/>':'<path d="M33 42c0-14 8-20 17-20s17 6 17 20z" fill="#2f3a4a"/>'}<circle cx="50" cy="45" r="15" fill="#f2c9a5"/><path d="M18 100c2-20 14-30 32-30s30 10 32 30z" fill="#fff"/><path d="M42 72l8 14 8-14" fill="none" stroke="#14307a" stroke-width="3"/></svg>`;
const dio=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');dio.unobserve(x.target)}}),{threshold:.08,rootMargin:'0px 0px -4% 0px'});
let ALL=[],dept='সব',list=[],shown=PAGE;
const sitting=d=>(d.slots||[]).some(s=>s.days.includes(todayK())),pic=d=>d.photo?`<img loading="lazy" src="${esc(d.photo)}" alt="${esc(d.name)}">`:av(d.gender);
function render(){const q=$('#q').value.trim().toLowerCase(),t=$('#today').checked;
list=ALL.filter(d=>(dept=='সব'||d.department==dept)&&(!t||sitting(d))&&(!q||(d.name+' '+d.department+' '+(DEPT[d.department]||'')).toLowerCase().includes(q)));
$('#meta').textContent=`${bn(list.length)} জন ডাক্তার`;
$('#grid').innerHTML=list.slice(0,shown).map((d,i)=>`<article class="dc" data-id="${d.id}" tabindex="0" style="animation-delay:${(i%4)*90}ms"><div class="ph">${pic(d)}${sitting(d)?'<span class="live">আজ বসছেন</span>':''}<span class="bk">অ্যাপয়েন্টমেন্ট নিন</span></div><div class="nm"><h3>${esc(d.name)}</h3><span>${esc((IC[d.department]||'')+' '+(DEPT[d.department]||d.department))}</span></div></article>`).join('')||'<p>কোনো ডাক্তার পাওয়া যায়নি।</p>';
document.querySelectorAll('#grid .dc').forEach(c=>dio.observe(c));$('#more').hidden=list.length<=shown;$('#more').textContent=`আরও ডাক্তার দেখুন (${bn(list.length-shown)})`}
function chips(){const cnt={};ALL.forEach(d=>d.department&&(cnt[d.department]=(cnt[d.department]||0)+1));$('#deptSel').innerHTML=`<option value="সব">সব বিভাগ (${bn(ALL.length)})</option>`+Object.keys(cnt).map(x=>`<option value="${esc(x)}" ${x==dept?'selected':''}>${esc((IC[x]||'')+' '+(DEPT[x]||x))} (${bn(cnt[x])})</option>`).join('')}
$('#deptSel').onchange=e=>{dept=e.target.value;shown=PAGE;render()};
$('#q').oninput=()=>{shown=PAGE;render()};$('#today').onchange=()=>{shown=PAGE;render()};$('#more').onclick=()=>{shown+=PAGE;render()};
$('#todayBtn').onclick=()=>{$('#today').checked=true;shown=PAGE;render()};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),3500)};
// card tilt
$('#grid').addEventListener('pointermove',e=>{const c=e.target.closest('.dc');if(!c||e.pointerType=='touch')return;const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*8+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*8+'deg')});
$('#grid').addEventListener('pointerout',e=>{const c=e.target.closest('.dc');if(c){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}});
// Booking
const dlg=$('#dlg'),dbody=$('#dbody');
function nextDates(d){const out=[],now=dhaka(new Date());for(let i=0;i<21&&out.length<8;i++){const x=new Date(now);x.setDate(now.getDate()+i);const k=DAYS[x.getDay()];if(d.slots.some(s=>s.days.includes(k)))out.push({v:x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'),l:i?BD[k]:'আজ',n:bn(x.getDate())+'/'+bn(x.getMonth()+1)})}return out}
function open(id){const d=ALL.find(x=>x.id==id),ds=nextDates(d);
dbody.innerHTML=`<div class="dh"><div class="ph">${pic(d)}</div><div><h3>${esc(d.name)}</h3><span class="dept">${esc(DEPT[d.department]||d.department)}</span>${d.degree?`<div class="sl">${esc(d.degree)}</div>`:''}</div></div>`+(d.slots.map(s=>`<div class="sl">🕒 ${s.days.map(x=>BD[x]).join(', ')}: ${tm(s.start)}–${tm(s.end)}</div>`).join(''))+(ds.length?`<form id="bf"><h4>তারিখ বেছে নিন</h4><div class="days">${ds.map((x,i)=>`<label><input type="radio" name="date" value="${x.v}" ${i?'':'checked'}><span>${x.l}<br>${x.n}</span></label>`).join('')}</div>
<div class="fg"><label class="f">রোগীর নাম<input class="t" name="patientName" required maxlength="100" autocomplete="name"></label><label class="f">রোগীর বয়স<input class="t" name="age" required inputmode="numeric" pattern="[0-9]{1,3}" maxlength="3"></label><label class="f w">মোবাইল নম্বর<input class="t" name="mobile" required inputmode="numeric" pattern="01[0-9]{9}" placeholder="01XXXXXXXXX" autocomplete="tel"></label></div>
<h4>ফার্মেসি / এজেন্ট (থাকলে)</h4><div class="fg"><label class="f w">ফার্মেসির নাম<input class="t" name="pharmacy" maxlength="100"></label><label class="f">এজেন্টের নাম<input class="t" name="agentName" maxlength="100"></label><label class="f">এজেন্টের ফোন<input class="t" name="agentPhone" inputmode="numeric" pattern="01[0-9]{9}" placeholder="01XXXXXXXXX"></label><label class="f w">এজেন্টের ঠিকানা<input class="t" name="agentAddress" maxlength="200"></label></div>
<input class="hp" name="website" tabindex="-1" autocomplete="off"><button class="btn pri" style="width:100%;margin-top:18px" id="sb">রিকোয়েস্ট পাঠান</button></form>`:`<p>এই ডাক্তারের সময়সূচি এখনো যোগ হয়নি। অনুগ্রহ করে <a href="tel:+8801886338811"><b>01886 338 811</b></a> নম্বরে কল করুন।</p>`);
dlg.showModal();const f=$('#bf');if(f)f.onsubmit=async ev=>{ev.preventDefault();const fd=Object.fromEntries(new FormData(f)),sb=$('#sb');
if(!API){dbody.innerHTML=`<div class="ok"><h3>সংযোগ সেট করা হয়নি</h3><p>সিস্টেম এখনো সংযুক্ত নয়, তাই রিকোয়েস্ট সেভ হয়নি। সরাসরি কল করুন: <b>01886 338 811</b></p></div>`;return}
sb.disabled=true;sb.textContent='পাঠানো হচ্ছে…';
try{const r=await(await fetch(API,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({action:'book',doctorId:d.id,...fd})})).json();if(!r.ok)throw Error(r.error);
const a=JSON.parse(localStorage.getItem('sh_apts')||'[]');a.unshift({id:r.id,doc:d.name,date:fd.date});localStorage.setItem('sh_apts',JSON.stringify(a.slice(0,10)));bell();
dbody.innerHTML=`<div class="ok"><svg class="tick" viewBox="0 0 72 72"><circle cx="36" cy="36" r="31"/><path d="M22 37l10 10 19-21"/></svg><h3>রিকোয়েস্ট পাঠানো হয়েছে</h3><p>বুকিং আইডি: <b>${esc(r.id)}</b><br>${esc(d.name)} · ${esc(fd.date)}<br>হাসপাতাল থেকে আপনার সাথে যোগাযোগ করা হবে।</p></div>`}
catch(err){sb.disabled=false;sb.textContent='রিকোয়েস্ট পাঠান';toast('পাঠানো যায়নি: '+err.message)}}}
$('#grid').onclick=e=>{const c=e.target.closest('.dc');if(c)open(c.dataset.id)};$('#grid').onkeydown=e=>{if(e.key=='Enter'){const c=e.target.closest('.dc');if(c)open(c.dataset.id)}};
function bell(){const a=JSON.parse(localStorage.getItem('sh_apts')||'[]'),n=$('#bellN');n.hidden=!a.length;n.textContent=bn(a.length);$('#notes').innerHTML=a.length?a.map(x=>`<p>✅ <b>${esc(x.doc)}</b><br>${esc(x.date)} · আইডি ${esc(x.id)} · অপেক্ষমাণ</p>`).join(''):'<p>কোনো নোটিফিকেশন নেই।</p>'}
$('#bell').onclick=()=>{$('#notes').hidden=!$('#notes').hidden};bell();
// headline word reveal
$('#h1').innerHTML=$('#h1').textContent.split(' ').map((w,i)=>`<span style="animation-delay:${.15+i*.12}s">${w}</span>`).join(' ');
// hero spotlight
const hero=$('#hero'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!RM)hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--sx',e.clientX-r.left+'px');hero.style.setProperty('--sy',e.clientY-r.top+'px')});
// 3D rotating showcase
const SHOW=[['hospital','শাজিনাজ হাসপাতাল','আধুনিক ভবন, বায়েজিদ লিংক রোড','🏥','assets/img/hospital.jpg']].concat(SVC.map(s=>[s[0],s[1],s[2],s[3],`assets/services/${s[0]}.jpg`]));
const ring=$('#ring'),stage=$('#show'),N=SHOW.length,STEP=360/N;
ring.innerHTML=SHOW.map((s,i)=>`<figure class="cd"><img src="${s[4]}" alt="${s[1]}" draggable="false"${i?` onerror="this.onerror=null;this.src='assets/services/${s[0]}.svg'"`:''}><figcaption><i>${s[3]}</i><span><b>${s[1]}</b><small>${s[2]}</small></span></figcaption></figure>`).join('');
$('#dots').innerHTML=SHOW.map((s,i)=>`<button aria-label="${s[1]}" data-i="${i}"></button>`).join('');
const cds=[...ring.children],dots=[...$('#dots').children];
let ang=0,tgt=null,hold=0,drag=null,act=-1,R=480;
function size(){const W=stage.clientWidth,cw=Math.round(Math.min(236,Math.max(148,W<560?W*.5:W*.37))),ch=Math.round(cw*1.26);R=Math.round(cw/2/Math.tan(Math.PI/N)*1.06);
stage.style.setProperty('--cw',cw+'px');stage.style.setProperty('--ch',ch+'px');stage.style.height=(ch+128)+'px';cds.forEach((c,i)=>c.style.transform=`rotateY(${i*STEP}deg) translateZ(${R}px)`)}
size();addEventListener('resize',size);
const norm=a=>{a=((a%360)+540)%360-180;return a};
function setAct(i){if(i===act)return;act=i;$('#capT').textContent=SHOW[i][1];$('#capS').textContent=SHOW[i][2];dots.forEach((d,k)=>d.classList.toggle('on',k===i))}
function frame(t){const vis=hero.getBoundingClientRect().bottom>0;
if(vis){if(tgt!==null){const d=norm(tgt-ang);ang+=d*.1;if(Math.abs(d)<.2)tgt=null}else if(!drag&&!RM&&t>hold&&!stage.matches(':hover'))ang+=.22;
ring.style.transform=`translateZ(${-R}px) rotateY(${-ang}deg)`;let best=0,bd=999;
cds.forEach((c,i)=>{const d=Math.abs(norm(i*STEP-ang)),cs=Math.cos(d*Math.PI/180);c.style.opacity=Math.max(0,(cs+.3)/1.3)**1.4;c.style.filter=d>20?`saturate(${.6+.4*Math.max(cs,0)})`:'none';if(d<bd){bd=d;best=i}});setAct(best)}
requestAnimationFrame(frame)}
requestAnimationFrame(frame);
$('#dots').onclick=e=>{const b=e.target.closest('button');if(b){tgt=+b.dataset.i*STEP;hold=performance.now()+4000}};
stage.addEventListener('pointerdown',e=>{drag={x:e.clientX,a:ang};stage.setPointerCapture(e.pointerId);stage.classList.add('grab')});
stage.addEventListener('pointermove',e=>{if(drag){ang=drag.a-(e.clientX-drag.x)*.35;tgt=null}});
const endDrag=()=>{if(drag){drag=null;hold=performance.now()+2500;stage.classList.remove('grab')}};stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',endDrag);
// scroll progress + header shadow
addEventListener('scroll',()=>{const h=document.documentElement;$('#prog').style.transform=`scaleX(${scrollY/(h.scrollHeight-innerHeight||1)})`;document.querySelector('.top').classList.toggle('sc',scrollY>8)},{passive:true});
// scroll reveal
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.style.transitionDelay=(x.target.dataset.i||0)*70+'ms';x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));document.querySelectorAll('.sv').forEach((e,i)=>{e.dataset.i=i%4;io.observe(e)});
const count=(el,n)=>{let t0;const f=t=>{t0??=t;const p=Math.min((t-t0)/1600,1),e=1-Math.pow(1-p,3);el.textContent=bn(Math.round(n*e))+(p>=1?(el.dataset.suf||''):'');if(p<1)requestAnimationFrame(f)};RM?(el.textContent=bn(n)+(el.dataset.suf||'')):requestAnimationFrame(f)};
const cio=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){count(x.target,+x.target.dataset.count);cio.unobserve(x.target)}}),{threshold:.5});
const cnt=(id,n)=>{const el=$(id);el.dataset.count=n;cio.observe(el)};
document.querySelectorAll('[data-count]').forEach(e=>cio.observe(e));
function strip(){const t=ALL.filter(sitting).slice(0,16),k=todayK();$('#tdy').hidden=!t.length;
const h=t.map(d=>{const sl=d.slots.find(x=>x.days.includes(k));return `<button class="tp" data-id="${d.id}"><span class="av">${pic(d)}</span><span><b>${esc(d.name)}</b><small>${esc(DEPT[d.department]||d.department)}${sl?' · '+tm(sl.start):''}</small></span></button>`}).join('');$('#tdyIn').innerHTML=h+h}
$('#tdyIn').onclick=e=>{const b=e.target.closest('.tp');if(b)open(b.dataset.id)};
(async()=>{ALL=window.SH_DOCTORS.filter(d=>d.active);if(API){try{const r=await(await fetch(API+'?action=doctors')).json();if(r.ok&&r.data.length)ALL=r.data}catch(e){}}
const nd=ALL.length,np=new Set(ALL.map(d=>d.department)).size;cnt('#kD',nd);cnt('#kP',np);cnt('#kT',ALL.filter(sitting).length);cnt('#bD',nd);cnt('#bP',np);chips();render();strip()})();
})();
