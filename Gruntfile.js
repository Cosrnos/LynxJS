module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dist: ['dist/']
		},

		concat: {
			dist: {
				src: ['src/**/*.js', '!src/public/**/*'],
				dest: 'dist/js/<%= pkg.name %>.js'.toLowerCase()
			},
			vendor: {
				src: ['vendor/**/*.js'],
				dest: 'dist/js/<%= pkg.name %>.vendor.js'.toLowerCase()
			}
		},

		connect: {
			server: {
				options: {
					port: 8840,
					hostname: '*',
					base: 'dist/'
				}
			}
		},

		copy: {
			dist: {
				cwd: 'src/public/',
				src: ['**/*'],
				dest: 'dist/',
				expand: true
			}
		},

		uglify: {
			dist: {
				options: {
					banner: '/*! <%= pkg.name %> v<%= pkg.version %> built <%= grunt.template.today("dd-mm-yyyy") %> */\n'
				},
				files: {
					'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			},
			vendor: {
				options: {
					banner: '/*! <%= pkg.name %> v<%= pkg.version %> vendor files built <%= grunt.template.today("dd-mm-yyyy") %> */\n'
				},
				files: {
					'dist/js/<%= pkg.name %>.vendor.min.js': ['<%= concat.vendor.dest %>']
				}
			}
		},

		watch: {
			files: ['src/**/*'],
			tasks: ['clean', 'concat', 'uglify', 'copy'],
			options: {
				livereload: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['clean', 'concat', 'uglify', 'copy']);
	grunt.registerTask('serve', ['connect', 'watch']);

	grunt.registerTask('default', ['build', 'serve']);
};