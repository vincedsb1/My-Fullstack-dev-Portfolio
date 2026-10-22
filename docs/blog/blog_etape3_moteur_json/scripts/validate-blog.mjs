import {readAllBlogArticles} from '../src/lib/blog/article-source.mjs';
import {readAllJsonBlogArticles,validateMergedBlogArticles} from '../src/lib/blog/json-source.mjs';
import {validateBlogLinks} from './validate-blog-links.mjs';

const articles=validateMergedBlogArticles([...readAllBlogArticles(),...readAllJsonBlogArticles()]);
validateBlogLinks(articles);
const published=articles.filter(a=>a.metadata.status==='published');
console.info(`[blog] Vérifiés : ${published.length} publié(s), ${articles.length-published.length} brouillon(s), ${articles.filter(a=>a.format==='json').length} article(s) JSON.`);
