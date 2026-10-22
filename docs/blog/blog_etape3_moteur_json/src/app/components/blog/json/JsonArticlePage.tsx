import type {JsonBlogArticle} from '@/lib/blog/json-types';
import {BlogArticleHero,BlogAuthorCard,BlogBreadcrumbs,BlogNextArticle,BlogPageFooter,BlogReadingLayout,BlogSection,BlogSiteHeader} from '../design-system/BlogUI';
import {BlogBackToTop,BlogPrintButton,BlogReadingNavigation} from '../design-system/BlogReadingControls';
import {JsonCustomModule} from './JsonCustomRegistry';
import JsonBlockRenderer from './JsonBlockRenderer';

export default function JsonArticlePage({article,readingMinutes,related=[]}:{
  article:JsonBlogArticle;
  readingMinutes:number;
  related?:Array<{slug:string;title:string}>;
}) {
  const locale=article.meta.locale;
  const fr=locale==='fr';
  const publishedLabel=new Intl.DateTimeFormat(fr?'fr-FR':'en-US',{dateStyle:'long',timeZone:'UTC'}).format(new Date(`${article.meta.publishedAt}T00:00:00.000Z`));
  const toc=article.sections.map(section=>({id:section.id,label:section.title}));
  return <div className="blog-ds" id="blog-article-top">
    <BlogSiteHeader locale={locale} shareTitle={article.meta.title} progressTargetId="blog-article-body"><BlogPrintButton/></BlogSiteHeader>
    <main className="blog-ds__main">
      <BlogBreadcrumbs items={[{label:'Portfolio',href:`/${locale}`},{label:'Blog',href:`/${locale}/blog`},{label:article.meta.title}]} locale={locale}/>
      <article>
        <BlogArticleHero category={article.meta.category} title={article.meta.title} excerpt={article.meta.excerpt}
          publishedLabel={publishedLabel} publishedAt={article.meta.publishedAt}
          authorRole={fr?"Développeur Fullstack":"Full-stack developer"}
          readingLabel={`${readingMinutes} ${fr?'min de lecture':'min read'}`}
          ctaTarget="blog-article-body" ctaLabel={article.hero?.primaryCta?.label??(fr?'Commencer la lecture':'Start reading')}
          illustration={article.hero?.visual?<JsonCustomModule module={article.hero.visual}/>:undefined}/>
        <BlogReadingLayout navigation={<BlogReadingNavigation items={toc} locale={locale}/>}>
          <div id="blog-article-body" className="blog-ds__prose" tabIndex={-1}>
            {article.introBlocks?.length?<div className="blog-ds__json-intro"><JsonBlockRenderer blocks={article.introBlocks} locale={locale}/></div>:null}
            {article.sections.map((section,i)=><BlogSection key={section.id} id={section.id} title={section.title} number={section.number?String(i+1).padStart(2,'0'):undefined} eyebrow={section.eyebrow}>
              <JsonBlockRenderer blocks={section.blocks} locale={locale}/>
            </BlogSection>)}
            {article.afterBlocks?.length?<div className="blog-ds__json-after"><JsonBlockRenderer blocks={article.afterBlocks} locale={locale}/></div>:null}
            <BlogAuthorCard locale={locale}/>
            {related.map(rel=><BlogNextArticle key={rel.slug} title={rel.title} href={`/${locale}/blog/${rel.slug}`} eyebrow={fr?'Pour continuer la lecture':'Continue reading'}/>)}
          </div>
        </BlogReadingLayout>
      </article>
      <BlogPageFooter locale={locale}/>
    </main>
    <BlogBackToTop targetId="blog-article-top"/>
  </div>;
}
