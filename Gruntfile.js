/*global require*/
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        less: {
            compile: {
                src: 'client/less/index.less',
                dest: 'client/css/index.css'
            }
        },
        watch: {
            less: {
                files: 'client/**/*.less',
                tasks: ['less:compile']
            }
        },
        githooks: {
            all: {
                'post-merge': 'less:compile'
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            css: {
                src: 'client/css/**/*',
                dest: 'build/css/index.css'
            },
            js: {
                src: 'build/js/tmp/*',
                dest: 'build/js/index.js'
            }
        },
        copy: {
            css_scooch: {
                src: 'bower_components/scooch/build/scooch.min.css',
                dest: 'client/css/scooch.min.css'
            },
            css_scooch_style: {
                src: 'bower_components/scooch/build/scooch-style.min.css',
                dest: 'client/css/scooch-style.min.css'
            },
            resources_img_dist: {
                src: 'client/resources/img/*',
                dest: 'build/resources/img',
                flatten: true,
                filter: 'isFile',
                expand: true
            },
            resources_fonts_dist: {
                src: 'client/resources/fonts/*',
                dest: 'build/resources/fonts',
                flatten: true,
                filter: 'isFile',
                expand: true
            },
            index_html_dist: {
                src: 'index.html',
                dest: 'build/index.html'
            },
            js: {
                src: 'client/js/*',
                dest: 'build/js/tmp/',
                flatten: true,
                filter: 'isFile',
                expand: true
            },
            js_zepto: {
                src: 'bower_components/zepto/zepto.min.js',
                dest: 'build/js/tmp/1.js'
            },
            js_scooch: {
                src: 'bower_components/scooch/build/scooch.min.js',
                dest: 'build/js/tmp/2.js'
            }
        },
        clean: ['build/js/tmp'],
        dusthtml: {
            'dev': {
                src: "./index.html.dust",
                dest: "./index.html",

                options: {
                    context: "./data.json",
                    whitespace: true,
                    module: "dustjs-helpers"
                }
            },
            'dist': {
                src: "./index.html.dust",
                dest: "./build/index.html",

                options: {
                    context: ["./data.json", {"isProduction": true}],
                    whitespace: true,
                    module: "dustjs-helpers"
                }
            }
        }
    });

// build tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-file-process');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dust-html');
    /*grunt.loadNpmTasks('grunt-ssh-deploy');*/

// HTMl distribution task
    grunt.registerTask('dist-html', ['dusthtml:dist']);

// JS distribution task
    grunt.registerTask('dist-js', ['copy:js_zepto', 'copy:js_scooch', 'copy:js', 'concat:js']);

// CSS distribution task
    grunt.registerTask('dist-css', ['less:compile', 'copy:css_scooch', 'copy:css_scooch_style', 'concat:css']);
    grunt.registerTask('dist-resources', ['copy:resources_img_dist', 'copy:resources_fonts_dist']);

// build tasks
    grunt.registerTask('build:dist', ['dist-html', 'dist-css', 'dist-js', 'dist-resources', 'clean']);

// Default task
    grunt.registerTask('default', ['build:dist']);

};
