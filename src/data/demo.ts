export type ModuleItem={id:string;name:string;description:string;route:string;enabled:boolean};
export const defaultModules:ModuleItem[]=[
{id:'catalog',name:'Catalogue Enterprise',description:'Articles, prix et stock disponibles au scan',route:'/catalog',enabled:true},
{id:'sync',name:'Import intelligent',description:'Import CSV/TXT et association automatique des colonnes',route:'/sync',enabled:true},
{id:'studio',name:'SmartPrice Studio',description:'Personnalisation de l’interface client',route:'/studio',enabled:true},
{id:'access',name:'QR & Accès',description:'Accès local par Wi-Fi et QR code',route:'/access',enabled:true},
{id:'monitor',name:'Monitor',description:'État des services et du déploiement',route:'/monitor',enabled:true},
{id:'stores',name:'Magasins',description:'Points de vente et responsables',route:'/stores',enabled:true},
{id:'users',name:'Utilisateurs',description:'Comptes, rôles et accès',route:'/users',enabled:true},
{id:'audit',name:'Journal d’audit',description:'Traçabilité des actions',route:'/audit',enabled:true},
{id:'settings',name:'Paramètres',description:'Modes Local, Server, Cloud et Hybride',route:'/settings',enabled:true}
];
export const products=[
{id:1,designation:'Eau minérale 1,5 L',barcode:'6130000000012',price:60,stock:148,status:'Synchronisé'},
{id:2,designation:'Lait entier 1 L',barcode:'6130000000029',price:145,stock:42,status:'Synchronisé'},
{id:3,designation:'Café moulu 250 g',barcode:'6130000000036',price:520,stock:18,status:'Synchronisé'},
{id:4,designation:'Huile végétale 2 L',barcode:'6130000000043',price:680,stock:73,status:'Synchronisé'}
];
