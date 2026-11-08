// ===== Crivo · modo demonstração (dados fictícios) =====
const DEMO_CASOS=[
 { // 1 · bloqueado
  id:"demo-horizonte",ref:"DEMO-26/0418",idInterno:"900418",
  empresa:"HORIZONTE VÁLVULAS E CONEXÕES LTDA",cnpj:"99999999000199",uf:"RJ",cidade:"Duque de Caxias",
  exportador:{nome:"Vandermeer Industrial B.V.",pais:"Países Baixos",cidade:"Rotterdam"},
  fabricante:{nome:"Kessler Armaturen GmbH",pais:"Alemanha"},
  incoterm:"FOB",local:"HAMBURG",moeda:"EUR",moedaSigra:"978 EURO",fatura:"VMI-26-04187",romaneio:"PL-04187",bl:"DEMOHAM2610482",
  embarque:"28/10/2026",porto:"Hamburg",paisEmbarque:"Alemanha",procSigra:"023 Alemanha",
  pesoBrutoDoc:2684,pesoBrutoSigra:2648,volumes:12,embSigra:"Pallet de madeira 12 2.684,000 Não Sim Tratada e certificada",
  icmsSigra:18,fund:{cod:"0022",desc:"APC Mercosul-União Europeia"},prova:null,
  itens:[
   ["Válvula esfera inox 316 2 pol. PN40","VE-316-2","84818099",120,"UN",86.5,312],
   ["Válvula esfera inox 316 3 pol. PN40","VE-316-3","84818099",80,"UN",142,384],
   ["Válvula de retenção inox 2 pol.","VR-316-2","84813000",60,"UN",64.2,168],
   ["Válvula de retenção inox 4 pol.","VR-316-4","84813000",40,"UN",158,236,{valor:6230}],
   ["Flange inox 316 DN50","FL-316-50","73072100",300,"UN",12.4,540],
   ["Flange inox 316 DN80","FL-316-80","73072100",200,"UN",19.8,610,{ncm:"73072900"}],
  ],
  procOverride:{procSigra:"160 Países Baixos"}
 },
 { // 2 · atenção
  id:"demo-bomretiro",ref:"DEMO-26/0421",idInterno:"900421",
  empresa:"TÊXTIL BOM RETIRO COMÉRCIO LTDA",cnpj:"88888888000188",uf:"SP",cidade:"São Paulo",
  exportador:{nome:"Huali Textile Trading Co., Ltd.",pais:"China",cidade:"Ningbo"},
  fabricante:null,
  incoterm:"CFR",local:"SANTOS",moeda:"USD",moedaSigra:"220 DOLAR DOS EUA",fatura:"HL2610-77",romaneio:"HL2610-77PL",bl:"DEMONGB5531907",
  embarque:"21/10/2026",porto:"Ningbo",paisEmbarque:"China",procSigra:"160 China",
  pesoBrutoDoc:6840,pesoBrutoSigra:6840,volumes:228,embSigra:"Rolo 228 6.840,000 Não Não",
  icmsSigra:18,fund:{cod:"0001",desc:"Recolhimento integral"},prova:null,
  frete:3100,freteBL:2950,
  itens:[
   ["Tecido 100% poliéster tinto, 150 cm","TX-PL-150","54076100",9200,"M",2.35,2760],
   ["Tecido poliéster/elastano estampado, 145 cm","TX-PE-145","54076100",6800,"M",3.1,2040],
   ["Tecido poliamida para forro, 150 cm","TX-PA-150","54074200",7400,"M",1.95,1480],
  ]
 },
 { // 3 · liberado
  id:"demo-farmabio",ref:"DEMO-26/0409",idInterno:"900409",
  empresa:"FARMABIO INSUMOS INDUSTRIAIS LTDA",cnpj:"77777777000177",uf:"SP",cidade:"Campinas",
  exportador:{nome:"Lombardi Chimica S.p.A.",pais:"Itália",cidade:"Milano"},
  fabricante:{nome:"Lombardi Chimica S.p.A.",pais:"Itália"},
  incoterm:"CIF",local:"SANTOS",moeda:"EUR",moedaSigra:"978 EURO",fatura:"LC-2026-1192",romaneio:"LC-2026-1192-P",bl:"DEMOGOA2609914",
  embarque:"14/10/2026",porto:"Genova",paisEmbarque:"Itália",procSigra:"386 Itália",
  pesoBrutoDoc:4380,pesoBrutoSigra:4380,volumes:16,embSigra:"Pallet de madeira 16 4.380,000 Não Sim Tratada e certificada",
  icmsSigra:18,fund:{cod:"0022",desc:"APC Mercosul-União Europeia"},prova:"Declaração de origem na fatura (exportador registrado REX IT-DEMO-0001)",
  frete:2100,seguro:180,
  itens:[
   ["Excipiente celulose microcristalina, sacos 25 kg","EX-MCC-25","39129000",2000,"KG",6.4,2000],
   ["Estearato de magnésio grau farmacêutico","EX-MGS-20","29159039",800,"KG",11.2,800],
   ["Amido pré-gelatinizado","EX-AMP-25","35051000",1200,"KG",4.85,1200],
  ],
  liberado:true
 }
];
const r2=n=>Math.round(n*100)/100;
function demoDocs(c){
  const it=c.itens.map(([d,cod,ncm,q,un,pu,pl],k)=>({seq:k+1,descricao:d,codigo:cod,ncm:ncm.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1.$2.$3"),cn_code:null,quantidade:q,unidade:un,preco_unitario:pu,valor:r2(q*pu),peso_liquido_kg:pl,peso_bruto_kg:null,volumes:null,dimensoes_mm:[],pais_origem:c.fabricante?.pais||c.exportador.pais}));
  const tot=r2(it.reduce((a,i)=>a+i.valor,0)), pl=it.reduce((a,i)=>a+i.peso_liquido_kg,0);
  const fob=["CFR","CIF"].includes(c.incoterm)?r2(tot-(c.frete||0)-(c.seguro||0)):tot;
  const imp={nome:c.empresa,cnpj:c.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,"$1.$2.$3/$4-$5"),cidade:c.cidade,uf:c.uf};
  const base={exportador:c.exportador,importador:imp,incoterm:`${c.incoterm} ${c.local}`,moeda:c.moeda,peso_bruto_kg:c.pesoBrutoDoc,peso_liquido_kg:pl,volumes:c.volumes,pais_embarque:c.paisEmbarque,fabricante:c.fabricante,observacoes:[]};
  return {
    INV:{...base,tipo:"INV",numero:c.fatura,data:"10/10/2026",outros_numeros:[],valor_total:tot,valor_fob:["CFR","CIF"].includes(c.incoterm)?fob:null,frete:c.frete||null,seguro:c.seguro||null,pais_origem:c.fabricante?.pais||c.exportador.pais,declaracao_origem:c.prova,itens:it},
    PL:{...base,tipo:"PL",numero:c.romaneio,outros_numeros:[c.fatura],itens:it.map(i=>({...i,preco_unitario:null,valor:null}))},
    BL:{...base,tipo:"BL",numero:c.bl,draft:false,data_embarque:c.embarque,porto_embarque:c.porto,porto_descarga:c.local==="HAMBURG"?"Rio de Janeiro":"Santos",embalagem_madeira:/madeira/i.test(c.embSigra),
      fretes_bl:c.freteBL?[{descricao:"Ocean Freight",moeda:c.moeda,valor:c.freteBL,modalidade:"prepaid"}]:[],itens:[]}
  };
}
async function demoPdf(c){
  const L=window.PDFLib; const pdf=await L.PDFDocument.create();
  const F=await pdf.embedFont(L.StandardFonts.Helvetica), B=await pdf.embedFont(L.StandardFonts.HelveticaBold);
  const W=595.28,H=841.89; let pg,y,np=0;
  const cinza=L.rgb(.35,.37,.45), azul=L.rgb(.16,.2,.42);
  const nova=()=>{pg=pdf.addPage([W,H]);np++;y=H-40;
    pg.drawText("08/11/2026, 10:00",{x:40,y:H-24,size:7.5,font:F,color:cinza});pg.drawText("Conferência DUIMP · Exemplo com dados fictícios",{x:330,y:H-24,size:7.5,font:F,color:cinza});
    pg.drawText("DEMONSTRAÇÃO",{x:150,y:380,size:64,font:B,color:L.rgb(.93,.93,.96),rotate:L.degrees(35)});
    pg.drawText("https://crivo.demo/exemplo",{x:40,y:18,size:7,font:F,color:cinza});pg.drawText(String(np),{x:W-50,y:18,size:7,font:F,color:cinza});y=H-58;};
  const need=h=>{if(y-h<44)nova();};
  const t=(x,s,o={})=>pg.drawText(winAnsi(String(s)),{x,y,size:o.size||8.5,font:o.b?B:F,color:o.c||L.rgb(.1,.1,.15)});
  const kv=(pares)=>{need(14);let x=56;for(const [k,v,dx] of pares){t(x,k+":",{b:true});if(v!=="")t(x+F.widthOfTextAtSize(k+":",8.5)+(B.widthOfTextAtSize("a",8.5)*1.6),v);x+=dx||170;}y-=13;};
  const tx=(s,o={})=>{need(14);t(o.x||56,s,o);y-=o.gap||13;};
  const sec=s=>{need(30);y-=6;pg.drawRectangle({x:50,y:y-4,width:W-100,height:17,color:L.rgb(.92,.94,.98)});t(58,s,{b:true,size:10,c:azul});y-=22;};
  const n=(v,d=2)=>Number(v).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
  nova();
  tx("Conferência DUIMP",{b:true,size:15,gap:24});
  sec("Informações Básicas");
  {const w=c.empresa.split(" ");const fim=w.pop();kv([["Empresa",`${w[0]} - ${w.join(" ")}`,330],["Identificação importador",c.ref]]);tx(`${fim} - ${c.cnpj}`);}
  kv([["Identificação interna",c.idInterno,170],["Via de transporte","Marítimo"]]);
  sec("Transporte e Carga");
  kv([["Doc Carga",c.bl,170],["Data de embarque",c.embarque,170],["CE","0"]]);
  kv([["Procedência",(c.procOverride?.procSigra)||c.procSigra,170],["URF de Despacho",c.local==="HAMBURG"?"0717600":"0817800"]]);
  kv([["Peso bruto",n(c.pesoBrutoSigra,3),170],["Peso líquido",n(c.itens.reduce((a,i)=>a+i[6],0),3)]]);
  sec("Embalagem");
  tx("Item Carga Tipo Código Descrição Quantidade Peso Bruto (kg) Merc. Perigosa Emb. Madeira Caract. Emb. Madeira",{b:true,size:7});
  tx(c.embSigra,{size:8});
  sec("Documentos de Instrução");
  tx(`FATURA COMERCIAL: ${c.fatura}`,{x:70});tx(`ROMANEIO DE CARGA: ${c.romaneio}`,{x:70});tx(`CONHECIMENTO DE CARGA: ${c.bl}`,{x:70});
  const itS=c.itens.map(([d,cod,ncm,q,un,pu,pl,ov])=>({d,cod,ncm:(ov&&ov.ncm)||ncm,q,un,pu,pl,valor:(ov&&ov.valor)||r2(q*pu)}));
  const totS=r2(itS.reduce((a,i)=>a+i.valor,0));
  sec("Totais FOB e Frete");
  const fobS=["CFR","CIF"].includes(c.incoterm)?r2(totS-(c.frete||0)-(c.seguro||0)):totS;
  tx(`FOB ${n(fobS)} ${n(fobS*6.21)}`);tx(`Frete ${n(c.frete||0)} ${n((c.frete||0)*6.21)}`);tx(`Seguro (automático) ${n(c.seguro||0)} ${n((c.seguro||0)*6.21)}`);
  sec("Faturas");
  tx(`Fatura ${c.fatura}`,{b:true});
  kv([["Incoterms",`${c.incoterm} ${c.local}`,170],["Moeda",c.moedaSigra,170]]);
  tx(`Totais ${n(itS.reduce((a,i)=>a+i.pl,0),5)} ${n(totS,5)}`);
  tx("Dados do Fornecedor",{b:true,size:8});
  kv([["Nome",c.exportador.nome.toUpperCase(),330],["País",c.exportador.pais]]);
  tx(`Itens DUIMP`,{b:true,size:11,gap:18});
  itS.forEach((i,k)=>{
    need(170);
    tx(`Item DUIMP ${String(k+1).padStart(3,"0")} · seq ${k+1}`,{b:true,size:10,c:azul,gap:16});
    kv([["NCM",i.ncm,170],["Código Interno",i.cod,170],["Código do Produto",String(100+k)]]);
    kv([["Descrição",i.d.toUpperCase().slice(0,90),500]]);
    kv([["Quantidade",n(i.q,5),170],["Valor unitário",n(i.pu,5),170],["Valor total",n(i.valor,5)]]);
    kv([["Unidade",i.un==="UN"?"UN UNIDADE":i.un==="M"?"M METRO":"KG QUILOGRAMA LIQUIDO",170],["Peso líquido",n(i.pl,5)]]);
    tx(`1 - IMPOSTO DE IMPORTAÇÃO · Fundamento ${c.fund.cod} ${c.fund.desc} · Regime 1 RECOLHIMENTO INTEGRAL`,{size:8});
    tx("Dados do Exportador",{b:true,size:8});
    kv([["Nome",c.exportador.nome.toUpperCase(),330],["País",c.exportador.pais]]);
    tx("Dados do Fabricante",{b:true,size:8});
    kv([["Nome",c.fabricante?c.fabricante.nome.toUpperCase():"Desconhecido",330],["País",(c.fabricante||c.exportador).pais]]);
    kv([["Condição de Venda (Incoterms)",`${c.incoterm} ${c.local}`,250],["Alíquota ICMS (Normal)",n(c.icmsSigra)+"%"]]);
    y-=6;
  });
  return await pdf.save();
}
async function demoMontar(c,quando){
  const bytes=await demoPdf(c);
  const pdfr=await readPdf(bytes);
  const S=parseSigraDuimp(pdfr); const G=sigraUnificado(S,null); G.arquivoPdf=`${c.ref.replace("/","-")}_conferencia_duimp_exemplo.pdf`;
  const docs=demoDocs(c);
  const res=rodarMotor(docs,G);
  const ach=mesclarAchados(res.achados,[],"demo");
  const t=quando||Date.now();
  const p={id:c.id,ref:c.ref,idSigra:c.idInterno,cliente:c.empresa,cnpj:c.cnpj,uf:c.uf,exportador:c.exportador.nome,criadoPor:"demo",criadoEm:t,atualizadoEm:t,versao:1,status:"aberto",
    docsEnviados:[{tipo:"BL",nome:"bl_exemplo.pdf"},{tipo:"INV",nome:"invoice_exemplo.pdf"},{tipo:"PL",nome:"packing_exemplo.pdf"}],sigraPdf:G.arquivoPdf,
    achados:ach,ok:res.ok,itens:res.itens,resumo:resumoDe(ach),log:[{em:t,por:"demo",acao:"Conferência criada (exemplo fictício)"}]};
  if(c.liberado&&!p.resumo.crit){Object.assign(p,{status:"liberado",liberadoPor:"demo",liberadoEm:t+3600e3});p.log.push({em:t+3600e3,por:"demo",acao:"Liberou para registro"});}
  ST.files[p.id]={bytes,nome:G.arquivoPdf};ST.extr[p.id]={docs,sigra:semLoc(G)};
  return p;
}
async function demoIniciar(){
  ST.local=false;ST.demo=true;ST.owner=true;ST.papel="admin";ST.me={id:"demo",name:"Visitante"};ST.names.demo="Visitante";ST.canWrite=true;
  render();
  try{if(window.claude&&window.claude.use){ST.downloads=await window.claude.use("downloads").catch(()=>null);}}catch(e){}
  for(let i=0;i<120&&!window.PDFLib;i++)await sleep(100);
  try{await getPdfjs();}catch(e){}
  await sleep(300);
  const tentar=async(c,t0)=>{for(let t=0;t<3;t++){try{return await Promise.race([demoMontar(c,t0),sleep(9000).then(()=>{throw new Error("tempo esgotado ao montar o exemplo");})]);}catch(e){if(t===2)throw e;await sleep(500);}}};
  try{
    const agora=Date.now();const ps=[];
    for(const [k,c] of DEMO_CASOS.entries()) ps.push(await tentar(c,agora-(k+1)*86400e3*([1,0.4,3][k])));
    ST.procs=ps.sort((a,b)=>b.atualizadoEm-a.atualizadoEm);
  }catch(e){toast("Não foi possível montar o exemplo: "+e.message,8000);}
  ST.procsLoaded=true;render();
}
function viewNovaDemo(){
  return `<div class="wrap">${bannerBase()}<div><h1>Nova conferência</h1><div class="muted">Na versão da empresa, aqui se arrastam os PDFs do processo. Na demonstração, rode um processo de exemplo e veja o Crivo trabalhar.</div></div>
  <div class="grid2"><section class="card"><header><h2>Processo de exemplo</h2></header><div class="body" style="display:flex;flex-direction:column;gap:14px">
   <div class="check"><span class="ok">BL</span><span class="ok">Invoice</span><span class="ok">Packing</span><span>C. origem</span><span class="ok">Conferência DUIMP</span></div>
   <dl class="kv"><dt>Importador</dt><dd style="font-family:var(--body)">Horizonte Válvulas e Conexões Ltda (fictício) · RJ</dd><dt>Exportador</dt><dd style="font-family:var(--body)">Vandermeer Industrial B.V. · Países Baixos</dd><dt>Mercadoria</dt><dd style="font-family:var(--body)">Válvulas e flanges de aço inox · 6 itens</dd><dt>Condição</dt><dd>FOB Hamburg · EUR</dd></dl>
   <div class="row"><button class="btn pri" id="dGo">${ic("regras")}Conferir processo de exemplo</button><span class="muted" id="nMsg" role="status"></span></div>
  </div></section>
  <section class="card"><header><h2>O que acontece</h2></header><div class="body" id="nSteps"><div class="steps">${passosHtml({doc_CO:{s:"",m:"não enviado"}})}</div>
  <p class="muted" style="margin:16px 0 0;font-size:12.5px">Na demonstração, o PDF do processo é gerado na hora e lido pelo mesmo leitor usado com o Sigraweb. Os dados dos documentos de instrução são simulados (na versão real, o Claude os lê).</p></div></section></div></div>`;
}
function montarNovaDemo(){
  const b=$("#dGo");if(!b)return;
  b.onclick=async()=>{b.setAttribute("aria-disabled","true");const st={doc_CO:{s:"",m:"não enviado"}};const set=(k,s)=>{st[k]={s};$("#nSteps .steps").innerHTML=passosHtml(st);};
    try{
      for(const k of ["sigra","doc_BL","doc_INV","doc_PL","regras","ia"]){set(k,"run");await sleep(k==="regras"?500:650);if(k==="sigra"){}set(k,"done");}
      const n=ST.procs.filter(p=>p.id.startsWith("demo-run")).length+1;
      const c={...DEMO_CASOS[0],id:"demo-run-"+n,ref:"DEMO-26/05"+String(10+n)};
      const p=await demoMontar(c);ST.procs.unshift(p);ir("p-"+p.id);
    }catch(e){$("#nMsg").innerHTML=`<span class="bad">${esc(e.message)}</span>`;b.removeAttribute("aria-disabled");}
  };
}
