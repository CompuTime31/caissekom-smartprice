CAISSEKOM SMARTPRICE v1.1
=========================

NOUVEAUTÉS
- Connexion Supabase reconstruite avec le SDK officiel supabase-js v2.
- Normalisation automatique de Project URL, même si /rest/v1 est collé.
- Diagnostic précis des erreurs : table absente, RLS, clé invalide ou réseau.
- Import Excel avec synchronisation automatique vers Supabase lorsque le cloud est activé.
- Envoi par lots de 500 articles et mise à jour par code-barres.
- Cache local conservé en cas d'indisponibilité Internet.
- Scanner professionnel conservé.

INSTALLATION SUPABASE
1. Ouvrir Supabase > SQL Editor > New query.
2. Copier tout le fichier smartprice-v1.1-migration.sql.
3. Cliquer sur Run.
4. Publier ensuite cette version sur GitHub/Vercel.
5. Dans Administration > Base centrale, saisir :
   - Project URL : https://xxxxx.supabase.co
   - Publishable key : sb_publishable_...
6. Cocher l'activation puis cliquer sur Enregistrer et tester.

IMPORTANT
Les règles d'écriture anonymes sont temporaires pendant le développement.
Elles seront remplacées par Supabase Auth avant la version finale.
