RULE 1: Backend must never generate UI widgets.
RULE 2: Backend must never infer layout.
RULE 3: UI exists only in schema JSON.
RULE 4: Collections = data only.

➡️ Mark as DEPRECATED – DO NOT USE

Your publish pipeline should be pass-through:

draftSchema → AppVersion.schema → Flutter

❌ Never do

Backend creates widgets

Backend maps collections → UI

Backend injects layout

Hardcoded business widgets

✅ Always do

Builder creates schema

Schema defines UI

Backend stores + serves

Flutter renders blindly

What I can do next (pick one):

🔒 Add automated tests to detect backend UI injection

🧩 Convert presets → schema fragments cleanly

🧱 Finalize schema v1 contract (backend + Flutter)

🎨 Improve builder UX without breaking no-code