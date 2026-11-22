/** Shajinaz Hospital backend — Google Apps Script (Spreadsheet-bound, owner: shajinazit@gmail.com)
 *  Deploy: Web app, Execute as Me, Access Anyone. এই ফাইল পাবলিক GitHub রিপোতে দেবেন না (ডিফল্ট পাসওয়ার্ড আছে)। */
const OWNER='shajinazit@gmail.com',WA_PHONE='8801886338811',DEF_USER='shajinaz_admin',DEF_PASS='Shajinaz@2026';
const DC=['id','name','department','degree','slots','active','photo','gender'],BC=['bookingId','createdAt','patientName','mobile','age','doctorId','doctorName','date','pharmacy','agentName','agentPhone','agentAddress','status'],UC=['username','salt','hash','createdAt'];
const SP=()=>PropertiesService.getScriptProperties(),SS=()=>{const i=SP().getProperty('SPREADSHEET_ID');return i?SpreadsheetApp.openById(i):SpreadsheetApp.getActiveSpreadsheet()};
function sh_(n,h){let s=SS().getSheetByName(n)||SS().insertSheet(n);if(!s.getLastRow()){s.appendRow(h);s.setFrozenRows(1)}return s}
function setup(){sh_('Doctors',DC);sh_('Bookings',BC);const u=sh_('Users',UC);if(u.getLastRow()<2)addUser_(DEF_USER,DEF_PASS);return 'Ready: login '+DEF_USER}
function hash_(p,s){return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s+p))}
function addUser_(n,p){const s=Utilities.getUuid();sh_('Users',UC).appendRow([n,s,hash_(p,s),new Date()])}
function rows_(n,c){const s=sh_(n,c),v=s.getDataRange().getValues();return v.slice(1).filter(r=>r[0]!=='').map((r,i)=>{const o={_row:i+2};c.forEach((k,j)=>o[k]=r[j]);return o})}
function docs_(){return rows_('Doctors',DC).map(d=>({id:String(d.id),name:d.name,department:d.department,degree:d.degree,slots:JSON.parse(d.slots||'[]'),active:d.active===true||String(d.active)=='true',photo:d.photo,gender:d.gender||'M'}))}
const out_=o=>ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const cl_=(v,n)=>{const s=String(v==null?'':v).trim().slice(0,n);return /^[=+@\-]/.test(s)?"'"+s:s};
function doGet(e){try{if((e.parameter||{}).action!=='doctors')throw Error('Unsupported');return out_({ok:true,data:docs_().filter(d=>d.active)})}catch(x){return out_({ok:false,error:x.message})}}
function auth_(p){const u=CacheService.getScriptCache().get('t:'+p.token);if(!u)throw Error('সেশন শেষ, আবার লগইন করুন');return u}
function doPost(e){try{const p=JSON.parse(e.postData.contents||'{}'),a=p.action;
if(a==='book')return out_(book_(p));
if(a==='login')return out_(login_(p));
const me=auth_(p),c=CacheService.getScriptCache();
if(a==='doctors')return out_({ok:true,data:docs_()});
if(a==='bookings')return out_({ok:true,data:rows_('Bookings',BC).reverse().slice(0,300)});
if(a==='setStatus'){const s=sh_('Bookings',BC),r=rows_('Bookings',BC).find(x=>x.bookingId===p.bookingId);if(!r||!['Pending','Confirmed','Cancelled','Done'].includes(p.status))throw Error('Invalid');s.getRange(r._row,BC.indexOf('status')+1).setValue(p.status);return out_({ok:true})}
if(a==='saveDoctor')return out_(saveDoc_(p.doctor));
if(a==='importDoctors'){if(docs_().length)throw Error('ডাক্তার তালিকা ফাঁকা নয়');p.list.forEach(d=>saveDoc_(d));return out_({ok:true,n:p.list.length})}
if(a==='users')return out_({ok:true,data:rows_('Users',UC).map(u=>u.username),me});
if(a==='createUser'){const n=cl_(p.username,40);if(!/^[A-Za-z0-9_.-]{3,40}$/.test(n)||String(p.password).length<8)throw Error('ইউজারনেম ৩+ অক্ষর, পাসওয়ার্ড ৮+ অক্ষর');if(rows_('Users',UC).some(u=>u.username===n))throw Error('আগে থেকেই আছে');addUser_(n,p.password);return out_({ok:true})}
if(a==='deleteUser'){const r=rows_('Users',UC);if(p.username===me||r.length<2)throw Error('এটি মোছা যাবে না');const x=r.find(u=>u.username===p.username);if(x)sh_('Users',UC).deleteRow(x._row);return out_({ok:true})}
if(a==='changePassword'){if(String(p.password).length<8)throw Error('পাসওয়ার্ড ৮+ অক্ষর');const x=rows_('Users',UC).find(u=>u.username===me),s=Utilities.getUuid();sh_('Users',UC).getRange(x._row,2,1,2).setValues([[s,hash_(p.password,s)]]);return out_({ok:true})}
throw Error('Unsupported')}catch(x){return out_({ok:false,error:x.message})}}
function login_(p){const c=CacheService.getScriptCache(),k='f:'+p.username;if(+c.get(k)>=5)throw Error('অনেকবার ভুল হয়েছে, ১৫ মিনিট পরে চেষ্টা করুন');const u=rows_('Users',UC).find(x=>x.username===p.username);
if(!u||hash_(String(p.password),u.salt)!==u.hash){c.put(k,String((+c.get(k)||0)+1),900);throw Error('ইউজারনেম বা পাসওয়ার্ড ভুল')}
const t=Utilities.getUuid()+Utilities.getUuid();c.put('t:'+t,u.username,21600);return {ok:true,token:t,user:u.username}}
function saveDoc_(d){const n=cl_(d.name,120);if(!n)throw Error('নাম দিন');const sl=(d.slots||[]).filter(s=>s.days&&s.days.length&&/^\d\d:\d\d$/.test(s.start)&&/^\d\d:\d\d$/.test(s.end));let photo=cl_(d.photo,300);
if(d.photoData){const b=Utilities.newBlob(Utilities.base64Decode(d.photoData),'image/jpeg','doctor-'+Date.now()+'.jpg'),it=DriveApp.getFoldersByName('Shajinaz Doctors'),f=it.hasNext()?it.next():DriveApp.createFolder('Shajinaz Doctors'),fl=f.createFile(b);fl.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);photo='https://drive.google.com/thumbnail?id='+fl.getId()+'&sz=w600'}
const id=d.id||'SH-D'+Utilities.getUuid().slice(0,6).toUpperCase(),row=[id,n,cl_(d.department,90),cl_(d.degree,180),JSON.stringify(sl),d.active!==false,photo,d.gender==='F'?'F':'M'],r=rows_('Doctors',DC).find(x=>String(x.id)===String(id)),s=sh_('Doctors',DC);
r?s.getRange(r._row,1,1,8).setValues([row]):s.appendRow(row);return {ok:true,id}}
function book_(p){if(p.website)throw Error('Rejected');const name=cl_(p.patientName,100),mob=String(p.mobile||'').trim(),age=String(p.age||'').trim(),date=String(p.date||''),ap=String(p.agentPhone||'').trim();if(!name||!/^01\d{9}$/.test(mob)||!/^\d{1,3}$/.test(age)||!/^\d{4}-\d\d-\d\d$/.test(date)||ap&&!/^01\d{9}$/.test(ap))throw Error('তথ্য সঠিক নয়');
const today=Utilities.formatDate(new Date(),'Asia/Dhaka','yyyy-MM-dd');if(date<today)throw Error('অতীতের তারিখ');const d=docs_().find(x=>x.id===String(p.doctorId)&&x.active);const wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(date+'T12:00:00+06:00').getUTCDay()];if(!d||!d.slots.some(s=>s.days.includes(wd)))throw Error('এই দিনে ডাক্তার বসেন না');
const L=LockService.getScriptLock();L.waitLock(20000);try{const id='SH-'+date.replace(/-/g,'')+'-'+Utilities.getUuid().slice(0,5).toUpperCase(),ph=cl_(p.pharmacy,100),an=cl_(p.agentName,100),aa=cl_(p.agentAddress,200);
sh_('Bookings',BC).appendRow([id,new Date(),name,"'"+mob,age,d.id,d.name,date,ph,an,"'"+ap,aa,'Pending']);
const msg='🏥 নতুন অ্যাপয়েন্টমেন্ট '+id+'\nডাক্তার: '+d.name+'\nতারিখ: '+date+'\nরোগী: '+name+' ('+age+' বছর)\nমোবাইল: '+mob+(ph?'\nফার্মেসি: '+ph:'')+(an?'\nএজেন্ট: '+an+' '+ap+'\nঠিকানা: '+aa:'');
try{MailApp.sendEmail(OWNER,'নতুন অ্যাপয়েন্টমেন্ট: '+d.name,msg)}catch(e){}
const k=SP().getProperty('CALLMEBOT_KEY');if(k)try{UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone='+WA_PHONE+'&apikey='+k+'&text='+encodeURIComponent(msg))}catch(e){}
return {ok:true,id,notified:!!k}}finally{L.releaseLock()}}
