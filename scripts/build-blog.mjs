#!/usr/bin/env node
// Build estático Narciso + Pages CMS. Sem dependências externas.
// Não publica content/, arquivos internos ou artigos em rascunho.
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd(), OUT=path.join(ROOT,"dist"), ARTICLES=path.join(ROOT,"content/artigos");
const BASE="https://narcisomaterial.com.br";
const SKIP=new Set([".git",".github",".netlify",".gitignore",".pages.yml",".env","node_modules","dist","scripts","content","netlify.toml","DESIGN.md","README.md","package.json","package-lock.json"]);
const check=(ok,msg)=>{if(!ok)throw Error("Build Pages CMS: "+msg)};
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const slugify=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,"");
function safeLink(s){return /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*|#[a-z0-9_-]+)$/i.test(s)?s:""}
function inline(s){
 const tokens=[];
 let raw=String(s).replace(/(!?)\[([^\]]+)\]\(([^)\s]+)\)/g,(_all,image,label,href)=>{
  const url=safeLink(href);
  if(!url)return label;
  const key="CMSLINK"+tokens.length+"TOKEN";
  tokens.push(image?'<img src="'+esc(url)+'" alt="'+esc(label)+'" loading="lazy" decoding="async">':
   '<a href="'+esc(url)+'"'+(/^https?:/.test(url)?' target="_blank" rel="noopener noreferrer"':"")+'>'+esc(label)+"</a>");
  return key;
 });
 raw=esc(raw).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/__([^_]+)__/g,"<strong>$1</strong>").replace(/\*([^*\n]+)\*/g,"<em>$1</em>");
 return raw.replace(/CMSLINK(\d+)TOKEN/g,(_m,n)=>tokens[Number(n)]||"");
}
function markdown(source){
 const result=[];let para=[],list=null,section=false;
 const flush=()=>{if(para.length)result.push("<p>"+inline(para.join(" "))+"</p>");para=[]};
 const endList=()=>{if(list)result.push("</"+list+">");list=null};
 const close=()=>{flush();endList();if(section)result.push("</section>");section=false};
 for(const line0 of String(source||"").replace(/\r\n?/g,"\n").split("\n")){
  const line=line0.trim();
  if(!line){flush();endList();continue}
  const h=line.match(/^(#{1,3})\s+(.+)$/);
  if(h){flush();endList();const level=h[1].length===3?3:2;
   if(level===2){close();result.push('<section class="pst-section" id="'+esc(slugify(h[2])||"secao")+'">');section=true}
   result.push("<h"+level+">"+inline(h[2])+"</h"+level+">");continue}
  const ul=line.match(/^[-*]\s+(.+)$/),ol=line.match(/^\d+[.)]\s+(.+)$/);
  if(ul||ol){flush();const type=ul?"ul":"ol";if(list&&list!==type)endList();if(!list){list=type;result.push("<"+type+">")}
   result.push("<li>"+inline((ul||ol)[1])+"</li>");continue}
  if(/^>\s?/.test(line)){flush();endList();result.push("<blockquote><p>"+inline(line.replace(/^>\s?/,""))+"</p></blockquote>");continue}
  if(/^!\[[^\]]+\]\([^)]+\)$/.test(line)){flush();endList();result.push('<figure class="cms-inline-image">'+inline(line)+"</figure>");continue}
  if(/^---+$/.test(line)){flush();endList();result.push("<hr>");continue}
  endList();para.push(line);
 }
 close();flush();endList();
 return result.join("\n");
}
function copy(source,target,depth=0){
 for(const item of fs.readdirSync(source,{withFileTypes:true})){
  if(SKIP.has(item.name)||item.name.startsWith("."))continue;
  const src=path.join(source,item.name),dest=path.join(target,item.name);
  if(item.isDirectory()){fs.mkdirSync(dest,{recursive:true});copy(src,dest,depth+1)}
  else if(item.isFile()){
   if(depth===0&&!/(\.html|\.xml|\.txt|\.ico|\.webmanifest|\.svg|\.webp|\.png|\.jpg|\.jpeg|^_redirects$|^_headers$)/i.test(item.name))continue;
   fs.copyFileSync(src,dest);
  }
 }
}
function replace(html,re,txt,name){check(re.test(html),"trecho ausente: "+name);return html.replace(re,()=>txt)}
function buildPage(post,slug){
 const template=fs.readFileSync(path.join(ROOT,"blog/lista-de-materiais-para-reforma/index.html"),"utf8");
 const canonical=BASE+"/blog/"+slug+"/",cover=post.cover||"/assets/furadeira.webp";
 const date=post.date,category=post.category||"Guia de construção",description=post.description;
 const human=new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(date+"T12:00:00Z"));
 const link="https://wa.me/5527999259494?text="+encodeURIComponent("Olá! Li o artigo "+post.title+" da Narciso. Gostaria de consultar materiais para minha obra.");
 const body=markdown(post.body);
 const heads=[...body.matchAll(/<h2>(.*?)<\/h2>/g)].map(m=>m[1]);
 const ids=[...body.matchAll(/<section class="pst-section" id="([^"]+)">/g)].map(m=>m[1]);
 const toc=heads.map((h,i)=>'<a href="#'+esc(ids[i]||"conteudo")+'">'+h+"</a>").join("");
 const main=[
 '<main id="conteudo">',
 '<nav class="pst-crumb" aria-label="Navegação estrutural"><div class="container"><a href="/">Início</a> / <a href="/blog/">Blog</a> / <span>'+esc(post.title)+"</span></div></nav>",
 '<section class="pst-hero"><div class="container"><div class="pst-hero-copy"><span class="pst-kicker">'+esc(category)+' · Vila Velha / ES</span><h1>'+esc(post.title)+'</h1><p class="pst-hero-lead">'+esc(post.excerpt||description)+'</p><div class="pst-byline"><span>Narciso Material de Construção</span><time datetime="'+esc(date)+'">'+esc(human)+'</time></div></div><figure class="pst-hero-photo"><img src="'+esc(cover)+'" alt="'+esc(post.cover_alt||post.title)+'" fetchpriority="high" decoding="async"><figcaption>'+esc(post.cover_alt||post.title)+'</figcaption></figure></div></section>',
 '<div class="pst-main"><div class="container pst-layout"><article class="pst-article cms-article">'+body+
 '<section class="pst-section" id="narciso-orcamento"><h2>Consulte materiais na Narciso</h2><p>Nossa loja fica na Rua Barra Nova, 195, Vale Encantado, Vila Velha – ES. Envie sua lista com medidas e quantidades para consultar preços e disponibilidade.</p><p><a class="btn btn-orange" href="'+esc(link)+'" target="_blank" rel="noopener noreferrer">Solicitar orçamento no WhatsApp</a></p></section></article>',
 '<aside class="pst-sidebar"><div class="pst-side-card"><img src="/assets/logo.webp" alt="Narciso" width="60" height="60" loading="lazy"><span>Vale Encantado · Vila Velha</span><h2>Vai reformar?</h2><p>Consulte os materiais e tire dúvidas com nossa equipe.</p><a class="btn btn-orange" href="'+esc(link)+'" target="_blank" rel="noopener noreferrer">Pedir orçamento</a><p>Rua Barra Nova, 195 · Vila Velha</p></div>'+
 (toc?'<nav class="pst-toc" aria-label="Neste artigo"><h2>Neste artigo</h2>'+toc+'</nav>':"")+'</aside></div></div>',
 '<section class="pst-related"><div class="container"><span class="eyebrow">Continue explorando</span><h2>Veja também</h2><div class="pst-related-grid"><a href="/materiais/"><span>Produtos</span><strong>Categorias da Narciso</strong><small>Ferramentas, tintas e materiais de construção.</small><i>Ver categorias →</i></a><a href="/material-construcao-vale-encantado/"><span>Loja</span><strong>Narciso no Vale Encantado</strong><small>Endereço e atendimento no bairro.</small><i>Conhecer a loja →</i></a><a href="/blog/"><span>Artigos</span><strong>Outros guias</strong><small>Mais conteúdos de obras e reformas.</small><i>Ler artigos →</i></a></div></div></section>',
 '</main>'
 ].join("\n");
 const ld={"@context":"https://schema.org","@graph":[{"@type":"BlogPosting","@id":canonical+"#artigo","mainEntityOfPage":{"@type":"WebPage","@id":canonical},"headline":post.title,"description":description,"datePublished":date,"dateModified":date,"inLanguage":"pt-BR","author":{"@type":"Organization","name":"Narciso Material de Construção"},"publisher":{"@type":"Organization","name":"Narciso Material de Construção","url":BASE+"/"},"image":[BASE+cover]},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Início","item":BASE+"/"},{"@type":"ListItem","position":2,"name":"Blog","item":BASE+"/blog/"},{"@type":"ListItem","position":3,"name":post.title,"item":canonical}]}]};
 let html=template;
 html=replace(html,/<title>[\s\S]*?<\/title>/i,"<title>"+esc(post.meta_title)+"</title>","title");
 html=replace(html,/<meta name="description" content="[^"]*"\s*\/?>/i,'<meta name="description" content="'+esc(description)+'">',"description");
 html=replace(html,/<link rel="canonical" href="[^"]*"\s*\/?>/i,'<link rel="canonical" href="'+esc(canonical)+'">',"canonical");
 for(const [prop,value] of [["og:title",post.meta_title],["og:description",description],["og:url",canonical],["og:image",BASE+cover]]){
  html=replace(html,new RegExp('<meta property="'+prop+'" content="[^"]*"\\s*/?>',"i"),'<meta property="'+prop+'" content="'+esc(value)+'">',prop)
 }
 html=replace(html,/<meta property="article:published_time" content="[^"]*"\s*\/?>/i,'<meta property="article:published_time" content="'+esc(date)+'T12:00:00-03:00">',"date");
 html=replace(html,/<script type="application\/ld\+json">[\s\S]*?<\/script>/i,'<script type="application/ld+json">'+JSON.stringify(ld).replace(/</g,"\\u003c")+"</script>","schema");
 html=html.replace(/<link rel="preload" href="\/assets\/[^"]+\.webp" as="image" type="image\/webp">/i,"");
 const begin=html.indexOf('<main id="conteudo">'),end=html.indexOf("</main>",begin);check(begin>0&&end>begin,"main ausente no template");
 html=html.slice(0,begin)+main+html.slice(end+7);
 html=html.replace(/<div aria-label="Ações rápidas" class="mobile-cta">[\s\S]*?<\/div>/i,'<div aria-label="Ações rápidas" class="mobile-cta"><a href="#conteudo" class="btn btn-outline">Ler artigo</a><a href="'+esc(link)+'" class="btn btn-orange" target="_blank" rel="noopener noreferrer">Pedir orçamento</a></div>');
 html=html.replace(/ aria-current="page"/g,"");
 check((html.match(/<h1\b/g)||[]).length===1,"H1 duplicado");
 check(html.includes('rel="canonical" href="'+canonical+'"'),"canonical ausente");
 check(html.includes("/assets/site.css"),"CSS compartilhado ausente");
 return html;
}
function listing(posts){
 if(!posts.length)return;
 const file=path.join(OUT,"blog/index.html");let html=fs.readFileSync(file,"utf8");
 const marker='<div class="hub-grid hub-grid--guides">';check(html.includes(marker),"blog index alterado");
 const cards=posts.map(({data,slug})=>{
  const route="/blog/"+slug+"/",cover=data.cover||"/assets/furadeira.webp";
  const human=new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(data.date+"T12:00:00Z"));
  return '<article class="hub-card hub-guide-card reveal"><a class="hub-card-media" href="'+esc(route)+'" aria-label="Ler '+esc(data.title)+'"><img src="'+esc(cover)+'" alt="'+esc(data.cover_alt||data.title)+'" loading="lazy" decoding="async"></a><div class="hub-card-body"><span class="eyebrow">'+esc(data.category||"Guia de obra")+'</span><h3>'+esc(data.title)+'</h3><p>'+esc(data.excerpt||data.description)+'</p><div class="hub-guide-date"><time datetime="'+esc(data.date)+'">'+esc(human)+'</time></div><a class="hub-card-link" href="'+esc(route)+'">Ler guia →</a></div></article>';
 }).join("\n");
 html=html.replace(marker,marker+"\n"+cards);
 const re=/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,found=html.match(re);
 check(found,"Schema Blog não encontrado");
 const graph=JSON.parse(found[1]);
 if(graph.mainEntity&&Array.isArray(graph.mainEntity.itemListElement)){
  const newItems=posts.map(({data,slug})=>({"@type":"ListItem","item":{"@type":"Article","headline":data.title,"description":data.description,"url":BASE+"/blog/"+slug+"/","datePublished":data.date,"image":BASE+(data.cover||"/assets/furadeira.webp"),"author":{"@type":"Organization","name":"Narciso Material de Construção"}}}));
  graph.mainEntity.itemListElement=[...newItems,...graph.mainEntity.itemListElement].map((x,i)=>({...x,position:i+1}));
  html=html.replace(re,'<script type="application/ld+json">'+JSON.stringify(graph).replace(/</g,"\\u003c")+"</script>");
 }
 fs.writeFileSync(file,html);
}
function sitemap(posts){
 if(!posts.length)return;
 const file=path.join(OUT,"sitemap.xml");let xml=fs.readFileSync(file,"utf8");check(xml.includes("</urlset>"),"sitemap ausente");
 let added="";
 for(const {slug,data} of posts){
  const canonical=BASE+"/blog/"+slug+"/";check(!xml.includes("<loc>"+canonical+"</loc>"),"URL duplicada no sitemap: "+slug);
  added+="<url><loc>"+esc(canonical)+"</loc><lastmod>"+data.date+"</lastmod></url>\n";
 }
 fs.writeFileSync(file,xml.replace("</urlset>",added+"</urlset>"));
}
function main(){
 check(fs.existsSync("index.html")&&fs.existsSync("sitemap.xml"),"Home ou sitemap não encontrados");
 fs.rmSync(OUT,{force:true,recursive:true});fs.mkdirSync(OUT,{recursive:true});copy(ROOT,OUT);
 const posts=[];
 if(fs.existsSync(ARTICLES))for(const name of fs.readdirSync(ARTICLES).sort()){
  if(!name.endsWith(".json"))continue;
  const data=JSON.parse(fs.readFileSync(path.join(ARTICLES,name),"utf8"));
  if(data.published!==true)continue;
  const slug=name.slice(0,-5);
  check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),"slug inválido: "+name);
  check(!data.slug||data.slug===slug,"slug diferente do nome do arquivo: "+name);
  check(typeof data.title==="string"&&data.title.trim().length>=8,"título ausente: "+name);
  check(typeof data.meta_title==="string"&&data.meta_title.trim().length>=8,"título SEO ausente: "+name);
  check(typeof data.description==="string"&&data.description.trim().length>=50,"descrição curta: "+name);
  check(typeof data.body==="string"&&data.body.trim().length>=120,"texto curto: "+name);
  check(/^\d{4}-\d{2}-\d{2}$/.test(data.date)&&!Number.isNaN(new Date(data.date).getTime()),"data inválida: "+name);
  const cover=data.cover||"/assets/furadeira.webp";
  check(/^\/assets\/[a-zA-Z0-9/_-]+\.(webp|png|jpg|jpeg)$/i.test(cover),"capa fora de /assets/: "+name);
  check(fs.existsSync(path.join(ROOT,cover.slice(1))),"imagem da capa não encontrada: "+cover);
  const target=path.join(OUT,"blog",slug,"index.html");
  check(!fs.existsSync(target),"Não sobrescrever artigo antigo: "+slug);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,buildPage(data,slug));posts.push({data,slug});
 }
 posts.sort((a,b)=>b.data.date.localeCompare(a.data.date));
 listing(posts);sitemap(posts);
 check(fs.existsSync(path.join(OUT,"assets/site.css")),"CSS da Home ausente");
 check(fs.existsSync(path.join(OUT,"materiais/tintas/index.html")),"categoria existente ausente");
 check(!fs.existsSync(path.join(OUT,"content"))&&!fs.existsSync(path.join(OUT,".pages.yml")),"rascunhos/configuração publicados");
 console.log("Narciso: site pronto para Netlify. Artigos CMS publicados: "+posts.length);
}
main();
