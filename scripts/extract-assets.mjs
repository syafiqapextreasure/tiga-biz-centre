import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(), out=path.join(root,'public/assets');
await mkdir(out,{recursive:true});
const refs={home:'03-emerald-service-hub.png',about:'06-about.png',services:'07-services.png',process:'08-our-process.png',portfolio:'09-portfolio.png',faqs:'10-faqs.png',contact:'11-contact.png'};
const specs=[
 ['logo','home',[25,43,118,174],'dark'],
 ['hero-home','home',[707,63,295,265],'light'],
 ['hero-about','about',[723,62,280,231],'light'],
 ['hero-services','services',[746,64,254,266],'light'],
 ['hero-process','process',[707,63,295,265],'light'],
 ['hero-portfolio','portfolio',[706,76,294,215],'light'],
 ['hero-faqs','faqs',[742,63,251,230],'light'],
 ['hero-contact','contact',[685,89,304,241],'light'],
 ['briefcase','home',[237,431,57,56],'light'],
 ['document','home',[500,432,50,57],'light'],
 ['gear','home',[750,430,59,61],'light'],
 ['chat-light','home',[277,970,64,60],'dark'],
 ['review-light','home',[552,968,68,62],'dark'],
 ['check-light','home',[841,969,59,62],'dark'],
 ['chat-gold','home',[57,1425,52,49],'dark'],
 ['checklist','about',[209,679,60,70],'light'],
 ['clock','about',[483,678,75,72],'light'],
 ['pages','about',[752,679,83,73],'light'],
 ['chat','process',[277,377,92,91],'light'],
 ['review','process',[280,598,94,96],'light'],
 ['check','process',[281,791,86,92],'light'],
 ['hardhat','portfolio',[207,535,82,69],'light'],
 ['people','portfolio',[614,535,80,64],'light'],
 ['file','portfolio',[210,734,61,63],'light'],
 ['education','portfolio',[622,735,71,67],'light'],
 ['presentation','portfolio',[210,930,66,62],'light'],
 ['leaf','portfolio',[617,930,78,65],'light'],
 ['whatsapp','contact',[195,460,63,65],'light'],
 ['phone','contact',[196,590,67,65],'light'],
 ['email','contact',[195,715,65,50],'light'],
 ['shield','contact',[213,1264,69,76],'light'],
 ['lock','faqs',[221,1159,74,87],'light'],
 ['faq-chat','faqs',[837,367,52,44],'light'],
 ['signpost','services',[207,1171,79,68],'light'],
 ['building-gold','about',[212,1154,45,45],'light'],
 ['people-gold','about',[209,1211,53,43],'light'],
 ['id-gold','about',[209,1269,57,42],'light'],
 ['checklist-light','services',[213,1308,59,75],'dark'],
 ['contact-chat','contact',[287,1106,65,64],'dark'],
 ['contact-review','contact',[552,1105,69,68],'dark'],
 ['contact-check','contact',[829,1103,77,70],'dark']
];
const manifest=[];
for(const [name,source,box,mode] of specs){
 const [left,top,width,height]=box;
 const image=sharp(path.join(root,'..',refs[source])).extract({left,top,width,height});
 const {data,info}=await image.ensureAlpha().raw().toBuffer({resolveWithObject:true});
 // Remove only the original flat background; preserve original coloured strokes.
 for(let p=0;p<data.length;p+=4){
  const [r,g,b]=[data[p],data[p+1],data[p+2]];
  const isBackground=mode==='light'?(r>150&&g>150&&b>140&&Math.max(r,g,b)-Math.min(r,g,b)<36):(g>r*1.20&&g>b*1.06&&r<70&&g<142&&b<132);
  if(isBackground)data[p+3]=0;
 }
 const trimmed=sharp(data,{raw:info}).trim({threshold:1});
 const padded=['people','leaf'].includes(name)?trimmed.extend({top:4,bottom:4,left:4,right:4,background:{r:0,g:0,b:0,alpha:0}}):trimmed;
 const png=await padded.png().toBuffer();
 const webp=await sharp(png).webp({lossless:true,effort:6}).toBuffer();
 await writeFile(path.join(out,name+'.webp'),webp);
 const meta=await sharp(webp).metadata();
 manifest.push({name,source:refs[source],crop:box,width:meta.width,height:meta.height,bytes:webp.length,compression:'lossless WebP',background:'Removed source background; original coloured strokes retained'});
}
for(const [name,box] of [['emerald-texture',[0,0,16,1536]],['panel-texture',[200,1064,790,10]],['ivory-texture',[180,0,500,25]]]){
 const [left,top,width,height]=box;
 const data=await sharp(path.join(root,'..',refs.home)).extract({left,top,width,height}).webp({lossless:true,effort:6}).toBuffer();
 await writeFile(path.join(out,name+'.webp'),data);
 manifest.push({name,source:refs.home,crop:box,bytes:data.length,compression:'lossless WebP; no pixel loss'});
}
await sharp(path.join(out,'logo.webp')).extract({left:0,top:0,width:104,height:98}).webp({lossless:true}).toFile(path.join(out,'logo-mark.webp'));
await writeFile(path.join(root,'docs/asset-manifest.json'),JSON.stringify(manifest,null,2));
console.log(`Extracted ${manifest.length} original assets; ${manifest.reduce((n,a)=>n+a.bytes,0).toLocaleString()} bytes total.`);
