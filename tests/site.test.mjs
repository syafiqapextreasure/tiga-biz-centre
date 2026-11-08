import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import worker from '../src/worker.mjs';
import {enquiryUrl} from '../public/enquiry.js';
import {projects,profileTeam,profileMetrics} from '../src/profile.mjs';
import {services} from '../src/data.mjs';
import {serviceGuides} from '../src/service-guides.mjs';
import {malayContent} from '../src/locales.mjs';
import {caseStudies} from '../src/case-studies.mjs';
import {esc} from '../src/components.mjs';
const routes=JSON.parse(await readFile('src/routes.json','utf8'));
const readRoute=r=>readFile(path.join('dist',r==='/'?'index.html':r.slice(1)+'/index.html'),'utf8');
test('all 25 rendered routes have unique metadata, valid structured data and working internal targets',async()=>{
 assert.equal(routes.length,25);const titles=new Set();
 for(const route of routes){const html=await readRoute(route);const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title));titles.add(title);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route);
  assert(html.includes(`href="__SITE_ORIGIN__${route}"`),route);
  assert(!/1600 1875|1008 1875|60116001875|601110081875/i.test(html),route);
  assert(!/cosmos|kosmos|original group profile|reported in profile|historical references|clearly attributed/i.test(html),route+' contains legacy branding');
  // Project locations do not expand the current service coverage.
  if(route!=='/portfolio')assert(!/Brunei/i.test(html),route);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  assert.equal(graph.find(i=>i['@type']==='Organization').telephone,'+60 11-6128 3216');
  if(route.startsWith('/services/')||route.startsWith('/ms/'))assert(graph.some(i=>i['@type']==='Service'));
  for(const [,url]of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[^\"]*)"/g)){
   if(routes.includes(url)||url==='/')continue;
   assert((await stat(path.join('dist',url.slice(1)))).isFile(),`${route}: ${url}`);
  }
 }
});
test('all 21 portfolio entries retain identities, sectors, scope and expandable detail',async()=>{
 const expected=['volsar-group','applus-velosi','transwater-api','honda-factory','esi-sampling','ms-time','kyochoon','doc-work-permits','doc-expat-mm2h','doc-indo-philippine','doc-international-students','doc-sector-quotas','doc-family-legal','csr-kbs','csr-sl1m','csr-bea-outreach','csr-brunei-expo','csr-bea-csr','csr-eccp-mindanao','csr-mullion-japan','csr-brunei-japan'];
 assert.deepEqual(projects.map(p=>p.id),expected);
 const html=await readRoute('/portfolio');
 assert.equal((html.match(/class="panel project-card filter-item"/g)||[]).length,21);
 assert.equal((html.match(/class="project-details"/g)||[]).length,21);
 assert.deepEqual(['Recruitment & permits','Documentation','Training & CSR'].map(c=>projects.filter(p=>p.category===c).length),[7,6,8]);
 for(const p of projects)for(const field of ['title','entity','sector','location','summary','details'])assert(html.includes(esc(p[field])),`${p.id}: ${field}`);
 assert(html.includes('21 projects &amp; programmes')||html.includes('21 projects & programmes'));
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert(!JSON.stringify(graph).includes('Brunei'),'Historical locations must not enter service coverage schema');
});
test('team, experience and full service descriptions remain available',async()=>{
 const html=await readRoute('/about');
 assert.equal(profileTeam.length,3);assert.equal(profileMetrics.length,5);
 for(const p of profileTeam)for(const k of ['name','role','focus'])assert(html.includes(esc(p[k])));
 for(const p of profileMetrics)for(const k of ['metric','label','description'])assert(html.includes(esc(p[k])));
 for(const s of services){const page=await readRoute('/services/'+s.slug);assert(s.description.length>100);assert(page.includes(esc(s.description)));}
});
test('clean URL redirects preserve query parameters',async()=>{
 for(const [from,to]of [['/about.html','/about'],['/about/','/about'],['/about/index.html','/about'],['/index.html','/']]){
  const res=await worker.fetch(new Request('https://example.test'+from+'?source=check'),{});
  assert.equal(res.status,301);assert.equal(res.headers.get('location'),'https://example.test'+to+'?source=check');
 }
});

test('public domain variants consolidate to HTTPS www in one hop without redirecting local preview',async()=>{
 for(const host of ['http://tigabizcentre.com','http://www.tigabizcentre.com','https://tigabizcentre.com','https://tiga-biz-centre.mail-82f.workers.dev']){
  for(const route of ['/about.html','/about/','/about/index.html','/assets/logo.webp','/robots.txt']){
   const res=await worker.fetch(new Request(host+route+'?utm_source=test'),{});
   assert.equal(res.status,301);
   const target=route.startsWith('/about')?'/about':route;
   assert.equal(res.headers.get('location'),'https://www.tigabizcentre.com'+target+'?utm_source=test');
  }
 }
 const env={ASSETS:{fetch:async()=>new Response('__SITE_ORIGIN__/',{headers:{'content-type':'text/html'}})}};
 for(const origin of ['https://www.tigabizcentre.com','http://127.0.0.1:5186']){
  const res=await worker.fetch(new Request(origin+'/'),env);
  assert.equal(res.status,200);assert.equal(await res.text(),origin+'/');
 }
 const head=await worker.fetch(new Request('http://tigabizcentre.com/about',{method:'HEAD'}),{});
 assert.equal(head.status,301);assert.equal(await head.text(),'');
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
 const xml=await readFile('dist/sitemap.xml','utf8');assert.equal((xml.match(/<loc>/g)||[]).length,25);for(const r of routes)assert(xml.includes('__SITE_ORIGIN__'+r+'</loc>'));
 assert((await readFile('dist/404.html','utf8')).includes('noindex,follow'));
});

test('service answers match visible content and Malay language alternates are reciprocal and self-canonical',async()=>{
 for(const s of services){
  const html=await readRoute('/services/'+s.slug),guide=serviceGuides[s.slug];
  assert(html.includes(esc(guide.intro)));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const faq=graph.find(n=>n['@type']==='FAQPage');assert.equal(faq.mainEntity.length,guide.answers.length);
  for(const [i,[q,a]]of guide.answers.entries()){assert(html.includes(esc(q)));assert(html.includes(esc(a)));assert.equal(faq.mainEntity[i].acceptedAnswer.text,a);}
 }
 for(const [slug,m]of Object.entries(malayContent)){
  const en='/services/'+slug;
  for(const route of [en,m.route]){const html=await readRoute(route);
   assert(html.includes('hreflang="en-MY" href="__SITE_ORIGIN__'+en+'"'));
   assert(html.includes('hreflang="ms-MY" href="__SITE_ORIGIN__'+m.route+'"'));
   assert(html.includes('rel="canonical" href="__SITE_ORIGIN__'+route+'"'));
   assert(html.includes('href="'+(route===en?m.route:en)+'" hreflang='));
  }
  const html=await readRoute(m.route);assert(html.includes('<html lang="ms-MY">'));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const faq=graph.find(n=>n['@type']==='FAQPage');assert.equal(faq.mainEntity.length,m.answers.length);
  for(const [i,[q,a]]of m.answers.entries()){assert(html.includes(esc(q)));assert(html.includes(esc(a)));assert.equal(faq.mainEntity[i].acceptedAnswer.text,a);}
 }
});

test('case studies preserve the existing portfolio record and are linked from relevant services',async()=>{
 const portfolio=await readRoute('/portfolio');
 for(const c of caseStudies){const html=await readRoute(c.route);
  for(const field of ['title','location','sector','summary','details'])assert(html.includes(esc(c.project[field])),c.id+': '+field);
  assert(portfolio.includes('href="'+c.route+'"'));
  for(const slug of c.related)assert((await readRoute('/services/'+slug)).includes('href="'+c.route+'"'));
 }
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
