# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.2.1 · Última atualização: 2026-11-22

🌐 https://glosar.chiuta.ro

> Dicionários offline para línguas minoritárias e ameaçadas, criados pelos seus falantes.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa, utilizável: o único `index.html` é um dicionário offline para o arromeno, o megleno-romeno e o romani (o istro-romeno está declarado, mas ainda não tem entradas). Pesquisa sem ter em conta os diacríticos, mostra quais das 50 palavras básicas faltam, permite acrescentar palavras com uma fonte e uma gravação, exporta para TSV e Anki e produz um ficheiro de contribuição que o `scripts/import_bundle.py` transforma em ficheiros de dados. As 43 entradas iniciais vêm de páginas públicas citadas e não foram revistas por falantes.

## O que faz

- Pesquisa por palavra, variante ou significado (em qualquer das oito línguas da interface), sem ter em conta os diacríticos: ao escrever `tinti` encontra `ținți`. Filtros por língua, fiabilidade (rascunho, com fonte, revisto) e gravações; cada resultado mostra a classe gramatical, o dialeto, o sistema ortográfico, a fonte e a licença, e reproduz a gravação.
- Cobertura: uma tabela de 50 conceitos básicos (números, família, corpo, natureza, qualidades) mostra, para cada língua, que palavras existem e quais faltam; um clique numa lacuna abre o formulário de adição com o conceito já preenchido.
- Adição: um formulário que verifica cada campo, avisa dos duplicados, acrescenta várias palavras a partir de uma lista colada e grava ou carrega uma pronúncia (Opus em Ogg ou WebM, no máximo 50 KB); o que acrescenta fica no navegador até o descarregar.
- Exportação: tudo ou só as suas entradas em TSV (abre-se numa folha de cálculo) ou como ficheiro Anki (língua, fiabilidade e conceito como etiquetas), mais um ficheiro de contribuição, com as gravações incluídas, que pode enviar ao projeto.
- Dados: um ficheiro JSON por entrada em `data/dictionaries/`, o índice de línguas `data/languages.json` (códigos ISO 639-3, dialetos, sistemas ortográficos) e a lista `data/concepts.json`; interface em oito línguas, temas escuro e claro, teclado, funciona desde 360 px de largura; sem rede, sem rastreamento.
- Instalável como aplicação e disponível offline após a primeira visita quando servida por HTTPS (um service worker guarda a página; nada mais é guardado ou enviado). Aberta a partir de um ficheiro descarregado funciona da mesma forma, sem instalação.

## Como funciona

- `schema.json`, `languages.schema.json` e `concepts.schema.json` descrevem os dados; `scripts/validate.py` verifica cada ficheiro com eles e com as regras que um esquema não consegue exprimir: o nome do ficheiro, as referências a línguas, dialetos, sistemas ortográficos e conceitos, um endereço web para `sourced` e um revisor para `reviewed`, os duplicados e os ficheiros de áudio (Opus em Ogg ou WebM, no máximo 50 KB).
- `src/engine.mjs` é o motor (sem ecrã, sem rede): a regra de normalização usada na pesquisa e nos nomes de ficheiros, a validação, a ordenação dos resultados, os duplicados, a cobertura, a exportação para TSV e Anki, o ficheiro de contribuição e o analisador de listas coladas. `scripts/validate.py` e `scripts/import_bundle.py` aplicam a mesma regra; os testes comparam-nas.
- `src/ui.js`, `src/i18n.mjs` e `src/app.css` são a interface; `node scripts/build.mjs` constrói o único `index.html` com os dados e as gravações de `audio/` incorporados (`--check` verifica que coincide).
- `npm test` executa os testes do motor, dos dados, dos scripts Python, da compilação e dos textos da interface; os testes de navegador estão no hub. O desenvolvimento requer Node.js 24 ou mais recente e Python 3 com `jsonschema`; a página em si só precisa de um navegador que conheça ES2017.
- `manifest.webmanifest`, `sw.js` e os ícones são produzidos por `node scripts/build.mjs` através do kit comum (secção `pwa` de `src/app.json`); `--check` também os verifica, e `npm test` confirma que o manifesto, a versão do service worker e a CSP correspondem à página.

## Limites e o que não faz

- As listas incluídas são material inicial: numerais e algumas palavras, cada uma com a sua fonte publicada (Wikipédia, Wikcionário, o dicionário de angloromani em kratylos.org) e marcada “com fonte”. Nenhum falante as reviu ainda.
- O arrumeno, o megleno-romeno e o romani têm só um punhado de palavras cada, o istro-romeno ainda nenhuma. A lista básica de 50 conceitos está longe de estar coberta (veja o separador “Cobertura”).
- Os sistemas de escrita diferem entre fontes e entre falantes: as entradas anotam o sistema usado e listam as outras grafias como variantes. A pesquisa ignora os diacríticos (“tinti” encontra “ținți”), mas não sabe que duas grafias são a mesma palavra se uma variante não o disser.
- Gravar exige um navegador que grave em Opus (Chrome, Edge, Firefox). O Safari grava noutro formato: use então um ficheiro Opus. As gravações estão limitadas a 50 KB.
- O que adicionar fica guardado apenas neste navegador (localStorage, cerca de 5 MB). Descarregue regularmente as suas contribuições; apagar os dados do navegador apaga-as também.
- As traduções da interface foram feitas com um assistente de IA e aguardam revisão por falantes nativos; os nomes dos conceitos só existem em inglês e em romeno.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/dictionaries/example.json` para `data/dictionaries/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.
5. Sem programar: acrescente palavras na página (separador «Adicionar»), descarregue o seu ficheiro de contribuição e envie-o numa issue ou num pull request; um responsável importa-o com `python scripts/import_bundle.py` (veja `docs/contributor-guide.md`).

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
