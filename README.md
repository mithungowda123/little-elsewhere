# Little Elsewhere

A small escape. A new possibility.

A warm, mobile-friendly static website with three short experiences: **Your Next Chapter**, **The Door You Choose**, and **Memory Meadow**.

Website address: https://mithungowda123.github.io/little-elsewhere/

## Run locally

No dependencies, build step, database, sign-up, or paid API are required. From this directory, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C. The JavaScript modules require HTTP hosting; opening `index.html` directly as a file will not run the experiences.

## Hosting and updates

This repository is prepared for GitHub Pages using **Deploy from a branch**, branch **main**, folder **/(root)**. The `.nojekyll` file disables Jekyll processing. Commit website changes to `main` to trigger a fresh deployment. Check **Actions** for deployment results and **Settings > Pages** for the published URL.

All asset paths and JavaScript imports are relative. Experience navigation uses URL fragments such as `#chapter`, so the `/little-elsewhere/` project path needs no server rewrites.

The repository contains only static source and documentation. Visitors' nicknames and answers are never committed to this repository or sent to an application server.

Official Pages documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Experiences and content

- **Your Next Chapter:** optional nickname and four questions; four possible chapters with a mission and reflection; Back navigation; downloadable SVG keepsake; native sharing or clipboard fallback where supported.
- **The Door You Choose:** three settings, two decisions per visit, twelve paths and six main endings. The first decision changes the middle scene and a closing detail; the final decision determines the main ending. Replay any door.
- **Memory Meadow:** twelve shuffled cards, six pairs, move counter, mismatch delay, completion message, and restart. No timer or competitive score.

Edit `core.mjs` to change questions, readings, story scenes, endings, or memory symbols. Edit `art.js` for the SVG illustrations and `styles.css` for the design. Interface behavior is in `app.js`; the homepage is in `index.html`.

Chapter outcomes are selected from written content using the visitor’s answers. There is no AI model or factual prediction of the future. The nickname personalizes the result but does not determine it.

## Privacy and accessibility

Nicknames and answers live only in page memory and are cleared on refresh. There is no local storage, cookies, analytics, third-party font request, or application backend. A visitor can explicitly download or share a result; its nickname is included only in the downloaded card, not the share text. A host may keep ordinary request logs. Keep the on-page privacy explanation aligned if integrations are added later.

The website includes semantic controls, keyboard focus indicators, a skip link, labeled inputs, descriptive card labels, a screen-reader status region, a dismissible native privacy dialog, reduced-motion support, and responsive layouts. Original illustrations are decorative or described as appropriate. Memory symbols use the device’s emoji font and may differ visually between platforms.

## Verification performed

- JavaScript syntax checks.
- Every one of the 256 quiz combinations yields a complete result.
- All twelve story paths are playable and lead to the six intended main endings.
- Matching rules reject duplicate taps, lock mismatches, and complete correctly.
- Chrome browser interaction checks cover quiz Back navigation, result rendering, SVG download, every story path, memory completion and replay, and privacy dismissal.
- Desktop and phone layouts checked at 1440px, 390px, and 320px viewport widths with no horizontal overflow.
- No browser exceptions, failed website requests, third-party page requests, or persistent storage writes were observed.

Browser verification used local headless Chrome, not physical phones or Safari. See the repository Actions tab for the latest GitHub Pages deployment status.
