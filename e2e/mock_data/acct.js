// Holds all autotest login and account info

module.exports = {
	
	user: {
		teacher: "build+teach@glasslabgames.org",
		student: "gl-test01",
	},
	classCode: {
		localhost: 'PQ7N2',
		stage: 'RJXYL'
	},
	classes: {
		localhost: [	// FIXME - this assumes this class comes first, doesn't check others
			'AA-1',
			'SCE'
		],
		stage: [
			'AA-1',
			'SCE'
		]
	},
	pass: {
		teacher: "glasslab123",
		student: "glasslab321"
	}
	
}
