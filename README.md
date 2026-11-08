# Crivo · Conferência pré-DUIMP (demonstração)

Sistema que confere o processo de importação digitado no sistema do despachante contra os documentos de instrução (conhecimento de embarque, invoice, packing list e certificado de origem) **antes do registro da DUIMP**, apontando divergências, campos em branco e o que bloqueia o registro.

**Abrir a demonstração:** https://claude.ai/artifact/DwNqoxzZcLroXMZ7FjNnbj

> Esta é a **versão de demonstração**, com empresas, CNPJs, documentos e valores **fictícios**. A versão em uso no escritório fica em repositório privado.

## O que a demonstração mostra

- **Painel** com processos em conferência, críticos em aberto, erros mais frequentes e números por analista e por cliente.
- **Três processos fictícios**: um bloqueado (6 críticos), um com pontos de atenção e um liberado para registro.
- **35 regras de conferência** rodando de verdade: peso bruto, procedência, valor da fatura, NCM e valor por item, preferência tarifária sem prova de origem, ICMS da UF, frete do BL × invoice, entre outras.
- **Marcações sobre o PDF** do processo e **PDF anotado** com página de resumo para download.
- **Tratamento dos apontamentos**: corrigir, justificar, desfazer, filtros, clique no item para ir ao apontamento e atalhos de teclado.
- **Consultas de ICMS** na importação por UF e por NCM para SP.
- **Guia do Crivo**: manual do usuário embutido, com busca.

Em **Nova conferência**, o botão de exemplo gera o PDF de um processo no navegador, lê esse PDF com o mesmo leitor usado na versão real e aplica as regras. Na versão do escritório, os documentos de instrução são lidos com o Claude; aqui esses dados são simulados.

## Tecnologia

- Página única em HTML, CSS e JavaScript, sem framework.
- **pdf.js** para ler os PDFs e mostrar as marcações; **pdf-lib** para gerar o PDF anotado e o PDF de exemplo.
- Publicado como artefato no **Claude**; a versão do escritório usa a base de dados, a identificação de usuários e a leitura por IA do Claude.

| Arquivo | Conteúdo |
|---|---|
| `src/pdfread.js` | Leitura de PDF e parsers da conferência do processo |
| `src/engine.js` | Motor de regras e normalização de países, moedas e incoterms |
| `src/app.js` | Interface, fluxo de conferência e PDF anotado |
| `src/demo.js` | Processos fictícios e gerador do PDF de exemplo |
| `src/guia.js` | Guia do usuário |
| `index.html` | Demonstração pronta para abrir no navegador |

## Rodar

Abra `index.html` no navegador (precisa de internet para carregar pdf.js, pdf-lib e as fontes). Para gerar de novo a partir do código: `python3 build.py`.

## Autor

**Jefferson Lino**, analista de importação · sistemas assinados JL
