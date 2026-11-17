# Contribuer — GLOSAR

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · **Français** · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version : 0.2.0 · Dernière mise à jour : 2026-11-17

1. Forkez ce dépôt.
2. Copiez `data/dictionaries/example.json` dans `data/dictionaries/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.

## Règles

- Une entrée = un fichier.
- Citez toujours une source.
- Ne contribuez qu'avec du matériel que vous pouvez légalement partager (pas de texte protégé copié).
- Soyez bienveillant : voir le Code de conduite.

## Ajouter des mots et des enregistrements

1. Ouvrez la page (`index.html` ou https://glosar.chiuta.ro) et allez à l’onglet « Ajout » : choisissez la langue, écrivez le mot et son sens dans au moins une langue, choisissez la catégorie grammaticale et ajoutez le dialecte et le système d’écriture si vous les connaissez.
2. Donnez toujours la source : un livre ou une page web (avec son adresse), ou le locuteur dont vous tenez le mot. Marquez une entrée `sourced` seulement si vous l’avez copiée d’une source publiée, et `reviewed` seulement si un autre locuteur que vous l’a confirmée et a donné son nom.
3. N’écrivez que ce que vous savez ou pouvez citer ; ne comblez jamais un vide de mémoire pour une langue que vous ne parlez pas. Ne reproduisez pas un dictionnaire protégé (des mots isolés avec leur source, c’est permis ; de longues listes et des définitions, non) et n’enregistrez que des personnes consentantes.
4. Facultatif : enregistrez le mot (voir `docs/recording-guide.md`) : Opus dans Ogg ou WebM, 50 Ko au plus.
5. Appuyez sur « Tout télécharger » et envoyez `glosar-contribution.json` dans une issue ou une pull request ; un mainteneur lance `python scripts/import_bundle.py glosar-contribution.json`, puis `python scripts/validate.py`.
6. Si vous préférez les fichiers, copiez `data/dictionaries/example.json` vers `data/dictionaries/<lang>-<headword>.json` (le mot sans diacritiques : `ruq-tinti.json` ; une deuxième entrée avec le même mot reçoit `-2`), modifiez-le et lancez `python scripts/validate.py`.
7. Les locuteurs aident le plus en relisant les entrées de départ et en enregistrant les nombres : ouvrez une issue avec l’identifiant de l’entrée (`rup-tsintsi`) et votre correction. Détails dans `docs/contributor-guide.md`.
