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
  'CCSS Math 2.G.A.2': 'gl-reports-achievement-light-blue-square',
  'CCSS Math 2.G.A.3': 'gl-reports-achievement-blue-square',
  'Symbolic notation': 'gl-reports-achievement-magenta-square',
  'CCSS Math 3.NF.A.1': 'gl-reports-achievement-green-square',
  'CCSS Math 3.NF.A.3a': 'gl-reports-achievement-yellow-square',
  'CCSS Math 3.NF.A.3b': 'gl-reports-achievement-light-yellow-square',
  'CCSS Math 3.NF.A.3d': 'gl-reports-achievement-light-brown-square',
  'CCSS Math 4.NF.B.3a': 'gl-reports-achievement-red-square',
  'CCSS Math 2.OA.A.1': 'gl-reports-achievement-light-blue-square',
  'CCSS Math 4.OA.C.5': 'gl-reports-achievement-magenta-square',
  'CCSS Math 5.OA.B.3': 'gl-reports-achievement-green-square',
  'CCSS Math 6.NS.C.5': 'gl-reports-achievement-yellow-square',
  'CCSS Math 6.NS.C.6': 'gl-reports-achievement-red-square',
  'CCSS Math 2.NBT.A.2': 'gl-reports-achievement-brown-square',
  'CCSS Math 2.OA.A.2': 'gl-reports-achievement-blue-square',
  'CCSS Math 2.OA.B.2': 'gl-reports-achievement-light-magenta-square',
  'CCSS Math 3.OA.A.1': 'gl-reports-achievement-light-green-square',
  'CCSS Math 3.OA.A.4': 'gl-reports-achievement-light-yellow-square',
  'CCSS Math 3.OA.D.9': 'gl-reports-achievement-light-red-square',
  'CCSS Math 3.NBT.A.2': 'gl-reports-achievement-light-brown-square',
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