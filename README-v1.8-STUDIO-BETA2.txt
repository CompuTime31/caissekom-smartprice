CAISSEKOM SMARTPRICE v1.8 — STUDIO EDITION BETA 2
================================================

Cette version prolonge Beta 1 sans supprimer les fonctions existantes.

NOUVEAUTÉS
- Les paramètres SmartPrice Studio pilotent réellement l'interface client.
- Synchronisation des réglages Studio par magasin avec Supabase.
- Boutons Charger du Cloud / Enregistrer dans le Cloud.
- Validation de cohérence avant enregistrement.
- Application du thème, des couleurs, du sens RTL et de la langue par défaut.
- Protection QR, session temporaire et géolocalisation renforcées.
- QR dynamique avec date d'émission : valeur attendue « magasin.TIMESTAMP ».
- Restrictions hors magasin : recherche, catalogue, fiches et prix.
- Fallback local si Supabase est indisponible.

INSTALLATION
1. Déployer le dossier sur Vercel ou un serveur HTTPS.
2. Exécuter les migrations précédentes puis smartprice-v1.8-studio-beta2-migration.sql.
3. Configurer Supabase dans Administration > Cloud.
4. Ouvrir Administration > SmartPrice Studio.
5. Enregistrer localement puis dans le Cloud.

TEST QR STATIQUE
https://votre-site.vercel.app/?sp_access=magasin

TEST QR DYNAMIQUE
https://votre-site.vercel.app/?sp_access=magasin.TIMESTAMP
Remplacer TIMESTAMP par Date.now() en millisecondes.

LIMITATION NAVIGATEUR
Un navigateur ne peut pas lire directement le nom du Wi-Fi. Le contrôle Wi-Fi reste préparé et nécessite un connecteur réseau local ou une validation côté serveur.
