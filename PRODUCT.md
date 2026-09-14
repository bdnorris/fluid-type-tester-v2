# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Designers and frontend developers, equally. They open a no-account browser sitting to try font pairings, a heading scale, and fluid CSS together — then leave with type that they can see across viewports.

## Product Purpose

Fluid Type Tester is a small personal lab for fluid type: set minimum, viewport-relative, and maximum sizes, watch real prose respond, and take the resulting `clamp()` CSS. It exists to combine basic font and size testing with fluid type techniques. Success is a sitting that makes clamp type inspectable and copyable, not a launched category product.

## Positioning

A small personal tester, not a competitor to neighboring type-scale or fluid-typography editors. Do not claim a unique market position those tools could not copy. The durable mechanism is live clamp testing of type (min / fluid / max) in the browser.

## Operating Context

Used in a desktop or resized browser window: sliders and font picks on one side, a live text sample in the middle, generated CSS on demand. Neighboring public tools are acknowledged in-product as further reading (Material type scale, type-scale.com, Modular Scale, Adrian Bece’s fluid editor, CSS-Tricks and Smashing Magazine clamp articles). Google Fonts is the default catalog; custom family names are allowed when a font is not listed.

## Capabilities and Constraints

Durable core: a clamp-based type tester (min / fluid vw / max) so type can be previewed as the viewport changes.

Current implementation is in flux and is not a locked feature list. As of this record it includes: header and body min/fluid/max and line-height; Google Fonts (popularity-sorted, first 100) plus custom font name fields; up to six heading levels with a modular ratio; sample literature plus an edit-content toggle; a Show CSS overlay of generated `clamp()` rules; related-tools notes. Future work may change or drop any of those without changing the clamp-tester purpose.

Technical facts of the current app: Vue 3, TypeScript, Vite, Vuex. Google Fonts Webfonts API requires `VITE_GF_API_KEY`. Formula in use is `clamp(min px, calc(1rem + N vw), max px)`. Light and dark follow `prefers-color-scheme`. No accounts or persisted user data.

Undecided: public launch claims, a deploy URL as product proof, and which of the current controls remain.

## Brand Commitments

Name in the document title: Fluid Type Tester. In-product voice is first-person and practical (“Inspired by some other online tools…”). Keep neighboring tools credited rather than framed as rivals.

## Evidence on Hand

Sample passages in `texts.json` (public-domain literature: Alice in Wonderland, Pride and Prejudice, A Christmas Carol, Moby Dick, Middlemarch, Crime and Punishment, Huckleberry Finn). No testimonials, case studies, press, pricing, or licensing assets. Do not invent customers, benchmarks, or a public launch story.

## Product Principles

- The clamp tester is the product; the current control set is disposable.
- One no-account sitting should cover pairing, scale, and fluid CSS together.
- Stay a small personal lab; do not inflate positioning against neighboring tools.
- Preview on real prose is how type decisions get judged; generated CSS is the takeaway when that path exists.
- Credit related tools and techniques instead of competing with them.
