'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SystemState } from './living-system';

const CONTACT = 'mailto:mrjoshuaability@gmail.com?subject=Let%E2%80%99s%20build%20something';
const NAV = [['The studio', '#about'], ['Our expertise', '#expertise'], ['The approach', '#approach'], ['Let’s talk', '#contact']];
const SERVICES = [
  { title: 'Your idea. A real advantage.', short: 'Software', description: 'Distinctive websites, intuitive applications, and internal tools. Built around the people who use them and the business you want to become.', tags: ['Web applications', 'Client portals', 'Internal tools'] },
  { title: 'Less busywork. More momentum.', short: 'Automation', description: 'Connect the tools you already use. Move information, trigger the next step, and keep work flowing—with your team in control.', tags: ['Business workflows', 'API integrations', 'Connected operations'] },
  { title: 'Put intelligence to work.', short: 'Applied AI', description: 'Useful assistants and knowledge workflows that help your people find answers and act faster. Designed with clear boundaries and human oversight.', tags: ['AI assistants', 'Knowledge systems', 'Human approval'] },
];

function Arrow({ className = '' }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
function Roll({ children }: { children: string }) {
  return <span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}

function useExperience(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let cancelled = false;
    let teardown = () => {};
    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('./living-system')]).then(([{ gsap }, { ScrollTrigger }, { createLivingSystem }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add({ reduce: '(prefers-reduced-motion: reduce)', compact: '(max-width: 900px)', desktop: '(min-width: 901px)' }, context => {
        const reduced = Boolean(context.conditions?.reduce);
        const compact = Boolean(context.conditions?.compact);
        const stage = element.querySelector<HTMLElement>('.hero-stage')!;
        const track = element.querySelector<HTMLElement>('.hero-track')!;
        const host = element.querySelector<HTMLElement>('.living-system')!;
        const acts = [...element.querySelectorAll<HTMLElement>('.hero-act')];
        const state: SystemState = { progress: 0, pointerX: 0, pointerY: 0 };
        let system: ReturnType<typeof createLivingSystem> | undefined;
        let inView = true;
        let activeAct = -1;
        try { system = createLivingSystem(host, state, compact); } catch { host.classList.add('scene-fallback'); }
        element.classList.toggle('motion-enabled', !reduced);
        element.classList.toggle('reduced-motion', reduced);
        const setAct = (act: number) => {
          if (act === activeAct) return;
          activeAct = act;
          track.dataset.act = String(act);
          acts.forEach((item, i) => {
            item.inert = i !== act;
            item.setAttribute('aria-hidden', String(i !== act));
          });
        };
        setAct(0);
        if (!reduced) {
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: .85, invalidateOnRefresh: true }
          });
          gsap.set(acts.slice(1), { autoAlpha: 0, y: 70 });
          timeline.to(state, { progress: 1, duration: 1 }, 0)
            .to(acts[0], { autoAlpha: 0, y: -85, duration: .13 }, .08)
            .to(acts[1], { autoAlpha: 1, y: 0, duration: .14 }, .25)
            .to(acts[1], { autoAlpha: 0, y: -70, duration: .12 }, .57)
            .to(acts[2], { autoAlpha: 1, y: 0, duration: .15 }, .73)
            .to('.scene-orbit', { rotation: 65, scale: 1.18, duration: 1 }, 0)
            .to('.scene-fallback-mark', { rotationY: 30, rotationZ: -10, scale: 1.16, duration: 1 }, 0);
          gsap.from('.hero-act:first-child .eyebrow, .hero-act:first-child h1, .hero-act:first-child .hero-description, .hero-act:first-child .hero-cta', { y: 35, opacity: 0, duration: 1.1, stagger: .11, ease: 'power3.out', clearProps: 'transform,opacity' });
          element.querySelectorAll<HTMLElement>('[data-reveal]').forEach(item => {
            gsap.from(item, { y: compact ? 28 : 60, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 90%', once: true } });
          });
          gsap.fromTo('[data-word]', { opacity: .22 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.intro-heading', start: 'top 80%', end: 'bottom 55%', scrub: .4 } });
          gsap.to('.marquee-track', { xPercent: -20, ease: 'none', scrollTrigger: { trigger: '.expertise', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
          gsap.from('.contact-inner h2', { yPercent: 30, rotateX: -30, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top 85%', end: 'top 25%', scrub: 1 } });
        }
        const progress = element.querySelector<HTMLElement>('[data-progress]')!;
        ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => {
          progress.style.transform = 'scaleX(' + self.progress + ')';
          element.classList.toggle('header-scrolled', self.scroll() > 60);
        } });
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse' || reduced) return;
          const rect = stage.getBoundingClientRect();
          state.pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
          state.pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
        };
        const leave = () => { state.pointerX = 0; state.pointerY = 0; };
        stage.addEventListener('pointermove', move);
        stage.addEventListener('pointerleave', leave);
        const visible = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; }, { rootMargin: '100px' });
        visible.observe(track);
        const tick = (time: number) => {
          if (document.hidden || !inView) return;
          if (!reduced) {
            setAct(state.progress < .23 ? 0 : state.progress < .68 ? 1 : 2);
            track.style.setProperty('--chapter-progress', String(state.progress));
          }
          system?.render(reduced ? 0 : time, reduced);
        };
        if (reduced) system?.render(0, true);
        gsap.ticker.add(tick);
        const resize = () => { if (reduced) system?.render(0, true); };
        window.addEventListener('resize', resize);
        // Accordion height changes must update following section triggers.
        const layoutObserver = new ResizeObserver(() => ScrollTrigger.refresh());
        layoutObserver.observe(element.querySelector('.services-layout')!);
        ScrollTrigger.refresh();
        return () => {
          gsap.ticker.remove(tick); system?.destroy(); visible.disconnect(); layoutObserver.disconnect();
          stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave);
          window.removeEventListener('resize', resize);
          element.classList.remove('motion-enabled', 'reduced-motion');
          acts.forEach((item, i) => { item.inert = i !== 0; item.setAttribute('aria-hidden', String(i !== 0)); });
        };
      }, element);
      teardown = () => media.revert();
    }).catch(() => { element.classList.add('animation-fallback'); });
    return () => { cancelled = true; teardown(); };
  }, [root]);
}

function ServicePreview({ service }: { service: number }) {
  return <div className="service-demo" key={service}>
    <div className="demo-chrome"><span className="demo-dots"><i /><i /><i /></span><span>ab / {['workspace', 'automations', 'intelligence'][service]}</span><span className="demo-status"><i /> Connected</span></div>
    {service === 0 ? <div className="workspace-demo">
      <div className="demo-sidebar"><span className="mini-brand">ab.</span><i className="selected" /><i /><i /><i /><div className="sidebar-avatar">A</div></div>
      <div className="workspace-main"><div className="demo-welcome"><div><small>YOUR WORKSPACE</small><h4>A clearer picture.</h4></div><span className="avatar-stack"><i>J</i><i>A</i><i>+</i></span></div>
        <div className="demo-stat-row"><div><small>Projects</small><strong>06</strong><span>Everything in one place</span></div><div><small>Next milestone</small><strong>Launch <b>↗</b></strong><span>Ready when you are</span></div></div>
        <div className="demo-chart"><span>Project momentum</span><span className="chart-label">A clearer way forward ↗</span><svg viewBox="0 0 500 120" fill="none" aria-hidden="true"><path d="M0 100H500M0 60H500M0 20H500" stroke="#334038" strokeDasharray="3 6" /><path d="M0 106C50 105 55 77 96 80S151 106 197 70 232 76 282 44 330 67 365 31 441 35 500 4" stroke="#c4f975" strokeWidth="2.5" /></svg></div>
        <div className="demo-task"><span className="check">✓</span><span>From first idea to final delivery</span><small>In sync</small></div>
      </div>
    </div> : service === 1 ? <div className="workflow-demo"><div className="workflow-caption"><small>YOUR WORKFLOW, CONNECTED</small><h4>One thing leads<br />to the next.</h4></div><ol>{[['New enquiry', 'Form received'], ['Check & route', 'Right team. Right context.'], ['Your approval', 'A human when it matters'], ['CRM updated', 'Everyone in the loop']].map(([label, text], i) => <li key={label}><span className="flow-icon">{['↗', '⌘', '✓', '↔'][i]}</span><div><strong>{label}</strong><small>{text}</small></div><span className="flow-dot" /></li>)}</ol></div>
      : <div className="intelligence-demo"><span className="ai-spark" aria-hidden="true">✳</span><h4>Answers, with context.</h4><div className="message user-message">What needs my attention today?</div><div className="message assistant-message"><span className="answer-label"><i /> YOUR CONNECTED KNOWLEDGE</span><p>Your launch plan is ready for review. The latest feedback and next steps are together in your project workspace.</p><span className="source-chip">↗ Project notes</span><span className="source-chip">↗ Launch plan</span></div><p className="ai-note">Useful answers. Your team makes the call.</p></div>}
    <div className="demo-caption"><span>Illustrative {['client portal', 'automation workflow', 'AI assistant'][service]}</span><span>Built around your business ↗</span></div>
  </div>;
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [service, setService] = useState(0);
  useExperience(root);
  return <div ref={root} className="experience" id="top">
    <a className="skip-link" href="#about">Skip the animation</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="ab-tech-dev home"><span>&lt;</span>ab-tech-dev<span>/&gt;</span></a>
      <span className="header-descriptor">Software. Automation.<br />A little ahead.</span>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#expertise"><Roll>Expertise</Roll></a><a href="#approach"><Roll>Approach</Roll></a></nav>
      <a className="project-link" href={CONTACT}><Roll>Let’s talk</Roll><span className="arrow-circle"><Arrow /></span></a>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogTrigger className="menu-trigger" aria-label="Open navigation menu"><span>Menu</span><span className="menu-symbol" aria-hidden="true"><i /><i /></span></DialogTrigger>
        <DialogContent className="menu-popup" showCloseButton={false}>
          <DialogTitle className="sr-only">Explore ab-tech-dev</DialogTitle>
          <DialogDescription className="sr-only">Software and automation studio navigation</DialogDescription>
          <div className="menu-top"><span className="wordmark">{'<ab-tech-dev/>'}</span><DialogClose className="close-menu">Close <span aria-hidden="true">×</span></DialogClose></div>
          <nav className="menu-links" aria-label="Expanded navigation">{NAV.map(([label, href], index) => <a href={href} key={href} onClick={() => setMenuOpen(false)}><small>0{index + 1}</small><Roll>{label}</Roll><Arrow /></a>)}</nav>
          <div className="menu-bottom"><p>Have something in mind?<br /><a href={CONTACT}>mrjoshuaability@gmail.com ↗</a></p><p>Thoughtful software.<br />Effortless automation.</p></div>
        </DialogContent>
      </Dialog>
      <div className="reading-progress" data-progress aria-hidden="true" />
    </header>
    <main>
      <section className="hero-track" data-act="0" aria-label="Ambition in motion">
        <div className="hero-stage">
          <div className="scene-grid" aria-hidden="true" />
          <div className="scene-orbit" aria-hidden="true"><i /><i /></div>
          <div className="living-system" aria-hidden="true"><div className="scene-fallback-mark">&lt;/&gt;</div></div>
          <div className="scene-topline" aria-hidden="true"><span><i /> A SYSTEM OF POSSIBILITIES</span><span>AB—001</span></div>
          <div className="hero-acts">
            <div className="hero-act">
              <p className="eyebrow"><span className="status-dot" /> SOFTWARE & AUTOMATION STUDIO</p>
              <h1>Ambition,<br />in <span className="accent-word">motion.</span></h1>
              <p className="hero-description">Software that moves you forward.<br />Automation that gives you time back.<br />Built around your next big thing.</p>
              <a className="hero-cta" href={CONTACT}><Roll>Let’s build something</Roll><Arrow /></a>
            </div>
            <div className="hero-act" aria-hidden="true" inert>
              <p className="eyebrow"><span className="status-dot" /> 02 / MAKE THE CONNECTION</p>
              <h2>Busywork,<br /><span className="accent-word">off your plate.</span></h2>
              <p className="hero-description">Your tools talk to each other.<br />The next step happens automatically.<br />You get back to what matters.</p>
              <div className="act-detail"><span>INPUT</span><i /><span>CONNECT</span><i /><span>FLOW</span></div>
            </div>
            <div className="hero-act" aria-hidden="true" inert>
              <p className="eyebrow"><span className="status-dot" /> 03 / BUILD WHAT’S NEXT</p>
              <h2>Your next<br /><span className="accent-word">advantage.</span></h2>
              <p className="hero-description">One connected system.<br />A more capable business.<br />And room to go further.</p>
              <a className="hero-cta" href="#expertise"><Roll>Explore the possibilities</Roll><Arrow /></a>
            </div>
          </div>
          <div className="hero-bottom"><a href="#about" className="scroll-link"><span className="scroll-icon">↓</span><span>Scroll to connect<br /><small>From possibility to progress</small></span></a><div className="chapter-track" aria-hidden="true"><span className="chapter chapter-0"><small>01</small> Imagine</span><span className="chapter chapter-1"><small>02</small> Connect</span><span className="chapter chapter-2"><small>03</small> Create</span><div className="chapter-line"><i /></div></div><span className="hero-coordinate">INDEPENDENT STUDIO<br />CONNECTED THINKING.</span></div>
        </div>
      </section>
      <section id="about" className="intro section-pad">
        <div className="section-kicker"><span className="eyebrow"><span className="tiny-cross">+</span> THE WAY WE SEE IT</span><span className="micro">01 / THE STUDIO</span></div>
        <h2 className="intro-heading">{'Technology should open possibilities. Not more tabs on your to-do list.'.split(' ').map((word, index) => <span data-word key={index}>{word} </span>)}</h2>
        <div className="intro-lower"><span className="intro-symbol" aria-hidden="true">[ + ]</span><div data-reveal><p>We turn ambitious ideas into software people love using—and everyday complexity into systems that simply work.</p><p>A direct partnership. Thoughtful execution.<br />Built to make a difference to your day.</p></div><a className="text-link" href="#expertise"><Roll>What we can build</Roll><Arrow /></a></div>
      </section>
      <section id="expertise" className="expertise section-pad">
        <div className="section-kicker"><span className="eyebrow"><span className="tiny-cross">+</span> OUR EXPERTISE</span><span className="micro">02 / THE POSSIBILITIES</span></div>
        <div className="expertise-heading" data-reveal><h2>Big ideas.<br /><span className="muted-word">Meet execution.</span></h2><p>Three ways to move forward.<br />Even better, together.</p></div>
        <div className="services-layout">
          <div className="service-art"><ServicePreview service={service} /></div>
          <Accordion className="service-accordion" value={[String(service)]} onValueChange={values => { if (values.length) setService(Number(values[0])); }}>
            {SERVICES.map((item, index) => <AccordionItem value={String(index)} key={item.short} className="service-item"><AccordionTrigger className="service-trigger"><span className="service-number">0{index + 1}</span><span>{item.short}</span><span className="service-plus" aria-hidden="true">+</span></AccordionTrigger><AccordionContent className="service-description"><h3>{item.title}</h3><p>{item.description}</p><ul className="service-tags">{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><a href={CONTACT + '&body=' + encodeURIComponent('Hi ab-tech-dev,\n\nI’d like to discuss ' + item.short.toLowerCase() + ' for my business.\n\nHere’s what I have in mind:\n')} className="text-link"><Roll>Let’s explore it</Roll><Arrow /></a></AccordionContent></AccordionItem>)}
          </Accordion>
        </div>
        <div className="marquee" aria-hidden="true"><div className="marquee-track"><span>Less friction.</span><i>↗</i><span>More possibility.</span><i>↗</i><span>Less friction.</span><i>↗</i><span>More possibility.</span></div></div>
      </section>
      <section id="approach" className="approach section-pad">
        <div className="section-kicker"><span className="eyebrow"><span className="tiny-cross">+</span> HOW WE GET THERE</span><span className="micro">03 / THE APPROACH</span></div>
        <div className="approach-layout"><div className="approach-lead" data-reveal><h2>Complexity?<br /><span className="serif-word">Consider it handled.</span></h2><p>Clear conversations.<br />Visible progress.<br />Care in every detail.</p><a className="text-link" href={CONTACT}><Roll>Meet your next build</Roll><Arrow /></a></div><div className="process-steps">
          {[['Discover', 'Get to the heart of it.', 'We understand your business, your people, and the problem worth solving. A clear direction before a single line of code.'], ['Build', 'Make it work beautifully.', 'Ideas become prototypes. Prototypes become working software. You stay close to the process and help shape the result.'], ['Evolve', 'Launch. Learn. Go further.', 'A considered launch, a clear handover, and a system that can grow with you. Ready for your next chapter.']].map(([title, subtitle, text], index) => <article className="process-step" key={title} data-reveal><span className="step-number">0{index + 1}</span><div><h3>{title}</h3><h4>{subtitle}</h4><p>{text}</p></div><Arrow /></article>)}
        </div></div>
      </section>
      <section id="contact" className="contact-section">
        <div className="contact-inner section-pad"><div className="section-kicker"><span className="eyebrow"><span className="tiny-cross">+</span> THE NEXT MOVE IS YOURS</span><span className="micro">04 / LET’S TALK</span></div><h2>Something<br /><span className="contact-second">great starts <em>here.</em></span></h2><div className="contact-bottom"><p>An idea. A challenge. A better way.<br />Let’s see what we can make possible.</p><a className="contact-button" href={CONTACT}><Roll>Start a project</Roll><span className="arrow-circle"><Arrow /></span></a><a className="email-link" href={CONTACT}>mrjoshuaability@gmail.com</a></div></div>
      </section>
    </main>
    <footer className="site-footer"><a href="#top" className="footer-wordmark" aria-label="Back to top">{'<ab-tech-dev/>'}<Arrow /></a><div className="footer-meta"><span>© {new Date().getFullYear()} ab-tech-dev</span><span>Software & automation. Built with intent.</span><a href="#top"><Roll>Back to top ↑</Roll></a></div></footer>
  </div>;
}
