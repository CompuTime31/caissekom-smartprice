# Caissekom SmartPrice Enterprise — Beta Complete

Cette archive est la nouvelle base propre du projet. Elle remplace le mélange de fichiers
provenant des versions v1.8, v1.9, Alpha et Beta précédentes.

## Déploiement GitHub

1. Créez une sauvegarde de l'ancien dépôt.
2. Supprimez tous les anciens fichiers à la racine du dépôt.
3. Extrayez cette archive.
4. Ouvrez le dossier `caissekom-smartprice-enterprise-beta-complete`.
5. Envoyez uniquement le contenu de ce dossier à la racine de GitHub.
6. Faites un nouveau commit sur la branche `main`.
7. Attendez le nouveau déploiement automatique Vercel.

Ne déposez pas le dossier parent lui-même dans GitHub. `index.html` doit être directement
visible à la racine du dépôt.

## Routes à tester après le déploiement

- `/`
- `/admin`
- `/enterprise`
- `/monitor`
- `/users`
- `/stores`
- `/sync`
- `/access`
- `/catalog-enterprise`

## Installation Supabase

Dans Supabase > SQL Editor, exécutez uniquement :

`supabase/SMARTPRICE-ENTERPRISE-INSTALL.sql`

Effectuez d'abord l'installation sur un projet Supabase de test.

## Contenu conservé

- Interface client et scanner
- Administration et SmartPrice Studio
- QR dynamiques et contrôle d'accès
- Tableau de bord Enterprise
- SmartPrice Monitor
- Gestion des magasins
- Utilisateurs et rôles
- Catalogue Enterprise
- Connecteur Caissekom
- Documentation OpenAPI

## Contrôle du déploiement

Dans Vercel, le nouveau déploiement doit afficher le hash du dernier commit GitHub.
Ne cliquez pas sur “Redeploy” d'un ancien déploiement : cette action redéploie l'ancien commit.
