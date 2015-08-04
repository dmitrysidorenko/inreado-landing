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
            },
            tmp: {
                files: 'index.html.dust',
                tasks: ['dusthtml:dev']
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
            js_jq: {
                src: 'bower_components/jquery/dist/jquery.min.js',
                dest: 'build/js/tmp/0.js'
            },
            js_ng: {
                src: 'bower_components/angular/angular.min.js',
                dest: 'build/js/tmp/1.js'
            },
            js_bootstrap: {
                src: 'bower_components/angular-bootstrap/ui-bootstrap.min.js',
                dest: 'build/js/tmp/2.js'
            },
            js_bootstrap_tpls: {
                src: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                dest: 'build/js/tmp/3.js'
            },
            js_ng_sanitize: {
                src: 'bower_components/angular-sanitize/angular-sanitize.min.js',
                dest: 'build/js/tmp/4.js'
            },
            js_ng_animate: {
                src: 'bower_components/angular-animate/angular-animate.js',
                dest: 'build/js/tmp/5.js'
            },
            js_ng_ui_router: {
                src: 'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                dest: 'build/js/tmp/6.js'
            },
            js_ng_carousel: {
                src: 'bower_components/angular-carousel/dist/angular-carousel.min.js',
                dest: 'build/js/tmp/7.js'
            },
            js_ng_touch: {
                src: 'bower_components/angular-touch/angular-touch.min.js',
                dest: 'build/js/tmp/8.js'
            },
            js_ng_swipe: {
                src: 'bower_components/angular-swipe/dist/angular-swipe.min.js',
                dest: 'build/js/tmp/9.js'
            },
            js_data: {
                src: 'client/js/data.js',
                dest: 'build/js/tmp/10.js'
            },
            js_app: {
                src: 'client/js/app.js',
                dest: 'build/js/tmp/11.js'
            },
            js_particles: {
                src: 'client/js/particles.js',
                dest: 'build/js/tmp/12.js'
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
    grunt.registerTask('dist-html', ['copy:index_html_dist']);

// JS distribution task
    grunt.registerTask('dist-js', ['copy:js_jq', 'copy:js_ng', 'copy:js_bootstrap', 'copy:js_bootstrap_tpls', 'copy:js_ng_sanitize', 'copy:js_ng_animate', 'copy:js_ng_ui_router', 'copy:js_ng_carousel', 'copy:js_ng_touch', 'copy:js_ng_swipe', 'copy:js_data', 'copy:js_app', 'copy:js_particles', 'concat:js']);

// CSS distribution task
    grunt.registerTask('dist-css', ['less:compile', 'concat:css']);
    grunt.registerTask('dist-resources', ['copy:resources_img_dist', 'copy:resources_fonts_dist']);

// build tasks
    grunt.registerTask('build:dist', ['dist-html', 'dist-css', 'dist-js', 'dist-resources', 'clean']);

// Default task
    grunt.registerTask('default', ['build:dist']);

};
