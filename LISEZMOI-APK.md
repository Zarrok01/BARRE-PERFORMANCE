# BARRE 4.4 — version APK Android

## Installer
1. Copie `BARRE-4.4.apk` sur le téléphone (câble, Drive, mail à toi-même…).
2. Ouvre le fichier depuis l'application **Mes fichiers** → autorise « Installer des applications inconnues » pour cette appli quand Android le demande.
3. Play Protect peut avertir « appli inconnue » : c'est normal pour un APK non publié sur le Play Store → *Installer quand même*.

## ⚠️ Tes données ne suivent PAS automatiquement
L'APK a son propre stockage, séparé de la PWA installée via Chrome.
1. Dans la PWA actuelle : **Réglages → Exporter JSON**.
2. Dans l'APK : **Réglages → Importer** et choisis ce fichier.
Ensuite, continue d'exporter régulièrement : la sauvegarde automatique Android est désactivée (les données restent sur le téléphone, comme la PWA).

## Différences avec la PWA
- 100 % hors ligne dès l'installation (aucun service worker nécessaire, les fichiers sont dans l'APK).
- Export : Android te demande où enregistrer le fichier (Téléchargements, Drive…).
- Les mots de passe des sauvegardes chiffrées sont masqués à la saisie.
- Écran maintenu allumé pendant une séance (pour que la vibration de fin de repos se déclenche).
- Bouton retour : ferme la fenêtre ouverte → revient à l'Accueil → 2 appuis pour quitter.
- Les liens externes (ameli.fr) s'ouvrent dans le navigateur.

## Mettre à jour l'app plus tard
**Conserve `signature/`** : Android n'accepte une mise à jour que si elle est signée avec la MÊME clé.
Sans elle, il faudrait désinstaller → perte des données locales (sauf export préalable).

1. Depuis la 4.4, l'app est un fichier unique : `source/assets/www/index.html` = ta version « autonome ».
   Réapplique les deux adaptations APK (recherche `BarreAndroid` dans l'index.html actuel) :
   `downloadBackup` → `BarreAndroid.saveFile(...)` et début de `render` → `BarreAndroid.setKeepAwake(...)`.
2. Augmente `android:versionCode` (et `versionName`) dans `source/AndroidManifest.xml`.
3. Sur Linux/WSL : `sudo apt install aapt apksigner zipalign dalvik-exchange android-sdk-platform-23 openjdk-17-jdk`
   puis, dans `source/` avec le keystore copié à côté :
   `KS_PASS='<mot de passe>' ./build.sh`
   Ou demande simplement à Claude de reconstruire à partir de ce dossier.
