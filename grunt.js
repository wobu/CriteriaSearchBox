/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		lint: {
			files: ['grunt.js', '<config:concat.dist.dest>', 'test/**/*.js']
		},
		qunit: {
			files: ['test/**/*.html']
		},
		concat: {
			dist: {
				src: [
			'<banner:meta.banner>',
			'src/jquery.plugin.intro.js',
			'src/core.js',
			'src/jquery.plugin.outro.js'
		],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		min: {
			dist: {
				src: [
			'<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint qunit'
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				$: true,
				jQuery: true,
				console: true
			}
		},
		uglify: {}
	});

	// Default task.
	grunt.registerTask('default', 'qunit concat min lint');

	grunt.registerTask('heroku', 'concat min');
};
