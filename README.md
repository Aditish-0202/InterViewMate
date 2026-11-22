# InterviewMate AI

A Next.js mock interview prototype for SCSE4041 Prompt Engineering. Choose a role and, for PGT Teacher, a subject. Answer a curated question to get rubric-based coaching and an AI follow-up.

## Run locally

1. Install Node.js 22 or later and run `npm ci`.
2. Copy `.env.example` to `.env.local`. Set `GEMINI_API_KEY` to a key from [Google AI Studio](https://aistudio.google.com/apikey). The optional `GEMINI_MODEL` defaults to `gemini-3.1-flash-lite`.
3. Run `npm run dev` and open [localhost:3000](http://localhost:3000).

Keep the key server-side. Use practice answers without personal or confidential information. Google's [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) lists the model's free tier and data-use terms.

## Deploy and get the Q11 link

1. Push this source to a Git repository you control. Exclude `.env.local`.
2. In a Vercel account with access to that repository, import it as a new **Next.js** project. Use the repository root as the app directory.
3. Under **Settings → Environment Variables**, set `GEMINI_API_KEY` for **Production**. Optionally set `GEMINI_MODEL`. Deploy after saving the variables.
4. Open the generated production URL in a private window. Use **PGT Teacher → Physics**, submit an answer to the resistor question, and confirm that feedback appears. If deployment protection prompts for a login, make the production URL publicly accessible. Submit that production URL as the Q11 link.

## Viva and testing

- [Evaluation prompt](lib/evaluation-prompt.js) defines full and partial credit, separates trusted instructions from the answer, and requires placeholders for missing facts.
- [Question bank](lib/questions.js) contains the eight questions and their specific skill criteria.
- [Server evaluation](lib/feedback.js) calls the [Gemini GenerateContent API](https://ai.google.dev/api/generate-content), validates schema fields and score bounds, and computes the total in code.
- Run `npm test` for labelled provider fixtures and `npm run build` for the production build. Fixtures exercise validation and error handling. To check live model behaviour, submit an answer with a configured API key.
