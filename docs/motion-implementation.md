# Motion implementation notes

The continuous scene and section choreography are implemented locally.

- One shared Three.js renderer carries the existing brackets and panels through measured section destinations.
- Named poses cover the hero acts, studio, expertise, three process stages, contact, and footer.
- Scroll position determines the scene directly; chapter interpolation has no dependence on prior playback.
- The service frame persists across selections, with inactive panels hidden from interaction and assistive technology. Detail animations begin when the preview enters view.
- The hero, statement, services, process rail, contact lines, footer, and menu have distinct sequences.
- Compact screens use normal-flow hero acts. Reduced motion preserves every substantive section and shows static brand marks.
- The removed diagonal text glyph remains absent; designed SVG arrows remain.

Validation completed: TypeScript check, lint on the four changed application TypeScript files, five motion-state tests, whitespace check, and a successful local HTTP response. The final production build passed, including the contact-layer adjustment.

Browser visual inspection, interaction testing, and device frame-rate measurements have not been performed. Pixel-perfect handoff alignment and performance targets from the storyboard should be assessed through that review before making claims about them. The closing 3D signature currently occupies its own reserved footer area; it does not yet crossfade into the individual letters of the footer wordmark.

Publication remains separate from this local implementation. No source upload or deployment was performed in this pass.
