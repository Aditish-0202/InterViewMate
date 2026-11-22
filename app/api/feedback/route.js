import { evaluateAnswer } from '../../../lib/feedback.js';

export async function POST(request) {
  return evaluateAnswer(request, { env: process.env });
}
