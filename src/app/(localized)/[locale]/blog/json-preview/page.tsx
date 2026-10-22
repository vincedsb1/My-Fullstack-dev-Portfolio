import path from 'node:path';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {readJsonBlogArticleFile,getJsonReadingText} from '@/lib/blog/json-source.mjs';
import {estimateReadingTime} from '@/lib/blog/reading-time';
import JsonArticlePage from '@/features/blog/json/JsonArticlePage';


export const dynamic='force-static';
export const dynamicParams=false;
export function generateStaticParams(){return [{locale:'fr'}];}
export const metadata:Metadata={title:'Prévisualisation JSON du blog (développement)',robots:{index:false,follow:false}};
export default async function JsonPreview({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  if(locale!=='fr'||process.env.NODE_ENV==='production')notFound();
  const fixture=readJsonBlogArticleFile(path.join(process.cwd(),'src/content/blog-json/fr/json-demo-blog.json'));
  return <JsonArticlePage article={fixture.data} readingMinutes={estimateReadingTime(getJsonReadingText(fixture.data))}/>;
}
