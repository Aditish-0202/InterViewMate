'use client';

import { useRef, useState } from 'react';
import { questions, roles, subjects } from '../lib/questions.js';
import { answerLimit, rubric } from '../lib/rubric.js';

const icons = {
  chat: 'M20 11.5a8 8 0 0 1-8 8H5l1.9-3A8 8 0 1 1 20 11.5ZM9 11h6M9 14h4',
  code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-2-13-4 16',
  chart: 'M4 5v14h16M8 15v-3m5 3V8m5 7v-5',
  book: 'M12 6v14M12 6C9 4 6 4 3 5v13c3-1 6-1 9 2 3-3 6-3 9-2V5c-3-1-6-1-9 1Z',
};

function Icon({ name }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><path d={icons[name]} /></svg>;
}

export default function Interview() {
  const [role, setRole] = useState('frontend');
  const [subject, setSubject] = useState('physics');
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const answerField = useRef(null);
  const feedbackHeading = useRef(null);
  const bank = questions.filter(question => question.role === role && (role !== 'teacher' || question.subject === subject));
  const question = bank[index];

  function resetQuestion(nextIndex) {
    setIndex(nextIndex);
    setAnswer('');
    setFeedback(null);
    setError('');
  }

  async function getFeedback(event) {
    event.preventDefault();
    if (loading) return;
    if (!answer.trim()) {
      setError('Write an answer before getting feedback.');
      answerField.current?.focus();
      return;
    }

    setError('');
    setFeedback(null);
    setLoading(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, answer }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Could not get feedback. Try again.');
        return;
      }
      setFeedback(result);
      requestAnimationFrame(() => feedbackHeading.current?.focus());
    } catch {
      setError('Could not get feedback. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand"><span className="brand-icon"><Icon name="chat" /></span>InterviewMate <span className="brand-ai">AI</span></div>
          <span className="course">SCSE4041</span>
        </div>
      </header>
      <main className="workspace">
        <div className="intro">
          <h1>Mock interview practice</h1>
          <p>Choose a role, answer a question, and get feedback on what to improve.</p>
        </div>
        <div className="practice-grid">
          <aside className="panel role-panel">
            <fieldset disabled={loading}>
              <legend>Practice role</legend>
              <div className="role-list">
                {roles.map(option => (
                  <label className="role-option" key={option.id}>
                    <input type="radio" name="role" value={option.id} checked={role === option.id} onChange={() => { setRole(option.id); resetQuestion(0); }} />
                    <span className="role-icon"><Icon name={option.icon} /></span>
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {role === 'teacher' && (
                <label className="subject">Subject
                  <select value={subject} onChange={event => { setSubject(event.target.value); resetQuestion(0); }}>
                    {subjects.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>
              )}
            </fieldset>
          </aside>
          <section className="panel interview-panel" aria-labelledby="question">
            <div className="question-block">
              <div className="question-meta">Question {index + 1} of {bank.length}</div>
              <h2 id="question">{question.text}</h2>
            </div>
            <form onSubmit={getFeedback} aria-busy={loading}>
              <div className="answer-heading"><label htmlFor="answer">Your answer</label><span id="answer-count">{answer.length.toLocaleString('en-IN')} / 3,000</span></div>
              <textarea ref={answerField} id="answer" value={answer} maxLength={answerLimit} disabled={loading} aria-describedby="answer-count" placeholder="Write your answer as you would say it in an interview…" onChange={event => { setAnswer(event.target.value); setFeedback(null); setError(''); }} />
              {error && <p className="error" role="alert">{error}</p>}
              <div className="actions">
                <button className="primary" type="submit" disabled={loading}>{loading ? 'Getting feedback…' : 'Get feedback'}</button>
                <button className="secondary" type="button" disabled={loading} onClick={() => { resetQuestion((index + 1) % bank.length); answerField.current?.focus(); }}>Next question</button>
              </div>
              <span className="sr-only" role="status">{loading ? 'Evaluating your answer.' : ''}</span>
            </form>
          </section>
          {feedback && (
            <section className="panel feedback-panel" aria-labelledby="feedback-title">
              <div className="feedback-heading">
                <h2 id="feedback-title" tabIndex={-1} ref={feedbackHeading}>Your feedback</h2>
                <span className="score"><strong>{feedback.total}</strong> / 10</span>
              </div>
              <dl className="score-grid">
                {Object.entries(rubric).map(([key, { label, max }]) => (
                  <div className="criterion" key={key}>
                    <dt>{label}<strong>{feedback.scores[key].score}/{max}</strong></dt>
                    <dd>{feedback.scores[key].reason}</dd>
                  </div>
                ))}
              </dl>
              <div className="coach-notes">
                <div><h3>One strength</h3><p>{feedback.strength}</p></div>
                <div><h3>One improvement</h3><p>{feedback.improvement}</p></div>
                <div><h3>Suggested rewrite</h3><p>{feedback.rewrite}</p></div>
                <div className="follow-up"><h3>AI follow-up</h3><p>{feedback.followUp}</p></div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
