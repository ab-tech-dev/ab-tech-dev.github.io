import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLivingSystem } from './living-system';
import {
  clamp01,
  mix,
  resolveStops,
  type SystemState,
} from './motion-state';

type Anchor = {
  x: number;
  y: number;
  width: number;
  height: number;
  areaWidth: number;
  parentTop: number;
  stickyTop: number;
  travel: number;
};
type Stop = { at: number; chapter: number; anchor: number };

export function createMotionStory(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  let initialArrival = true;
  media.add(
    {
      reduced: '(prefers-reduced-motion: reduce)',
      compact: '(max-width: 900px)',
      fine: '(pointer: fine)',
    },
    (context) => {
      const reduced = Boolean(context.conditions?.reduced);
      const compact = Boolean(context.conditions?.compact);
      const fine = Boolean(context.conditions?.fine);
      const desktop = !compact && !reduced;
      const pinned = !reduced;
      const select = <T extends HTMLElement = HTMLElement>(selector: string) =>
        root.querySelector<T>(selector)!;
      const all = (selector: string) => [
        ...root.querySelectorAll<HTMLElement>(selector),
      ];
      const host = select('.living-system');
      const track = select('.hero-track');
      const stage = select('.hero-stage');
      const acts = all('.hero-act');
      const zones = all('[data-scene-zone]');
      const steps = all('.process-step');
      const projectCases = all('.project-case');
      const progress = select('[data-progress]');
      const chapterReadout = select('[data-chapter-readout]');
      const services = select('.services-layout');
      const work = select('#work');
      const serviceArt = select('.service-art');
      const lead = select('.approach-lead');
      const chapters = all(
        '.intro,.expertise,.work,.approach,.contact-section,.site-footer',
      );
      const phraseLines = all('[data-phrase]');
      const serviceChoices = all('.service-choice');

      const state: SystemState = {
        chapter: 0,
        x: 0,
        y: 0,
        width: 400,
        pointerX: 0,
        pointerY: 0,
      };
      root.classList.add('story-ready');
      root.classList.toggle('motion-desktop', desktop);
      root.classList.toggle('motion-compact', !desktop);
      root.classList.toggle('motion-pinned', pinned);
      root.classList.toggle('reduced-motion', reduced);
      let system: ReturnType<typeof createLivingSystem> | undefined;
      if (!reduced) {
        try {
          system = createLivingSystem(host, state, compact);
        } catch {
          host.classList.add('scene-fallback');
        }
      }
      let destroyed = false;
      let anchors: Anchor[] = [];
      let stops: Stop[] = [];
      let stepStops: number[] = [];
      let sectionStops: number[] = [];
      let heroTravel = 1;
      let docHeight = 1;
      let activeAct = -1;
      let activeStep = -1;
      let activeSection = -1;
      let measureFrame = 0;
      let lastSignature = '';
      let lastChange = 0;
      let lastSystemRender = -Infinity;
      const setAct = (value: number) => {
        if (activeAct === value) return;
        activeAct = value;
        track.dataset.act = String(value);
        acts.forEach((act, index) => {
          act.inert = pinned && index !== value;
          act.setAttribute('aria-hidden', String(pinned && index !== value));
        });
      };
      setAct(0);
      const top = (element: HTMLElement) =>
        element.getBoundingClientRect().top + window.scrollY;
      const readAnchor = (element: HTMLElement): Anchor => {
        const rect = element.getBoundingClientRect();
        const parent = pinned
          ? element.closest<HTMLElement>('[data-scene-sticky]')
          : null;
        const container = parent?.parentElement;
        const sticky =
          parent && container && getComputedStyle(parent).position === 'sticky';
        const parentTop = sticky
          ? top(container) +
            (parseFloat(getComputedStyle(parent).marginTop) || 0)
          : 0;
        const naturalY = sticky
          ? parentTop + rect.top - parent.getBoundingClientRect().top
          : rect.top + window.scrollY;
        return {
          x: rect.left + rect.width / 2,
          y: naturalY + rect.height / 2,
          width: Math.min(rect.width, rect.height * 1.65),
          height: rect.height,
          areaWidth: rect.width,
          parentTop,
          stickyTop: sticky ? parseFloat(getComputedStyle(parent).top) || 0 : 0,
          travel: sticky
            ? Math.max(0, container.offsetHeight - parent.offsetHeight)
            : 0,
        };
      };
      const measure = () => {
        measureFrame = 0;
        if (destroyed) return;
        const h = window.innerHeight;
        const shortDesktop = desktop && h <= 680;
        serviceArt.classList.toggle(
          'can-stick',
          desktop &&
            serviceArt.getBoundingClientRect().height <
              h - (shortDesktop ? 72 : 160),
        );
        lead.classList.toggle(
          'can-stick',
          desktop && lead.offsetHeight < h - (shortDesktop ? 40 : 160),
        );
        anchors = zones.map(readAnchor);
        heroTravel = Math.max(1, track.offsetHeight - stage.offsetHeight);
        const zoneIndex = (name: string) =>
          zones.findIndex((zone) => zone.dataset.sceneZone === name);
        const anchorAt = (name: string) => anchors[zoneIndex(name)].y;
        const about = top(select('#about'));
        const contact = top(select('#contact'));
        stepStops = steps.map((step) => top(step) - h * 0.55);
        sectionStops = [
          0,
          about - h * 0.35,
          top(select('#expertise')) - h * 0.35,
          top(work) - h * 0.35,
          top(select('#approach')) - h * 0.35,
          contact - h * 0.35,
          top(select('.site-footer')) - h * 0.5,
        ];
        const make = (at: number, chapter: number, name: string): Stop => ({
          at,
          chapter,
          anchor: zoneIndex(name),
        });
        stops = desktop
          ? [
              make(0, 0, 'hero'),
              make(heroTravel * 0.18, 0, 'hero'),
              make(heroTravel * 0.43, 1, 'hero'),
              make(heroTravel * 0.62, 1, 'hero'),
              make(heroTravel * 0.85, 2, 'hero'),
              make(about - h * 0.12, 3, 'studio'),
              make(anchorAt('studio') - h * 0.26, 3, 'studio'),
              make(top(services) - h * 0.3, 4, 'expertise'),
              make(
                top(services) + services.offsetHeight - h * 0.8,
                4,
                'expertise',
              ),
              make(top(work) - h * 0.3, 4, 'expertise'),
              make(top(select('#approach')) - h * 0.55, 4, 'expertise'),
              make(stepStops[0], 5, 'process'),
              make(stepStops[1], 6, 'process'),
              make(stepStops[2], 7, 'process'),
              make(contact - h * 0.15, 8, 'contact'),
              make(anchorAt('contact') - h * 0.1, 8, 'contact'),
              make(anchorAt('footer') - h * 0.5, 9, 'footer'),
            ]
          : pinned
            ? [
                make(0, 0, 'hero'),
                make(heroTravel * 0.18, 0, 'hero'),
                make(heroTravel * 0.43, 1, 'hero'),
                make(heroTravel * 0.62, 1, 'hero'),
                make(heroTravel * 0.85, 2, 'hero'),
                make(anchorAt('studio') - h * 0.5, 3, 'studio'),
                make(anchorAt('expertise') - h * 0.5, 4, 'expertise'),
                make(top(work) - h * 0.3, 4, 'expertise'),
                make(top(select('#approach')) - h * 0.55, 4, 'expertise'),
                make(stepStops[0], 5, 'process'),
                make(stepStops[1], 6, 'process'),
                make(stepStops[2], 7, 'process'),
                make(anchorAt('contact') - h * 0.5, 8, 'contact'),
                make(anchorAt('footer') - h * 0.5, 9, 'footer'),
              ]
            : [
              make(0, 0, 'hero-0'),
              make(anchorAt('hero-0') - h * 0.45, 0, 'hero-0'),
              make(anchorAt('hero-1') - h * 0.5, 1, 'hero-1'),
              make(anchorAt('hero-2') - h * 0.5, 2, 'hero-2'),
              make(anchorAt('studio') - h * 0.5, 3, 'studio'),
              make(anchorAt('expertise') - h * 0.5, 4, 'expertise'),
              make(top(work) - h * 0.3, 4, 'expertise'),
              make(top(select('#approach')) - h * 0.55, 4, 'expertise'),
              make(stepStops[0], 5, 'process'),
              make(stepStops[1], 6, 'process'),
              make(stepStops[2], 7, 'process'),
              make(anchorAt('contact') - h * 0.5, 8, 'contact'),
              make(anchorAt('footer') - h * 0.5, 9, 'footer'),
              ];
        // Ensure the closing signature is reachable even when the footer is shorter than the viewport.
        docHeight = Math.max(1, document.documentElement.scrollHeight - h);
        stops.forEach((stop, index) => {
          stop.at = Math.min(stop.at, docHeight - (stops.length - 1 - index));
          if (index) stop.at = Math.max(stops[index - 1].at + 1, stop.at);
        });
        lastSignature = '';
      };
      const queueMeasure = () => {
        if (!destroyed && !measureFrame)
          measureFrame = requestAnimationFrame(() => {
            measure();
            ScrollTrigger.refresh();
          });
      };
      const anchorY = (anchor: Anchor, scroll: number) =>
        anchor.y -
        scroll +
        Math.max(
          0,
          Math.min(anchor.travel, scroll + anchor.stickyTop - anchor.parentTop),
        );
      const tick = (time: number) => {
        if (
          document.hidden ||
          !anchors.length ||
          root.dataset.menuOpen === 'true'
        )
          return;
        const scroll = window.scrollY;
        const position = resolveStops(
          scroll,
          stops.map((stop) => stop.at),
        );
        const index = Math.floor(position);
        const a = stops[index],
          b = stops[Math.min(index + 1, stops.length - 1)];
        // Keep the scene locked to the physical scroll position. Easing this
        // value makes the artwork start slowly, then appear to catch up with
        // the page even though no temporal smoothing is involved.
        const t = position - index;
        const from = anchors[a.anchor],
          to = anchors[b.anchor];
        state.chapter = mix(a.chapter, b.chapter, t);
        state.x = mix(from.x, to.x, t);
        state.y = mix(anchorY(from, scroll), anchorY(to, scroll), t);
        state.width = mix(from.width, to.width, t);
        const compactZones = desktop
          ? []
          : anchors.flatMap((anchor, index) => {
              const center = anchorY(anchor, scroll);
              return anchor.width > 0 &&
                anchor.height > 0 &&
                center + anchor.height / 2 > 76 &&
                center - anchor.height / 2 < window.innerHeight
                ? [index]
                : [];
            });
        const chapter = state.chapter;
        if (desktop && chapter > 3 && chapter < 5) {
          const anchor =
            anchors[
              zones.findIndex((zone) => zone.dataset.sceneZone === 'expertise')
            ];
          const upper = Math.max(
            0,
            anchorY(anchor, scroll) - anchor.height / 2,
          );
          host.style.clipPath = `inset(${upper}px 0 0 0)`;
        } else host.style.clipPath = '';
        const heroProgress = clamp01(scroll / heroTravel);
        if (pinned)
          setAct(heroProgress < 0.34 ? 0 : heroProgress < 0.73 ? 1 : 2);
        track.style.setProperty('--chapter-progress', String(heroProgress));
        root.classList.toggle('header-scrolled', scroll > 60);
        const pageProgress = clamp01(scroll / docHeight);
        progress.style.transform = `scaleX(${pageProgress})`;
        root.style.setProperty('--page-progress', String(pageProgress));
        root.style.setProperty(
          '--cosmic-shift',
          `${-4 + pageProgress * 8}vh`,
        );
        root.style.setProperty(
          '--cosmic-rotation',
          `${-17 + pageProgress * 4}deg`,
        );
        const step = stepStops.reduce(
          (value, at, i) => (scroll >= at ? i : value),
          -1,
        );
        if (step !== activeStep) {
          activeStep = step;
          steps.forEach((item, i) => (item.dataset.active = String(i <= step)));
        }
        const section = sectionStops.reduce(
          (value, at, i) => (scroll >= at ? i : value),
          0,
        );
        if (section !== activeSection) {
          activeSection = section;
          const chapterNames = [
            'imagine',
            'studio',
            'expertise',
            'work',
            'approach',
            'contact',
            'signature',
          ];
          root.dataset.chapter = chapterNames[section];
          chapterReadout.textContent = chapterNames[section];
          all('.desktop-nav a').forEach((link) => {
            const active =
              link.getAttribute('href') ===
              [
                '#top',
                '#about',
                '#expertise',
                '#work',
                '#approach',
                '#contact',
                '#footer',
              ][section];
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
        const signature = [
          scroll,
          state.pointerX,
          state.pointerY,
          window.innerWidth,
          window.innerHeight,
        ].join(':');
        if (signature !== lastSignature) lastChange = time;
        const moving = chapter > 0.5 && chapter < 1.5;
        const visible = desktop
          ? state.y > -state.width && state.y < window.innerHeight + state.width
          : compactZones.length > 0;
        host.style.visibility = visible ? 'visible' : 'hidden';
        const systemFrameInterval = compact ? 1 / 24 : 1 / 36;
        if (
          system &&
          visible &&
          (moving || time - lastChange < 0.28) &&
          time - lastSystemRender >= systemFrameInterval
        ) {
          lastSystemRender = time;
          if (desktop) system.render(time);
          else {
            system.clear();
            const chapters: Record<string, number> = {
              'hero-0': 0,
              'hero-1': 1,
              'hero-2': 2,
              studio: 3,
              expertise: 4,
              process: 5,
              contact: 8,
              footer: 9,
            };
            compactZones.forEach((index) => {
              const anchor = anchors[index];
              const name = zones[index].dataset.sceneZone!;
              state.chapter =
                name === 'hero'
                  ? chapter
                  : name === 'process'
                  ? Math.max(5, Math.min(7, chapter))
                  : (chapters[name] ?? 0);
              state.x = anchor.x;
              state.y = anchorY(anchor, scroll);
              state.width = anchor.width * 0.88;
              const upper = Math.max(76, state.y - anchor.height / 2);
              const bottom = Math.min(
                window.innerHeight,
                state.y + anchor.height / 2,
              );
              const left = Math.max(0, anchor.x - anchor.areaWidth / 2);
              const right = Math.min(
                window.innerWidth,
                anchor.x + anchor.areaWidth / 2,
              );
              const clipWidth = Math.max(0, right - left);
              const clipHeight = Math.max(0, bottom - upper);
              if (clipWidth > 0 && clipHeight > 0)
                system!.render(time, false, {
                  x: left,
                  y: upper,
                  width: clipWidth,
                  height: clipHeight,
                });
            });
          }
          root.classList.toggle(
            'scene-available',
            host.classList.contains('scene-ready'),
          );
        }
        lastSignature = signature;
      };
      measure();
      if (!reduced) {
        if (pinned) {
          if (window.scrollY < 24 && !window.location.hash) {
            gsap.from(acts[0].querySelectorAll('.heading-line'), {
              yPercent: 18,
              opacity: 0.55,
              duration: 0.9,
              stagger: 0.07,
              ease: 'power3.out',
            });
          }
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.18,
              invalidateOnRefresh: true,
            },
          });
          gsap.set(acts.slice(1), { autoAlpha: 0, y: 32 });
          timeline
            .to(
              acts[0],
              { autoAlpha: 0, y: -32, duration: 0.1, ease: 'none' },
              0.24,
            )
            .to(
              acts[1],
              { autoAlpha: 1, y: 0, duration: 0.1, ease: 'none' },
              0.35,
            )
            .to(
              acts[1],
              { autoAlpha: 0, y: -32, duration: 0.08, ease: 'none' },
              0.62,
            )
            .to(
              acts[2],
              { autoAlpha: 1, y: 0, duration: 0.1, ease: 'none' },
              0.71,
            )
            .to({}, { duration: 0.19 }, 0.81);
          gsap.to(select('.scene-orbit'), {
            rotation: 30,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: track,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.18,
            },
          });
        } else {
          acts.forEach((act) =>
            gsap.from(act.querySelectorAll('h1,h2,.hero-description'), {
              y: 20,
              opacity: 0.65,
              duration: 0.7,
              stagger: 0.07,
              scrollTrigger: { trigger: act, start: 'top 85%', once: true },
            }),
          );
        }
        // Each section advances the same visual current while retaining its own
        // movement grammar. The custom property also drives the CSS depth field.
        chapters.forEach((chapter) =>
          gsap.fromTo(
            chapter,
            {
              '--section-progress': 0,
              '--depth-opacity': 0.16,
              '--depth-scale': 0.9,
              '--intro-origin': '18%',
              '--grid-shift': '0px',
              '--grid-shift-negative': '0px',
              '--orbit-rotation': '-12deg',
              '--contact-drift': '4.5%',
            },
            {
              '--section-progress': 1,
              '--depth-opacity': 0.34,
              '--depth-scale': 1.02,
              '--intro-origin': '66%',
              '--grid-shift': '72px',
              '--grid-shift-negative': '-72px',
              '--orbit-rotation': '12deg',
              '--contact-drift': '-4.5%',
              ease: 'none',
              scrollTrigger: {
                trigger: chapter,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.18,
              },
            },
          ),
        );
        gsap.fromTo(
          select('.intro-lower'),
          { y: desktop ? 80 : 30, opacity: 0.25 },
          {
            y: desktop ? -18 : 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.intro-lower',
              start: 'top 96%',
              end: 'bottom 42%',
              scrub: 0.18,
            },
          },
        );
        phraseLines.forEach((phrase, index) =>
          gsap.fromTo(
            phrase,
            {
              color: '#647367',
              xPercent: compact ? 0 : index % 2 ? 7 : -7,
              rotationY: compact ? 0 : index % 2 ? -5 : 5,
              transformOrigin: index % 2 ? 'right center' : 'left center',
            },
            {
              color: '#eff1e9',
              xPercent: 0,
              rotationY: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: phrase,
                start: 'top 92%',
                end: 'bottom 45%',
                scrub: 0.18,
              },
            },
          ),
        );
        gsap.fromTo(
          all('.studio-connections span'),
          { y: 24, opacity: 0.2 },
          {
            y: -8,
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: '.studio-connections',
              start: 'top 92%',
              end: 'bottom 48%',
              scrub: 0.18,
            },
          },
        );
        gsap.fromTo(
          all('.studio-connections i'),
          { scaleX: 0 },
          {
            scaleX: 1,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: {
              trigger: '.studio-connections',
              start: 'top 82%',
              end: 'bottom 54%',
              scrub: 0.18,
            },
          },
        );
        gsap.fromTo(
          select('.expertise-heading'),
          { x: compact ? 0 : -70, y: 45, opacity: 0.25, scale: 0.94 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.expertise-heading',
              start: 'top 95%',
              end: 'bottom 45%',
              scrub: 0.18,
            },
          },
        );
        gsap.fromTo(
          serviceChoices,
          { x: compact ? 0 : -48, opacity: 0.25 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: {
              trigger: '.service-options',
              start: 'top 90%',
              end: 'bottom 48%',
              scrub: 0.18,
            },
          },
        );
        gsap.fromTo(
          select('.service-arrival'),
          {
            rotationX: desktop ? 8 : 0,
            rotationY: desktop ? -12 : 0,
            y: desktop ? 90 : 24,
            scale: desktop ? 0.86 : 0.97,
            opacity: 0.35,
          },
          {
            rotationX: 0,
            rotationY: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: services,
              start: 'top 94%',
              end: 'top 28%',
              scrub: 0.18,
            },
          },
        );
        gsap.fromTo(
          select('.service-connector i'),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.service-connector',
              start: 'top 85%',
              end: 'bottom 50%',
              scrub: 0.18,
            },
          },
        );
        gsap.to(select('.marquee-track'), {
          xPercent: compact ? -9 : -16,
          ease: 'none',
          scrollTrigger: {
            trigger: '.marquee',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.18,
          },
        });
        gsap.fromTo(
          select('.work-heading'),
          { y: compact ? 28 : 64, opacity: 0.28 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.work-heading',
              start: 'top 92%',
              end: 'bottom 52%',
              scrub: 0.18,
            },
          },
        );
        projectCases.forEach((project, index) => {
          const copy = project.querySelector<HTMLElement>('.project-copy');
          const visual = project.querySelector<HTMLElement>('.project-visual');
          if (!copy || !visual) return;
          gsap.fromTo(
            copy,
            {
              x: compact ? 0 : index % 2 ? 54 : -54,
              y: compact ? 24 : 44,
              opacity: 0.2,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: project,
                start: 'top 92%',
                end: 'top 43%',
                scrub: 0.18,
              },
            },
          );
          gsap.fromTo(
            visual,
            {
              y: compact ? 24 : 76,
              rotationY: compact ? 0 : index % 2 ? -5 : 5,
              scale: compact ? 0.98 : 0.9,
              opacity: 0.22,
            },
            {
              y: 0,
              rotationY: 0,
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: project,
                start: 'top 95%',
                end: 'top 38%',
                scrub: 0.18,
              },
            },
          );
        });
        steps.forEach((step, index) => {
          gsap.fromTo(
            step,
            {
              x: compact ? 0 : index % 2 ? 76 : 42,
              y: compact ? 24 : 55,
              rotationY: compact ? 0 : index % 2 ? -7 : 5,
              scale: compact ? 0.98 : 0.92,
              opacity: 0.22,
              transformOrigin: 'left center',
            },
            {
              x: 0,
              y: 0,
              rotationY: 0,
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: step,
                start: 'top 94%',
                end: 'top 48%',
                scrub: 0.18,
              },
            },
          );
          gsap.fromTo(
            step,
            { '--step-fill': 0 },
            {
              '--step-fill': 1,
              ease: 'none',
              scrollTrigger: {
                trigger: step,
                start: 'top 65%',
                end: 'bottom 55%',
                scrub: 0.18,
              },
            },
          );
        });
        all('.contact-line').forEach((line, index) =>
          gsap.fromTo(
            line,
            {
              xPercent: compact ? 0 : index ? 6 : -6,
              yPercent: 18,
              rotationX: desktop ? -10 : 0,
              opacity: 0.55,
            },
            {
              xPercent: 0,
              yPercent: 0,
              rotationX: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: '.contact-inner h2',
                start: 'top 96%',
                end: 'bottom 45%',
                scrub: 0.18,
              },
            },
          ),
        );
        gsap.fromTo(
          select('.contact-bottom'),
          { y: 60, opacity: 0.2 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.contact-bottom',
              start: 'top 96%',
              end: 'bottom 66%',
              scrub: 0.18,
            },
          },
        );
        gsap.fromTo(
          select('.footer-wordmark'),
          { y: 55, scale: 0.82, opacity: 0.18 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.site-footer',
              start: 'top 96%',
              end: 'bottom bottom',
              scrub: 0.18,
            },
          },
        );
        if (fine && desktop) {
          all('[data-parallax]').forEach((layer) =>
            gsap.fromTo(
              layer,
              { y: -20 },
              {
                y: 20,
                ease: 'none',
                scrollTrigger: {
                  trigger: layer.parentElement,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.18,
                },
              },
            ),
          );
        }
      }
      const move = (event: PointerEvent) => {
        if (!fine || reduced || event.pointerType !== 'mouse') return;
        state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
        state.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      };
      const leave = () => {
        state.pointerX = 0;
        state.pointerY = 0;
        lastSignature = '';
      };
      const keyboard = () => {
        leave();
        serviceArt.style.setProperty('--tilt-x', '0deg');
        serviceArt.style.setProperty('--tilt-y', '0deg');
      };
      const tilt = (event: PointerEvent) => {
        if (!fine || !desktop || event.pointerType !== 'mouse') return;
        const rect = serviceArt.getBoundingClientRect();
        serviceArt.style.setProperty(
          '--tilt-x',
          `${((event.clientY - rect.top - rect.height / 2) / rect.height) * -4}deg`,
        );
        serviceArt.style.setProperty(
          '--tilt-y',
          `${((event.clientX - rect.left - rect.width / 2) / rect.width) * 4}deg`,
        );
      };
      root.addEventListener('pointermove', move);
      root.addEventListener('pointerleave', leave);
      root.addEventListener('keydown', keyboard);
      serviceArt.addEventListener('pointermove', tilt);
      serviceArt.addEventListener('pointerleave', keyboard);
      const previewObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            serviceArt.dataset.entered = 'true';
            previewObserver.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      previewObserver.observe(serviceArt);
      const observer = new ResizeObserver(queueMeasure);
      observer.observe(root);
      observer.observe(services);
      window.addEventListener('resize', queueMeasure);
      ScrollTrigger.addEventListener('refresh', measure);
      const restored = () => {
        lastSignature = '';
      };
      host.addEventListener('webglcontextrestored', restored, true);
      const lost = () => {
        root.classList.remove('scene-available');
      };
      host.addEventListener('webglcontextlost', lost, true);
      void document.fonts.ready.then(() => {
        if (!destroyed) queueMeasure();
      });
      const hashChange = () => {
        lastSignature = '';
      };
      window.addEventListener('hashchange', hashChange);
      gsap.ticker.add(tick);
      ScrollTrigger.refresh();
      if (initialArrival && window.location.hash)
        document
          .getElementById(window.location.hash.slice(1))
          ?.scrollIntoView({ behavior: 'instant', block: 'start' });
      initialArrival = false;
      tick(0);
      return () => {
        destroyed = true;
        cancelAnimationFrame(measureFrame);
        observer.disconnect();
        previewObserver.disconnect();
        delete serviceArt.dataset.entered;
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener('refresh', measure);
        window.removeEventListener('resize', queueMeasure);
        window.removeEventListener('hashchange', hashChange);
        host.removeEventListener('webglcontextrestored', restored, true);
        host.removeEventListener('webglcontextlost', lost, true);
        root.removeEventListener('pointermove', move);
        root.removeEventListener('pointerleave', leave);
        root.removeEventListener('keydown', keyboard);
        serviceArt.removeEventListener('pointermove', tilt);
        serviceArt.removeEventListener('pointerleave', keyboard);
        system?.destroy();
        host.style.clipPath = '';
        root.style.removeProperty('--page-progress');
        root.style.removeProperty('--cosmic-shift');
        root.style.removeProperty('--cosmic-rotation');
        root.classList.remove(
          'story-ready',
          'motion-desktop',
          'motion-compact',
          'motion-pinned',
          'reduced-motion',
          'scene-available',
        );
        acts.forEach((act) => {
          act.inert = false;
          act.removeAttribute('aria-hidden');
        });
        serviceArt.classList.remove('can-stick');
        lead.classList.remove('can-stick');
      };
    },
    root,
  );
  return () => media.revert();
}
