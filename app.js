(function(){
"use strict";
var D = window.APP_DATA, C = window.APP_CONFIG || {};
var LS = {lang:"itme.lang", check:"itme.checklist", script:"itme.scriptUrl"};
var lang = "he"; /* Arabic translation removed at her request 5.11.2026 */
var DRIVE = {byFolder:{}, updated:null, source:null};
var main = document.getElementById("main");
var filterLang = "all";

/* ---------- one inline icon set (24px stroke icons) ---------- */
var P = {
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  book:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  flask:'<path d="M9 3h6"/><path d="M10 3v6L4.6 18.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9V3"/><path d="M7.5 15h9"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6 2.4-.5 4.9-2 5.9-3"/>',
  dna:'<path d="M7 3c0 6 10 8 10 18"/><path d="M17 3c0 6-10 8-10 18"/><path d="M8.5 7h7M8.5 17h7"/>',
  music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
  scale:'<path d="M12 3v18M7 21h10M5 7h14"/><path d="m5 7-3 7a3.5 3.5 0 0 0 6 0z"/><path d="m19 7-3 7a3.5 3.5 0 0 0 6 0z"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  clipboard:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  userCheck:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  video:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3z"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  go:'<path d="m15 18-6-6 6-6"/>',
  back:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  pdf:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 15h8M8 18h5"/>',
  sheet:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
  site:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  sparkles:'<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15v4M17 17h4"/>',
  palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2A5.6 5.6 0 0 0 22 11c0-5-4.5-9-10-9z"/>',
  slides:'<path d="M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3M7 21l5-5 5 5"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  folder:'<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  headset:'<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  external:'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  pin:'<path d="M12 17v5M9 10.8V4h6v6.8l2 3.2H7z"/>',
  langs:'<path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>'
};
function I(name, cls){ return '<svg class="i'+(cls?" "+cls:"")+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(P[name]||P.file)+'</svg>'; }
var SUBJ_ICON = {hebrew:"book", chemistry:"flask", geography:"globe", envsci:"leaf", biology:"dna", music:"music", "hebrew-ar":"chat", "torah-law":"scale", art:"palette"};
var SC_ICON = {moe:"doc", prep:"compass", reg:"userCheck", dates:"calendar", faq:"help", rec:"video"};
var TYPE_ICON = {pdf:"pdf", video:"video", doc:"doc", sheet:"sheet", site:"site", genially:"sparkles", canva:"palette", slides:"slides", image:"image", folder:"folder", file:"file"};
function sIcon(s){ return SUBJ_ICON[s.id] || "book"; }

/* ---------- wording ---------- */
var UI2 = {
  he:{ heroLine:"כל מה שצריך לבחינה עתירת מדיה, לפי תחום הדעת שלך",
       heroSub:"הנחיות, צ'קליסט היערכות, חומרים ואנשי קשר – במקום אחד.",
       start:"מתחילים כאן", step1:"קוראים את הנחיות ההיערכות", step1s:"מסמך מט\"ח · PDF",
       step2:"עוברים על הצ'קליסט", step2s:"{n}: לפני, ביום ואחרי הבחינה", step2p:"{d} מתוך {n} בוצעו",
       step3:"נכנסים לתחום הדעת שלך", step3s:"חומרים ואנשי קשר לפי מקצוע",
       links:"קישורים שימושיים", recent:"חדש באתר", newLabel:"חדש", updatedOn:"עודכן ב-", general:"כללי",
       lastUpdate:"החומרים עודכנו לאחרונה ב-", done:"הכל מוכן! בהצלחה בבחינה", ext:"נפתח בחלון חדש",
       contactsSub:"מפמ\"רים, מדריכים ותמיכה טכנית", settingsOpen:"הגדרות", progressAria:"התקדמות הצ'קליסט" },
  ar:{ heroLine:"كل ما تحتاجونه للامتحان الغني بالوسائط، حسب موضوعكم",
       heroSub:"إرشادات، قائمة فحص للاستعداد، مواد وجهات اتصال – في مكان واحد.",
       start:"ابدأوا من هنا", step1:"اقرأوا إرشادات الاستعداد", step1s:"مستند مَطاح · PDF",
       step2:"مرّوا على قائمة الفحص", step2s:"{n}: قبل الامتحان وفي يومه وبعده", step2p:"أُنجز {d} من {n}",
       step3:"ادخلوا إلى موضوعكم", step3s:"مواد وجهات اتصال حسب الموضوع",
       links:"روابط مفيدة", recent:"جديد في الموقع", newLabel:"جديد", updatedOn:"حُدّث في ", general:"عام",
       lastUpdate:"آخر تحديث للمواد: ", done:"كل شيء جاهز! بالتوفيق في الامتحان", ext:"يُفتح في نافذة جديدة",
       contactsSub:"المفتشون والمرشدون والدعم التقني", settingsOpen:"إعدادات", progressAria:"التقدّم في قائمة الفحص" }
};
var PL = {
  he:{ items:["פריט אחד","{n} פריטים"], checks:["בדיקה אחת","{n} בדיקות"], results:["תוצאה אחת","{n} תוצאות"], files:["קובץ אחד","{n} קבצים"] },
  ar:{ items:["مادة واحدة","مادتان","{n} مواد","{n} مادة"], checks:["بند واحد","بندان","{n} بنود","{n} بندًا"], results:["نتيجة واحدة","نتيجتان","{n} نتائج","{n} نتيجة"], files:["ملف واحد","ملفان","{n} ملفات","{n} ملفًا"] }
};
function plural(key, n){
  var f = (PL[lang]||PL.he)[key], s;
  if(lang==="ar"){ s = n===1?f[0]:n===2?f[1]:(n%100>=3&&n%100<=10)?f[2]:f[3]; }
  else s = n===1?f[0]:f[1];
  return s.replace("{n}", n);
}
function U(k){ return (UI2[lang] && UI2[lang][k]) || (D.ui[lang] && D.ui[lang][k]) || UI2.he[k] || D.ui.he[k] || k; }
function T(o){ if(!o) return ""; if(typeof o==="string") return o; return o[lang] || o.he || ""; }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
function safeUrl(u){ return /^https:\/\//i.test(u||"") ? u : null; }
function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function lsSet(k,v){ try{ if(v==null) localStorage.removeItem(k); else localStorage.setItem(k,v); }catch(e){} }
function fmtDate(iso){ var t = new Date(iso); if(isNaN(t)) return ""; return t.getDate()+"."+(t.getMonth()+1)+"."+t.getFullYear(); }

/* ---------- Drive ---------- */
function typeFromMime(m, name){
  m = m || ""; name = (name||"").toLowerCase();
  if(m.indexOf("pdf")>-1 || /\.pdf$/.test(name)) return "pdf";
  if(m.indexOf("video")===0 || /\.(mp4|mov|webm)$/.test(name)) return "video";
  if(m.indexOf("spreadsheet")>-1 || m.indexOf("excel")>-1 || /\.(xlsx?|csv)$/.test(name)) return "sheet";
  if(m.indexOf("presentation")>-1 || m.indexOf("powerpoint")>-1 || /\.pptx?$/.test(name)) return "slides";
  if(m.indexOf("document")>-1 || m.indexOf("msword")>-1 || m.indexOf("text/")===0 || /\.(docx?|txt)$/.test(name)) return "doc";
  if(m.indexOf("image")===0) return "image";
  if(m.indexOf("folder")>-1) return "folder";
  if(m.indexOf("shortcut")>-1 || m.indexOf("link")>-1) return "site";
  return "file";
}
function isArabic(s){ return /[\u0600-\u06FF]/.test(s||""); }
function cleanName(n){ return String(n||"").replace(/\.(pdf|docx?|pptx?|xlsx?|mp4|mov|png|jpe?g)$/i,""); }
function isNew(iso){ if(!iso) return false; var t = Date.parse(iso); return !isNaN(t) && (Date.now()-t) < (C.newDays||14)*864e5; }
function ingest(json, source){
  if(!json || !json.folders) return false;
  var by = {};
  json.folders.forEach(function(f){
    by[f.id] = (f.files||[]).filter(function(x){ return x && safeUrl(x.url); }).map(function(x){
      return { t:cleanName(x.name), url:x.url, type:typeFromMime(x.mimeType,x.name), lang:isArabic(x.name)?"ar":"he", drive:true, modified:x.modified, isNew:isNew(x.modified) };
    }).sort(function(a,b){ return (b.modified||"").localeCompare(a.modified||""); });
  });
  DRIVE.byFolder = by; DRIVE.updated = json.updated || null; DRIVE.source = source;
  return true;
}
function fetchJson(url, ms){
  var ctl = ("AbortController" in window) ? new AbortController() : null;
  var tm = setTimeout(function(){ if(ctl) ctl.abort(); }, ms||9000);
  return fetch(url, {cache:"no-store", signal: ctl?ctl.signal:undefined, redirect:"follow"}).then(function(r){
    clearTimeout(tm); if(!r.ok) throw new Error("HTTP "+r.status); return r.json();
  });
}
function scriptUrl(){ return lsGet(LS.script) || C.scriptUrl || ""; }
function loadDrive(){
  var p1 = fetchJson((C.filesJson||"files.json")+"?t="+Date.now(), 8000).then(function(j){ if(!DRIVE.source || DRIVE.source==="file") ingest(j,"file"); }).catch(function(){});
  var su = scriptUrl();
  var p2 = su ? fetchJson(su, 12000).then(function(j){ ingest(j,"live"); }).catch(function(e){ if(window.console) console.warn("Drive live list unavailable, using files.json"); }) : Promise.resolve();
  p1.then(softRender); p2.then(function(){ if(DRIVE.source==="live") softRender(); });
}
function driveFiles(folderId){ return DRIVE.byFolder[folderId] || []; }
function allDrive(){ var out=[]; D.subjects.forEach(function(s){ driveFiles(s.folder).forEach(function(f){ out.push({f:f,s:s}); }); }); driveFiles(D.generalFolder).forEach(function(f){ out.push({f:f,s:null}); }); return out; }

/* ---------- pieces ---------- */
function langTag(l){ if(l==="both") return '<span class="pill lang">'+esc(U("heAr"))+'</span>'; if(l==="ar") return '<span class="pill lang">عربي</span>'; return lang==="ar" ? '<span class="pill lang">'+esc(U("inHebrew"))+'</span>' : ""; }
function isSoonItem(it){ return !!(it.soon || !safeUrl(it.url)); }
function soonLast(arr){ return arr.filter(function(i){return !isSoonItem(i);}).concat(arr.filter(isSoonItem)); }
/* ctx: optional label shown first in the meta line (subject / general) */
function resCard(it, ctx){
  var ty = it.type || "file", url = safeUrl(it.url), soon = isSoonItem(it);
  var title = typeof it.t === "string" ? it.t : T(it.t);
  var meta = (ctx?'<span class="ctx">'+ctx+'</span>':'') + '<span>'+esc(U("types")[ty]||ty)+'</span>' + langTag(it.lang);
  if(it.isNew) meta += '<span class="pill new">'+esc(U("newLabel"))+'</span>';
  if(it.drive && it.modified) meta += '<span>'+esc(U("updatedOn")+fmtDate(it.modified))+'</span>';
  if(soon) meta += '<span class="pill soon">'+I("clock")+esc(U("soon"))+'</span>';
  if(it.big) meta += '<span>'+esc(U("bigFile"))+'</span>';
  if(it.note) meta += '<span class="note">'+esc(T(it.note))+'</span>';
  var inner = '<span class="ti">'+I(TYPE_ICON[ty]||"file")+'</span><span class="body"><b>'+esc(title)+'</b><span class="meta">'+meta+'</span></span>';
  if(soon) return '<div class="res is-soon">'+inner+'</div>';
  return '<a class="res" href="'+esc(url)+'" target="_blank" rel="noopener" title="'+esc(U("ext"))+'">'+inner+'<span class="go">'+I("external")+'</span></a>';
}
function routeCard(href, icon, title, meta){
  return '<a class="res" href="'+esc(href)+'"><span class="ti">'+I(icon)+'</span><span class="body"><b>'+esc(title)+'</b><span class="meta">'+meta+'</span></span><span class="go">'+I("go")+'</span></a>';
}
function subjLabel(s){ return s ? I(sIcon(s),"sm")+esc(T(s.name)) : I("pin","sm")+esc(U("general")); }
function matchLang(it){ if(filterLang==="all") return true; return it.lang===filterLang || it.lang==="both"; }
function subjCount(s){ return s.items.filter(function(i){return !isSoonItem(i);}).length + driveFiles(s.folder).length; }
function subjSoon(s){ return subjCount(s)===0; }
function contactsBlock(s, title){
  if(!s.contacts || !s.contacts.length) return "";
  var rows = s.contacts.map(function(c){
    var tr = c.track==="ar" ? U("arTrack") : (c.track==="he" ? (s.contacts.length>1?U("heTrack"):"") : "");
    return '<div class="crow">'+(tr?'<span class="track">'+esc(tr)+'</span>':'')+
      '<span class="who"><span>'+esc(U("inspector"))+':</span> '+esc(c.inspector)+'</span>'+
      '<span class="who"><span>'+esc(U("instructor"))+':</span> '+esc(c.instructor)+'</span>'+
      (c.email?'<a class="mail" href="mailto:'+esc(c.email)+'" dir="ltr">'+I("mail")+'<span>'+esc(c.email)+'</span></a>':'')+'</div>';
  }).join("");
  return '<section class="contact" aria-label="'+esc(title?T(s.name):U("contacts"))+'"><h3>'+(title?I(sIcon(s))+esc(T(s.name)):I("users")+esc(U("contacts")))+'</h3>'+rows+'</section>';
}
function checklistState(){ try{ return JSON.parse(lsGet(LS.check)||"{}"); }catch(e){ return {}; } }
function checklistTotals(){ var st=checklistState(), n=0, d=0; D.checklist.forEach(function(sec,i){ sec.items.forEach(function(_,j){ n++; if(st[i+"-"+j]) d++; }); }); return {n:n,d:d}; }
/* each active subject gets one logo colour, in logo order (blue, violet, purple, magenta, orange, lime, green) */
function sColor(s){ var act = D.subjects.filter(function(x){return !subjSoon(x);}), k = act.indexOf(s); return k<0 ? "" : "c"+(k%7); }
function pageHead(icon, title, sub, cls){
  return '<section class="pagehead'+(cls?' '+cls:'')+'"><a class="backlink" href="#/">'+I("back")+esc(U("back"))+'</a><h1>'+I(icon)+'<span>'+esc(title)+'</span></h1>'+(sub?'<p>'+esc(sub)+'</p>':'')+'</section>';
}

/* ---------- views ---------- */
function viewHome(){
  var q = (viewHome.q||"");
  var recentAll = allDrive().filter(function(x){ return x.f.isNew; });
  var top = recentAll[0];
  /* a manual update (D.updates) wins the "חדש" strip unless a Drive file is newer */
  var up = (D.updates||[]).slice().sort(function(a,b){ return a.date<b.date?1:-1; })[0];
  var upTop = up && (!top || String(top.f.modified||"").slice(0,10) <= up.date) ? up : null;
  var h = '<section class="hero"><h1>'+esc(U("heroLine"))+'</h1><p>'+esc(U("heroSub"))+'</p>'+
    '<div class="search">'+I("search")+'<input id="q" type="search" autocomplete="off" enterkeyhint="search" placeholder="'+esc(U("search"))+'" aria-label="'+esc(U("search"))+'" value="'+esc(q)+'"></div>';
  if(upTop) h += '<a class="whatsnew" href="'+esc(upTop.url)+'" target="_blank" rel="noopener"><span class="pill new">'+esc(U("newLabel"))+'</span><span class="wn-t">'+esc(T(upTop.t))+'</span><span class="wn-m">'+(upTop.src?esc(T(upTop.src))+' · ':'')+esc(U("updatedOn")+fmtDate(upTop.date))+'</span></a>';
  else if(top) h += '<a class="whatsnew" href="'+esc(top.f.url)+'" target="_blank" rel="noopener"><span class="pill new">'+esc(U("newLabel"))+'</span><span class="wn-t">'+esc(top.f.t)+'</span><span class="wn-m">'+(top.s?esc(T(top.s.name))+' · ':'')+esc(U("updatedOn")+fmtDate(top.f.modified))+'</span></a>';
  h += '</section>';
  h += '<div id="results" aria-live="polite"></div><div id="homeBody">';

  /* 1. start here */
  var tt = checklistTotals(), started = tt.d>0, pct = tt.n?Math.round(tt.d*100/tt.n):0;
  var guide = D.prepResources[0];
  var s2 = started ? U("step2p").replace("{d}",tt.d).replace("{n}",tt.n) : U("step2s").replace("{n}", plural("checks", tt.n));
  h += '<section class="start" aria-labelledby="startH"><h2 class="sec" id="startH">'+esc(U("start"))+'</h2><ol class="steps">'+
    '<li><a class="step" href="'+esc(safeUrl(guide.url)||"#/prep")+'" target="_blank" rel="noopener"><span class="num">1</span><span class="st-b"><b>'+esc(U("step1"))+'</b><small>'+esc(U("step1s"))+'</small></span>'+I("external","go")+'</a></li>'+
    '<li><a class="step'+(started?' started':'')+'" href="#/prep"><span class="num">'+(tt.d===tt.n&&tt.n?I("check"):"2")+'</span><span class="st-b"><b>'+esc(U("step2"))+'</b><small>'+esc(s2)+'</small>'+
      (started?'<span class="mini" role="progressbar" aria-label="'+esc(U("progressAria"))+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i style="width:'+pct+'%"></i></span>':'')+'</span>'+I("go","go")+'</a></li>'+
    '<li><a class="step" href="#subjects" data-scroll="subjects"><span class="num">3</span><span class="st-b"><b>'+esc(U("step3"))+'</b><small>'+esc(U("step3s"))+'</small></span>'+I("go","go")+'</a></li>'+
    '</ol></section>';

  /* 2. subjects (active first, "soon" dimmed and last) */
  var subs = D.subjects.filter(function(s){return !subjSoon(s);}).concat(D.subjects.filter(subjSoon));
  h += '<h2 class="sec" id="subjects" tabindex="-1">'+esc(U("subjects"))+'</h2><div class="grid">';
  subs.forEach(function(s){
    var n = subjCount(s), soon = subjSoon(s), nw = driveFiles(s.folder).some(function(f){return f.isNew;});
    h += '<a class="subj'+(soon?' is-soon':' '+sColor(s))+'" href="#/s/'+s.id+'"><span class="si">'+I(sIcon(s))+'</span>'+
      '<span class="sb"><b>'+esc(T(s.name))+'</b><small>'+(soon?esc(U("soon")):esc(plural("items",n)))+'</small></span>'+
      (nw?'<span class="pill new">'+esc(U("newLabel"))+'</span>':'')+'</a>';
  });
  h += '</div>';

  /* 3. useful links (2-col grid on phones) */
  h += '<h2 class="sec">'+esc(U("links"))+'</h2><nav class="shortcuts" aria-label="'+esc(U("links"))+'">';
  var sci = 0;
  D.shortcuts.forEach(function(s){
    if(s.id==="prep") return; /* lives in "start here" */
    var href = s.route || s.url, ext = !s.route;
    h += '<a class="sc c'+((4+sci++)%7)+'" href="'+esc(href)+'"'+(ext?' target="_blank" rel="noopener" title="'+esc(U("ext"))+'"':'')+'><span class="em">'+I(SC_ICON[s.id]||TYPE_ICON[s.type]||"link")+'</span><b>'+esc(T(s.t))+'</b>'+
      (s.note?'<small class="note">'+esc(T(s.note))+'</small>':(s.big?'<small>'+esc(U("bigFile"))+'</small>':''))+'</a>';
  });
  h += '</nav>';

  /* 4. recent from Drive (beyond the one shown in the hero) */
  var recent = allDrive().filter(function(x){ return x.f.isNew || !x.s; }).filter(function(x){ return !top || x.f!==top.f; });
  if(recent.length){
    h += '<h2 class="sec">'+esc(U("recent"))+'</h2><div class="list two">';
    recent.slice(0,8).forEach(function(x){ h += resCard(x.f, subjLabel(x.s)); });
    h += '</div>';
  }

  h += '<a class="feature" href="#/contacts"><span class="si">'+I("users")+'</span><span class="sb"><b>'+esc(U("allContacts"))+'</b><small>'+esc(U("contactsSub"))+'</small></span>'+I("go","go")+'</a>';
  h += '</div>';
  main.innerHTML = h;
  var inp = document.getElementById("q");
  inp.addEventListener("input", function(){ viewHome.q = inp.value; doSearch(inp.value); });
  var sc = main.querySelector('[data-scroll]');
  if(sc) sc.addEventListener("click", function(e){ e.preventDefault(); var el=document.getElementById("subjects"); el.scrollIntoView({behavior:"smooth",block:"start"}); el.focus({preventScroll:true}); });
  if(q) doSearch(q);
}
function norm(s){ return String(s||"").toLowerCase().replace(/[\u0591-\u05C7\u064B-\u065F"'״׳]/g,""); }
function doSearch(q){
  var box = document.getElementById("results"), body = document.getElementById("homeBody");
  q = norm(q.trim());
  var hero = main.querySelector(".hero");
  if(!q){ box.innerHTML=""; body.style.display=""; if(hero) hero.classList.remove("searching"); return; }
  body.style.display="none"; if(hero) hero.classList.add("searching");
  var hits = [];
  function test(){ for(var i=0;i<arguments.length;i++){ if(norm(arguments[i]).indexOf(q)>-1) return true; } return false; }
  D.subjects.forEach(function(s){
    if(test(s.name.he,s.name.ar)) hits.push(routeCard("#/s/"+s.id, sIcon(s), T(s.name), esc(U("subjects"))));
    soonLast(s.items.concat(driveFiles(s.folder))).forEach(function(it){ var t = typeof it.t==="string"?it.t:it.t.he+" "+(it.t.ar||""); if(test(t)) hits.push(resCard(it, subjLabel(s))); });
    (s.contacts||[]).forEach(function(c){ if(test(c.inspector,c.instructor,c.email)) hits.push(routeCard("#/s/"+s.id, "users", c.instructor+" · "+c.inspector, subjLabel(s)+'<span>'+esc(U("contacts"))+'</span>')); });
  });
  D.shortcuts.forEach(function(s){ if(test(s.t.he,s.t.ar)){ if(s.route) hits.push(routeCard(s.route, SC_ICON[s.id]||"link", T(s.t), esc(U("links")))); else hits.push(resCard({t:s.t,url:s.url,type:s.type,note:s.note,big:s.big})); } });
  soonLast(D.prepResources.concat(driveFiles(D.generalFolder))).forEach(function(it){ var t = typeof it.t==="string"?it.t:it.t.he+" "+(it.t.ar||""); if(test(t)) hits.push(resCard(it)); });
  D.faq.forEach(function(f,i){ if(test(f.q.he,f.q.ar,f.a.he,f.a.ar)) hits.push(routeCard("#/faq/"+i, "help", T(f.q), esc(U("faq")))); });
  var seen = {}; hits = hits.filter(function(h){ if(seen[h]) return false; seen[h]=1; return true; });
  box.innerHTML = '<h2 class="sec">'+esc(U("results"))+' <span class="count">'+esc(plural("results",hits.length))+'</span></h2>' + (hits.length ? '<div class="list two">'+hits.join("")+'</div>' : '<div class="empty">'+I("search","big")+'<p>'+esc(U("noResults"))+'</p></div>');
}
function viewSubject(id){
  var s = D.subjects.filter(function(x){return x.id===id;})[0];
  if(!s){ location.hash="#/"; return; }
  var dfiles = driveFiles(s.folder), all = soonLast(dfiles.filter(function(f){return f.isNew;}).concat(s.items, dfiles.filter(function(f){return !f.isNew;})));
  var hasAr = all.some(function(i){return i.lang==="ar"||i.lang==="both";});
  var sc = sColor(s);
  var h = pageHead(sIcon(s), T(s.name), subjSoon(s)?U("soon"):plural("items",subjCount(s)), sc);
  if(all.length){
    var opts = [["all",U("all")],["he","עברית"]]; if(hasAr) opts.push(["ar","عربي"]);
    if(!hasAr && filterLang==="ar") filterLang="all";
    h += '<div class="filters" role="group" aria-label="'+esc(U("materials"))+'">'+opts.map(function(f){ return '<button class="chip" type="button" data-f="'+f[0]+'" aria-pressed="'+(filterLang===f[0])+'">'+esc(f[1])+'</button>'; }).join("")+'</div>';
    var shown = all.filter(matchLang);
    h += shown.length ? '<div class="list two'+(sc?' '+sc:'')+'">'+shown.map(function(it){return resCard(it);}).join("")+'</div>' : '<div class="empty">'+I("folder","big")+'<p>'+esc(U("noResults"))+'</p></div>';
  } else {
    h += '<div class="empty">'+I("clock","big")+'<p>'+esc(U("noItems"))+'</p></div>';
  }
  h += contactsBlock(s);
  main.innerHTML = h;
  Array.prototype.forEach.call(main.querySelectorAll(".chip"), function(b){ b.addEventListener("click", function(){ filterLang = b.getAttribute("data-f"); viewSubject(id); var c=main.querySelector('.chip[data-f="'+filterLang+'"]'); if(c) c.focus(); }); });
}
function viewPrep(){
  var st = checklistState(), tt = checklistTotals(), pct = tt.n?Math.round(tt.d*100/tt.n):0;
  var h = pageHead("compass", U("prep"), U("prepIntro"));
  h += '<div class="progress" id="cl"><div class="row"><b>'+I("clipboard")+esc(U("checklist"))+'</b><span id="clCount">'+tt.d+' '+esc(U("of"))+' '+tt.n+'</span></div>'+
    '<div class="bar" role="progressbar" aria-label="'+esc(U("progressAria"))+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'" id="clBarWrap"><i id="clBar" style="width:'+pct+'%"></i></div>'+
    '<div class="row sub"><small>'+esc(U("checklistNote"))+'</small><button class="linkbtn" id="clReset" type="button">'+esc(U("reset"))+'</button></div></div>';
  D.checklist.forEach(function(sec,i){
    h += '<div class="cl-sec"><h3>'+esc(T(sec.h))+'</h3>';
    sec.items.forEach(function(it,j){ var k=i+"-"+j; h += '<label class="check"><input type="checkbox" data-k="'+k+'"'+(st[k]?' checked':'')+'><span class="box">'+I("check")+'</span><span>'+esc(T(it))+'</span></label>'; });
    h += '</div>';
  });
  h += '<div id="clDone" aria-live="polite">'+(tt.d===tt.n?'<div class="done">'+I("check")+esc(U("done"))+'</div>':'')+'</div>';
  h += '<h2 class="sec">'+esc(U("helpful"))+'</h2><div class="list two">'+soonLast(driveFiles(D.generalFolder).concat(D.prepResources)).map(function(it){return resCard(it);}).join("")+'</div>';
  main.innerHTML = h;
  main.addEventListener("change", onCheck);
  document.getElementById("clReset").addEventListener("click", function(){ if(confirm(U("resetAsk"))){ lsSet(LS.check,null); viewPrep(); } });
}
function onCheck(e){
  var k = e.target && e.target.getAttribute && e.target.getAttribute("data-k"); if(!k) return;
  var st = checklistState(); if(e.target.checked) st[k]=1; else delete st[k]; lsSet(LS.check, JSON.stringify(st));
  var tt = checklistTotals(), pct = tt.n?Math.round(tt.d*100/tt.n):0;
  document.getElementById("clCount").textContent = tt.d+" "+U("of")+" "+tt.n;
  document.getElementById("clBar").style.width = pct+"%";
  document.getElementById("clBarWrap").setAttribute("aria-valuenow", pct);
  document.getElementById("clDone").innerHTML = tt.d===tt.n ? '<div class="done">'+I("check")+esc(U("done"))+'</div>' : "";
}
function linkify(s){ return s.replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]"\u05f3\u05f4])/g, function(u){ return '<a href="'+u+'" target="_blank" rel="noopener" style="color:#6200FF;text-decoration:underline;word-break:break-all">'+u+'</a>'; }); }
function viewFaq(openIdx){
  var h = pageHead("help", U("faq"), "iTest") + '<div class="faq">';
  D.faq.forEach(function(f,i){ h += '<details id="faq'+i+'"'+(i===openIdx?' open':'')+'><summary><span>'+esc(T(f.q))+'</span>'+I("go","chev")+'</summary><div class="ans">'+linkify(esc(T(f.a)))+(f.src?'<span class="src">'+esc(T(f.src))+'</span>':'')+'</div></details>'; });
  h += '</div><a class="srcbtn" href="'+esc(D.faqSourceUrl)+'" target="_blank" rel="noopener">'+I("doc")+esc(U("faqSource"))+'</a>';
  main.innerHTML = h;
  if(openIdx!=null){ var el=document.getElementById("faq"+openIdx); if(el) el.scrollIntoView({block:"center"}); }
}
function viewContacts(){
  var h = pageHead("users", U("allContacts"), U("unit"));
  h += '<div class="contacts">';
  h += '<section class="contact"><h3>'+I("star")+esc(U("lead"))+'</h3><div class="crow"><span class="who">'+esc(D.lead.name)+'</span><a class="mail" href="mailto:'+esc(D.lead.email)+'" dir="ltr">'+I("mail")+'<span>'+esc(D.lead.email)+'</span></a></div></section>';
  D.subjects.forEach(function(s){ if(s.contacts.length) h += contactsBlock(s, true); });
  h += '<section class="contact"><h3>'+I("headset")+esc(U("support"))+'</h3><div class="crow"><span class="who">'+(lang==="ar"?"الدعم التقني لمَطاح (iTest)":"תמיכה טכנית מט\"ח (iTest)")+'</span><a class="mail" href="tel:036200622" dir="ltr">'+I("phone")+'<span>03-6200622</span></a></div></section>';
  h += '</div>';
  main.innerHTML = h;
}

/* ---------- settings (for the content manager) — reached only via #/admin ---------- */
function openSettings(){
  var dlg = document.getElementById("settings");
  var fl = D.subjects.map(function(s){ return '<li><a href="https://drive.google.com/drive/folders/'+esc(s.folder)+'" target="_blank" rel="noopener">'+I(sIcon(s),"sm")+esc(T(s.name))+'</a></li>'; }).join("") +
    '<li><a href="https://drive.google.com/drive/folders/'+esc(D.generalFolder)+'" target="_blank" rel="noopener">'+I("pin","sm")+esc(U("general"))+'</a></li>';
  dlg.innerHTML = '<form method="dialog" class="dlg" dir="rtl"><h2 id="settingsH">'+I("link")+esc(U("settingsTitle"))+'</h2>'+
    '<label for="su">'+esc(U("scriptUrl"))+'</label><input id="su" type="url" dir="ltr" placeholder="https://script.google.com/macros/s/…/exec" value="'+esc(lsGet(LS.script)||C.scriptUrl||"")+'">'+
    '<div class="btns"><button class="btn" type="button" id="suSave">'+esc(U("save"))+'</button><button class="btn sec" type="button" id="suTest">'+esc(U("test"))+'</button><button class="btn sec" type="button" id="suClear">'+esc(U("clear"))+'</button><button class="btn sec" value="close">'+esc(U("close"))+'</button></div>'+
    '<div class="msg" id="suMsg" role="status"></div><h2 class="h-sm">'+I("folder")+esc(U("folders"))+'</h2><ul>'+fl+'</ul></form>';
  var msg = function(t,c){ var m=document.getElementById("suMsg"); m.textContent=t; m.style.color=c||""; };
  document.getElementById("suSave").onclick = function(){ var v=document.getElementById("su").value.trim(); if(v && !/^https:\/\/script\.google(usercontent)?\.com\//.test(v)){ msg(U("testFail"),"#b3261e"); return; } lsSet(LS.script, v||null); msg(U("saved"),"#1f6b3f"); loadDrive(); };
  document.getElementById("suClear").onclick = function(){ lsSet(LS.script,null); document.getElementById("su").value=""; msg(U("saved"),"#1f6b3f"); };
  document.getElementById("suTest").onclick = function(){ var v=document.getElementById("su").value.trim(); msg(U("testing")); fetchJson(v,12000).then(function(j){ var n=0; (j.folders||[]).forEach(function(f){ n+=(f.files||[]).length; }); msg(U("testOk").replace(/\{n\}\s*\S+/, plural("files",n)),"#1f6b3f"); }).catch(function(){ msg(U("testFail"),"#b3261e"); }); };
  if(!dlg.onclose) dlg.onclose = function(){ if(/^#\/admin/.test(location.hash)) history.replaceState(null,"","#/"); };
  if(dlg.showModal){ if(!dlg.open) dlg.showModal(); } else dlg.setAttribute("open","");
}

/* ---------- shell ---------- */
function applyLang(){
  document.documentElement.lang = lang; document.documentElement.dir = "rtl";
  Array.prototype.forEach.call(document.querySelectorAll("[data-i]"), function(el){ el.textContent = U(el.getAttribute("data-i")); });
  var b = document.getElementById("langBtn"); b.innerHTML = I("langs")+'<span>'+esc(U("langLabel"))+'</span>'; b.setAttribute("aria-label", U("langSwitch"));
  b.setAttribute("lang", lang==="he"?"ar":"he");
  document.title = U("title")+" – "+U("subtitle");
  var up = document.getElementById("updatedAt");
  up.textContent = DRIVE.updated ? U("lastUpdate")+fmtDate(DRIVE.updated) : "";
}
function render(){
  applyLang();
  var h = location.hash || "#/", m;
  main.removeEventListener("change", onCheck);
  if((m = h.match(/^#\/s\/([\w-]+)/))) viewSubject(m[1]);
  else if(h.indexOf("#/prep")===0) viewPrep();
  else if((m = h.match(/^#\/faq(?:\/(\d+))?/))) viewFaq(m[1]!=null?+m[1]:null);
  else if(h.indexOf("#/contacts")===0) viewContacts();
  else { viewHome(); if(h.indexOf("#/admin")===0 && !document.getElementById("settings").open) openSettings(); }
}
/* re-render after Drive data arrives without stealing focus from the search box */
function softRender(){
  var a = document.activeElement, wasQ = a && a.id==="q", pos = wasQ ? a.selectionStart : 0;
  render();
  if(wasQ){ var q=document.getElementById("q"); if(q){ q.focus(); try{ q.setSelectionRange(pos,pos); }catch(e){} } }
}
window.addEventListener("hashchange", function(){ if(location.hash==="#subjects") return; render(); if(!/^#\/admin/.test(location.hash)) window.scrollTo(0,0); });
document.getElementById("langBtn").addEventListener("click", function(){ lang = lang==="he"?"ar":"he"; lsSet(LS.lang,lang); render(); });
render();
loadDrive();
})();
