'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ServicePlayground from './service-playground';
import AmbientStars from './ambient-stars';
import StartupLoader from './startup-loader';
import { ArrowRight, Code2, GitBranch, Sparkles } from 'lucide-react';

const CONTACT =
  'mailto:mrjoshuaability@gmail.com?subject=Let%E2%80%99s%20build%20something';
const WHATSAPP =
  'https://wa.me/2347060700263?text=Hi%20ab-tech-dev%2C%20I%27d%20like%20to%20discuss%20a%20project.';
const NAV = [
  ['The studio', '#about'],
  ['Our expertise', '#expertise'],
  ['Selected work', '#work'],
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
      'Connect the tools you already use. Move information, trigger the next step, and keep work flowing, with your team in control.',
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
const PROJECTS = [
  {
    index: '01',
    slug: 'salon',
    type: 'Live client experience',
    title: 'Infinity Hair & Beauty',
    description:
      'A conversion-focused salon experience that turns a large service catalogue into one clear visual journey, with responsive booking paths, a style gallery, and polished editorial motion.',
    stack: ['Creative frontend', 'Responsive UX', 'Content system'],
    image: '/projects/infinity-salon-site.webp',
    imageAlt: 'Live Infinity Hair and Beauty desktop homepage',
    visual: 'Live site / Desktop',
    source: 'https://github.com/ab-tech-dev/infinitysalon',
    live: 'https://infinitysalon-flame.vercel.app',
  },
  {
    index: '02',
    slug: 'commerce',
    type: 'Commerce infrastructure',
    title: 'Dandelionz',
    description:
      'A multi-vendor commerce platform spanning product catalogues, role-based operations, cart and order lifecycles, Paystack payments, wallets, referrals, delivery tracking, and administration.',
    stack: ['Django REST', 'PostgreSQL', 'Redis + Celery'],
    image: '/projects/dandelionz-site.webp',
    imageAlt: 'Live Dandelionz mobile marketplace showing product categories and listings',
    visual: 'Live store / Mobile',
    live: 'https://app.dandelionz.com.ng',
    source: 'https://github.com/ab-tech-dev/dandelionz',
  },
  {
    index: '03',
    slug: 'local-ai',
    type: 'Private applied AI',
    title: 'Local Review Intelligence',
    description:
      'A retrieval assistant that answers questions from restaurant feedback while keeping inference and embeddings local. Built for fast repeated queries with caching and a persistent vector store.',
    stack: ['Ollama', 'LangChain', 'Chroma'],
    image: '/projects/local-review-intelligence-v2.webp',
    imageAlt: 'Conceptual visualization of restaurant reviews becoming structured local intelligence',
    visual: 'System visual / Local inference',
    source: 'https://github.com/ab-tech-dev/Local_AI_Agent',
  },
  {
    index: '04',
    slug: 'medical-ai',
    type: 'Knowledge retrieval system',
    title: 'Medical Knowledge Assistant',
    description:
      'An end-to-end generative AI reference assistant with document embeddings, semantic retrieval, a Flask interface, container delivery, and an AWS deployment workflow.',
    stack: ['Python + Flask', 'Pinecone', 'Docker + AWS'],
    image: '/projects/medical-knowledge-v2.webp',
    imageAlt: 'Conceptual visualization of medical references being retrieved with traceable evidence',
    visual: 'System visual / Retrieval',
    source: 'https://github.com/ab-tech-dev/medical_chatbot',
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

function SectionLabel({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note: string;
}) {
  return (
    <div className="section-label" aria-label={`${index}. ${title}. ${note}`}>
      <span className="section-label-index">{index}</span>
      <span className="section-label-title">{title}</span>
      <i aria-hidden="true" />
      <span className="section-label-note">{note}</span>
    </div>
  );
}

function useExperience(
  root: RefObject<HTMLDivElement | null>,
  onReady: () => void,
) {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    // Let the loader paint and start typing before 3D/GSAP initialization.
    const start = window.setTimeout(() => {
      import('./motion-story')
        .then(({ createMotionStory }) => {
          if (!cancelled && root.current)
            cleanup = createMotionStory(root.current, onReady);
        })
        .catch(() => {
          root.current?.classList.add('animation-fallback');
          onReady();
        });
    }, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
      cleanup?.();
    };
  }, [root, onReady]);
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

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingNavigation = useRef<string | null>(null);
  const [service, setService] = useState(0);
  const markSceneReady = useCallback(() => setSceneReady(true), []);
  useExperience(root, markSceneReady);
  useEffect(() => {
    document.documentElement.classList.add('is-booting');
    const minimum = window.setTimeout(() => setMinimumElapsed(true), 2100);
    const failsafe = window.setTimeout(() => {
      setSceneReady(true);
      setMinimumElapsed(true);
    }, 5000);
    return () => {
      window.clearTimeout(minimum);
      window.clearTimeout(failsafe);
      document.documentElement.classList.remove('is-booting');
    };
  }, []);
  const loaderLeaving = sceneReady && minimumElapsed;
  useEffect(() => {
    if (!loaderLeaving) return;
    document.documentElement.classList.remove('is-booting');
    const remove = window.setTimeout(() => setLoaderVisible(false), 850);
    return () => window.clearTimeout(remove);
  }, [loaderLeaving]);
  return (
    <div
      ref={root}
      className="experience"
      id="top"
      data-menu-open={menuOpen}
      aria-busy={loaderVisible}
    >
      {loaderVisible && <StartupLoader leaving={loaderLeaving} />}
      <div className="living-system" aria-hidden="true" />
      <AmbientStars />
      <div className="cosmic-atmosphere" aria-hidden="true">
        <b />
      </div>
      <div className="motion-veil" aria-hidden="true" />
      <div className="motion-grain" aria-hidden="true" />
      <div className="signal-overlay" aria-hidden="true">
        <div className="signal-telemetry">
          <span>SYS://AB-TECH</span>
          <span>CHANNEL 03 · LIVE</span>
          <span>VECTOR 41.03 / 02.91</span>
        </div>
      </div>
      <div className="global-chapter" aria-hidden="true">
        <span>Continuous system</span>
        <i />
        <b data-chapter-readout>Imagine</b>
      </div>
      <a className="skip-link" href="#about">
        Skip the animation
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="ab-tech-dev home">
          <span>&lt;</span>ab-tech-dev<span>/&gt;</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">
            <Roll>Work</Roll>
          </a>
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
            finalFocus={() =>
              pendingNavigation.current
                ? (document.querySelector<HTMLElement>(
                    pendingNavigation.current,
                  ) ?? false)
                : true
            }
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
            <div className="mobile-story-ledger" aria-hidden="true">
              <div className="mobile-story-beat">
                <span>RAW SIGNAL</span>
                <p>An idea enters the system.</p>
              </div>
              <div className="mobile-story-beat">
                <span>LIVE ROUTE</span>
                <p>Inputs connect. Decisions move.</p>
              </div>
              <div className="mobile-story-beat">
                <span>SYSTEM READY</span>
                <p>The work becomes momentum.</p>
              </div>
            </div>
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
                  We design and build the software, automations, and applied AI
                  that turn the way you work into an advantage.
                </p>
                <div className="hero-actions">
                  <a className="hero-primary" href="#work">
                    <Roll>See selected work</Roll>
                    <Arrow />
                  </a>
                  <a className="hero-secondary" href={CONTACT}>
                    <Roll>Start a project</Roll>
                  </a>
                </div>
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
                <SceneZone name="hero-2" />
              </div>
            </div>
            <div className="hero-bottom">
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
          <div className="studio-opening">
            <SectionLabel
              index="01"
              title="The studio"
              note="Independent studio. Connected thinking."
            />
          </div>
          <h2 className="intro-heading">
            {['Technology should', 'open possibilities.', 'Not more tabs.'].map(
              (phrase) => (
                <span data-phrase key={phrase}>
                  {phrase}{' '}
                </span>
              ),
            )}
          </h2>
          <div className="intro-lower">
            <div className="studio-emblem">
              <SceneZone name="studio" />
              <span>One considered system.</span>
            </div>
            <div className="studio-copy">
              <p>
                Software people love using. Automation that gives your team time
                back. Built around the way your business actually works.
              </p>
              <p>
                A direct partnership, from the first conversation to the next
                release.
              </p>
              <a className="text-link" href="#expertise">
                <Roll>What we can build</Roll>
                <Arrow />
              </a>
            </div>
          </div>
          <div className="studio-connections" aria-hidden="true">
            <span>Your people</span>
            <i />
            <span>Your tools</span>
            <i />
            <span>Your next move</span>
          </div>
        </section>
        <section id="expertise" className="expertise section-pad" tabIndex={-1}>
          <SectionLabel
            index="02"
            title="Capabilities"
            note="Software, automation, and applied AI."
          />
          <div className="expertise-heading">
            <h2>
              Built around
              <br />
              your business.
            </h2>
            <p>Three disciplines. One connected way of thinking.</p>
          </div>
          <div className="services-layout">
            <div className="service-selector">
              <fieldset className="service-options">
                <legend className="sr-only">Explore our expertise</legend>
                {SERVICES.map((item, index) => {
                  const Icon = [Code2, GitBranch, Sparkles][index];
                  return (
                    <button
                      type="button"
                      key={item.short}
                      className="service-choice"
                      aria-pressed={service === index}
                      onClick={() => setService(index)}
                    >
                      <Icon size={22} strokeWidth={1.5} />
                      <span>{item.short}</span>
                      <ArrowRight size={22} />
                    </button>
                  );
                })}
              </fieldset>
              <div className="service-detail" key={service}>
                <h3>{SERVICES[service].title}</h3>
                <p>{SERVICES[service].description}</p>
                <ul className="service-tags">
                  {SERVICES[service].tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <a
                  className="text-link"
                  href={
                    CONTACT +
                    '&body=' +
                    encodeURIComponent(
                      'Hi ab-tech-dev,\n\nI would like to discuss ' +
                        SERVICES[service].short.toLowerCase() +
                        ' for my business.\n\nHere is what I have in mind:\n',
                    )
                  }
                >
                  <Roll>Let’s explore it</Roll>
                  <Arrow />
                </a>
              </div>
            </div>
            <div className="service-art" data-scene-sticky>
              <SceneZone name="expertise" />
              <div className="service-arrival">
                <div className="service-tilt">
                  <ServicePlayground service={service} />
                </div>
              </div>
            </div>
          </div>
          <div className="service-connector" aria-hidden="true">
            <i />
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              <span>Less friction.</span>
              <span>More possibility.</span>
            </div>
          </div>
        </section>
        <section id="work" className="work section-pad" tabIndex={-1}>
          <SectionLabel
            index="03"
            title="Selected work"
            note="Shipped systems · 2025—2026"
          />
          <div className="work-heading">
            <div>
              <h2>
                Built things.
                <br />
                Real outcomes.
              </h2>
            </div>
            <p>
              A selection of shipped experiences and working systems across software,
              commerce, and applied AI.
            </p>
          </div>
          <div className="project-list">
            {PROJECTS.map((project) => (
              <article className={`project-case project-${project.slug}`} key={project.title}>
                <div className="project-copy">
                  <div className="project-meta">
                    <span>{project.index}</span>
                    <span>{project.type}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul>
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="project-actions">
                    {'live' in project && project.live ? (
                      <a href={project.live} target="_blank" rel="noreferrer">
                        <Roll>View live project</Roll>
                        <Arrow />
                      </a>
                    ) : null}
                    <a href={project.source} target="_blank" rel="noreferrer">
                      <Code2 size={17} strokeWidth={1.5} aria-hidden="true" />
                      <Roll>View source</Roll>
                    </a>
                  </div>
                </div>
                <div className="project-visual">
                  <figure className="project-image-frame">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 900px) 96vw, 48vw"
                      loading="lazy"
                    />
                    <figcaption>
                      <span>Project / {project.index}</span>
                      <span>{project.visual}</span>
                    </figcaption>
                  </figure>
                </div>
              </article>
            ))}
          </div>
          <a
            className="github-profile-link"
            href="https://github.com/ab-tech-dev"
            target="_blank"
            rel="noreferrer"
          >
            <span>More experiments and builds on GitHub</span>
            <Code2 size={20} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </section>
        <section id="approach" className="approach section-pad" tabIndex={-1}>
          <div
            className="chapter-atmosphere"
            data-parallax
            aria-hidden="true"
          />
          <SectionLabel
            index="04"
            title="The approach"
            note="Clear thinking. Visible progress."
          />
          <div className="approach-layout">
            <div className="approach-lead" data-scene-sticky>
              <h2>
                Good work.
                <br />
                Clear process.
              </h2>
              <p>
                Close collaboration, visible progress, and care in every detail.
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
                    <span className="step-deliverable">
                      {
                        [
                          'A shared brief and a clear direction',
                          'A working product, shaped together',
                          'A confident launch and clear handover',
                        ][index]
                      }
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section" tabIndex={-1}>
          <div className="contact-inner section-pad">
            <SectionLabel
              index="05"
              title="Start something"
              note="An idea. A challenge. A better way."
            />
            <h2>
              <span className="contact-line">Let’s make</span>
              <span className="contact-line contact-second">it work.</span>
            </h2>
            <SceneZone name="contact" />
            <div className="contact-bottom">
              <p>
                Tell us what you have in mind.
                <br />
                We’ll work out the next move together.
              </p>
              <a
                className="contact-button"
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
              >
                <Roll>Chat on WhatsApp</Roll>
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
        <div className="footer-opening">
          <p>
            Thoughtful software.
            <br />
            Effortless automation.
          </p>
          <SceneZone name="footer" />
          <nav aria-label="Footer navigation">
            <a href="#about">The studio</a>
            <a href="#expertise">Our expertise</a>
            <a href="#work">Selected work</a>
            <a href="#approach">The approach</a>
          </nav>
        </div>
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
