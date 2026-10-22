/**
 * Source JSON v1 — même validateur à l'exécution, au build et dans les tests.
 * Aucun package additionnel ; contenu local de confiance, jamais de JSX/HTML dans les données.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_ROOT = path.resolve(process.cwd(), 'src/content/blog-json');
const DEFAULT_PUBLIC = path.resolve(process.cwd(), 'public');
const LOCALES = new Set(['fr', 'en']);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TONES = ['neutral', 'accent', 'info', 'success', 'warning'];
const customDefs = {
  'metric-panel': { required: ['value', 'label'], optional: ['caption'] },
  'saas-mosaic': { required: [], optional: [], locale: 'fr', unique: true },
  'saas-language-demo': { required: [], optional: [], locale: 'fr', unique: true },
  'saas-language-matrix': { required: [], optional: [], locale: 'fr', unique: true },
  'saas-acquisition-funnel': { required: [], optional: [], locale: 'fr', unique: true },
  'saas-decision-tree': { required: [], optional: [], locale: 'fr', unique: true },
};

export const registeredJsonCustomModules = Object.freeze(Object.keys(customDefs));

function error(file, at, message) {
  throw new Error(`[blog-json] ${file}${at ? ` (${at})` : ''}: ${message}`);
}
function obj(value, file, at) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) error(file, at, 'objet attendu');
  return value;
}
function keys(value, required, optional, file, at) {
  obj(value, file, at);
  for (const k of required) if (!(k in value)) error(file, `${at}.${k}`, 'champ obligatoire absent');
  for (const k of Object.keys(value)) if (![...required, ...optional].includes(k)) error(file, `${at}.${k}`, 'champ inconnu');
}
function string(value, file, at, {empty = false} = {}) {
  if (typeof value !== 'string' || (!empty && !value.trim())) error(file, at, 'texte non vide attendu');
}
function optString(value, file, at) { if (value !== undefined) string(value, file, at); }
function bool(value, file, at) { if (value !== undefined && typeof value !== 'boolean') error(file, at, 'booléen attendu'); }
function pick(value, options, file, at) { if (!options.includes(value)) error(file, at, `valeur inconnue : ${String(value)}`); }
function arr(value, file, at, {min=1} = {}) { if (!Array.isArray(value) || value.length < min) error(file, at, `tableau de ${min} élément(s) minimum attendu`); }
function positive(value, file, at) { if (!Number.isInteger(value) || value < 1 || value > 8192) error(file, at, 'entier positif <= 8192 attendu'); }
function date(value, file, at) {
  string(value,file,at);
  if (!DATE.test(value)) error(file, at, 'date ISO AAAA-MM-JJ attendue');
  const [y,m,d] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(y,m-1,d));
  if (parsed.getUTCFullYear()!==y || parsed.getUTCMonth()!==m-1 || parsed.getUTCDate()!==d) error(file,at,'date inexistante');
}
function safeHref(value, file, at, anchors) {
  string(value,file,at);
  if (value.startsWith('#')) {
    if (!ID.test(value.slice(1))) error(file, at, 'ancre invalide');
    anchors.push({ value: value.slice(1), at });
    return;
  }
  if (value.startsWith('/')) {
    if (value.startsWith('//') || value.includes('\\') || value.includes('..') || /[\x00-\x1f]/.test(value)) error(file, at, 'lien local invalide');
    return;
  }
  try {
    const parsed = new URL(value);
    if (!['https:', 'http:', 'mailto:', 'tel:'].includes(parsed.protocol)) throw new Error('invalid');
  } catch { error(file, at, 'URL interdite ou invalide'); }
}
function rich(value, file, at, links, anchors) {
  arr(value,file,at);
  value.forEach((node,i)=> {
    const p = `${at}[${i}]`;
    keys(node,['text'],['bold','italic','code','link'],file,p);
    string(node.text,file,`${p}.text`);
    for(const k of ['bold','italic','code']) bool(node[k],file,`${p}.${k}`);
    if (node.link !== undefined) {
      keys(node.link,['href'],['external'],file,`${p}.link`);
      bool(node.link.external,file,`${p}.link.external`);
      safeHref(node.link.href,file,`${p}.link.href`,anchors);
      links.push(node.link.href);
    }
  });
}
function custom(data, file, at, locale, placement = 'block') {
  keys(data, ['component'], ['props'], file,at);
  string(data.component,file,`${at}.component`);
  const d=customDefs[data.component];
  if(!d) error(file, `${at}.component`, `module inconnu « ${data.component} »`);
  if(d.locale && d.locale!==locale) error(file,at,'module SaaS réservé au contenu français : traduction EN non disponible');
  if(placement==='hero' && data.component!=='metric-panel') error(file,at,'le module interactif ne peut pas être utilisé dans le hero');
  const props=data.props??{};
  keys(props,d.required,d.optional,file,`${at}.props`);
  for(const k of [...d.required,...d.optional]) optString(props[k],file,`${at}.props.${k}`);
}
function asset(src, slug, file, at, publicRoot) {
  string(src,file,at);
  if (!src.startsWith(`/blog/${slug}/`) || src.includes('..') || src.includes('\\') || !/\.(avif|gif|jpe?g|png|svg|webp)$/.test(src)) error(file,at,'image locale attendue sous /blog/<slug>/');
  const absolute = path.resolve(publicRoot, src.slice(1));
  if (!absolute.startsWith(publicRoot+path.sep) || !statSync(absolute,{throwIfNoEntry:false})?.isFile()) error(file,at,'fichier média inexistant');
}
function blocks(value, file, at, ctx, depth=0) {
  if (depth>5) error(file,at,'profondeur maximale de blocs atteinte');
  arr(value,file,at,{min:0});
  value.forEach((b,i)=> {
    const p=`${at}[${i}]`;
    obj(b,file,p);
    switch(b.type) {
      case 'paragraph': case 'lead': case 'highlight':
        keys(b,['type','content'],[],file,p);rich(b.content,file,`${p}.content`,ctx.links,ctx.anchors);break;
      case 'heading':
        keys(b,['type','level','text'],['id'],file,p);
        pick(b.level,[3,4],file,`${p}.level`);string(b.text,file,`${p}.text`);
        if (b.level===4 && ctx.lastHeading !== 3 && ctx.lastHeading !== 4) error(file,p,'H4 sans H3 préalable dans la section');
        ctx.lastHeading=b.level;
        if (b.id !== undefined) registerId(b.id,file,`${p}.id`,ctx);break;
      case 'list':
        keys(b,['type','items'],['ordered'],file,p);bool(b.ordered,file,`${p}.ordered`);arr(b.items,file,`${p}.items`);
        b.items.forEach((x,j)=>rich(x,file,`${p}.items[${j}]`,ctx.links,ctx.anchors));break;
      case 'quote':
        keys(b,['type','content'],['attribution'],file,p);rich(b.content,file,`${p}.content`,ctx.links,ctx.anchors);optString(b.attribution,file,`${p}.attribution`);break;
      case 'callout':
        keys(b,['type','blocks'],['title','tone'],file,p);optString(b.title,file,`${p}.title`);if(b.tone!==undefined)pick(b.tone,TONES,file,`${p}.tone`);
        blocks(b.blocks,file,`${p}.blocks`,ctx,depth+1);break;
      case 'cards':
        keys(b,['type','items'],['variant'],file,p);if(b.variant!==undefined)pick(b.variant,['info','action'],file,`${p}.variant`);arr(b.items,file,`${p}.items`);
        b.items.forEach((x,j)=>{const q=`${p}.items[${j}]`;keys(x,['title','description'],['number','href','actionLabel'],file,q);
          string(x.title,file,`${q}.title`);rich(x.description,file,`${q}.description`,ctx.links,ctx.anchors);
          optString(x.number,file,`${q}.number`);optString(x.actionLabel,file,`${q}.actionLabel`);
          if(x.href!==undefined){safeHref(x.href,file,`${q}.href`,ctx.anchors);ctx.links.push(x.href);}
          if(x.actionLabel!==undefined && x.href===undefined)error(file,q,'actionLabel nécessite href');
        });break;
      case 'table':
        keys(b,['type','caption','columns','rows'],[],file,p);string(b.caption,file,`${p}.caption`);arr(b.columns,file,`${p}.columns`);b.columns.forEach((x,j)=>string(x,file,`${p}.columns[${j}]`));
        arr(b.rows,file,`${p}.rows`);b.rows.forEach((row,j)=>{arr(row,file,`${p}.rows[${j}]`);if(row.length!==b.columns.length)error(file,`${p}.rows[${j}]`,'nombre de cellules différent des colonnes');row.forEach((x,k)=>string(x,file,`${p}.rows[${j}][${k}]`));});break;
      case 'figure':
        keys(b,['type','src','alt'],['caption','width','height'],file,p);asset(b.src,ctx.slug,file,`${p}.src`,ctx.publicRoot);string(b.alt,file,`${p}.alt`,{empty:true});optString(b.caption,file,`${p}.caption`);
        if(b.width!==undefined)positive(b.width,file,`${p}.width`);if(b.height!==undefined)positive(b.height,file,`${p}.height`);
        if((b.width===undefined)!==(b.height===undefined))error(file,p,'width et height doivent être fournis ensemble');break;
      case 'code':
        keys(b,['type','code','language'],['title','copyable'],file,p);string(b.code,file,`${p}.code`);string(b.language,file,`${p}.language`);optString(b.title,file,`${p}.title`);bool(b.copyable,file,`${p}.copyable`);break;
      case 'video':
        keys(b,['type','provider','id','title'],[],file,p);
        pick(b.provider,['youtube'],file,`${p}.provider`);
        string(b.id,file,`${p}.id`);
        if(!/^[a-zA-Z0-9_-]{11}$/.test(b.id))error(file,`${p}.id`,'identifiant YouTube invalide');
        string(b.title,file,`${p}.title`);
        break;
      case 'checklist':
        keys(b,['type','storageKey','items'],[],file,p);string(b.storageKey,file,`${p}.storageKey`);arr(b.items,file,`${p}.items`);
        const names = new Set();b.items.forEach((it,j)=>{const q=`${p}.items[${j}]`;keys(it,['id','label'],[],file,q);string(it.id,file,`${q}.id`);if(!ID.test(it.id))error(file,`${q}.id`,'ID invalide');if(names.has(it.id))error(file,q,'ID checklist dupliqué');names.add(it.id);string(it.label,file,`${q}.label`);});break;
      case 'accordion':
        keys(b,['type','items'],[],file,p);arr(b.items,file,`${p}.items`);b.items.forEach((it,j)=>{const q=`${p}.items[${j}]`;keys(it,['title','blocks'],[],file,q);string(it.title,file,`${q}.title`);blocks(it.blocks,file,`${q}.blocks`,ctx,depth+1);});break;
      case 'custom':
        keys(b,['type','component'],['props'],file,p);
        custom({component:b.component,props:b.props},file,p,ctx.locale);
        if(customDefs[b.component]?.unique){
          if(ctx.customIds.has(b.component))error(file,p,'module interactif dupliqué : IDs et contrôles non uniques');
          ctx.customIds.add(b.component);
        }
        break;
      default:error(file,`${p}.type`,`type de bloc inconnu « ${String(b.type)} »`);
    }
  });
}
function registerId(id, file, at, ctx) {
  string(id,file,at);
  if(!ID.test(id))error(file,at,'ancre : minuscules, chiffres et tirets, commence par une lettre');
  if(ctx.ids.has(id))error(file,at,`ID « ${id} » dupliqué`);
  ctx.ids.add(id);
}
export function validateJsonArticle(article,{file='(JSON)',locale,filenameSlug,publicRoot=DEFAULT_PUBLIC}={}) {
  keys(article,['schemaVersion','meta','sections'],['hero','introBlocks','afterBlocks','related'],file,'article');
  if(article.schemaVersion!==1)error(file,'schemaVersion','version 1 requise');
  const m=article.meta;
  keys(m,['title','description','excerpt','slug','locale','category','publishedAt','status'],['updatedAt','cover','coverAlt','translationKey','seoTitle','relatedProjects'],file,'meta');
  for(const k of ['title','description','excerpt','slug','locale','category'])string(m[k],file,`meta.${k}`);
  pick(m.locale,['fr','en'],file,'meta.locale');pick(m.status,['published','draft'],file,'meta.status');
  if(locale && locale!==m.locale)error(file,'meta.locale','locale différente du dossier');
  if(!SLUG.test(m.slug))error(file,'meta.slug','slug invalide');
  if(['showcase','json-preview'].includes(m.slug))error(file,'meta.slug','slug réservé à une route interne');
  if(filenameSlug && filenameSlug!==m.slug)error(file,'meta.slug','slug différent du nom de fichier');
  date(m.publishedAt,file,'meta.publishedAt');
  if(m.updatedAt!==undefined){date(m.updatedAt,file,'meta.updatedAt');if(m.updatedAt<m.publishedAt)error(file,'meta.updatedAt','antérieure à publishedAt');}
  if(m.cover!==undefined){asset(m.cover,m.slug,file,'meta.cover',publicRoot);string(m.coverAlt,file,'meta.coverAlt');}
  else if(m.coverAlt!==undefined)error(file,'meta.coverAlt','cover manquant');
  if(m.translationKey!==undefined){string(m.translationKey,file,'meta.translationKey');if(!SLUG.test(m.translationKey))error(file,'meta.translationKey','clé invalide');}
  optString(m.seoTitle,file,'meta.seoTitle');
  if(m.relatedProjects!==undefined){
    arr(m.relatedProjects,file,'meta.relatedProjects',{min:0});
    if(new Set(m.relatedProjects).size!==m.relatedProjects.length)error(file,'meta.relatedProjects','projets liés dupliqués');
    m.relatedProjects.forEach((slug,i)=>{string(slug,file,`meta.relatedProjects[${i}]`);if(!SLUG.test(slug))error(file,`meta.relatedProjects[${i}]`,'slug de projet invalide');});
  }
  const ctx={slug:m.slug,locale:m.locale,publicRoot,ids:new Set(['blog-article-body','blog-article-top']),anchors:[],links:[],customIds:new Set(),lastHeading:2};
  if(article.hero!==undefined){keys(article.hero,[],['primaryCta','visual'],file,'hero');
    if(article.hero.primaryCta!==undefined){keys(article.hero.primaryCta,['label','target'],[],file,'hero.primaryCta');string(article.hero.primaryCta.label,file,'hero.primaryCta.label');pick(article.hero.primaryCta.target,['content'],file,'hero.primaryCta.target');}
    if(article.hero.visual!==undefined)custom(article.hero.visual,file,'hero.visual',m.locale,'hero');
  }
  if(article.introBlocks!==undefined)blocks(article.introBlocks,file,'introBlocks',ctx);
  arr(article.sections,file,'sections');
  article.sections.forEach((sec,i)=>{const p=`sections[${i}]`;keys(sec,['id','title','blocks'],['number','eyebrow'],file,p);registerId(sec.id,file,`${p}.id`,ctx);string(sec.title,file,`${p}.title`);optString(sec.eyebrow,file,`${p}.eyebrow`);bool(sec.number,file,`${p}.number`);ctx.lastHeading=2;blocks(sec.blocks,file,`${p}.blocks`,ctx);});
  if(article.afterBlocks!==undefined)blocks(article.afterBlocks,file,'afterBlocks',ctx);
  if(article.related!==undefined){keys(article.related,['slugs'],[],file,'related');arr(article.related.slugs,file,'related.slugs',{min:0});const used=new Set();article.related.slugs.forEach((s,i)=>{string(s,file,`related.slugs[${i}]`);if(!SLUG.test(s)||s===m.slug||used.has(s))error(file,`related.slugs[${i}]`,'slug lié invalide, dupliqué ou identique');used.add(s);});}
  for(const a of ctx.anchors)if(!ctx.ids.has(a.value))error(file,a.at,`ancre cible #${a.value} introuvable`);
  return {article,links:ctx.links};
}
export function readJsonBlogArticleFile(filePath,options={}) {
  let data;try{data=JSON.parse(readFileSync(filePath,'utf8'));}catch(err){error(filePath,'parse',String(err.message));}
  const file=path.relative(process.cwd(),filePath);
  const locale=options.locale??path.basename(path.dirname(filePath));
  const {article,links}=validateJsonArticle(data,{...options,file,locale,filenameSlug:path.basename(filePath,'.json')});
  // Les liens sont injectés sous forme MDX uniquement pour réutiliser validateBlogLinks.
  const body=links.map(href=>`[lien](${href})`).join('\n');
  return {metadata:article.meta, body, filePath,format:'json',data:article};
}
export function readAllJsonBlogArticles({root=DEFAULT_ROOT,publicRoot=DEFAULT_PUBLIC}={}) {
  const result=[];
  if (!statSync(root,{throwIfNoEntry:false})) return result;
  for (const dir of readdirSync(root,{withFileTypes:true})) {
    if (!dir.isDirectory() || !LOCALES.has(dir.name)) error(root,'root',`entrée inattendue « ${dir.name} »`);
  }
  for(const locale of LOCALES){
    const directory=path.join(root,locale);
    if(!statSync(directory,{throwIfNoEntry:false})?.isDirectory())continue;
    for(const entry of readdirSync(directory,{withFileTypes:true})){
      if(!entry.isFile()||!entry.name.endsWith('.json')) error(directory,'file',`fichier inattendu « ${entry.name} »`);
      result.push(readJsonBlogArticleFile(path.join(directory,entry.name),{locale,publicRoot}));
    }
  }
  return result;
}
export function validateMergedBlogArticles(records) {
  const routes=new Set(),titles=new Set(),descs=new Set(),translations=new Map();
  for(const r of records){const m=r.metadata,key=`${m.locale}/${m.slug}`;
    if(routes.has(key))error(r.filePath,'meta.slug',`collision de route ${key}`);routes.add(key);
    if(m.status==='published'){
      for(const [set,value,name] of [[titles,m.title,'title'],[descs,m.description,'description']]){const canonical=value.trim().toLocaleLowerCase();if(set.has(canonical))error(r.filePath,`meta.${name}`,'valeur publiée en doublon');set.add(canonical);}
    }
    if(m.translationKey){const key2=`${m.translationKey}/${m.locale}`;if(translations.has(key2))error(r.filePath,'translationKey','traduction en double');translations.set(key2,r);}
  }
  for(const r of records){const m=r.metadata;if(m.status!=='published')continue;
    if(m.locale==='en'&&(!m.translationKey||!records.some(x=>x.metadata.locale==='fr'&&x.metadata.status==='published'&&x.metadata.translationKey===m.translationKey)))error(r.filePath,'meta.translationKey','version française publiée introuvable');
    if(r.format==='json'&&r.data?.related?.slugs){for(const slug of r.data.related.slugs){if(!records.some(x=>x.metadata.status==='published'&&x.metadata.locale===m.locale&&x.metadata.slug===slug))error(r.filePath,'related','article lié absent, brouillon ou dans une autre langue');}}
  }
  return records;
}
export function getJsonReadingText(article) {
  const parts=[article.meta.title,article.meta.excerpt];
  const collectRich=x=>x.forEach(n=>parts.push(n.text));
  function walk(blocks){for(const b of blocks){switch(b.type){
    case 'paragraph':case 'lead':case 'highlight':case 'quote':collectRich(b.content);break;
    case 'heading':parts.push(b.text);break;
    case 'list':b.items.forEach(collectRich);break;
    case 'callout':if(b.title)parts.push(b.title);walk(b.blocks);break;
    case 'cards':b.items.forEach(x=>{parts.push(x.title);collectRich(x.description);});break;
    case 'table':parts.push(b.caption,...b.columns,...b.rows.flat());break;
    case 'figure':if(b.caption)parts.push(b.caption);break;
    case 'code':case 'video':break; // Ne pas compter les snippets et médias dans le temps de lecture.
    case 'checklist':b.items.forEach(x=>parts.push(x.label));break;
    case 'accordion':b.items.forEach(x=>{parts.push(x.title);walk(x.blocks);});break;
    case 'custom':if(b.props?.label)parts.push(b.props.label);break;
  }}}
  walk(article.introBlocks??[]);
  for(const sec of article.sections){parts.push(sec.title);walk(sec.blocks);}
  walk(article.afterBlocks??[]);
  return parts.join(' ');
}
