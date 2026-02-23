// Karma configuration for unit tests
// https://karma-runner.github.io/

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Randomize test execution order to detect order-dependent tests
        random: true
      },
      clearContext: false // Keep Jasmine Spec Runner output in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // Remove duplicates in output
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/employee-portal'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true
  });
};
