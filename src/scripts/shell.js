const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const items=[...document.querySelectorAll('[data-reveal]')];
const countUp=el=>{const end=Number(el.dataset.count);if(!Number.isFinite(end)||reduce){el.textContent=String(end);return;}const t0=performance.now(),dur=1100;const step=now=>{const k=Math.min(1,(now-t0)/dur);el.textContent=String(Math.round(end*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(step);};requestAnimationFrame(step);};
if(reduce||!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('in'));document.querySelectorAll('[data-count]').forEach(countUp);}
else{const io=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;e.target.classList.add('in');e.target.querySelectorAll('[data-count]').forEach(countUp);if(e.target.matches('[data-count]'))countUp(e.target);io.unobserve(e.target);}},{threshold:.12,rootMargin:'0px 0px -6% 0px'});items.forEach(el=>io.observe(el));}
const drawer=document.getElementById('drawer'),openBtn=document.querySelector('[data-open-drawer]');
if(drawer&&openBtn&&typeof drawer.showModal==='function'){openBtn.addEventListener('click',()=>{drawer.showModal();openBtn.setAttribute('aria-expanded','true');});drawer.addEventListener('close',()=>openBtn.setAttribute('aria-expanded','false'));drawer.addEventListener('click',e=>{const t=e.target;if(t===drawer||(t instanceof Element&&(t.closest('[data-close-drawer]')||t.closest('a'))))drawer.close();});}
const header=document.querySelector('.site-header');
if(header){const onScroll=()=>header.classList.toggle('is-scrolled',window.scrollY>8);window.addEventListener('scroll',onScroll,{passive:true});onScroll();}
