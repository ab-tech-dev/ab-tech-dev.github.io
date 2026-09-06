# ab-tech-dev

A software and automation studio website, built with React and Vinext. Contact links open an email draft to **mrjoshuaability@gmail.com**.

## Develop

Run `npm install`, then `npm run dev`. Run `npm run build` for the production build.

## Visuals and motion

The current direction is a procedural Three.js software system, coordinated by GSAP ScrollTrigger. The brand’s code brackets unfold around connected software panels, carry data through an automation workflow, and close around a finished product. Pointer movement adds restrained depth. No background photographs are used. Previous ImageGen artwork and its prompt manifest remain in the repository for reference.

- Hero: a three-chapter scroll sequence, from ambition to connection to a completed product.
- 3D: procedural bracket geometry, labeled software panels, connected paths, and instanced data packets.
- Expertise: illustrative software, workflow, and AI demos paired with accessible accordion panels.
- Closing scene: a perspective typography reveal leading to the project enquiry.
- Text: progressive word emphasis and line entrance effects.
- Controls: clipped rolling labels, animated arrows, keyboard-accessible full-screen menu.

Native scrolling remains available for touch, keyboard, and assistive technology. `prefers-reduced-motion` removes the long sticky sequence, pointer motion, and reveals. A text-based brand mark remains visible if WebGL is unavailable. The renderer pauses offscreen and while the document is hidden, limits pixel density on mobile, and disposes GPU resources when unmounted. Hero controls that are not currently visible are removed from keyboard interaction.

## Reference study

The motion language was studied from [Jesko Jets](https://jeskojets.com/) and its public styles and animation scripts. This implementation uses original content, branding, artwork, and application code.

The reference informed the cinematic pacing, progressive text emphasis, clipped link rollovers, and responsive full-screen menu. The current implementation uses original Three.js geometry with GSAP and ScrollTrigger over native scrolling.

The browser connection was unavailable during the reference audit. The reference findings are source-verified; a full visual inspection of every live transition was not completed.
