# GLOSAR

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.1.0 · Dernière mise à jour : 2026-11-14

🌐 https://glosar.chiuta.ro

> Dictionnaires hors ligne pour les langues minoritaires et menacées, créés par leurs locuteurs.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha : le dépôt contient la structure, le schéma de données ou les premiers exemples et les guides de contribution. Le périmètre ci-dessous est le plan, pas ce qui fonctionne aujourd’hui.

## Périmètre prévu

- Un index des langues (`languages.json`) fondé sur les codes ISO 639-3, et un schéma de données avec les champs facultatifs `dialect` et `orthography`.
- Des listes de départ d’environ 50 mots de base (nombres, famille, corps) pour l’aroumain (rup), le mégléno-roumain (ruq) et le romani (rom).
- Une page de recherche hors ligne, insensible aux diacritiques.
- Des enregistrements audio (Opus, moins de 50 Ko par mot) avec un guide d’enregistrement, et un export vers Anki/TSV pour les apprenants.
- Un vérificateur qui signale les entrées en double, et un guide pour les locuteurs sans formation technique.

Rien de tout cela n’est encore implémenté : chaque point est une tâche prête dans `ISSUES_GOOD_FIRST.md`.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/dictionaries/example.json` dans `data/dictionaries/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
