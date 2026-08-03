# SmartPrice Enterprise v3.0 RC1 — Build 009

## Correction principale

En production, SmartPrice utilise une seule adresse :

`http://ADRESSE-IP-DU-PC:8080`

Le serveur local sert à la fois :

- l’interface React compilée ;
- les API locales ;
- le catalogue ;
- la configuration ;
- les QR Codes.

Le port `5173` reste réservé au développement avec Vite et ne doit pas être utilisé par les clients.

## Installation

1. Exécuter `PREPARER-VERSION-PRODUCTION.bat`.
2. Exécuter `DEMARRER-SMARTPRICE-PRODUCTION.bat`.
3. Sur le PC, ouvrir `http://localhost:8080`.
4. Sur le téléphone connecté au même Wi-Fi, scanner le QR Code qui pointe vers `http://ADRESSE-IP-DU-PC:8080`.
