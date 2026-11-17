# Bonnes premières tâches

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · **Français** · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Faire relire par des locuteurs de l’aroumain les 11 entrées de départ (`rup-*`), les corriger et mettre `status: reviewed` avec `reviewed_by`
- [ ] Faire relire de la même façon par des locuteurs du mégléno-roumain les 10 entrées de départ (`ruq-*`)
- [ ] Faire relire par des locuteurs du romani les 22 entrées de départ (`rom-*`) et ajouter le `dialect` de chaque forme (les sources ne le donnent pas)
- [ ] Ajouter les premières entrées en istro-roumain (`ruo`) à partir d’une source publiée, avec son adresse web (jamais de mémoire)
- [ ] Ajouter une autre langue minoritaire ou en danger à `data/languages.json` (code ISO 639-3, dialectes, systèmes d’écriture) avec une première liste de mots tirée d’une source citée
- [ ] Étendre la liste de base à 100 concepts dans `data/concepts.json` et ajouter les noms des concepts en français, italien, espagnol, portugais, allemand et hongrois (ils n’existent qu’en anglais et en roumain)
- [ ] Enregistrer les dix nombres de chaque langue avec l’application (Opus, moins de 50 Ko) et envoyer le fichier de contribution (locuteurs uniquement)
- [ ] Faire relire par des locuteurs natifs les textes de l’interface dans `src/i18n.mjs` (français, italien, espagnol, portugais, allemand, hongrois) ; ils ont été rédigés avec un assistant d’IA
- [ ] Ajouter un filtre de dialecte et un filtre de système d’écriture à l’onglet de recherche, avec des tests
- [ ] Faire fonctionner l’enregistrement dans Safari : enregistrer en WAV dans la page et l’encoder en Opus en JavaScript (sans réseau, 50 Ko au plus), ou documenter une commande `ffmpeg` dans `docs/recording-guide.md`

Créez-les toutes sur GitHub avec `scripts/create_issues.sh` (nécessite la CLI `gh`).
