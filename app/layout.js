import './styles.css';

export const metadata = {
  title: 'InterviewMate AI · Mock Interview Practice',
  description: 'Practise role-specific interview questions and get rubric-based feedback.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
