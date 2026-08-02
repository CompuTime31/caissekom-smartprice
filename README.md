# Caissekom SmartPrice Enterprise v3.0 RC1

Première base de code consolidée React + TypeScript + Vite. Cette archive est exécutable et sert désormais de branche principale.

## Démarrage local

```bash
npm install
cp .env.example .env
npm run dev
```

Ouvrir ensuite `http://localhost:5173`. En mode démonstration, l’identifiant et le mot de passe sont libres.

## Configuration Supabase

1. Créer un projet Supabase.
2. Exécuter `supabase/schema.sql` dans SQL Editor.
3. Copier `.env.example` vers `.env`.
4. Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.

## État réel de cette RC1

Fonctionnel dans ce livrable :
- authentification locale de démonstration ;
- `/admin` comme point d’entrée ;
- navigation Enterprise responsive ;
- Centre des modules activable/désactivable ;
- blocage des routes désactivées ;
- Dashboard KPI ;
- Catalogue avec recherche ;
- écrans Utilisateurs, Rôles, Magasins, Synchronisation, Monitor, Audit et Paramètres ;
- schéma PostgreSQL/Supabase initial ;
- configuration Vercel.

À connecter à Supabase avant production : authentification réelle, CRUD serveur, RLS détaillées, synchronisation Caissekom réelle, sauvegardes et licences.

## Installation Windows Build 007

1. Installer Node.js 20 ou supérieur.
2. Faire un clic droit sur `INSTALLER-SMARTPRICE.bat` puis **Exécuter en tant qu’administrateur**.
3. L’installateur compile l’application, crée une tâche Windows au démarrage, ajoute la règle pare-feu locale et ouvre `/setup`.
4. Suivre l’assistant de première mise en service.

Le script de désinstallation se trouve dans `installer/uninstall-smartprice.ps1`.
