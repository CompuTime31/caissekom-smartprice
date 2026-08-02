# SmartPrice Enterprise v3.0 RC1 — Build 003

## Développements vérifiés

- Serveur local : contrôle syntaxique Node.js réussi.
- Sync Agent : contrôle syntaxique Node.js réussi.
- API `/api/import` ajoutée pour recevoir les lignes CSV/TXT et créer ou mettre à jour les produits par code-barres.
- API `/api/products` ajoutée.
- API `/api/sync-history` ajoutée.
- Surveillance réelle du dossier `import` avec traitement automatique des fichiers `.csv` et `.txt`.
- Archivage des fichiers réussis et déplacement des fichiers en erreur.
- Script Windows d'installation du démarrage automatique de l'agent.

## Limites connues

- Les formats `.xlsx` et `.xls` nécessitent encore un moteur Excel dédié.
- Le QR graphique et le service Windows système seront finalisés dans une étape ultérieure.
- La compilation React complète dépend de paquets npm indisponibles dans l'environnement de génération actuel.
