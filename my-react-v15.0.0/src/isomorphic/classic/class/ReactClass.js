// ReactClass.js

var ReactComponent = require('ReactComponent')
var ReactElement = require('ReactElement')

var invariant = require('invariant')

function mixSpecIntoComponent(Constructor, spec) {
  if (!spec) {
    return;
  }

  invariant(
    typeof spec !== "function",
    "ReactClass: You're attempting to " +
      "use a component class or function as a mixin. Instead, just use a " +
      "regular object."
  );
  invariant(
    !ReactElement.isValidElement(spec),
    "ReactClass: You're attempting to " +
      "use a component as a mixin. Instead, just use a regular object."
  );

  var proto = Constructor.prototype;
  var autoBindPairs = proto.__reactAutoBindPairs;

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    var property = spec[name];
    // var isAlreadyDefined = proto.hasOwnProperty(name);

    // Setup methods on prototype:
    // The following member methods should not be automatically bound:
    // 1. Expected ReactClass methods (in the "interface").
    // 2. Overridden methods (that were mixed in).

    // var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
    // var isFunction = typeof property === 'function'
    // var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

    // 省略了验证保留方法和 mixin 的逻辑
    proto[name] = property;
  }
}
var ReactClass = {
  createClass: function (spec) {
    var Constructor = function (props, context, updater) {
      this.props = props;
      this.context = context;
      // this.refs = emptyObject;
      // this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;

      this.state = initialState;
    };

    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    mixSpecIntoComponent(Constructor, spec);

    return Constructor;
  },
};

var ReactClassComponent = function () {};
Object.assign(ReactClassComponent.prototype, ReactComponent.prototype);

module.exports = ReactClass;
