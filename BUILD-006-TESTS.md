# SmartPrice Enterprise v3.0 RC1 — Build 006

## Tests exécutés

| Test | Résultat |
|---|---|
| Vérification syntaxique `local-server/server.mjs` | Réussi |
| Vérification syntaxique `sync-agent/agent.mjs` | Réussi |
| Démarrage du serveur local sur le port 18082 | Réussi |
| `GET /api/health` et identification Build 006 | Réussi |
| Création d'un article par API | Réussi |
| Recherche et pagination du catalogue | Réussi après correction de la persistance catégorie/famille |
| Action groupée de changement de catégorie | Réussi |
| Consultation publique par code-barres | Réussi |
| Diagnostic du serveur local | Réussi |
| Création et liste des sauvegardes serveur | Réussi |

## Tests restant à effectuer en magasin

- Installation et démarrage automatique sur Windows 10/11.
- Accès depuis plusieurs téléphones connectés au Wi-Fi du magasin.
- Test sur un catalogue volumineux issu de Caissekom.
- Validation d'une restauration après arrêt/redémarrage du poste.
- Compilation et test visuel complets après installation des dépendances npm.
