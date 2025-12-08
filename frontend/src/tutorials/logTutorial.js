export default [
  {
    id: 'log-intro',
    title: 'Bio-Diagnostics',
    message: 'Log physiological anomalies (symptoms) here. The AI analyzes these inputs to predict stability risks.',
    highlightSelector: null
  },
  {
    id: 'severity',
    title: 'Intensity Scanner',
    message: 'Rate the symptom severity. <br/><strong>Green (1-4):</strong> Negligible.<br/><strong>Yellow (5-7):</strong> Moderate interference.<br/><strong>Red (8+):</strong> Critical impairment.',
    highlightSelector: '[data-tour="log-severity"]',
    anchor: 'bottom'
  },
  {
    id: 'tags',
    title: 'Classification',
    message: 'Tagging symptoms helps the system identify clusters (e.g., "Nausea" + "Dizziness" often precedes a migraine).',
    highlightSelector: '[data-tour="log-tags"]',
    anchor: 'top'
  },
  {
    id: 'diagnostics',
    title: 'AI Analysis',
    message: 'The Diagnostics Panel visualizes your recent trends. It will highlight correlations between missed doses and symptom spikes.',
    highlightSelector: '[data-tour="log-diagnostics"]',
    anchor: 'left'
  }
];