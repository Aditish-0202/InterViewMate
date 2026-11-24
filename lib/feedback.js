import { evaluationPrompt } from './evaluation-prompt.js';
import { questions } from './questions.js';
import { answerLimit, rubric } from './rubric.js';

const defaultModel = 'gemini-3.1-flash-lite';
// Allow queued model requests to finish, including receipt of the response body.
const feedbackTimeoutMs = 75_000;
const criteria = Object.entries(rubric);
const feedbackLimits = { strength: 500, improvement: 500, rewrite: 1500, followUp: 500 };

function objectSchema(properties) {
  return { type: 'object', properties, required: Object.keys(properties) };
}

const responseSchema = objectSchema({
  scores: objectSchema(Object.fromEntries(criteria.map(([key, { max }]) => [
    key, objectSchema({ score: { type: 'integer', minimum: 0, maximum: max }, reason: { type: 'string' } }),
  ]))),
  ...Object.fromEntries(Object.keys(feedbackLimits).map(key => [key, { type: 'string' }])),
});

function isText(value, limit) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= limit;
}

function parseFeedback(envelope) {
  const candidate = envelope?.candidates?.[0];
  if (candidate?.finishReason !== 'STOP' || !Array.isArray(candidate.content?.parts)) {
    throw new Error('Missing or incomplete candidate');
  }
  const json = candidate.content.parts.filter(part => !part?.thought).map(part => part?.text ?? '').join('');
  const output = JSON.parse(json);
  const scores = {};
  let total = 0;
  for (const [key, { max }] of criteria) {
    const entry = output?.scores?.[key];
    if (!Number.isInteger(entry?.score) || entry.score < 0 || entry.score > max || !isText(entry.reason, 400)) {
      throw new Error('Invalid criterion score');
    }
    scores[key] = { score: entry.score, reason: entry.reason.trim() };
    total += entry.score;
  }
  const feedback = { scores, total };
  for (const [key, limit] of Object.entries(feedbackLimits)) {
    if (!isText(output[key], limit)) throw new Error('Invalid feedback field');
    feedback[key] = output[key].trim();
  }
  return feedback;
}

function error(message, status) {
  return Response.json({ error: message }, { status });
}

export async function evaluateAnswer(request, { env, fetchModel = fetch }) {
  let input;
  try {
    const body = await request.text();
    if (body.length > answerLimit * 6 + 256) return error('The submission is too long.', 413);
    input = JSON.parse(body);
  } catch {
    return error('The submission could not be read. Please try again.', 400);
  }

  const question = questions.find(entry => entry.id === input?.questionId);
  if (!question) return error('Choose a valid interview question and try again.', 400);

  const answer = typeof input.answer === 'string' ? input.answer.trim() : '';
  if (!answer) return error('Write an answer before getting feedback.', 400);
  if (input.answer.length > answerLimit) return error('Keep your answer within 3,000 characters.', 400);

  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return error('AI feedback is unavailable until the site owner configures the Gemini API key.', 503);
  }
  const model = env.GEMINI_MODEL?.trim() || defaultModel;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9.-]*$/.test(model)) {
    return error('The configured Gemini model ID is invalid. Contact the site owner.', 503);
  }

  const startedAt = performance.now();
  try {
    const deadline = AbortSignal.timeout(feedbackTimeoutMs);
    const models = [model, model === defaultModel ? 'gemini-3.5-flash' : model];
    for (const [index, currentModel] of models.entries()) {
      const signal = index === 0 ? AbortSignal.any([deadline, AbortSignal.timeout(35_000)]) : deadline;
      try {
        const response = await fetchModel(
          `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            signal,
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: evaluationPrompt + '\n\nTrusted question and criteria:\n' + JSON.stringify(question) }] },
              contents: [{ role: 'user', parts: [{ text: JSON.stringify({ candidateAnswer: answer }) }] }],
              generationConfig: { responseMimeType: 'application/json', responseJsonSchema: responseSchema, maxOutputTokens: 2500 },
            }),
          },
        );
        if (index === 0 && [502, 503, 504].includes(response.status)) {
          await response.body?.cancel();
          continue;
        }
        if (response.status === 429) return error('Gemini’s rate limit was reached. Wait a moment and try again.', 429);
        if ([400, 401, 403, 404].includes(response.status)) {
          return error('Gemini rejected the request. The site owner can check the API key and model configuration.', 502);
        }
        if (!response.ok) return error('Gemini is temporarily unavailable. Try again in a moment.', 502);
        const feedback = parseFeedback(await response.json());
        const duration = Math.round(performance.now() - startedAt);
        return Response.json(feedback, {
          headers: { 'Server-Timing': `gemini;dur=${duration};desc="${currentModel}, attempt ${index + 1}"` },
        });
      } catch (failure) {
        if (index === 0 && signal.aborted && !deadline.aborted) continue;
        throw failure;
      }
    }
  } catch (failure) {
    if (failure?.name === 'TimeoutError') return error('Gemini took too long to respond. Please try again.', 504);
    if (failure instanceof TypeError) return error('Could not reach Gemini. Please try again.', 502);
    return error('Gemini returned incomplete or invalid feedback. Please try again.', 502);
  }
}
