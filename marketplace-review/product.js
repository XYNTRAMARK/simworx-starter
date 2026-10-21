'use strict';
(async()=>{
 const $=id=>document.getElementById(id),params=new URLSearchParams(location.search),id=params.get('id'),kind=params.get('kind');
 const secure=value=>{try{const u=new URL(String(value));return u.protocol==='https:'&&!u.username&&!u.password?u.href:''}catch{return ''}};
 try{
  if(!/^[0-9a-f-]{36}$/i.test(id||'')||!['used','product'].includes(kind))throw new Error('This advert link is incomplete.');
  const response=await fetch('https://qzyqnuljdwimtekxdeac.supabase.co/functions/v1/simstarter-feed?include_used=true',{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error('The Marketplace is temporarily unavailable. Please try again.');
  const feed=await response.json(),p=(feed.products||[]).find(p=>p.id===id&&p.raw?.entity_kind===kind);if(!p)throw new Error('This advert is no longer available. It may have sold, expired, been paused or archived.');
  document.title=p.title+' — SIMSTARTER Marketplace';$('title').textContent=p.title;$('seller').textContent='Seller: '+p.vendor;$('price').textContent=p.price;$('condition').textContent=(p.raw?.condition||p.raw?.item_condition||p.condition||'').replaceAll('_',' ');$('description').textContent=p.raw?.description||p.description||'';
  const spans=p.raw?.description_format;if(Array.isArray(spans)&&spans.every(s=>s&&typeof s.t==='string')&&spans.map(s=>s.t).join('').trim()===$('description').textContent.trim()){$('description').replaceChildren();for(const span of spans){let node=document.createTextNode(span.t);for(const [flag,tag]of [['b','strong'],['i','em'],['u','u']])if(span[flag]){const wrapper=document.createElement(tag);wrapper.append(node);node=wrapper}$('description').append(node)}}
  $('location').textContent=p.raw?.location?[p.raw.location.city,p.raw.location.region,p.raw.location.country_code].filter(Boolean).join(', '):'';
  const images=[p.image_url,...(p.raw?.images||[]).map(p=>p.url)].map(secure).filter((u,i,a)=>u&&a.indexOf(u)===i);
  if(images.length){$('hero').src=images[0];$('hero').hidden=false;for(const [i,url] of images.entries()){const button=document.createElement('button'),image=document.createElement('img');button.type='button';button.setAttribute('aria-label','View photograph '+(i+1));image.src=url;image.alt='Advert photograph '+(i+1);button.append(image);button.onclick=()=>$('hero').src=url;$('photos').append(button)}}
  const target=secure(p.raw?.checkout_url||p.raw?.external_url||p.url);if(target){$('buy').href=target;$('buy').hidden=false}else $('contact').hidden=false;
  $('advert').hidden=false;$('status').textContent='Live advert';
 }catch(error){$('status').textContent=error.message||'Could not load this advert. Please try again.';}
})();
