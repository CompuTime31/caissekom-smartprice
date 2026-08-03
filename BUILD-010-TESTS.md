# SmartPrice Enterprise v3.0 RC1 — Build 010

## Tests exécutés dans l'environnement de génération

- Validation syntaxique Node.js du serveur local.
- Validation syntaxique Node.js du Sync Agent.
- Démarrage du serveur local sur un port de test.
- Appel de `/api/health`.
- Appel de `/api/network`.
- Appel de `/api/health-report`.
- Appel de `/api/test-smartprice`.
- Vérification de la présence de la route React `/health`.
- Vérification des libellés Build 010.

## Tests terrain encore nécessaires

- Test du QR Code avec un téléphone sur le Wi-Fi réel du magasin.
- Test d'un changement d'adresse IP du PC.
- Test du pare-feu Windows.
- Test du démarrage automatique du service Windows.
- Test d'impression du rapport de santé.

## Résultats automatiques

- `local-server/server.mjs` : réussi.
- `sync-agent/agent.mjs` : réussi.
- `/api/health` : HTTP 200.
- `/api/network` : HTTP 200.
- `/api/health-report` : HTTP 200 — score 63%.
- `/api/test-smartprice` : HTTP 207 — score 63%.
