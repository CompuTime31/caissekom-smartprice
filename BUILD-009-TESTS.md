# Tests Build 009

- `node --check local-server/server.mjs` : à exécuter.
- `node --check sync-agent/agent.mjs` : à exécuter.
- Vérification statique : le serveur sert déjà `dist/index.html` comme fallback React.
- Vérification statique : le QR Code utilise l’adresse réseau retournée par `/api/network`.
- Validation Windows et téléphone requise après compilation réelle.
