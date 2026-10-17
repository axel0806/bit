# CLAUDE.md

@AGENTS.md

## Claude Code notes

The shared project instructions are in `AGENTS.md` (imported above). Everything
below is specific to Claude Code.

- This is a tiny static site, so read `index.html`, `style.css` and `script.js`
  in full before making changes. They are small enough to fit comfortably in context.
- Make edits with targeted replacements rather than rewriting whole files, to keep
  diffs small and reviewable.
- When a change touches an id, class or anchor, search all three files
  (`grep -n "name" index.html style.css script.js`) and update every reference.
- For visual changes, serve the site (`python3 -m http.server 8000`) and describe
  what you expect to see; ask the user to confirm in the browser if you can't check yourself.
- Ask before: adding dependencies or tooling, changing the Formspree endpoint,
  editing contact details or legal wording, or renaming section anchors.
- Write user-facing copy in Swedish. Reply to the user in whatever language they use.
