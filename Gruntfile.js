module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		bower: {
			dev: {
				dest: 'vendor'
			}
		},
		includeSource: {
			options: {
				baseUrl: '../../'
			},
			myTarget: {
				files: {
					'screens/1/index.html': 'src/screens/1.tpl.html',
					'screens/2/index.html': 'src/screens/2.tpl.html'
				}
			}
		},

		watch: {
			livereload: {
				options: {
					livereload: true
				},
				files: [
					'Gruntfile.js',
					'src/js/*.js',
					'src/html/*.html'
				]
			}
		},

		connect: {
			server: {
				options: {
					port: 8000
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-bower');
	grunt.loadNpmTasks('grunt-include-source');

	grunt.registerTask('serve', [
		'default',
		'connect:server',
		'watch'
	]);

	// Default task(s).
	grunt.registerTask('default', [
		'bower',
		'includeSource'
	]);

};