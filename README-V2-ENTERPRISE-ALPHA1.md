# SmartPrice v2.0 Enterprise Alpha 1

Nouveaux fichiers : `enterprise.html`, `sync.html`, `stores.html`.

Installation Supabase : exécuter d’abord `INSTALLATION-SUPABASE-COMPLETE.sql`, puis `SMARTPRICE-V2-ALPHA1-SUPABASE.sql`.

L’API Caissekom doit exposer `GET /health` et `GET /products`. La synchronisation réelle dépend donc de l’API disponible dans Caissekom.

Cette Alpha conserve les clés dans le navigateur pour les tests. La Beta déplacera les secrets côté serveur.
