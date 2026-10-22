import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

test('patch SEO appliqué et idempotent sur structure héritée',()=>{
  const root=mkdtempSync(path.join(os.tmpdir(),'seo-json-patch-'));
  try{
    mkdirSync(path.join(root,'scripts'));
    const f=path.join(root,'scripts/test-blog-seo.mjs');
    writeFileSync(f,'import { readAllBlogArticles } from "../src/lib/blog/article-source.mjs";\nconst articles = readAllBlogArticles();\n    } else {\n      const firstHeading = article.body.match(/^##\\s+(.+)$/m)?.[1]?.trim();\n');
    const script=path.resolve(import.meta.dirname,'../scripts/patch-blog-json-seo-tests.mjs');
    const first=spawnSync(process.execPath,[script],{cwd:root,encoding:'utf8'});
    assert.equal(first.status,0,first.stderr);
    const once=readFileSync(f,'utf8');
    assert.match(once,/validateMergedBlogArticles/);
    assert.match(once,/article\.format === "json"/);
    const second=spawnSync(process.execPath,[script],{cwd:root,encoding:'utf8'});
    assert.equal(second.status,0,second.stderr);
    assert.equal(readFileSync(f,'utf8'),once);
  }finally{rmSync(root,{recursive:true,force:true});}
});
