CAISSEKOM SMARTPRICE v1.9 — QR DYNAMIC BETA 2

Nouveautés
- Tableau de bord QR : actifs, expirés, scans du jour, refus du jour.
- Journal détaillé des accès autorisés et refusés.
- QR rattaché à un point de vente ou une caisse.
- Option QR réutilisable ou utilisable une seule fois.
- Option de verrouillage du QR au premier appareil.
- Motifs de refus enregistrés : expiré, désactivé, limite atteinte, déjà utilisé, autre appareil.
- Sessions temporaires conservées après validation.

Installation Supabase
1. La migration Beta 1 doit déjà avoir été exécutée.
2. Ouvrir Supabase > SQL Editor.
3. Exécuter smartprice-v1.9-qr-dynamic-beta2-migration.sql.
4. Redéployer tous les fichiers sur GitHub/Vercel.
5. Ouvrir admin.html > SmartPrice Studio > QR & sécurité.

Test conseillé
- Générer un QR de 5 minutes, maximum 2 utilisations.
- Scanner avec un second téléphone.
- Vérifier l'ouverture de index.html et le journal d'accès.
- Tester ensuite QR non réutilisable ou verrouillé au premier appareil.

Note sécurité
Cette bêta utilise encore la clé publique Supabase dans le navigateur. Avant commercialisation, remplacer l'administration locale par Supabase Auth et durcir les règles RLS.
