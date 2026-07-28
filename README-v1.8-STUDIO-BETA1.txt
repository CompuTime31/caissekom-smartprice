CAISSEKOM SMARTPRICE v1.8 — STUDIO EDITION BETA 1
=================================================

Cette version étend la v1.7 sans supprimer ses fonctionnalités.

NOUVEAUTÉS OPÉRATIONNELLES
- Nouveau menu SmartPrice Studio.
- Modes d'affichage : Simple, Standard, Complet et Personnalisé.
- Activation/désactivation de 10 éléments du catalogue client.
- Protection configurable : QR, session, GPS, Wi-Fi, QR dynamique et revalidation.
- Durée de session, rayon GPS et coordonnées du magasin.
- Politique d'accès hors magasin.
- Apparence : couleurs, thème, cartes, bannière et message hors magasin.
- Langues activables : français, arabe et anglais.
- Score de configuration.
- Application des principaux paramètres à l'interface client.
- Migration Supabase smartprice_settings.

TEST RAPIDE
1. Ouvrir login.html puis se connecter à l'administration.
2. Ouvrir SmartPrice Studio.
3. Choisir le mode Standard ou Complet.
4. Enregistrer.
5. Ouvrir l'espace client.

TEST QR PROTÉGÉ
Quand l'option QR obligatoire est active, ajouter au lien client :
?sp_access=magasin
Exemple : https://votre-site.vercel.app/?sp_access=magasin
La session est ensuite mémorisée pendant la durée configurée.

LIMITES DE CETTE BETA
- Le navigateur ne peut pas lire directement le nom du Wi-Fi (SSID). Le contrôle Wi-Fi est préparé mais nécessitera un connecteur réseau/serveur.
- Les réglages Studio sont enregistrés localement dans cette beta. La table Supabase est fournie pour la prochaine étape de synchronisation centrale.
- Le multilingue complet des textes sera ajouté dans une beta suivante ; cette version prépare l'activation des langues.
