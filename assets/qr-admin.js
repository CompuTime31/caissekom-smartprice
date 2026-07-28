(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function inject(){
  const tabs=$('.studio-tabs'), content=$('.studio-content'); if(!tabs||!content||$('#studioQrManager'))return;
  const tab=document.createElement('button'); tab.type='button';tab.className='studio-tab';tab.dataset.studioTab='dynamic-qr';tab.innerHTML='▣ QR & sécurité';tabs.append(tab);
  const pane=document.createElement('article');pane.className='card studio-pane';pane.dataset.studioPane='dynamic-qr';pane.id='studioQrManager';
  pane.innerHTML=`
  <div class="section-heading"><div><span class="eyebrow">SÉCURITÉ V1.9 BETA 2</span><h3>QR dynamiques professionnels</h3></div><button type="button" class="btn btn-soft" id="qrRefreshBtn">Actualiser</button></div>
  <div class="qr-kpis"><div><span>QR actifs</span><strong id="qrKpiActive">—</strong></div><div><span>QR expirés</span><strong id="qrKpiExpired">—</strong></div><div><span>Scans aujourd'hui</span><strong id="qrKpiToday">—</strong></div><div><span>Accès refusés</span><strong id="qrKpiDenied">—</strong></div></div>
  <div class="form-row"><label>Validité du QR (minutes)<input id="qrValidityMinutes" type="number" min="1" max="10080" value="60"></label><label>Nombre maximal d’utilisations<input id="qrMaxUses" type="number" min="1" max="10000" value="100"></label></div>
  <div class="form-row"><label>Durée de session client (minutes)<input id="qrSessionMinutes" type="number" min="1" max="1440" value="120"></label><label>Libellé<input id="qrLabel" type="text" maxlength="80" placeholder="Ex. Entrée magasin"></label></div>
  <div class="form-row"><label>Point de vente / caisse<input id="qrPointOfSale" type="text" maxlength="80" placeholder="Ex. Caisse 1"></label><label class="check-line"><input id="qrAllowReuse" type="checkbox" checked> Autoriser la réutilisation</label></div>
  <label class="check-line"><input id="qrSingleDevice" type="checkbox"> Verrouiller le QR au premier appareil utilisé</label>
  <div class="qr-manager-actions"><button type="button" class="btn btn-primary" id="qrGenerateBtn">Générer un QR dynamique</button><span id="qrManagerState" class="muted"></span></div>
  <div id="qrGeneratedCard" class="qr-generated-card" hidden><div id="qrCanvas" class="qr-canvas"></div><div class="qr-generated-copy"><strong id="qrGeneratedLabel">QR dynamique</strong><small id="qrGeneratedExpiry"></small><input id="qrGeneratedUrl" readonly><div class="button-row"><button type="button" class="btn btn-soft" id="qrCopyBtn">Copier le lien</button><button type="button" class="btn btn-soft" id="qrPrintBtn">Imprimer</button></div></div></div>
  <h4>QR créés</h4><div class="table-wrap qr-token-table"><table><thead><tr><th>Libellé</th><th>Point</th><th>Expiration</th><th>Utilisations</th><th>État</th><th></th></tr></thead><tbody id="qrTokenRows"><tr><td colspan="6">Chargement…</td></tr></tbody></table></div>
  <h4>Journal des accès</h4><div class="table-wrap qr-log-table"><table><thead><tr><th>Date</th><th>Résultat</th><th>Motif</th><th>Appareil</th></tr></thead><tbody id="qrLogRows"><tr><td colspan="4">Chargement…</td></tr></tbody></table></div>`;
  content.insertBefore(pane,content.querySelector('.studio-actions'));
  $$('.studio-tab').forEach(b=>b.onclick=()=>{$$('.studio-tab,.studio-pane').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(`[data-studio-pane="${b.dataset.studioTab}"]`)?.classList.add('active');if(b.dataset.studioTab==='dynamic-qr')refreshAll();});
  $('#qrGenerateBtn').onclick=generate;$('#qrRefreshBtn').onclick=refreshAll;$('#qrCopyBtn').onclick=copy;$('#qrPrintBtn').onclick=()=>window.print();
}
function state(t){const e=$('#qrManagerState');if(e)e.textContent=t;}
function baseUrl(){return new URL('access.html',location.href).toString();}
async function copy(){try{await navigator.clipboard.writeText($('#qrGeneratedUrl').value);state('Lien copié.');}catch{$('#qrGeneratedUrl').select();document.execCommand('copy');state('Lien copié.');}}
async function generate(){
  if(!window.SmartPriceCloud?.config().enabled)return alert('Activez Supabase dans Paramètres Cloud.');
  const btn=$('#qrGenerateBtn');try{btn.disabled=true;btn.textContent='Génération…';state('Création du jeton sécurisé…');
    const payload={validityMinutes:+$('#qrValidityMinutes').value||60,maxUses:+$('#qrMaxUses').value||100,sessionMinutes:+$('#qrSessionMinutes').value||120,label:$('#qrLabel').value.trim(),pointOfSale:$('#qrPointOfSale').value.trim(),allowReuse:$('#qrAllowReuse').checked,singleDevice:$('#qrSingleDevice').checked};
    const row=await window.SmartPriceCloud.createAccessTokenV2(payload);const url=new URL(baseUrl());url.searchParams.set('token',row.token);url.searchParams.set('store',row.store_id);const cc=window.SmartPriceCloud.config();url.searchParams.set('cloud',btoa(unescape(encodeURIComponent(JSON.stringify({url:cc.url,key:cc.key})))));
    $('#qrGeneratedCard').hidden=false;$('#qrGeneratedUrl').value=url;$('#qrGeneratedLabel').textContent=row.label||'QR dynamique';$('#qrGeneratedExpiry').textContent='Expire le '+new Date(row.expires_at).toLocaleString('fr-FR');$('#qrCanvas').innerHTML='';new QRCode($('#qrCanvas'),{text:url.toString(),width:220,height:220,correctLevel:QRCode.CorrectLevel.M});state('QR généré.');await refreshAll();
  }catch(e){alert(e.message||e);state('Échec de la génération.');}finally{btn.disabled=false;btn.textContent='Générer un QR dynamique';}
}
async function refreshAll(){await Promise.allSettled([loadTokens(),loadLogs(),loadStats()]);}
async function loadStats(){try{const s=await window.SmartPriceCloud.accessDashboard();$('#qrKpiActive').textContent=s.active_qr??0;$('#qrKpiExpired').textContent=s.expired_qr??0;$('#qrKpiToday').textContent=s.scans_today??0;$('#qrKpiDenied').textContent=s.denied_today??0;}catch(e){state(e.message||String(e));}}
async function loadTokens(){const body=$('#qrTokenRows');if(!body)return;if(!window.SmartPriceCloud?.config().enabled){body.innerHTML='<tr><td colspan="6">Supabase n’est pas activé.</td></tr>';return;}try{const rows=await window.SmartPriceCloud.listAccessTokensV2();body.innerHTML=rows.length?rows.map(r=>{const expired=Date.parse(r.expires_at)<Date.now(),active=r.active&&!expired&&r.use_count<r.max_uses;return `<tr><td>${esc(r.label||'QR dynamique')}</td><td>${esc(r.point_of_sale||'—')}</td><td>${new Date(r.expires_at).toLocaleString('fr-FR')}</td><td>${r.use_count||0} / ${r.max_uses}</td><td><span class="status-pill ${active?'ok':'off'}">${active?'Actif':expired?'Expiré':!r.active?'Désactivé':'Limite atteinte'}</span></td><td><button class="btn btn-danger-soft btn-small" data-revoke-token="${esc(r.id)}" ${!r.active?'disabled':''}>Désactiver</button></td></tr>`}).join(''):'<tr><td colspan="6">Aucun QR.</td></tr>';$$('[data-revoke-token]').forEach(b=>b.onclick=async()=>{if(confirm('Désactiver ce QR Code ?')){await window.SmartPriceCloud.revokeAccessToken(b.dataset.revokeToken);await refreshAll();}});}catch(e){body.innerHTML=`<tr><td colspan="6">${esc(e.message||e)}</td></tr>`;}}
async function loadLogs(){const body=$('#qrLogRows');if(!body)return;try{const rows=await window.SmartPriceCloud.listAccessLogs(100);body.innerHTML=rows.length?rows.map(r=>`<tr><td>${new Date(r.created_at).toLocaleString('fr-FR')}</td><td><span class="status-pill ${r.result==='accepted'?'ok':'off'}">${r.result==='accepted'?'Autorisé':'Refusé'}</span></td><td>${esc(r.reason||'—')}</td><td>${esc((r.user_agent||'Appareil inconnu').slice(0,70))}</td></tr>`).join(''):'<tr><td colspan="4">Aucun accès enregistré.</td></tr>';}catch(e){body.innerHTML=`<tr><td colspan="4">${esc(e.message||e)}</td></tr>`;}}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',inject):inject();
})();
