CAISSEKOM SMARTPRICE v1.9 — QR DYNAMIC BETA 1
==============================================

Cette version étend v1.8 Studio Beta 2 sans supprimer les fonctions précédentes.

NOUVEAUTÉS
- Nouvelle page /access.html et route Vercel /access.
- Génération de QR dynamiques depuis SmartPrice Studio > QR dynamiques.
- Jetons aléatoires stockés sous forme de hash SHA-256 dans Supabase.
- Date d’expiration configurable.
- Limite d’utilisations configurable.
- Durée de session client configurable.
- Validation atomique par fonction SQL Supabase.
- Désactivation manuelle d’un QR.
- Journal minimal : compteur et dernière utilisation.
- Le QR transporte la configuration publique Supabase nécessaire au téléphone client.

INSTALLATION
1. Déployer tous les fichiers sur GitHub/Vercel.
2. Dans Supabase > SQL Editor, exécuter :
   smartprice-v1.9-qr-dynamic-migration.sql
3. Ouvrir admin.html.
4. Vérifier la configuration Supabase dans Paramètres Cloud.
5. Ouvrir SmartPrice Studio > QR dynamiques.
6. Générer le QR puis le scanner avec un autre téléphone.

TEST ATTENDU
- Le QR ouvre /access.html.
- Supabase valide le jeton.
- Une session temporaire est créée sur le téléphone.
- Le téléphone est redirigé vers index.html.
- Un QR expiré, désactivé ou ayant atteint sa limite est refusé.

IMPORTANT — SÉCURITÉ BETA
Cette bêta utilise encore l’administration locale de SmartPrice et la clé publique Supabase.
Les règles SQL permettent donc la gestion des jetons avec le rôle public afin de rester compatibles avec l’architecture actuelle.
Avant une commercialisation réelle, il faudra migrer l’administration vers Supabase Auth et limiter création, liste et désactivation des QR aux utilisateurs authentifiés du magasin.
La validation client via le hash et la fonction SQL est déjà séparée de la valeur brute du jeton.
