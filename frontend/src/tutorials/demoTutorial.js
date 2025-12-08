export default [
  {
    id: 'demo-intro',
    title: 'Simulation Mode',
    message: 'You are now in a sandbox environment. Data here is <strong>local only</strong> and does not affect your real medical profile.',
    highlightSelector: null
  },
  {
    id: 'controls',
    title: 'Time Dilation',
    message: 'Control the simulation speed. <br/><strong>1x:</strong> Real-time.<br/><strong>4x:</strong> Fast-forward to see how stability degrades over days in seconds.',
    highlightSelector: '[data-tour="demo-controls"]',
    anchor: 'bottom'
  },
  {
    id: 'scenarios',
    title: 'Risk Scenarios',
    message: 'Inject artificial chaos. "Aggressive" mode simulates high stress/low sleep conditions to test your response protocols.',
    highlightSelector: '[data-tour="demo-scenarios"]',
    anchor: 'top'
  },
  {
    id: 'finish',
    title: 'End Simulation',
    message: 'When ready, exit via the top bar to return to live operations. Good luck, Ranger.',
    highlightSelector: '[data-tour="demo-exit"]',
    anchor: 'bottom'
  }
];