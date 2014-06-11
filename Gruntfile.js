module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['.tmp', 'dist'],
      build: ['.tmp', 'build']
    },

    copy: {
      build: {
        expand: true,
        cwd: 'src',
        src: './**',
        dest: 'build/'
      },
      compile: {
        expand: true,
        src: 'src/**.html',
        dest: 'dist/',
        flatten: true,
        filter: 'isFile'
      }
    },

    uglify: {
      options: {
        banner: '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' + ' */\n\n'
      }
    },

    useminPrepare: {
      html: 'src/index.html',
      options: {
        dest: 'dist'
      }
    },

    usemin: {
      html: ['dist/{,*/}*.html'],
      options: {
        dirs: ['dist']
      }
    },

    /**
     * Lint task
     * Enforces JavaScript coding standards.
     */
    jshint: {
        options: { jshintrc: '.jshintrc' },
        files: [ '/src/**/*.js', '*.js' ]
    },

    watch: {
      files: ['<%= jshint.files %>'], 
      tasks: ['jshint']
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

  grunt.registerTask('build',
    ['jshint', 'clean:build', 'copy:build']);

  grunt.registerTask('compile',
    ['clean:dist', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'copy:compile', 'usemin']);

};
