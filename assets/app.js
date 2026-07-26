const DATA_KEY='smartprice_articles_v02';
const OLD_DATA_KEY='smartprice_articles_v01';
const SETTINGS_KEY='smartprice_settings_v02';
let articles=[]; let stream=null; let detector=null; let scanTimer=null;
const result=document.querySelector('#result');
const money=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});

async function loadArticles(){
  const local=localStorage.getItem(DATA_KEY)||localStorage.getItem(OLD_DATA_KEY);
  if(local){articles=JSON.parse(local);localStorage.setItem(DATA_KEY,JSON.stringify(articles));}
  else{articles=await fetch('data/articles.json').then(r=>r.json());localStorage.setItem(DATA_KEY,JSON.stringify(articles));}
  document.querySelector('#lastUpdate').textContent=`${articles.length} articles chargés`;
}
function loadSettings(){
  const s=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}');
  const settings={name:'CompuTime Oran',address:'Oran, Algérie',phone:'',maps:'',welcome:'Vérificateur de prix en libre-service',...s};
  storeName.textContent=settings.name;storeTitle.textContent=settings.name;storeAddress.textContent=settings.address||'';
  storeContact.textContent=[settings.phone,settings.welcome].filter(Boolean).join(' · ');
  if(settings.maps){mapsLink.href=settings.maps;mapsLink.hidden=false;}
}
function normalize(v){return String(v??'').trim().toUpperCase()}
function showArticle(a){
  result.className='result-card success-result';
  result.innerHTML=`<div class="result-badge">Article trouvé</div><div class="product-code">CODE : ${escapeHtml(a.code)}</div><div class="product-name">${escapeHtml(a.designation)}</div><div class="product-price">${money.format(Number(a.prix))} <small>DA</small></div><button class="secondary new-scan" onclick="resetSearch()">Scanner un autre article</button>`;
  suggestions.hidden=true;
}
function resetSearch(){query.value='';query.focus();result.className='result-card empty';result.innerHTML='<div class="result-icon">⌁</div><p>Le résultat apparaîtra ici.</p>';}
function showNotFound(q){result.className='result-card error-result';result.innerHTML=`<div class="result-icon">!</div><p class="not-found">Article introuvable</p><small>Aucun article ne correspond à « ${escapeHtml(q)} ».</small>`;suggestions.hidden=true;}
function search(q){q=normalize(q);if(!q)return;const exact=articles.find(a=>normalize(a.code)===q);if(exact){showArticle(exact);return}const matches=articles.filter(a=>normalize(a.designation).includes(q)||normalize(a.code).includes(q)).slice(0,12);if(matches.length===1){showArticle(matches[0]);return}if(!matches.length){showNotFound(q);return}suggestions.hidden=false;suggestionList.innerHTML='';matches.forEach(a=>{const d=document.createElement('button');d.type='button';d.className='suggestion';d.innerHTML=`<div><strong>${escapeHtml(a.designation)}</strong><small>${escapeHtml(a.code)}</small></div><span>${money.format(Number(a.prix))} DA</span>`;d.onclick=()=>showArticle(a);suggestionList.appendChild(d)});}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
searchForm.addEventListener('submit',e=>{e.preventDefault();search(query.value)});scanBtn.addEventListener('click',startScan);stopBtn.addEventListener('click',stopScan);
async function startScan(){const status=scanStatus;if(!navigator.mediaDevices?.getUserMedia){status.hidden=false;status.textContent='La caméra nécessite une page HTTPS. Utilisez l’adresse Vercel ou saisissez le code manuellement.';return}if(!('BarcodeDetector' in window)){status.hidden=false;status.textContent='Le scanner automatique n’est pas pris en charge par ce navigateur. Utilisez Chrome sur Android ou la saisie manuelle.';return}try{const formats=await BarcodeDetector.getSupportedFormats();detector=new BarcodeDetector({formats});stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}}});video.srcObject=stream;videoWrap.hidden=false;await video.play();stopBtn.hidden=false;status.hidden=false;status.textContent='Placez le code-barres dans le cadre.';scanTimer=setInterval(async()=>{try{const codes=await detector.detect(video);if(codes.length){const value=codes[0].rawValue;query.value=value;stopScan();search(value)}}catch{}},300)}catch(e){status.hidden=false;status.textContent='Impossible d’ouvrir la caméra. Vérifiez son autorisation dans le navigateur.';}}
function stopScan(){if(scanTimer)clearInterval(scanTimer);scanTimer=null;if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;videoWrap.hidden=true;stopBtn.hidden=true;}
loadSettings();loadArticles();if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
