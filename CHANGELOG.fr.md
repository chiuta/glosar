# Journal des modifications

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · **Français** · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non publié]

## [0.2.1] - 2026-11-20

### Modifié
- fff-kit 1.8.1 : lorsque le navigateur bloque le stockage ou en est dépourvu (`localStorage`/`sessionStorage` lèvent une erreur ou sont absents), la page démarre avec un stockage temporaire en mémoire au lieu de s’arrêter ; les données ne sont pas conservées après la fermeture de la page.
- fff-kit 1.8.1 : le dispositif qui agrandit les petits contrôles à 44 px mesure désormais aussi la largeur du corps de la page et de l’élément parent ; une rangée de boutons ne peut donc plus sortir de l’écran (le groupe reste inchangé lorsque l’agrandissement le ferait déborder).

## [0.2.0] - 2026-11-17

### Ajouté
- Le moteur dans `src/engine.mjs` : recherche sans tenir compte des diacritiques avec classement, validation des entrées, doublons, couverture de la liste de base, export TSV et Anki, fichier de contribution et analyseur des listes collées.
- Export TSV pour tableurs : une cellule qui commence par `=`, `+`, `-` ou `@` reçoit une apostrophe devant, pour qu’Excel ou LibreOffice ne l’exécute pas comme une formule (un mot qui commence vraiment par `-` montre donc l’apostrophe) ; le fichier Anki échappe le HTML.
- L’interface dans `src/ui.js`, `src/i18n.mjs` et `src/app.css` : recherche, couverture, ajout (avec enregistrement ou téléversement), export et guide ; huit langues, thèmes sombre et clair, clavier, utilisable dès 360 px de large ; ce que vous ajoutez reste dans le navigateur.
- Données : l’index des langues `data/languages.json` (aroumain, mégléno-roumain, istro-roumain, romani, avec dialectes ISO 639-3 et systèmes d’écriture), la liste des 50 concepts de base `data/concepts.json` et 43 entrées de départ, chacune avec une source (Wikipédia, Wiktionnaire, dictionnaire Angloromani) ; un champ de licence pour chaque source.
- `scripts/validate.py` : vérifie chaque fichier par rapport à son schéma et aux règles qu’un schéma ne peut pas exprimer (nom du fichier, renvois, `sourced` et `reviewed`, doublons, audio Opus de 50 Ko au plus) ; `scripts/import_bundle.py` transforme un fichier de contribution en fichiers de données sans rien écraser.
- `docs/contributor-guide.md` et `docs/recording-guide.md` (aussi en roumain) : comment ajouter des mots et des enregistrements sans programmer.
- Tests : `npm test` (le moteur, les données, les scripts Python, la construction et les textes de l’interface) et tests de navigateur dans le hub (huit langues, accessibilité, état enregistré hostile, import et export, petits écrans).
- `src/` et `scripts/build.mjs` : l’unique `index.html` est désormais construit à partir des sources, données et enregistrements intégrés, et `--check` le vérifie.
- ISSUES_GOOD_FIRST et CODE_OF_CONDUCT traduits dans les huit langues.
- README en anglais, roumain, français, italien, espagnol, portugais, allemand et hongrois : sections d’état et de périmètre prévu (dérivées de `ISSUES_GOOD_FIRST.md`).
- Installable (PWA) : `manifest.webmanifest`, `sw.js` et les icônes sont générés par le kit commun (`fff-kit/pwa`) ; la page fonctionne hors ligne après la première visite en HTTPS.

### Modifié
- Le workflow s’exécute sur Ubuntu 26.04 avec Node.js 26 et lance aussi les tests, la vérification de la construction et la validation des données.
- `schema.json` rejette les champs inconnus ; `lang` est un simple code ISO 639-3 (les dialectes vont dans `dialect`) et `numeral` est une nouvelle catégorie grammaticale.
- Le README ne liste plus un périmètre prévu : il décrit ce que fait la page et ce qu’elle ne fait pas encore.

## [0.1.0] - 2026-11-13

### Ajouté
- Squelette initial : structure, schéma de données ou premiers exemples, guides de contribution en huit langues.
