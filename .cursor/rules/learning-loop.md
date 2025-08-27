### Learning Loop Rule

**Purpose**: Create a simple, reliable loop so the LLM reads rules and prior context before work, and writes structured learnings after work. Keep it lightweight, visual, and front‑end first.

**Workflow per task**

- **Read prompt**: Parse the user request and constraints.
- **Read rules**: Load all `.cursor/rules/*.md` (including this file).
- **Read folder READMEs**: Before editing any code in a folder, open that folder’s `README.md` (e.g., `Buildi3App/components/README.md`, `Buildi3App/components/ui/README.md`, `Buildi3App/app/(tabs)/README.md`, and per‑component READMEs) to follow structure and conventions.
- **Read context**: Load `context/index.md` then any linked files that match the task domain.
- **Execute**: Complete the task, using existing design tokens and UI components. Avoid hardcoded values.
- **Reflect and log**: Append a new entry in `context/` using the template. Update `context/index.md` taxonomy and links.

**Context write‑back requirements**

- Create a new file in `context/` named: `YYYY‑MM‑DD__task-slug.md`.
- Use `context/_template.md` headings. Keep it concise and skimmable.
- Add a cross‑link from `context/index.md` under the correct category.
- Prefer actionable guidance over narration. Reference files (paths) and decisions.

**OpenAI + Anthropic best practices to enforce**

- **Grounding**: Always ground outputs in repo files and design tokens before generating new code. Cite canonical sources by path.
- **Small steps**: Favor minimal viable edits; verify with a build/lint pass before more edits.
- **Reflection**: After completion, capture failures, deltas between plan and result, and one improvement to automate next time.
- **Retrieval first**: Search codebase semantically for existing components/utilities before implementing new ones.
- **Determinism**: Use consistent prompts and templates. Keep rules short, explicit, and colocated with examples.
- **Security & privacy**: Do not paste secrets into context. Summarize patterns, not credentials.
- **Performance**: Choose simplest approach that’s fast at runtime and easy to maintain.

**Repository structure awareness**

- Prefer existing folder patterns over inventing new ones.
- If adding a new UI component, mirror the 4‑file structure (`Component.tsx`, `styles.ts`, `types.ts`, `index.ts`) and add a per‑component `README.md`. Update barrel exports in `components/ui/index.ts` as needed.

**Design‑system constraints (project‑specific)**

- Reuse tokens from `theme/` (`colors.ts`, `spacing.ts`, etc.).
- Reuse components from `components/ui/` (Typography, Button, Widget, etc.).
- Avoid hardcoded colors, spacing, radii, and typography. Prefer tokens and props.

**Definition of done**

- Task implemented and verified (build/lint green if applicable).
- For RN tasks: Expo boots without runtime errors and screen renders as expected.
- `context/YYYY‑MM‑DD__task-slug.md` created using template.
- `context/index.md` updated with link and tags.

**Failure handling**

- If blocked, write a partial learning entry with blockers and proposed unblocks, then request clarification.

— End of rule —
