# Caissekom SmartPrice v2.0 Enterprise — Beta 1

Cette livraison prolonge l’Alpha 1 sans supprimer les fonctions précédentes.

## Nouveautés concrètes
- `monitor.html` : centre de supervision multi-magasins.
- `users.html` : utilisateurs, rôles et activation/suspension.
- `catalog-enterprise.html` : catalogue enrichi, promotions et variantes.
- KPI de santé, alertes et taux de réussite des synchronisations.
- Migration Supabase Beta 1 pour rôles, utilisateurs, variantes, promotions, images, historique des prix et événements de supervision.
- Structure préparée pour la synchronisation incrémentale.

## Installation
1. Déployer tous les fichiers sur GitHub puis Vercel.
2. Exécuter les SQL dans cet ordre :
   1. `INSTALLATION-SUPABASE-COMPLETE.sql`
   2. `SMARTPRICE-V2-ALPHA1-SUPABASE.sql`
   3. `SMARTPRICE-V2-BETA1-SUPABASE.sql`
3. Ouvrir `enterprise.html`, puis `monitor.html`.

## Important
Les nouveaux écrans fonctionnent en mode prototype local pour permettre les tests immédiats.
La synchronisation réelle nécessite toujours une API Caissekom HTTPS. Les politiques RLS de la Beta sont volontairement limitées aux utilisateurs authentifiés, mais elles doivent encore être liées à `auth.uid()` et aux magasins avant un déploiement commercial.

## Étape suivante recommandée
La Release Candidate devra remplacer le stockage local des secrets par une fonction serveur/Edge, brancher les écrans sur Supabase et finaliser les droits par magasin.
