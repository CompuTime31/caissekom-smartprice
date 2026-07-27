CAISSEKOM SMARTPRICE v1.6

NOUVEAUTÉS
- Connecteur HTTPS pour Caissekom WinDev
- Test de connexion et clé API
- Synchronisation manuelle ou automatique
- Mode ajout/mise à jour ou remplacement complet
- Promotions avec dates de début et de fin
- États de disponibilité
- Tableau de bord et journal des synchronisations
- Import Excel conservé comme solution de secours
- Toutes les fonctions v1.5 conservées

INSTALLATION
1. Exécuter smartprice-v1.6-migration.sql dans Supabase SQL Editor.
2. Remplacer les fichiers du projet GitHub par ceux de ce dossier.
3. Commit : Version 1.6 - Connecteur Caissekom et promotions
4. Push origin et attendre Vercel.
5. Vider une fois le cache application depuis Administration > Base centrale.

FORMAT API ATTENDU
GET HTTPS vers l’URL configurée, avec les en-têtes :
X-SmartPrice-Key: votre-cle
Authorization: Bearer votre-cle

Réponse JSON acceptée :
{
  "products": [
    {
      "barcode": "6132546140095",
      "designation": "Produit",
      "price": 150,
      "promo_price": 120,
      "promo_start": "2026-07-27T08:00:00Z",
      "promo_end": "2026-07-31T22:00:00Z",
      "status": "available"
    }
  ]
}
