import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import worker from '../src/worker.mjs';
import {enquiryUrl} from '../public/enquiry.js';
const routes=JSON.parse(await readFile('src/routes.json','utf8'));
const readRoute=r=>readFile(path.join('dist',r==='/'?'index.html':r.slice(1)+'/index.html'),'utf8');
test('all 19 rendered routes have unique metadata, valid structured data and working internal targets',async()=>{
 assert.equal(routes.length,19);const titles=new Set();
 for(const route of routes){const html=await readRoute(route);const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title));titles.add(title);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route);
  assert(html.includes(`href="__SITE_ORIGIN__${route}"`),route);
  assert(!/Brunei|1600 1875|1008 1875|60116001875|601110081875/i.test(html),route);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  assert.equal(graph.find(i=>i['@type']==='Organization').telephone,'+60 11-6128 3216');
  if(route.startsWith('/services/'))assert(graph.some(i=>i['@type']==='Service'));
  for(const [,url]of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[^\"]*)"/g)){
   if(routes.includes(url)||url==='/')continue;
   assert((await stat(path.join('dist',url.slice(1)))).isFile(),`${route}: ${url}`);
  }
 }
});
test('clean URL redirects preserve query parameters',async()=>{
 for(const [from,to]of [['/about.html','/about'],['/about/','/about'],['/about/index.html','/about'],['/index.html','/']]){
  const res=await worker.fetch(new Request('https://example.test'+from+'?source=check'),{});
  assert.equal(res.status,301);assert.equal(res.headers.get('location'),'https://example.test'+to+'?source=check');
 }
});
test('Worker replaces origin in HTML, sitemap and robots, preserves status and handles HEAD',async()=>{
 for(const [route,type]of [['/about','text/html'],['/sitemap.xml','application/xml'],['/robots.txt','text/plain']]){
  const env={SITE_URL:'https://tiga.example/path',ASSETS:{fetch:async()=>new Response('__SITE_ORIGIN__/about',{headers:{'content-type':type,etag:'old','content-length':'99'}})}};
  const res=await worker.fetch(new Request('https://preview.example'+route),env);
  assert.equal(await res.text(),'https://tiga.example/about');assert.equal(res.headers.get('etag'),null);
  assert(res.headers.get('Content-Security-Policy').includes("object-src 'none'"));
  const head=await worker.fetch(new Request('https://preview.example'+route,{method:'HEAD'}),env);assert.equal(await head.text(),'');
 }
 const missing=await worker.fetch(new Request('https://example.test/missing'),{ASSETS:{fetch:async()=>new Response('Not found',{status:404,headers:{'content-type':'text/html'}})}});assert.equal(missing.status,404);
 const post=await worker.fetch(new Request('https://example.test/contact',{method:'POST'}),{});assert.equal(post.status,405);
});
test('sitemap covers exactly the rendered pages and missing page is noindex',async()=>{
 const xml=await readFile('dist/sitemap.xml','utf8');assert.equal((xml.match(/<loc>/g)||[]).length,19);for(const r of routes)assert(xml.includes('__SITE_ORIGIN__'+r+'</loc>'));
 assert((await readFile('dist/404.html','utf8')).includes('noindex,follow'));
});
test('WhatsApp enquiry keeps special characters and targets the confirmed number',()=>{
 const url=new URL(enquiryUrl({name:'A & B',phone:'+60 11 1234567',service:'Forms & Documentation',message:'Line 1\n100% ready? #yes'},'601161283216'));
 assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/601161283216');
 assert.equal(url.searchParams.get('text'),'Hello TIGA Biz Centre,\n\nName: A & B\nPhone / WhatsApp: +60 11 1234567\nService: Forms & Documentation\n\nMy requirements: Line 1\n100% ready? #yes\n\nPlease guide me on the next steps.');
 assert.throws(()=>enquiryUrl({name:'A',phone:'1234567',service:'Test'},'bad-destination'));
});
test('telephone pattern compiles in modern browsers and rejects invalid input',async()=>{
 const html=await readRoute('/contact');const pattern=html.match(/pattern="([^"]+)"/)[1];const re=new RegExp('^(?:'+pattern+')$','v');
 assert(re.test('+60 (11) 6128-3216'));assert(!re.test('hello'));assert(!re.test('123'));assert(html.includes('data-phone="601161283216"'));
});
