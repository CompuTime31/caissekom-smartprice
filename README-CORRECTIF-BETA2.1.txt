CAISSEKOM SMARTPRICE v1.9 — QR DYNAMIC BETA 2.1 CORRECTIVE
================================================================

Cette archive remplace uniquement la Beta 2 défectueuse. Les anciennes versions restent conservées.

CORRECTIONS
-----------
- Migration Supabase consolidée dans un seul vrai fichier SQL.
- Aucun texte de documentation non commenté dans le script SQL.
- Création automatique des tables manquantes.
- Ajout ou réparation de SmartPrice Studio, QR dynamiques et journal d'accès.
- Rechargement automatique du schéma PostgREST.
- Messages d'erreur de l'application corrigés.
- Cache du service worker renouvelé.

INSTALLATION
------------
1. Remplacez les fichiers du projet GitHub par ceux de cette archive.
2. Commit puis Push origin dans GitHub Desktop.
3. Attendez le nouveau déploiement Vercel.
4. Dans Supabase : SQL Editor > New query.
5. Ouvrez INSTALLATION-SUPABASE-COMPLETE.sql.
6. Copiez tout son contenu et cliquez sur Run.
7. Le résultat attendu est : Success. No rows returned.
8. Rechargez SmartPrice avec Ctrl+F5.

IMPORTANT
---------
Ne copiez pas le fichier README dans SQL Editor.
Le seul fichier à exécuter est :
INSTALLATION-SUPABASE-COMPLETE.sql

SÉCURITÉ
--------
Les politiques RLS de cette bêta restent volontairement permissives pour les tests.
Avant une utilisation commerciale, elles devront être limitées avec Supabase Auth.
