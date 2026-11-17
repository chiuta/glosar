# Registo de alterações

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · **Português** · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Não lançado]

## [0.2.0] - 2026-11-17

### Adicionado
- O motor em `src/engine.mjs`: pesquisa sem ter em conta os diacríticos com ordenação, validação das entradas, duplicados, cobertura da lista básica, exportação para TSV e Anki, ficheiro de contribuição e analisador de listas coladas.
- Exportação TSV para folhas de cálculo: uma célula que começa por `=`, `+`, `-` ou `@` recebe um apóstrofo à frente, para que o Excel ou o LibreOffice não a executem como fórmula (uma palavra que realmente começa por `-` mostra, por isso, o apóstrofo); o ficheiro Anki escapa o HTML.
- A interface em `src/ui.js`, `src/i18n.mjs` e `src/app.css`: pesquisa, cobertura, adição (com gravação ou carregamento), exportação e guia; oito línguas, temas escuro e claro, teclado, funciona desde 360 px de largura; o que acrescenta fica no navegador.
- Dados: o índice de línguas `data/languages.json` (arromeno, megleno-romeno, istro-romeno, romani, com dialetos ISO 639-3 e sistemas ortográficos), a lista dos 50 conceitos básicos `data/concepts.json` e 43 entradas iniciais, cada uma com fonte (Wikipédia, Wikcionário, dicionário Angloromani); um campo de licença para cada fonte.
- `scripts/validate.py`: verifica cada ficheiro com o seu esquema e com as regras que um esquema não consegue exprimir (nome do ficheiro, referências, `sourced` e `reviewed`, duplicados, áudio Opus de no máximo 50 KB); `scripts/import_bundle.py` transforma um ficheiro de contribuição em ficheiros de dados sem sobrescrever nada.
- `docs/contributor-guide.md` e `docs/recording-guide.md` (também em romeno): como acrescentar palavras e gravações sem programar.
- Testes: `npm test` (o motor, os dados, os scripts Python, a compilação e os textos da interface) e testes de navegador no hub (oito línguas, acessibilidade, estado guardado hostil, importação e exportação, ecrãs pequenos).
- `src/` e `scripts/build.mjs`: o único `index.html` é agora construído a partir das fontes, com os dados e as gravações incorporados, e `--check` verifica-o.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT traduzidos para as oito línguas.
- README em inglês, romeno, francês, italiano, espanhol, português, alemão e húngaro: secções de estado e de âmbito previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalável (PWA): `manifest.webmanifest`, `sw.js` e os ícones são gerados pelo kit comum (`fff-kit/pwa`); a página funciona offline após a primeira visita por HTTPS.

### Alterado
- O workflow corre em Ubuntu 26.04 com Node.js 26 e executa também os testes, a verificação da compilação e a validação dos dados.
- `schema.json` rejeita os campos desconhecidos; `lang` é um código ISO 639-3 simples (os dialetos vão em `dialect`) e `numeral` é uma nova classe gramatical.
- O README já não enumera um âmbito previsto: descreve o que a página faz e o que ainda não faz.

## [0.1.0] - 2026-11-13

### Adicionado
- Esqueleto inicial: estrutura, esquema de dados ou primeiros exemplos, guias de contribuição em oito línguas.
