# Reshmi — Portfolio

A playful, interactive portfolio for a fresher frontend developer, built with Next.js (App Router), React, TypeScript and three.js.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production build (static)
npm start        # serve the production build
```

## Make it yours

All text, links and images live in [`src/data/site.ts`](src/data/site.ts): name, role, city, company, email, LinkedIn, CV link, about copy, projects, skills and certifications. **The certifications listed are examples — replace them with real ones.** The images are placeholders from picsum.photos. Drop real ones into `public/assets/img/` and point the paths at them (e.g. `/assets/img/me.jpg`).

## Structure

- `src/app/layout.tsx`: fonts (via `next/font`) and page metadata
- `src/app/page.tsx`: the home page (hero, projects, about, skills, certifications)
- `src/app/skills/page.tsx`: a standalone Skills & Certifications page (same sections, shared via `SkillsSections.tsx`)
- Navbar and footer live in `layout.tsx`, so they're shared by both pages
- `src/app/globals.css`: all styles
- `src/components/`: one file per section and effect. The 3D pot and dragon load client-side only.

Deploys to Vercel as-is: import the repo and you're done.

## What's in it

- **Hero**: a dot grid that bends away from the cursor, a Figma-style name frame you can drag and resize, stickers you can move, floating chips that dodge the mouse, a hanging 3D flower pot, a roaming 3D dragon, and eyes peeking over the name that follow your cursor.
- **Navbar**: a dark pill with a neon edge that follows the cursor, and it highlights the section you're viewing.
- **Projects**: a deck of cards you can swipe or drag.
- **About**: a Figma-frame bio, tilted sticky notes and principle cards.
- **Skills page**: a scrolling skills ticker, colour-coded skill cards and tilted certificate cards.
- **Footer**: eyes that follow the cursor, plus click-to-copy email.

All motion respects `prefers-reduced-motion`.

## Credits

The dragon is "Dragon Evolved" by [Quaternius](https://quaternius.com), released under CC0 (public domain).
