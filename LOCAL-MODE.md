# SmartPrice Local — Build 002

## Démarrage

1. Installer Node.js 20 ou supérieur.
2. Double-cliquer sur `local-server/install-windows.bat`.
3. Le serveur écoute sur le port `8080` et affiche les adresses accessibles depuis le Wi-Fi du magasin.

## Accès client

Le téléphone et le PC doivent être connectés au même réseau Wi-Fi. Utiliser l'adresse affichée par le serveur, par exemple :

`http://192.168.1.20:8080`

Lorsque le téléphone quitte le Wi-Fi du magasin, cette adresse locale n'est plus accessible.

## API locale ajoutée

- `GET /api/health`
- `GET /api/network`
- `GET /api/local-config`
- `POST /api/local-config`

## Limites de ce build

- Le QR graphique Wi-Fi + URL n'est pas encore généré.
- Le service Windows automatique n'est pas encore installé ; le lancement utilise un fichier `.bat`.
- Le nom `smartprice.local` nécessite une configuration mDNS/DNS qui sera intégrée dans l'installateur final.
