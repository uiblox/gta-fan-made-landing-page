# Grand Theft Developer: a GTA VI-style developer portfolio

A developer portfolio built on the layout and motion of the GTA VI website (https://www.rockstargames.com/VI). Fan-made, not affiliated with Rockstar Games.

- **Layout and motion** match the live site exactly: layout, type scale, colours, timing and easing.
- **Content and artwork** are ours: the text in `CONTENT.md`, and the illustrations, logo and videos in `src/assets/`.

## Inputs

1. The user's prompts.
2. This file, and `CONTENT.md` for every word on the page.
3. `src/assets/` (artwork, logo, fonts, `hosted-media.json`) and the screen recordings in `src/references/`.
4. The live site: the source for layout, sizes, timing and motion only.

There is no earlier code, notes or known values. Never assume a value from memory or from how similar sites usually work; find it on the live site.

## Stack

React + Vite, Tailwind CSS, GSAP (ScrollTrigger), Lenis for smooth scrolling. Plain JavaScript, no TypeScript.

## Method: Record → Measure → Extract → Rebuild → Diff

1. **Record:** `src/references/` holds one screen recording per section of the live site. They are the reference for motion and never ship.
2. **Measure:** with playwright-core and headless Chrome, dump computed styles and bounding boxes from the live site, sampling every 50px of scroll at 375, 768, 1024, 1440, 1920 and 2560px wide, plus phone landscape.
3. **Extract:** read the live site's front-end code for exact triggers, durations, eases and values. Prefer these to values fitted from recordings.
4. **Rebuild:** build from the numbers.
5. **Diff:** run the same measurement on localhost and compare.

Rules:

- Measure before building. When something looks off, measure both sites; never adjust by eye.
- Before trusting live-site numbers, check that headless Chrome received the same page a real browser does (compare with the recordings).
- When a value breaks the pattern found so far, measure it at every width instead of forcing it into the pattern.

## Definition of done

A section is done only when:

- its diff is within 1px / 1% at every width above. Mobile is part of the section, never a follow-up;
- its motion matches its recording, checked frame by frame;
- its handoffs work: what happens to the previous section as it arrives, pins, navbar changes, and the cursor glow (a soft light behind the page that follows the pointer: match its size, colour, blur, layering, and when it fades or returns);
- its text fits its artwork;
- `prefers-reduced-motion: reduce` gives a readable, static version, and everything clickable works by keyboard with a visible focus outline;
- nothing earlier broke: re-run earlier sections' checks after changing shared code.

Report what was checked and what still doesn't match.

## Tools

- Measuring and diff scripts live in `tools/` and stay reusable: they take a URL, a viewport width and selectors.
- Measurement output and temporary files go in `.measure/`, which is git-ignored.

## Assets

```
src/assets/
  brand/              the logo poster (VI + wordmark) and the loader logo
  fonts/              Outfit and Barlow Condensed (free, Google Fonts)
  site/               every image the page loads, already cut to size
    hero/             collage pieces + logo layers, desktop + mobile
    meet-the-developer/  services/  highlights/  clients/  blog/  footer/
  source/             the original artwork, grouped by shape, and the hero piece outlines
  hosted-media.json   Cloudinary links to the two scroll-scrubbed videos
```

- Use `site/` as delivered and never edit it by hand. If a slot needs a different crop, re-cut it from `source/` with a script in `tools/`.
- On the first pass through the assets, record which file belongs to which section under Findings, and keep that map current.

## Artwork

Our own artwork only. Never download, hotlink or trace Rockstar's images, video, logos or fonts.

- Measure each artwork slot on the live site (box size, aspect ratio, crop, focal point) at every width and fit our art to it. Never upscale past the original size. When square art fills a wide or tall slot, place it whole and fill the rest with a blurred extension, so text baked into the art stays readable.
- Check every crop at desktop and phone widths: the subject stays in view and clear of the text over it. Put a card's text on the side where the art leaves room.
- **Hero:** match the live site's layer count, canvas size and positions so the intro lines up; measure them first. The poster shown after the intro must match the intro's last frame pixel for pixel, or the logo flickers at the swap. All logo layers come from the same source, so they stack exactly.
- If no asset fits a slot, use a plain placeholder of the right size and list it under Open differences.

## Scroll-scrubbed videos

- Import their links from `src/assets/hosted-media.json`; never copy URLs into components.
- Build renditions with Cloudinary URL transformations: keep every frame, add a keyframe every few frames, drop the audio, and give portrait phones a 9:16 crop that follows the subject. The poster is the first frame of the same crop, so nothing jumps when the video takes over.
- Check each video's real length and frame count before mapping it to scroll, and how many pixels of scroll each frame gets. If a short clip would step, play it over part of the scroll range and hold the first and last frames either side.

## Page map

| Live section         | Our section                                                                            |
| -------------------- | -------------------------------------------------------------------------------------- |
| Loader               | Loader, with our loader logo as the shape                                              |
| Navbar               | GTD monogram, menu icon, and a "Hire Me" pill that appears as the hero scrolls away    |
| Hero (layered intro) | Our collage and logo, tagline, "Hire Me" button, tech tags, fan-made line              |
| Launch Trailer       | Meet the Developer: pinned scene, a wide featured card, and three project cards        |
| Ultimate Edition     | Services: scroll-scrubbed video backdrop and two service cards                         |
| Vice City, USA.      | Miami, USA.: bio over the scroll-scrubbed city video                                   |
| Feature cards        | Four wide cards: Open to Work, After Hours, Case Study, Off the Clock                  |
| Shop                 | Clients: two cards                                                                     |
| Featured News        | Blog: three posts                                                                      |
| Footer               | Logo, "Build Your Own" pill, socials, links, disclaimer, "Rated D for Developer" badge |

Keep our own titles whatever the live site's headings say, and don't build promo strips or banners above the page. When the live page has something this page map doesn't, ask the user before building it.

## Content

Use the content from `CONTENT.md`, next to this file: it holds every word on the page, section by section. Put it in one content file, `src/content.js`, with one object per section, and have components read from it. `CONTENT.md` is the source of truth: when it changes, update `src/content.js` to match. A viewer makes the site theirs by editing `CONTENT.md` and swapping the artwork. Several images have titles painted into them; the copy in `CONTENT.md` matches them, so if you change one, change the other.

- **Voice:** first person ("I build…"). The developer's name appears only in the page title, the meta description and the bio.
- **Samples:** the name, projects, clients, numbers and links are samples for viewers to replace. Keep every link in one `LINKS` object, all set to `#`. Never present samples as real: where artwork shows real company logos or badges, label it "Sample".
- **Disclaimer:** "Fan-made GTA VI-style portfolio. Not affiliated with Rockstar Games." appears in the hero, the footer and the meta description. Never remove it.

## Project memory

This file is the only context that carries between prompts and sessions. Keep it current so a new session can pick up exactly where the last one stopped.

- **Progress:** update it at the end of every task, before replying: done, in progress, next, and open differences from the live site. Write it for someone with no other context.
- **Findings:** add facts as they're established (asset map, how sizes scale, breakpoints, colours, fonts, code layout, non-obvious problems) with where each was measured.
- Keep both short. Delete anything proven wrong, and collapse finished work into one line.

## Git

- Commits are authored by the user. **Never add an AI co-author or attribution line** to commits or PRs.
- Commit only when asked. Never force-push.

## Progress

**Done:** scaffold; dark page, measured background, local fonts, favicon; static **navbar** and **hero** layout with scroll chevron (diffed against live, see Open differences); **loader** (`Loader.jsx`) and **hero intro** (`lib/intro.js`, driven from `Hero.jsx` and `App.jsx`). Flow: loader shows until fonts + all hero images are loaded (`preloadHero`) AND the intro is prepared (`createIntro`: layers pre-scaled, cropped, silhouettes and glows pre-rendered, canvas warmed up; a frame is a few small draws), then the intro starts behind it, the loader fades out 1.2s later (0.5s fade), the UI fades in at intro time 2.8s (0.8s). Reduced motion skips all of it (static poster, UI visible).

**In progress:** none.

**Next:** Lenis; hero scroll-away and navbar pill reveal; chevron pulse; menu panel; then the sections in the page map.

**Open differences:**
- Intro timeline is ported from the live code (exact z, delays, eases) but played at `INTRO_SPEED = 0.85` (in `lib/intro.js`, about 4.9s) so the pieces can be followed; set it to 1 for the live pace. Checked by stepping our timeline against the recording by eye (contact sheets); not diffed frame by frame. Loader fade-out length (0.5s), the 1.2s overlap and the UI fade (2.8s start, 0.8s, sine.inOut) are read off the recording, not from code. Mobile shard-to-piece mapping is a guess (reading order).
- The intro's last canvas frame differs from the `<img>` poster only by resampling (mean 8/255 on desktop edges, 17 on 375x812); gutters, pieces and logo align. We crossfade (0.25s) instead of a hard swap. On phones the poster asset is 640px against 1366px layers, so it is softer than the canvas.
- Loader logo is our wordmark at 84u wide (live: a 48u square mark); its drop-shadow and pulse/shine come from live.
- Hero: no scroll motion yet; chevron has no opacity pulse (live: 1s, 0.5 to 1, alternate); nav pill stays hidden; menu button does nothing.
- Live frame sits below a 60px promo banner; we have none, so ours is 30px higher.
- Our tagline is longer than "Now Available" (font capped with `cqw`; 600x900 frame 646px vs live 651px). Tag pills are one row; live has two stacked logos.
- Fonts: live uses proprietary ArtDeco; ours are Outfit and Barlow Condensed (button and pill widths differ). GTD monogram is a placeholder.
- Not measured on live: portrait 768px+ with aspect under 0.6.

## Findings

**Colours:** body background on rockstargames.com/VI is `rgb(12, 13, 27)` = `#0c0d1b` (measured at 1440 wide with headless Chrome, which received the real page: matches the screenshot). Live favicon is a 48×48 icon; ours is 96×96 PNG from the logo poster (`tools/make-favicon.mjs`).

**Tooling:** headless Chrome is launched with `channel: 'chrome'` (the installed Google Chrome); the playwright-managed Chromium in the cache doesn't launch.

**Asset location:** `assets/` and `references/` sit at the project root (moved back there by the user; they are NOT in `src/`). Import with root-absolute paths (`/assets/site/...`, also in CSS `url('/assets/fonts/...')`). The folder layout below still applies. All artwork is our own (AI-generated).

**Sizing system (live site, measured at 375…2560):** every size is a multiple of `--u = min(0.5vw, 12.8px) / --s`. `--s`: 1 portrait phones, 2 landscape phones (<768), 3 at 768+, 3.5 at 1024+, 4 at 1440+. The live tokens `--jhqn1xN` are k·u (x2=1u, x3=2u, … x9=8u, xa=9u, xb=10u, xd=12u, xf=14u, xh=16u, xj=20u, xl=24u, xn=28u). Side gutter `--pad`: 7.5vw (<1024; 15vw landscape phones), 10vw (1024+), 13vw (1440+), min(16vw, 409.6px) (1920+). Both live in `:root` of `src/index.css`; use `calc(var(--u) * k)`.

**Live navbar:** padding 12u (<768) / 14u (768+) / 20u (1024+); logo and menu buttons 24u circles; pill 20u tall, 7u text, 10u side padding; pill-to-menu gap 5u (<768) / 8u; menu bars 10u wide / 2u tall (<768), 14u / 3u (768+), gap = bar height. Pill is invisible at scroll 0.

**Live hero (`._191jtbm*`):** `100svh` grid, content centred; frame width = min(100%, 120svh) inside the gutter; aspect 16/9 art. Portrait with aspect 0.6 to 1: width min(80%, 60svh), art 1/1. Aspect under 0.6: art 160/177. Phones in portrait (<768): width min(100%, 40svh), tagline above the art, tags then button stacked below, gap 12u. Desktop foot: 3 equal columns (tagline left, button centre, logos right), gap 16u below the art, button 28u tall with 14u side padding and 9u text (phones: 24u tall portrait, 20u landscape, 8u text). Tagline: 11u 500 uppercase white + 8u 700 `#ccc2f5` below, glow `0 0 28px` at 25% alpha. Pink `#ffb2c6`, hero button text about `#352d50`, nav pill text `#0c0d1b`. Hero button has a colour pulse and a hover glow (`0 0 28px` + `0 0 110px` pink at 40%); only the glow is built.

**Live scroll chevron:** 34x14 svg (path in `Hero.jsx`), pink `#ffb2c6`, bottom 0 and centred; box height = 0.45 x max(5vw, 10vh), width = min(height, 33.6px); hidden on landscape phones (<768); drop-shadows `0 0 (max(5vw,10vh) x 0.025) #ffb0c480` + `0 0 (... x 0.1) #000`. Boxes match live exactly at 375, 768, 1024, 1440, 1920, 2560. Chevron is pinned to the bottom of the hero like live (a below-the-fold variant was tried and reverted at the user's request). Our fan-made line sits above it (`bottom: chevron height + 7u`), and moves to the bottom-left corner on short wide viewports (812x375).

**Intro (live code, chunk with "fob timeline"):** 12 full-canvas layers drawn on a 2D canvas (100vw x 150svh, centred on the art box). Layer z flies from -4314...-19197 to 0 (power3.inOut, 2.6s), perspective `5000/(5000+max(z,-4999))`, no x/y motion. Shards go alpha 0.5 at 0.557s, hidden under a `#0C0D1B` silhouette (`reveal` 1 to 0 from each piece's delay 0.46...1.21s, power3.inOut); VI logo alpha 1 at 1.67s (0.557s) with a `#FFACFD` glow (blur 18 to 108) from 2.04s; GTA text wipes in top-down (`mask` 0 to 1, 2.136s, power1.out, 200px soft edge, 1.486s on ultrawide >= 2.25 aspect) from 1.67s with a `#FFD398` glow; centre piece fades in at 2.41s; glows fade 3.03 to 4.14s; at 2.6s shards go to alpha 1 (1.11s, sine.inOut). Total 4.14s. Recording: intro starts about 3.45s into `01-hero-intro.mp4`, loader fades out about 4.6s to 5.0s. Same timeline for square and portrait art, with different z/delay per piece. We add a poster backdrop layer fading in with the shards so the gutters match the final poster.

**Live loader:** fixed full screen, `linear-gradient(189deg, #1f1f38 0.55%, #18182d 30.38%, #111222 65.19%, #0c0d1b)`; logo 48u square, masked, colour pulse `#1f1f38` to `#38365d` (22% to 42%, back by 92%) and a skewed `#ffb2c6`/`#988bd0` bar sweeping top-left to bottom-right (blur 5px), 2.15s loop.

**Intro performance:** headless software rendering (readback included) measured a median 15.6ms per frame at 1440x900 @2x and 9.2ms at 375x812 @3x; real GPUs are much faster. Not profiled on a real device yet.

**Tools (more):** `tools/video-sheet.mjs` (contact sheet from a recording; no ffmpeg on this machine), `tools/intro-sheet.mjs` (steps our `window.__intro` timeline, sets `__introHold`), `tools/intro-handoff.mjs` (canvas vs poster diff), `tools/alpha-bbox.mjs`. Never return a GSAP timeline from `page.evaluate` (it hangs).

**Tools:** `tools/probe.mjs` (colours, fonts, icons), `tools/measure.mjs` (DOM outline with boxes and styles), `tools/rects.mjs` (named selectors at many viewports, JSON map in; save maps in `.measure/`), `tools/css-vars.mjs` (resolves custom properties to px per viewport), `tools/css-rules.mjs` (live CSS rules with their @media chain), `tools/make-favicon.mjs`. Live selectors are hashed class names that may change.

**Asset map** (sizes measured with sips; all `site/` images are AVIF):
- `brand/logo-poster.png` (1448×1086): full logo, gradient VI + "grand theft developer". Source for hero logo layers and footer logo.
- `brand/loader-logo.svg`: loader shape (wordmark letters, one colour).
- `fonts/`: `outfit-variable.woff2`, `barlow-condensed-700/900.woff2` (OFL, latin subset).
- `hosted-media.json`: Cloudinary links. `services` = neck-rotation clip (1280×720, 24fps, trimmed to 1.42s / 34 frames of a 7.45s file) scrubbed behind Services; `city` = pull-back from developer on sportbike to street (1280×720, 24fps, 6.2s / 149 frames) scrubbed behind Miami, USA.
- `site/hero/desktop/` (2560×1440) and `site/hero/mobile/` (1366×1366, poster 640×640): `shard-01…10` (the 10 intro pieces), `poster` (post-intro collage), `logo-vi`, `logo-gta`, `poster-logo` (logo layers). Same layer count both sizes.
- `site/meet-the-developer/`: `scene` (1672×858, projects-developer-supercar, pinned scene); `featured-desktop` (1672×669, 5:2) and `featured-mobile` (628×941, 2:3), both sportbike-rider; `card-1…3` (1254×1858) = 3d-basketball-website, ai-book-assistant, react-native-language-app (projects/).
- `site/services/`: `card-tall-desktop` (1641×887) / `card-tall-mobile` (481×887) = site-glow-hotel-sign; `card-short` (1672×941) = rooftop-full-stack.
- `site/highlights/` (the four wide cards under Miami): `open-to-work` (1983×793, sunset-coast), `after-hours` (1024×410, after-hours-nightclub), `the-heist` (1983×793, vault-heist), `off-the-clock` (1774×709, alligator-float).
- `site/clients/`: `clients` (happy-clients-key-rack), `testimonial` (miami-postcard-testimonial), both 1254×1858; shows real company logos, so label "Sample".
- `site/blog/post-1…3` (~1672×941): agentic-engineering-2026, ai-agents-escaped, system-design-architecture.
- `site/footer/logo` (807×540).
- `source/`: originals for re-cutting. `posters/` 941×1672 (full-stack-developer, off-the-clock, sunset-codeposter, the-heist-case-study); `squares/` ~1254² (achievements 1199×1312, beachfront-classic-car, performance-speedboat, supercar-projects-tower, supercar-tech-stack); `scenes/` ~16:9 (after-hours-nightclub 1024×572, code-master-supercar, projects-developer-supercar, rooftop-full-stack, site-glow-hotel-sign 1774×887, sportbike-rider); `banners/` (alligator-float, sunset-coast, vault-heist); `projects/`, `clients/`, `blog/` (originals of the matching `site/` images); `hero-masks/desktop` (2560×1440) and `mobile` (1366×1366): grayscale outline of each of the 10 shards.
- Unused by any slot so far: `source/posters/*`, `source/squares/*` and `source/scenes/code-master-supercar` are the originals the hero shards were cut from (which shard uses which is not recorded; check against `hero-masks/`).
- `references/` (recordings): `01-hero-intro.mp4` loader + intro, `02-hero-scroll.mov` hero on scroll, `03-launch-trailer.mov`, `04-ultimate-edition.mov`, `05-vice-city.mov` (also the four feature cards), `06-features-to-footer.mov` (Shop, Featured News, footer).
