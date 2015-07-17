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
        requirejs: {
            compile: {
                options: {
//                    appDir:"./client/",
                    baseUrl: "./client",
                    mainConfigFile: ["client/app/entry.js", "client/app/plugins.js"],
                    insertRequire: ['app/bootstrap'], // module to launch application from
                    name: 'app/bootstrap', // module to start parsing from
                    out: "build/dist/js/index.js",
                    optimize: 'none',
                    include: ['bower_components/requirejs/require.js', '../build/dist/js/template-cache']
                }
            }
        },
        ngtemplates: {
            compile: {
                src: 'client/app/**/*.html',
                dest: 'build/dist/js/template-cache.js',
                options: {
                    bootstrap: function (module, script) {
                        return "define(function (require) { require('angular').module('dap.shared.templateCache').run(['$templateCache', function ($templateCache) {" + script + " }]);});";
                    },
                    url: function (url) {
                        return '/' + url.replace(/^client\//, '');
                    }
                }
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: 'client/css/**/*',
                dest: 'build/dist/css/index.css'
            },
            dev: {
                src: 'client/css/**/*',
                dest: 'client/css/index.css'
            }
        },
        copy: {
            css_dist: {
                src: 'client/css/**/*',
                dest: 'build/dist'
            },
            css_codemirror: {
                src: 'client/bower_components/codemirror/lib/codemirror.css',
                dest: 'client/css/codemirror.css'
            },
            resources_img_dist: {
                src: 'client/resources/img/*',
                dest: 'build/dist/resources/img',
                flatten: true,
                filter: 'isFile',
                expand: true
            },
            angular_tree_img_dev: {
                src: 'client/bower_components/angular-tree-control/images/*',
                dest: 'client/resources/vendors/img',
                flatten: true,
                filter: 'isFile',
                expand: true
            },
            vendors_resources_img_dist: {
                src: 'client/resources/vendors/img/*',
                dest: 'build/dist/resources/vendors/img',
                flatten: true,
                filter: 'isFile',
                expand: true
            },
            resources_fonts_dist: {
                src: 'client/resources/fonts/*',
                dest: 'build/dist/resources/fonts',
                flatten: true,
                filter: 'isFile',
                expand: true
            },
            index_html_dist: {
                src: 'client/index.html',
                dest: 'build/dist/index.html'
            },
            plugins_resources_img: {
                src: 'client/app/plugins/**/*/resources/img/*',
                dest: 'client/resources/img/',
                flatten: true,
                filter: 'isFile',
                expand: true
            },
            plugins_resources_fonts: {
                src: 'client/app/plugins/**/*/resources/fonts/*',
                dest: 'client/resources/fonts/',
                flatten: true,
                filter: 'isFile',
                expand: true
            }
        },
        process: {
            templates: {
                options: {
                    base64: false,
                    processors: [
                        {
                            pattern: '/*--process:[insert-template-cache]--*/',
                            handler: function (context, matchParams) {
                                return ", 'build/dist/js/template-cache'";
                            }
                        },
                        {
                            pattern: "define('../build/dist/js/template-cache'",
                            handler: function (context, matchParams) {
                                return "define('build/dist/js/template-cache'";
                            }
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        src: 'build/dist/js/index.js'
                    }
                ]
            },
            ng_tree_control: {
                options: {
                    base64: false,
                    processors: [
                        {
                            pattern: /(url\("\.\.\/images\/)/gm,
                            handler: function (context, matchParams) {
                                return 'url("../resources/vendors/img/';
                            }
                        }
                    ]
                },
                files: [{
                    src: 'client/bower_components/angular-tree-control/css/tree-control.css',
                    dest: 'client/css/'
                }]
            },
            index_html: {
                options: {
                    base64: false,
                    processors: [
                        {
                            pattern: '<script src="./bower_components/requirejs/require.js" data-main="app/entry"></script>',
                            handler: function (context, matchParams) {
                                return "<script src='./js/index.js'></script>";
                            }
                        },
                        {
                            pattern: '<link rel="stylesheet" href="/css/bootstrap.min.css">',
                            handler: function (context, matchParams) {
                                return "";
                            }
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        src: 'build/dist/index.html'
                    }
                ]
            }
        },
        clean: ["build/dist/js/template-cache.js"],
        removelogging: {
            dist: {
                src: "build/dist/js/index.js",
                options: {
                    methods: ["assert"]
                }
            }
        },
        dusthtml: {
            'dist': {
                src: "./index.html.dust",
                dest: "./index.html",

                options: {
                    context: './data.json'
                }
            }
        }
    });

// build tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-file-process');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-dust-html');
    /*grunt.loadNpmTasks('grunt-ssh-deploy');*/

// development tasks
    grunt.loadNpmTasks('grunt-githooks');


// HTMl distribution task
    grunt.registerTask('dist-html', ['copy:index_html_dist', 'process:index_html']);

// JS distribution task
    grunt.registerTask('dist-js', ['ngtemplates', 'requirejs:compile', 'process:templates', 'removelogging:dist']);

// CSS distribution task
    grunt.registerTask('dist-css', ['less:compile', 'copy-vendors-css', 'concat:dist', 'resources_dist']);
    grunt.registerTask('copy-vendors-css', ['process:ng_tree_control', 'copy:css_codemirror']);
    grunt.registerTask('resources_dist', ['copy:plugins_resources_fonts', 'copy:plugins_resources_img', 'copy:vendors_resources_img_dist', 'copy:resources_img_dist', 'copy:resources_fonts_dist']);

// build tasks
    grunt.registerTask('build:dist', ['dist-html', 'dist-css', 'dist-js', 'clean']);
    grunt.registerTask('build:dev', ['less:compile', 'copy:angular_tree_img_dev', 'copy-vendors-css', 'concat:dev']);

// Default task
    grunt.registerTask('default', ['build:dist']);


// Custom tasks
    grunt.registerMultiTask('prepend_from_file', 'Prepend data from one file to another.', function () {

        var contentToAppend = '';
        this.files.forEach(function (file) {
            file.src.filter(existingFilesFilter).map(function (filepath) {
                contentToAppend += grunt.file.read(filepath);
            });

            var dstFilePath = file.orig.dest;
            if (existingFilesFilter(dstFilePath)) {
                var dstFileContent = grunt.file.read(dstFilePath);
                grunt.file.write(dstFilePath, contentToAppend + dstFileContent);
                grunt.log.ok('File "' + dstFilePath + '" appended with content from other files.');
            }
        });

        function existingFilesFilter(filepath) {
            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Source file "' + filepath + '" not found.');
                return false;
            } else {
                return true;
            }
        }

    });

};
