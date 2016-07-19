module.exports = function(grunt) {

       'use strict';
       // Project configuration.
       grunt.initConfig({
               jasmine : {
		       src : ['node_modules/grunt-contrib-jasmine/tasks/lib/jquery.min.js',
		       'node_modules/grunt-contrib-jasmine/tasks/lib/velocity.min.js',
		       'node_modules/grunt-contrib-jasmine/tasks/lib/moment-with-locales.js',
		       'node_modules/grunt-contrib-jasmine/tasks/lib/angular.js',
		        'node_modules/grunt-contrib-jasmine/tasks/lib/angular-mocks.js',
			'node_modules/grunt-contrib-jasmine/tasks/lib/angular-route.min.js',
		       'node_modules/grunt-contrib-jasmine/tasks/lib/lumX-1.1.0/dist/lumx.js',
		       'node_modules/grunt-contrib-jasmine/tasks/lib/underscore-min.js',
		       'angular-webpage/jasmine/src/kurento-utils.min.js',
		       'node_modules/grunt-contrib-jasmine/tasks/lib/re-tree.js',
		       'node_modules/grunt-contrib-jasmine/tasks/lib/ng-device-detector.min.js',
		       'node_modules/grunt-contrib-jasmine/tasks/lib/bower-angular-translate-2.9.0.1/angular-translate.js',
                       'angular-webpage/jasmine/src/controllers/room.js',
		       'angular-webpage/jasmine/src/controllers/user.js',
		       'angular-webpage/jasmine/src/app.js',
		       'angular-webpage/jasmine/src/factories/*.js'],

                       options : {
                               specs : 'angular-webpage/jasmine/spec/participantsSpec.js'
                       }
               }
       });
       grunt.loadNpmTasks('grunt-contrib-jasmine');
};
