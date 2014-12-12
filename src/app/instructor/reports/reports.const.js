angular.module('reports.const', [])

.constant('REPORT_CONSTANTS', {
 legend: {
  // Achievements
  'CCSS.ELA-Literacy.WHST.6-8.1a': 'gl-reports-achievement-blue-square',
  'CCSS.ELA-Literacy.WHST.6-8.1b': 'gl-reports-achievement-green-square',
  'Problem Solving': 'gl-reports-achievement-red-square',
  'Citizenship': 'gl-reports-achievement-yellow-square',
  'CCSS.ELA-Literacy.RI.6-8': 'gl-reports-achievement-light-blue-square',
  'CCSS Math 6.NS.6b': 'gl-reports-achievement-light-blue-square',
  'CCSS Math 6.NS.6c': 'gl-reports-achievement-green-square',
  'CCSS Math 6.NS.8': 'gl-reports-achievement-yellow-square',
  // Competency
  "mastered": {class:'gl-reports-competency-circle-green',text: 'Mastered'},
  "not-mastered": {class:'gl-reports-competency-circle-red',text: 'Not Mastered'},
  "not-enough-info": {class:'gl-reports-competency-circle-gray',text: 'Not Enough Info'},
  "not-covered": {class:'gl-reports-competency-circle-white',text: 'Not Covered'},
  // Shoutout Watchout
  'so':'gl-reports-so-icon',
  'wo':'gl-reports-wo-icon'
 },
 // Order of reports dropdown and default report
 orderOfReports: {
  'sowo': 1,
  'mission-progress': 2,
  'achievements': 3,
  'competency': 4
 }


});