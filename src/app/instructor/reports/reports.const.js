angular.module('reports.const', [])

.constant('REPORT_CONSTANTS', {
 legend: {
  // Achievements
  'CCSS.ELA-Literacy.WHST.6-8.1a': 'gl-reports-achievement-blue-square',
  'CCSS.ELA-Literacy.WHST.6-8.1b': 'gl-reports-achievement-green-square',
  'Problem Solving': 'gl-reports-achievement-red-square',
  'Citizenship': 'gl-reports-achievement-yellow-square',
  'CCSS.ELA-Literacy.RI.6-8': 'gl-reports-achievement-light-blue-square',
  // Competency
  'mastered': 'gl-reports-competency-circle-green',
  'not-mastered': 'gl-reports-competency-circle-red',
  'not-enough-info': 'gl-reports-competency-circle-yellow',
  'not-covered': 'gl-reports-competency-circle-gray'
 }

});