# Build 007 — Rapport de tests

## Tests effectués
- Vérification syntaxique du serveur local.
- Vérification syntaxique du Sync Agent.
- Démarrage du serveur local sur un port de test.
- Lecture de `/api/health`.
- Lecture de `/api/setup-status`.
- Enregistrement complet de la configuration magasin.
- Vérification du statut de première mise en service.
- Vérification statique de la présence de l’assistant React et des scripts Windows.

## Limites de validation
- L’installateur et la tâche planifiée Windows doivent être validés sur un PC Windows administrateur.
- La compilation React dépend de l’installation des paquets npm.
- Le QR graphique scannable n’est pas encore intégré.
