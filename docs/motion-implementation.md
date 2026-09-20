# Motion implementation and visual review

The site now follows one connected studio journey while preserving the three-stage hero.

- One shared Three.js scene moves through the hero, studio, expertise, process, contact, and footer.
- The three hero messages now share one pinned viewport on desktop and mobile. Scroll advances Imagine, Connect, and Create in place, then releases the page after the final state.
- A fixed grain-and-veil stage, global chapter readout, and continuous page meter make those section changes read as one timeline rather than separate effects.
- A restrained three-layer star field, diagonal Milky Way haze, mineral cyan/violet nebulae, Matrix glyph rain, scanlines, a moving signal beam, and edge telemetry add a cosmic hacker-film atmosphere without changing the forest-and-lime identity.
- The shared scene now adds orbit rings, a glowing core, and instanced spatial nodes. Each chapter controls their density, depth, pulse, and rotation.
- Studio copy converges through a radial field; expertise arrives through a moving grid and perspective workbench; process cards enter from alternating depth; contact typography converges around a portal; the footer resolves into the compact brand signature.
- The post-hero pages use a consistent dark forest world, a self-hosted Manrope editorial system, shared rules, and one lime accent.
- The expertise section includes three real demonstrations: a configurable software brief, a simulated automation handoff with human approval, and a source-labelled AI answer.
- Compact screens keep each composition inside its reserved artwork area. Adjacent visible areas render together through the shared canvas, with scissor bounds keeping artwork away from reading content.
- Menu navigation transfers focus into the destination section after closing.
- Reduced motion removes the animated canvas, preserves all three hero messages, disables decorative transitions, and shows static brand marks.
- The literal diagonal-arrow emoji remains absent; the interface uses designed SVG arrows.

Visual review on 14 September 2026 used the live local site in the in-app browser. The 1440 x 900 review covered the preserved hero, studio statement, expertise workbench, process engine, contact gateway, footer signature, and the transitions between them. The 390 x 844 review covered the hero composition and expertise controls. Reduced-motion emulation showed the static process composition and content hierarchy correctly. Browser warning/error logs were empty. The contact entrance was tightened after review so direct navigation no longer leaves its headline clipped off-screen.

Validation: seven motion-state tests passed, TypeScript passed, scoped application lint passed, whitespace checks passed, and the production build completed. The build retains a large-chunk warning from the current Three.js/client bundle. No physical-device frame-rate measurements were made.

No source upload or deployment was performed in this pass.
