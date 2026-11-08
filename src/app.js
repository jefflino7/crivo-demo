// ===== Crivo · aplicação =====
const ICMS_UF_PADRAO={atualizadoEm:"2026-11-08",fonte:"https://www.fazcomex.com.br/importacao/icms-na-importacao/",linhas:[
 ["AC","Acre",19,0,19,""],["AL","Alagoas",19,1,19,"A fonte lista FCP de 1%, mas a alíquota efetiva informada é 19%. Confirmar na SEFAZ-AL."],["AM","Amazonas",20,0,20,""],["AP","Amapá",18,0,18,""],
 ["BA","Bahia",20.5,0,20.5,"Vigência 17/02/2024"],["CE","Ceará",20,0,20,"Vigência 01/01/2024"],["DF","Distrito Federal",20,0,20,"Vigência 21/01/2024"],["ES","Espírito Santo",17,0,17,""],
 ["GO","Goiás",19,0,19,"Vigência 01/04/2024"],["MA","Maranhão",22,0,22,"Vigência 19/02/2024"],["MG","Minas Gerais",18,0,18,""],["MS","Mato Grosso do Sul",17,0,17,""],["MT","Mato Grosso",17,0,17,""],
 ["PA","Pará",19,0,19,""],["PB","Paraíba",20,0,20,"Vigência 01/01/2024"],["PE","Pernambuco",20.5,0,20.5,"Vigência 01/01/2024"],["PI","Piauí",21,0,21,""],["PR","Paraná",19.5,0,19.5,"Vigência 13/03/2024"],
 ["RJ","Rio de Janeiro",20,2,22,"FCP 2% · vigência 20/03/2024"],["RN","Rio Grande do Norte",18,0,18,"Vigência 01/01/2024"],["RO","Rondônia",19.5,0,19.5,"Vigência 12/01/2024"],["RR","Roraima",20,0,20,""],
 ["RS","Rio Grande do Sul",17,0,17,""],["SC","Santa Catarina",17,0,17,""],["SE","Sergipe",19,1,20,"FCP 1%. Confirmar na SEFAZ-SE."],["SP","São Paulo",18,0,18,""],["TO","Tocantins",20,0,20,"Vigência 01/01/2024"]
].map(([uf,nome,aliq,fcp,efetiva,obs])=>({uf,nome,aliq,fcp,efetiva,obs}))};
const LINKS_SP={sf4:"https://legislacao.fazenda.sp.gov.br/Paginas/resf041998.aspx",sf31:"https://legislacao.fazenda.sp.gov.br/Paginas/resf312008.aspx",cv:"https://www.confaz.fazenda.gov.br/legislacao/convenios/1991/CV052_91",art12:"https://legislacao.fazenda.sp.gov.br/Paginas/an2art012.aspx"};
const NCMSP_INFO={dadosEm:"24/09/2026",vig52:"2026-12-31",prorrog:"Conv. ICMS 10/2026 · Dec. 70.589/2026"};
const SECS_SP=[
 {tag:"SF 4/1998",t:"Resolução SF 4/1998",s:"Máquinas, aparelhos e equipamentos industriais e máquinas e implementos agrícolas",f:"Resolução SF 4/1998",a:"",ef:"Alíquota 12%",aliq:[12],link:LINKS_SP.sf4,lt:"Norma na Sefaz-SP",cor:"#0E8A7E"},
 {tag:"SF 31/2008",t:"Resolução SF 31/2008",s:"Produtos da indústria de processamento eletrônico de dados",f:"Resolução SF 31/2008",a:"",ef:"Alíquota 12%",aliq:[12],link:LINKS_SP.sf31,lt:"Norma na Sefaz-SP",cor:"#6151D6"},
 {tag:"Conv. 52/91 · Anexo I",t:"Convênio ICMS 52/91 · Anexo I",s:"Máquinas, aparelhos e equipamentos industriais",f:"Convênio ICMS 52/91",a:"Anexo I -",ef:"Carga 8,80% (interna)",aliq:[8.8],link:LINKS_SP.cv,lt:"Convênio no Confaz",cor:"#1D5BB8",conv:true},
 {tag:"Conv. 52/91 · Anexo II",t:"Convênio ICMS 52/91 · Anexo II",s:"Máquinas e implementos agrícolas",f:"Convênio ICMS 52/91",a:"Anexo II -",ef:"Carga 5,60% (interna)",aliq:[5.6],link:LINKS_SP.cv,lt:"Convênio no Confaz",cor:"#3F8F2F",conv:true}];
const fmtNcm=d=>d.length<=4?d:d.slice(0,4)+"."+d.slice(4).match(/.{1,2}/g).join(".");
const brDate=iso=>{const [y,m,d]=iso.slice(0,10).split("-");return `${d}/${m}/${y}`;};
const diasVig52=()=>Math.ceil((new Date(NCMSP_INFO.vig52+"T23:59:59-03:00")-new Date())/864e5);
const TIPOS={BL:"Conhecimento de embarque",INV:"Invoice",PL:"Packing list",CO:"Certificado de origem",SIGRA_DUIMP:"Sigraweb · Conferência DUIMP",SIGRA_DET:"Sigraweb · Conferência Detalhada",SIGRA_SIMP:"Sigraweb · Conferência Simplificada"};
const CURTO={BL:"BL",INV:"Invoice",PL:"Packing",CO:"C. origem"};

const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const dataBR=t=>t?new Date(t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}):"—";
const ICON={
  painel:'<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
  lista:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  nova:'<path d="M12 5v14M5 12h14"/>',
  uf:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  ncm:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  regras:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  chev:'<path d="m15 18-6-6 6-6"/>', pdf:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15h6M9 11h2"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>', up:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  sol:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  lua:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  seta:'<path d="M5 12h14M13 6l6 6-6 6"/>', livro:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>', ajuda:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>', chevr:'<path d="m9 18 6-6-6-6"/>'
};
const ic=n=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;

// ---------- estado
const ST={fItem:null,fNivel:"todos",fGrupo:"todos",abertos:{},soDiv:false,itQ:"",sortL:{k:"atualizadoEm",d:-1},user:null,sample:null,downloads:null,me:{id:null,name:""},owner:false,canWrite:true,papel:"operacional",
  procs:[],procsLoaded:false,loadTimeout:false,cfg:{icms:ICMS_UF_PADRAO,regras:{niveis:{},tolPeso:0,tolValor:0.01},papeis:{}},names:{},
  local:false,files:{},extr:{},draft:null,tab:"apontamentos",filtro:{q:"",status:"todos",regra:null},ncmQ:"",ufQ:""};
const NCMDATA=__NCMDATA__;
function ncmSP(q){q=String(q).replace(/\D/g,"");const out=[];
  for(const r of NCMDATA){const m=new Set(),amplo=[];
    for(const n of r.n){const d=n.replace(/\D/g,"");if(q.startsWith(d)||d.startsWith(q)){m.add(n);if(d.length<q.length)amplo.push(n);}}
    if(!m.size)continue;
    const si=SECS_SP.findIndex(s=>r.f===s.f&&r.a.startsWith(s.a));const s=SECS_SP[si];
    out.push({si,sec:s?s.t:r.f,ef:s?s.ef:"",item:r.i,d:r.d,g:r.g,anexo:r.a,n:r.n,m,amplo});}
  return out;}
const ncmSPNomes=n=>{const hs=ncmSP(n);return [...new Set(hs.map(h=>`${h.sec} · ${h.ef} · item ${h.item}`))];};
const ncmSPAliq=n=>[...new Set(ncmSP(n).flatMap(h=>{const s=SECS_SP[h.si];if(!s)return [];if(s.conv&&diasVig52()<0)return [];return s.aliq;}))];

// ---------- utilidades de UI
function toast(msg,ms=3600,acao){document.querySelectorAll(".toast").forEach(t=>t.remove());const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");
  const s=document.createElement("span");s.textContent=msg;t.appendChild(s);
  if(acao){const b=document.createElement("button");b.textContent=acao.label;b.onclick=()=>{t.remove();acao.fn();};t.appendChild(b);ms=Math.max(ms,6000);}
  document.body.appendChild(t);setTimeout(()=>t.remove(),ms);}
function contar(root=document){root.querySelectorAll("[data-count]").forEach(el=>{const fim=+el.dataset.count;if(!fim||matchMedia("(prefers-reduced-motion: reduce)").matches){el.textContent=el.dataset.fmt?el.dataset.fmt:fim;return;}
  const t0=performance.now(),d=550;const pas=t=>{const k=Math.min(1,(t-t0)/d);const v=Math.round(fim*(1-Math.pow(1-k,3)));el.textContent=k>=1&&el.dataset.fmt?el.dataset.fmt:v;if(k<1)requestAnimationFrame(pas);};requestAnimationFrame(pas);});}
function aplicarTema(t){document.documentElement.dataset.tema=t;try{localStorage.setItem("crivo.tema",t);}catch(e){}}
function modal(html,onMount){const s=document.createElement("div");s.className="scrim";s.innerHTML=`<div class="modal" role="dialog" aria-modal="true">${html}</div>`;document.body.appendChild(s);
  const close=()=>s.remove();s.addEventListener("click",e=>{if(e.target===s||e.target.closest("[data-close]"))close();});onMount&&onMount(s.firstElementChild,close);return close;}
const nome=id=>!id?"—":(id===ST.me.id&&ST.me.name)?ST.me.name:(ST.names[id]||"Colega");
const iniciais=n=>String(n||"?").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join("")||"?";
const papelDe=id=>id&&ST.cfg.papeis[id]||null;
const podeAdmin=()=>ST.owner||ST.papel==="admin";
async function resolverNomes(ids){if(!ST.user||!ST.user.profiles)return;const falt=[...new Set(ids.filter(i=>i&&!ST.names[i]))];if(!falt.length)return;
  try{const ps=await ST.user.profiles(falt);for(const i of falt){const p=ps&&ps[i];if(p&&p.name)ST.names[i]=p.name;}}catch(e){}}

// ---------- persistência
const writeQ={};
async function salvarDoc(path,data){
  if(!ST.db){return;}
  const prev=writeQ[path]||Promise.resolve();
  const p=prev.catch(()=>{}).then(()=>ST.db.doc(path).set(JSON.parse(JSON.stringify(data))));
  writeQ[path]=p;
  try{await p;}catch(e){
    if(e&&e.code==="invalid_argument"){ST.canWrite=false;toast("Você não tem permissão para salvar alterações nesta base.");}
    else if(e&&e.code==="quota_exceeded") toast("A base do Crivo está cheia. Avise o administrador.");
    else toast("Não foi possível salvar agora. Tente de novo em instantes.");
    throw e;
  }
}
async function salvarProc(proc){
  proc.atualizadoEm=Date.now();
  const i=ST.procs.findIndex(p=>p.id===proc.id); if(i>=0)ST.procs[i]=proc; else ST.procs.unshift(proc);
  ST.procs.sort((a,b)=>(b.atualizadoEm||0)-(a.atualizadoEm||0));
  if(ST.db) await salvarDoc("processos/"+proc.id,proc);
}
async function salvarExtr(id,extr){ST.extr[id]=extr;if(ST.db)await salvarDoc("extracoes/"+id,extr);}
async function lerExtr(id){if(ST.extr[id])return ST.extr[id];if(!ST.db)return null;try{const s=await ST.db.doc("extracoes/"+id).get();if(s.exists){ST.extr[id]=s.data();return ST.extr[id];}}catch(e){}return null;}

// ---------- IA: extração dos documentos de instrução
const SCHEMA_TXT=`{
 "tipo": "BL|INV|PL|CO",
 "numero": string|null, "data": string|null, "outros_numeros": [string],
 "draft": boolean|null,
 "exportador": {"nome": string|null, "pais": string|null},
 "importador": {"nome": string|null, "cnpj": string|null, "cidade": string|null, "uf": string|null},
 "incoterm": string|null, "local_incoterm": string|null, "moeda": string|null,
 "valor_total": number|null, "valor_fob": number|null, "frete": number|null, "seguro": number|null,
 "fretes_bl": [{"descricao": string, "moeda": string, "valor": number, "modalidade": "prepaid|collect|null"}],
 "peso_bruto_kg": number|null, "peso_liquido_kg": number|null, "volumes": number|null, "tipo_volume": string|null, "cubagem_m3": number|null,
 "embalagem_madeira": boolean|null,
 "pais_origem": string|null, "pais_embarque": string|null, "porto_embarque": string|null, "porto_descarga": string|null,
 "navio_viagem": string|null, "data_embarque": string|null,
 "conteineres": [{"numero": string, "lacre": string|null, "peso_bruto_kg": number|null}],
 "cond_pagamento": string|null, "declaracao_origem": string|null,
 "fabricante": {"nome": string|null, "pais": string|null}|null,
 "certificado": {"acordo": string|null, "numero": string|null, "data": string|null, "emissor": string|null, "pais_origem": string|null, "criterio": string|null, "ncms": [string]}|null,
 "itens": [{"seq": number, "descricao": string, "codigo": string|null, "ncm": string|null, "cn_code": string|null, "quantidade": number|null, "unidade": string|null,
   "preco_unitario": number|null, "valor": number|null, "peso_liquido_kg": number|null, "peso_bruto_kg": number|null, "volumes": number|null, "dimensoes_mm": [number], "pais_origem": string|null}],
 "observacoes": [string]
}`;
function promptExtracao(tipo,texto,nomeArq){
  return `Você é um analista de importação brasileiro conferindo documentos de instrução de despacho antes do registro da DUIMP.
Extraia os dados do documento abaixo (${TIPOS[tipo]||"documento"}; arquivo "${nomeArq}") e responda SOMENTE com um JSON neste formato:
${SCHEMA_TXT}

Regras:
- Não invente. Campo ausente = null (ou [] para listas). "tipo" = "${tipo}".
- Números como número JSON com ponto decimal (205973.25), sem separador de milhar. Atenção ao padrão europeu "1.922,00" = 1922.00.
- Pesos SEMPRE em kg (converta toneladas: 1,922 TO = 1922 kg). Quantidade e unidade dos itens como no documento.
- "ncm": só preencha se o documento rotular explicitamente como NCM (formato 0000.00.00). Códigos CN/HS europeus ou outros vão em "cn_code".
- Países em português (Suécia, Finlândia, China...). "pais_embarque" = país do porto/aeroporto de embarque (deduza do nome do porto se precisar, ex.: Gävle → Suécia).
- BL: "draft" = true se o documento estiver marcado DRAFT/minuta ou com campos XXXX. "fretes_bl" com cada linha de frete/sobretaxa, moeda e se é prepaid ou collect. "volumes" = total de volumes. "embalagem_madeira" = true se citar wooden/madeira/pallet de madeira.
- Invoice: "valor_total" = total da fatura; "valor_fob" e "frete" quando aparecem separados (ex.: FOB Price, Ocean Freight). "declaracao_origem" = texto de declaração de origem/statement on origin/número REX, se existir.
- Itens: uma entrada por linha de item (lote/batch conta como linha). "dimensoes_mm" = [espessura, largura, comprimento] quando houver.
- Certificado de origem: preencha "certificado" (acordo, número, data, emissor, país de origem, critério, NCMs).
- "observacoes": divergências ou alertas que você notar dentro do próprio documento (ex.: CEP diferente, campos em branco).

DOCUMENTO:
"""
${texto.slice(0,60000)}
"""`;
}
async function renderPaginasImagens(bytes,max=4){
  const doc=await openPdf(bytes);const out=[];
  for(let p=1;p<=Math.min(doc.numPages,max);p++){const pg=await doc.getPage(p);const vp=pg.getViewport({scale:1.6});const c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;
    await pg.render({canvasContext:c.getContext("2d"),canvas:c,viewport:vp}).promise;out.push(await new Promise(r=>c.toBlob(r,"image/jpeg",0.85)));}
  return out;
}
async function extrairDocIA(tipo,arq){
  if(!ST.sample) throw new Error("A leitura por IA não está disponível nesta visualização.");
  const opts={modelTier:"default"};
  let texto=arq.pdf.text||"";
  if(texto.replace(/\s/g,"").length<200){
    const lim=ST.sample.limits?await ST.sample.limits():null;
    if(lim&&lim.images){opts.images=await renderPaginasImagens(arq.bytes);texto="(Documento digitalizado: leia as imagens anexas.)";}
    else throw new Error("Este PDF é digitalizado (sem texto) e a leitura de imagens não está disponível.");
  }
  const r=await ST.sample.json(promptExtracao(tipo,texto,arq.nome),opts);
  if(!r||typeof r!=="object") throw new Error("A IA não devolveu dados legíveis.");
  r.tipo=tipo; r.arquivo=arq.nome; return r;
}
async function analiseIA(docs,sigra,achados){
  if(!ST.sample) return [];
  const inv=(docs.INV?.itens||[]).map(i=>({seq:i.seq,desc:i.descricao,ncm:i.ncm,qtd:i.quantidade,un:i.unidade}));
  const prods={};for(const i of sigra.itens){const k=i.codProduto||i.seq;if(!prods[k])prods[k]={produto:k,itens:[],ncm:i.ncm,codInterno:i.codInterno,nome:i.nomeProduto,descricao:i.desc};prods[k].itens.push(i.seq);}
  const prompt=`Você é um conferente aduaneiro brasileiro sênior. Compare a descrição dos produtos digitados na DUIMP (Sigraweb) com os itens da invoice e aponte SOMENTE contradições objetivas que as regras automáticas não pegaram: material, grau/liga, acabamento, modelo, função, NCM incoerente com a descrição (pela TEC), unidade de medida incompatível.
Ignore estes apontamentos já feitos: ${achados.map(a=>a.titulo).join("; ")}.
Não comente formatação nem sinônimos. Se não houver contradição, devolva [].
Responda SOMENTE com JSON: [{"titulo": string curto, "nivel": "crit"|"warn", "itens": [números dos itens DUIMP], "descricao": string (1-2 frases, em português), "sugestao": string|null}]

PRODUTOS NA DUIMP: ${JSON.stringify(Object.values(prods))}
ITENS DA INVOICE: ${JSON.stringify(inv.slice(0,80))}`;
  try{const r=await ST.sample.json(prompt,{modelTier:"default"});return Array.isArray(r)?r.slice(0,8):[];}catch(e){return [];}
}

// ---------- fluxo de conferência
async function lerArquivo(file){
  const bytes=new Uint8Array(await file.arrayBuffer());
  const pdf=await readPdf(bytes);
  return {nome:file.name,bytes,pdf,tipo:classifyText(pdf.text)};
}
function montarSigra(arqs){
  const aD=arqs.find(a=>a.tipo==="SIGRA_DUIMP"), aT=arqs.find(a=>a.tipo==="SIGRA_DET");
  const S=aD?parseSigraDuimp(aD.pdf):null, D=aT?parseSigraDet(aT.pdf):null;
  if(!S&&!D) return null;
  const G=sigraUnificado(S,D); G.arquivoPdf=aD?aD.nome:aT.nome; G.tipoPdf=aD?"SIGRA_DUIMP":"SIGRA_DET";
  return {G,bytes:(aD||aT).bytes};
}
function cfgMotor(){return {...ST.cfg.regras,icmsUF:ST.cfg.icms.linhas,ncmSP:n=>ncmSPNomes(n),ncmSPAliq:n=>ncmSPAliq(n),vig52:{ate:brDate(NCMSP_INFO.vig52),dias:diasVig52()}};}
function semLoc(G){const c=JSON.parse(JSON.stringify(G));delete c.loc;delete c.locVolumes;c.itens.forEach(i=>delete i.loc);(c.adicoes||[]).forEach(a=>delete a.loc);return c;}
function rodarMotor(docs,G){return conferir({docs,sigra:G},cfgMotor());}
function aplicarIA(res,ia){
  for(const x of ia){ if(!x||!x.titulo) continue;
    res.achados.push({id:"ia_"+deacc(x.titulo).replace(/[^a-z0-9]+/g,"_").slice(0,40),regra:"ia",nivel:x.nivel==="crit"?"crit":"warn",grupo:"Análise da IA",titulo:x.titulo,descricao:x.descricao||"",sugestao:x.sugestao||null,itens:Array.isArray(x.itens)?x.itens:null,locs:[],origem:"IA",valores:null,linhas:null});}
}
function resumoDe(ach){const ab=ach.filter(a=>a.status==="aberto");return {crit:ab.filter(a=>a.nivel==="crit").length,warn:ab.filter(a=>a.nivel==="warn").length,info:ab.filter(a=>a.nivel==="info").length,total:ach.length,resolvidos:ach.filter(a=>a.status!=="aberto").length};}
function statusDe(p){if(p.status==="liberado")return "liberado";const r=p.resumo||{};return r.crit?"bloqueado":(r.warn?"atencao":"pronto");}
const STATUS_LBL={bloqueado:["crit","Bloqueado"],atencao:["warn","Com pontos de atenção"],pronto:["ok","Pronto para liberar"],liberado:["ok","Liberado para registro"]};

async function executarConferencia(arqs,ref,setStep){
  const instr=arqs.filter(a=>["BL","INV","PL","CO"].includes(a.tipo));
  setStep("sigra","run");
  const sg=montarSigra(arqs);
  if(!sg){setStep("sigra","err");throw new Error("Envie o PDF da Conferência DUIMP ou da Conferência Detalhada do Sigraweb.");}
  setStep("sigra","done");
  const docs={};
  for(const a of instr){
    setStep("doc_"+a.tipo,"run");
    try{docs[a.tipo]=await extrairDocIA(a.tipo,a);setStep("doc_"+a.tipo,"done");}
    catch(e){setStep("doc_"+a.tipo,"err",e.message);if(e&&e.code==="not_granted")throw new Error("A leitura por IA foi recusada. Autorize o Crivo a usar o Claude para ler os documentos.");}
  }
  setStep("regras","run");
  const res=rodarMotor(docs,sg.G);
  setStep("regras","done");
  setStep("ia","run");
  aplicarIA(res,await analiseIA(docs,sg.G,res.achados));
  setStep("ia","done");
  const G=sg.G, id=uid(), agora=Date.now();
  const achados=mesclarAchados(res.achados,[],ST.me.id);
  const proc={id,ref:ref||G.ref||"Sem referência",idSigra:G.idInterno||null,cliente:G.empresa||docs.INV?.importador?.nome||"—",cnpj:G.cnpj||null,
    uf:(docs.INV?.importador?.uf||docs.BL?.importador?.uf||"").toUpperCase().slice(0,2)||null,exportador:docs.INV?.exportador?.nome||G.fornecedor?.nome||null,
    criadoPor:ST.me.id,criadoEm:agora,atualizadoEm:agora,versao:1,status:"aberto",docsEnviados:instr.map(a=>({tipo:a.tipo,nome:a.nome})),sigraPdf:G.arquivoPdf,
    achados,ok:res.ok,itens:res.itens,resumo:resumoDe(achados),
    log:[{em:agora,por:ST.me.id,acao:`Conferência criada com ${instr.length} documento(s) e ${G.fontes.join(" + ")} do Sigraweb`}]};
  ST.files[id]={bytes:sg.bytes,nome:G.arquivoPdf,locsOk:true};
  await salvarExtr(id,{docs,sigra:semLoc(G)}).catch(()=>{});
  await salvarProc(proc).catch(()=>{});
  return proc;
}
async function reconferir(proc,arqs){
  const ex=await lerExtr(proc.id)||{docs:{},sigra:null};
  const novosDocs=arqs.filter(a=>["BL","INV","PL","CO"].includes(a.tipo));
  if(!Object.keys(ex.docs||{}).length&&!novosDocs.length) throw new Error("Os dados lidos dos documentos deste processo não estão na base. Envie junto o BL, a invoice e o packing list.");
  for(const a of novosDocs){toast(`Lendo ${TIPOS[a.tipo]} com IA…`);ex.docs[a.tipo]=await extrairDocIA(a.tipo,a);}
  const sg=montarSigra(arqs);
  let G=ex.sigra; if(sg){G=sg.G;ST.files[proc.id]={bytes:sg.bytes,nome:G.arquivoPdf,locsOk:true};}
  if(!G) throw new Error("Envie o PDF do Sigraweb para reconferir.");
  const res=rodarMotor(ex.docs,G);
  aplicarIA(res,await analiseIA(ex.docs,G,res.achados));
  const ach=mesclarAchados(res.achados,proc.achados,ST.me.id);
  const agora=Date.now();
  Object.assign(proc,{achados:ach,ok:res.ok,itens:res.itens,resumo:resumoDe(ach),versao:(proc.versao||1)+1,status:proc.status==="liberado"?"aberto":proc.status,
    docsEnviados:[...(proc.docsEnviados||[]).filter(d=>!novosDocs.some(n=>n.tipo===d.tipo)),...novosDocs.map(a=>({tipo:a.tipo,nome:a.nome}))],sigraPdf:sg?G.arquivoPdf:proc.sigraPdf});
  proc.log=[...(proc.log||[]),{em:agora,por:ST.me.id,acao:`Reconferência v${proc.versao}: ${[sg?"novo PDF do Sigraweb":"",...novosDocs.map(a=>TIPOS[a.tipo])].filter(Boolean).join(", ")}`}];
  await salvarExtr(proc.id,{docs:ex.docs,sigra:semLoc(G)}).catch(()=>{});
  await salvarProc(proc);
  return proc;
}

// ---------- PDF anotado (pdf-lib)
const winAnsi=s=>String(s??"").replace(/[×]/g,"x").replace(/[≠]/g,"<>").replace(/[→]/g,"->").replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[^\x20-\x7E\xA0-\xFF—–·•]/g,"");
function wrap(txt,font,size,maxW){const words=winAnsi(txt).split(/\s+/);const lines=[];let cur="";for(const w of words){const t=cur?cur+" "+w:w;if(font.widthOfTextAtSize(t,size)>maxW&&cur){lines.push(cur);cur=w;}else cur=t;}if(cur)lines.push(cur);return lines;}
async function gerarPdfAnotado(proc){
  const f=ST.files[proc.id]; if(!f) throw new Error("Envie de novo o PDF do Sigraweb para gerar o PDF anotado.");
  const L=window.PDFLib; if(!L) throw new Error("O gerador de PDF não carregou.");
  const pdf=await L.PDFDocument.load(f.bytes.slice(0));
  const font=await pdf.embedFont(L.StandardFonts.Helvetica), bold=await pdf.embedFont(L.StandardFonts.HelveticaBold);
  const cor={crit:L.rgb(0.86,0.16,0.24),warn:L.rgb(0.85,0.55,0.05),info:L.rgb(0.2,0.42,0.85)};
  const abertos=abertosOrd(proc);
  const pages=pdf.getPages();
  abertos.forEach((a,k)=>{
    const n=String(k+1);
    for(const lc of a.locs||[]){const pg=pages[lc.p];if(!pg)continue;
      pg.drawRectangle({x:lc.x-3,y:lc.y-2,width:lc.w+6,height:lc.h+4,borderColor:cor[a.nivel],borderWidth:1.4,color:cor[a.nivel],opacity:0.12,borderOpacity:0.95});
      const bx=Math.max(4,lc.x-20);pg.drawCircle({x:bx+7,y:lc.y+lc.h/2,size:7.5,color:cor[a.nivel]});
      pg.drawText(n,{x:bx+7-font.widthOfTextAtSize(n,7.5)/2,y:lc.y+lc.h/2-2.7,size:7.5,font:bold,color:L.rgb(1,1,1)});
    }
  });
  // página de resumo no início
  const [w,h]=[595.28,841.89]; let pg=pdf.insertPage(0,[w,h]); let y=h-56; const M=46;
  const nova=()=>{pg=pdf.insertPage(pdf.getPages().indexOf(pg)+1,[w,h]);y=h-56;};
  pg.drawText("Crivo · Conferência pré-DUIMP",{x:M,y,size:18,font:bold,color:L.rgb(0.16,0.13,0.4)});y-=22;
  pg.drawText(winAnsi(`${proc.ref} · ${proc.cliente}`),{x:M,y,size:11,font});y-=15;
  pg.drawText(winAnsi(`Gerado em ${dataBR(Date.now())} por ${nome(ST.me.id)} · versão ${proc.versao||1}`),{x:M,y,size:9,font,color:L.rgb(0.4,0.4,0.45)});y-=22;
  const r=proc.resumo;pg.drawText(winAnsi(`${r.crit} crítico(s) · ${r.warn} atenção · ${r.info} informativo(s) em aberto`),{x:M,y,size:11,font:bold,color:r.crit?cor.crit:L.rgb(0.1,0.5,0.3)});y-=24;
  abertos.forEach((a,k)=>{
    const head=`${k+1}. [${NIVEL_LABEL[a.nivel]}] ${a.titulo}`;const body=wrap(a.descricao,font,9.5,w-2*M-14);const extra=(a.sugestao?["Sugestão: "+a.sugestao]:[]).flatMap(s=>wrap(s,font,9.5,w-2*M-14));
    const need=16+12*(body.length+extra.length)+10; if(y-need<50) nova();
    pg.drawRectangle({x:M,y:y-need+12,width:3,height:need-8,color:cor[a.nivel]});
    wrap(head,bold,10.5,w-2*M-14).forEach(t=>{pg.drawText(t,{x:M+12,y,size:10.5,font:bold});y-=14;});
    body.forEach(t=>{pg.drawText(t,{x:M+12,y,size:9.5,font,color:L.rgb(0.2,0.2,0.25)});y-=12;});
    extra.forEach(t=>{pg.drawText(t,{x:M+12,y,size:9.5,font,color:L.rgb(0.3,0.25,0.6)});y-=12;});
    y-=10;
  });
  if(!abertos.length){pg.drawText("Nenhum apontamento em aberto.",{x:M,y,size:11,font});}
  return await pdf.save();
}

// ---------- roteamento
const ROTAS={painel:"Painel",conferencias:"Conferências",nova:"Nova conferência","icms-uf":"ICMS por UF","icms-ncm":"ICMS/SP por NCM",regras:"Regras de conferência",usuarios:"Usuários e perfis",guia:"Guia do Crivo"};
function rota(){const h=(location.hash||"").slice(1);if(h==="guia"||h.startsWith("guia-"))return {v:"guia",sec:h.slice(5)||null};if(h.startsWith("p-"))return {v:"proc",id:h.slice(2)};return {v:ROTAS[h]?h:"painel"};}
function ir(h){if(location.hash==="#"+h)render();else location.hash=h;}
window.addEventListener("hashchange",()=>{ST.fItem=null;ST.tab="apontamentos";ST.fNivel="todos";ST.fGrupo="todos";ST.abertos={};ST.soDiv=false;ST.itQ="";ST.abriuPrimeiro=false;render();$(".app").classList.remove("open");$("#view").scrollTop=0;});

// ---------- shell
function shell(){
  const nCrit=ST.procs.filter(p=>p.status!=="liberado"&&(p.resumo?.crit||0)>0).length;
  const r=rota();
  const item=(h,i,t,b)=>`<a href="#${h}" class="${(r.v===h||(h==="conferencias"&&r.v==="proc"))?"on":""}" ${r.v===h?'aria-current="page"':""} title="${t}">${ic(i)}<span>${t}</span>${b?`<em class="badge" title="${b} processo(s) bloqueado(s)">${b}</em>`:""}</a>`;
  const escuro=document.documentElement.dataset.tema==="escuro";
  $("#side").innerHTML=`<div class="brand"><div class="mono-jl" title="JL">JL</div><div><b>Crivo</b><small>Conferência pré-DUIMP · ${ST.demo?"Demonstração":"Aduana"}</small></div></div>
  <nav class="nav" aria-label="Menu principal">
    <div class="sec">Operação</div>${item("painel","painel","Painel")}${item("conferencias","lista","Conferências",nCrit||"")}${item("nova","nova","Nova conferência")}
    <div class="sec">Consultas</div>${item("icms-uf","uf","ICMS por UF")}${item("icms-ncm","ncm","ICMS/SP por NCM")}
    <div class="sec">Configuração</div>${item("regras","regras","Regras de conferência")}${podeAdmin()?item("usuarios","users","Usuários e perfis"):""}
    <div class="sec">Ajuda</div>${item("guia","livro","Guia do Crivo")}
  </nav>
  <div class="me"><div class="avatar">${esc(iniciais(nome(ST.me.id)))}</div><div class="who"><b>${esc(ST.me.id?nome(ST.me.id):"Visitante")}</b><span>${esc(ST.owner?"Administrador":ST.papel==="diretoria"?"Diretoria / Sócios":ST.papel==="admin"?"Administrador":"Operacional")}</span></div>
  <button class="sidebtn" id="btnTema" aria-label="${escuro?"Usar tema claro":"Usar tema escuro"}" title="${escuro?"Tema claro":"Tema escuro"}">${ic(escuro?"sol":"lua")}</button>
  <button class="sidebtn" id="btnCollapse" aria-label="Recolher menu" title="Recolher menu">${ic("chev")}</button></div>`;
}
function topo(titulo,extra=""){const r=rota();const aj=r.v!=="guia"?`<a class="btn ghost sm" href="#guia-${AJUDA_DE[r.v]||"inicio"}" title="Abrir o Guia do Crivo nesta parte">${ic("ajuda")}Ajuda</a>`:"";return `<button class="hamb" id="btnHamb" aria-label="Abrir menu">${ic("menu")}</button><div class="crumb">Crivo / <b>${esc(titulo)}</b></div><div class="sp"></div>${extra}${aj}<span class="muted" style="font-size:12px" title="Atalho para buscar conferências"><span class="kbd">/</span> buscar</span><a class="btn pri" href="#nova">${ic("nova")}<span>Nova conferência</span></a>`;}
function render(){
  shell();const r=rota();
  const v=$("#view");
  if(r.v==="proc"){const p=ST.procs.find(x=>x.id===r.id);$("#top").innerHTML=topo(p?p.ref:"Processo");v.innerHTML=p?viewProc(p):(ST.procsLoaded?`<div class="wrap"><div class="card empty">Processo não encontrado. <a href="#conferencias">Voltar às conferências</a></div></div>`:`<div class="wrap"><div class="card empty">Carregando…</div></div>`);if(p){montarProc(p);contar(v);}return;}
  if(r.v==="guia"){$("#top").innerHTML=topo(ROTAS.guia);v.innerHTML=viewGuia(r.sec);montarGuia(r.sec);return;}
  $("#top").innerHTML=topo(ROTAS[r.v]);
  v.innerHTML=({painel:viewPainel,conferencias:viewLista,nova:ST.demo?viewNovaDemo:viewNova,"icms-uf":viewUF,"icms-ncm":viewNCM,regras:viewRegras,usuarios:viewUsuarios}[r.v])();
  if(r.v==="nova") (ST.demo?montarNovaDemo:montarNova)();
  contar(v);
}
function bannerBase(){
  if(ST.demo) return `<div class="banner warn"><b>Demonstração com dados fictícios.</b> Empresas, CNPJs, documentos e valores são inventados. Nada do que você fizer aqui é salvo.</div>`;
  if(ST.local) return `<div class="banner warn">Modo local: a base compartilhada não está disponível nesta visualização. As conferências feitas aqui não ficam salvas para a equipe.</div>`;
  if(!ST.procsLoaded&&ST.loadTimeout) return `<div class="banner warn">A base do Crivo ainda não respondeu. Os dados podem estar desatualizados.</div>`;
  if(!ST.canWrite) return `<div class="banner">Você está em modo leitura: pode consultar as conferências, mas não alterar.</div>`;
  return "";
}

// ---------- Painel
function viewPainel(){
  const P=ST.procs, ab=P.filter(p=>p.status!=="liberado");
  const crit=ab.reduce((a,p)=>a+(p.resumo?.crit||0),0), warn=ab.reduce((a,p)=>a+(p.resumo?.warn||0),0);
  const d30=Date.now()-30*864e5, lib=P.filter(p=>p.status==="liberado"&&p.liberadoEm>d30);
  const comErro=P.filter(p=>(p.achados||[]).some(a=>a.nivel==="crit")).length;
  const taxa=P.length?Math.round(comErro/P.length*100):0;
  const freq={};for(const p of P)for(const a of p.achados||[])if(a.nivel!=="info"){const k=a.regra;freq[k]=freq[k]||{n:0,crit:a.nivel==="crit",t:REGRA[a.regra]?.titulo||a.titulo};freq[k].n++;}
  const top=Object.entries(freq).sort((a,b)=>b[1].n-a[1].n||(b[1].crit-a[1].crit)).slice(0,7), mx=top[0]?.[1].n||1;
  const porAn={};for(const p of P){const k=p.criadoPor||"—";porAn[k]=porAn[k]||{n:0,c:0,l:0};porAn[k].n++;porAn[k].c+=(p.achados||[]).filter(a=>a.nivel==="crit").length;if(p.status==="liberado")porAn[k].l++;}
  const porCli={};for(const p of P){const k=p.cliente||"—";porCli[k]=porCli[k]||{n:0,c:0};porCli[k].n++;porCli[k].c+=(p.achados||[]).filter(a=>a.nivel==="crit").length;}
  resolverNomes(Object.keys(porAn)).then(()=>{});
  const bloq=ab.filter(p=>statusDe(p)==="bloqueado").length;
  const fila=ab.slice().sort((a,b)=>(b.resumo?.crit||0)-(a.resumo?.crit||0)||(b.atualizadoEm-a.atualizadoEm)).slice(0,6);
  const tile=(cls,l,v,s,go,st,fmtv)=>`<button class="tile ${cls}" data-go="${go}" data-st="${st||""}"><div class="l"><span>${l}</span><span class="go">ver ${ic("seta").replace('aria-hidden="true"','aria-hidden="true" style="width:12px;height:12px;vertical-align:-1px;stroke:currentColor;fill:none;stroke-width:2"')}</span></div><div class="v" data-count="${v}" ${fmtv?`data-fmt="${fmtv}"`:""}>${fmtv||v}</div><div class="s">${s}</div></button>`;
  return `<div class="wrap">${bannerBase()}
  <div class="row"><div style="flex:1"><h1>Painel</h1><div class="muted">Situação das conferências antes do registro da DUIMP · clique nos números para abrir a lista</div></div></div>
  <div class="tiles">
    ${tile("","Em conferência",ab.length,`${bloq} bloqueado(s) para registro`,"conferencias","abertos")}
    ${tile("crit","Críticos em aberto",crit,`${warn} ponto(s) de atenção`,"conferencias","bloqueado")}
    ${tile("ok","Liberados em 30 dias",lib.length,`de ${P.length} conferência(s) no total`,"conferencias","liberado")}
    ${tile("warn","Processos com erro crítico",taxa,"erros pegos antes do registro","conferencias","todos",taxa+"%")}
  </div>
  <div class="grid2">
    <section class="card"><header><h2>Fila de conferência</h2><span class="muted" style="font-size:12.5px">mais críticos primeiro</span><div class="sp"></div><a href="#conferencias" class="btn sm ghost">Ver todas ${ic("chevr")}</a></header>
      ${fila.length?`<div class="tbl"><table><thead><tr><th>Processo</th><th>Cliente</th><th class="n">Críticos</th><th class="n">Atenção</th><th>Situação</th></tr></thead><tbody>${fila.map(p=>{const s=STATUS_LBL[statusDe(p)];return `<tr class="click" data-go="p-${p.id}" tabindex="0"><td class="mono">${esc(p.ref)}</td><td>${esc(p.cliente)}</td><td class="n ${p.resumo?.crit?"bad":""}">${p.resumo?.crit||0}</td><td class="n ${p.resumo?.warn?"wn":""}">${p.resumo?.warn||0}</td><td><span class="pill ${s[0]}">${s[1]}</span></td></tr>`;}).join("")}</tbody></table></div>`:`<div class="empty">${ST.procsLoaded||ST.local?"Nenhum processo em conferência. <a href='#nova'>Comece uma nova conferência</a>.":"Carregando conferências…"}</div>`}
    </section>
    <section class="card"><header><h2>Erros mais frequentes</h2></header><div class="body">
      ${top.length?`<div class="bars">${top.map(([k,v])=>`<div class="bar click" data-go="conferencias" data-regra="${esc(k)}" title="Ver processos com: ${esc(v.t)}" style="cursor:pointer"><div class="t"><span>${esc(v.t)}</span><div class="track"><div class="fill ${v.crit?"crit":"warn"}" style="width:${Math.max(6,v.n/mx*100)}%"></div></div></div><b>${v.n}</b></div>`).join("")}</div><div class="legend" style="margin-top:12px"><span><i style="background:var(--crit)"></i>crítico</span><span><i style="background:var(--warn)"></i>atenção</span></div>`:`<div class="muted">Os erros aparecem aqui conforme as conferências forem feitas.</div>`}
    </div></section>
  </div>
  <div class="grid2e">
    <section class="card"><header><h2>Por analista</h2></header>${Object.keys(porAn).length?`<div class="tbl"><table><thead><tr><th>Analista</th><th class="n">Processos</th><th class="n">Críticos</th><th class="n">Liberados</th></tr></thead><tbody>${Object.entries(porAn).map(([k,v])=>`<tr><td>${esc(nome(k))}</td><td class="n">${v.n}</td><td class="n">${v.c}</td><td class="n">${v.l}</td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">Sem dados ainda.</div>`}</section>
    <section class="card"><header><h2>Por cliente</h2></header>${Object.keys(porCli).length?`<div class="tbl"><table><thead><tr><th>Cliente</th><th class="n">Processos</th><th class="n">Críticos</th></tr></thead><tbody>${Object.entries(porCli).sort((a,b)=>b[1].c-a[1].c).slice(0,8).map(([k,v])=>`<tr class="click" data-go="conferencias" data-cli="${esc(k)}"><td>${esc(k)}</td><td class="n">${v.n}</td><td class="n">${v.c}</td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">Sem dados ainda.</div>`}</section>
  </div></div>`;
}

// ---------- Lista
function viewLista(){
  const f=ST.filtro, q=deacc(f.q);
  const passaSt=p=>f.status==="todos"||(f.status==="abertos"?p.status!=="liberado":statusDe(p)===f.status);
  const base=ST.procs.filter(p=>(!q||deacc([p.ref,p.cliente,p.exportador,p.idSigra].join(" ")).includes(q))&&(!f.regra||(p.achados||[]).some(a=>a.regra===f.regra)));
  const cnt=k=>base.filter(p=>k==="todos"||(k==="abertos"?p.status!=="liberado":statusDe(p)===k)).length;
  const sk=ST.sortL;
  const val=(p,k)=>k==="crit"?(p.resumo?.crit||0):k==="warn"?(p.resumo?.warn||0):k==="analista"?nome(p.criadoPor):(p[k]??"");
  const L=base.filter(passaSt).sort((x,y)=>{const a=val(x,sk.k),b=val(y,sk.k);return (typeof a==="number"&&typeof b==="number"?a-b:String(a).localeCompare(String(b),"pt-BR"))*sk.d;});
  const th=(k,t,n)=>`<th class="sort ${n?"n":""} ${sk.k===k?"on":""}" data-sort="${k}" aria-sort="${sk.k===k?(sk.d>0?"ascending":"descending"):"none"}">${t}<span class="ar">${sk.k===k?(sk.d>0?"↑":"↓"):"↕"}</span></th>`;
  return `<div class="wrap">${bannerBase()}<div class="row"><div style="flex:1"><h1>Conferências</h1><div class="muted">${ST.procs.length} processo(s)${f.regra?` · com <b>${esc(REGRA[f.regra]?.titulo||f.regra)}</b> <button class="btn sm ghost" data-limpa="regra">limpar</button>`:""}${f.cli?"":""}</div></div></div>
  <div class="toolbar"><div class="seg" role="tablist" aria-label="Situação">${[["todos","Todas"],["abertos","Em aberto"],["bloqueado","Bloqueados"],["atencao","Atenção"],["pronto","Prontos"],["liberado","Liberados"]].map(([v,t])=>`<button data-fs="${v}" class="${f.status===v?"on":""}">${t}<span class="c ${v==="bloqueado"&&cnt(v)?"crit":""}">${cnt(v)}</span></button>`).join("")}</div><div class="sp"></div>
  <input type="search" id="fq" placeholder="Buscar referência, cliente ou exportador" value="${esc(f.q)}" aria-label="Buscar" style="min-width:280px"></div>
  <section class="card">${L.length?`<div class="tbl"><table><thead><tr>${th("ref","Processo")}${th("cliente","Cliente")}${th("exportador","Exportador")}${th("analista","Analista")}${th("crit","Críticos",1)}${th("warn","Atenção",1)}<th>Situação</th>${th("atualizadoEm","Atualizado")}</tr></thead><tbody>
  ${L.map(p=>{const s=STATUS_LBL[statusDe(p)];return `<tr class="click" data-go="p-${p.id}" tabindex="0"><td class="mono">${esc(p.ref)}</td><td>${esc(p.cliente)}</td><td>${esc(p.exportador||"—")}</td><td>${esc(nome(p.criadoPor))}</td><td class="n ${p.resumo?.crit?"bad":""}">${p.resumo?.crit||0}</td><td class="n">${p.resumo?.warn||0}</td><td><span class="pill ${s[0]}">${s[1]}</span></td><td class="mono muted">${dataBR(p.atualizadoEm)}</td></tr>`;}).join("")}</tbody></table></div>`:`<div class="empty">${ST.procs.length?"Nenhum processo com esse filtro.":"Nenhuma conferência ainda. <a href='#nova'>Comece a primeira</a>."}</div>`}</section></div>`;
}

// ---------- Nova conferência
function viewNova(){
  return `<div class="wrap">${bannerBase()}<div><h1>Nova conferência</h1><div class="muted">Envie os documentos de instrução e o PDF do Sigraweb. O Crivo lê tudo e aponta as divergências antes do registro.</div></div>
  <div class="grid2">
   <section class="card"><header><h2>Arquivos do processo</h2></header><div class="body" style="display:flex;flex-direction:column;gap:14px">
    <label class="f" for="nRef">Referência do processo<input type="text" id="nRef" placeholder="MI-26/0001 (preenchida pelo Sigraweb)"></label>
    <label class="drop" id="drop" for="nFiles">${ic("up")}<b>Arraste os PDFs aqui ou clique para escolher</b><span>BL/AWB, invoice, packing list, certificado de origem e a Conferência DUIMP ou Detalhada do Sigraweb</span></label>
    <input type="file" id="nFiles" accept="application/pdf,.pdf" multiple hidden>
    <div class="check" id="nCheck"></div>
    <div class="files" id="nList"></div>
    <div class="row"><button class="btn pri" id="nGo">${ic("regras")}Conferir processo</button><span class="muted" id="nMsg" role="status"></span></div>
   </div></section>
   <section class="card"><header><h2>Como o Crivo confere</h2></header><div class="body" id="nSteps">
    <div class="steps">${passosHtml()}</div>
    <p class="muted" style="margin:16px 0 0;font-size:12.5px">PDFs do Sigraweb são lidos por regras fixas, campo a campo. BL, invoice, packing e certificado são lidos pelo Claude. Depois, ${REGRAS.length-1} regras comparam documentos × processo e documentos entre si.</p>
   </div></section>
  </div></div>`;
}
function passosHtml(st={}){const P=[["sigra","Ler o PDF do Sigraweb"],["doc_BL","Ler o conhecimento de embarque"],["doc_INV","Ler a invoice"],["doc_PL","Ler o packing list"],["doc_CO","Ler o certificado de origem"],["regras","Cruzar documentos × processo"],["ia","Revisão de descrições pela IA"]];
  return P.map(([k,t])=>{const s=st[k]||{};return `<div class="step ${s.s||""}" data-step="${k}"><i></i><span>${t}${s.m?` · <span class="bad">${esc(s.m)}</span>`:""}</span></div>`;}).join("");}
function montarNova(){
  ST.draft=ST.draft||{arqs:[]};
  const drop=$("#drop"),inp=$("#nFiles");
  const lista=()=>{
    const tem=t=>ST.draft.arqs.some(a=>t.includes(a.tipo));
    $("#nCheck").innerHTML=[["BL",["BL"]],["Invoice",["INV"]],["Packing",["PL"]],["C. origem",["CO"]],["Sigraweb",["SIGRA_DUIMP","SIGRA_DET"]]].map(([t,k])=>`<span class="${tem(k)?"ok":""}">${t}</span>`).join("");
    $("#nList").innerHTML=ST.draft.arqs.map((a,k)=>`<div class="file"><span class="tag ${a.tipo?"":"no"}">${a.tipo?(CURTO[a.tipo]||"Sigraweb"):"?"}</span><span class="nm" title="${esc(a.nome)}">${esc(a.nome)}</span><select data-k="${k}" aria-label="Tipo do documento">${Object.entries(TIPOS).map(([v,t])=>`<option value="${v}" ${a.tipo===v?"selected":""}>${t}</option>`).join("")}<option value="" ${!a.tipo?"selected":""}>Não identificado</option></select><button class="btn sm ghost" data-rm="${k}" aria-label="Remover ${esc(a.nome)}">Remover</button></div>`).join("");
    const sg=ST.draft.arqs.find(a=>a.tipo==="SIGRA_DUIMP"||a.tipo==="SIGRA_DET");
    if(sg&&!$("#nRef").value){try{const S=sg.tipo==="SIGRA_DUIMP"?parseSigraDuimp(sg.pdf):parseSigraDet(sg.pdf);if(S.ref)$("#nRef").value=S.ref;}catch(e){}}};
  const add=async files=>{$("#nMsg").textContent="Lendo arquivos…";for(const f of files){if(!/pdf$/i.test(f.name)&&f.type!=="application/pdf"){toast(`${f.name} não é PDF.`);continue;}try{ST.draft.arqs.push(await lerArquivo(f));}catch(e){toast(`Não consegui abrir ${f.name}.`);}}$("#nMsg").textContent="";lista();};
  inp.onchange=()=>{add([...inp.files]);inp.value="";};
  ["dragover","dragenter"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add("over");}));
  ["dragleave","drop"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove("over");}));
  drop.addEventListener("drop",e=>add([...e.dataTransfer.files]));
  $("#nList").addEventListener("change",e=>{const s=e.target.closest("select[data-k]");if(s){ST.draft.arqs[+s.dataset.k].tipo=s.value||null;lista();}});
  $("#nList").addEventListener("click",e=>{const b=e.target.closest("[data-rm]");if(b){ST.draft.arqs.splice(+b.dataset.rm,1);lista();}});
  $("#nGo").onclick=async()=>{
    const arqs=ST.draft.arqs;
    if(!arqs.some(a=>a.tipo==="SIGRA_DUIMP"||a.tipo==="SIGRA_DET")){$("#nMsg").innerHTML='<span class="bad">Falta o PDF da Conferência DUIMP ou Detalhada do Sigraweb.</span>';return;}
    if(!arqs.some(a=>["BL","INV","PL","CO"].includes(a.tipo))){$("#nMsg").innerHTML='<span class="bad">Envie pelo menos um documento de instrução (BL, invoice ou packing).</span>';return;}
    $("#nGo").setAttribute("aria-disabled","true");$("#nMsg").textContent="Conferindo…";
    const st={};const set=(k,s,m)=>{st[k]={s,m};$("#nSteps .steps").innerHTML=passosHtml(st);};
    for(const k of ["doc_BL","doc_INV","doc_PL","doc_CO"]) if(!arqs.some(a=>"doc_"+a.tipo===k)) st[k]={s:"",m:"não enviado"};
    $("#nSteps .steps").innerHTML=passosHtml(st);
    try{const p=await executarConferencia(arqs,$("#nRef").value.trim(),set);ST.draft=null;ir("p-"+p.id);}
    catch(e){$("#nMsg").innerHTML=`<span class="bad">${esc(e.message||"Não foi possível conferir.")}</span>`;$("#nGo").removeAttribute("aria-disabled");}
  };
  lista();
}

// ---------- Processo
function valsHtml(vs){return vs&&vs.length?`<div class="vals">${vs.map(v=>`<div class="val ${v.diff?"diff":""} ${v.miss&&!v.diff?"miss":""}"><div class="k">${esc(v.k)}</div><div class="v">${esc(v.v)}</div></div>`).join("")}</div>`:"";}
function findHtml(a,k,proc){
  const done=a.status!=="aberto";
  const alvo=ST.fItem&&(a.itens||[]).includes(ST.fItem);
  const open=!!ST.abertos[a.id]||alvo;
  const st=a.status==="justificado"?`<span class="pill neutral">Justificado</span>`:a.status==="corrigido"?`<span class="pill ok">Corrigido</span>`:a.status==="resolvido"?`<span class="pill ok">Resolvido</span>`:`<span class="pill ${a.nivel}">${NIVEL_LABEL[a.nivel]}</span>`;
  return `<article class="find ${a.nivel} ${done?"done":""} ${open?"open":""} ${alvo?"alvo":""}" id="f-${esc(a.id)}" data-fid="${esc(a.id)}" tabindex="-1">
   <div class="hd" data-toggle="${esc(a.id)}" role="button" aria-expanded="${open}" tabindex="0"><svg class="chev" viewBox="0 0 24 24" aria-hidden="true">${ICON.chevr}</svg>${!done?`<span class="num">#${k}</span>`:""}<span class="grp">${esc(a.grupo)}</span>${a.origem==="IA"?'<span class="ia">IA · confirme</span>':""}<h3>${esc(a.titulo)}</h3>${alvo?`<span class="item-tag">Item ${ST.fItem}</span>`:""}${a.itens&&a.itens.length?`<span class="muted mono" style="font-size:12px">${a.itens.length} ite${a.itens.length>1?"ns":"m"}</span>`:""}${st}</div>
   <div class="resumo">${esc(a.descricao)}</div>
   <div class="bd">
   <p>${esc(a.descricao)}</p>${a.nota?`<p class="muted" style="font-size:12.5px">${esc(a.nota)}</p>`:""}
   ${valsHtml(a.valores)}
   ${a.linhas&&a.linhas.length?`<details ${alvo?"open":""}><summary>${a.linhas.length} linha(s) de detalhe</summary><ul>${a.linhas.map(l=>{const hit=alvo&&new RegExp("^Ite(m|ns) "+ST.fItem+"(\\D|$)").test(l);return `<li class="${hit?"hit":""}">${esc(l)}${hit?' <b class="seta-hit">← este item</b>':""}</li>`;}).join("")}</ul></details>`:""}
   ${a.sugestao?`<div class="sug">Sugestão: ${esc(a.sugestao)}</div>`:""}
   ${a.just?`<div class="just"><b>Justificativa:</b> ${esc(a.just)}</div>`:""}
   <div class="ft">${!done&&ST.canWrite?`<button class="btn sm" data-act="corrigir" data-id="${esc(a.id)}" title="Atalho: C">Marcar como corrigido</button><button class="btn sm ghost" data-act="justificar" data-id="${esc(a.id)}">Justificar</button>`:""}
   ${done&&ST.canWrite?`<button class="btn sm ghost" data-act="reabrir" data-id="${esc(a.id)}">Reabrir</button>`:""}
   ${a.locs&&a.locs.length?`<button class="btn sm ghost" data-act="ver" data-id="${esc(a.id)}">${ic("pdf")}Ver no PDF</button>`:""}
   ${a.por&&done?`<span class="who">${esc(nome(a.por))} · ${dataBR(a.em)}</span>`:""}</div></div></article>`;
}
function progHtml(p){
  const t=(p.achados||[]).filter(a=>a.nivel!=="info").length||1, res=(p.achados||[]).filter(a=>a.nivel!=="info"&&a.status!=="aberto").length;
  const r=p.resumo||{};const pct=Math.round(res/t*100);
  return `<div class="prog" title="Apontamentos críticos e de atenção tratados"><div class="t"><span>Conferência tratada</span><b>${pct}%</b></div><div class="track"><i class="ok" style="width:${res/t*100}%"></i><i class="warn" style="width:${(r.warn||0)/t*100}%"></i><i class="crit" style="width:${(r.crit||0)/t*100}%"></i></div><div class="t"><span>${res} de ${t} tratados</span><span>${r.crit||0} crítico(s) em aberto</span></div></div>`;
}
function viewProc(p){
  const s=STATUS_LBL[statusDe(p)], r=p.resumo||{};
  resolverNomes([p.criadoPor,p.liberadoPor,...(p.achados||[]).map(a=>a.por),...(p.log||[]).map(l=>l.por)]).then(()=>{});
  const tabs=[["apontamentos","Apontamentos",(r.crit||0)+(r.warn||0)+(r.info||0)],["itens","Itens",p.itens?.length||0],["documento","Documento",null],["icms","ICMS",null],["historico","Histórico",(p.log||[]).length]];
  const docsChips=["BL","INV","PL","CO"].map(t=>{const d=(p.docsEnviados||[]).find(x=>x.tipo===t);const nc=(p.achados||[]).some(a=>a.status==="aberto"&&a.nivel==="crit"&&(a.valores||[]).some(v=>v.k.startsWith(CURTO[t])));return `<span class="chip" title="${d?esc(d.nome):"Documento não enviado"}"><i class="${!d?"no":nc?"crit":"ok"}"></i>${CURTO[t]}${d?"":" · não enviado"}</span>`;}).join("")+`<span class="chip" title="${esc(p.sigraPdf||"")}"><i class="ac"></i>Sigraweb</span>`;
  const libOk=!r.crit;
  const itOk=(p.itens||[]).filter(i=>!i.flags.length).length;
  return `<div class="wrap">${bannerBase()}
   <div class="phead"><div class="id"><div class="ref">${esc(p.ref)}${p.idSigra?` · Sigraweb ${esc(p.idSigra)}`:""}</div><h1>${esc(p.cliente)}</h1>
    <div class="meta"><span>CNPJ <b class="mono">${esc(p.cnpj||"—")}</b></span><span>UF <b>${esc(p.uf||"—")}</b></span><span>Exportador <b>${esc(p.exportador||"—")}</b></span><span>Conferido por <b>${esc(nome(p.criadoPor))}</b></span><span>Versão <b>${p.versao||1}</b> · ${dataBR(p.atualizadoEm)}</span></div></div>
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-end">
    <div class="actions">
     <button class="btn" data-act="pdf">${ic("pdf")}PDF anotado</button>
     <button class="btn ghost" data-act="copiar">${ic("copy")}Copiar resumo</button>
     ${ST.canWrite?`<button class="btn ghost" data-act="reconf">${ic("refresh")}Reconferir</button>`:""}
     ${ST.canWrite&&p.status!=="liberado"?`<button class="btn ${libOk?"ok":""}" data-act="liberar" ${libOk?"":'aria-disabled="true" title="Corrija ou justifique os críticos para liberar"'}>${ic("lock")}Liberar para registro</button>`:""}
    </div>${progHtml(p)}</div></div>
   ${p.status==="liberado"?`<div class="banner ok">Liberado para registro por ${esc(nome(p.liberadoPor))} em ${dataBR(p.liberadoEm)}.</div>`:""}
   <div class="tiles">
    <button class="tile ${r.crit?"crit":""} ${ST.tab==="apontamentos"&&ST.fNivel==="crit"?"on":""}" data-fn="crit"><div class="l"><span>Críticos em aberto</span><span class="go">filtrar</span></div><div class="v" data-count="${r.crit||0}">${r.crit||0}</div><div class="s">${r.crit?"bloqueiam o registro":"nenhum bloqueio"}</div></button>
    <button class="tile ${r.warn?"warn":""} ${ST.tab==="apontamentos"&&ST.fNivel==="warn"?"on":""}" data-fn="warn"><div class="l"><span>Pontos de atenção</span><span class="go">filtrar</span></div><div class="v" data-count="${r.warn||0}">${r.warn||0}</div><div class="s">${r.info||0} informativo(s)</div></button>
    <button class="tile ok" data-fn="ok"><div class="l"><span>Verificações aprovadas</span><span class="go">ver</span></div><div class="v" data-count="${(p.ok||[]).length}">${(p.ok||[]).length}</div><div class="s">${r.resolvidos||0} apontamento(s) tratados</div></button>
    <button class="tile" data-fn="itens"><div class="l"><span>Itens sem divergência</span><span class="go">ver itens</span></div><div class="v"><span data-count="${itOk}">${itOk}</span><span class="muted" style="font-size:16px"> / ${(p.itens||[]).length}</span></div><div class="s"><span class="pill ${s[0]}">${s[1]}</span></div></button>
   </div>
   <div class="chips">${docsChips}</div>
   <div class="tabs" role="tablist">${tabs.map(([k,t,c])=>`<button role="tab" data-tab="${k}" class="${ST.tab===k?"on":""}" aria-selected="${ST.tab===k}">${t}${c!=null?`<span class="c">${c}</span>`:""}</button>`).join("")}</div>
   <div id="tabBody">${tabBody(p)}</div></div>`;
}
function tabBody(p){
  if(ST.tab==="apontamentos"){
    const todos=abertosOrd(p);const fe=(p.achados||[]).filter(a=>a.status!=="aberto");
    const grupos=[...new Set(todos.map(a=>a.grupo))];
    const ab=todos.filter(a=>(ST.fNivel==="todos"||a.nivel===ST.fNivel)&&(ST.fGrupo==="todos"||a.grupo===ST.fGrupo)&&(!ST.fItem||(a.itens||[]).includes(ST.fItem))).sort((x,y)=>ST.fItem?((y.grupo==="Itens")-(x.grupo==="Itens"))||(((x.itens||[]).length)-((y.itens||[]).length)):0);
    const itRow=ST.fItem?(p.itens||[]).find(i=>i.seq===ST.fItem):null;
    const faixa=ST.fItem?`<div class="alvo-banner" role="status"><div><b>Item ${ST.fItem}</b>${itRow?` · NCM ${esc(itRow.ncm||"—")} · ${esc(itRow.desc||"")} · ${fmt(itRow.qtd,3)} ${esc((itRow.un||"").split(" ")[0])}`:""}<div class="muted" style="font-size:12.5px">Mostrando só ${ab.length===1?"o apontamento":"os "+ab.length+" apontamentos"} deste item. A linha do item está destacada em amarelo.</div></div><div class="row"><button class="btn sm" data-act="voltarItens">Voltar aos itens</button><button class="btn sm ghost" data-act="limparItem">Ver todos os apontamentos</button></div></div>`:"";
    const n=k=>todos.filter(a=>k==="todos"||a.nivel===k).length;
    const num=Object.fromEntries(todos.map((a,k)=>[a.id,k+1]));
    return `${faixa}<div class="toolbar" style="margin-bottom:12px"><div class="seg" aria-label="Nível">${[["todos","Todos"],["crit","Críticos"],["warn","Atenção"],["info","Informativos"]].map(([v,t])=>`<button data-fniv="${v}" class="${ST.fNivel===v?"on":""}">${t}<span class="c ${v!=="todos"?v:""}">${n(v)}</span></button>`).join("")}</div>
      <select id="fGrupo" aria-label="Grupo"><option value="todos">Todos os grupos</option>${grupos.map(g=>`<option ${ST.fGrupo===g?"selected":""}>${esc(g)}</option>`).join("")}</select>
      <div class="sp"></div><span class="muted" style="font-size:12px"><span class="kbd">J</span> <span class="kbd">K</span> navegar · <span class="kbd">Enter</span> abrir · <span class="kbd">C</span> corrigido</span>
      <button class="btn sm ghost" data-act="expandir">Expandir tudo</button><button class="btn sm ghost" data-act="recolher">Recolher</button></div>
    ${ab.length?`<div class="finds">${ab.map(a=>findHtml(a,num[a.id],p)).join("")}</div>`:`<div class="card empty">${todos.length?"Nenhum apontamento com esse filtro.":"Nenhum apontamento em aberto. O processo pode ser liberado."}</div>`}
    ${(p.ok||[]).length?`<section class="card" id="okList" style="margin-top:18px"><header><h2>Verificações aprovadas</h2><span class="muted" style="font-size:12.5px">${p.ok.length}</span></header><div class="body chips">${p.ok.map(o=>`<span class="chip"><i class="ok"></i>${esc(o)}</span>`).join("")}</div></section>`:""}
    ${fe.length?`<h2 style="margin:22px 0 10px">Tratados <span class="muted" style="font-weight:400">· ${fe.length}</span></h2><div class="finds">${fe.map(a=>findHtml(a,0,p)).join("")}</div>`:""}`;
  }
  if(ST.tab==="itens"){
    const q=deacc(ST.itQ);
    const it=(p.itens||[]).filter(i=>(!ST.soDiv||i.flags.length)&&(!q||deacc([i.seq,i.ncm,i.desc].join(" ")).includes(q)));
    const nd=(p.itens||[]).filter(i=>i.flags.length).length;
    return `<div class="toolbar" style="margin-bottom:12px"><label class="switch"><input type="checkbox" id="soDiv" ${ST.soDiv?"checked":""}>Só itens com divergência <b class="mono">${nd}</b></label><div class="sp"></div><input type="search" id="itQ" placeholder="Buscar item, NCM ou produto" value="${esc(ST.itQ)}" aria-label="Buscar item"></div>
    <section class="card"><div class="tbl"><table><thead><tr><th>Item</th><th>NCM</th><th>Produto</th><th class="n">Qtd.</th><th>Un.</th><th class="n">Valor</th><th class="n">Peso líq.</th><th>Conferência</th></tr></thead><tbody>
    ${it.length?it.map(i=>`<tr class="${i.flags.length?"diverge click":""}" ${i.flags.length?`data-item="${i.seq}" title="Abrir o apontamento deste item"`:""}><td class="mono">${i.seq}</td><td class="mono">${esc(i.ncm||"—")}</td><td>${esc(i.desc)}</td><td class="n">${fmt(i.qtd,3)}</td><td>${esc((i.un||"").split(" ")[0])}</td><td class="n">${fmt(i.valor)}</td><td class="n">${fmtKg(i.peso)}</td><td>${i.flags.length?i.flags.map(f=>`<span class="pill crit">${esc(f)}</span>`).join(" "):'<span class="pill ok">Confere</span>'}</td></tr>`).join(""):`<tr><td colspan="8" class="empty">Nenhum item com esse filtro.</td></tr>`}
    </tbody></table></div></section>`;
  }
  if(ST.tab==="documento"){
    const f=ST.files[p.id];
    if(!f) return `<section class="card"><div class="empty">O PDF do Sigraweb fica só no navegador de quem conferiu. Para ver as marcações, abra de novo o arquivo <b>${esc(p.sigraPdf||"do Sigraweb")}</b>.<div style="margin-top:14px"><label class="btn pri" for="reattach">${ic("up")}Abrir PDF do Sigraweb</label><input type="file" id="reattach" accept="application/pdf" hidden></div></div></section>`;
    return `<div class="legend" style="margin-bottom:10px"><span>Passe o mouse sobre uma marcação para ver o apontamento; clique para abri-lo.</span></div><div class="viewer" id="viewer"><div class="muted">Renderizando o PDF…</div></div>`;
  }
  if(ST.tab==="icms"){
    const row=ST.cfg.icms.linhas.find(x=>x.uf===p.uf);
    const ncms=[...new Set((p.itens||[]).map(i=>i.ncm).filter(Boolean))];
    return `<div class="grid2e"><section class="card"><header><h2>Alíquota do estado do importador</h2></header><div class="body">${row?`<dl class="kv"><dt>UF</dt><dd>${row.uf} · ${esc(row.nome)}</dd><dt>Alíquota geral</dt><dd>${fmt(row.aliq)}%</dd><dt>FCP</dt><dd>${row.fcp?fmt(row.fcp)+"%":"—"}</dd><dt>Efetiva</dt><dd>${fmt(row.efetiva)}%</dd>${row.obs?`<dt>Observação</dt><dd style="font-family:var(--body)">${esc(row.obs)}</dd>`:""}</dl><p class="muted" style="font-size:12px;margin:14px 0 0">Tabela atualizada em ${esc(ST.cfg.icms.atualizadoEm)} · <a href="#icms-uf">ver todas as UFs</a></p>`:`<div class="muted">UF do importador não identificada nos documentos.</div>`}</div></section>
    <section class="card"><header><h2>NCMs nas normas de ICMS/SP</h2><div class="sp"></div><a class="btn sm ghost" href="#icms-ncm">Abrir consulta</a></header><div class="body">${p.uf!=="SP"?`<div class="muted">Consulta aplicável só a importadores de SP.</div>`:ncms.map(n=>{const h=ncmSP(n);return `<div style="margin-bottom:14px"><div class="mono" style="font-weight:600">${fmtNcm(n)}</div>${h.length?h.map(x=>`<div style="font-size:12.5px;margin-top:4px"><span class="chip" style="padding:1px 7px;font-size:11.5px"><i style="background:${SECS_SP[x.si]?.cor||"var(--accent)"}"></i>${esc(SECS_SP[x.si]?.tag||x.sec)}</span> <b>${esc(x.ef)}</b> · item ${esc(x.item)} · <span class="muted">${esc(x.d.slice(0,110))}</span>${x.amplo.length?`<div class="muted" style="font-size:12px">O código ${esc(x.amplo.join(", "))} da norma abrange a NCM ${fmtNcm(n)}.</div>`:""}</div>`).join(""):`<div class="muted" style="font-size:12.5px">Não consta nas normas consultadas.</div>`}</div>`;}).join("")+vigHtml(true)}</div></section></div>`;
  }
  if(ST.tab==="historico"){
    return `<section class="card"><div class="tbl"><table><thead><tr><th>Quando</th><th>Quem</th><th>O quê</th></tr></thead><tbody>${(p.log||[]).slice().reverse().map(l=>`<tr><td class="mono muted">${dataBR(l.em)}</td><td>${esc(nome(l.por))}</td><td>${esc(l.acao)}</td></tr>`).join("")}</tbody></table></div></section>`;
  }
  return "";
}
let viewerToken=0;
async function renderViewer(p,focoId){
  const f=ST.files[p.id];const box=$("#viewer");if(!f||!box)return;
  const tk=++viewerToken;
  try{
    const doc=await openPdf(f.bytes);if(tk!==viewerToken)return;
    const abertos=abertosOrd(p);
    const porPag={};abertos.forEach((a,k)=>(a.locs||[]).forEach(l=>{if(l&&l.p<doc.numPages)(porPag[l.p]=porPag[l.p]||[]).push({a,k:k+1,l});}));
    const pags=Object.keys(porPag).map(Number).sort((a,b)=>a-b);
    const mostrar=pags.length?pags:[0];
    box.innerHTML=`<div class="muted" style="align-self:flex-start;font-size:12.5px">Mostrando ${mostrar.length} página(s) com marcações de ${doc.numPages}.</div>`;
    const W=Math.min(860,box.clientWidth-40);
    for(const pi of mostrar){
      const pg=await doc.getPage(pi+1);if(tk!==viewerToken)return;
      const vp1=pg.getViewport({scale:1});const sc=W/vp1.width;const vp=pg.getViewport({scale:sc*(window.devicePixelRatio||1)});
      const wrapEl=document.createElement("div");wrapEl.className="pg";wrapEl.style.width=W+"px";wrapEl.style.height=vp1.height*sc+"px";
      const c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;c.style.width=W+"px";c.style.height=vp1.height*sc+"px";wrapEl.appendChild(c);
      const lbl=document.createElement("div");lbl.className="muted";lbl.style.cssText="align-self:flex-start;font-size:12px";lbl.textContent="Página "+(pi+1);box.appendChild(lbl);box.appendChild(wrapEl);
      await pg.render({canvasContext:c.getContext("2d"),canvas:c,viewport:vp}).promise;
      for(const m of porPag[pi]||[]){const d=document.createElement("div");d.className="mk "+m.a.nivel;d.dataset.id=m.a.id;
        d.style.left=(m.l.x-3)*sc+"px";d.style.top=(vp1.height-m.l.y-m.l.h-2)*sc+"px";d.style.width=(m.l.w+6)*sc+"px";d.style.height=(m.l.h+4)*sc+"px";
        d.innerHTML=`<b>${m.k}</b><span class="tip">#${m.k} · ${esc(m.a.titulo)}</span>`;d.setAttribute("role","button");d.setAttribute("aria-label",`Apontamento ${m.k}: ${m.a.titulo}`);wrapEl.appendChild(d);}
    }
    if(focoId){const el=box.querySelector(`.mk[data-id="${CSS.escape(focoId)}"]`);if(el){el.scrollIntoView({block:"center",behavior:"smooth"});el.classList.add("pulse");}}
  }catch(e){box.innerHTML=`<div class="bad">Não foi possível mostrar o PDF: ${esc(e.message)}</div>`;}
}
function montarProc(p){
  if(!ST.abriuPrimeiro){ST.abriuPrimeiro=true;const f=abertosOrd(p)[0];if(f&&!ST.abertos[f.id]){ST.abertos[f.id]=true;const el=document.getElementById("f-"+f.id);if(el){el.classList.add("open");el.querySelector(".hd").setAttribute("aria-expanded","true");}}}
  if(ST.tab==="documento") renderViewer(p,ST.foco);
  const ra=$("#reattach");if(ra)ra.onchange=async()=>{const fl=ra.files[0];if(!fl)return;const a=await lerArquivo(fl);if(a.tipo!=="SIGRA_DUIMP"&&a.tipo!=="SIGRA_DET"){toast("Esse arquivo não parece ser um PDF de conferência do Sigraweb.");return;}
    const sg=montarSigra([a]);const res=rodarMotor((await lerExtr(p.id))?.docs||{},sg.G);
    const locs=Object.fromEntries(res.achados.map(x=>[x.id,x.locs]));p.achados.forEach(x=>{if(locs[x.id])x.locs=locs[x.id];});
    ST.files[p.id]={bytes:a.bytes,nome:a.nome};render();};
}
const ORD={crit:0,warn:1,info:2};
const abertosOrd=p=>(p.achados||[]).filter(a=>a.status==="aberto").sort((a,b)=>ORD[a.nivel]-ORD[b.nivel]);
const pAtual=()=>{const r=rota();return r.v==="proc"?ST.procs.find(x=>x.id===r.id):null;};
async function acaoAchado(p,id,tipo){
  const a=p.achados.find(x=>x.id===id);if(!a)return;
  const antes=JSON.stringify(a);
  const desfazer=async()=>{Object.keys(a).forEach(k=>delete a[k]);Object.assign(a,JSON.parse(antes));p.resumo=resumoDe(p.achados);p.log=[...(p.log||[]),{em:Date.now(),por:ST.me.id,acao:`Desfez: ${a.titulo}`}];redesenharProc(p);try{await salvarProc(p);}catch(e){}};
  const fim=async(acao,msg)=>{p.resumo=resumoDe(p.achados);p.log=[...(p.log||[]),{em:Date.now(),por:ST.me.id,acao}];
    const prox=abertosOrd(p)[0];if(prox&&tipo!=="reabrir")ST.abertos[prox.id]=true;
    redesenharProc(p);if(msg)toast(msg,5000,{label:"Desfazer",fn:desfazer});try{await salvarProc(p);}catch(e){}};
  if(tipo==="corrigir"){Object.assign(a,{status:"corrigido",por:ST.me.id,em:Date.now()});await fim(`Marcou como corrigido: ${a.titulo}`,`"${a.titulo}" marcado como corrigido.${p.resumo.crit?"":" Nenhum crítico em aberto."}`);}
  if(tipo==="reabrir"){Object.assign(a,{status:"aberto",por:null,em:null,just:null});ST.abertos[a.id]=true;await fim(`Reabriu: ${a.titulo}`);}
  if(tipo==="justificar"){
    modal(`<h2>Justificar apontamento</h2><p class="muted" style="margin:0">${esc(a.titulo)}</p><label class="f" for="jTxt">Por que este ponto não impede o registro?<textarea id="jTxt" placeholder="Ex.: Fabricante confirmado por e-mail do exportador em 10/11; será informado no Catálogo."></textarea></label><span id="jErr" class="bad" style="font-size:13px"></span><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-close>Cancelar</button><button class="btn pri" id="jOk">Salvar justificativa</button></div>`,(m,close)=>{
      const t=$("#jTxt",m);t.focus();t.oninput=()=>$("#jErr",m).textContent="";
      $("#jOk",m).onclick=async()=>{const v=t.value.trim();if(v.length<8){$("#jErr",m).textContent="Escreva a justificativa (pelo menos uma frase curta).";return;}close();Object.assign(a,{status:"justificado",just:v,por:ST.me.id,em:Date.now()});await fim(`Justificou: ${a.titulo}`,`"${a.titulo}" justificado.`);};});
  }
}
function redesenharProc(p){const sc=$("#view").scrollTop;$("#view").innerHTML=viewProc(p);montarProc(p);shell();$("#view").scrollTop=sc;}
function focarFind(dir){const fs=[...document.querySelectorAll(".find[data-fid]")];if(!fs.length)return;let i=fs.findIndex(f=>f.classList.contains("foco"));i=Math.max(0,Math.min(fs.length-1,i<0?0:i+dir));fs.forEach(f=>f.classList.remove("foco"));fs[i].classList.add("foco");fs[i].focus({preventScroll:true});fs[i].scrollIntoView({block:"nearest",behavior:"smooth"});}
function resumoTexto(p){
  const ab=p.achados.filter(a=>a.status==="aberto");const ord={crit:0,warn:1,info:2};ab.sort((a,b)=>ord[a.nivel]-ord[b.nivel]);
  return `CRIVO · ${p.ref} · ${p.cliente}\n${p.resumo.crit} crítico(s), ${p.resumo.warn} atenção, ${p.resumo.info} informativo(s)\n\n`+ab.map((a,k)=>`${k+1}. [${NIVEL_LABEL[a.nivel]}] ${a.titulo}\n   ${a.descricao}${a.sugestao?"\n   Sugestão: "+a.sugestao:""}`).join("\n\n");
}

// ---------- ICMS por UF
function viewUF(){
  const q=deacc(ST.ufQ);const L=ST.cfg.icms.linhas.filter(r=>!q||deacc(r.uf+" "+r.nome).includes(q));
  return `<div class="wrap"><div class="row"><div><h1>ICMS na importação por UF</h1><div class="muted">Atualizado em ${esc(ST.cfg.icms.atualizadoEm)} · fonte: <a href="${esc(ST.cfg.icms.fonte)}" target="_blank" rel="noopener">FazComex</a> · conferido todo mês por tarefa agendada</div></div></div>
  <div class="search"><input type="search" id="ufq" placeholder="Buscar UF ou estado" value="${esc(ST.ufQ)}" aria-label="Buscar UF"></div>
  <section class="card"><div class="tbl"><table><thead><tr><th>UF</th><th>Estado</th><th class="n">Alíquota geral</th><th class="n">FCP</th><th class="n">Efetiva</th><th>Observação</th></tr></thead><tbody>
  ${L.map(r=>`<tr class="${r.uf==="SP"?"hl":""}"><td class="mono">${r.uf}</td><td>${esc(r.nome)}</td><td class="n">${fmt(r.aliq)}%</td><td class="n">${r.fcp?fmt(r.fcp)+"%":"—"}</td><td class="n"><b>${fmt(r.efetiva)}%</b></td><td class="muted" style="font-size:12.5px">${esc(r.obs||"")}</td></tr>`).join("")}
  </tbody></table></div></section><p class="muted" style="font-size:12.5px">A FazComex é uma fonte secundária. Em caso de dúvida, confirme na legislação da SEFAZ do estado.</p></div>`;
}
// ---------- ICMS/SP por NCM
function vigHtml(curto){
  const d=diasVig52(),ate=brDate(NCMSP_INFO.vig52),cls=d<0?"bad":d<=60?"":"ok";
  if(curto) return `<div class="vig ${cls}" style="margin-top:6px;padding:8px 12px"><div class="txt" style="font-size:12.5px">${d<0?`<b>A redução de base do Convênio 52/91 venceu em ${ate}.</b> Confira a prorrogação antes de aplicar a carga reduzida.`:`Redução de base do Conv. 52/91 válida até <b>${ate}</b> (${d} dia${d===1?"":"s"}).`}</div></div>`;
  return `<div class="vig ${cls}"><div class="days">${d<0?"!":d}<small>${d<0?"vencido":d===1?"dia":"dias"}</small></div><div class="txt">${d<0?`<b>A redução de base do Convênio 52/91 venceu em ${ate}.</b> Confira se houve prorrogação no Confaz e no RICMS/SP (Anexo II, art. 12) antes de aplicar a carga reduzida.`:`<b>Redução de base do Convênio 52/91 válida até ${ate}</b> (RICMS/SP, Anexo II, art. 12, §2º).${d<=60?" O prazo está perto do fim: acompanhe a prorrogação no Confaz.":""}`}</div></div>`;
}
function ncmRecentes(){try{return JSON.parse(localStorage.getItem("crivo.ncm")||"[]");}catch(e){return [];}}
function viewNCM(){
  const q=ST.ncmQ.replace(/\D/g,"");const ok=q.length>=4&&q.length<=8;const hs=ok?ncmSP(q):null;
  const rec=ncmRecentes();
  const chips=(rec.length?"Consultas recentes:":"Experimente:")+(rec.length?rec:["84137080","8427","84716052"]).map(r=>`<button type="button" class="chip" data-ncmq="${r}" style="cursor:pointer">${fmtNcm(r)}</button>`).join("");
  let res="";
  if(!q) res=`<div class="card empty">Digite a NCM com 4 a 8 dígitos, com ou sem pontos. O resultado mostra, para cada norma, se a NCM consta, em qual item, com a descrição, o código NCM/SH e o efeito no ICMS.</div>`;
  else if(!ok) res=`<div class="banner warn">A NCM precisa ter de 4 a 8 dígitos. Você digitou ${q.length}.</div>`;
  else{
    const por=SECS_SP.map((s,k)=>hs.filter(h=>h.si===k));
    res=`<div class="row"><div style="flex:1"><span class="mono" style="font-size:22px;font-weight:600">${fmtNcm(q)}</span> <span class="muted">${hs.length?`${hs.length} ocorrência(s) encontrada(s)`:"Não consta em nenhuma das normas consultadas"}</span></div><button class="btn sm" data-act="copiarNcm">${ic("copy")}Copiar resultado</button></div>
    <div class="tiles">${SECS_SP.map((s,k)=>`<button class="tile ${por[k].length?"ok":""}" data-ncmsec="${k}"><div class="l"><span style="color:${s.cor};font-weight:600">${s.tag}</span><span class="go">ver</span></div><div class="v" style="font-size:20px">${por[k].length?`Consta · ${por[k].length}`:"Não consta"}</div><div class="s">${por[k].length?`<b>${s.ef}</b>`:esc(s.s)}</div></button>`).join("")}</div>
    ${SECS_SP.map((s,k)=>{const L=por[k];const grupos=[];for(const x of L){const g=grupos.at(-1);if(g&&g.a===x.anexo)g.rows.push(x);else grupos.push({a:x.anexo,rows:[x]});}
      return `<section class="card" id="ncmsec${k}"><header><div style="flex:1"><h2><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${s.cor};margin-right:8px"></i>${esc(s.t)}</h2><div class="muted" style="font-size:12.5px">${esc(s.s)}</div></div>${L.length?`<span class="pill ok">${esc(s.ef)}</span>`:`<span class="pill neutral">Não consta</span>`}<a class="btn sm ghost" href="${s.link}" target="_blank" rel="noopener">${esc(s.lt)} ↗</a>${s.conv?`<a class="btn sm ghost" href="${LINKS_SP.art12}" target="_blank" rel="noopener">RICMS art. 12 ↗</a>`:""}</header>
      ${L.length?grupos.map(g=>`${s.a===""&&g.a?`<div class="muted" style="padding:10px 18px 0;font-size:12px;text-transform:uppercase;letter-spacing:.05em">${esc(g.a)}</div>`:""}<div class="tbl"><table><thead><tr><th>Item</th><th>Descrição</th><th>NCM/SH</th></tr></thead><tbody>${g.rows.map(x=>`<tr><td class="mono">${esc(x.item)}</td><td>${esc(x.d)}${x.g?`<div class="muted" style="font-size:12px">Grupo: ${esc(x.g)}</div>`:""}${x.amplo.map(c=>`<div style="font-size:12px;color:var(--warn)">O código ${esc(c)} da norma abrange a NCM ${fmtNcm(q)}.</div>`).join("")}</td><td class="mono">${x.n.map(n=>x.m.has(n)?`<mark style="background:var(--warn-bg);color:var(--text);padding:0 3px;border-radius:3px">${esc(n)}</mark>`:esc(n)).join("<br>")}</td></tr>`).join("")}</tbody></table></div>`).join(""):`<div class="empty" style="padding:16px">Nenhuma ocorrência nesta norma.</div>`}</section>`;}).join("")}`;
  }
  return `<div class="wrap"><div class="row"><div style="flex:1"><h1>ICMS/SP por NCM</h1><div class="muted">Resolução SF 4/1998 · Resolução SF 31/2008 · Convênio ICMS 52/91 · dados conferidos em ${NCMSP_INFO.dadosEm} · para importadores de SP</div></div></div>
  ${vigHtml()}
  <section class="card"><div class="body" style="display:flex;flex-direction:column;gap:10px">
   <form class="search" id="ncmF"><input type="search" id="ncmq" placeholder="Ex.: 8413.70.80" value="${esc(ST.ncmQ)}" aria-label="NCM" inputmode="numeric" style="font:600 18px var(--mono);letter-spacing:.04em;padding:12px 14px"><button class="btn pri" type="submit">Consultar</button>${ST.ncmQ?`<button class="btn ghost" type="button" data-act="limparNcm">Limpar</button>`:""}</form>
   <div class="row muted" style="font-size:12.5px">${chips}</div></div></section>
  ${res}
  <section class="card"><header><h2>Normas consultadas</h2></header><div class="body grid2e" style="gap:16px">
   <div><h3>Resolução SF 4/1998</h3><p class="muted" style="margin:4px 0">Máquinas, aparelhos e equipamentos industriais (Anexo I) e máquinas e implementos agrícolas (Anexo II).</p><dl class="kv"><dt>Efeito</dt><dd style="font-family:var(--body)">Alíquota de 12% (RICMS/SP, art. 54)</dd><dt>Itens</dt><dd>187 + 31</dd><dt>Última alteração</dt><dd style="font-family:var(--body)">Res. SF 126/2018</dd></dl></div>
   <div><h3>Resolução SF 31/2008</h3><p class="muted" style="margin:4px 0">Produtos da indústria de processamento eletrônico de dados (art. 54, V, do RICMS/SP). Revogou o Anexo III da SF 4/1998.</p><dl class="kv"><dt>Efeito</dt><dd style="font-family:var(--body)">Alíquota de 12%</dd><dt>Itens</dt><dd>106 (Anexo Único)</dd><dt>Última alteração</dt><dd style="font-family:var(--body)">Res. SF 3/2018</dd></dl></div>
   <div><h3>Convênio ICMS 52/91</h3><p class="muted" style="margin:4px 0">Redução da base de cálculo para máquinas industriais (Anexo I) e agrícolas (Anexo II). Em SP: RICMS, Anexo II, art. 12.</p><dl class="kv"><dt>Efeito</dt><dd style="font-family:var(--body)">Carga de 8,80% / 5,60% (internas)</dd><dt>Vigência</dt><dd style="font-family:var(--body)">até ${brDate(NCMSP_INFO.vig52)}</dd><dt>Prorrogação</dt><dd style="font-family:var(--body)">${NCMSP_INFO.prorrog}</dd></dl></div>
   <div><h3>Carga final · Convênio 52/91</h3><table class="gtab"><tbody><tr><td class="muted">Operação</td><td class="muted">Anexo I</td><td class="muted">Anexo II</td></tr><tr><td>Internas em SP e interestaduais para consumidor final não contribuinte</td><td class="mono">8,80%</td><td class="mono">5,60%</td></tr><tr><td>Interestaduais para S e SE (exceto ES) · 12%</td><td class="mono">8,80%</td><td class="mono">7,00%</td></tr><tr><td>Interestaduais para N, NE, CO e ES · 7%</td><td class="mono">5,14%</td><td class="mono">4,10%</td></tr></tbody></table>
   <p class="muted" style="font-size:12.5px;margin:6px 0 0">Não pode ser somada a outro benefício (art. 12, §1º). Não se exige estorno proporcional do crédito (art. 12, §4º, Decreto 70.674/2026).</p></div>
  </div></section>
  <p class="muted" style="font-size:12.5px">Relação de itens conferida a partir do texto das normas atualizado até ${NCMSP_INFO.dadosEm}. Códigos genéricos da norma (ex.: 8427) também valem quando abrangem a NCM digitada. A consulta apoia a análise e não substitui a leitura da legislação vigente.</p>
  </div>`;
}
function textoNcm(q){const hs=ncmSP(q);const L=[`Consulta NCM ${fmtNcm(q)} · ICMS/SP`,""];
  SECS_SP.forEach((s,k)=>{const xs=hs.filter(h=>h.si===k);L.push(`${s.t} (${s.s}): ${xs.length?"CONSTA · "+s.ef:"não consta"}`);for(const x of xs)L.push(`  Item ${x.item} | ${x.d} | ${x.n.join(", ")}`);});
  L.push("",`Redução de base do Convênio 52/91 válida até ${brDate(NCMSP_INFO.vig52)} (RICMS/SP, Anexo II, art. 12).`);return L.join("\n");}
// ---------- Regras
function viewRegras(){
  const ad=podeAdmin()&&ST.canWrite, n=ST.cfg.regras.niveis||{};
  const grupos={};for(const r of REGRAS){if(r[0]==="ia")continue;(grupos[r[1]]=grupos[r[1]]||[]).push(r);}
  return `<div class="wrap"><div><h1>Regras de conferência</h1><div class="muted">${ad?"Ajuste o nível de cada regra. Críticos bloqueiam a liberação para registro.":"Só o administrador altera os níveis."}</div></div>
  <section class="card"><header><h2>Tolerâncias</h2></header><div class="body row">
   <label class="f" for="tolPeso">Diferença de peso aceita (kg)<input type="text" id="tolPeso" value="${ST.cfg.regras.tolPeso??0}" ${ad?"":"disabled"} inputmode="decimal" style="width:140px"></label>
   <label class="f" for="tolValor">Diferença de valor aceita<input type="text" id="tolValor" value="${ST.cfg.regras.tolValor??0.01}" ${ad?"":"disabled"} inputmode="decimal" style="width:140px"></label>
   ${ad?`<button class="btn" data-act="salvarTol" style="align-self:flex-end">Salvar tolerâncias</button>`:""}</div></section>
  ${Object.entries(grupos).map(([g,rs])=>`<section class="card"><header><h2>${esc(g)}</h2></header><div class="tbl"><table><tbody>${rs.map(r=>{const cur=n[r[0]]||r[3];return `<tr><td>${esc(r[2])}</td><td style="width:200px">${ad?`<select data-regra="${r[0]}" aria-label="Nível de ${esc(r[2])}">${["crit","warn","info"].map(v=>`<option value="${v}" ${cur===v?"selected":""}>${NIVEL_LABEL[v]}</option>`).join("")}</select>`:`<span class="pill ${cur}">${NIVEL_LABEL[cur]}</span>`}</td></tr>`;}).join("")}</tbody></table></div></section>`).join("")}</div>`;
}
// ---------- Usuários
function viewUsuarios(){
  if(!podeAdmin()) return `<div class="wrap"><div class="card empty">Só o administrador acessa esta página.</div></div>`;
  const ids=[...new Set([...Object.keys(ST.cfg.papeis),...ST.procs.map(p=>p.criadoPor).filter(Boolean)])].filter(i=>i!==ST.me.id);
  resolverNomes(ids).then(()=>{});
  return `<div class="wrap"><div><h1>Usuários e perfis</h1><div class="muted">Quem entra no Crivo é identificado pela conta Claude. Defina o perfil de cada pessoa.</div></div>
  <section class="card"><header><h2>Perfis</h2></header><div class="body"><dl class="kv"><dt>Administrador</dt><dd style="font-family:var(--body)">Dono do sistema. Altera regras e perfis.</dd><dt>Diretoria / Sócios</dt><dd style="font-family:var(--body)">Vê o painel e todas as conferências.</dd><dt>Operacional</dt><dd style="font-family:var(--body)">Faz conferências e trata apontamentos.</dd></dl></div></section>
  <section class="card"><header><h2>Pessoas</h2><div class="sp"></div>${ST.user&&ST.user.search?`<input type="search" id="uBusca" placeholder="Adicionar pessoa da empresa" aria-label="Buscar pessoa">`:""}</header><div id="uRes"></div>
  <div class="tbl"><table><tbody><tr><td>${esc(nome(ST.me.id))} <span class="muted">(você)</span></td><td><span class="pill info">Administrador</span></td></tr>
  ${ids.map(i=>`<tr><td>${esc(nome(i))}</td><td style="width:220px"><select data-papel="${esc(i)}" aria-label="Perfil">${[["operacional","Operacional"],["diretoria","Diretoria / Sócios"],["admin","Administrador"]].map(([v,t])=>`<option value="${v}" ${(ST.cfg.papeis[i]||"operacional")===v?"selected":""}>${t}</option>`).join("")}</select></td></tr>`).join("")}
  </tbody></table></div>${ids.length?"":`<div class="empty">Quando colegas usarem o Crivo, eles aparecem aqui. Com o plano Team, a busca acima lista toda a empresa.</div>`}</section></div>`;
}

// ---------- eventos globais
document.addEventListener("click",async e=>{
  const go=e.target.closest("[data-go]");if(go){
    if(go.dataset.st!==undefined&&go.dataset.st!==""){ST.filtro.status=go.dataset.st;ST.filtro.regra=null;}
    if(go.dataset.regra){ST.filtro.regra=go.dataset.regra;ST.filtro.status="todos";}
    if(go.dataset.cli){ST.filtro.q=go.dataset.cli;ST.filtro.status="todos";}
    ir(go.dataset.go);return;}
  if(e.target.closest("#btnTema")){aplicarTema(document.documentElement.dataset.tema==="escuro"?"claro":"escuro");shell();return;}
  const tg=e.target.closest("[data-toggle]");if(tg&&!e.target.closest("button,a")){const id=tg.dataset.toggle;ST.abertos[id]=!ST.abertos[id];const el=tg.closest(".find");el.classList.toggle("open",ST.abertos[id]);tg.setAttribute("aria-expanded",ST.abertos[id]);return;}
  const mk=e.target.closest(".mk[data-id]");if(mk){const p=pAtual();if(p){ST.tab="apontamentos";ST.fNivel="todos";ST.fGrupo="todos";ST.abertos[mk.dataset.id]=true;redesenharProc(p);const el=document.getElementById("f-"+mk.dataset.id);if(el){el.scrollIntoView({block:"center",behavior:"smooth"});el.classList.add("foco");}}return;}
  const nq=e.target.closest("[data-ncmq]");if(nq){consultarNcm(fmtNcm(nq.dataset.ncmq));return;}
  const ns=e.target.closest("[data-ncmsec]");if(ns){const el=document.getElementById("ncmsec"+ns.dataset.ncmsec);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});return;}
  const fs=e.target.closest("[data-fs]");if(fs){ST.filtro.status=fs.dataset.fs;render();return;}
  const so=e.target.closest("th[data-sort]");if(so){const k=so.dataset.sort;ST.sortL=ST.sortL.k===k?{k,d:-ST.sortL.d}:{k,d:["crit","warn","atualizadoEm"].includes(k)?-1:1};render();return;}
  const lm=e.target.closest("[data-limpa]");if(lm){ST.filtro[lm.dataset.limpa]=null;render();return;}
  const fn=e.target.closest("[data-fn]");if(fn){const p=pAtual();if(!p)return;const v=fn.dataset.fn;
    if(v==="itens"){ST.tab="itens";ST.soDiv=false;}else if(v==="ok"){ST.tab="apontamentos";ST.fNivel="todos";redesenharProc(p);const ol=$("#okList");if(ol)ol.scrollIntoView({behavior:"smooth",block:"center"});return;}
    else{ST.tab="apontamentos";ST.fNivel=ST.fNivel===v?"todos":v;}
    redesenharProc(p);return;}
  const fv=e.target.closest("[data-fniv]");if(fv){const p=pAtual();ST.fNivel=fv.dataset.fniv;if(p)redesenharProc(p);return;}
  const ir2=e.target.closest("tr[data-item]");if(ir2){const p=pAtual();if(!p)return;const seq=+ir2.dataset.item;const alvo=abertosOrd(p).filter(a=>(a.itens||[]).includes(seq)).sort((x,y)=>(y.grupo==="Itens")-(x.grupo==="Itens"));
    ST.tab="apontamentos";ST.fNivel="todos";ST.fGrupo="todos";ST.fItem=seq;redesenharProc(p);$("#view").scrollTop=0;const ban=$(".alvo-banner");if(ban)ban.scrollIntoView({block:"start",behavior:"smooth"});return;}
  if(e.target.closest("#btnCollapse")){$(".app").classList.toggle("collapsed");try{localStorage.setItem("crivo.col",$(".app").classList.contains("collapsed")?"1":"0");}catch(x){}return;}
  if(e.target.closest("#btnHamb")){$(".app").classList.toggle("open");return;}
  const tb=e.target.closest("[data-tab]");if(tb){ST.fItem=null;ST.tab=tb.dataset.tab;ST.foco=null;const p=pAtual();if(p){redesenharProc(p);}return;}
  const b=e.target.closest("[data-act]");if(!b)return;
  const act=b.dataset.act, p=pAtual();
  if(["corrigir","reabrir","justificar"].includes(act)&&p){await acaoAchado(p,b.dataset.id,act);return;}
  if(act==="copiarNcm"){const q=ST.ncmQ.replace(/\D/g,"");try{await navigator.clipboard.writeText(textoNcm(q));toast("Resultado copiado.");}catch(x){modal(`<h2>Resultado</h2><textarea style="min-height:260px" readonly>${esc(textoNcm(q))}</textarea><div class="row" style="justify-content:flex-end"><button class="btn" data-close>Fechar</button></div>`);}return;}
  if(act==="limparNcm"){ST.ncmQ="";render();const n=$("#ncmq");if(n)n.focus();return;}
  if(act==="limparItem"&&p){ST.fItem=null;redesenharProc(p);return;}
  if(act==="voltarItens"&&p){const s=ST.fItem;ST.fItem=null;ST.tab="itens";redesenharProc(p);const r=document.querySelector(`tr[data-item="${s}"]`);if(r){r.scrollIntoView({block:"center",behavior:"smooth"});r.classList.add("flash");}return;}
  if(act==="expandir"&&p){abertosOrd(p).forEach(x=>ST.abertos[x.id]=true);document.querySelectorAll(".find").forEach(f=>{if(f.dataset.fid&&ST.abertos[f.dataset.fid]){f.classList.add("open");}});return;}
  if(act==="recolher"&&p){ST.abertos={};document.querySelectorAll(".find.open").forEach(f=>f.classList.remove("open"));return;}
  if(act==="ver"&&p){ST.tab="documento";ST.foco=b.dataset.id;$("#view").innerHTML=viewProc(p);montarProc(p);return;}
  if(act==="copiar"&&p){try{await navigator.clipboard.writeText(resumoTexto(p));toast("Resumo copiado. Cole no e-mail ou no WhatsApp.");}catch(x){modal(`<h2>Resumo</h2><textarea style="min-height:260px" readonly>${esc(resumoTexto(p))}</textarea><div class="row" style="justify-content:flex-end"><button class="btn" data-close>Fechar</button></div>`);}return;}
  if(act==="pdf"&&p){
    if(!ST.files[p.id]){ST.tab="documento";render();toast("Envie de novo o PDF do Sigraweb para gerar o PDF anotado.");return;}
    if(!ST.downloads){toast("O download não está disponível nesta visualização.");return;}
    try{b.setAttribute("aria-disabled","true");const bytes=await gerarPdfAnotado(p);await ST.downloads.save({filename:`Crivo_${String(p.ref).replace(/[^\w-]+/g,"-")}_v${p.versao||1}.pdf`,data:new Blob([bytes])});}
    catch(x){if(x&&x.code==="declined"){}else toast(x.message||"Não foi possível gerar o PDF.");}finally{b.removeAttribute("aria-disabled");}return;}
  if(act==="liberar"&&p){
    if(p.resumo.crit){toast(`Ainda há ${p.resumo.crit} crítico(s) em aberto. Corrija ou justifique antes de liberar.`);ST.tab="apontamentos";render();return;}
    modal(`<h2>Liberar para registro</h2><p class="muted" style="margin:0">${esc(p.ref)} · ${esc(p.cliente)}</p><p style="margin:0">${p.resumo.warn?`Há ${p.resumo.warn} ponto(s) de atenção em aberto. `:""}Ao liberar, fica registrado que você conferiu este processo.</p><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-close>Cancelar</button><button class="btn ok" id="lOk">Liberar</button></div>`,(m,close)=>{$("#lOk",m).onclick=async()=>{close();Object.assign(p,{status:"liberado",liberadoPor:ST.me.id,liberadoEm:Date.now()});p.log=[...(p.log||[]),{em:Date.now(),por:ST.me.id,acao:"Liberou para registro"}];render();try{await salvarProc(p);toast("Processo liberado para registro.");}catch(x){}};});return;}
  if(act==="reconf"&&p&&ST.demo){toast("Na versão da empresa, aqui se envia o PDF corrigido do Sigraweb e o Crivo confere de novo, mantendo as justificativas.",6000);return;}
  if(act==="reconf"&&p){
    modal(`<h2>Reconferir processo</h2><p class="muted" style="margin:0">Envie o PDF atualizado do Sigraweb depois das correções. Se chegou documento novo (ex.: certificado de origem ou BL definitivo), envie junto.</p><label class="drop" for="rcF"><b>Escolher PDFs</b><span>O que já foi justificado continua justificado.</span></label><input type="file" id="rcF" accept="application/pdf" multiple hidden><div id="rcMsg" class="muted" role="status"></div><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-close>Cancelar</button></div>`,(m,close)=>{
      $("#rcF",m).onchange=async ev=>{const fs=[...ev.target.files];if(!fs.length)return;$("#rcMsg",m).textContent="Lendo e conferindo…";
        try{const arqs=[];for(const f of fs)arqs.push(await lerArquivo(f));await reconferir(p,arqs);close();ST.tab="apontamentos";render();toast(`Reconferência concluída: ${p.resumo.crit} crítico(s) em aberto.`);}
        catch(x){$("#rcMsg",m).innerHTML=`<span class="bad">${esc(x.message||"Falhou.")}</span>`;}};});return;}
  if(act==="salvarTol"){const tp=parseFloat(($("#tolPeso").value||"0").replace(",",".")),tv=parseFloat(($("#tolValor").value||"0.01").replace(",","."));if(isNaN(tp)||isNaN(tv)||tp<0||tv<0){toast("Use números positivos nas tolerâncias.");return;}ST.cfg.regras={...ST.cfg.regras,tolPeso:tp,tolValor:tv};try{await salvarDoc("config/regras",ST.cfg.regras);toast("Tolerâncias salvas.");}catch(x){}return;}
});
document.addEventListener("change",async e=>{
  const s=e.target;
  if(s.id==="fGrupo"){ST.fGrupo=s.value;const p=pAtual();if(p)redesenharProc(p);}
  if(s.id==="soDiv"){ST.soDiv=s.checked;const p=pAtual();if(p)redesenharProc(p);}
  if(s.dataset.regra){ST.cfg.regras={...ST.cfg.regras,niveis:{...(ST.cfg.regras.niveis||{}),[s.dataset.regra]:s.value}};try{await salvarDoc("config/regras",ST.cfg.regras);toast("Nível atualizado. Vale para as próximas conferências e reconferências.");}catch(x){}}
  if(s.dataset.papel){ST.cfg.papeis={...ST.cfg.papeis,[s.dataset.papel]:s.value};try{await salvarDoc("config/usuarios",{papeis:ST.cfg.papeis});toast("Perfil atualizado.");}catch(x){}}
});
let tq;document.addEventListener("input",e=>{
  const s=e.target;
  if(s.id==="fq"){ST.filtro.q=s.value;clearTimeout(tq);tq=setTimeout(()=>{const pos=s.selectionStart;render();const n=$("#fq");n.focus();n.setSelectionRange(pos,pos);},200);}
  if(s.id==="itQ"){ST.itQ=s.value;clearTimeout(tq);tq=setTimeout(()=>{const p=pAtual();if(!p)return;const pos=s.selectionStart;redesenharProc(p);const n=$("#itQ");n.focus();n.setSelectionRange(pos,pos);},180);}
  if(s.id==="guiaQ"){ST.guiaQ=s.value;clearTimeout(tq);tq=setTimeout(()=>{const pos=s.selectionStart;render();const n=$("#guiaQ");n.focus();n.setSelectionRange(pos,pos);},180);}
  if(s.id==="ufq"){ST.ufQ=s.value;clearTimeout(tq);tq=setTimeout(()=>{const pos=s.selectionStart;render();const n=$("#ufq");n.focus();n.setSelectionRange(pos,pos);},150);}
  if(s.id==="uBusca"&&ST.user&&ST.user.search){clearTimeout(tq);tq=setTimeout(async()=>{let hits=[];try{hits=await ST.user.search(s.value)||[];}catch(x){}const box=$("#uRes");if(!box)return;
    box.innerHTML=hits.slice(0,8).map(h=>`<div class="row" style="padding:8px 18px;border-bottom:1px solid var(--line)"><span style="flex:1"></span><button class="btn sm" data-addu="${esc(h.id)}">Adicionar</button></div>`).join("");
    box.querySelectorAll("[data-addu]").forEach((btn,k)=>{btn.parentElement.firstElementChild.textContent=hits[k].name||"Colega";btn.onclick=async()=>{ST.names[hits[k].id]=hits[k].name||"";ST.cfg.papeis={...ST.cfg.papeis,[hits[k].id]:ST.cfg.papeis[hits[k].id]||"operacional"};try{await salvarDoc("config/usuarios",{papeis:ST.cfg.papeis});}catch(x){}render();};});},250);}
});
document.addEventListener("focusin",e=>{if(e.target.id==="uBusca"&&ST.user&&ST.user.search){e.target.dispatchEvent(new Event("input",{bubbles:true}));}});
document.addEventListener("keydown",e=>{
  const tag=(e.target.tagName||"").toLowerCase();const digitando=["input","textarea","select"].includes(tag);
  if(e.key==="Escape"){const s=document.querySelector(".scrim");if(s)s.remove();return;}
  if(digitando||e.metaKey||e.ctrlKey||e.altKey||document.querySelector(".scrim"))return;
  if(e.key==="/"){e.preventDefault();if(rota().v!=="conferencias")ir("conferencias");setTimeout(()=>{const f=$("#fq");if(f)f.focus();},60);return;}
  if(rota().v!=="proc"||ST.tab!=="apontamentos")return;
  if(e.key==="j"||e.key==="ArrowDown"&&e.target.closest&&e.target.closest(".find")){e.preventDefault();focarFind(1);}
  else if(e.key==="k"||e.key==="ArrowUp"&&e.target.closest&&e.target.closest(".find")){e.preventDefault();focarFind(-1);}
  else if(e.key==="Enter"){const f=document.querySelector(".find.foco")||e.target.closest&&e.target.closest(".find");if(f){e.preventDefault();const id=f.dataset.fid;ST.abertos[id]=!ST.abertos[id];f.classList.toggle("open",ST.abertos[id]);}}
  else if(e.key==="c"){const f=document.querySelector(".find.foco");const p=pAtual();if(f&&p&&ST.canWrite){const a2=p.achados.find(x=>x.id===f.dataset.fid);if(a2&&a2.status==="aberto")acaoAchado(p,a2.id,"corrigir");}}
});
function consultarNcm(v){const q=v.replace(/\D/g,"");ST.ncmQ=(q.length>=4&&q.length<=8)?fmtNcm(q):v;if(q.length>=4&&q.length<=8){try{const r=[q,...ncmRecentes().filter(x=>x!==q)].slice(0,8);localStorage.setItem("crivo.ncm",JSON.stringify(r));}catch(e){}}render();const n=$("#ncmq");if(n){n.focus();n.select();}}
document.addEventListener("submit",e=>{if(e.target.id==="ncmF"){e.preventDefault();consultarNcm($("#ncmq").value);}});

// ---------- inicialização
async function iniciar(){
  try{if(localStorage.getItem("crivo.col")==="1")$(".app").classList.add("collapsed");}catch(e){}
  let tema="claro";try{tema=localStorage.getItem("crivo.tema")||"claro";}catch(e){}aplicarTema(tema);
  if(typeof CRIVO_DEMO!=="undefined"&&CRIVO_DEMO) return demoIniciar();
  render();
  if(!window.claude||!window.claude.use){ST.local=true;ST.procsLoaded=true;render();return;}
  const [db,user,sample,downloads]=await Promise.all(["db","user","sample","downloads"].map(n=>window.claude.use(n).catch(()=>null)));
  Object.assign(ST,{db,user,sample,downloads});
  if(user){try{ST.owner=!!(await user.isOwner());}catch(e){}try{ST.me.id=await user.id();}catch(e){}try{const me=await user.me();if(me){ST.me.id=ST.me.id||me.id;ST.me.name=me.name||"";if(me.name)ST.names[me.id]=me.name;}}catch(e){}
    try{const c=await user.can("data.write");if(c===false)ST.canWrite=false;}catch(e){}}
  if(!db){ST.local=true;ST.procsLoaded=true;render();return;}
  const tm=setTimeout(()=>{ST.loadTimeout=true;render();},10000);
  db.collection("processos").orderBy("atualizadoEm","desc").limit(500).onSnapshot(snap=>{
    if(!snap.metadata.fromCache){clearTimeout(tm);ST.loadTimeout=false;}
    ST.procs=snap.docs.map(d=>({...JSON.parse(JSON.stringify(d.data())),id:d.id}));ST.procsLoaded=true;
    const r=rota();
    if(document.activeElement&&/^(fq|ufq|ncmq|jTxt|uBusca|tolPeso|tolValor|nRef|itQ|guiaQ)$/.test(document.activeElement.id))return;
    if(document.querySelector(".scrim"))return;
    if(r.v==="nova"||r.v==="guia")return;
    if(r.v==="proc"&&ST.tab==="documento"&&$("#viewer .pg")){shell();return;}
    render();
  },err=>{clearTimeout(tm);ST.procsLoaded=true;if(err&&err.code==="revoked"){ST.local=true;}render();});
  db.doc("config/icmsUF").onSnapshot(s=>{if(s.exists){const d=s.data();if(d&&Array.isArray(d.linhas)&&d.linhas.length){ST.cfg.icms=JSON.parse(JSON.stringify(d));const r=rota().v;if(r==="icms-uf")render();}}},()=>{});
  db.doc("config/regras").onSnapshot(s=>{if(s.exists)ST.cfg.regras={niveis:{},tolPeso:0,tolValor:0.01,...JSON.parse(JSON.stringify(s.data()))};},()=>{});
  db.doc("config/usuarios").onSnapshot(s=>{if(s.exists){ST.cfg.papeis=JSON.parse(JSON.stringify(s.data().papeis||{}));ST.papel=ST.owner?"admin":(ST.cfg.papeis[ST.me.id]||"operacional");shell();}},()=>{});
  if(ST.owner)ST.papel="admin";
  render();
}
iniciar();
