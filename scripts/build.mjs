import {mkdir,writeFile,readFile,cp,copyFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {pages,detailPage} from '../src/pages.mjs';
import {services} from '../src/data.mjs';
import {document,hero,button} from '../src/components.mjs';
const root=process.cwd(),dist=path.join(root,'dist');
await mkdir(path.join(root,'public/assets'),{recursive:true});
for(const [pkg,file] of [['plus-jakarta-sans','plus-jakarta-sans-latin-wght-normal.woff2'],['inter','inter-latin-wght-normal.woff2']]){
 await copyFile(path.join(root,'node_modules/@fontsource-variable',pkg,'files',file),path.join(root,'public/assets',file));
 await copyFile(path.join(root,'node_modules/@fontsource-variable',pkg,'LICENSE'),path.join(root,'public/assets',pkg+'-LICENSE.txt'));
}
const favicon=await sharp('public/assets/logo.webp').extract({left:0,top:0,width:104,height:98}).resize(64,64,{fit:'contain',background:'#005344'}).png().toBuffer();
await writeFile('public/assets/favicon.png',favicon);
const logo=await sharp('public/assets/logo.webp').resize({height:270}).toBuffer();
const heroImage=await sharp('public/assets/hero-home.webp').resize({width:320}).toBuffer();
const socialText=Buffer.from('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#faf8f1"/><rect width="230" height="630" fill="#005344"/><text x="285" y="150" font-family="Arial" font-size="25" fill="#005344" font-weight="700">TIGA BIZ CENTRE</text><text x="285" y="250" font-family="Arial" font-size="54" fill="#003f35" font-weight="700">Less paperwork.</text><text x="285" y="319" font-family="Arial" font-size="54" fill="#003f35" font-weight="700">More possibility.</text><text x="285" y="425" font-family="Arial" font-size="27" fill="#253a33">Online business &amp; documentation support</text><text x="285" y="478" font-family="Arial" font-size="23" fill="#253a33">Malaysia · Sabah · Sarawak</text></svg>');
await sharp(socialText).composite([{input:logo,left:40,top:145},{input:heroImage,left:840,top:170}]).png().toFile('public/assets/social-card.png');
await mkdir(dist,{recursive:true});await cp(path.join(root,'public'),dist,{recursive:true});
const all=[...pages,...services.map(detailPage)];
for(const p of all){const dest=p.route==='/'?path.join(dist,'index.html'):path.join(dist,p.route.slice(1),'index.html');await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,document({...p,body:p.body()}));}
await writeFile(path.join(dist,'404.html'),document({route:'/404',page:'not-found',noindex:true,title:'Page not found | TIGA Biz Centre',description:'Find the service or information you need at TIGA Biz Centre.',body:hero('home','Let’s find your<br>next step.','This page could not be found. Explore our services or contact the team.')+button('Explore services','/services')}));
await writeFile(path.join(root,'src/routes.json'),JSON.stringify(all.map(p=>p.route),null,2));
await writeFile(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${all.map(p=>`<url><loc>__SITE_ORIGIN__${p.route}</loc></url>`).join('')}</urlset>`);
await writeFile(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: __SITE_ORIGIN__/sitemap.xml\n');
console.log(`Built ${all.length} rendered pages, clean routes, sitemap, original artwork and self-hosted fonts.`);
