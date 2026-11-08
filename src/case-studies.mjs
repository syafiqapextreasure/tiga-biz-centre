import {projects} from './profile.mjs';
import {hero,icon,esc,button,whatsapp,ticks} from './components.mjs';
export const caseStudies=[
 {id:'volsar-group',heading:'Offshore workforce.<br>Coordinated documentation.',focus:'Recruitment Process Outsourcing (RPO) and manpower documentation for offshore energy operations.',scope:['Specialised personnel coordination','Manpower documentation support','Documentation protocols for offshore operations'],related:['recruitment-manpower-support','foreign-worker-documentation']},
 {id:'transwater-api',heading:'Technical teams.<br>Organised paperwork.',focus:'Recruitment support and technical personnel documentation for plant operations at SAMUR in Sipitang, Sabah.',scope:['Coordination of workforce requirements','Technical personnel documentation','Statutory documentation coordination for plant operations'],related:['recruitment-manpower-support','foreign-worker-documentation']}
].map(c=>{
 const p=projects.find(p=>p.id===c.id);
 return {...c,route:'/portfolio/'+c.id,page:'case-study',title:p.title+' — Project Case Study | TIGA Biz Centre',description:p.summary+' '+p.location+'.',project:p,body:()=>
 hero('portfolio',c.heading,esc(p.title)+' · '+esc(p.location))+
 `<section class="case-overview"><p class="category">Project case study</p><h2>${esc(p.title)}</h2><p>${esc(p.summary)}</p><dl class="case-facts"><div><dt>Sector</dt><dd>${esc(p.sector)}</dd></div><div><dt>Location</dt><dd>${esc(p.location)}</dd></div><div><dt>Service area</dt><dd>${esc(p.category)}</dd></div></dl></section>
 <section class="sage-panel detail-preparation">${icon(p.icon)}<div><h2>Project focus</h2><p>${esc(c.focus)}</p></div></section>
 <section class="detail-content"><div class="section-title"><h2>Scope of support</h2><span aria-hidden="true"></span></div>${ticks(c.scope).replace('class="tick-list"','class="tick-list scope-grid scope-compact"')}<p class="case-description">${esc(p.details)}</p></section>
 <section class="related-services"><h2>Explore related support</h2><p>For a similar enquiry, describe the roles involved, work location, document status and intended timeline. TIGA provides online coordination across Malaysia, especially Sabah and Sarawak.</p><div class="related-links">${button('Recruitment & manpower support','/services/recruitment-manpower-support','secondary')}${button('Foreign worker documentation','/services/foreign-worker-documentation','secondary')}</div></section>
 <section class="green-panel cta"><div><h2>Discuss your workforce requirements.</h2><p>Start with your scope, location and timeline.</p></div>${whatsapp('Discuss a similar request','outline-light','workforce and documentation coordination')}</section><a class="text-link" href="/portfolio#${p.id}">← Back to the portfolio</a>`};
});
