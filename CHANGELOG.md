# Build 010

- Ajout du SmartPrice Health Center.
- Nouveau bouton « Tester SmartPrice » depuis le tableau de bord.
- Diagnostic automatique : serveur, interface, réseau, catalogue, configuration, sauvegardes, synchronisation et QR.
- Score de santé global du magasin.
- Détection automatique de l'adresse IPv4 locale préférée.
- URL SmartPrice active fournie par l'API et utilisée pour le QR Code.
- Rapport de diagnostic imprimable.
- Nouvelles API : `GET /api/health-report` et `POST /api/test-smartprice`.
- Passage général au Build 010.

# Build 009

- Interface React et API servies sur le même port 8080 en production.
- Le port 5173 est désormais réservé au développement uniquement.
- QR Code SmartPrice basé automatiquement sur l’adresse réseau détectée.
- Ajout des scripts Windows de préparation et de démarrage production.
- Mise à jour des libellés et métadonnées vers Build 009.

# Build 008 — 2026-08-01

- Import Excel natif `.xlsx` et `.xls` avec sélection de feuille.
- Détection intelligente, prévisualisation et mapping manuel des colonnes.
- QR codes graphiques Wi-Fi et SmartPrice Local.
- Assistant graphique Windows PowerShell.
- Sauvegarde automatique quotidienne du serveur local.
- Mise à jour générale des identifiants Build 008.

# Build 007 — 2026-08-01

- Assistant de première mise en service en cinq étapes.
- Configuration du magasin, du mode de déploiement et du réseau local.
- Statut de configuration disponible via API locale.
- Installateur Windows automatisé avec tâche planifiée et règle pare-feu.
- Supervision du serveur local avec redémarrage automatique.
- Script de désinstallation conservant les données.
- Passage global à Build 007.

# Changelog

## v3.0 RC1 — Build 001 (2026-07-30)

### Développé
- Refonte complète de l'interface en bleu et blanc.
- Nom SmartPrice Studio affiché dans la barre latérale et l'en-tête.
- SmartPrice Studio ajouté comme module visible.
- Navigation réorganisée avec retour à l'administration.
- Écran de sélection des modes Local, Server, Cloud et Hybride.
- Assistant d'import fonctionnel pour CSV et TXT.
- Détection intelligente des colonnes par en-tête et par contenu.
- Correction manuelle de l'association des colonnes.
- Prévisualisation des données avant import.
- Création et mise à jour des produits par code-barres.
- Sauvegarde locale du catalogue et de l'historique d'import.
- Écran de planification de synchronisation préparé.

### En cours / non déclaré terminé
- Lecture binaire XLS/XLSX : interface préparée, moteur à intégrer.
- Surveillance automatique d'un dossier Windows : nécessite SmartPrice Sync Agent.
- Installateur Windows et serveur local : prévus dans les builds suivants.
- Connexion Supabase réelle : dépend de la configuration du client.

## Build 002 — 30 juillet 2026

### Développé
- Serveur HTTP local sans dépendance externe (`local-server/server.mjs`).
- Écoute réseau sur `0.0.0.0:8080` pour les téléphones connectés au Wi-Fi du magasin.
- Détection des adresses IPv4 locales.
- API de santé, réseau et configuration locale.
- Écran **QR & Accès local** connecté aux API locales.
- Configuration du nom du magasin et du SSID Wi-Fi.
- Génération des données normalisées Wi-Fi et URL nécessaires au futur QR graphique.
- Scripts Windows d'installation et de démarrage local.

### Vérifié
- Syntaxe du serveur Node.js validée avec `node --check`.
- Test HTTP des endpoints locaux effectué.

### Restant
- QR graphique combinant connexion Wi-Fi et ouverture de l'application.
- Installation en service Windows.
- Résolution automatique de `smartprice.local`.

## Build 003 — Synchronisation locale réelle

- Ajout du SmartPrice Sync Agent sans dépendance externe.
- Surveillance du dossier d'import et traitement automatique CSV/TXT.
- Archivage des imports réussis et isolement des erreurs.
- Ajout des API locales produits, import et historique.
- Mise à jour de l'identification de l'interface vers Build 003.

## v3.0 RC1 — Build 004 (2026-07-31)

### Développé
- Catalogue administrateur : modification réelle des désignations, codes-barres, prix et stocks.
- Suppression protégée par confirmation et contrôle des doublons de code-barres.
- API locale CRUD complète pour les articles (`POST`, `PUT`, `DELETE`).
- Journal d'audit local persistant pour création, modification, suppression, import et configuration.
- Endpoint de statistiques locales (`GET /api/stats`).
- Validation renforcée de l'import : lignes rejetées, motifs d'erreur et mapping détecté.
- Historique d'import enrichi avec nombre de lignes rejetées.
- Tableau de bord enrichi : articles, imports du jour, dernière synchronisation et mode actif.

### Limites connues
- Le moteur natif `.xlsx/.xls` n'est pas encore intégré au navigateur.
- Le QR Code graphique scannable et le service Windows restent à finaliser.
- Le build React n'a pas pu être exécuté dans l'environnement de livraison, car le registre npm disponible ne fournit pas les dépendances React/Supabase du projet.


## Build 005 (work started)
- Initial sprint started.
- Planning for native Excel import, advanced catalog, local config improvements.

## v3.0 RC1 — Build 006 — 2026-07-31

### Développé
- Catalogue professionnel : catégories, familles, tri, pagination, export CSV et actions groupées.
- Sauvegarde/restauration locale depuis l'interface d'administration.
- API catalogue paginée avec recherche, filtre de catégorie et tri.
- API d'actions groupées sur les articles.
- API publique de consultation d'un prix par code-barres.
- Diagnostic serveur local avec vérification des données, du réseau et de la configuration.
- Sauvegardes serveur horodatées et restauration contrôlée.
- Mise à jour complète des identifiants visuels et techniques vers Build 006.

### Limites connues
- Le moteur natif XLS/XLSX reste à intégrer ; CSV et TXT restent les formats d'import directement traités par l'interface actuelle.
- L'installation comme service Windows nécessite encore une validation sur un poste Windows réel.
- La compilation React complète dépend des paquets npm du projet, indisponibles dans l'environnement de génération actuel.
