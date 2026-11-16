# ClaimLens — Vienna design application

Applied 2026-11-15. Reference: user-owned Figma Slides “창업경진대회”, file PavjXlhiW0iE2By0nb9tLF; cover 1:2798, statistics 1:4309 / 1:4380, web direction 1:4817. Reference screenshots: artifacts/figma-reference/.

## Shared system
- Cream #FFFCF4, near-black #11120F, olive #6C7C59; darker olive #49573B for readable small text/actions.
- Jost display/numerals, Sorts Mill Goudy editorial English, Noto Sans KR Korean fallback.
- 24px decorative grid, square geometry, 1px rules, limited color-blocking, large regular-weight type.
- Tokens and surface rules: src/app/vienna.css, activated by data-design="vienna" in the root layout. Existing layout/breakpoint and motion logic remain reusable.
- Surfaces: landing, calculator, process preview, workspace sidebar/table/statistics, intake form, detail panels, customer capture, image dialog, motion controls.
- Only the editorial hero photograph is grayscale. Uploaded evidence is never visually filtered.
- MRC chart: 100 decorative tiles, exactly 61 filled; textual statistic, source and denominator caveats remain visible. No new factual claims introduced.
- Existing GSAP reveal/parallax, navigation transitions, keyboard focus restoration and reduced-motion support retained.

## Validation
- npm run typecheck and npm run build passed.
- tests/browser.py passed: intake, outgoing upload, customer submission, comparison dialog, persisted completion, workspace isolation and responsive layouts 390/768/1280/1440.
- tests/landing-scroll.py passed: seven sections, parallax, pause, reduced-motion, mobile, route cleanup.
- tests/interaction-details.py passed: navigation transitions, filter marker, dialog exit/focus, clipboard and busy states.
- Visual review: landing desktop/mobile, workspace desktop and customer capture mobile. Screenshots under artifacts/.

## Motion refinement — 2026-11-15
- CSS hover fill / arrow shift / press feedback, interruptible selection marker and short filter replacement.
- Data-ready route snapshots and shared product image/title identities between list and detail; stable workspace navigation.
- Photo zoom uses measured source geometry and WAAPI, reverse close, focus restore, reduced-motion cancellation.
- GSAP 61-tile reveal and continuous 240ms calculator updates; quieter 40px hero grid and smaller serif decoration.
- Verified build, interaction-details, landing-scroll, landing-evidence and motion-continuity tests. Shared transitions reached ready with no duplicate-name rejection; mobile detail fits 390px.
