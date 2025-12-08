export default [
  {
    id: 'profile-intro',
    title: 'Ranger Profile',
    message: 'Manage your identity, view service records, and configure your digital avatar from this hub.',
    highlightSelector: null
  },
  {
    id: 'stats',
    title: 'Service Record',
    message: 'Track your streaks and level. Consistency unlocks higher tiers of clearance and visual upgrades.',
    highlightSelector: '[data-tour="profile-stats"]',
    anchor: 'bottom'
  },
  {
    id: 'morphin',
    title: 'The Morphin Grid',
    message: 'Access the <strong>Avatar Builder</strong> here. Customize your suit color, emblem, and aura signature.',
    highlightSelector: '[data-tour="enter-morphin"]',
    anchor: 'top'
  }
];