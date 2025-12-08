export default [
  {
    id: 'dose-intro',
    title: 'Capsule Console',
    message: 'This terminal controls your medication intake. Logging doses accurately boosts your Stability score.',
    highlightSelector: null
  },
  {
    id: 'selector',
    title: 'Select Payload',
    message: 'Choose the medication type. <strong>Standard</strong> is for routine maintenance. <strong>Emergency</strong> unlocks only during critical stability drops.',
    highlightSelector: '[data-tour="dose-selector"]',
    anchor: 'bottom'
  },
  {
    id: 'slider',
    title: 'Dosage Intensity',
    message: 'Adjust the dosage amount if you are tapering or boosting. The system logs the exact quantity for medical review.',
    highlightSelector: '[data-tour="dose-slider"]',
    anchor: 'top'
  },
  {
    id: 'initiate',
    title: 'Initiate Protocol',
    message: 'Swipe or Click to log. If you are offline, the system will <strong>Queue</strong> the action and sync when a connection is re-established.',
    highlightSelector: '[data-tour="dose-submit"]',
    anchor: 'top'
  },
  {
    id: 'history',
    title: 'Intake Archives',
    message: 'Your full history is encrypted and stored here. Use filters to check compliance over 24h or 7-day windows.',
    highlightSelector: '[data-tour="dose-history"]',
    anchor: 'left'
  }
];