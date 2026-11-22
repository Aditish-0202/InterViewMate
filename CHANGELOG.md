# Changelog — InterviewMate AI

## 22 November 2026 — Milestone 2 preparation
- Built and pushed a Next.js mock interview app, with three roles, Physics/Mathematics teacher tracks and eight curated questions (initial application commit `69912744`).
- Introduced a server-side Gemini evaluation route, four-criterion 10-point rubric, validated structured feedback, answer validation and provider-error handling.
- Documented v1 baseline, v2 weighted rubric, v3 JSON constraints, and v4 deployed prompt, including recorded observed results and weaknesses.
- Recorded 12 test cases (6 passing / 6 failing under the stated criteria), including edge cases, error responses and known limitations.
- Added a public prototype link, documentation and submission evidence files for SCSE4041 Milestone 2.

## Milestone 1 → 2 changes
The earlier manual HTML prompt/JSON copy-and-paste concept was replaced by a web interface with role-specific questions and a **Get feedback** button. Gemini is called by the server; the user's browser never receives the API key. The question bank and rubric make evaluation reproducible at the level of scoring rules, though model outputs vary.

## Planned improvements (not claimed as implemented)
- Improve rewrite fidelity for non-answers and verify scientific correctness in coaching.
- Investigate occasional provider HTTP 502 responses and retest Hinglish.
- Expand the question bank and compare model marks with human ratings.
