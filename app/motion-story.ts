import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLivingSystem } from './living-system';
import {
  clamp01,
  mix,
  resolveStops,
  smooth,
  type SystemState,
} from './motion-state';

type Anchor = {
  x: number;
  y: number;
  width: number;
  parentTop: number;
  stickyTop: number;
  travel: number;
};
type Stop = { at: number; chapter: number; anchor: number };

export function createMotionStory(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add(
    {
      reduced: '(prefers-reduced-motion: reduce)',
      compact: '(max-width: 900px), (max-height: 680px)',
      fine: '(pointer: fine)',
    },
    (context) => {
      const reduced = Boolean(context.conditions?.reduced);
      const compact = Boolean(context.conditions?.compact);
      const fine = Boolean(context.conditions?.fine);
      const desktop = !compact && !reduced;
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
      const progress = select('[data-progress]');
      const services = select('.services-layout');
      const serviceArt = select('.service-art');
      const lead = select('.approach-lead');

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
      const setAct = (value: number) => {
        if (activeAct === value) return;
        activeAct = value;
        track.dataset.act = String(value);
        acts.forEach((act, index) => {
          act.inert = desktop && index !== value;
          act.setAttribute('aria-hidden', String(desktop && index !== value));
        });
      };
      setAct(0);
      const top = (element: HTMLElement) =>
        element.getBoundingClientRect().top + window.scrollY;
      const readAnchor = (element: HTMLElement): Anchor => {
        const rect = element.getBoundingClientRect();
        const parent = desktop
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
        serviceArt.classList.toggle(
          'can-stick',
          desktop && serviceArt.offsetHeight < h - 160,
        );
        lead.classList.toggle(
          'can-stick',
          desktop && lead.offsetHeight < h - 160,
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
              make(stepStops[0], 5, 'process'),
              make(stepStops[1], 6, 'process'),
              make(stepStops[2], 7, 'process'),
              make(contact - h * 0.15, 8, 'contact'),
              make(anchorAt('contact') - h * 0.1, 8, 'contact'),
              make(anchorAt('footer') - h * 0.5, 9, 'footer'),
            ]
          : [
              make(0, 0, 'hero-0'),
              make(anchorAt('hero-0') - h * 0.45, 0, 'hero-0'),
              make(anchorAt('hero-1') - h * 0.5, 1, 'hero-1'),
              make(anchorAt('hero-2') - h * 0.5, 2, 'hero-2'),
              make(anchorAt('studio') - h * 0.5, 3, 'studio'),
              make(anchorAt('expertise') - h * 0.5, 4, 'expertise'),
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
        const t = smooth(position - index);
        const from = anchors[a.anchor],
          to = anchors[b.anchor];
        state.chapter = mix(a.chapter, b.chapter, t);
        state.x = mix(from.x, to.x, t);
        state.y = mix(anchorY(from, scroll), anchorY(to, scroll), t);
        state.width = mix(from.width, to.width, t);
        const heroProgress = clamp01(scroll / heroTravel);
        if (desktop)
          setAct(heroProgress < 0.34 ? 0 : heroProgress < 0.73 ? 1 : 2);
        track.style.setProperty('--chapter-progress', String(heroProgress));
        root.classList.toggle('header-scrolled', scroll > 60);
        progress.style.transform = `scaleX(${clamp01(scroll / docHeight)})`;
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
          root.dataset.chapter = [
            'imagine',
            'studio',
            'expertise',
            'approach',
            'contact',
            'signature',
          ][section];
          all('.desktop-nav a').forEach((link) => {
            const active =
              link.getAttribute('href') ===
              [
                '#top',
                '#about',
                '#expertise',
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
        const moving = state.chapter > 0.5 && state.chapter < 1.5;
        const visible =
          state.y > -state.width && state.y < window.innerHeight + state.width;
        host.style.visibility = visible ? 'visible' : 'hidden';
        if (system && visible && (moving || time - lastChange < 0.8)) {
          system.render(time);
          root.classList.toggle(
            'scene-available',
            host.classList.contains('scene-ready'),
          );
        }
        lastSignature = signature;
      };
      measure();
      if (!reduced) {
        if (desktop) {
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
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });
          gsap.set(acts.slice(1), { autoAlpha: 0, y: 32 });
          timeline
            .to(
              acts[0],
              { autoAlpha: 0, y: -32, duration: 0.12, ease: 'none' },
              0.24,
            )
            .to(
              acts[1],
              { autoAlpha: 1, y: 0, duration: 0.12, ease: 'none' },
              0.3,
            )
            .to(
              acts[1],
              { autoAlpha: 0, y: -32, duration: 0.12, ease: 'none' },
              0.63,
            )
            .to(
              acts[2],
              { autoAlpha: 1, y: 0, duration: 0.12, ease: 'none' },
              0.69,
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
              scrub: 0.5,
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
        // Every reading chapter has its own cadence; no document-wide reveal preset.
        gsap.from(select('.intro-lower'), {
          y: 24,
          opacity: 0.5,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.intro-lower',
            start: 'top 90%',
            once: true,
          },
        });
        all('[data-phrase]').forEach((phrase) =>
          gsap.fromTo(
            phrase,
            { color: '#66735e' },
            {
              color: '#192219',
              ease: 'none',
              scrollTrigger: {
                trigger: phrase,
                start: 'top 82%',
                end: 'bottom 48%',
                scrub: 0.3,
              },
            },
          ),
        );
        gsap.from(select('.expertise-heading'), {
          y: 28,
          opacity: 0.55,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.expertise-heading',
            start: 'top 88%',
            once: true,
          },
        });
        gsap.fromTo(
          select('.service-arrival'),
          {
            rotationY: desktop ? -6 : 0,
            y: desktop ? 40 : 16,
            scale: desktop ? 0.94 : 1,
          },
          {
            rotationY: 0,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: services,
              start: 'top 88%',
              end: 'top 32%',
              scrub: 0.4,
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
              scrub: 0.35,
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
            scrub: 0.45,
          },
        });
        steps.forEach((step) => {
          gsap.from(step.querySelector('div'), {
            y: 18,
            opacity: 0.65,
            duration: 0.65,
            scrollTrigger: { trigger: step, start: 'top 85%', once: true },
          });
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
                scrub: 0.3,
              },
            },
          );
        });
        gsap.from(all('.contact-line'), {
          yPercent: 25,
          rotationX: desktop ? -6 : 0,
          opacity: 0.65,
          stagger: 0.09,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-inner h2',
            start: 'top 86%',
            once: true,
          },
        });
        gsap.from(select('.footer-wordmark'), {
          y: 20,
          opacity: 0.5,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.footer-wordmark',
            start: 'top 95%',
            once: true,
          },
        });
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
                  scrub: 0.45,
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
      if (window.location.hash)
        document
          .getElementById(window.location.hash.slice(1))
          ?.scrollIntoView({ behavior: 'instant', block: 'start' });
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
        root.classList.remove(
          'story-ready',
          'motion-desktop',
          'motion-compact',
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
