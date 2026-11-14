# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.1.0 · Última atualização: 2026-11-14

🌐 https://glosar.chiuta.ro

> Dicionários offline para línguas minoritárias e ameaçadas, criados pelos seus falantes.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa: o repositório contém a estrutura, o esquema de dados ou os primeiros exemplos e os guias de contribuição. O âmbito abaixo é o plano, não o que funciona hoje.

## Âmbito previsto

- Um índice de línguas (`languages.json`) baseado nos códigos ISO 639-3 e um esquema de dados com os campos opcionais `dialect` e `orthography`.
- Listas iniciais de cerca de 50 palavras básicas (números, família, corpo) para o arromeno (rup), o meglenoromeno (ruq) e o romani (rom).
- Uma página de pesquisa offline, insensível aos sinais diacríticos.
- Gravações de áudio (Opus, menos de 50 KB por palavra) com um guia de gravação, e exportação para Anki/TSV para quem aprende.
- Um verificador que avisa de entradas duplicadas e um guia para falantes sem formação técnica.

Nada disto está ainda implementado: cada ponto é uma tarefa preparada em `ISSUES_GOOD_FIRST.md`.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/dictionaries/example.json` para `data/dictionaries/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
