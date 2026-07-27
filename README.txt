CAISSEKOM SMARTPRICE v1.5 — UTILISATEURS ET RÔLES

NOUVEAUTÉS
- Compte Administrateur principal.
- Comptes Responsable de magasin.
- Comptes Employé en consultation uniquement.
- Connexion par identifiant et mot de passe.
- Désactivation/réactivation des comptes.
- Session de 8 heures.
- Journal d’audit local : connexions, articles, imports et paramètres.
- Migration automatique de l’ancien compte administrateur v1.4.
- Préparation SQL des tables app_users et audit_logs.

IMPORTANT
Dans cette version, les comptes et le journal sont stockés sur l’appareil administrateur.
Le catalogue et les magasins restent partagés par Supabase.
La prochaine étape de sécurité sera la centralisation des comptes avec Supabase Auth.

INSTALLATION
1. Exécuter smartprice-v1.5-migration.sql dans Supabase SQL Editor.
2. Copier tous les fichiers dans le dépôt GitHub du projet.
3. Commit : Version 1.5 - Utilisateurs rôles et audit
4. Push origin et attendre Vercel.
5. Vider le cache de l’application une fois.
6. Se connecter avec l’ancien mot de passe ; l’identifiant migré est admin.
