// ===== Guia do Crivo (manual do usuário) =====
const kb=k=>`<span class="kbd">${k}</span>`;
const passo=(n,t,d)=>`<li><b>${t}</b><span>${d}</span></li>`;
const GUIA=[
 {id:"inicio",t:"Primeiros passos",r:"Para todos",h:`
  <p>O <b>Crivo</b> confere o processo digitado no Sigraweb contra os documentos de instrução (BL, invoice, packing list e certificado de origem) <b>antes do registro da DUIMP</b>. Ele aponta o que está diferente, o que está faltando e o que bloqueia o registro.</p>
  <ol class="passos">
   ${passo(1,"Entre com a sua conta Claude","Não existe senha própria do Crivo. O sistema reconhece quem está usando pela conta Claude, e é assim que fica registrado quem conferiu, corrigiu e liberou cada processo.")}
   ${passo(2,"Autorize a leitura por IA na primeira vez","Na primeira conferência, o Claude pergunta se o Crivo pode usar a IA para ler os documentos. Clique em permitir. Sem isso, o BL, a invoice e o packing não são lidos.")}
   ${passo(3,"Conheça o menu","<b>Painel</b> mostra a situação geral. <b>Conferências</b> lista todos os processos. <b>Nova conferência</b> começa uma conferência. As <b>Consultas</b> trazem o ICMS. A <b>Configuração</b> fica com o administrador.")}
   ${passo(4,"Escolha o tema","O ícone de lua, ao lado do seu nome no canto inferior do menu, alterna entre o tema claro e o escuro. A escolha fica salva no seu navegador.")}
  </ol>
  <div class="dica"><b>Perfis.</b> <i>Operacional</i> faz conferências e trata apontamentos. <i>Diretoria / Sócios</i> acompanha o painel e todos os processos. <i>Administrador</i> também ajusta as regras e os perfis.</div>`},
 {id:"nova",t:"Fazer uma nova conferência",r:"Operacional",h:`
  <ol class="passos">
   ${passo(1,"Gere o PDF no Sigraweb","No processo, clique em <b>Imprimir ▸ Conferência DUIMP</b> e salve como PDF. A <b>Conferência Detalhada</b> também é aceita, e as duas juntas dão o resultado mais completo: a Detalhada traz o rateio de FOB e frete por adição.")}
   ${passo(2,"Junte os documentos de instrução","BL/AWB, invoice, packing list e, se houver acordo, o certificado de origem. Use os PDFs originais do exportador sempre que possível.")}
   ${passo(3,"Arraste tudo de uma vez","Em <b>Nova conferência</b>, arraste os PDFs para a área tracejada ou clique nela para escolher. O Crivo reconhece cada documento sozinho e marca na lista o que já chegou.")}
   ${passo(4,"Confira o tipo de cada arquivo","Ao lado de cada arquivo aparece o tipo identificado. Se algum vier como “Não identificado” ou errado, corrija na caixa de seleção.")}
   ${passo(5,"Confira a referência","A referência (ex.: MI-26/0001) é preenchida com o que está no PDF do Sigraweb. Ajuste se precisar.")}
   ${passo(6,"Clique em Conferir processo","O lado direito mostra cada etapa: leitura do Sigraweb, leitura de cada documento pela IA, cruzamento das regras e revisão das descrições. Costuma levar de 30 segundos a 2 minutos.")}
  </ol>
  <div class="dica"><b>Mínimo para conferir:</b> o PDF do Sigraweb e pelo menos um documento de instrução. Quanto mais documentos, mais cruzamentos o Crivo faz.</div>
  <div class="dica warn"><b>PDF escaneado</b> (foto ou digitalização) também funciona: a IA lê as páginas como imagem. A precisão é menor, então confira com mais atenção os apontamentos desse documento.</div>`},
 {id:"resultado",t:"Entender o resultado",r:"Para todos",h:`
  <p>Depois da conferência, o processo abre com o placar no topo e a lista de apontamentos.</p>
  <table class="gtab"><tbody>
   <tr><td><span class="pill crit">Crítico</span></td><td>Bloqueia o registro. Ex.: peso diferente ou em branco, procedência errada, BL draft, preferência tarifária sem prova de origem, descrição contraditória.</td></tr>
   <tr><td><span class="pill warn">Atenção</span></td><td>Precisa de análise, mas não bloqueia sozinho. Ex.: frete do BL diferente da invoice, fabricante desconhecido, arredondamento do rateio.</td></tr>
   <tr><td><span class="pill info">Informativo</span></td><td>Lembrete. Ex.: seguro zerado em CFR, NCM em norma de ICMS/SP.</td></tr>
   <tr><td><span class="ia">IA · confirme</span></td><td>Sugestão da revisão por IA, que compara as descrições. Sempre confirme antes de agir.</td></tr>
  </tbody></table>
  <ul class="lista">
   <li><b>Barra "Conferência tratada"</b>: quanto dos apontamentos já foi corrigido ou justificado.</li>
   <li><b>Blocos do topo</b>: clicar em <i>Críticos</i> ou <i>Atenção</i> filtra a lista. Clicar em <i>Itens</i> abre a tabela de itens.</li>
   <li><b>Etiquetas dos documentos</b>: verde quando o documento confere, vermelha quando há crítico ligado a ele, cinza quando não foi enviado.</li>
   <li><b>Cada apontamento</b> mostra o valor de cada documento lado a lado. A caixa em vermelho é a que diverge e a amarela é a que está em branco.</li>
   <li><b>Verificações aprovadas</b>: o que o Crivo conferiu e estava certo.</li>
  </ul>`},
 {id:"tratar",t:"Tratar os apontamentos",r:"Operacional",h:`
  <ol class="passos">
   ${passo(1,"Abra o apontamento","Clique no título. O primeiro crítico já abre sozinho. Use os filtros <b>Todos / Críticos / Atenção / Informativos</b> e a caixa de grupos para focar.")}
   ${passo(2,"Corrija no Sigraweb","O Crivo não altera o Sigraweb. Faça a correção lá, seguindo a sugestão em roxo quando houver.")}
   ${passo(3,"Marque como corrigido","Volte ao Crivo e clique em <b>Marcar como corrigido</b>. Se clicou errado, use <b>Desfazer</b> no aviso que aparece embaixo.")}
   ${passo(4,"Ou justifique","Quando o ponto não impede o registro (ex.: o fabricante foi confirmado por e-mail), clique em <b>Justificar</b> e escreva o motivo. A justificativa fica gravada com seu nome e a data.")}
   ${passo(5,"Reabra se precisar","Os tratados ficam no fim da lista, em <b>Tratados</b>, com o botão <b>Reabrir</b>.")}
  </ol>
  <div class="dica"><b>Mais rápido pelo teclado:</b> ${kb("J")} e ${kb("K")} passam de um apontamento a outro, ${kb("Enter")} abre ou fecha e ${kb("C")} marca como corrigido.</div>`},
 {id:"pdf",t:"Ver no PDF e PDF anotado",r:"Para todos",h:`
  <ul class="lista">
   <li><b>Ver no PDF</b>: dentro do apontamento, mostra a página do Sigraweb com o campo marcado. Ao passar o mouse sobre uma marcação aparece o apontamento, e o clique abre ele na lista.</li>
   <li><b>Aba Documento</b>: mostra só as páginas que têm marcações, numeradas na mesma ordem da lista.</li>
   <li><b>PDF anotado</b>: baixa a Conferência DUIMP com as marcações e uma página de resumo no início. Serve para mandar ao analista, ao cliente ou para arquivar no processo.</li>
  </ul>
  <div class="dica warn"><b>Importante:</b> por segurança, os PDFs não ficam guardados na base, só os apontamentos. Se você abrir o processo em outro computador ou em outro dia, o Crivo pede para abrir de novo o PDF do Sigraweb antes de mostrar as marcações.</div>`},
 {id:"reconferir",t:"Reconferir depois das correções",r:"Operacional",h:`
  <ol class="passos">
   ${passo(1,"Corrija no Sigraweb","Faça todas as correções que conseguir.")}
   ${passo(2,"Gere o PDF novo","Imprimir ▸ Conferência DUIMP de novo.")}
   ${passo(3,"Clique em Reconferir","No processo, clique em <b>Reconferir</b> e envie o PDF novo. Se chegou documento novo (BL definitivo, certificado de origem), envie junto.")}
  </ol>
  <ul class="lista">
   <li>O que foi <b>justificado</b> continua justificado.</li>
   <li>O que você marcou como <b>corrigido</b> mas continua errado no PDF novo <b>volta a ficar aberto</b>, com um aviso.</li>
   <li>O que sumiu do PDF novo fica como <b>Resolvido</b>.</li>
   <li>Cada reconferência gera uma nova versão e fica registrada no <b>Histórico</b>.</li>
  </ul>`},
 {id:"liberar",t:"Liberar para registro",r:"Operacional",h:`
  <p>O botão <b>Liberar para registro</b> só funciona quando não há nenhum <span class="pill crit">Crítico</span> em aberto, ou seja, todos foram corrigidos ou justificados. Pontos de atenção em aberto não impedem, mas o Crivo avisa antes de liberar.</p>
  <p>Ao liberar, fica gravado quem liberou e quando. Se depois for necessário mudar algo, basta reconferir: o processo volta a ficar em aberto.</p>
  <div class="dica"><b>Copiar resumo</b> copia a lista de pendências em texto, pronta para colar no e-mail ou no WhatsApp.</div>`},
 {id:"itens",t:"Aba Itens",r:"Para todos",h:`
  <p>Mostra cada item da DUIMP com NCM, quantidade, valor, peso e o resultado da conferência contra a invoice e o packing.</p>
  <ul class="lista">
   <li>Ligue <b>Só itens com divergência</b> para ver apenas o que tem problema.</li>
   <li>Use a busca para achar um item, uma NCM ou um código de produto.</li>
   <li>Clique numa linha em vermelho para ir direto ao apontamento daquele item.</li>
  </ul>`},
 {id:"painel",t:"Painel e lista de conferências",r:"Diretoria e operacional",h:`
  <ul class="lista">
   <li><b>Painel</b>: processos em conferência, críticos em aberto, liberados no mês e o percentual de processos com erro crítico pego antes do registro.</li>
   <li>Clique em qualquer número para abrir a lista já filtrada. Em <b>Erros mais frequentes</b>, clique num erro para ver os processos que tiveram aquele problema. Isso ajuda a achar onde treinar a equipe.</li>
   <li><b>Por analista</b> e <b>Por cliente</b> mostram onde os erros se concentram.</li>
   <li><b>Conferências</b>: filtre pela situação (bloqueados, atenção, prontos, liberados), busque por referência, cliente ou exportador, e clique no título de uma coluna para ordenar.</li>
  </ul>
  <div class="dica">Atalho: ${kb("/")} em qualquer tela abre a busca de conferências.</div>`},
 {id:"icms",t:"Consultas de ICMS",r:"Para todos",h:`
  <ul class="lista">
   <li><b>ICMS por UF</b>: alíquota geral, FCP e alíquota efetiva na importação dos 27 estados. A tabela é conferida na FazComex todo dia 1º, e a data da última conferência aparece no topo.</li>
   <li><b>ICMS/SP por NCM</b>: digite a NCM (4 a 8 dígitos) para ver se ela consta na Resolução SF 4/1998 ou na SF 31/2008 (alíquota de 12%) ou no Convênio ICMS 52/91 (carga de 8,80% para máquinas industriais e 5,60% para agrícolas). Cada resultado mostra o item, a descrição, o código da norma e o link oficial, e o botão <b>Copiar resultado</b> leva tudo em texto. Códigos genéricos da norma (ex.: 8427) também valem. Vale só para importadores de SP.</li>
   <li>A faixa no topo conta os dias até o fim da <b>redução do Convênio 52/91</b> (hoje, 31/12/2026) e fica amarela quando faltam 60 dias ou menos.</li>
   <li>Na conferência, o Crivo aceita 12%, 8,80% ou 5,60% de ICMS quando a NCM consta na norma correspondente, e aponta quando a alíquota do processo não tem justificativa.</li>
   <li>Dentro de cada processo, a aba <b>ICMS</b> já mostra a alíquota do estado do importador e as NCMs do processo nas normas de SP.</li>
  </ul>
  <div class="dica warn">A FazComex é uma fonte secundária. Em caso de dúvida, confirme na legislação da SEFAZ do estado. Alagoas e Sergipe estão marcados para conferência.</div>`},
 {id:"regras",t:"O que o Crivo confere",r:"Para todos",h:`<p>Lista das verificações feitas em cada conferência, com o nível atual de cada uma. O administrador pode mudar os níveis em <b>Regras de conferência</b>.</p><div id="guiaRegras"></div>`},
 {id:"admin",t:"Administração: regras, tolerâncias e perfis",r:"Administrador",h:`
  <ul class="lista">
   <li><b>Regras de conferência</b>: mude o nível de cada regra (crítico, atenção ou informativo). A mudança vale para as próximas conferências e reconferências.</li>
   <li><b>Tolerâncias</b>: a diferença de peso aceita (hoje 0 kg, porque peso é crítico) e a diferença de valor aceita (hoje 0,01).</li>
   <li><b>Usuários e perfis</b>: defina quem é Operacional, Diretoria / Sócios ou Administrador. Com o plano Team, a busca lista todas as pessoas da empresa.</li>
  </ul>`},
 {id:"atalhos",t:"Atalhos de teclado",r:"Para todos",h:`
  <table class="gtab"><tbody>
   <tr><td>${kb("/")}</td><td>Abrir a busca de conferências</td></tr>
   <tr><td>${kb("J")} ou ${kb("↓")}</td><td>Próximo apontamento</td></tr>
   <tr><td>${kb("K")} ou ${kb("↑")}</td><td>Apontamento anterior</td></tr>
   <tr><td>${kb("Enter")}</td><td>Abrir ou fechar o apontamento selecionado</td></tr>
   <tr><td>${kb("C")}</td><td>Marcar o apontamento selecionado como corrigido</td></tr>
   <tr><td>${kb("Esc")}</td><td>Fechar a janela aberta</td></tr>
  </tbody></table>`},
 {id:"faq",t:"Dúvidas frequentes",r:"Para todos",h:`
  <details open><summary>Vou consumir créditos de alguém ao conferir?</summary><p>A leitura por IA consome do limite da sua própria conta Claude, não da de quem criou o sistema. O resto (Sigraweb, regras, PDF anotado, painel, ICMS) não usa IA e não consome nada.</p></details>
  <details><summary>A IA leu um valor errado. E agora?</summary><p>Justifique o apontamento explicando o valor correto e avise o administrador, mandando o documento. Assim as regras de leitura podem ser ajustadas.</p></details>
  <details><summary>O Crivo não reconheceu meu arquivo.</summary><p>Escolha o tipo manualmente na caixa ao lado do arquivo. Se for o PDF do Sigraweb, confirme que é a <b>Conferência DUIMP</b> ou a <b>Conferência Detalhada</b>, gerada pelo botão Imprimir.</p></details>
  <details><summary>Abri o processo e não vejo as marcações no PDF.</summary><p>Os PDFs não ficam salvos na base. Na aba Documento, clique em <b>Abrir PDF do Sigraweb</b> e escolha o arquivo do processo.</p></details>
  <details><summary>Não consigo marcar nem liberar nada.</summary><p>Você está em modo leitura: sua conta ainda não tem permissão para alterar. Peça ao administrador para compartilhar o Crivo com você como <b>Contribuidor</b>.</p></details>
  <details><summary>O Crivo substitui a conferência humana?</summary><p>Não. Ele pega as divergências objetivas e os campos em branco, mas a decisão de registrar continua sendo do analista e do despachante. Os apontamentos da IA vêm marcados com <span class="ia">IA · confirme</span>.</p></details>
  <details><summary>Os dados dos clientes ficam seguros?</summary><p>O Crivo fica na conta Claude da empresa e só abre para quem recebeu acesso. Ficam guardados os dados lidos e os apontamentos; os PDFs não ficam salvos.</p></details>`},
 {id:"boas",t:"Boas práticas",r:"Para todos",h:`
  <ul class="lista">
   <li>Confira <b>antes</b> de transmitir, com o processo completo no Sigraweb.</li>
   <li>Envie sempre a <b>Conferência DUIMP</b>. Se puder, mande também a Detalhada.</li>
   <li>Use o BL <b>definitivo</b>. Com draft, o Crivo sempre vai apontar crítico.</li>
   <li>Escreva justificativas que outra pessoa entenda sem perguntar: o quê, quem confirmou e quando.</li>
   <li>Depois de corrigir no Sigraweb, <b>reconfira</b> em vez de só marcar como corrigido. É a reconferência que comprova a correção.</li>
   <li>Baixe o <b>PDF anotado</b> e guarde junto com o processo.</li>
  </ul>`},
];
const AJUDA_DE={painel:"painel",conferencias:"painel",nova:"nova",proc:"tratar","icms-uf":"icms","icms-ncm":"icms",regras:"admin",usuarios:"admin"};
function viewGuia(sec){
  const q=deacc(ST.guiaQ||"");
  const hits=GUIA.filter(g=>!q||deacc(g.t+" "+g.h.replace(/<[^>]+>/g," ")).includes(q));
  return `<div class="wrap guia"><div class="row"><div style="flex:1"><h1>Guia do Crivo</h1><div class="muted">Manual de uso: do primeiro acesso à liberação para registro</div></div><input type="search" id="guiaQ" placeholder="Buscar no guia (ex.: reconferir, PDF, justificar)" value="${esc(ST.guiaQ||"")}" aria-label="Buscar no guia" style="min-width:300px"></div>
  <div class="guia-grid">
   <nav class="guia-idx card" aria-label="Índice do guia"><div class="muted" style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:4px 10px 8px">Conteúdo</div>${GUIA.map((g,k)=>`<a href="#guia-${g.id}" class="${sec===g.id?"on":""} ${hits.includes(g)?"":"fora"}"><span class="n">${String(k+1).padStart(2,"0")}</span>${esc(g.t)}</a>`).join("")}</nav>
   <div class="guia-body">${hits.length?hits.map(g=>`<section class="card gsec" id="g-${g.id}"><header><h2>${esc(g.t)}</h2><span class="pill neutral">${esc(g.r)}</span></header><div class="body">${g.h}</div></section>`).join(""):`<div class="card empty">Nada encontrado para "${esc(ST.guiaQ)}". Tente outra palavra.</div>`}</div>
  </div></div>`;
}
function montarGuia(sec){
  const box=$("#guiaRegras");
  if(box){const n=ST.cfg.regras.niveis||{};const gr={};for(const r of REGRAS){if(r[0]==="ia")continue;(gr[r[1]]=gr[r[1]]||[]).push(r);}
    box.innerHTML=Object.entries(gr).map(([g,rs])=>`<h3 style="margin:14px 0 6px">${esc(g)}</h3><table class="gtab"><tbody>${rs.map(r=>{const c=n[r[0]]||r[3];return `<tr><td>${esc(r[2])}</td><td style="width:130px;text-align:right"><span class="pill ${c}">${NIVEL_LABEL[c]}</span></td></tr>`;}).join("")}</tbody></table>`).join("");}
  if(sec){const el=document.getElementById("g-"+sec);if(el)setTimeout(()=>el.scrollIntoView({behavior:"smooth",block:"start"}),30);}
}
