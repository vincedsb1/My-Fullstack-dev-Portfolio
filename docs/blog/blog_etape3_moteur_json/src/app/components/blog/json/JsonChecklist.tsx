'use client';
import {useEffect, useState} from 'react';

/** Une instance ne change jamais son storageKey ni ses IDs une fois publiée. */
export default function JsonChecklist({storageKey,items,locale="fr"}:{storageKey:string;items:ReadonlyArray<{id:string;label:string}>;locale?:"fr"|"en"}) {
  const [ready,setReady]=useState(false);
  const [checked,setChecked]=useState<Record<string,boolean>>({});
  useEffect(()=>{
    try {
      const data=JSON.parse(window.localStorage.getItem(storageKey)??'{}');
      if(data && typeof data==='object' && !Array.isArray(data)){
        setChecked(Object.fromEntries(items.map(item=>[item.id,data[item.id]===true])));
      }
    } catch {setChecked({});}
    setReady(true);
  },[storageKey,items]);
  const count=items.filter(item=>checked[item.id]).length;
  function update(next:Record<string,boolean>) {
    setChecked(next);
    try {window.localStorage.setItem(storageKey,JSON.stringify(next));}catch{ /* reste utilisable sans stockage */ }
  }
  return <section className="blog-ds__json-checklist" aria-label={locale==="fr"?"Liste d’actions":"Action checklist"}>
    <div className="blog-ds__json-checklist-head">
      <span aria-live="polite">{ready?count:0}/{items.length} {locale==='fr'?(items.length===1?'étape terminée':'étapes terminées'):(items.length===1?'completed step':'completed steps')}</span>
      <button type="button" onClick={()=>update({})} disabled={!ready || count===0}>{locale==="fr"?"Réinitialiser":"Reset"}</button>
    </div>
    <progress max={items.length} value={ready?count:0} aria-label={locale==="fr"?"Progression de la checklist":"Checklist progress"} />
    {items.map(item=><label key={item.id} className="blog-ds__json-checklist-row">
      <input type="checkbox" checked={ready?Boolean(checked[item.id]):false} disabled={!ready}
        onChange={event=>update({...checked,[item.id]:event.target.checked})} />
      <span>{item.label}</span>
    </label>)}
  </section>;
}
