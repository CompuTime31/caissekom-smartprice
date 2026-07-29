# SmartPrice Enterprise v2.1 — Dark Dashboard

## Développement réalisé

- Nouvelle interface sombre inspirée de la maquette 2 validée.
- Menu latéral Enterprise réorganisé.
- Accès direct de `/admin` vers `/monitor`.
- Bouton « Ouvrir Monitor » ajouté sur le tableau de bord.
- Accès directs vers Magasins, Utilisateurs, Catalogue et Synchronisation.
- Barre de recherche fonctionnelle : saisir « monitor », « magasins », « utilisateurs », etc., puis Entrée.
- Conservation des fonctions existantes d’articles, import Excel, QR, SmartPrice Studio, sécurité et Supabase.
- Routes propres compatibles Vercel.

## Test local

Depuis le dossier extrait :

```bash
python -m http.server 8080
```

Puis ouvrir :

- http://localhost:8080/admin.html
- http://localhost:8080/monitor.html

Sur Vercel :

- `/admin`
- `/monitor`

## Remarque

Cette version constitue la première intégration visuelle réelle du nouveau design. Les graphiques temps réel,
notifications et indicateurs connectés à Supabase seront complétés dans les prochains sprints.
