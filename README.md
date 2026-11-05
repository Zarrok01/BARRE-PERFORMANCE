# BARRE 4.0 — Performance · Carbone & Cuivre

Une application web mobile de suivi de calisthenics, **sans compte, publicité, backend ni IA**, pour tractions, dips, tractions australiennes et exercices au sol. BARRE 4.0 poursuit le même cycle de 8 semaines (20 séances) que 3.0 ; les anciennes données ne sont pas remplacées à l'installation.

## Nouveautés livrées

### 3.1 — Fiabilité et finition
- Enregistrement à chaque modification de série, avec **vérification de l'écriture principale**, dernier état valide et instantanés locaux de secours. Enregistrement automatiquement annulé si le stockage échoue.
- Tentative de récupération depuis `localStorage` secondaire puis IndexedDB si la clé principale est corrompue ou manquante ; possibilité de restaurer manuellement la copie précédente.
- Les **brouillons de séance** et leurs répétitions restent enregistrés après fermeture/rechargement ; ne pas effacer les données du navigateur.
- Détection d'écriture depuis un autre onglet, plutôt qu'écrasement silencieux de l'historique.
- Export JSON classique et **export JSON chiffré** en AES-256-GCM avec mot de passe (PBKDF2 SHA-256, 210 000 itérations, sel unique, IV unique) ; import des deux formats. Mot de passe jamais conservé. Nécessite WebCrypto (HTTPS ou contexte sécurisé).
- Contrôle médical avant séance, maintien d'une suspension pour symptômes signalés et conservation des séries déjà effectuées si interruption. La déclaration d'un avis médical ne vaut **jamais** diagnostic ou autorisation automatisée.
- Contrôles tactile/clavier plus accessibles, styles `focus-visible`, respect de `prefers-reduced-motion`, gestion élémentaire de focus dans les fenêtres modales.

### 3.2 — Entraînement intelligent
- **Bilan initial** : valeurs connues pour tractions, dips, australiennes, pompes et squats, sans forcer un test maximal en présence de symptômes neurologiques.
- Cibles initiales personnalisées à partir des références enregistrées, puis adaptation selon séries réellement validées, RIR, technique et récupération. Le moteur ne dépasse pas automatiquement une étape de difficulté des mouvements.
- **Variantes des jambes** paramétrables : programme standard (squats, pont bilatéral) ou contrôlé (squats à tempo, pont fessier unilatéral) ; les séances déjà commencées ne sont pas modifiées.
- **Bibliothèque technique illustrée** : 16 mouvements et variantes avec schémas SVG simples, consignes et limites de sécurité. Ces schémas ne remplacent pas une démonstration par un professionnel.
- **Charge sur 7 jours** : total de séries validées comparé aux 7 jours précédents, avec un commentaire descriptif prudent, jamais un feu vert médical.

### 4.0 — Analyse et expérience premium
- Palette Carbone & Cuivre systématisée, zone de saisie plus compacte, action principale de fin de séance facilement accessible.
- **Accueil personnalisable** : afficher/masquer les blocs records, récupération et objectifs sans affecter les contrôles de sécurité.
- **Tendance par exercice et variante** : courbe des meilleures séries consignées (ce cycle / tous cycles), valeurs exactes accessibles sous le graphique et états vides explicites.
- **Comparaison mensuelle** : mois courant vs mois précédent, avec avertissement que les périodes n'ont pas forcément le même nombre de jours écoulés.
- Statistiques, historique, bilans hebdomadaires/mensuels et objectifs de force existants conservés. **Aucune mécanique RPG.**

## Installation recommandée sur Samsung/Android

1. **Export préalable** : depuis BARRE 3.0, ouvre Réglages → Exporter JSON. Conserve le fichier sur le téléphone *et idéalement ailleurs*.
2. Décompresse le fichier `BARRE-v4-Performance-Carbone-Cuivre.zip` sur ton ordinateur.
3. Place **le contenu** du dossier `BARRE-4-performance/` à la racine d'un dépôt GitHub destiné à GitHub Pages (`index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `icons/`).
4. Dans **Settings → Pages**, choisis **Deploy from a branch → main / (root)** et attends l'apparition de l'adresse HTTPS du site.
5. Ouvre l'URL HTTPS dans Chrome sur Android ; menu ⋮ → **Ajouter à l'écran d'accueil / Installer l'application** (libellé variable).
6. Ouvre BARRE, vérifie les données. Si l'adresse/site a changé, utilise **Réglages → Importer** et ton export JSON 3.0. L'avis médical déclaré sera réinitialisé à l'import.
7. Pour vérifier le mode hors ligne, ouvre l'application une fois connecté, puis rouvre-la en mode avion. Cela nécessite un test sur le vrai téléphone, non effectué ici.

Le fichier `BARRE-v4-mobile-autonome.html` permet un essai rapide dans un navigateur qui accepte les fichiers HTML locaux. **Ce fichier n'est pas une PWA installable**, et la persistance du stockage `file://` dépend du navigateur : ne l'utilise pas comme journal principal sans export régulier.

## Données et confidentialité

- Les informations d'entraînement et de santé restent **dans le stockage du navigateur** sur cet appareil ; le site héberge uniquement les ressources statiques.
- Les données locales `localStorage`/IndexedDB **ne sont pas chiffrées au repos** par BARRE. L'export chiffré protège uniquement **le fichier exporté**, si l'utilisateur choisit cette option. L'export JSON classique n'est pas chiffré.
- Les deux stockages locaux peuvent être supprimés avec les données du site ; ni la copie locale ni le mode hors ligne ne constituent une sauvegarde externe. Exporte le journal régulièrement.
- **Perdre le mot de passe d'un export chiffré rend la récupération impossible**. Ne le communique pas et ne le stocke pas dans l'application.
- Les modifications dans deux onglets simultanés sont signalées, mais non fusionnées automatiquement. Recharger l'onglet obsolète avant de continuer.
- Le format du journal conserve `version: 1` afin de lire les sauvegardes BARRE 2.1 et 3.0. La version de l'application est 4.0.

## Sécurité et précautions sportives

L'utilisateur a décrit des douleurs lombaires pouvant irradier jusqu'à la cheville avec des fourmillements intermittents. **Une évaluation médicale est recommandée avant un programme de force intensif**. L'application ne peut pas déterminer si un exercice est sûr pour une personne. Une déclaration d'avis médical favorable et un questionnaire sans symptômes ne sont **pas** une garantie de sécurité.

- Douleurs/fourmillements nouveaux ou présents : ne poursuis pas l'entraînement, demande une évaluation.
- Nouvelle faiblesse du pied/de la jambe : fais-toi examiner en urgence.
- Troubles urinaires/intestinaux nouveaux ou anesthésie du périnée : **urgence 15/112**.
- Une barre doit être conçue et installée pour supporter les efforts dans la direction de traction concernée ; les tractions australiennes nécessitent une installation spécifiquement adaptée au tirage horizontal.

## Développement et tests

Aucune dépendance applicative JS, aucun API réseau. Lancer localement avec Python 3 :

```sh
cd BARRE-4-performance
python -m http.server 8080
```

Tests Node.js 18+ :

```sh
for f in tests/*.cjs; do node "$f"; done
```

Simulation Chromium mobile (Playwright, navigateur Chromium installé) :

```sh
python tests/mobile-smoke.py
python tests/mobile-v4.py
```

**Vérifié ici :** les six suites Node, navigation/interaction Chrome simulée à 320/360/393/412 px, bilan et filtres, sauvegardes locales, récupération du brouillon, interruptions et chiffrement/déchiffrement. **Non vérifié physiquement :** installation Android Samsung, comportement TalkBack natif, service worker en hébergement HTTPS et notifications en arrière-plan. Les restrictions de ce banc de test empêchent une navigation réelle vers localhost/HTTPS dans Chromium : les scénarios Playwright chargent le DOM directement.

## Limites restantes

- Application toujours monolithique (`app.js`) ; une modularisation serait utile avant une équipe de développement.
- La progression reste une heuristique par exercice, non un coaching médical ou une analyse vidéo de la technique.
- Les statistiques de volume comparent des répétitions/séries au poids du corps, **pas** une charge externe calibrée ou une mesure directe de force maximale.
- Les illustrations sont schématiques, pas des animations anatomiques détaillées.
- Le moteur 8 semaines n'élimine pas les séances à 3 jours si l'utilisateur préfère s'entraîner seulement 2 jours ; la troisième séance peut être reportée sans pression.
- Pas de synchronisation multi-appareils, pas de notifications système fiables en arrière-plan.
