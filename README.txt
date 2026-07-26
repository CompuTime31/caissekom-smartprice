CAISSEKOM SMARTPRICE v0.2

Fonctions :
- Recherche par code-barres, code interne ou désignation
- Scan caméra sur navigateur compatible et adresse HTTPS
- Import direct Excel XLSX/XLS et CSV avec aperçu
- Ajout, modification et suppression d'articles
- Paramètres du magasin
- Génération et téléchargement du QR Code
- Migration automatique des données locales de la version 0.1

TEST LOCAL
1. Ouvrir un terminal dans ce dossier.
2. Exécuter : python -m http.server 8080
3. Ouvrir : http://localhost:8080
4. Administration : http://localhost:8080/admin.html

IMPORTANT
- La caméra fonctionne correctement sur HTTPS, par exemple après déploiement sur Vercel.
- Les données de cette version sont stockées dans le navigateur. Une vraie base de données et une connexion sécurisée seront ajoutées dans une prochaine étape.
- L'import Excel et la génération QR utilisent des bibliothèques chargées en ligne.
