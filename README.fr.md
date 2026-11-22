# GLOSAR

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.2.1 · Dernière mise à jour : 2026-11-22

🌐 https://glosar.chiuta.ro

> Dictionnaires hors ligne pour les langues minoritaires et menacées, créés par leurs locuteurs.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha, utilisable : l’unique `index.html` est un dictionnaire hors ligne pour l’aroumain, le mégléno-roumain et le romani (l’istro-roumain est déclaré mais n’a pas encore d’entrées). Il cherche sans tenir compte des diacritiques, montre lesquels des 50 mots de base manquent, permet d’ajouter des mots avec une source et un enregistrement, exporte en TSV et pour Anki, et produit un fichier de contribution que `scripts/import_bundle.py` transforme en fichiers de données. Les 43 entrées de départ proviennent de pages publiques citées et n’ont pas été relues par des locuteurs.

## Ce que fait l’application

- Recherche par mot, variante ou sens (dans l’une des huit langues de l’interface), sans tenir compte des diacritiques : taper `tinti` trouve `ținți`. Filtres par langue, fiabilité (brouillon, sourcé, relu) et enregistrements ; chaque résultat montre la catégorie grammaticale, le dialecte, le système d’écriture, la source et la licence, et lit l’enregistrement.
- Couverture : un tableau de 50 concepts de base (nombres, famille, corps, nature, qualités) montre pour chaque langue quels mots existent et lesquels manquent ; un clic sur une case vide ouvre le formulaire d’ajout avec le concept déjà rempli.
- Ajout : un formulaire qui vérifie chaque champ, signale les doublons, ajoute plusieurs mots à partir d’une liste collée, et enregistre ou téléverse une prononciation (Opus dans Ogg ou WebM, 50 Ko au plus) ; ce que vous ajoutez reste dans le navigateur jusqu’au téléchargement.
- Export : tout ou seulement vos propres entrées en TSV (s’ouvre dans un tableur) ou en fichier Anki (langue, fiabilité et concept comme étiquettes), plus un fichier de contribution, enregistrements inclus, que vous pouvez envoyer au projet.
- Données : un fichier JSON par entrée dans `data/dictionaries/`, l’index des langues `data/languages.json` (codes ISO 639-3, dialectes, systèmes d’écriture) et la liste `data/concepts.json` ; interface en huit langues, thèmes sombre et clair, clavier, utilisable dès 360 px de large ; sans réseau, sans suivi.
- Installable comme une application et disponible hors ligne après la première visite lorsqu’elle est servie en HTTPS (un service worker conserve la page ; rien d’autre n’est stocké ni envoyé). Ouverte depuis un fichier téléchargé, elle fonctionne de la même manière, sans installation.

## Comment ça marche

- `schema.json`, `languages.schema.json` et `concepts.schema.json` décrivent les données ; `scripts/validate.py` vérifie chaque fichier par rapport à eux et aux règles qu’un schéma ne peut pas exprimer : le nom du fichier, les renvois aux langues, dialectes, systèmes d’écriture et concepts, une adresse web pour `sourced` et un relecteur pour `reviewed`, les doublons et les fichiers audio (Opus dans Ogg ou WebM, 50 Ko au plus).
- `src/engine.mjs` est le moteur (sans écran, sans réseau) : la règle de normalisation utilisée pour la recherche et les noms de fichiers, la validation, le classement des résultats, les doublons, la couverture, l’export TSV et Anki, le fichier de contribution et l’analyseur des listes collées. `scripts/validate.py` et `scripts/import_bundle.py` appliquent la même règle ; les tests les comparent.
- `src/ui.js`, `src/i18n.mjs` et `src/app.css` forment l’interface ; `node scripts/build.mjs` construit l’unique `index.html` avec les données et les enregistrements de `audio/` intégrés (`--check` vérifie qu’il correspond).
- `npm test` lance les tests du moteur, des données, des scripts Python, de la construction et des textes de l’interface ; les tests de navigateur sont dans le hub. Le développement demande Node.js 24 ou plus récent et Python 3 avec `jsonschema` ; la page elle-même n’exige qu’un navigateur qui connaît ES2017.
- `manifest.webmanifest`, `sw.js` et les icônes sont produits par `node scripts/build.mjs` via le kit commun (section `pwa` de `src/app.json`) ; `--check` les vérifie aussi, et `npm test` contrôle que le manifeste, la version du service worker et la CSP correspondent à la page.

## Limites et ce que l’outil ne fait pas

- Les listes fournies sont un matériau de départ : des numéraux et quelques mots, chacun relié à une source publiée (Wikipédia, Wiktionnaire, le dictionnaire angloromani de kratylos.org) et marqué « avec source ». Aucun locuteur ne les a encore relus.
- L’aroumain, le mégléno-roumain et le romani n’ont chacun que quelques mots, l’istro-roumain aucun pour l’instant. La liste de base de 50 concepts est loin d’être couverte (voir l’onglet « Couverture »).
- Les systèmes d’écriture diffèrent selon les sources et les locuteurs : les entrées notent le système utilisé et donnent les autres graphies comme variantes. La recherche ignore les diacritiques (« tinti » trouve « ținți ») mais ne sait pas que deux graphies sont le même mot si une variante ne le dit pas.
- L’enregistrement exige un navigateur qui enregistre en Opus (Chrome, Edge, Firefox). Safari enregistre dans un autre format : utilisez alors un fichier Opus. Les enregistrements sont limités à 50 Ko.
- Ce que vous ajoutez n’est conservé que dans ce navigateur (localStorage, environ 5 Mo). Téléchargez régulièrement vos contributions ; effacer les données du navigateur les supprime.
- Les traductions de l’interface ont été faites avec un assistant d’IA et attendent la relecture de locuteurs natifs ; les noms des concepts n’existent qu’en anglais et en roumain.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/dictionaries/example.json` dans `data/dictionaries/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.
5. Sans programmer : ajoutez des mots dans la page (onglet « Ajout »), téléchargez votre fichier de contribution et envoyez-le dans une issue ou une pull request ; un mainteneur l’importe avec `python scripts/import_bundle.py` (voir `docs/contributor-guide.md`).

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
