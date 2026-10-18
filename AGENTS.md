# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

Single-page marketing website for **Balder IT Konsult UF**, a Swedish student-run
company (UF-företag) in Skellefteå offering web development, IT support and
digitalisation consulting. Live at https://bitk-kappa.vercel.app (hosted on Vercel).

It is a plain static site: **no framework, no bundler, no package manager, no build step.**
Keep it that way unless the maintainer explicitly asks otherwise.

## Repository layout

```
index.html   # All page markup (one page, anchor-based sections)
style.css    # All styling (design tokens as CSS custom properties)
script.js    # Small vanilla JS: mobile nav toggle, header behaviour, contact form handling
README.md
```

## Running locally

No install needed. Either open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

There are no tests, linters or formatters configured. Verify changes manually in a
browser (see "Before you finish").

## Deployment

Pushing to `main` deploys via Vercel. Treat `main` as production: don't commit
half-finished work to it.

## Working principles

Behavioral guidelines to reduce common LLM coding mistakes. They apply to every
task in this repo, alongside the project-specific rules below.

**Tradeoff:** these bias toward caution over speed. For trivial tasks (a typo, a
colour tweak), use judgment.

### 1. Think before coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them. Don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity first

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.
On this site that usually means plain HTML, CSS and a few lines of vanilla JS.

### 3. Surgical changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it. Don't delete it.

When your changes create orphans:
- Remove imports, variables, functions and CSS rules that *your* changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Goal-driven execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals. This repo has no automated tests, so the
checks are manual ones in the browser (see "Before you finish"):
- "Fix the menu bug" → "Reproduce it at a specific viewport width, then confirm it's gone"
- "Add a section" → "Nav link scrolls to it, layout holds at 375px, 768px and 1280px"
- "Restyle X" → "Confirm nothing else on the page shifts"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work")
require constant clarification.

**These guidelines are working if:** there are fewer unnecessary changes in diffs,
fewer rewrites due to overcomplication, and clarifying questions come before
implementation rather than after mistakes.

## Conventions

### Language and content
- The site is in **Swedish** (`<html lang="sv">`). All user-facing copy must be Swedish.
  Code comments and commit messages may be in English.
- Section anchors use Swedish ids: `#om-oss`, `#tjanster`, `#process`, `#kontakt`, plus `#top`.
  Don't rename them without updating nav links, CSS and JS together.
- Don't change factual claims, contact details, prices or legal wording (team size,
  founding year, email, phone, Instagram handle, the footer note that this is
  "ej ett registrerat aktiebolag") unless the user explicitly provides the new values.

### HTML
- Semantic elements (`header`, `nav`, `main`, `section`, `footer`); one `h1` only.
- Keep accessibility attributes: `aria-label` and `aria-expanded` on the nav toggle,
  `label` elements tied to form inputs via `for`/`id`, `rel="noopener"` on external
  `target="_blank"` links.
- Icons are inline SVG using `currentColor` or the brand colours; don't add an icon library.

### CSS
- Colours, fonts and spacing live in CSS custom properties in `style.css`. Reuse the
  existing variables (e.g. `--off-white`) instead of hard-coding new values.
- Brand palette: sun gold `#E4B75C`, light blue `#86B4D6`, deep navy `#0B1220`.
- Fonts: Space Grotesk (headings) and Inter (body), loaded from Google Fonts in `index.html`.
- Mobile-first and responsive; check the layout at roughly 375px, 768px and 1280px.
- Prefer editing `style.css` over adding inline styles (a few exist; don't add more).

### JavaScript
- Vanilla ES6+ only. No libraries, no transpilation, no `npm install`.
- `script.js` relies on these element ids in `index.html`: `site-header`, `navToggle`,
  `navLinks`, `contactForm`, `formMsg`. Keep them in sync if you rename anything.
- The hero sunburst animates via the `.ray` and `.sun-core` classes (staggered
  `animation-delay` set inline on each `<line>`).

### Contact form
- `#contactForm` posts to a **Formspree** endpoint (`https://formspree.io/f/...`).
  Don't change or remove the endpoint, and don't add other third-party form or
  tracking services.
- Field names are Swedish (`namn`, `epost`, `meddelande`); keep them stable so
  existing Formspree submissions and email templates keep working.

## Boundaries

- Don't add dependencies, build tooling, or a framework without asking first.
- Don't add analytics, cookies or trackers (the site collects personal data through
  the contact form, so GDPR matters).
- Never commit secrets or API keys. There shouldn't be any in this repo.

## Before you finish

1. Open the page and check there are no console errors.
2. Check the nav links scroll to the right sections, on desktop and mobile widths.
3. Check the mobile menu opens and closes.
4. If you touched the form, confirm validation still works (all fields are `required`)
   and the success/error message area (`#formMsg`) still displays. Don't submit real
   test data to the live Formspree endpoint more than necessary.
5. Check any new Swedish copy for spelling (å, ä, ö) and consistent tone: friendly,
   plain language, no jargon.
