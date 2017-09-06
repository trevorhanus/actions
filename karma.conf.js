var path = require('path');

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],

        // plugins: [
        //     require('karma-mocha'),
        //     require('karma-webpack'),
        //     require('karma-chai')
        // ],

        mime: {
            'text/x-typescript': ['ts','tsx']
        },


        // list of files / patterns to load in the browser
        files: [
            'test/**/*.test.ts'
        ],

        exclude: [
            'node_modules/'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/*.ts': ['webpack'],
            '**/*.tsx': ['webpack']
        },
        webpack: {
            devtool: 'eval',
            module: {
                loaders: [
                    {
                        test: /\.tsx?$/,
                        loaders: ['awesome-typescript-loader']
                    }
                ]
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js']
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots',  'live-html'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        htmlLiveReporter: {
            colorScheme: 'jasmine', // light 'jasmine' or dark 'earthborn' scheme
            defaultTab: 'summary', // 'summary' or 'failures': a tab to start with
            // only show one suite and fail log at a time, with keyboard navigation
            focusMode: true,
        }
    })
};