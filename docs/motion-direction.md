# ab-tech-dev — motion direction and implementation storyboard

Status: proposed creative and technical plan. No animation changes are implemented by this document.
Scope: the existing single-page website, its six sections, navigation overlay, and service selection states. Do not add routes or content solely to provide animation surfaces. Preserve the typography work and the removal of the diagonal-arrow text glyph; retain the designed SVG arrows.

## Direction: one idea becomes a working system

Use the existing brand brackets as the recurring protagonists. Panels represent work; connections represent coordination; assembly represents delivery. The same objects travel through the experience:

Ambition → clarity → capability → method → invitation → signature.

The intended result is a distinctive, carefully paced portfolio experience. An award is an aspiration, not a guaranteed outcome. Craft should be judged through continuity, originality, legibility, interaction quality, and measured performance.

## What currently interrupts the experience

- app/living-system.ts owns a scene whose progress is driven only by the hero. The visibility observer in app/experience.tsx stops its render loop after the hero leaves view.
- Following sections mostly share the same data-reveal upward fade. They lack individual spatial behavior and meaningful handoffs.
- Service selection remounts its preview through a key, restarting an entrance instead of showing a transition between related states.
- The statement has word opacity animation, the marquee has independent translation, and contact has a separate tilt. These effects do not share a visual cause.
- Existing breakpoint overrides should be consolidated during implementation so motion positioning has a single clear owner.

## Motion vocabulary

Use three depths: distant atmosphere, mid-distance brackets and panels, and a stable reading plane. Body text and controls live on the reading plane. Reserve perspective and parallax for decoration and product framing.

- Interaction feedback: 160–240 ms. Focus changes are immediate.
- UI state changes: 320–480 ms.
- Section entrances: 650–900 ms, with 50–80 ms offsets between groups.
- Large object handoffs: approximately 0.5–0.8 viewport of scroll.
- Scroll-driven transforms map to position with modest catch-up, initially 0.35–0.55 seconds. Tune on real devices.
- Initial depth budgets: atmosphere 12–24 px, decorative panels 24–48 px, principal object at most 64 px of screen-space parallax; readable copy remains stationary relative to its section.
- Fine-pointer object rotation: at most 3 degrees. No camera roll, compulsory cursor replacement, or movement of a link's hit area.
- Reverse scrolling reconstructs the same geometry. It does not trigger a separate exit animation.
- At most one dominant moving composition in a viewport. Quiet intervals let the previous transformation register.

All figures are starting values for rehearsal, not verified performance or final timing.

## Section 1 — Hero: ambition takes shape

Purpose: establish the objects and the rules of the world.

Entrance: show the actual heading and contact link immediately. Bring the brackets into depth over 900 ms; the first heading resolves by line with 60 ms separation. No artificial loader or percentage counter.

Desktop scroll: keep the three existing acts, initially within a 280–320 svh track. Progress below describes the hero's local scroll range:

| Progress | Composition and animation                                                                                                    | Text behavior                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 0–18%    | Brackets cradle a compressed group of panels. Restrained drift and pointer response establish depth.                         | Ambition, in motion. Hold long enough to read.              |
| 18–38%   | Brackets separate; the slash recedes; panels fan into their working positions.                                               | Transition into the second act by line.                     |
| 38–62%   | Connections draw in sequence and a small number of packets travel between panels.                                            | Busywork, off your plate. Copy holds still.                 |
| 62–82%   | Panels align and consolidate into one completed surface.                                                                     | Your next advantage. Contact/expertise action stays usable. |
| 82–100%  | The camera relaxes toward a frontal view; the assembled object becomes smaller and moves toward the studio section's margin. | Release the hero into normal document flow.                 |

Handoff: the brackets remain visible across the boundary. Their lighting darkens against the light studio background. Avoid a full-screen flash or an abrupt object reset.

Mobile: replace the long pinned sequence with three naturally flowing acts, one lightweight composition alongside each. Share the same geometries but interpolate poses as the acts pass the viewport. Keep all narrative copy accessible.

## Section 2 — Studio: possibility becomes clarity

Purpose: create a deliberate slowdown and demonstrate order.

Entrance: the light surface moves over the outgoing dark field while the bracket pair rotates almost frontal. The object reduces into a restrained bracket motif in the margin beside the statement.

Scroll: group the statement into semantic phrases. Highlight each phrase gently as it reaches the reading region; keep inactive text readable. Avoid revealing every word from near-invisibility. The bracket aligns with the active phrase but never crosses the letterforms.

Parallax: a shallow background plane moves at roughly half the displacement of the decorative bracket. Supporting paragraphs stay fixed in their own flow. Animate the lower partnership copy once, as a single group.

Handoff: the right bracket turns edge-on into a narrow vertical accent at the next section's edge. The assembled panel begins expanding toward the expertise preview area.

Mobile: use a small bracket accent above or beside the heading. Disable pointer response and moving text-adjacent geometry; use a brief phrase emphasis or static heading according to available space.

## Section 3 — Expertise: one system, three capabilities

Purpose: make the offering tangible through a coherent product demonstration.

Entrance: the carried panel aligns with the service preview's rectangle. Its 3D silhouette hands off to the actual HTML preview once their bounds match. The left and right brackets settle as outer framing elements. This is an alignment and crossfade, not an unreadable texture pretending to be an interactive app.

Desktop scroll: use a sticky preview only while the service area is in view and only where its height fits below the header. The copy and accordion remain in normal flow. Let a short approach-to-camera movement establish the preview, then stop so it can be inspected.

Service selection is controlled by click or keyboard, never overridden by scroll:

- Software: the workspace layers settle into one surface; the chart draws once and the existing task indicator resolves.
- Automation: preserve the outer frame and chrome; reorganize the interior into the workflow. Illuminate the existing nodes in order over about 1 second, with one subdued pulse while visible.
- Applied AI: keep the same frame; crossfade into the question, then reveal the answer as a complete readable block. Source chips resolve together. Avoid simulated typing delays.

Transition contract: old content fades and moves backward by about 12 px, new content resolves in 350–450 ms. Rapid selection cancels the old transition and resolves directly toward the most recent selection. Only the active preview contributes meaningful accessible content. Focus stays on the chosen service trigger.

Parallax: frame tilt at most 2–3 degrees on fine-pointer devices. Stop tilt on keyboard interaction. No tilting of body text.

Marquee: retain it as a brief horizontal release between chapters. Tie its movement to this section's exit. Use no diagonal-arrow text separators and no independent perpetual loop. Its movement ends before the approach reading area dominates the viewport.

Handoff: the connection line leaves the preview edge and aligns with the vertical process rail in Approach. It does not cross the service descriptions.

Mobile: preview stays in flow; preserve direct service selection and readable HTML. Use opacity-only transitions with a stable outer frame. Skip pinning, geometric handoffs, and tilt.

## Section 4 — Approach: the system is built with intention

Purpose: turn the service promise into a visible method.

Entrance: the connecting line from Expertise becomes a narrow rail next to the three process numbers. The studio's light surface returns, linking this reading chapter visually to the earlier statement.

Desktop scroll: retain a sticky lead when it fits. The right-hand process articles enter normally. Activate each stage when its heading crosses approximately 55% of the viewport. Fill only the corresponding rail segment as that article is read.

- Discover: the same five panels separate into a tidy exploded arrangement. One plane is singled out to suggest a clear decision.
- Build: those panels align and join; shallow depth expresses assembly.
- Evolve: the assembled object opens slightly, leaving visible space for the next module.

Place the miniature 3D composition in reserved space below the lead copy, not behind the process paragraphs. Reveal subtitles and descriptions together, with a small 16–24 px translation at most. The active step gets a restrained color change, not a scaling card.

Handoff: the open brackets expand toward the next section's heading area. The connection rail ends with a settled point, preventing the sense of an unfinished loading indicator.

Mobile: numbered articles and a short local line-draw. No sticky lead or continuous 3D scene. Show small static poses only if they fit without increasing reading distance unnecessarily.

## Section 5 — Contact: the system makes room for your idea

Purpose: provide the emotional payoff and a calm, obvious action.

Entrance: the lime contact surface rises into view. As the palette changes, the brackets change from lime to dark green and separate around the heading's available space. They frame the invitation without enclosing or occluding the CTA.

Scroll: Something and great starts here resolve by line, with a maximum 6-degree initial tilt returning to zero. Once the heading reaches its reading position, all headline motion ends. No continuous rotation while a visitor decides to contact the studio.

Parallax: a single distant panel drifts about 20 px behind the margin area and comes to rest. Keep the existing email visible with no entrance delay.

Interaction: a restrained fill transition and designed SVG-arrow motion acknowledge hover and focus. Preserve the normal mailto behavior and do not delay navigation for an exit effect.

Handoff: the brackets reduce toward the footer's brand position. The slash returns, completing the same brand arrangement introduced in the hero.

Mobile: two short line fades, then static contact content. Decorative geometry remains outside the text and touch targets.

## Section 6 — Footer: signature and closure

Purpose: make the experience feel complete.

Entrance: bring the assembled 3D brand silhouette into alignment with the footer wordmark, then crossfade into the sharp HTML signature. The footer emerges through normal scrolling; avoid a fixed reveal that can clip content at zoom.

Rest: no constant spinning. A tiny fine-pointer highlight is optional only if performance and contrast remain strong.

Back to top: use native smooth anchor behavior. Reconcile the scene with the actual scroll position, including rapid travel; do not replay the initial entrance or force the visitor through the story again.

Mobile: static signature and normal footer links.

## Navigation and page-level states

There is one route today. Design chapter transitions rather than inventing page transitions for nonexistent pages.

- Initial load: content first; the scene arrives progressively. Do not hide the entire document while assets load.
- Open menu: a dark sheet expands over 350–450 ms. Links resolve by line with 50 ms offsets. Pause pointer-driven scene movement beneath the overlay. Preserve the existing dialog's focus trap, Escape handling, background inertness, and scroll locking.
- Close menu: reverse the sheet. Restore focus to the trigger unless a navigation action has a more appropriate destination.
- Anchor selection: close the overlay, move to the real section position, and update the active section label. Heading focus for keyboard navigation must not cause a second unexpected scroll.
- Direct hash, reload, browser back: derive the scene immediately from the destination. No dependence on having watched the hero first.
- Tab hidden: pause rendering. Resume at current scroll state without replaying entrances.
- External/mail links: respond immediately; no cinematic departure delay.
- Future genuine routes: if later requested, reuse a 250–350 ms bracket transition after route readiness, with correct history and focus restoration. Out of scope for the current implementation.

## Scene architecture

Reuse GSAP, ScrollTrigger, and Three.js already present. Introduce no extra animation framework or smooth-scroll dependency by default.

1. Move scene ownership from the hero to the page shell. Use one renderer and shared geometries/materials for desktop.
2. Define named chapter poses: hero-closed, hero-connected, hero-complete, studio, expertise, discover, build, evolve, contact, footer. Each pose defines camera, object transforms, visibility, lighting, and screen-space destination.
3. Map each section's measured bounds to local progress. Interpolate across explicit handoff windows rather than spreading one brittle percentage across the entire document.
4. Use reserved visual zones and layer masks so geometry can cross boundaries without passing over reading areas. Keep the canvas non-interactive and decorative.
5. Implement HTML-to-WebGL registration through measured preview/wordmark bounds. Crossfade only after positions align. Never duplicate meaningful accessible text between canvas and DOM.
6. Give the scene controller ownership of WebGL transforms; give chapter timelines ownership of DOM transforms. Separate wrapper elements where both affect the same composition.
7. Recompute section anchors after fonts settle, viewport changes, and accordion height changes. Batch refresh work; do not create ResizeObserver/ScrollTrigger feedback loops.
8. Scope all selectors and clean up observers, timelines, rendering, geometries, and listeners on unmount or breakpoint changes.
9. Replace the broad data-reveal behavior with named chapter sequences. Consolidate motion CSS rather than stacking another layer of conflicting overrides.

Likely files: app/experience.tsx for composition and controls; app/living-system.ts for shared geometry and pose interpolation; a new app/motion-story.ts for chapter definitions and progress mapping; app/motion.css for motion-specific layouts; app/globals.css only for shared tokens.

## Mobile, accessibility, and performance contract

- Choose compact behavior by available width, height, and input capability. Desktop browser zoom must be able to reach the compact layout.
- Reduced motion: show every section's content in normal flow, remove pinning and parallax, keep static chapter poses or a CSS brand fallback, and make menu/service changes immediate or use a short fade. Do not omit later hero copy simply because its animation is disabled.
- Keep body text at full readable contrast. Decorative motion cannot be needed to discover content or operate controls.
- Page and services remain useful before JavaScript, with WebGL unavailable, or after context loss.
- Initial targets: stable 60 fps on the chosen desktop reference device and at least 30 fps on the chosen midrange mobile device. Measure before claiming results.
- Cap pixel ratio initially around the existing 1.6 desktop / 1.25 compact settings; reduce scene complexity if frame time suffers. Pause when no visual zone is visible.
- Prefer shared meshes and instancing; avoid full-screen blur, heavy postprocessing, continuously changing text textures, and multiple WebGL contexts.
- Keep structural layout stable. Animate transform and opacity where possible; never recalculate scene bounds every frame.
- At most two extended sticky stories: hero and expertise. Expertise loses stickiness if the preview does not fit. Approach uses only a fitting sticky lead, not another scroll-capture sequence.

## Delivery sequence

1. Foundation: consolidate layout rules, introduce chapter state and shared scene ownership, preserve static content and navigation.
2. Prove continuity: implement Hero → Studio → Expertise with the same bracket objects and one registered panel handoff. This is the first design checkpoint.
3. Complete the story: service state transitions, process rail and poses, contact assembly, footer signature.
4. Interaction pass: menu, focus, rapid service switching, direct anchors, reverse scrolling, and resize behavior.
5. Compact and reduced-motion pass: distinct composition, normal content flow, and fallback coverage.
6. Rehearsal and tuning: review real viewport behavior and measured frame time, remove competing motion, then validate the production build before publishing through the existing approval path.

## Acceptance checks for the implementation

- Following the brackets from hero to footer feels continuous; no scene reset or unexplained disappearance at boundaries.
- Each chapter has a clear entrance, readable hold, and intentional exit.
- Fast scroll, reverse scroll, menu navigation, and direct hashes all produce the correct scene without empty gaps or stale text.
- Repeated service selection does not flash, remount unnecessarily, steal focus, or let scrolling overwrite the chosen service.
- No clipped headings, overlapping hit targets, or horizontal overflow at narrow widths, short landscape heights, and 200% text enlargement.
- Reduced motion includes all substantive copy; WebGL failure leaves a complete website.
- No reintroduced diagonal-arrow text glyphs. Existing SVG arrow icons remain.
- Device measurements and browser checks are reported as actual results, not assumptions. Obtain an explicit browser-testing request before using browser inspection tools under this environment's Sites guidance.
