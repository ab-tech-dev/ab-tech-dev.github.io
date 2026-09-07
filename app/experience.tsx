'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CONTACT =
  'mailto:mrjoshuaability@gmail.com?subject=Let%E2%80%99s%20build%20something';
const NAV = [
  ['The studio', '#about'],
  ['Our expertise', '#expertise'],
  ['The approach', '#approach'],
  ['Let’s talk', '#contact'],
];
const SERVICES = [
  {
    title: 'Your idea. A real advantage.',
    short: 'Software',
    description:
      'Distinctive websites, intuitive applications, and internal tools. Built around the people who use them and the business you want to become.',
    tags: ['Web applications', 'Client portals', 'Internal tools'],
  },
  {
    title: 'Less busywork. More momentum.',
    short: 'Automation',
    description:
      'Connect the tools you already use. Move information, trigger the next step, and keep work flowing—with your team in control.',
    tags: ['Business workflows', 'API integrations', 'Connected operations'],
  },
  {
    title: 'Put intelligence to work.',
    short: 'Applied AI',
    description:
      'Useful assistants and knowledge workflows that help your people find answers and act faster. Designed with clear boundaries and human oversight.',
    tags: ['AI assistants', 'Knowledge systems', 'Human approval'],
  },
];

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

function useExperience(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    import('./motion-story')
      .then(({ createMotionStory }) => {
        if (!cancelled && root.current)
          cleanup = createMotionStory(root.current);
      })
      .catch(() => {
        root.current?.classList.add('animation-fallback');
      });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [root]);
}

function SceneZone({ name }: { name: string }) {
  return (
    <div
      className={'scene-zone scene-zone-' + name}
      data-scene-zone={name}
      aria-hidden="true"
    >
      <span className="zone-fallback">{'</>'}</span>
    </div>
  );
}

function ServicePreview({ service }: { service: number }) {
  return (
    <div className="service-demo">
      <div className="demo-chrome">
        <span className="demo-dots">
          <i />
          <i />
          <i />
        </span>
        <span>
          ab / {['workspace', 'automations', 'intelligence'][service]}
        </span>
        <span className="demo-status">
          <i /> Connected
        </span>
      </div>
      <div className="preview-scenes">
        <div
          className="preview-panel"
          data-active={service === 0}
          aria-hidden={service !== 0}
          inert={service !== 0}
        >
          <div className="workspace-demo">
            <div className="demo-sidebar">
              <span className="mini-brand">ab.</span>
              <i className="selected" />
              <i />
              <i />
              <i />
              <div className="sidebar-avatar">A</div>
            </div>
            <div className="workspace-main">
              <div className="demo-welcome">
                <div>
                  <small>YOUR WORKSPACE</small>
                  <h4>A clearer picture.</h4>
                </div>
                <span className="avatar-stack">
                  <i>J</i>
                  <i>A</i>
                  <i>+</i>
                </span>
              </div>
              <div className="demo-stat-row">
                <div>
                  <small>Projects</small>
                  <strong>06</strong>
                  <span>Everything in one place</span>
                </div>
                <div>
                  <small>Next milestone</small>
                  <strong>Launch</strong>
                  <span>Ready when you are</span>
                </div>
              </div>
              <div className="demo-chart">
                <span>Project momentum</span>
                <span className="chart-label">A clearer way forward</span>
                <svg viewBox="0 0 500 120" fill="none" aria-hidden="true">
                  <path
                    d="M0 100H500M0 60H500M0 20H500"
                    stroke="#334038"
                    strokeDasharray="3 6"
                  />
                  <path
                    d="M0 106C50 105 55 77 96 80S151 106 197 70 232 76 282 44 330 67 365 31 441 35 500 4"
                    stroke="#c4f975"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <div className="demo-task">
                <span className="check">✓</span>
                <span>From first idea to final delivery</span>
                <small>In sync</small>
              </div>
            </div>
          </div>
        </div>
        <div
          className="preview-panel"
          data-active={service === 1}
          aria-hidden={service !== 1}
          inert={service !== 1}
        >
          <div className="workflow-demo">
            <div className="workflow-caption">
              <small>YOUR WORKFLOW, CONNECTED</small>
              <h4>
                One thing leads
                <br />
                to the next.
              </h4>
            </div>
            <ol>
              {[
                ['New enquiry', 'Form received'],
                ['Check & route', 'Right team. Right context.'],
                ['Your approval', 'A human when it matters'],
                ['CRM updated', 'Everyone in the loop'],
              ].map(([label, text], i) => (
                <li key={label}>
                  {i > 0 && (
                    <span className="flow-icon">{['', '⌘', '✓', '↔'][i]}</span>
                  )}
                  <div>
                    <strong>{label}</strong>
                    <small>{text}</small>
                  </div>
                  <span className="flow-dot" />
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div
          className="preview-panel"
          data-active={service === 2}
          aria-hidden={service !== 2}
          inert={service !== 2}
        >
          <div className="intelligence-demo">
            <span className="ai-spark" aria-hidden="true">
              ✳
            </span>
            <h4>Answers, with context.</h4>
            <div className="message user-message">
              What needs my attention today?
            </div>
            <div className="message assistant-message">
              <span className="answer-label">
                <i /> YOUR CONNECTED KNOWLEDGE
              </span>
              <p>
                Your launch plan is ready for review. The latest feedback and
                next steps are together in your project workspace.
              </p>
              <span className="source-chip">Project notes</span>
              <span className="source-chip">Launch plan</span>
            </div>
            <p className="ai-note">Useful answers. Your team makes the call.</p>
          </div>
        </div>
      </div>
      <div className="demo-caption" aria-live="polite" aria-atomic="true">
        <span>
          Illustrative{' '}
          {['client portal', 'automation workflow', 'AI assistant'][service]}
        </span>
        <span>Built around your business</span>
      </div>
    </div>
  );
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingNavigation = useRef<string | null>(null);
  const [service, setService] = useState(0);
  useExperience(root);
  return (
    <div ref={root} className="experience" id="top" data-menu-open={menuOpen}>
      <div className="living-system" aria-hidden="true" />
      <a className="skip-link" href="#about">
        Skip the animation
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="ab-tech-dev home">
          <span>&lt;</span>ab-tech-dev<span>/&gt;</span>
        </a>
        <span className="header-descriptor">
          Software. Automation.
          <br />A little ahead.
        </span>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#expertise">
            <Roll>Expertise</Roll>
          </a>
          <a href="#approach">
            <Roll>Approach</Roll>
          </a>
        </nav>
        <a className="project-link" href={CONTACT}>
          <Roll>Let’s talk</Roll>
          <span className="arrow-circle">
            <Arrow />
          </span>
        </a>
        <Dialog
          open={menuOpen}
          onOpenChange={(open) => {
            if (open) pendingNavigation.current = null;
            setMenuOpen(open);
          }}
          onOpenChangeComplete={(open) => {
            if (open || !pendingNavigation.current) return;
            const href = pendingNavigation.current;
            const target = document.querySelector<HTMLElement>(href);
            if (target) {
              history.pushState(null, '', href);
              target.focus({ preventScroll: true });
              target.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
                  .matches
                  ? 'instant'
                  : 'smooth',
                block: 'start',
              });
            }
            pendingNavigation.current = null;
          }}
        >
          <DialogTrigger
            className="menu-trigger"
            aria-label="Open navigation menu"
          >
            <span>Menu</span>
            <span className="menu-symbol" aria-hidden="true">
              <i />
              <i />
            </span>
          </DialogTrigger>
          <DialogContent
            className="menu-popup"
            showCloseButton={false}
            finalFocus={() => (pendingNavigation.current ? false : true)}
          >
            <DialogTitle className="sr-only">Explore ab-tech-dev</DialogTitle>
            <DialogDescription className="sr-only">
              Software and automation studio navigation
            </DialogDescription>
            <div className="menu-top">
              <span className="wordmark">{'<ab-tech-dev/>'}</span>
              <DialogClose className="close-menu">
                Close <span aria-hidden="true">×</span>
              </DialogClose>
            </div>
            <nav className="menu-links" aria-label="Expanded navigation">
              {NAV.map(([label, href], index) => (
                <a
                  href={href}
                  key={href}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    pendingNavigation.current = href;
                    setMenuOpen(false);
                  }}
                >
                  <small>0{index + 1}</small>
                  <Roll>{label}</Roll>
                  <Arrow />
                </a>
              ))}
            </nav>
            <div className="menu-bottom">
              <p>
                Have something in mind?
                <br />
                <a href={CONTACT}>mrjoshuaability@gmail.com</a>
              </p>
              <p>
                Thoughtful software.
                <br />
                Effortless automation.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <div className="reading-progress" data-progress aria-hidden="true" />
      </header>
      <main>
        <section
          className="hero-track"
          data-act="0"
          aria-label="Ambition in motion"
        >
          <div className="hero-stage" data-scene-sticky>
            <div className="scene-grid" aria-hidden="true" />
            <div className="scene-orbit" aria-hidden="true">
              <i />
              <i />
            </div>
            <SceneZone name="hero" />
            <div className="scene-topline" aria-hidden="true">
              <span>
                <i /> A SYSTEM OF POSSIBILITIES
              </span>
              <span>AB—001</span>
            </div>
            <div className="hero-acts">
              <div className="hero-act">
                <p className="eyebrow">
                  <span className="status-dot" /> SOFTWARE & AUTOMATION STUDIO
                </p>
                <h1>
                  <span className="heading-line">Ambition,</span>
                  <span className="heading-line">
                    in <span className="accent-word">motion.</span>
                  </span>
                </h1>
                <p className="hero-description">
                  Software that moves you forward.
                  <br />
                  Automation that gives you time back.
                  <br />
                  Built around your next big thing.
                </p>
                <a className="hero-cta" href={CONTACT}>
                  <Roll>Let’s build something</Roll>
                  <Arrow />
                </a>
                <SceneZone name="hero-0" />
              </div>
              <div className="hero-act">
                <p className="eyebrow">
                  <span className="status-dot" /> 02 / MAKE THE CONNECTION
                </p>
                <h2>
                  <span className="heading-line">Busywork,</span>
                  <span className="heading-line accent-word">
                    off your plate.
                  </span>
                </h2>
                <p className="hero-description">
                  Your tools talk to each other.
                  <br />
                  The next step happens automatically.
                  <br />
                  You get back to what matters.
                </p>
                <div className="act-detail">
                  <span>INPUT</span>
                  <i />
                  <span>CONNECT</span>
                  <i />
                  <span>FLOW</span>
                </div>
                <SceneZone name="hero-1" />
              </div>
              <div className="hero-act">
                <p className="eyebrow">
                  <span className="status-dot" /> 03 / BUILD WHAT’S NEXT
                </p>
                <h2>
                  <span className="heading-line">Your next</span>
                  <span className="heading-line accent-word">advantage.</span>
                </h2>
                <p className="hero-description">
                  One connected system.
                  <br />A more capable business.
                  <br />
                  And room to go further.
                </p>
                <a className="hero-cta" href="#expertise">
                  <Roll>Explore the possibilities</Roll>
                  <Arrow />
                </a>
                <SceneZone name="hero-2" />
              </div>
            </div>
            <div className="hero-bottom">
              <a href="#about" className="scroll-link">
                <span className="scroll-icon">↓</span>
                <span>
                  Scroll to connect
                  <br />
                  <small>From possibility to progress</small>
                </span>
              </a>
              <div className="chapter-track" aria-hidden="true">
                <span className="chapter chapter-0">
                  <small>01</small> Imagine
                </span>
                <span className="chapter chapter-1">
                  <small>02</small> Connect
                </span>
                <span className="chapter chapter-2">
                  <small>03</small> Create
                </span>
                <div className="chapter-line">
                  <i />
                </div>
              </div>
              <span className="hero-coordinate">
                INDEPENDENT STUDIO
                <br />
                CONNECTED THINKING.
              </span>
            </div>
          </div>
        </section>
        <section id="about" className="intro section-pad" tabIndex={-1}>
          <div
            className="chapter-atmosphere"
            data-parallax
            aria-hidden="true"
          />
          <SceneZone name="studio" />
          <div className="section-kicker">
            <span className="eyebrow">
              <span className="tiny-cross">+</span> THE WAY WE SEE IT
            </span>
            <span className="micro">01 / THE STUDIO</span>
          </div>
          <h2 className="intro-heading">
            {[
              'Technology should open possibilities.',
              'Not more tabs',
              'on your to-do list.',
            ].map((phrase) => (
              <span data-phrase key={phrase}>
                {phrase}{' '}
              </span>
            ))}
          </h2>
          <div className="intro-lower">
            <span className="intro-symbol" aria-hidden="true">
              [ + ]
            </span>
            <div>
              <p>
                We turn ambitious ideas into software people love using—and
                everyday complexity into systems that simply work.
              </p>
              <p>
                A direct partnership. Thoughtful execution.
                <br />
                Built to make a difference to your day.
              </p>
            </div>
            <a className="text-link" href="#expertise">
              <Roll>What we can build</Roll>
              <Arrow />
            </a>
          </div>
        </section>
        <section id="expertise" className="expertise section-pad" tabIndex={-1}>
          <div className="section-kicker">
            <span className="eyebrow">
              <span className="tiny-cross">+</span> OUR EXPERTISE
            </span>
            <span className="micro">02 / THE POSSIBILITIES</span>
          </div>
          <div className="expertise-heading">
            <h2>
              Big ideas.
              <br />
              <span className="muted-word">Meet execution.</span>
            </h2>
            <p>
              Three ways to move forward.
              <br />
              Even better, together.
            </p>
          </div>
          <div className="services-layout">
            <div className="service-art" data-scene-sticky>
              <SceneZone name="expertise" />
              <div className="service-arrival">
                <div className="service-tilt">
                  <ServicePreview service={service} />
                </div>
              </div>
            </div>
            <Accordion
              className="service-accordion"
              value={[String(service)]}
              onValueChange={(values) => {
                if (values.length) setService(Number(values[0]));
              }}
            >
              {SERVICES.map((item, index) => (
                <AccordionItem
                  value={String(index)}
                  key={item.short}
                  className="service-item"
                >
                  <AccordionTrigger className="service-trigger">
                    <span className="service-number">0{index + 1}</span>
                    <span>{item.short}</span>
                    <span className="service-plus" aria-hidden="true">
                      +
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="service-description">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <ul className="service-tags">
                      {item.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <a
                      href={
                        CONTACT +
                        '&body=' +
                        encodeURIComponent(
                          'Hi ab-tech-dev,\n\nI’d like to discuss ' +
                            item.short.toLowerCase() +
                            ' for my business.\n\nHere’s what I have in mind:\n',
                        )
                      }
                      className="text-link"
                    >
                      <Roll>Let’s explore it</Roll>
                      <Arrow />
                    </a>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="service-connector" aria-hidden="true">
            <i />
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              <span>Less friction.</span>
              <span>More possibility.</span>
              <span>Less friction.</span>
              <span>More possibility.</span>
            </div>
          </div>
        </section>
        <section id="approach" className="approach section-pad" tabIndex={-1}>
          <div
            className="chapter-atmosphere"
            data-parallax
            aria-hidden="true"
          />
          <div className="section-kicker">
            <span className="eyebrow">
              <span className="tiny-cross">+</span> HOW WE GET THERE
            </span>
            <span className="micro">03 / THE APPROACH</span>
          </div>
          <div className="approach-layout">
            <div className="approach-lead" data-scene-sticky>
              <h2>
                Complexity?
                <br />
                <span className="serif-word">Consider it handled.</span>
              </h2>
              <p>
                Clear conversations.
                <br />
                Visible progress.
                <br />
                Care in every detail.
              </p>
              <a className="text-link" href={CONTACT}>
                <Roll>Meet your next build</Roll>
                <Arrow />
              </a>
              <SceneZone name="process" />
            </div>
            <div className="process-steps">
              {[
                [
                  'Discover',
                  'Get to the heart of it.',
                  'We understand your business, your people, and the problem worth solving. A clear direction before a single line of code.',
                ],
                [
                  'Build',
                  'Make it work beautifully.',
                  'Ideas become prototypes. Prototypes become working software. You stay close to the process and help shape the result.',
                ],
                [
                  'Evolve',
                  'Launch. Learn. Go further.',
                  'A considered launch, a clear handover, and a system that can grow with you. Ready for your next chapter.',
                ],
              ].map(([title, subtitle, text], index) => (
                <article className="process-step" key={title}>
                  <span className="step-number">0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <h4>{subtitle}</h4>
                    <p>{text}</p>
                  </div>
                  <Arrow />
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section" tabIndex={-1}>
          <SceneZone name="contact" />
          <div className="contact-inner section-pad">
            <div className="section-kicker">
              <span className="eyebrow">
                <span className="tiny-cross">+</span> THE NEXT MOVE IS YOURS
              </span>
              <span className="micro">04 / LET’S TALK</span>
            </div>
            <h2>
              <span className="contact-line">Something</span>
              <span className="contact-line contact-second">
                great starts <em>here.</em>
              </span>
            </h2>
            <div className="contact-bottom">
              <p>
                An idea. A challenge. A better way.
                <br />
                Let’s see what we can make possible.
              </p>
              <a className="contact-button" href={CONTACT}>
                <Roll>Start a project</Roll>
                <span className="arrow-circle">
                  <Arrow />
                </span>
              </a>
              <a className="email-link" href={CONTACT}>
                mrjoshuaability@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer" id="footer">
        <SceneZone name="footer" />
        <a href="#top" className="footer-wordmark" aria-label="Back to top">
          {'<ab-tech-dev/>'}
          <Arrow />
        </a>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} ab-tech-dev</span>
          <span>Software & automation. Built with intent.</span>
          <a href="#top">
            <Roll>Back to top ↑</Roll>
          </a>
        </div>
      </footer>
    </div>
  );
}
