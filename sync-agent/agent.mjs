import {watch, existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, statSync} from 'node:fs';
import {basename, extname, join, resolve} from 'node:path';
import http from 'node:http';

const root=resolve(process.cwd());
const importDir=resolve(process.env.SMARTPRICE_IMPORT_DIR||join(root,'import'));
const archiveDir=join(importDir,'archive');
const errorDir=join(importDir,'errors');
const stateDir=join(root,'data');
const logFile=join(stateDir,'sync-history.json');
const apiUrl=process.env.SMARTPRICE_API_URL||'http://127.0.0.1:8080/api/import';
const interval=Number(process.env.SMARTPRICE_SYNC_INTERVAL||15)*60_000;
for(const d of [importDir,archiveDir,errorDir,stateDir]) mkdirSync(d,{recursive:true});

const readLog=()=>{try{return JSON.parse(readFileSync(logFile,'utf8'))}catch{return []}};
const addLog=(entry)=>writeFileSync(logFile,JSON.stringify([{date:new Date().toISOString(),...entry},...readLog()].slice(0,200),null,2));
const parseDelimited=(text)=>{
 const first=text.split(/\r?\n/).find(Boolean)||'';
 const separators=[';','\t',',','|'];
 const sep=separators.sort((a,b)=>first.split(b).length-first.split(a).length)[0];
 const lines=text.split(/\r?\n/).filter(Boolean);
 const headers=(lines.shift()||'').split(sep).map(x=>x.trim().replace(/^"|"$/g,''));
 return lines.map(line=>Object.fromEntries(line.split(sep).map((v,i)=>[headers[i]||`COL${i+1}`,v.trim().replace(/^"|"$/g,'')])));
};
const request=(payload)=>new Promise((resolveReq,reject)=>{
 const url=new URL(apiUrl); const body=JSON.stringify(payload);
 const req=http.request({hostname:url.hostname,port:url.port||80,path:url.pathname,method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{let raw='';res.on('data',c=>raw+=c);res.on('end',()=>res.statusCode&&res.statusCode<300?resolveReq(raw):reject(new Error(raw||`HTTP ${res.statusCode}`)))});
 req.on('error',reject);req.write(body);req.end();
});
const processFile=async(file)=>{
 const ext=extname(file).toLowerCase(); if(!['.csv','.txt'].includes(ext)) return;
 const full=join(importDir,file); if(!existsSync(full)||statSync(full).size===0)return;
 try{
  const rows=parseDelimited(readFileSync(full,'utf8'));
  await request({fileName:file,rows});
  renameSync(full,join(archiveDir,`${Date.now()}-${basename(file)}`));
  addLog({file,status:'success',rows:rows.length}); console.log(`[OK] ${file}: ${rows.length} lignes`);
 }catch(error){
  try{renameSync(full,join(errorDir,`${Date.now()}-${basename(file)}`))}catch{}
  addLog({file,status:'error',error:String(error)}); console.error(`[ERREUR] ${file}:`,error.message);
 }
};
const scan=async()=>{const {readdirSync}=await import('node:fs');for(const file of readdirSync(importDir))await processFile(file)};
let timer;const schedule=()=>{clearTimeout(timer);timer=setTimeout(scan,1000)};
watch(importDir,{persistent:true},schedule);
setInterval(scan,interval);
scan();
console.log(`SmartPrice Sync Agent actif\nDossier: ${importDir}\nAPI: ${apiUrl}\nIntervalle: ${interval/60000} min`);
