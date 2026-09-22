# Fluid Type Tester

A small in-browser lab for fluid type. Set a **minimum**, a **viewport-relative middle**, and a **maximum** for headings and body, watch real prose respond as the preview width changes, then copy the generated `clamp()` CSS.

It is meant for one sitting: pair fonts, try a heading scale, and leave with CSS you can paste into a project. There are no accounts and nothing is saved.

## What it does

The tester applies this pattern to heading and body sizes:

```css
font-size: clamp(min px, calc(1rem + N vw), max px);
```

`clamp()` keeps type from shrinking below the minimum or growing past the maximum. Between those bounds, size tracks the width of the page (or, in the live preview, the width of the sample frame).

In a typical sitting you can:

1. Tune heading and body **min / fluid / max** and line-height.
2. Pick typefaces from Google Fonts (or type a custom family name).
3. Add heading levels **h2–h6** with a modular ratio.
4. Preview on public-domain literature, or edit the sample text.
5. Resize the preview (drag, keyboard, or width presets) and read the computed heading and body sizes.
6. **Copy CSS** or **View CSS** to take the rules with you.

Light and dark UI follow `prefers-color-scheme`.

## Requirements

- **Node.js 22** (or another current LTS that Vite 8 supports). This repo has been built with Node 22.

## Run it locally

```bash
git clone git@github.com:bdnorris/fluid-type-tester-v2.git
cd fluid-type-tester-v2
yarn
yarn dev
```

### Scripts

| Command | What it does |
| --- | --- |
| `yarn dev` | Start the Vite dev server with hot reload. |
| `yarn build` | Type-check with `vue-tsc`, then emit a production bundle to `dist/`. |
| `yarn preview` | Serve the production build locally (run `yarn build` first). |

### Optional: full Google Fonts catalog

Without extra setup, **Typefaces** uses a built-in list of common families (Roboto, Open Sans, Merriweather, and so on). Custom names still work: type a family that is installed locally or available on Google Fonts, and the stylesheet is loaded from `fonts.googleapis.com`.

To load the popularity-sorted Google Fonts catalog (first 100 families) instead:

1. Enable the [Web Fonts Developer API](https://developers.google.com/fonts/docs/developer_api) in a Google Cloud project and create an API key.
2. Put the key in a `.env` file at the project root (this file is gitignored):

   ```bash
   VITE_GF_API_KEY=your_key_here
   ```

3. Restart `yarn dev`. Vite only exposes variables prefixed with `VITE_`.

If the key is missing, the built-in list is used. If the request fails, the same fallback list is used and you can retry from the controls.

## Using the tester

**Heading and body.** Each has Minimum (px), Fluid (vw in the copied CSS), Maximum (px), and line-height. Minimum cannot exceed maximum; if you push one past the other, the other bound moves with it.

**Preview width.** The sample sits in a resizable frame. Use **Fit**, the width presets (320, 375, 768, 1024, 1440), or the handle on the right of the frame. Arrow keys nudge the handle (Shift for larger steps). A readout shows the current frame width and the computed heading and body pixel sizes.

The **live preview** sizes type with container query units (`cqw`) so it tracks the sample frame, not the whole browser window. The **copied CSS** uses `vw`, which is what you want on a real page.

**Typefaces.** Open the Typefaces disclosure. Filter the list, pick heading and body families, or enter a custom family. System fonts (Georgia, Times New Roman, and similar) are not loaded from Google Fonts.

**Scale.** Add heading levels up to h6. Each extra level is the previous size divided by the heading ratio (default 1.2). Extra headings in the sample are clipped from the current literature.

**Sample text.** Choose a passage from `texts.json` (Alice in Wonderland, Pride and Prejudice, A Christmas Carol, Moby Dick, Middlemarch, Crime and Punishment, Huckleberry Finn). **Edit content** makes the sample editable; turning it off restores the selected passage.

**CSS.** **Copy CSS** writes the generated rules to the clipboard. **View CSS** opens a dialog with the same output. You still need to load the font files yourself (for example with a Google Fonts `<link>` or a self-hosted `@font-face`).
