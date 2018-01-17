const FlowRouter = Package['ostrio:flow-router-extra'] ? Package['ostrio:flow-router-extra'].FlowRouter : false;

const routeClasses = () => {
  let classes = [];

  if(Package['iron:router']){
    let ctrl = Router.current();
    classes = [ctrl._layout._template, ctrl.lookupTemplate()];
  }

  if(Package['kadira:flow-router']) {
    // Gets a route's layout OR its group's layout OR its group's parent's layout
    // OR default layout in that order
    function getRouteLayout(route) {
      return route.options.layout
        || route.group && route.group.options.layout
        || route.group && route.group.parent && route.group.parent.options.layout
        || FlowRouter.defaultLayout;
    }

    let route = FlowRouter.current().route;
    classes = [route.name, getRouteLayout(route)];
  }

  return _.chain(classes)
    .compact()
    .invoke('toLowerCase')
    .value();
};

BodyClass = {

  settings: {
    element: 'body',
    classes: []
  },

  config(opts) {
    _.extend(this.settings, opts);
    return this;
  },

  add(fn) {
    if(!Match.test(fn, Match.OneOf(Array, String, Function))) {
      return console.warn('BodyClass: Argument to "add" must be an array, string or function!');
    }

    if(Match.test(fn, Array)) {
      return fn.forEach(_.bind(BodyClass.add, BodyClass));
    }

    if(!Match.test(fn, Function)) {
      return Meteor.startup(() => $(this.settings.element).addClass(fn));
    }

    if(Match.test(fn, Function)) {
      Meteor.startup(() => {
        Tracker.autorun(() => {
          $(this.settings.element)
            .removeClass(fn._prev)
            .addClass(fn._prev = fn());
        });
      });
    }
  },

  run(opts = {}) {
    let classes = this.settings.classes.concat(routeClasses());

    if(opts.classes) {
      classes = classes.concat(opts.classes);
    }

    $(this.settings.element).addClass(classes.join(' '));
  },

  remove(className) {
    check(className, String);
    $(this.settings.element).removeClass(className);
  },

  cleanup() {
    BodyClass.remove(this.settings.classes.concat(routeClasses()).join(' '));
  }
};

if(Package['iron:router']) {

  Iron.Router.plugins.bodyClasses = (router, options) => {
    router.onAfterAction(() => {
      BodyClass.run(options);
    }, options);

    router.onStop(() => {
      BodyClass.cleanup();
    }, options);
  };
}

if(FlowRouter) {
  FlowRouter.triggers.enter([() => BodyClass.run()]);
  FlowRouter.triggers.exit([() => BodyClass.cleanup()]);
}
