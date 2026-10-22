import Image from 'next/image';
import type { ReactNode } from 'react';
import type { ArticleBlock, RichText } from '@/lib/blog/json-types';
import {BlogCallout,BlogCodeSample,BlogInfoCard,BlogQuote} from '../design-system/BlogUI';
import JsonChecklist from './JsonChecklist';
import {JsonCustomModule} from './JsonCustomRegistry';

function Rich({nodes}:{nodes:RichText}) {
  return <>{nodes.map((node,i)=>{
    let content:ReactNode=node.text;
    if(node.code)content=<code>{content}</code>;
    if(node.italic)content=<em>{content}</em>;
    if(node.bold)content=<strong>{content}</strong>;
    if(node.link)content=<a href={node.link.href} target={node.link.external?'_blank':undefined} rel={node.link.external?'noopener noreferrer':undefined}>{content}</a>;
    return <span key={i}>{content}</span>;
  })}</>;
}
export default function JsonBlockRenderer({blocks,locale="fr"}:{blocks:readonly ArticleBlock[];locale?:"fr"|"en"}) {
  return <>{blocks.map((block,index)=>{
    const key=`${block.type}-${index}`;
    switch(block.type){
      case 'paragraph':return <p key={key}><Rich nodes={block.content}/></p>;
      case 'lead':return <p key={key} className="blog-ds__lead"><Rich nodes={block.content}/></p>;
      case 'highlight':return <blockquote key={key} className="blog-ds__json-highlight"><Rich nodes={block.content}/></blockquote>;
      case 'heading':return block.level===3?<h3 key={key} id={block.id}>{block.text}</h3>:<h4 key={key} id={block.id}>{block.text}</h4>;
      case 'list':{
        const items=block.items.map((nodes,i)=><li key={i}><Rich nodes={nodes}/></li>);
        return block.ordered?<ol key={key}>{items}</ol>:<ul key={key}>{items}</ul>;
      }
      case 'quote':return <BlogQuote key={key} attribution={block.attribution}><Rich nodes={block.content}/></BlogQuote>;
      case 'callout':return <BlogCallout key={key} title={block.title??(block.tone==='warning'?(locale==='fr'?'Attention':'Warning'):(locale==='fr'?'À retenir':'Note'))} tone={block.tone??'info'}><JsonBlockRenderer blocks={block.blocks} locale={locale}/></BlogCallout>;
      case 'cards':return <div key={key} className="blog-ds__card-grid">{block.items.map((card,i)=><BlogInfoCard key={i} number={card.number} title={card.title} description={<Rich nodes={card.description}/>}>
        {card.href?<a href={card.href} className="blog-ds__json-card-link">{card.actionLabel??(locale==='fr'?'En savoir plus':'Learn more')} →</a>:null}
      </BlogInfoCard>)}</div>;
      case 'table':return <div key={key} className="blog-ds__json-table-scroll" tabIndex={0} role="region" aria-label={block.caption}>
        <table><caption>{block.caption}</caption><thead><tr>{block.columns.map((col,i)=><th scope="col" key={i}>{col}</th>)}</tr></thead>
          <tbody>{block.rows.map((row,i)=><tr key={i}>{row.map((text,j)=>j===0?<th key={j} scope="row">{text}</th>:<td key={j}>{text}</td>)}</tr>)}</tbody>
        </table>
      </div>;
      case 'figure':return <figure key={key} className="blog-ds__figure">
        <Image src={block.src} alt={block.alt} width={block.width??1200} height={block.height??675} sizes="(max-width: 760px) 100vw, 760px" unoptimized={block.src.endsWith('.svg')} className="blog-ds__json-image"/>
        {block.caption?<figcaption>{block.caption}</figcaption>:null}
      </figure>;
      case 'code':return block.copyable===false?<pre key={key} className="blog-ds__json-code-plain"><code>{block.code}</code></pre>:<BlogCodeSample key={key} label={block.title??block.language} code={block.code}/>;
      case 'checklist':return <JsonChecklist key={key} storageKey={block.storageKey} items={block.items} locale={locale}/>;
      case 'accordion':return <div className="blog-ds__accordion" key={key}>{block.items.map((item,i)=><details key={i}><summary>{item.title}</summary><div className="blog-ds__json-accordion-content"><JsonBlockRenderer blocks={item.blocks} locale={locale}/></div></details>)}</div>;
      case 'custom':return <JsonCustomModule key={key} module={block}/>;
    }
  })}</>;
}
