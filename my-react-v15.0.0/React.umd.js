(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ReactNoopUpdateQueue')) :
  typeof define === 'function' && define.amd ? define(['ReactNoopUpdateQueue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.React = factory(global.require$$0));
}(this, (function (require$$0) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

  // ReactCurrentOwner.js
  var ReactCurrentOwner$1 = {
    current: null,
  };

  var ReactCurrentOwner_1 = ReactCurrentOwner$1;

  // ReactElement.js

  var ReactCurrentOwner = ReactCurrentOwner_1;


  var REACT_ELEMENT_TYPE =
    (typeof Symbol === "function" && Symbol.for && Symbol.for("react.element")) ||
    0xeac7;
  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true,
  };

  var ReactElement$2 = function (type, key, ref, self, source, owner, props) {
    var element = {
      $$typeof: REACT_ELEMENT_TYPE,

      type,
      key,
      ref,
      props,

      _owner: owner,
    };
    return element;
  };

  ReactElement$2.createElement = function (type, config, children) {
    var propName;

    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      ref = config.ref === undefined ? null : config.ref;
      key = config.key === undefined ? null : "" + config.key;

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source;

      for (propName in config) {
        if (
          config.hasOwnProperty(propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)
        ) {
          props[propName] = config[propName];
        }
      }
    }

    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }

      props.children = childArray;
    }

    // 省略 default props 逻辑
    return ReactElement$2(
      type,
      key,
      ref,
      self,
      source,
      ReactCurrentOwner.current,
      props
    );
  };

  ReactElement$2.isValidElement = function (object) {
    return (
      typeof object === "object" &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE
    );
  };

  var ReactElement_1 = ReactElement$2;

  // ReactComponent.js

  var ReactNoopUpdateQueue = require$$0__default['default'];

  function ReactComponent$1(props, context, updater) {
    this.props = props;
    // this.context = context;
    // this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  ReactComponent$1.prototype.isReactComponent = {};



  var ReactComponent_1 = ReactComponent$1;

  // 其他辅助类库
  var invariant$1 = function (condition, format, a, b, c, d, e, f) {
    if (!condition) {
      var error;
      if (format === undefined) {
        error = new Error(
          "Minified exception occurred; use the non-minified dev environment " +
            "for the full error message and additional helpful warnings."
        );
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(
          format.replace(/%s/g, function () {
            return args[argIndex++];
          })
        );
        error.name = "Invariant Violation";
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };

  var invariant_1 = invariant$1;

  // ReactClass.js

  var ReactComponent = ReactComponent_1;
  var ReactElement$1 = ReactElement_1;

  var invariant = invariant_1;

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
      !ReactElement$1.isValidElement(spec),
      "ReactClass: You're attempting to " +
        "use a component as a mixin. Instead, just use a regular object."
    );

    var proto = Constructor.prototype;
    proto.__reactAutoBindPairs;

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
  var ReactClass$1 = {
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

  var ReactClass_1 = ReactClass$1;

  // React.js

  var ReactElement = ReactElement_1;
  var ReactClass = ReactClass_1;


  var React = {
    createElement: ReactElement.createElement,
    createClass: ReactClass.createClass,
  };

  var React_1 = React;

  return React_1;

})));
