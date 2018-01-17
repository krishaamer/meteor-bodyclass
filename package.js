Package.describe({
  name: 'krishaamer:body-class',
  version: '0.4.2',
  git: 'https://github.com/krishaamer/body-class.git',
  summary: 'Automatically add classes for router templates and layouts for scoping with CSS.'
});

var where = 'client';

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');

  api.use([
    'ecmascript',
    'check',
    'underscore',
    'jquery',
    'tracker'
  ], where);

  api.use([
    'iron:router@1.0.0',
    'ostrio:flow-router-extra@3.4.3'
  ], where, {weak: true});

  api.addFiles('body-class.js', where);
  api.export('BodyClass', where);
});

Package.onTest(function(api) {
  api.use([
    'coffeescript',
    'practicalmeteor:munit',
    'lookback:body-class'
  ], where);

  api.addFiles('body-class-test.coffee', where);
});
