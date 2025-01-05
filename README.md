# Hikings - Randonnées et aventures

Bienvenue sur le dépôt GitHub de **Hikings**, un site web qui regroupe toutes les randonnées effectuées par Jonathan. Ce projet met à disposition des photos, des tracés GPX, ainsi que des informations sur les dénivelés, la difficulté et bien plus encore !

<p>
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="version">
    <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="version">
    <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="version">
    <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="version">
</p>

## Auteur
* [**Sorway**](https://github.com/Sorway)

## À propos

Des vastes étendues du **Parc national du Mercantour** aux mystères de la **Vallée des Merveilles**, en passant par les majestueuses **Gorges du Verdon** et les paysages envoûtants du **Parc national des Calanques**, chaque aventure est une nouvelle source d'émerveillement.

> "La nature offre des panoramas spectaculaires pour ceux qui prennent le temps de s'y aventurer."

Ce projet est à la fois un carnet de bord personnel et une source d'inspiration pour tous les passionnés de randonnée.

## Fonctionnalités

- **Affichage des randonnées :** Parcourez une liste de randonnées avec leurs détails (photos, tracés GPX, difficulté, etc.).
- **Recherche et filtrage :** Trouvez facilement des randonnées selon vos critères (niveau, localisation, etc.).
- **Visualisation des tracés GPX :** Affichez les itinéraires directement sur une carte interactive.
- **Base de données :** Stockage efficace des informations sur une base MariaDB.

## Architecture

### Frontend
- **Technologies :** HTML, CSS, JavaScript
- **Caractéristiques :** Une interface utilisateur intuitive et responsive permettant une navigation facile sur toutes les plateformes.

### Backend
- **Technologies :** Node.js, Express.js
- **API REST :** Permet la communication entre le frontend et la base de données.

### Base de données
- **Technologie :** MariaDB
- **Fonctionnalités :** Stockage des données de randonnées, incluant les photos, tracés GPX, informations de difficulté et autres métadonnées.

## Installation et utilisation

### Prérequis
- Node.js (v21 ou supérieur)
- MariaDB

### Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/hikings.git
   cd hikings
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez la base de données dans le fichier `.env` :
   ```env
   DB_HOST=localhost
   DB_USER=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=hikings

   MAIL_HOST=""
   MAIL_PORT=""
   MAIL_USER=""
   MAIL_PASSWORD=""
   ```

4. Lancez le projet :
   ```bash
   npm start
   ```

5. Accédez à l'application dans votre navigateur :
   [http://localhost:3000](http://localhost:3000)

## Contributions

Les contributions sont les bienvenues ! Que vous souhaitiez signaler un bug, proposer une fonctionnalité , n'hésitez pas à ouvrir une issue ou une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus d'informations.

---

Profitez des panoramas spectaculaires et inspirez-vous pour vos prochaines aventures ! 🌄
