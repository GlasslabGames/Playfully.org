angular.module('reports.const', [])

.constant('REPORT_CONSTANTS', {
 legend: {
  // Achievements
  'achievement-blue': 'gl-reports-achievement-blue-square',
  'achievement-light-blue': 'gl-reports-achievement-light-blue-square',
  'achievement-green': 'gl-reports-achievement-green-square',
  'achievement-light-green': 'gl-reports-achievement-light-green-square',
  'achievement-red': 'gl-reports-achievement-red-square',
  'achievement-light-red': 'gl-reports-achievement-light-red-square',
  'achievement-yellow': 'gl-reports-achievement-yellow-square',
  'achievement-light-yellow': 'gl-reports-achievement-light-yellow-square',
  'achievement-magenta': 'gl-reports-achievement-magenta-square',
  'achievement-light-magenta': 'gl-reports-achievement-light-magenta-square',
  'achievement-brown': 'gl-reports-achievement-brown-square',
  'achievement-light-brown': 'gl-reports-achievement-light-brown-square',
  // Competency
  "mastered": {class:'gl-reports-competency-circle-green',text: 'Mastered'},
  "approaching-mastery": {class:'gl-reports-competency-circle-yellow',text: 'Approaching Mastery'},
  "not-mastered": {class:'gl-reports-competency-circle-red',text: 'Not Mastered'},
  "not-enough-data": {class:'gl-reports-competency-circle-gray',text: 'Not Enough Data'},
  "not-covered": {class:'gl-reports-competency-circle-white',text: 'Not Covered'},
  // Shoutout Watchout
  'so':'gl-reports-so-icon',
  'wo':'gl-reports-wo-icon',
  // Standards,
  "Full": {class:"gl-standards-rating--achieved", text: 'achieved', title: "Standard complete"},
  "Partial": {class:"gl-standards-rating--tracking", text: 'tracking', title: "Tracking toward standard completion"},
  "Not-Started": {class:"gl-standards-rating--notstarted", text: "notstarted", title: "Not started"},
  "In-Progress": {class:"gl-standards-rating--nodata", text: 'nodata', title: "In progress"},
  "Watchout": {class: "gl-standards-rating--watchout", title: "Needs support", text: "watchout"}
 },
 "standardsLegendOrder": ['Not-Started', 'In-Progress', 'Partial', 'Full', 'Watchout'],
 // Order of reports dropdown and default report
 orderOfReports: {
  'sowo': 1,
  'mission-progress': 2,
  'achievements': 3,
  'competency': 4
 }
});
