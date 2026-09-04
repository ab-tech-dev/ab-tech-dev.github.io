# ab-tech-dev

A software and automation studio website, built with React and Vinext. Contact links open an email draft to **mrjoshuaability@gmail.com**.

## Develop

Run `npm install`, then `npm run dev`. Run `npm run build` for the production build.

## Visuals and motion

Six original landscape artworks were generated with the built-in ImageGen tool. Project assets are in `public/frames/`; the exact prompt set is preserved in `docs/imagegen-prompts.json`. The scroll experience interpolates between these six keyframes with crossfades, scaling, and cropping in the browser. They are individual generated keyframes, not a rendered video or a dense frame-by-frame 3D sequence.

- Hero: assembled core → exploded core → inside the system.
- System scene: connected modules → orchestration architecture.
- Expertise: image transitions paired with accessible accordion panels.
- Closing scene: quiet horizon with an expanding image reveal.
- Text: progressive word emphasis and line entrance effects.
- Controls: clipped rolling labels, animated arrows, keyboard-accessible full-screen menu.

Native scrolling remains available for touch, keyboard, and assistive technology. `prefers-reduced-motion` removes long pinned sequences and reveal motion.

## Reference study

The motion language was studied from [Jesko Jets](https://jeskojets.com/) and its public styles and animation scripts. This implementation uses original content, branding, artwork, and application code.

Confirmed source behavior includes 300vh/200vh hero staging, extreme camera and text zooms, layered scene transitions, progressive text emphasis, clipped link rollovers, image-led accordions, and a responsive full-screen menu. The source uses GSAP, ScrollTrigger, and Lenis; this version uses native scrolling and a small requestAnimationFrame controller.

The browser connection was unavailable during the reference audit. The reference findings are source-verified; a full visual inspection of every live transition was not completed.
