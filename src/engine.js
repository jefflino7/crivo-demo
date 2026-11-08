// ===== Motor de conferência (regras determinísticas) =====
const REGRAS=[
  // id, grupo, título, nível padrão
  ["cnpj","Importador","CNPJ do importador","crit"],
  ["incoterm","Valores","Incoterm","crit"],
  ["moeda","Valores","Moeda da fatura","crit"],
  ["valor_total","Valores","Valor total da fatura","crit"],
  ["fob_frete","Valores","FOB e frete da fatura","crit"],
  ["totais_zerados","Valores","Totais FOB/frete do cabeçalho","warn"],
  ["frete_rateio","Valores","Rateio de FOB/frete nas adições","warn"],
  ["frete_bl","Valores","Frete do BL × frete da invoice","warn"],
  ["seguro","Valores","Seguro","info"],
  ["peso_bruto","Carga","Peso bruto","crit"],
  ["peso_liquido","Carga","Peso líquido","crit"],
  ["volumes","Carga","Quantidade de volumes","crit"],
  ["embalagem_madeira","Carga","Embalagem de madeira","crit"],
  ["bl_numero","Documentos","Número do conhecimento","crit"],
  ["fatura_numero","Documentos","Número da fatura","crit"],
  ["romaneio_numero","Documentos","Número do romaneio","warn"],
  ["bl_draft","Documentos","Conhecimento definitivo","crit"],
  ["data_embarque","Documentos","Data de embarque","crit"],
  ["procedencia","Origem","País de procedência","crit"],
  ["origem","Origem","País de origem","crit"],
  ["exportador","Origem","Exportador","warn"],
  ["fabricante","Origem","Fabricante","warn"],
  ["acordo_sem_prova","Tributos","Preferência tarifária sem prova de origem","crit"],
  ["acordo_nao_usado","Tributos","Prova de origem sem preferência na DUIMP","warn"],
  ["icms_aliquota","Tributos","Alíquota de ICMS da UF","warn"],
  ["icms_sp_ncm","Tributos","NCM em norma de ICMS/SP","info"],
  ["itens_qtd","Itens","Quantidade de itens","crit"],
  ["item_ncm","Itens","NCM dos itens","crit"],
  ["item_quantidade","Itens","Quantidade por item","crit"],
  ["item_valor","Itens","Valor por item","crit"],
  ["item_preco","Itens","Preço unitário","crit"],
  ["item_peso","Itens","Peso líquido por item","crit"],
  ["item_descricao","Itens","Descrição × documento (dimensões)","crit"],
  ["item_interno","Itens","Coerência interna do produto","crit"],
  ["docs_entre_si","Documentos","Documentos de instrução entre si","crit"],
  ["ia","Análise da IA","Apontamento sugerido pela IA","warn"],
];
const REGRA=Object.fromEntries(REGRAS.map(r=>[r[0],{id:r[0],grupo:r[1],titulo:r[2],nivel:r[3]}]));
const NIVEL_LABEL={crit:"Crítico",warn:"Atenção",info:"Informativo"};

const deacc=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim();
const PAISES={suecia:"Suécia",sweden:"Suécia",finlandia:"Finlândia",finland:"Finlândia",china:"China","china, people's republic of":"China",alemanha:"Alemanha",germany:"Alemanha",
  "estados unidos":"Estados Unidos",eua:"Estados Unidos",usa:"Estados Unidos","united states":"Estados Unidos","united states of america":"Estados Unidos",italia:"Itália",italy:"Itália",
  espanha:"Espanha",spain:"Espanha",franca:"França",france:"França",japao:"Japão",japan:"Japão","coreia do sul":"Coreia do Sul",coreia:"Coreia do Sul",korea:"Coreia do Sul","south korea":"Coreia do Sul",
  india:"Índia",taiwan:"Taiwan",vietna:"Vietnã",vietnam:"Vietnã","viet nam":"Vietnã",mexico:"México",argentina:"Argentina",chile:"Chile",portugal:"Portugal",
  holanda:"Países Baixos","paises baixos":"Países Baixos",netherlands:"Países Baixos",belgica:"Bélgica",belgium:"Bélgica","reino unido":"Reino Unido","united kingdom":"Reino Unido",uk:"Reino Unido",
  suica:"Suíça",switzerland:"Suíça",austria:"Áustria",polonia:"Polônia",poland:"Polônia",turquia:"Turquia",turkey:"Turquia",turkiye:"Turquia",canada:"Canadá",tailandia:"Tailândia",thailand:"Tailândia",
  malasia:"Malásia",malaysia:"Malásia",indonesia:"Indonésia",dinamarca:"Dinamarca",denmark:"Dinamarca",noruega:"Noruega",norway:"Noruega",paraguai:"Paraguai",paraguay:"Paraguai",uruguai:"Uruguai",uruguay:"Uruguai",
  "hong kong":"Hong Kong",singapura:"Singapura",singapore:"Singapura",israel:"Israel",brasil:"Brasil",brazil:"Brasil",colombia:"Colômbia",peru:"Peru","africa do sul":"África do Sul","south africa":"África do Sul",
  republica_tcheca:"Tchéquia",tchequia:"Tchéquia","czech republic":"Tchéquia",czechia:"Tchéquia",hungria:"Hungria",hungary:"Hungria",irlanda:"Irlanda",ireland:"Irlanda",grecia:"Grécia",greece:"Grécia",
  eslovaquia:"Eslováquia",slovakia:"Eslováquia",eslovenia:"Eslovênia",slovenia:"Eslovênia",romenia:"Romênia",romania:"Romênia",bulgaria:"Bulgária",croacia:"Croácia",croatia:"Croácia",estonia:"Estônia",letonia:"Letônia",latvia:"Letônia",lituania:"Lituânia",lithuania:"Lituânia",luxemburgo:"Luxemburgo",luxembourg:"Luxemburgo",malta:"Malta",chipre:"Chipre",cyprus:"Chipre"};
const UE=new Set(["Alemanha","Áustria","Bélgica","Bulgária","Chipre","Croácia","Dinamarca","Eslováquia","Eslovênia","Espanha","Estônia","Finlândia","França","Grécia","Hungria","Irlanda","Itália","Letônia","Lituânia","Luxemburgo","Malta","Países Baixos","Polônia","Portugal","Romênia","Suécia","Tchéquia"]);
function pais(s){
  if(!s) return null; let k=deacc(String(s).replace(/^\d+\s*/,"").replace(/[()]/g," ").trim());
  if(PAISES[k]) return PAISES[k];
  for(const [a,b] of Object.entries(PAISES)) if(k===a||k.startsWith(a+" ")||k.endsWith(" "+a)) return b;
  return String(s).replace(/^\d+\s*/,"").trim()||null;
}
const fmt=(n,d=2)=>n==null||isNaN(n)?"—":Number(n).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtKg=n=>n==null?"—":fmt(n,n%1?3:0)+" kg";
const eq=(a,b,tol)=>a!=null&&b!=null&&Math.abs(a-b)<=tol+1e-9;
const blank=v=>v==null||v===""||(typeof v==="number"&&isNaN(v));
const digits=s=>String(s||"").replace(/\D/g,"");
const normId=s=>String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,"");
const incoBase=s=>{const m=String(s||"").toUpperCase().match(/\b(EXW|FCA|FAS|FOB|CFR|CIF|CPT|CIP|DAP|DPU|DAT|DDP|C&F|CNF)\b/);return m?m[1].replace(/C&F|CNF/,"CFR"):null;};
const moedaBase=s=>{const t=deacc(s);if(!t)return null;if(/usd|dolar|\$/.test(t))return"USD";if(/eur|euro/.test(t))return"EUR";if(/brl|real/.test(t))return"BRL";if(/cny|rmb|yuan|renminbi/.test(t))return"CNY";if(/jpy|iene|yen/.test(t))return"JPY";if(/gbp|libra/.test(t))return"GBP";if(/sek|coroa sueca/.test(t))return"SEK";if(/chf|franco/.test(t))return"CHF";return String(s).toUpperCase().slice(0,3);};
function dims(s){
  const m=String(s||"").match(/(\d+(?:[.,]\d+)?)\s*(?:MM)?\s*[X×x*]\s*(\d+(?:[.,]\d+)?)\s*(?:MM)?\s*[X×x*]\s*(\d+(?:[.,]\d+)?)/);
  return m?[m[1],m[2],m[3]].map(v=>parseFloat(v.replace(/\.(?=\d{3}\b)/g,"").replace(",","."))):null;
}
const sameDims=(a,b)=>{if(!a||!b)return true;const x=[...a].sort((p,q)=>p-q),y=[...b].sort((p,q)=>p-q);return x.every((v,i)=>Math.abs(v-y[i])<=Math.max(0.01,v*0.005));};
function rangeSeq(seqs){
  const s=[...new Set(seqs)].sort((a,b)=>a-b);const out=[];
  for(let i=0;i<s.length;i++){let j=i;while(j+1<s.length&&s[j+1]===s[j]+1)j++;out.push(j>i?`${s[i]} a ${s[j]}`:`${s[i]}`);i=j;}
  return out.join(", ");
}

function sigraUnificado(S,D){
  // junta Conferência DUIMP (S) e Detalhada (D); qualquer uma pode faltar
  const G={fontes:[],itens:[],loc:{},docsInstr:[]};
  if(S){G.fontes.push("DUIMP");Object.assign(G,{ref:S.ref,idInterno:S.idInterno,empresa:S.empresa,cnpj:S.header.cnpj||null,docCarga:S.docCarga,dataEmbarque:S.dataEmbarque,ce:S.ce,
    procedencia:S.procedencia,pesoBruto:S.pesoBruto,pesoLiq:S.pesoLiq,urf:S.urf,via:S.via,fatura:S.fatura,fornecedor:S.fornecedor,totais:S.totais,embalagens:S.embalagens,
    embalagemNenhuma:S.embalagemNenhuma,docsInstr:S.docsInstr.map(d=>({tipo:d.tipo,num:d.num})),loc:{...S.loc}});
    G.itens=S.itens.map(i=>({seq:i.seq,ncm:i.ncm,codInterno:(i.codInterno||"").trim(),codProduto:i.codProduto,nomeProduto:i.nomeProduto,desc:(i.desc||"").trim(),qtd:i.qtd,vunit:i.vunit,valor:i.valor,
      unidade:i.unidade,pesoLiq:i.pesoLiq,fab:i.fabricante?.nome||null,origem:i.fabricante?.pais||null,exportador:i.exportador?.nome||null,fundII:i.fundII||null,icms:i.icms,fcp:i.fcp,incoterm:i.incoterm,loc:i.loc}));
  }
  if(D){G.fontes.push("Detalhada");
    for(const k of ["cnpj","ref","procedencia","pesoBruto","pesoLiq","docCarga","dataEmbarque"]) if(blank(G[k])&&!blank(D[k])) G[k]=D[k];
    if(!S){G.loc={...D.loc};G.loc["Procedência"]=D.loc["País de Procedência"];G.loc["Peso bruto"]=D.loc["Peso Bruto"];G.loc["Peso líquido"]=D.loc["Peso Líquido"];G.loc["Doc Carga"]=D.loc["IDT. Conhecimento"];G.loc["Data de embarque"]=D.loc["Data de Embarque"];}
    G.volumes=D.volumes; G.embalagemTxt=D.embalagem; G.locVolumes=D.loc["Volumes"];
    G.adicoes=D.adicoes.map(a=>({n:a.n,ncm:a.ncm,pesoLiq:a.pesoLiq,fob:a.fob,frete:a.frete,seguro:a.seguro,origem:a.origem,fab:a.fab,fundII:a.fundII,loc:S?{}:a.loc}));
    if(!G.itens.length) G.itens=D.adicoes.map(a=>({seq:a.n,ncm:a.ncm,pesoLiq:a.pesoLiq,valor:(a.fob||0)+(a.frete||0),fab:a.fab,origem:a.origem,fundII:a.fundII?{cod:"",desc:a.fundII}:null,loc:{ncm:a.loc.ad}}));
  }
  return G;
}

function conferir(proc,cfg){
  cfg=cfg||{};
  const niv=id=>(cfg.niveis&&cfg.niveis[id])||REGRA[id].nivel;
  const tolPeso=cfg.tolPeso??0, tolValor=cfg.tolValor??0.01;
  const docs=proc.docs||{}, BL=docs.BL||null, INV=docs.INV||null, PL=docs.PL||null, CO=docs.CO||null, G=proc.sigra||null;
  const A=[]; const add=(id,o)=>{A.push({id:o.key||id,regra:id,nivel:o.nivel||niv(id),grupo:REGRA[id].grupo,titulo:o.titulo||REGRA[id].titulo,descricao:o.descricao,valores:o.valores||null,linhas:o.linhas||null,sugestao:o.sugestao||null,locs:(o.locs||[]).filter(Boolean).slice(0,30),itens:o.itens||null,origem:o.origem||"regra"});};
  const L=k=>G&&G.loc?G.loc[k]:null;
  const V=(k,v,diff,miss)=>({k,v:v==null||v===""?"não informado":String(v),diff:!!diff,miss:v==null||v===""||!!miss});
  const ok=[];// verificações aprovadas (para o placar)
  const pass=(t)=>ok.push(t);
  if(!G){return {achados:A,ok,itens:[],resumo:{}}}

  // --- Importador
  const cnpjDoc=digits(INV?.importador?.cnpj)||digits(BL?.importador?.cnpj);
  if(cnpjDoc && G.cnpj){ if(cnpjDoc!==digits(G.cnpj)) add("cnpj",{descricao:"O CNPJ do importador nos documentos é diferente do CNPJ do processo.",valores:[V("Invoice",INV?.importador?.cnpj),V("BL",BL?.importador?.cnpj),V("Sigraweb",G.cnpj,true)],locs:[L("Empresa")]}); else pass("CNPJ do importador"); }
  const cnpjs=[INV,BL].map(d=>digits(d?.importador?.cnpj)).filter(Boolean);
  if(cnpjs.length===2&&cnpjs[0]!==cnpjs[1]) add("docs_entre_si",{key:"docs_cnpj",titulo:"CNPJ diferente entre BL e invoice",descricao:"O consignatário do BL não tem o mesmo CNPJ da invoice.",valores:[V("Invoice",INV.importador.cnpj),V("BL",BL.importador.cnpj,true)]});

  // --- Incoterm e moeda
  const incoS=incoBase(G.fatura?.incoterm||G.itens[0]?.incoterm), incoD=incoBase(INV?.incoterm)||incoBase(PL?.incoterm);
  if(incoD&&incoS){ if(incoD!==incoS) add("incoterm",{descricao:`A invoice está em ${incoD} e o processo está em ${incoS}.`,valores:[V("Invoice",INV?.incoterm),V("Packing",PL?.incoterm),V("Sigraweb",G.fatura?.incoterm,true)],locs:[L("incoterm")]}); else pass("Incoterm "+incoS); }
  else if(incoD&&!incoS) add("incoterm",{descricao:"O incoterm não está informado no processo.",valores:[V("Invoice",INV?.incoterm),V("Sigraweb",null)],locs:[L("incoterm")]});
  const moS=moedaBase(G.fatura?.moeda), moD=moedaBase(INV?.moeda);
  if(moS&&moD){ if(moS!==moD) add("moeda",{descricao:`A invoice está em ${moD} e o processo em ${moS}.`,valores:[V("Invoice",INV.moeda),V("Sigraweb",G.fatura.moeda,true)],locs:[L("moeda")]}); else pass("Moeda "+moS); }

  // --- Valores
  const somaItensS=G.itens.reduce((a,i)=>a+(i.valor||0),0);
  const vS=G.fatura?.valor??(somaItensS||null);
  if(INV?.valor_total!=null&&vS!=null){
    if(!eq(INV.valor_total,vS,tolValor)) add("valor_total",{descricao:`O valor total da fatura no processo difere da invoice em ${fmt(vS-INV.valor_total)} ${moD||""}.`,valores:[V("Invoice",fmt(INV.valor_total)),V("Sigraweb · fatura",fmt(vS),true),V("Sigraweb · soma dos itens",fmt(somaItensS),!eq(somaItensS,INV.valor_total,tolValor))],locs:[L("fatura")]});
    else if(somaItensS&&!eq(somaItensS,INV.valor_total,tolValor)) add("valor_total",{descricao:"A soma dos itens no processo não fecha com o total da invoice.",valores:[V("Invoice",fmt(INV.valor_total)),V("Soma dos itens",fmt(somaItensS),true)]});
    else pass("Valor total "+fmt(vS));
  }
  if(INV?.itens?.length&&INV.valor_total!=null){const si=INV.itens.reduce((a,i)=>a+(i.valor||0),0); if(si&&!eq(si,INV.valor_total,tolValor)) add("docs_entre_si",{key:"docs_inv_soma",titulo:"Invoice não fecha",descricao:"A soma dos itens da invoice é diferente do total declarado nela.",valores:[V("Soma dos itens",fmt(si),true),V("Total da invoice",fmt(INV.valor_total))]});}

  const isC=["CFR","CIF","CPT","CIP"].includes(incoS||incoD);
  const fobS=G.totais?.fob, freS=G.totais?.frete;
  const adFob=G.adicoes?G.adicoes.reduce((a,x)=>a+(x.fob||0),0):null, adFre=G.adicoes?G.adicoes.reduce((a,x)=>a+(x.frete||0),0):null;
  if(isC && INV){
    if(INV.frete!=null||INV.valor_fob!=null){
      const fobRef=INV.valor_fob, freRef=INV.frete;
      if((fobS===0||fobS==null)&&(freS===0||freS==null)&&somaItensS>0){
        add("totais_zerados",{descricao:"Os totais de FOB e frete do cabeçalho estão zerados, embora os itens tenham valor. Confira se o frete foi lançado no processo antes de registrar.",valores:[V("Invoice · FOB",fmt(fobRef)),V("Invoice · frete",fmt(freRef)),V("Sigraweb · FOB",fmt(fobS??0),true),V("Sigraweb · frete",fmt(freS??0),true)],locs:[L("totais")]});
      } else {
        const d1=fobRef!=null&&fobS!=null&&!eq(fobRef,fobS,tolValor), d2=freRef!=null&&freS!=null&&!eq(freRef,freS,tolValor);
        if(d1||d2) add("fob_frete",{descricao:"FOB ou frete do processo não batem com a invoice.",valores:[V("Invoice · FOB",fmt(fobRef)),V("Sigraweb · FOB",fmt(fobS),d1),V("Invoice · frete",fmt(freRef)),V("Sigraweb · frete",fmt(freS),d2)],locs:[L("totais")]}); else pass("FOB e frete do cabeçalho");
      }
      if(adFob!=null&&fobRef!=null){
        const d1=!eq(adFob,fobRef,tolValor), d2=freRef!=null&&!eq(adFre,freRef,tolValor);
        if(d1||d2) add("frete_rateio",{descricao:`A soma das ${G.adicoes.length} adições não fecha com a invoice (diferença de ${fmt(Math.abs(adFob-fobRef))} no FOB e ${fmt(Math.abs((adFre||0)-(freRef||0)))} no frete). Normalmente é arredondamento do rateio; ajuste a última adição para o total bater.`,valores:[V("Invoice · FOB",fmt(fobRef)),V("Adições · FOB",fmt(adFob),d1),V("Invoice · frete",fmt(freRef)),V("Adições · frete",fmt(adFre),d2)],locs:G.adicoes.slice(-1).map(a=>a.loc?.frete)});
        else pass("Rateio de FOB/frete nas adições");
      }
      if(fobRef!=null&&freRef!=null&&INV.valor_total!=null&&!eq(fobRef+freRef+(INV.seguro||0),INV.valor_total,tolValor)) add("docs_entre_si",{key:"docs_inv_cfr",titulo:"FOB + frete ≠ total da invoice",descricao:"Na própria invoice, FOB + frete (+ seguro) não fecha com o total.",valores:[V("FOB + frete",fmt(fobRef+freRef),true),V("Total",fmt(INV.valor_total))]});
    } else if(somaItensS>0) add("fob_frete",{nivel:"warn",descricao:`A condição é ${incoS||incoD}, mas a invoice não separa FOB e frete. Confirme o frete com o exportador antes de registrar.`,valores:[V("Invoice · frete",null)]});
    // frete do BL
    const fb=(BL?.fretes_bl||[]).filter(f=>f.valor!=null&&/ocean|freight|frete|bas|surch|bunker|efs|fuel|ets|etq|emission/i.test(f.descricao||"")&&f.modalidade!=="collect");
    if(fb.length&&INV.frete!=null){
      const porMoeda={};for(const f of fb){const m=moedaBase(f.moeda)||"?";porMoeda[m]=(porMoeda[m]||0)+f.valor;}
      const txt=Object.entries(porMoeda).map(([m,v])=>`${m} ${fmt(v)}`).join(" + ");
      const mInv=moedaBase(INV.moeda);
      if(Object.keys(porMoeda).length===1&&porMoeda[mInv]!=null){ if(!eq(porMoeda[mInv],INV.frete,Math.max(1,INV.frete*0.01))) add("frete_bl",{descricao:"O frete do BL é diferente do frete da invoice. Defina qual valor vai para a DUIMP.",valores:[V("BL",txt,true),V("Invoice",`${mInv} ${fmt(INV.frete)}`)]}); else pass("Frete do BL = invoice"); }
      else add("frete_bl",{descricao:`O BL mostra frete em outra moeda (${txt}) e a invoice traz ${mInv} ${fmt(INV.frete)}. Confirme qual valor e moeda vão para a DUIMP.`,valores:[V("BL",txt,true),V("Invoice",`${mInv} ${fmt(INV.frete)}`)]});
    }
  }
  if(["CFR","FOB","EXW","FCA","CPT","FAS"].includes(incoS||incoD)&&!(G.totais?.seguro>0)&&!(INV?.seguro>0)) add("seguro",{descricao:`Na condição ${incoS||incoD} o seguro não vem na invoice. Informe o valor da apólice ou confirme que fica zerado.`,valores:[V("Sigraweb",fmt(G.totais?.seguro??0))]});

  // --- Carga: pesos, volumes, embalagem
  const pbDocs=[["BL",BL?.peso_bruto_kg],["Packing",PL?.peso_bruto_kg],["Invoice",INV?.peso_bruto_kg]].filter(x=>x[1]!=null);
  const pbRef=pbDocs[0]?.[1];
  const difPB=pbDocs.some(x=>!eq(x[1],pbRef,tolPeso));
  if(difPB) add("docs_entre_si",{key:"docs_peso_bruto",titulo:"Peso bruto diferente entre os documentos",descricao:"BL, packing e invoice não têm o mesmo peso bruto.",valores:pbDocs.map(x=>V(x[0],fmtKg(x[1]),!eq(x[1],pbRef,tolPeso)))});
  if(pbRef!=null){
    if(blank(G.pesoBruto)) add("peso_bruto",{descricao:`O peso bruto não está preenchido no processo. Pelos documentos, são ${fmtKg(pbRef)}.`,valores:[...pbDocs.map(x=>V(x[0],fmtKg(x[1]))),V("Sigraweb",null)],locs:[L("Peso bruto")],sugestao:`Informar ${fmtKg(pbRef)}`});
    else if(!eq(G.pesoBruto,pbRef,tolPeso)) add("peso_bruto",{descricao:`O peso bruto do processo difere dos documentos em ${fmtKg(Math.abs(G.pesoBruto-pbRef))}.`,valores:[...pbDocs.map(x=>V(x[0],fmtKg(x[1]))),V("Sigraweb",fmtKg(G.pesoBruto),true)],locs:[L("Peso bruto")]});
    else pass("Peso bruto "+fmtKg(pbRef));
  }
  const plDocs=[["Packing",PL?.peso_liquido_kg],["Invoice",INV?.peso_liquido_kg]].filter(x=>x[1]!=null);
  const plRef=plDocs[0]?.[1];
  if(plDocs.length===2&&!eq(plDocs[0][1],plDocs[1][1],tolPeso)) add("docs_entre_si",{key:"docs_peso_liq",titulo:"Peso líquido diferente entre packing e invoice",descricao:"Packing e invoice têm pesos líquidos diferentes.",valores:plDocs.map(x=>V(x[0],fmtKg(x[1]),true))});
  const somaPLS=G.itens.reduce((a,i)=>a+(i.pesoLiq||0),0);
  if(plRef!=null){
    const fatPL=G.fatura?.pesoLiq;
    if(somaPLS&&!eq(somaPLS,plRef,tolPeso)) add("peso_liquido",{descricao:`A soma do peso líquido dos itens no processo (${fmtKg(somaPLS)}) não bate com os documentos (${fmtKg(plRef)}).`,valores:[...plDocs.map(x=>V(x[0],fmtKg(x[1]))),V("Sigraweb · itens",fmtKg(somaPLS),true)]});
    if(blank(G.pesoLiq)) add("peso_liquido",{key:"peso_liquido_cab",descricao:`O peso líquido total não está preenchido no cabeçalho do processo. Pelos documentos, são ${fmtKg(plRef)}.`,valores:[...plDocs.map(x=>V(x[0],fmtKg(x[1]))),V("Sigraweb · itens",fmtKg(somaPLS),!eq(somaPLS,plRef,tolPeso)),V("Sigraweb · cabeçalho",null)],locs:[L("Peso líquido")],sugestao:`Informar ${fmtKg(plRef)}`});
    else if(!eq(G.pesoLiq,plRef,tolPeso)) add("peso_liquido",{key:"peso_liquido_cab",descricao:"O peso líquido do cabeçalho difere dos documentos.",valores:[...plDocs.map(x=>V(x[0],fmtKg(x[1]))),V("Sigraweb",fmtKg(G.pesoLiq),true)],locs:[L("Peso líquido")]});
    if(fatPL!=null&&!eq(fatPL,plRef,tolPeso)) add("peso_liquido",{key:"peso_liquido_fat",descricao:"O peso líquido da fatura no processo difere dos documentos.",valores:[V("Documentos",fmtKg(plRef)),V("Sigraweb · fatura",fmtKg(fatPL),true)],locs:[L("fatura")]});
    if(!A.some(a=>a.regra==="peso_liquido")) pass("Peso líquido "+fmtKg(plRef));
  }
  const volDocs=[["BL",BL?.volumes],["Packing",PL?.volumes]].filter(x=>x[1]!=null);
  const volRef=volDocs[0]?.[1];
  if(volDocs.length===2&&volDocs[0][1]!==volDocs[1][1]) add("docs_entre_si",{key:"docs_volumes",titulo:"Volumes diferentes entre BL e packing",descricao:"BL e packing informam quantidades de volumes diferentes.",valores:volDocs.map(x=>V(x[0],x[1],true))});
  const volS=G.volumes??(G.embalagens&&G.embalagens.length?G.embalagens.map(e=>numBR((e.match(/\s(\d+(?:[.,]\d+)?)\s/)||[])[1])).reduce((a,b)=>a+(b||0),0):null);
  if(volRef!=null){
    if(blank(volS)||volS===0) add("volumes",{descricao:`A quantidade de volumes não está informada no processo. Pelos documentos, são ${volRef}${BL?.tipo_volume?" "+BL.tipo_volume.toLowerCase():""}.`,valores:[...volDocs.map(x=>V(x[0],x[1])),V("Sigraweb",null)],locs:[L("embalagem")||G.locVolumes],sugestao:`Informar ${volRef} volumes`});
    else if(volS!==volRef) add("volumes",{descricao:"A quantidade de volumes do processo difere dos documentos.",valores:[...volDocs.map(x=>V(x[0],x[1])),V("Sigraweb",volS,true)],locs:[L("embalagem")||G.locVolumes]});
    else pass("Volumes "+volRef);
  }
  const madeira=BL?.embalagem_madeira||PL?.embalagem_madeira;
  if(madeira){
    const temMad=(G.embalagens||[]).some(e=>/sim|madeira|wood/i.test(e))||/madeira/i.test(G.embalagemTxt||"");
    if(!temMad) add("embalagem_madeira",{descricao:"Os documentos indicam embalagem de madeira, mas o processo não tem embalagem informada. Declare a embalagem e a característica da madeira (tratada e certificada).",valores:[V("BL",BL?.embalagem_madeira?"madeira tratada":"—"),V("Packing",PL?.embalagem_madeira?"madeira":"—"),V("Sigraweb",G.embalagemNenhuma?"nenhuma embalagem informada":G.embalagemTxt,true)],locs:[L("embalagem")]});
    else pass("Embalagem de madeira declarada");
  }

  // --- Documentos
  if(BL?.numero){
    const n=normId(BL.numero), sC=normId(G.docCarga), sD=G.docsInstr.find(d=>/CONHECIMENTO/.test(d.tipo));
    if(sC&&sC!==n) add("bl_numero",{descricao:"O número do conhecimento no processo é diferente do BL.",valores:[V("BL",BL.numero),V("Sigraweb",G.docCarga,true)],locs:[L("Doc Carga")]});
    else if(sD&&normId(sD.num)!==n) add("bl_numero",{descricao:"O conhecimento listado nos documentos de instrução é diferente do BL.",valores:[V("BL",BL.numero),V("Sigraweb · doc. instrução",sD.num,true)],locs:[L("CONHECIMENTO DE CARGA")]});
    else if(!sC&&!sD) add("bl_numero",{descricao:"O número do conhecimento não está no processo.",valores:[V("BL",BL.numero),V("Sigraweb",null)],locs:[L("Doc Carga")]});
    else pass("Conhecimento "+BL.numero);
  }
  if(INV?.numero){
    const n=normId(INV.numero), f=normId(G.fatura?.num), dI=G.docsInstr.find(d=>/FATURA/.test(d.tipo));
    if((f&&f!==n)||(dI&&normId(dI.num)!==n)) add("fatura_numero",{descricao:"O número da fatura no processo é diferente da invoice.",valores:[V("Invoice",INV.numero),V("Sigraweb · fatura",G.fatura?.num,f&&f!==n),V("Sigraweb · doc. instrução",dI?.num,dI&&normId(dI.num)!==n)],locs:[L("fatura"),L("FATURA COMERCIAL")]});
    else if(!f&&!dI) add("fatura_numero",{descricao:"A fatura não está vinculada no processo.",valores:[V("Invoice",INV.numero),V("Sigraweb",null)]});
    else pass("Fatura "+INV.numero);
  }
  const rom=G.docsInstr.find(d=>/ROMANEIO|PACKING/.test(d.tipo));
  if(PL&&rom){ const nums=[PL.numero,...(PL.outros_numeros||[])].filter(Boolean).map(normId); if(!nums.includes(normId(rom.num))) add("romaneio_numero",{descricao:"O número do romaneio no processo não aparece no packing list.",valores:[V("Packing",[PL.numero,...(PL.outros_numeros||[])].filter(Boolean).join(" / ")),V("Sigraweb",rom.num,true)],locs:[L("ROMANEIO DE CARGA")]}); else pass("Romaneio "+rom.num); }
  if(BL&&BL.draft) add("bl_draft",{descricao:"O conhecimento enviado é um DRAFT (minuta). Para registrar, é preciso o BL definitivo, com data de embarque e número de booking.",valores:[V("BL","DRAFT",true),V("Data de embarque",BL.data_embarque)]});
  if(blank(G.dataEmbarque)) add("data_embarque",{descricao:BL?.data_embarque?`A data de embarque não está no processo. O BL informa ${BL.data_embarque}.`:"A data de embarque não está no processo nem no BL enviado.",valores:[V("BL",BL?.data_embarque),V("Sigraweb",null)],locs:[L("Data de embarque")]});
  else if(BL?.data_embarque) pass("Data de embarque");

  // --- Origem e procedência
  const procD=pais(BL?.pais_embarque)||pais(PL?.pais_embarque), procS=pais(G.procedencia);
  if(procD&&procS){ if(procD!==procS) add("procedencia",{descricao:`O processo está com procedência ${procS}, mas a carga embarcou em ${BL?.porto_embarque?BL.porto_embarque+", ":""}${procD}. A procedência é o país de onde a mercadoria foi embarcada, mesmo que o exportador seja de outro país.`,valores:[V("BL · embarque",[BL?.porto_embarque,pais(BL?.pais_embarque)].filter(Boolean).join(", ")),V("Packing · partida",pais(PL?.pais_embarque)),V("Sigraweb",G.procedencia,true)],locs:[L("Procedência")],sugestao:`Alterar para ${procD}`}); else pass("Procedência "+procS); }
  else if(procD&&!procS) add("procedencia",{descricao:"A procedência não está informada no processo.",valores:[V("BL",procD),V("Sigraweb",null)],locs:[L("Procedência")]});
  const oriD=pais(CO?.certificado?.pais_origem)||pais(CO?.pais_origem)||pais(INV?.pais_origem)||pais(INV?.itens?.find(i=>i.pais_origem)?.pais_origem);
  if(oriD){
    const bad=G.itens.filter(i=>i.origem&&pais(i.origem)!==oriD);
    if(bad.length) add("origem",{descricao:`A origem dos documentos é ${oriD}, mas ${bad.length} item(ns) do processo estão com outra origem.`,valores:[V("Documentos",oriD),V("Sigraweb",[...new Set(bad.map(i=>pais(i.origem)))].join(", "),true)],itens:bad.map(i=>i.seq),locs:bad.map(i=>i.loc?.origem)});
    else if(G.itens.some(i=>i.origem)) pass("Origem "+oriD);
  }
  const expS=G.fornecedor?.nome||G.itens[0]?.exportador, expD=INV?.exportador?.nome;
  if(expS&&expD){const a=deacc(expS).split(/\W+/)[0], b=deacc(expD).split(/\W+/)[0]; if(a&&b&&a!==b) add("exportador",{descricao:"O exportador do processo não parece ser o mesmo da invoice.",valores:[V("Invoice",expD),V("Sigraweb",expS,true)]}); else pass("Exportador");}
  const desconh=G.itens.filter(i=>!i.fab||/desconhecido/i.test(i.fab));
  if(desconh.length) add("fabricante",{descricao:`${desconh.length===G.itens.length?"Todos os itens estão":desconh.length+" item(ns) estão"} com fabricante "Desconhecido". Os documentos ${INV?.fabricante?.nome?`indicam ${INV.fabricante.nome}`:"não identificam a usina/fabricante"}. Confirme com o exportador para preencher o fabricante na DUIMP e no Catálogo de Produtos.`,valores:[V("Invoice",INV?.fabricante?.nome),V("Sigraweb","Desconhecido",true)],itens:desconh.map(i=>i.seq),locs:desconh.slice(0,1).map(i=>i.loc?.fab)});

  // --- Acordo / preferência
  const comAcordo=G.itens.filter(i=>i.fundII&&/APC|ACE|acordo|mercosul|aladi|prefer|ALADI|AAP/i.test((i.fundII.desc||"")+" "+(i.fundII.cod||"")));
  const prova=!!CO||!!(INV?.declaracao_origem&&String(INV.declaracao_origem).trim());
  if(comAcordo.length&&!prova){
    const nome=comAcordo[0].fundII.desc||comAcordo[0].fundII.cod;
    add("acordo_sem_prova",{descricao:`${comAcordo.length===G.itens.length?"Todos os itens usam":comAcordo.length+" item(ns) usam"} o fundamento "${comAcordo[0].fundII.cod?comAcordo[0].fundII.cod+" ":""}${nome}", mas não há certificado de origem nem declaração de origem nos documentos. Sem prova de origem a redução do Imposto de Importação pode ser glosada.`,valores:[V("Certificado de origem",CO?"enviado":null),V("Declaração na invoice",INV?.declaracao_origem),V("Sigraweb · fundamento II",nome,true)],itens:comAcordo.map(i=>i.seq),locs:comAcordo.slice(0,1).map(i=>i.loc?.fundII),sugestao:"Pedir o atestado/certificado de origem ao exportador ou retirar a preferência"});
  } else if(comAcordo.length&&prova) pass("Preferência com prova de origem");
  if(prova&&!comAcordo.length&&G.itens.length) add("acordo_nao_usado",{descricao:"Há prova de origem nos documentos, mas o processo não aplica preferência tarifária. Verifique se existe acordo para a NCM.",valores:[V("Prova de origem",CO?("Certificado "+(CO.certificado?.acordo||"")):"Declaração na invoice"),V("Sigraweb · fundamento II","sem acordo",true)]});

  // --- ICMS
  const uf=(INV?.importador?.uf||BL?.importador?.uf||"").toUpperCase().slice(0,2);
  if(uf&&cfg.icmsUF){
    const row=cfg.icmsUF.find(r=>r.uf===uf);
    const al=[...new Set(G.itens.map(i=>i.icms).filter(v=>v!=null))];
    if(row&&al.length){
      const okA=al.every(a=>eq(a,row.aliq,0.001)||eq(a,row.efetiva,0.001));
      if(!okA) add("icms_aliquota",{descricao:`O importador é de ${uf}, onde a alíquota geral é ${fmt(row.aliq)}%${row.fcp?` + FCP ${fmt(row.fcp)}%`:""}. O processo usa ${al.map(a=>fmt(a)+"%").join(", ")}. Se houver benefício (redução de base, diferimento), confirme o enquadramento.`,valores:[V("Tabela "+uf,fmt(row.efetiva)+"%"),V("Sigraweb",al.map(a=>fmt(a)+"%").join(", "),true)],locs:G.itens.slice(0,1).map(i=>i.loc?.icms)});
      else pass(`ICMS ${uf} ${fmt(al[0])}%`);
    }
  }
  if(uf==="SP"&&cfg.ncmSP){
    const hits=[];for(const n of [...new Set(G.itens.map(i=>i.ncm).filter(Boolean))]){const h=cfg.ncmSP(n);if(h.length)hits.push(n+" → "+h.join("; "));}
    if(hits.length) add("icms_sp_ncm",{descricao:"Uma ou mais NCMs constam em normas de ICMS/SP (redução de base de cálculo). Verifique se o benefício se aplica.",linhas:hits});
  }

  // --- Itens
  const iS=G.itens, iI=INV?.itens||[], iP=PL?.itens||[];
  const rows=[];
  if(iI.length&&iS.length&&iI.length!==iS.length) add("itens_qtd",{descricao:`A invoice tem ${iI.length} item(ns) e o processo tem ${iS.length}.`,valores:[V("Invoice",iI.length),V("Sigraweb",iS.length,true)]});
  // casamento: por ordem quando a contagem bate; senão por quantidade+valor
  const pairs=[];
  if(iI.length===iS.length) iS.forEach((s,k)=>pairs.push([s,iI[k],iP.length===iS.length?iP[k]:null]));
  else{const used=new Set();for(const s of iS){let b=-1;iI.forEach((x,k)=>{if(used.has(k))return;if(b<0&&eq(x.valor,s.valor,tolValor)&&eq(x.quantidade,s.qtd,0.0005))b=k;});if(b>=0)used.add(b);pairs.push([s,b>=0?iI[b]:null,null]);}}
  const bad={item_ncm:[],item_quantidade:[],item_valor:[],item_preco:[],item_peso:[],item_descricao:[],item_interno:[]};
  for(const [s,d,p] of pairs){
    const r={seq:s.seq,ncm:s.ncm,desc:s.codInterno||s.nomeProduto||"",qtd:s.qtd,un:s.unidade,valor:s.valor,peso:s.pesoLiq,flags:[]};
    if(d){
      const nD=digits(d.ncm);
      if(nD.length===8&&s.ncm&&nD!==s.ncm){bad.item_ncm.push({s,d,a:d.ncm,b:s.ncm});r.flags.push("NCM");}
      if(d.quantidade!=null&&s.qtd!=null){
        const unI=deacc(d.unidade), unS=deacc(s.unidade);
        let qI=d.quantidade; if(/^(to|t|mt|ton)/.test(unI)&&/kg|quilo/.test(unS)) qI*=1000; if(/kg/.test(unI)&&/tonel|^mt|^t\b/.test(unS)) qI/=1000;
        if(!eq(qI,s.qtd,0.0005)){bad.item_quantidade.push({s,d,a:d.quantidade+" "+(d.unidade||""),b:s.qtd+" "+(s.unidade||"")});r.flags.push("Quantidade");}
      }
      if(d.valor!=null&&s.valor!=null&&!eq(d.valor,s.valor,tolValor)){bad.item_valor.push({s,d,a:fmt(d.valor),b:fmt(s.valor)});r.flags.push("Valor");}
      if(d.preco_unitario!=null&&s.vunit!=null&&!eq(d.preco_unitario,s.vunit,0.00001)){bad.item_preco.push({s,d,a:fmt(d.preco_unitario,4),b:fmt(s.vunit,4)});r.flags.push("Preço");}
      const pRef=p?.peso_liquido_kg??d.peso_liquido_kg??(/^(to|t|mt|ton)/.test(deacc(d.unidade))&&d.quantidade!=null?d.quantidade*1000:null);
      if(pRef!=null&&s.pesoLiq!=null&&!eq(pRef,s.pesoLiq,tolPeso)){bad.item_peso.push({s,d,a:fmtKg(pRef),b:fmtKg(s.pesoLiq)});r.flags.push("Peso");}
      const dS=dims(s.desc), dD=d.dimensoes_mm&&d.dimensoes_mm.length>=2?d.dimensoes_mm:dims(d.descricao);
      if(dS&&dD&&dD.length===3&&!sameDims(dS,dD)){bad.item_descricao.push({s,d,a:dD.map(v=>String(v).replace(".",",")).join(" × ")+" mm",b:dS.join(" × ")+" mm"});r.flags.push("Descrição");}
      r.doc={qtd:d.quantidade,un:d.unidade,valor:d.valor,ncm:d.ncm,desc:d.descricao};
    }
    // coerência interna: espessura no código interno × descrição
    const espCod=(String(s.codInterno||"").match(/(\d+(?:[.,]\d+)?)\s*MM\b/i)||[])[1];
    const dS=dims(s.desc);
    if(espCod&&dS){const e=parseFloat(espCod.replace(",","."));if(!dS.some(v=>Math.abs(v-e)<0.01)){bad.item_interno.push({s,a:s.codInterno,b:dS.join(" × ")});if(!r.flags.includes("Descrição"))r.flags.push("Descrição");}}
    rows.push(r);
  }
  const grp=(id,msg,col1,col2)=>{const L2=bad[id];if(!L2.length)return;
    const porProd={};for(const x of L2){const k=x.s.codProduto||"_";(porProd[k]=porProd[k]||[]).push(x);}
    for(const [prod,xs] of Object.entries(porProd)){
      const seqs=xs.map(x=>x.s.seq);
      add(id,{key:id+"_"+prod,titulo:REGRA[id].titulo+(prod!=="_"?` · produto ${prod}`:""),descricao:msg(xs,prod,seqs),itens:seqs,linhas:xs.slice(0,25).map(x=>`Item ${x.s.seq}: ${col1} ${x.a} · Sigraweb ${x.b}`),locs:xs.map(x=>x.s.loc?.[id==="item_peso"?"peso":id==="item_valor"||id==="item_preco"?"valor":id==="item_quantidade"?"qtd":id==="item_ncm"?"ncm":"desc"])});
    }};
  grp("item_ncm",(xs,p,s)=>`A NCM de ${xs.length} item(ns) difere da invoice/packing (itens ${rangeSeq(s)}).`,"Documento","");
  grp("item_quantidade",(xs,p,s)=>`Quantidade diferente da invoice nos itens ${rangeSeq(s)}.`,"Invoice","");
  grp("item_valor",(xs,p,s)=>`Valor diferente da invoice nos itens ${rangeSeq(s)}.`,"Invoice","");
  grp("item_preco",(xs,p,s)=>`Preço unitário diferente da invoice nos itens ${rangeSeq(s)}.`,"Invoice","");
  grp("item_peso",(xs,p,s)=>`Peso líquido diferente do packing/invoice nos itens ${rangeSeq(s)}.`,"Documento","");
  grp("item_descricao",(xs,p,s)=>`A descrição dos itens ${rangeSeq(s)} (produto ${p} do Catálogo) informa dimensões ${xs[0].b}, mas a invoice traz ${xs[0].a}. Corrija a descrição do produto no Catálogo antes de registrar.`,"Invoice","");
  grp("item_interno",(xs,p,s)=>`No produto ${p}, o código interno diz "${xs[0].a}", mas a descrição traz ${xs[0].b} mm. O cadastro do produto está incoerente.`,"Código interno","");
  if(pairs.length&&!Object.values(bad).some(b=>b.length)) pass(`${pairs.length} itens conferidos`);

  const resumo={crit:A.filter(a=>a.nivel==="crit").length,warn:A.filter(a=>a.nivel==="warn").length,info:A.filter(a=>a.nivel==="info").length,ok:ok.length,itens:iS.length,itensOk:rows.filter(r=>!r.flags.length).length};
  return {achados:A,ok,itens:rows,resumo};
}

// Mantém status (corrigido/justificado) de uma conferência anterior
function mesclarAchados(novos,antigos,quem){
  const old=Object.fromEntries((antigos||[]).map(a=>[a.id,a]));
  const now=Date.now();const out=[];
  for(const a of novos){
    const o=old[a.id];
    if(o&&o.status==="justificado") out.push({...a,status:"justificado",just:o.just,por:o.por,em:o.em});
    else if(o&&o.status==="corrigido") out.push({...a,status:"aberto",reaberto:true,nota:"Marcado como corrigido, mas continua na nova versão do Sigraweb."});
    else out.push({...a,status:"aberto"});
  }
  for(const o of antigos||[]) if(!novos.some(n=>n.id===o.id)&&o.status!=="resolvido") out.push({...o,status:"resolvido",por:quem,em:now,nota:"Não aparece mais na nova versão."});
  return out;
}
