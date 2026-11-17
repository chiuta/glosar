# Boas primeiras tarefas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · **Português** · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Pedir a falantes de arromeno que revejam as 11 entradas iniciais (`rup-*`), as corrijam e ponham `status: reviewed` com `reviewed_by`
- [ ] Pedir do mesmo modo a falantes de megleno-romeno que revejam as 10 entradas iniciais (`ruq-*`)
- [ ] Pedir a falantes de romani que revejam as 22 entradas iniciais (`rom-*`) e acrescentem o `dialect` de cada forma (as fontes não o indicam)
- [ ] Acrescentar as primeiras entradas em istro-romeno (`ruo`) a partir de uma fonte publicada, com o seu endereço web (nunca de memória)
- [ ] Acrescentar a `data/languages.json` outra língua minoritária ou em risco (código ISO 639-3, dialetos, sistemas ortográficos) com uma primeira lista de palavras de uma fonte citada
- [ ] Alargar a lista básica para 100 conceitos em `data/concepts.json` e acrescentar os nomes dos conceitos em francês, italiano, espanhol, português, alemão e húngaro (só existem em inglês e romeno)
- [ ] Gravar com a aplicação os dez numerais de cada língua (Opus, abaixo de 50 KB) e enviar o ficheiro de contribuição (só falantes)
- [ ] Pedir a falantes nativos que revejam os textos da interface em `src/i18n.mjs` (francês, italiano, espanhol, português, alemão, húngaro); foram escritos com um assistente de IA
- [ ] Acrescentar ao separador de pesquisa um filtro de dialeto e outro de sistema ortográfico, com testes
- [ ] Fazer a gravação funcionar no Safari: gravar WAV na página e codificá-lo em Opus em JavaScript (sem rede, no máximo 50 KB), ou documentar um comando `ffmpeg` em `docs/recording-guide.md`

Cria-as todas no GitHub com `scripts/create_issues.sh` (requer a CLI `gh`).
