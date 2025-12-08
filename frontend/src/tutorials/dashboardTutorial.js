export default [
  {
    id: 'intro',
    title: 'Welcome to Command',
    message: 'This Dashboard is your central hub. It aggregates all bio-telemetry to give you a single "Go/No-Go" status for the day.',
    highlightSelector: null, // Centered
  },
  {
    id: 'stability',
    title: 'Neural Stability',
    message: '<strong>Stability</strong> measures the consistency of your routine. Higher stability means fewer anomalies and stronger mental resilience.',
    highlightSelector: '[data-tour="stability-gauge"]',
    anchor: 'right'
  },
  {
    id: 'readiness',
    title: 'Mission Readiness',
    message: '<strong>Readiness</strong> is your daily capacity score. It predicts how much energy you have for tasks today based on recent sleep and log data.',
    highlightSelector: '[data-tour="readiness-bar"]',
    anchor: 'bottom'
  },
  {
    id: 'timeline',
    title: 'Event Timeline',
    message: 'Every dose, symptom, and alert is recorded here securely. Use this to track patterns over time.',
    highlightSelector: '[data-tour="timeline"]',
    anchor: 'left'
  },
  {
    id: 'action',
    title: 'Take Action',
    message: 'Ready to log data? Use the Quick Actions or navigate via the bottom deck to access specific modules.',
    highlightSelector: '[data-tour="nav-deck"]',
    anchor: 'top'
  }
];