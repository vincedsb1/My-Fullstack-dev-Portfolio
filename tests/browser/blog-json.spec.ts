import {test, expect} from '@playwright/test';

/** Test navigateur sans publication du brouillon JSON et sans changer les anciens articles. */
test('showcase : contrat JSON et cinq widgets SaaS',async ({page})=>{
  const response=await page.goto('/fr/blog/showcase');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main#main')).toHaveCount(1);
  await expect(page.locator('[data-module^="saas-"]')).toHaveCount(5);
  await expect(page.locator('[data-module="saas-language-matrix"] tbody td')).toHaveCount(36);
  const demo=page.locator('[data-module="saas-language-demo"]');
  await expect(demo.locator('select')).toHaveCount(2);
  await demo.locator('select').first().selectOption('en');
  await demo.locator('select').nth(1).selectOption('ja');
  await expect(demo.locator('select').first()).toHaveValue('en');
  const decision=page.locator('[data-module="saas-decision-tree"]');
  await expect(decision.locator('fieldset')).toHaveCount(3);
  for(const fieldset of await decision.locator('fieldset').all()){
    await fieldset.getByRole('button',{name:'Oui'}).click();
  }
  await expect(decision.getByText('Plusieurs langues peuvent se justifier dès le lancement.')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));
  expect(new Set(ids).size).toBe(ids.length);
  for(const width of [320,390,820,1440]){
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`showcase ${width}px`).toBe(true);
  }
});

test('articles MDX restent publiés ; preview JSON reste invisible en production',async ({page})=>{
  for(const url of ['/fr/blog/internationaliser-saas-lancement','/fr/blog/guide-premier-emploi-developpeur']){
    const r=await page.goto(url);expect(r?.status()).toBe(200);
  }
  const response=await page.goto('/fr/blog/json-preview');
  expect(response?.status()).toBe(404);
});
