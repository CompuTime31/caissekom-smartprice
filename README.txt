CAISSEKOM SMARTPRICE v1.0-alpha4

Correctif Supabase :
- correction de l'erreur 404 ;
- suppression automatique de /rest/v1 dans l'URL saisie ;
- connexion aux tables existantes products et stores ;
- messages d'erreur détaillés ;
- envoi/récupération des articles depuis Supabase ;
- conservation du scanner et des fonctions précédentes.

INSTALLATION
1. Dans Supabase > SQL Editor, exécuter supabase-alpha4-migration.sql.
2. Publier les fichiers sur GitHub/Vercel.
3. Dans Administration > Base centrale :
   - Project URL : https://xxxxx.supabase.co
   - Clé : Publishable key (sb_publishable_...)
   - cocher l'activation puis Enregistrer et tester.
4. Importer Excel puis cliquer sur Envoyer vers le cloud.

ATTENTION
Les policies d'écriture anon de ce lot sont temporaires pour les tests.
Elles seront remplacées par une authentification Supabase avant la version 1.0 finale.
