import {enquiryUrl} from './enquiry.js';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=$('.menu-toggle'),sidebar=$('.sidebar'),scrim=$('.menu-scrim');
function closeMenu(){document.body.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');if(scrim)scrim.hidden=true;}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));scrim.hidden=!open;if(open)sidebar.querySelector('nav a')?.focus();});
scrim?.addEventListener('click',closeMenu);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){closeMenu();menu.focus();}if(e.key==='Tab'&&document.body.classList.contains('menu-open')){const focusables=[menu,...$$('a',sidebar)],first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const size=$('#text-size');let larger=false;try{larger=localStorage.getItem('tiga-large-text')==='true'}catch{}
function setSize(on){document.body.classList.toggle('large-text',on);size?.setAttribute('aria-pressed',String(on));size?.setAttribute('aria-label',on?'Use standard text size':'Increase text size');}
setSize(larger);size?.addEventListener('click',()=>{larger=!larger;setSize(larger);try{localStorage.setItem('tiga-large-text',String(larger))}catch{}});
for(const scope of $$('.filter-scope')){
 const items=$$('.filter-item',scope),buttons=$$('[data-filter]',scope),input=$('input[type=search]',scope),status=$('.filter-status',scope),empty=$('.empty-state',scope);let category='All';
 function apply(){const term=(input?.value||'').trim().toLocaleLowerCase();let count=0;items.forEach(item=>{const show=(category.startsWith('All')||item.dataset.category===category)&&item.textContent.toLocaleLowerCase().includes(term);item.hidden=!show;if(show)count++;});if(status)status.textContent=`${count} ${scope.dataset.scope==='faqs'?'questions':'results'} shown`;if(empty)empty.hidden=count>0;$('.service-directory',scope)?.classList.toggle('is-filtered',count!==items.length);const reset=$('.reset-filter',scope);if(reset)reset.hidden=category==='All';}
 buttons.forEach(btn=>btn.addEventListener('click',()=>{category=btn.getAttribute('aria-pressed')==='true'&&scope.dataset.scope==='faqs'?'All':btn.dataset.filter;buttons.forEach(b=>{const chosen=b.dataset.filter===category;b.setAttribute('aria-pressed',String(chosen));b.classList.toggle('selected',chosen);});apply();}));input?.addEventListener('input',apply);
 const requested=new URLSearchParams(location.search).get('category');if(requested){const b=buttons.find(b=>b.dataset.filter===requested);b?.click();}apply();
}
const form=$('#enquiry-form');
form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const name=$('#name').value.trim(),phone=$('#phone').value.trim(),service=$('#service').value,message=$('#message').value.trim();if(name.length<2){$('#name').setCustomValidity('Please enter your name.');$('#name').reportValidity();return;}if(phone.replace(/\D/g,'').length<7){$('#phone').setCustomValidity('Please enter at least seven digits.');$('#phone').reportValidity();return;}$('#form-status').textContent='Opening WhatsApp. Review your message before sending.';location.assign(enquiryUrl({name,phone,service,message},form.dataset.phone));});
$('#name')?.addEventListener('input',e=>e.target.setCustomValidity(''));
$('#phone')?.addEventListener('input',e=>e.target.setCustomValidity(''));
const requestedService=new URLSearchParams(location.search).get('service');if(requestedService&&$('#service')){const option=[...$('#service').options].find(o=>o.value===requestedService);if(option)$('#service').value=option.value;}
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),art=$('.parallax'),back=$('#back-top');let scheduled=false;
function updateScroll(){if(back)back.hidden=scrollY<600;if(art&&!reduced.matches&&innerWidth>900)art.style.setProperty('--parallax',Math.min(scrollY*.035,18)+'px');scheduled=false;}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});back?.addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
if(!reduced.matches&&'IntersectionObserver'in window){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target);}}),{threshold:.08});$$('.main>section').forEach(e=>obs.observe(e));}
if(location.hash.startsWith('#/')){const route=location.hash.slice(1);const mapped={'/home':'/','/about':'/about','/services':'/services','/portfolio':'/portfolio','/contact':'/contact'};if(mapped[route])location.replace(mapped[route]);}
