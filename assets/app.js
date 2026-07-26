const DATA_KEYS=['smartprice_articles_v03','smartprice_articles_v02','smartprice_articles_v01'];
const SETTINGS_KEYS=['smartprice_settings_v03','smartprice_settings_v02'];
const META_KEY='smartprice_meta_v03';
let articles=[], html5QrCode=null, cameras=[], cameraIndex=0, scannerRunning=false, scanLocked=false;
const money=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});
const $=s=>document.querySelector(s);

async function loadArticles(){
  let raw=null; for(const key of DATA_KEYS){raw=localStorage.getItem(key);if(raw)break;}
  try{articles=raw?JSON.parse(raw):await fetch('data/articles.json').then(r=>r.json());}catch{articles=[];}
  localStorage.setItem(DATA_KEYS[0],JSON.stringify(articles));
  const meta=JSON.parse(localStorage.getItem(META_KEY)||'{}');
  $('#lastUpdate').textContent=meta.lastChange?`Mis à jour le ${new Date(meta.lastChange).toLocaleDateString('fr-FR')}`:`${articles.length} articles chargés`;
}
function getSettings(){let raw=null;for(const key of SETTINGS_KEYS){raw=localStorage.getItem(key);if(raw)break;}return{name:'CompuTime Oran',address:'Oran, Algérie',phone:'',email:'',maps:'',hours:'',welcome:'Scannez le code-barres d’un article pour afficher immédiatement sa désignation et son prix.',primary:'#0b57d0',secondary:'#4f8cff',logo:'',...JSON.parse(raw||'{}')};}
function loadSettings(){const s=getSettings();document.documentElement.style.setProperty('--primary',s.primary);document.documentElement.style.setProperty('--secondary',s.secondary);$('#storeName').textContent=s.name;$('#storeTitle').textContent=s.name;$('#storeAddress').textContent=s.address||'';$('#welcomeText').textContent=s.welcome;$('#storeContact').textContent=[s.phone,s.email].filter(Boolean).join(' · ')||'Vérificateur de prix en libre-service';$('#brandInitial').textContent=(s.name||'C')[0].toUpperCase();if(s.logo){$('#brandImage').src=s.logo;$('#brandImage').hidden=false;$('#brandInitial').hidden=true;}if(s.hours){$('#storeHours').textContent=s.hours;$('#storeHours').hidden=false;}if(s.phone){$('#phoneLink').href='tel:'+s.phone.replace(/\s/g,'');$('#phoneLink').hidden=false;}if(s.maps){$('#mapsLink').href=s.maps;$('#mapsLink').hidden=false;}}
function norm(v){return String(v??'').trim().toUpperCase();}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function formatDate(value){return value?new Date(value).toLocaleString('fr-FR',{dateStyle:'medium',timeStyle:'short'}):'—';}
function showArticle(a){$('#result').className='result-card result-success';$('#result').innerHTML=`<div class="result-top"><span class="found-pill">✓ Article trouvé</span><span class="updated-label">Mise à jour : ${formatDate(a.updatedAt)}</span></div><div class="product-visual"><div class="product-placeholder">▥</div></div><div class="product-info"><span class="product-code">CODE ${esc(a.code)}</span><h3>${esc(a.designation)}</h3><div class="product-price">${money.format(Number(a.prix)||0)} <small>DA</small></div><button class="btn btn-primary new-scan" type="button">Scanner un autre article</button></div>`;$('.new-scan').onclick=resetSearch;$('#suggestions').hidden=true;$('#result').scrollIntoView({behavior:'smooth',block:'center'});}
function resetSearch(){$('#query').value='';$('#result').className='result-card result-empty';$('#result').innerHTML='<div class="empty-state-icon">⌁</div><h3>Prêt à vérifier un prix</h3><p>Scannez un code-barres ou utilisez la recherche.</p>';$('#query').focus();}
function showNotFound(q){$('#result').className='result-card result-error';$('#result').innerHTML=`<div class="empty-state-icon">!</div><h3>Article introuvable</h3><p>Aucun article ne correspond à « ${esc(q)} ».</p><button class="btn btn-soft retry-search" type="button">Réessayer</button>`;$('.retry-search').onclick=resetSearch;$('#suggestions').hidden=true;}
function findMatches(q){const n=norm(q);if(!n)return[];return articles.filter(a=>norm(a.code).includes(n)||norm(a.designation).includes(n)).slice(0,10);}
function search(q){q=String(q||'').trim();if(!q)return;const exact=articles.find(a=>norm(a.code)===norm(q));if(exact)return showArticle(exact);const matches=findMatches(q);if(matches.length===1)return showArticle(matches[0]);if(!matches.length)return showNotFound(q);renderSuggestions(matches,true);}
function renderSuggestions(matches,scroll=false){const box=$('#suggestions'),list=$('#suggestionList');if(!matches.length){box.hidden=true;return;}box.hidden=false;list.innerHTML='';matches.forEach(a=>{const b=document.createElement('button');b.type='button';b.className='suggestion-item';b.innerHTML=`<div><strong>${esc(a.designation)}</strong><small>${esc(a.code)}</small></div><span>${money.format(Number(a.prix)||0)} DA</span>`;b.onclick=()=>showArticle(a);list.appendChild(b);});if(scroll)box.scrollIntoView({behavior:'smooth',block:'nearest'});}

$('#searchForm').addEventListener('submit',e=>{e.preventDefault();search($('#query').value);});
$('#query').addEventListener('input',e=>{const q=e.target.value.trim();renderSuggestions(q.length>=2?findMatches(q):[]);});
$('#focusSearchBtn').onclick=()=>{$('#searchSection').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#query').focus(),400);};
$('#scanBtn').onclick=startScan;
$('#stopBtn').onclick=()=>stopScan(true);
$('#closeScannerBtn').onclick=()=>stopScan(true);
$('#switchCameraBtn').onclick=switchCamera;
$('#scanFileInput').addEventListener('change',scanImageFile);

function setStatus(message){$('#scanStatus').textContent=message;}
function scannerAvailable(){return typeof Html5Qrcode!=='undefined';}
async function startScan(){
  $('#scannerPanel').hidden=false;
  $('#scannerPanel').scrollIntoView({behavior:'smooth',block:'start'});
  scanLocked=false;
  if(!window.isSecureContext){setStatus('La caméra nécessite HTTPS. Ouvrez le lien Vercel, pas un fichier local.');return;}
  if(!navigator.mediaDevices?.getUserMedia){setStatus('Ce navigateur ne donne pas accès à la caméra. Essayez Safari sur iPhone ou Chrome sur Android.');return;}
  if(!scannerAvailable()){setStatus('Le module de scan n’a pas été chargé. Vérifiez la connexion Internet puis actualisez la page.');return;}
  try{
    if(!html5QrCode) html5QrCode=new Html5Qrcode('reader',{verbose:false});
    cameras=await Html5Qrcode.getCameras();
    if(!cameras.length) throw new Error('Aucune caméra détectée');
    let preferred=cameras.findIndex(c=>/back|rear|environment|arrière/i.test(c.label));
    if(preferred>=0) cameraIndex=preferred;
    await runCamera(cameras[cameraIndex].id);
  }catch(err){
    const name=err?.name||'';
    if(name==='NotAllowedError'||/permission|denied|autorisation/i.test(String(err))) setStatus('Accès caméra refusé. Autorisez la caméra dans les réglages du navigateur puis rechargez la page.');
    else if(name==='NotReadableError'||/Could not start|not readable|occupée/i.test(String(err))) setStatus('La caméra est utilisée par une autre application. Fermez-la puis réessayez.');
    else setStatus(`Impossible de démarrer la caméra : ${err?.message||err}`);
  }
}
async function runCamera(cameraId){
  if(scannerRunning) await stopScan(false);
  setStatus('Démarrage de la caméra…');
  const formats=[Html5QrcodeSupportedFormats.EAN_13,Html5QrcodeSupportedFormats.EAN_8,Html5QrcodeSupportedFormats.UPC_A,Html5QrcodeSupportedFormats.UPC_E,Html5QrcodeSupportedFormats.CODE_128,Html5QrcodeSupportedFormats.CODE_39,Html5QrcodeSupportedFormats.ITF,Html5QrcodeSupportedFormats.CODABAR,Html5QrcodeSupportedFormats.QR_CODE];
  await html5QrCode.start(
    cameraId,
    {fps:12,qrbox:(w,h)=>({width:Math.min(w*0.9,520),height:Math.min(h*0.38,220)}),aspectRatio:1.777778,formatsToSupport:formats,experimentalFeatures:{useBarCodeDetectorIfSupported:true}},
    onScanSuccess,
    ()=>{}
  );
  scannerRunning=true;
  setStatus('Placez le code-barres horizontalement dans le cadre.');
}
async function onScanSuccess(decodedText){
  if(scanLocked)return;
  scanLocked=true;
  navigator.vibrate?.(120);
  $('#query').value=decodedText;
  await stopScan(true);
  search(decodedText);
}
async function switchCamera(){
  if(!cameras.length){await startScan();return;}
  cameraIndex=(cameraIndex+1)%cameras.length;
  scanLocked=false;
  try{await runCamera(cameras[cameraIndex].id);}catch(err){setStatus('Impossible de changer de caméra.');}
}
async function stopScan(hide=true){
  try{if(html5QrCode&&scannerRunning){await html5QrCode.stop();await html5QrCode.clear();}}catch{}
  scannerRunning=false;
  if(hide) $('#scannerPanel').hidden=true;
}
async function scanImageFile(event){
  const file=event.target.files?.[0];
  if(!file)return;
  $('#scannerPanel').hidden=false;
  if(!scannerAvailable()){setStatus('Module de scan indisponible. Actualisez la page avec Internet.');return;}
  try{
    if(scannerRunning) await stopScan(false);
    if(!html5QrCode) html5QrCode=new Html5Qrcode('reader',{verbose:false});
    setStatus('Analyse de la photo…');
    const decoded=await html5QrCode.scanFile(file,true);
    $('#query').value=decoded;
    search(decoded);
    $('#scannerPanel').hidden=true;
  }catch{setStatus('Aucun code-barres lisible sur cette photo. Prenez une photo nette, rapprochée et sans reflet.');}
  finally{event.target.value='';}
}

loadSettings();loadArticles();if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
