'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const CONTACT = 'mailto:mrjoshuaability@gmail.com?subject=Let%E2%80%99s%20build%20something';
const FRAMES = ['/frames/01-hero.png', '/frames/02-awaken.png', '/frames/03-system.png', '/frames/04-flow.png', '/frames/05-orchestrate.png', '/frames/06-horizon.png'];
const NAV = [['The studio', '#about'], ['Our expertise', '#expertise'], ['The approach', '#approach'], ['Let’s talk', '#contact']];
const SERVICES = [
  { title: 'Software, with purpose.', short: 'Software', description: 'From the first idea to the final interaction. Fast, intuitive websites and applications that solve the right problem and feel effortless to use.', tags: ['Web applications', 'Client portals', 'Internal tools'], image: 2, caption: '01 / DIGITAL PRODUCTS' },
  { title: 'Workflows, without friction.', short: 'Automation', description: 'Give the repetitive work to a system. Connect your tools, move information where it belongs, and make room for the work that needs you.', tags: ['Business workflows', 'API integrations', 'Connected operations'], image: 4, caption: '02 / CONNECTED SYSTEMS' },
  { title: 'Intelligence, put to work.', short: 'Intelligent systems', description: 'Bring AI into the places where it makes a difference. Useful assistants and thoughtful workflows, designed with clear boundaries and human control.', tags: ['AI assistants', 'Knowledge workflows', 'Human-in-the-loop'], image: 3, caption: '03 / APPLIED INTELLIGENCE' },
];
const clamp = (v: number, low = 0, high = 1) => Math.min(high, Math.max(low, v));
const smooth = (start: number, end: number, v: number) => { const t = clamp((v - start) / (end - start)); return t * t * (3 - 2 * t); };

function Arrow({ className = '' }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
function Roll({ children }: { children: string }) {
  return <span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}

function useChoreography(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = element.querySelector<HTMLElement>('[data-hero]')!;
    const system = element.querySelector<HTMLElement>('[data-system]')!;
    const heroLayers = [...element.querySelectorAll<HTMLElement>('[data-hero-frame]')];
    const heroEdges = element.querySelector<HTMLElement>('.hero-bottom')!;
    const systemLayers = [...element.querySelectorAll<HTMLElement>('[data-system-frame]')];
    const introWords = [...element.querySelectorAll<HTMLElement>('[data-word]')];
    const reveals = [...element.querySelectorAll<HTMLElement>('[data-reveal]')];
    const intro = element.querySelector<HTMLElement>('[data-intro]')!;
    const footer = element.querySelector<HTMLElement>('[data-finale]')!;
    const bar = element.querySelector<HTMLElement>('[data-progress]')!;
    let animation = 0, previousTime = 0, position = window.scrollY;
    let reduced = preference.matches, active = true;
    function progress(section: HTMLElement, scroll: number) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const stageHeight = (section.firstElementChild as HTMLElement).offsetHeight; return clamp((scroll - top) / Math.max(1, section.offsetHeight - stageHeight));
    }
    function blend(layers: HTMLElement[], amount: number, zoom: number) {
      const phase = clamp(amount) * (layers.length - 1), lower = Math.floor(phase);
      const mix = smooth(0, 1, phase - lower);
      layers.forEach((layer, i) => {
        layer.style.opacity = String(i === lower ? 1 : i === lower + 1 ? mix : 0);
        layer.style.transform = 'scale(' + zoom + ')';
      });
    }
    function render(time: number) {
      const delta = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      const target = window.scrollY;
      position = reduced ? target : position + (target - position) * (1 - Math.exp(-delta / 105));
      if (Math.abs(target - position) < .2) position = target;
      const h = reduced ? 0 : progress(hero, position), s = reduced ? 0 : progress(system, position);
      element!.style.setProperty('--hero-copy-opacity', String(1 - smooth(.02, .24, h)));
      element!.style.setProperty('--hero-copy-scale', String(1 + h * 3.4));
      element!.style.setProperty('--hero-copy-y', (h * -150) + 'px');
      element!.style.setProperty('--hero-edge-opacity', String(1 - smooth(0, .15, h)));
      heroEdges.style.visibility = h > .14 ? 'hidden' : 'visible';
      heroEdges.inert = h > .14;
      element!.style.setProperty('--hero-statement-opacity', String(smooth(.47, .66, h) * (1 - smooth(.88, 1, h))));
      element!.style.setProperty('--hero-shade', String(smooth(.42, .7, h) * .36));
      element!.style.setProperty('--system-copy-opacity', String(1 - smooth(.18, .46, s)));
      element!.style.setProperty('--system-end-opacity', String(smooth(.48, .74, s)));
      element!.style.setProperty('--system-line-scale', String(reduced ? 1 : .12 + s * .88));
      blend(heroLayers, smooth(.08, .94, h), 1 + h * .58);
      blend(systemLayers, smooth(.2, .78, s), 1.18 - s * .18);
      const ip = reduced ? 1 : clamp((window.innerHeight * .84 - intro.getBoundingClientRect().top) / (window.innerHeight * .65));
      introWords.forEach((word, i) => { word.style.opacity = String(.18 + .82 * smooth(i / introWords.length - .15, (i + 1) / introWords.length, ip)); });
      const fp = reduced ? 1 : clamp((window.innerHeight - footer.getBoundingClientRect().top) / window.innerHeight);
      footer.style.setProperty('--finale-scale', String(1.16 - fp * .16));
      footer.style.setProperty('--finale-aperture', (32 + fp * 68) + '%');
      bar.style.transform = 'scaleX(' + clamp(target / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) + ')';
      element!.classList.toggle('header-scrolled', target > 80);
      animation = position !== target && active ? requestAnimationFrame(render) : 0;
    }
    function schedule() { if (!animation && active) animation = requestAnimationFrame(render); }
    function onPreference() { reduced = preference.matches; element!.classList.toggle('reduced-motion', reduced); schedule(); }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    reveals.forEach(item => observer.observe(item));
    element.classList.add('motion-ready');
    element.classList.toggle('reduced-motion', reduced);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', onPreference);
    const preload = window.setTimeout(() => FRAMES.slice(1).forEach(src => { const img = new Image(); img.src = src; }), 1200);
    schedule();
    return () => { active = false; cancelAnimationFrame(animation); clearTimeout(preload); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); preference.removeEventListener('change', onPreference); };
  }, [root]);
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [service, setService] = useState(0);
  useChoreography(root);
  return <div ref={root} className="experience" id="top">
    <a className="skip-link" href="#about">Skip the animation</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="ab-tech-dev home">{'<ab-tech-dev/>'}</a>
      <span className="header-descriptor">Independent thinking.<br />Intelligent execution.</span>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#expertise"><Roll>Expertise</Roll></a><a href="#approach"><Roll>Approach</Roll></a></nav>
      <a className="project-link" href={CONTACT}><span className="project-text"><Roll>Start a project</Roll></span><span className="arrow-circle"><Arrow /></span></a>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogTrigger className="menu-trigger" aria-label="Open navigation menu"><span>Menu</span><span className="menu-symbol" aria-hidden="true"><i /><i /></span></DialogTrigger>
        <DialogContent className="menu-popup" showCloseButton={false}>
          <DialogTitle className="sr-only">Explore ab-tech-dev</DialogTitle>
          <DialogDescription className="sr-only">Software and automation studio navigation</DialogDescription>
          <div className="menu-top"><span className="wordmark">{'<ab-tech-dev/>'}</span><DialogClose className="close-menu">Close <span aria-hidden="true">×</span></DialogClose></div>
          <nav className="menu-links" aria-label="Expanded navigation">{NAV.map(([label, href], index) => <a href={href} key={href} onClick={() => setMenuOpen(false)} style={{ animationDelay: (index * 80) + 'ms' }}><small>0{index + 1}</small><Roll>{label}</Roll><Arrow /></a>)}</nav>
          <div className="menu-bottom"><p>Have something in mind?<br /><a href={CONTACT}>mrjoshuaability@gmail.com ↗</a></p><p>Thoughtful software.<br />Effortless automation.</p></div>
        </DialogContent>
      </Dialog>
      <div className="reading-progress" data-progress aria-hidden="true" />
    </header>
    <main>
      <section className="hero-track" data-hero aria-label="Your ambition, engineered">
        <div className="hero-stage">
          <div className="hero-film" aria-hidden="true">{[0, 1, 3].map((frame, index) => <img key={frame} data-hero-frame className="scene-image" src={FRAMES[frame]} alt="" fetchPriority={index === 0 ? 'high' : 'auto'} loading={index === 0 ? 'eager' : 'lazy'} style={{ opacity: index === 0 ? 1 : 0 }} width="1672" height="941" />)}</div>
          <div className="hero-film-shade" aria-hidden="true" />
          <div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> SOFTWARE & AUTOMATION STUDIO</p><h1>Your ambition.<br /><span className="second-line">Engineered.</span></h1></div>
          <div className="hero-statement" aria-hidden="true"><span className="eyebrow">MAKE ROOM FOR WHAT’S NEXT</span><p>Less friction.<br /><em>More possibility.</em></p></div>
          <div className="hero-bottom"><a href="#about" className="scroll-link"><span className="outline-circle">↓</span><span><Roll>Scroll to explore</Roll><small>A little further. A lot more possible.</small></span></a><p>Exceptional software.<br />Effortless automation.<br />Built around you.</p><span className="coordinate">01 — THE SPARK</span></div>
          <span className="scene-side-label" aria-hidden="true">IDEA → INTELLIGENCE → IMPACT</span>
        </div>
      </section>
      <section id="about" className="intro section-pad">
        <div className="section-kicker"><span className="eyebrow"><span className="tiny-cross">+</span> THE STUDIO</span><span className="micro">01 / 04</span></div>
        <h2 className="intro-heading" data-intro>{'Good technology should move your business forward. And give you your time back.'.split(' ').map((word, index) => <span data-word key={index}>{word} </span>)}</h2>
        <div className="intro-lower"><span className="wordmark">{'<ab-tech-dev/>'}</span><p className="intro-copy" data-reveal>We turn ambitious ideas into thoughtful software and everyday complexity into systems that simply work. From the first conversation to the last line of code, we build around you.</p></div>
      </section>
      <section className="system-track" data-system aria-label="Connected by design">
        <div className="system-stage">
          <div className="system-film" aria-hidden="true">{[2, 4].map((frame, index) => <img key={frame} data-system-frame className="scene-image" src={FRAMES[frame]} loading="lazy" alt="" width="1672" height="941" style={{ opacity: index === 0 ? 1 : 0 }} />)}</div>
          <div className="system-heading"><span className="eyebrow">EVERY PART. ONE PURPOSE.</span><h2>Beautiful alone.<br /><span>Better together.</span></h2></div>
          <div className="system-end"><span className="eyebrow">CONNECTED BY DESIGN</span><h2>Your entire workflow.<br />In its element.</h2></div>
          <div className="system-foot"><span className="micro">THE CONNECTED BUSINESS</span><div className="system-nodes"><span>Software</span><i /><span>Automation</span><i /><span>Intelligence</span></div><span className="micro">02 — THE SYSTEM</span></div>
        </div>
      </section>
      <section id="expertise" className="expertise section-pad">
        <div className="section-kicker"><span className="eyebrow"><span className="tiny-cross">+</span> OUR EXPERTISE</span><span className="micro">02 / 04</span></div>
        <h2 className="expertise-title" data-reveal>Consider it<br /><span className="indented">taken care of.</span></h2>
        <div className="services-layout">
          <div className="service-art" aria-hidden="true"><img key={service} src={FRAMES[SERVICES[service].image]} alt="" width="1672" height="941" loading="lazy" /><div className="image-caption"><span>{SERVICES[service].caption}</span><span>↗</span></div></div>
          <Accordion className="service-accordion" value={[String(service)]} onValueChange={values => { if (values.length) setService(Number(values[0])); }}>
            {SERVICES.map((item, index) => <AccordionItem value={String(index)} key={item.short} className="service-item"><AccordionTrigger className="service-trigger"><span className="service-number">0{index + 1}</span><span>{item.short}</span><span className="service-plus" aria-hidden="true">+</span></AccordionTrigger><AccordionContent className="service-description"><h3>{item.title}</h3><p>{item.description}</p><ul className="service-tags">{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><a href={CONTACT + '&body=' + encodeURIComponent('Hi ab-tech-dev,\n\nI’d like to discuss ' + item.short.toLowerCase() + ' for my business.\n\nHere’s what I have in mind:\n')} className="text-link"><Roll>Let’s explore it</Roll><Arrow /></a></AccordionContent></AccordionItem>)}
          </Accordion>
        </div>
      </section>
      <section id="approach" className="approach section-pad">
        <div className="section-kicker"><span className="eyebrow"><span className="tiny-cross">+</span> THE APPROACH</span><span className="micro">03 / 04</span></div>
        <div className="approach-layout"><div className="approach-lead" data-reveal><h2>Big thinking.<br />Clear steps.</h2><p>A direct collaboration.<br />A shared vision.<br />Care in every detail.</p><a className="text-link" href={CONTACT}><Roll>Meet your next build</Roll><Arrow /></a></div><div className="process-steps">
          {[['Discover', 'Start with the right questions.', 'We get to know your business, the people using it, and the problem worth solving. A clear direction before a single line of code.'], ['Build', 'Make every detail count.', 'Ideas become prototypes. Prototypes become working software. You stay close to the process, with room to shape what comes next.'], ['Evolve', 'Go live. Keep moving.', 'A considered launch, a clear handover, and a system that can grow as your business does. Built for the next chapter, too.']].map(([title, subtitle, text], index) => <article className="process-step" key={title} data-reveal><span className="micro">0{index + 1}</span><div><h3>{title}</h3><h4>{subtitle}</h4><p>{text}</p></div><span className="step-mark" aria-hidden="true">↗</span></article>)}
        </div></div>
      </section>
      <section id="contact" className="finale" data-finale>
        <img className="finale-image" src={FRAMES[5]} alt="A quiet chrome core on an open ivory horizon" width="1672" height="941" loading="lazy" />
        <div className="finale-content"><div className="section-kicker"><span className="eyebrow"><span className="status-dot" /> YOUR NEXT CHAPTER</span><span className="micro">04 / 04</span></div><h2 data-reveal>Let’s build<br /><span className="indented">what’s next.</span></h2><div className="finale-contact"><p>An idea. A challenge. A better way.<br />It starts with a conversation.</p><a className="contact-button" href={CONTACT}><Roll>Start a project</Roll><span className="arrow-circle"><Arrow /></span></a><a className="email-link" href={CONTACT}>mrjoshuaability@gmail.com</a></div></div>
      </section>
    </main>
    <footer className="site-footer"><a href="#top" className="footer-wordmark" aria-label="Back to top">{'<ab-tech-dev/>'}<Arrow /></a><div className="footer-meta"><span>© {new Date().getFullYear()} ab-tech-dev</span><span>Software & automation. Built with intent.</span><a href="#top"><Roll>Back to top ↑</Roll></a></div></footer>
  </div>;
}

