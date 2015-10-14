module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        src: ['src/jstiny.js', 'src/**/*.js'],
        test: 'test/**/*.js',
        minified: 'dist/jstiny.min.js',
        concatenated: 'dist/jstiny.js',
        clean: {
            dist: 'dist'
        },
        concat: {
            dist: {
                src: '<%= src %>',
                dest: '<%= concatenated %>',
            }
        },
        jshint: {
            options: {
                eqnull: true
            },
            src: ['Gruntfile.js', '<%= src %>', '<%= test %>'],
            dist: {
                src: ['<%= minified %>', '<%= concatenated %>']
            }
        },
        jasmine: {
            src: '<%= src %>',
            options: {
                specs: '<%= test %>',
                keepRunner: true
            },
            minified: {
                src: '<%= minified %>'
            },
            concatenated: {
                src: '<%= concatenated %>'
            }
        },
        uglify: {
            options: {
                compress: true,
                mangle: true,
                sourceMap: true
            },
            dist: {
                src: '<%= src %>',
                dest: 'dist/jstiny.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.registerTask('default', ['jshint:src', 'jasmine:src', 'concat', 'uglify']);
    grunt.registerTask('verify', [/*'jshint:dist', */'jasmine:minified', 'jasmine:concatenated']);
};