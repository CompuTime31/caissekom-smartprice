const CLOUD_CONFIG_KEY='smartprice_cloud_config_v1';
const CLOUD_STATUS_KEY='smartprice_cloud_status_v1';
window.SmartPriceCloud={
  config(){try{return {enabled:false,url:'',key:'',...JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY)||'{}')}}catch{return{enabled:false,url:'',key:''}}},
  saveConfig(c){localStorage.setItem(CLOUD_CONFIG_KEY,JSON.stringify(c));},
  headers(c,extra={}){return {'apikey':c.key,'Authorization':'Bearer '+c.key,'Content-Type':'application/json',...extra}},
  base(c){return c.url.replace(/\/$/,'')+'/rest/v1'},
  async test(c=this.config()){
    if(!c.url||!c.key)throw new Error('URL Supabase ou clé publique absente.');
    const r=await fetch(this.base(c)+'/smartprice_articles?select=code&limit=1',{headers:this.headers(c)});
    if(!r.ok)throw new Error('Connexion refusée ('+r.status+'). Vérifiez la configuration et les tables.');
    return true;
  },
  async pullArticles(c=this.config()){
    const r=await fetch(this.base(c)+'/smartprice_articles?select=code,designation,prix,updated_at&order=designation.asc',{headers:this.headers(c)});
    if(!r.ok)throw new Error('Téléchargement impossible ('+r.status+').');
    return (await r.json()).map(x=>({code:String(x.code),designation:x.designation,prix:Number(x.prix),updatedAt:x.updated_at}));
  },
  async pushArticles(articles,c=this.config()){
    const rows=articles.map(a=>({code:String(a.code),designation:a.designation,prix:Number(a.prix)||0,updated_at:a.updatedAt||new Date().toISOString()}));
    const r=await fetch(this.base(c)+'/smartprice_articles?on_conflict=code',{method:'POST',headers:this.headers(c,{'Prefer':'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify(rows)});
    if(!r.ok)throw new Error('Envoi impossible ('+r.status+'). '+await r.text());
    return rows.length;
  },
  async pullSettings(c=this.config()){
    const r=await fetch(this.base(c)+"/smartprice_settings?id=eq.main&select=payload",{headers:this.headers(c)});
    if(!r.ok)throw new Error('Paramètres indisponibles ('+r.status+').');
    const rows=await r.json();return rows[0]?.payload||null;
  },
  async pushSettings(settings,c=this.config()){
    const r=await fetch(this.base(c)+'/smartprice_settings?on_conflict=id',{method:'POST',headers:this.headers(c,{'Prefer':'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify([{id:'main',payload:settings,updated_at:new Date().toISOString()}])});
    if(!r.ok)throw new Error('Envoi des paramètres impossible ('+r.status+').');
  },
  setStatus(ok,message){localStorage.setItem(CLOUD_STATUS_KEY,JSON.stringify({ok,message,date:new Date().toISOString()}));}
};
