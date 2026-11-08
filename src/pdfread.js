// ===== Leitura de PDF (pdf.js) e parsers do Sigraweb =====
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function getPdfjs(){
  for(let i=0;i<120&&!window.pdfjsLib;i++) await sleep(100);
  const lib=window.pdfjsLib;
  if(!lib) throw new Error("O leitor de PDF não carregou. Recarregue a página.");
  try{ if(!lib.GlobalWorkerOptions.workerSrc) lib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER_URL; }catch(e){}
  return lib;
}
async function openPdf(bytes){
  const lib=await getPdfjs();
  return lib.getDocument({data:bytes.slice(0),isEvalSupported:false}).promise;
}
async function readPdf(bytes){
  const doc=await openPdf(bytes);
  const pages=[];
  for(let p=1;p<=doc.numPages;p++){
    const pg=await doc.getPage(p); const vp=pg.getViewport({scale:1});
    const tc=await pg.getTextContent();
    const its=tc.items.filter(i=>i.str&&i.str.trim()).map(i=>({s:i.str,x:i.transform[4],y:i.transform[5],w:i.width,h:Math.abs(i.transform[3])||i.height||8}));
    its.sort((a,b)=>b.y-a.y||a.x-b.x);
    const lines=[];
    for(const it of its){const L=lines.find(l=>Math.abs(l.y-it.y)<2.5); if(L)L.items.push(it); else lines.push({y:it.y,items:[it]});}
    lines.sort((a,b)=>b.y-a.y);
    for(const l of lines){
      l.items.sort((a,b)=>a.x-b.x);
      let t="",px=null;
      for(const i of l.items){ if(px!==null && i.x-px>1.5 && !t.endsWith(" ")) t+=" "; t+=i.s; px=i.x+i.w; }
      l.text=t.replace(/\s+/g," ").trim(); l.page=p-1; l.pairs=pairsOf(l.items,p-1);
      l.box=boxOf(l.items,p-1);
    }
    pages.push({w:vp.width,h:vp.height,lines});
  }
  return {numPages:doc.numPages,pages,text:pages.map(p=>p.lines.map(l=>l.text).join("\n")).join("\n\n")};
}
function boxOf(items,p){
  const x=Math.min(...items.map(i=>i.x)), y=Math.min(...items.map(i=>i.y-(i.h*0.22)));
  const x2=Math.max(...items.map(i=>i.x+i.w)), y2=Math.max(...items.map(i=>i.y+i.h*0.85));
  return {p,x:+x.toFixed(1),y:+y.toFixed(1),w:+(x2-x).toFixed(1),h:+(y2-y).toFixed(1)};
}
// Pares rótulo:valor de uma linha. Aceita "Rótulo" + ": valor", "Rótulo:" + "valor" e "Rótulo: valor".
function pairsOf(items,p){
  const t=items.filter(i=>i.s.trim()!=="|");
  const out=[];
  const isLabelAt=j=>{const u=t[j].s.trim(), un=t[j+1]?t[j+1].s.trim():"";
    return (u.endsWith(":")&&u.length>1)||(un.startsWith(":")&&!u.startsWith(":"))||/^[^:]{2,40}: /.test(u);};
  const collect=(j,first,label,boxItems)=>{
    const vals=first?[first]:[];
    while(j<t.length && !isLabelAt(j)){vals.push(t[j].s.trim());boxItems.push(t[j]);j++;}
    out.push({k:label,v:vals.join(" ").trim(),box:boxOf(boxItems,p)}); return j;
  };
  for(let i=0;i<t.length;i++){
    const s=t[i].s.trim(), nx=t[i+1]?t[i+1].s.trim():null;
    if(nx!==null && nx.startsWith(":") && !s.endsWith(":") && !s.startsWith(":")){
      i=collect(i+2,nx.slice(1).trim(),s,[t[i],t[i+1]])-1; continue;
    }
    if(s.endsWith(":") && s.length>1){
      i=collect(i+1,"",s.slice(0,-1).trim(),[t[i]])-1; continue;
    }
    const m=s.match(/^([^:]{2,50}?):\s*(.*)$/);
    if(m && !/^https?$/i.test(m[1])) out.push({k:m[1].trim(),v:m[2].trim(),box:boxOf([t[i]],p)});
  }
  return out;
}
const numBR=s=>{
  if(s==null) return null; s=String(s).trim(); if(!s) return null;
  const m=s.match(/-?\d[\d.]*,\d+|-?\d+(?:\.\d{3})+|-?\d+/); if(!m) return null;
  let v=m[0]; if(v.includes(",")) v=v.replace(/\./g,"").replace(",","."); else if(/\.\d{3}$/.test(v)&&v.split(".").length>1) v=v.replace(/\./g,"");
  const n=parseFloat(v); return isNaN(n)?null:n;
};
function classifyText(text){
  const t=text.slice(0,4000);
  if(/Conferência DUIMP\s*\|\s*Sigraweb/i.test(t)) return "SIGRA_DUIMP";
  if(/Conferência do Processo Detalhado/i.test(t)) return "SIGRA_DET";
  if(/Conferência do Processo Simplificad|Conferência Simplificada/i.test(t)) return "SIGRA_SIMP";
  if(/certificate of origin|certificado de origem|certificado de origen|statement on origin|declaração de origem/i.test(t)) return "CO";
  if(/bill of lading|conhecimento de embarque|sea ?waybill|air ?waybill|\bB\/L\b/i.test(t)) return "BL";
  if(/packing list|romaneio|lista de embalagem/i.test(t)) return "PL";
  if(/commercial invoice|\binvoice\b|fatura comercial|factura/i.test(t)) return "INV";
  return null;
}
const isNoise=t=>/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/.test(t)||/^https:\/\/app\.sigraweb/.test(t);

// ---- Conferência DUIMP (Sigraweb)
function parseSigraDuimp(pdf){
  const S={fonte:"Conferência DUIMP",header:{},loc:{},docsInstr:[],embalagens:[],embalagemNenhuma:false,fatura:{},fornecedor:{},itens:[],totais:{}};
  const lines=pdf.pages.flatMap(p=>p.lines).filter(l=>!isNoise(l.text));
  let mode="header",cur=null,sub=null,desc=false,inEmb=false,inForn=false,fatItens=[],lastCodLine=false,afterIncoterms=false;
  const setH=(k,v,box)=>{ if(!(k in S.header)){S.header[k]=v; S.loc[k]=box;} };
  const newItem=(seq,box)=>{cur={seq,loc:{item:box},exportador:{},fabricante:{}};sub=null;desc=false;return cur;};
  for(const l of lines){
    const t=l.text;
    let m;
    if((m=t.match(/^Item DUIMP (\d+)/))){mode="item";S.itens.push(newItem(+m[1],l.box));continue;}
    if(mode==="header" && /^Itens \(\d+\)/.test(t)){mode="fat";continue;}
    if(mode==="header"){
      if(/^Item Carga Tipo/.test(t)){inEmb=true;S.loc.embalagem=l.box;continue;}
      if(inEmb){ if(/^Documentos de Instrução/.test(t)){inEmb=false;} else { if(/Nenhuma embalagem/.test(t)) S.embalagemNenhuma=true; else S.embalagens.push(t); continue; } }
      if((m=t.match(/(?:^|\s)(\d{14})(?:\s|$)/)) && !S.header.cnpj) S.header.cnpj=m[1];
      if((m=t.match(/^(FATURA COMERCIAL|ROMANEIO DE CARGA|CONHECIMENTO DE CARGA|CERTIFICADO DE ORIGEM|PACKING LIST|[A-ZÇÃÁÉÍÓÕÚ ]{5,40}): (\S+)/)) && !/^(CE|URF|FOB)$/.test(m[1])) S.docsInstr.push({tipo:m[1].trim(),num:m[2],box:l.box});
      if((m=t.match(/^FOB ([\d.,]+) ([\d.,]+)$/))){S.totais.fob=numBR(m[1]);S.loc.totais=l.box;}
      if((m=t.match(/^Frete ([\d.,]+) ([\d.,]+)$/))) S.totais.frete=numBR(m[1]);
      if((m=t.match(/^Seguro.*?([\d.,]+) ([\d.,]+)$/))) S.totais.seguro=numBR(m[1]);
      if((m=t.match(/Valor Aduaneiro \(USD\): ([\d.,]+)/))) S.totais.vaUSD=numBR(m[1]);
      if((m=t.match(/Taxa do Dólar: ([\d.,]+)/))) S.totais.taxa=numBR(m[1]);
      if((m=t.match(/Valor Aduaneiro \(estimado\): ([\d.,]+)/))) S.totais.vaEstimado=numBR(m[1]);
      if((m=t.match(/^Fatura (\S+)$/))){S.fatura.num=m[1];S.loc.fatura=l.box;continue;}
      if(/^Dados do Fornecedor/.test(t)){inForn=true;continue;}
      if(S.fatura.num && afterIncoterms && S.fatura.valor==null && (m=t.match(/([\d.]+,\d+) ([\d.]+,\d+)$/))){S.fatura.pesoLiq=numBR(m[1]);S.fatura.valor=numBR(m[2]);afterIncoterms=false;}
      for(const pr of l.pairs){
        if(S.fatura.num && pr.k==="Incoterms"){S.fatura.incoterm=pr.v;S.loc.incoterm=pr.box;afterIncoterms=true;continue;}
        if(S.fatura.num && pr.k==="Moeda"){S.fatura.moeda=pr.v;S.loc.moeda=pr.box;continue;}
        if(inForn && pr.k==="Nome"){S.fornecedor.nome=pr.v;continue;}
        if(inForn && pr.k==="País"){S.fornecedor.pais=pr.v;continue;}
        setH(pr.k,pr.v,pr.box);
      }
      continue;
    }
    // itens (fatura ou DUIMP)
    if(mode==="fat"){ const ncm=l.pairs.find(p=>p.k==="NCM"); if(ncm){fatItens.push(newItem(fatItens.length+1,l.box));} if(!cur) continue; }
    if(!cur) continue;
    if(/^Dados do Exportador/.test(t)){sub="exp";desc=false;continue;}
    if(/^Dados do Fabricante/.test(t)){sub="fab";desc=false;continue;}
    if(/IMPOSTO DE IMPORTAÇÃO/.test(t) && (m=t.match(/Fundamento (\S+)\s+(.*?)(?:\s+·\s+Regime.*)?$/))){cur.fundII={cod:m[1],desc:m[2].trim()};cur.loc.fundII=l.box;continue;}
    if(/Nenhuma LPCO/.test(t)) cur.lpco="Nenhuma";
    const prs=l.pairs;
    if(desc){
      if(/^(Quantidade|Descrição Complementar|Valor unitário|Unidade|Caracterização|Atributos)\b/.test(t)) desc=false;
      else {cur.desc+=" "+t; continue;}
    }
    if(lastCodLine && !prs.length && /^[\w./-]{1,20}$/.test(t)){cur.codInterno=(cur.codInterno||"")+" "+t;lastCodLine=false;continue;}
    lastCodLine=false;
    if(!prs.length && !cur.nomeProduto && cur.codProduto && !cur.desc && !/^(Caracteriza|\(|Atributos|Sem atributos|Nenhum)/.test(t)){cur.nomeProduto=t;continue;}
    for(const pr of prs){
      const k=pr.k,v=pr.v;
      if(k==="NCM"){cur.ncm=v.replace(/\D/g,"");cur.loc.ncm=pr.box;}
      else if(k==="Código Interno"){ if(!sub){cur.codInterno=v;lastCodLine=true;} }
      else if(k==="Código do Produto"){ if(!sub) cur.codProduto=v; }
      else if(k==="Descrição"){cur.desc=v;desc=true;cur.loc.desc=pr.box;}
      else if(k==="Quantidade"){cur.qtd=numBR(v);cur.loc.qtd=pr.box;}
      else if(k==="Valor unitário"){cur.vunit=numBR(v);}
      else if(k==="Valor total"){cur.valor=numBR(v);cur.loc.valor=pr.box;}
      else if(k==="Unidade"){cur.unidade=v;}
      else if(k==="Peso líquido"){cur.pesoLiq=numBR(v);cur.loc.peso=pr.box;}
      else if(k==="Nome" && sub==="exp"){cur.exportador.nome=v;}
      else if(k==="País" && sub==="exp"){cur.exportador.pais=v;}
      else if(k==="Nome"){cur.fabricante.nome=v;cur.loc.fab=pr.box;}
      else if(k==="País"){cur.fabricante.pais=v;cur.loc.origem=pr.box;}
      else if(k==="Condição de Venda (Incoterms)"){cur.incoterm=v;}
      else if(k==="Cobertura cambial"){cur.cobertura=v;}
      else if(k==="Alíquota ICMS (Normal)"){cur.icms=numBR(v);cur.loc.icms=pr.box;}
      else if(k==="FECP/FCP"){cur.fcp=numBR(v);}
      else if(k==="Método de Valoração Aduaneira"){cur.metodo=v;}
      else if(k==="Tipo de Vínculo entre Exportador e Importador"){cur.vinculo=v;}
      else if(k==="Vínculo Exportador/Fabricante"){cur.vincFab=v;}
      else if(k==="Condição da mercadoria"){cur.condicao=v;}
      else if(k==="Aplicação"){cur.aplicacao=v;}
    }
  }
  if(!S.itens.length) S.itens=fatItens;
  const H=S.header;
  S.ref=H["Identificação importador"]||null; S.idInterno=H["Identificação interna"]||null;
  let emp=H["Empresa"]||"";
  const eLine=lines.findIndex(l=>l.pairs.some(pr=>pr.k==="Empresa"));
  if(eLine>=0&&lines[eLine+1]){const m2=lines[eLine+1].text.match(/^(.*?)\s*-\s*\d{14}$/);if(m2)emp+=" "+m2[1];}
  S.empresa=(emp.includes(" - ")?emp.slice(emp.indexOf(" - ")+3):emp).trim();
  S.docCarga=H["Doc Carga"]||null; S.dataEmbarque=H["Data de embarque"]||null; S.ce=H["CE"]||null;
  S.procedencia=H["Procedência"]||null; S.pesoBruto=numBR(H["Peso bruto"]); S.pesoLiq=numBR(H["Peso líquido"]);
  S.urf=H["URF de Despacho"]||null; S.via=H["Via de transporte"]||null;
  return S;
}

// ---- Conferência Detalhada (Sigraweb)
function parseSigraDet(pdf){
  const D={fonte:"Conferência Detalhada",header:{},loc:{},adicoes:[]};
  const lines=pdf.pages.flatMap(p=>p.lines).filter(l=>!isNoise(l.text));
  let cur=null;
  for(const l of lines){
    for(const pr of l.pairs){
      if(pr.k==="Informações da Adição Nº"){cur={n:+pr.v,loc:{ad:l.box}};D.adicoes.push(cur);continue;}
      if(!cur){ if(!(pr.k in D.header)){D.header[pr.k]=pr.v;D.loc[pr.k]=pr.box;} continue; }
      const k=pr.k,v=pr.v;
      if(k==="NR NCM") cur.ncm=v.replace(/\D/g,"");
      else if(k==="Peso Líquido" && cur.pesoLiq==null) cur.pesoLiq=numBR(v);
      else if(k==="Valor FOB") {cur.fob=numBR(v);cur.loc.fob=pr.box;}
      else if(k==="Valor Frete") {cur.frete=numBR(v);cur.loc.frete=pr.box;}
      else if(k==="Valor Seguro") cur.seguro=numBR(v);
      else if(k==="País Origem") cur.origem=v;
      else if(k==="Fabricante" && cur.fab==null) cur.fab=v;
      else if(k==="Fund. Legal II") cur.fundII=v;
      else if(k==="Incoterms") cur.incoterm=v;
      else if(k==="Fornecedor") cur.fornecedor=v;
    }
  }
  const H=D.header;
  D.cnpj=(H["CNPJ"]||"").replace(/\D/g,"")||null; D.ref=H["Identificação"]||null;
  D.procedencia=H["País de Procedência"]||null; D.pesoBruto=numBR(H["Peso Bruto"]); D.pesoLiq=numBR(H["Peso Líquido"]);
  D.volumes=numBR(H["Volumes"]); D.embalagem=H["Embalagem"]||null; D.docCarga=H["IDT. Conhecimento"]||null;
  D.dataEmbarque=H["Data de Embarque"]||null;
  return D;
}
