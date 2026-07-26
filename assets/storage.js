const CLOUD_CONFIG_KEY='smartprice_cloud_config_v1';
const CLOUD_STATUS_KEY='smartprice_cloud_status_v1';
const MAIN_STORE_ID='00000000-0000-0000-0000-000000000001';

window.SmartPriceCloud={
  version:'1.1.1',_client:null,_signature:'',
  normalizeUrl(value){
    let raw=String(value||'').trim();
    if(!raw)return '';
    if(!/^https?:\/\//i.test(raw))raw='https://'+raw;
    raw=raw.replace(/\/rest\/v1\/?(?:.*)?$/i,'').replace(/\/+$/,'');
    try{const u=new URL(raw);return `${u.protocol}//${u.host}`;}catch{return raw;}
  },
  config(){try{const saved=JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY)||'{}');return{enabled:false,url:'',key:'',...saved,url:this.normalizeUrl(saved.url)}}catch{return{enabled:false,url:'',key:''}}},
  saveConfig(c){const clean={enabled:!!c.enabled,url:this.normalizeUrl(c.url),key:String(c.key||'').trim()};localStorage.setItem(CLOUD_CONFIG_KEY,JSON.stringify(clean));this._client=null;this._signature='';return clean;},
  validate(c){
    if(!c.url||!c.key)throw new Error('URL Supabase ou clé publique absente.');
    const url=this.normalizeUrl(c.url);
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url))throw new Error(`URL invalide : ${url}. Utilisez uniquement https://xxxxx.supabase.co`);
    if(!/^sb_publishable_/i.test(c.key)&&!/^eyJ/i.test(c.key))throw new Error('Clé publique invalide ou incomplète.');
    if(!window.supabase?.createClient)throw new Error('Le SDK Supabase n’est pas chargé. Vérifiez Internet et rechargez la page.');
  },
  client(c=this.config()){
    c={...c,url:this.normalizeUrl(c.url)};this.validate(c);const sig=c.url+'|'+c.key;
    if(!this._client||this._signature!==sig){this._client=window.supabase.createClient(c.url,c.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{headers:{'X-Client-Info':'caissekom-smartprice/1.1.1'}}});this._signature=sig;}
    return this._client;
  },
  explain(error,prefix='Erreur Supabase'){
    if(!error)return prefix;
    const code=error.code?` [${error.code}]`:'';let msg=error.message||String(error);
    if(error.code==='PGRST205'||/schema cache|Could not find the table/i.test(msg))msg='La table products n’est pas visible dans l’API. Exécutez la migration SQL puis attendez quelques secondes.';
    else if(error.code==='42501'||/permission denied|row-level security/i.test(msg))msg='Accès refusé par les règles RLS. Exécutez la migration SQL v1.1.1.';
    else if(/Failed to fetch|NetworkError/i.test(msg))msg='Connexion réseau impossible. Vérifiez Internet, l’URL du projet et les bloqueurs de contenu.';
    else if(/Invalid API key|JWT/i.test(msg))msg='Clé publique invalide ou copiée incomplètement.';
    return `${prefix}${code} : ${msg}`;
  },
  async rawDiagnostic(c=this.config()){
    const url=this.normalizeUrl(c.url);this.validate({...c,url});
    const endpoint=`${url}/rest/v1/products?select=barcode&limit=1`;
    let response;
    try{response=await fetch(endpoint,{cache:'no-store',headers:{apikey:c.key,Authorization:`Bearer ${c.key}`,Accept:'application/json'}});}catch(error){throw new Error(`Réseau inaccessible vers ${endpoint} : ${error.message}`);}
    const body=await response.text();
    if(!response.ok){let detail=body;try{const parsed=JSON.parse(body);detail=parsed.message||parsed.msg||parsed.error||body;}catch{}throw new Error(`Supabase HTTP ${response.status} sur ${endpoint} — ${detail}`);}
    return{status:response.status,endpoint};
  },
  async test(c=this.config()){
    c={...c,url:this.normalizeUrl(c.url)};
    await this.rawDiagnostic(c);
    const db=this.client(c);const {error,count}=await db.from('products').select('barcode',{count:'exact',head:true});
    if(error)throw new Error(this.explain(error,'Connexion refusée'));
    return{ok:true,count:count||0,url:c.url,version:this.version};
  },
  async pullArticles(c=this.config()){const db=this.client(c);const {data,error}=await db.from('products').select('barcode,designation,price,updated_at').eq('active',true).order('designation',{ascending:true});if(error)throw new Error(this.explain(error,'Téléchargement impossible'));return(data||[]).map(x=>({code:String(x.barcode),designation:x.designation,prix:Number(x.price),updatedAt:x.updated_at}));},
  async pushArticles(articles,c=this.config()){const db=this.client(c),now=new Date().toISOString();const rows=articles.map(a=>({barcode:String(a.code).trim(),designation:String(a.designation||'').trim(),price:Number(a.prix)||0,active:true,updated_at:a.updatedAt||now})).filter(x=>x.barcode&&x.designation);for(let i=0;i<rows.length;i+=500){const {error}=await db.from('products').upsert(rows.slice(i,i+500),{onConflict:'barcode',ignoreDuplicates:false});if(error)throw new Error(this.explain(error,`Envoi impossible (lot ${Math.floor(i/500)+1})`));}return rows.length;},
  async pullSettings(c=this.config()){const db=this.client(c);const {data,error}=await db.from('stores').select('name,address,phone,email,website,logo,updated_at').eq('id',MAIN_STORE_ID).maybeSingle();if(error)throw new Error(this.explain(error,'Paramètres indisponibles'));if(!data)return null;return{name:data.name||'',address:data.address||'',phone:data.phone||'',email:data.email||'',website:data.website||'',logo:data.logo||''};},
  async pushSettings(settings,c=this.config()){const db=this.client(c);const row={id:MAIN_STORE_ID,name:settings.name||'SmartPrice',address:settings.address||null,phone:settings.phone||null,email:settings.email||null,website:settings.website||null,logo:settings.logo||null,updated_at:new Date().toISOString()};const {error}=await db.from('stores').upsert(row,{onConflict:'id'});if(error)throw new Error(this.explain(error,'Envoi des paramètres impossible'));},
  setStatus(ok,message){localStorage.setItem(CLOUD_STATUS_KEY,JSON.stringify({ok,message,date:new Date().toISOString(),version:this.version}));}
};
