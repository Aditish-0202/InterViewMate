export const roles = [
  { id: 'frontend', label: 'Frontend Developer Intern', icon: 'code' },
  { id: 'data', label: 'Data Analyst Intern', icon: 'chart' },
  { id: 'teacher', label: 'PGT Teacher', icon: 'book' },
];

export const subjects = [
  { id: 'physics', label: 'Physics' },
  { id: 'mathematics', label: 'Mathematics' },
];

export const questions = [
  {
    id: 'frontend-accessibility',
    role: 'frontend',
    text: 'Tell me how you improved the accessibility of a web interface. How did you verify the change?',
    criteria: [
      'Identifies a specific accessibility barrier and who it affected.',
      'Describes a suitable fix, such as restoring a visible keyboard focus indicator.',
      'Explains a relevant verification step, such as testing the full interaction using Tab and the keyboard.',
    ],
  },
  {
    id: 'frontend-api',
    role: 'frontend',
    text: 'A React page fetches a list of products. How would you handle loading, empty results, and failed requests?',
    criteria: [
      'Explains when to show loading feedback.',
      'Distinguishes a successful empty response from an error.',
      'Describes recoverable error handling, such as a clear retry action.',
    ],
  },
  {
    id: 'data-cleaning',
    role: 'data',
    text: 'Tell me how you cleaned a dataset before analysing it. How did you check that your cleaning decisions made sense?',
    criteria: [
      'Identifies actual data quality issues such as missing values or duplicates.',
      'Explains how the treatment was chosen for the data and analysis goal.',
      'Describes a verification step such as comparing row counts or distributions and documenting changes.',
    ],
  },
  {
    id: 'data-comparison',
    role: 'data',
    text: 'A report shows sales fell last month. How would you check whether it reflects a real decline?',
    criteria: [
      'Checks data completeness and comparable date ranges and metric definitions.',
      'Explains a useful breakdown or comparison, such as seasonality or product segments.',
      'Distinguishes observed evidence from a causal conclusion.',
    ],
  },
  {
    id: 'physics-current',
    role: 'teacher',
    subject: 'physics',
    text: 'A student says current gets used up as it passes through a resistor. How would you correct the misconception and check whether the class understood?',
    criteria: [
      'Explains that steady current is the same at every point of a simple series circuit.',
      'Distinguishes charge flow from energy transfer across the resistor.',
      'Proposes a practical understanding check, such as having students predict and compare ammeter readings before and after the resistor.',
    ],
  },
  {
    id: 'physics-fall',
    role: 'teacher',
    subject: 'physics',
    text: 'A student predicts that a heavier ball always falls faster. How would you test that idea in class?',
    criteria: [
      'Explains that gravitational acceleration is the same when air resistance is negligible.',
      'Proposes a fair comparison with controlled drop height and similar shapes.',
      'Asks students to predict and explain what changes when air resistance is significant.',
    ],
  },
  {
    id: 'math-domain',
    role: 'teacher',
    subject: 'mathematics',
    text: 'How would you explain the domain of a function to a Class 11 student, and check that they understood?',
    criteria: [
      'Defines the domain as the set of allowed inputs.',
      'Uses an example with a clear restriction, such as excluding 2 from the real domain of 1/(x − 2).',
      'Uses a new example or asks students to justify whether a specific input is allowed.',
    ],
  },
  {
    id: 'math-mean',
    role: 'teacher',
    subject: 'mathematics',
    text: 'How would you show students when the median describes a dataset better than the mean?',
    criteria: [
      'Explains how an extreme value affects the mean more than the median.',
      'Uses a small, correct numerical example.',
      'Checks whether students can choose and justify a measure in another context.',
    ],
  },
];
