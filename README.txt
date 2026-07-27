CAISSEKOM SMARTPRICE v1.4 — MULTI-MAGASINS

Nouveautés :
- création et sélection de plusieurs magasins ;
- catalogue et prix séparés par magasin ;
- QR Code lié automatiquement au magasin actif ;
- import Excel et synchronisation Supabase pour le magasin sélectionné ;
- compatibilité avec les données v1.3 (migration automatique vers le magasin principal).

INSTALLATION :
1. Exécuter smartprice-v1.4-migration.sql dans Supabase SQL Editor.
2. Remplacer les fichiers du projet GitHub par ceux de ce dossier.
3. Commit puis Push origin.
4. Après le déploiement Vercel, vider le cache de l’application.
5. Dans Administration > Magasins, créer ou sélectionner un magasin.

IMPORTANT :
Cette version pose la base multi-magasins. L’authentification cloud et les rôles sécurisés seront renforcés dans la v1.5.
