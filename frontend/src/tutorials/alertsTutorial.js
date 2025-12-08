export default [
  {
    id: 'alerts-intro',
    title: 'Mission Control',
    message: 'This deck aggregates system warnings. It is your "Check Engine" light for biological health.',
    highlightSelector: null
  },
  {
    id: 'feed',
    title: 'Live Feed',
    message: 'Incoming alerts appear here. <strong>Critical</strong> alerts (Red) require immediate attention or acknowledgement.',
    highlightSelector: '[data-tour="alert-feed"]',
    anchor: 'right'
  },
  {
    id: 'ack',
    title: 'Acknowledge',
    message: 'Swipe or click "Acknowledge" to confirm you have seen an alert. This stops the notification pulse but keeps the record.',
    highlightSelector: '[data-tour="alert-item"]', // Dynamic targeting handled by generic selector
    anchor: 'bottom'
  },
  {
    id: 'resolve',
    title: 'Resolution',
    message: 'Once you have taken action (e.g., taken a missed dose), mark the alert as <strong>Resolved</strong> to clear it from the active board.',
    highlightSelector: null
  }
];