import re
import os
BASE=os.path.dirname(os.path.abspath(__file__))
S=os.path.join(BASE,'src')+'/'
css=open(S+'style.css').read()
js=open(S+'pdfread.js').read()+"\n"+open(S+'engine.js').read()+"\n"+open(S+'guia.js').read()+"\n"+open(S+'app.js').read()
js=js.replace('__NCMDATA__',open(os.path.join(BASE,'data','ncm-icms-sp.json')).read())
assert '</script' not in js.lower().replace('<\\/script','')
html=f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Crivo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div class="app">
  <aside class="side" id="side" aria-label="Navegação"></aside>
  <div class="main">
    <header class="top" id="top"></header>
    <main class="view" id="view"></main>
  </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script>
const PDFJS_WORKER_URL="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
{js}
</script>
</body>
</html>
'''
os.makedirs(os.path.join(BASE,'dist'),exist_ok=True); open(os.path.join(BASE,'dist','crivo.html'),'w').write(html)
print(len(html))
demo=html.replace('<title>Crivo</title>','<title>Crivo · Demonstração</title>').replace('const PDFJS_WORKER_URL=','const CRIVO_DEMO=true;\nconst PDFJS_WORKER_URL=')
demo=demo.replace('</script>\n</body>',open(S+'demo.js').read()+'\n</script>\n</body>')
open(os.path.join(BASE,'dist','crivo-demo.html'),'w').write(demo)
print('demo',len(demo))
