const CLOUD_CONFIG_KEY='smartprice_cloud_config_v1';
const CLOUD_STATUS_KEY='smartprice_cloud_status_v1';
const MAIN_STORE_ID='00000000-0000-0000-0000-000000000001';

window.SmartPriceCloud={
  normalizeUrl(value){
    let url=String(value||'').trim();
    if(!url)return '';
    if(!/^https?:\/\//i.test(url))url='https://'+url;
    url=url.replace(/\/+$/,'');
    url=url.replace(/\/rest\/v1$/i,'');
    return url;
  },
  config(){
    try{
      const saved=JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY)||'{}');
      return {enabled:false,url:'',key:'',...saved,url:this.normalizeUrl(saved.url)};
    }catch{return{enabled:false,url:'',key:''}}
  },
  saveConfig(c){
    const clean={...c,url:this.normalizeUrl(c.url),key:String(c.key||'').trim()};
    localStorage.setItem(CLOUD_CONFIG_KEY,JSON.stringify(clean));
    return clean;
  },
  headers(c,extra={}){
    return {'apikey':c.key,'Authorization':'Bearer '+c.key,'Content-Type':'application/json',...extra};
  },
  base(c){return this.normalizeUrl(c.url)+'/rest/v1';},
  async errorMessage(r,prefix){
    let detail='';
    try{const body=await r.clone().json();detail=body.message||body.hint||body.details||body.code||'';}catch{try{detail=await r.text();}catch{}}
    return `${prefix} (${r.status})${detail?' : '+detail:''}`;
  },
  validate(c){
    if(!c.url||!c.key)throw new Error('URL Supabase ou clé publique absente.');
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(this.normalizeUrl(c.url)))throw new Error('URL Supabase invalide. Utilisez uniquement https://xxxxx.supabase.co');
    if(!/^sb_publishable_/i.test(c.key)&&!/^eyJ/i.test(c.key))throw new Error('Clé publique invalide. Utilisez la Publishable key ou l’ancienne anon key.');
  },
  async test(c=this.config()){
    c={...c,url:this.normalizeUrl(c.url)};this.validate(c);
    const r=await fetch(this.base(c)+'/products?select=barcode&limit=1',{headers:this.headers(c)});
    if(!r.ok)throw new Error(await this.errorMessage(r,'Connexion refusée'));
    return true;
  },
  async pullArticles(c=this.config()){
    c={...c,url:this.normalizeUrl(c.url)};this.validate(c);
    const r=await fetch(this.base(c)+'/products?select=barcode,designation,price,updated_at&active=eq.true&order=designation.asc',{headers:this.headers(c)});
    if(!r.ok)throw new Error(await this.errorMessage(r,'Téléchargement impossible'));
    return (await r.json()).map(x=>({code:String(x.barcode),designation:x.designation,prix:Number(x.price),updatedAt:x.updated_at}));
  },
  async pushArticles(articles,c=this.config()){
    c={...c,url:this.normalizeUrl(c.url)};this.validate(c);
    const rows=articles.map(a=>({barcode:String(a.code),designation:a.designation,price:Number(a.prix)||0,active:true,updated_at:a.updatedAt||new Date().toISOString()}));
    const r=await fetch(this.base(c)+'/products?on_conflict=barcode',{method:'POST',headers:this.headers(c,{'Prefer':'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify(rows)});
    if(!r.ok)throw new Error(await this.errorMessage(r,'Envoi impossible'));
    return rows.length;
  },
  async pullSettings(c=this.config()){
    c={...c,url:this.normalizeUrl(c.url)};this.validate(c);
    const r=await fetch(this.base(c)+`/stores?id=eq.${MAIN_STORE_ID}&select=name,address,phone,email,website,logo,updated_at`,{headers:this.headers(c)});
    if(!r.ok)throw new Error(await this.errorMessage(r,'Paramètres indisponibles'));
    const row=(await r.json())[0];
    if(!row)return null;
    return {name:row.name||'',address:row.address||'',phone:row.phone||'',email:row.email||'',website:row.website||'',logo:row.logo||''};
  },
  async pushSettings(settings,c=this.config()){
    c={...c,url:this.normalizeUrl(c.url)};this.validate(c);
    const row={id:MAIN_STORE_ID,name:settings.name||'SmartPrice',address:settings.address||null,phone:settings.phone||null,email:settings.email||null,website:settings.website||null,logo:settings.logo||null,updated_at:new Date().toISOString()};
    const r=await fetch(this.base(c)+'/stores?on_conflict=id',{method:'POST',headers:this.headers(c,{'Prefer':'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify([row])});
    if(!r.ok)throw new Error(await this.errorMessage(r,'Envoi des paramètres impossible'));
  },
  setStatus(ok,message){localStorage.setItem(CLOUD_STATUS_KEY,JSON.stringify({ok,message,date:new Date().toISOString()}));}
};
