# Como contribuir — GLOSAR

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · **Português** · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versão: 0.2.0 · Última atualização: 2026-11-17

1. Faça um fork deste repositório.
2. Copie `data/dictionaries/example.json` para `data/dictionaries/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.

## Regras

- Uma entrada = um ficheiro.
- Cite sempre uma fonte.
- Contribua apenas com material que possa partilhar legalmente (sem texto protegido copiado).
- Seja gentil: veja o Código de Conduta.

## Acrescentar palavras e gravações

1. Abra a página (`index.html` ou https://glosar.chiuta.ro) e vá ao separador «Adicionar»: escolha a língua, escreva a palavra e o seu significado em pelo menos uma língua, escolha a classe gramatical e acrescente o dialeto e o sistema ortográfico, se os conhecer.
2. Indique sempre a fonte: um livro ou uma página web (com o seu endereço), ou o falante de quem ouviu a palavra. Marque uma entrada como `sourced` só se a copiou de uma fonte publicada, e como `reviewed` só se outro falante, que não você, a confirmou e deu o seu nome.
3. Escreva só o que sabe ou pode citar; nunca preencha uma lacuna de memória numa língua que não fala. Não reproduza um dicionário protegido (palavras soltas com a sua fonte estão bem; listas longas e definições não) e grave apenas pessoas que concordaram.
4. Opcionalmente, grave a palavra (veja `docs/recording-guide.md`): Opus em Ogg ou WebM, no máximo 50 KB.
5. Prima «Descarregar tudo» e envie `glosar-contribution.json` numa issue ou num pull request; um responsável executa `python scripts/import_bundle.py glosar-contribution.json` e depois `python scripts/validate.py`.
6. Se preferir ficheiros, copie `data/dictionaries/example.json` para `data/dictionaries/<lang>-<headword>.json` (a palavra sem diacríticos: `ruq-tinti.json`; uma segunda entrada com a mesma palavra recebe `-2`), edite-o e execute `python scripts/validate.py`.
7. Os falantes ajudam mais revendo as entradas iniciais e gravando os numerais: abra uma issue com o id da entrada (`rup-tsintsi`) e a sua correção. Detalhes em `docs/contributor-guide.md`.
