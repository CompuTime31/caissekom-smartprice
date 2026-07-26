const AUTH_KEY='smartprice_auth_v1',SESSION_KEY='smartprice_session_v1',SESSION_HOURS=8;
const $=s=>document.querySelector(s);
function bytesToHex(buf){return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function hashPassword(value,salt){const data=new TextEncoder().encode(`${salt}:${value}`);return bytesToHex(await crypto.subtle.digest('SHA-256',data))}
function randomSalt(){const a=new Uint8Array(16);crypto.getRandomValues(a);return bytesToHex(a)}
function auth(){try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'null')}catch{return null}}
function setSession(){localStorage.setItem(SESSION_KEY,JSON.stringify({expiresAt:Date.now()+SESSION_HOURS*60*60*1000}))}
function message(text,error=false){const el=$('#authMessage');el.hidden=false;el.textContent=text;el.className='notice '+(error?'notice-error':'notice-ok')}
if(auth()){ $('#loginView').hidden=false; $('#setupView').hidden=true; }else{ $('#loginView').hidden=true; $('#setupView').hidden=false; }
$('#setupForm').onsubmit=async e=>{e.preventDefault();const p=$('#setupPassword').value,c=$('#setupConfirm').value;if(p.length<6)return message('Le mot de passe doit contenir au moins 6 caractères.',true);if(p!==c)return message('Les deux mots de passe ne correspondent pas.',true);const salt=randomSalt();localStorage.setItem(AUTH_KEY,JSON.stringify({salt,hash:await hashPassword(p,salt),createdAt:new Date().toISOString()}));setSession();location.replace('admin.html')};
$('#loginForm').onsubmit=async e=>{e.preventDefault();const a=auth();if(!a)return location.reload();const ok=(await hashPassword($('#loginPassword').value,a.salt))===a.hash;if(!ok){message('Mot de passe incorrect.',true);$('#loginPassword').select();return}setSession();location.replace('admin.html')};
