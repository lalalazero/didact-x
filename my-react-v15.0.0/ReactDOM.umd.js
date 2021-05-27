(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ReactReconciler'), require('ReactDOMContainerInfo'), require('ReactNativeComponent')) :
  typeof define === 'function' && define.amd ? define(['ReactReconciler', 'ReactDOMContainerInfo', 'ReactNativeComponent'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ReactDOM = factory(global.require$$0$1, global.require$$1, global.require$$0));
}(this, (function (require$$0$1, require$$1, require$$0) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
  var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
  var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

  // ReactCompositeComponent.js
  var nextMountID = 1;
  var ReactCompositeComponentMixin = {
    construct: function (element) {
      this._currentElement = element;
      this._rootNodeID = null;
      this._instance = null;
      this._nativeParent = null;
      this._nativeContainerInfo = null;

      // See ReactUpdateQueue
      this._pendingElement = null;
      this._pendingStateQueue = null;
      this._pendingReplaceState = false;
      this._pendingForceUpdate = false;

      this._renderedNodeType = null;
      this._renderedComponent = null;
      this._context = null;
      this._mountOrder = 0;
      this._topLevelWrapper = null;

      // See ReactUpdates and ReactUpdateQueue.
      this._pendingCallbacks = null;
    },
    /**
     * Filters the context object to only contain keys specified in
     * `contextTypes`
     *
     * @param {object} context
     * @return {?object}
     * @private
     */
    _maskContext: function (context) {
      var Component = this._currentElement.type;
      var contextTypes = Component.contextTypes;
      if (!contextTypes) {
        return emptyObject;
      }
      var maskedContext = {};
      for (var contextName in contextTypes) {
        maskedContext[contextName] = context[contextName];
      }
      return maskedContext;
    },
    _processProps: function (newProps) {
      return newProps;
    },
    _processContext: function (context) {
      var maskedContext = this._maskContext(context);
      return maskedContext;
    },
    /**
     *  Initializes the component, renders markup, and registers event listeners.
     * */

    mountComponent: function (
      transaction,
      nativeParent,
      nativeContainerInfo,
      context
    ) {
      this._context = context;
      this._mountOrder = nextMountID++;
      this._nativeParent = nativeParent;
      this._nativeContainerInfo = nativeContainerInfo;

      var publicProps = this._processProps(this._currentElement.props);
      var publicContext = this._processContext(context);

      var Component = this._currentElement.type;

      // Initialize the public class
      var inst;
      var renderedElement;

      if (Component.prototype && Component.prototype.isReactComponent) {
        inst = new Component(publicProps, publicContext, ReactUpdateQueue);
      } else {
        inst = Component(publicProps, publicContext, ReactUpdateQueue);
        if (inst == null || inst.render == null) {
          renderedElement = inst;
          invariant(
            inst === null || inst === false || ReactElement.isValidElement(inst),
            "%s(...): A valid React element (or null) must be returned. You may have " +
              "returned undefined, an array or some other invalid object.",
            Component.displayName || Component.name || "Component"
          );
          inst = new StatelessComponent(Component);
        }
      }

      // These should be set up in the constructor, but as a convenience for
      // simpler class abstractions, we set them up after the fact.
      inst.props = publicProps;
      inst.context = publicContext;
      inst.refs = emptyObject;
      inst.updater = ReactUpdateQueue;

      this._instance = inst;

      // Store a reference from the instance back to the internal representation
      ReactInstanceMap.set(inst, this);

      var initialState = inst.state;
      if (initialState === undefined) {
        inst.state = initialState = null;
      }
      invariant(
        typeof initialState === "object" && !Array.isArray(initialState),
        "%s.state: must be set to an object or null",
        this.getName() || "ReactCompositeComponent"
      );

      this._pendingStateQueue = null;
      this._pendingReplaceState = false;
      this._pendingForceUpdate = false;

      var markup;
      if (inst.unstable_handleError) {
        markup = this.performInitialMountWithErrorHandling(
          renderedElement,
          nativeParent,
          nativeContainerInfo,
          transaction,
          context
        );
      } else {
        markup = this.performInitialMount(
          renderedElement,
          nativeParent,
          nativeContainerInfo,
          transaction,
          context
        );
      }

      if (inst.componentDidMount) {
        // transaction
        //   .getReactMountReady()
        //   .enqueue(inst.componentDidMount, inst);
        console.log("不考虑 transaction , 直接调用 componentDidMount..");
        inst.componentDidMount.call(inst);
      }

      return markup;
    },
    receiveComponent: function () {
      console.log("receive component todo...3");
    },
    _renderValidatedComponentWithoutOwnerOrContext: function () {
      var inst = this._instance;
      var renderedComponent = inst.render();

      return renderedComponent;
    },
    _renderValidatedComponent: function () {
      var renderedComponent;
      ReactCurrentOwner.current = this;
      try {
        renderedComponent = this._renderValidatedComponentWithoutOwnerOrContext();
      } finally {
        ReactCurrentOwner.current = null;
      }
      invariant(
        // TODO: An `isValidNode` function would probably be more appropriate
        renderedComponent === null ||
          renderedComponent === false ||
          ReactElement.isValidElement(renderedComponent),
        "%s.render(): A valid React element (or null) must be returned. You may have " +
          "returned undefined, an array or some other invalid object.",
        this.getName() || "ReactCompositeComponent"
      );
      return renderedComponent;
    },
    performInitialMount: function (
      renderedElement,
      nativeParent,
      nativeContainerInfo,
      transaction,
      context
    ) {
      var inst = this._instance;
      if (inst.componentWillMount) {
        console.log("component will mount...");
        inst.componentWillMount();
        // When mounting, calls to `setState` by `componentWillMount` will set
        // `this._pendingStateQueue` without triggering a re-render.
        if (this._pendingStateQueue) {
          inst.state = this._processPendingState(inst.props, inst.context);
        }
      }

      // If not a stateless component, we now render
      if (renderedElement === undefined) {
        renderedElement = this._renderValidatedComponent();
      }

      this._renderedNodeType = ReactNodeTypes.getType(renderedElement);
      this._renderedComponent = this._instantiateReactComponent(renderedElement);

      var markup = ReactReconciler.mountComponent(
        this._renderedComponent,
        transaction,
        nativeParent,
        nativeContainerInfo
        // this._processChildContext(context)
      );
      return markup;
    },
    getName: function () {
      var type = this._currentElement.type;
      var constructor = this._instance && this._instance.constructor;
      return (
        type.displayName ||
        (constructor && constructor.displayName) ||
        type.name ||
        (constructor && constructor.name) ||
        null
      );
    },
  };
  var ReactCompositeComponent$1 = {
    Mixin: ReactCompositeComponentMixin,
  };

  var ReactCompositeComponent_1 = ReactCompositeComponent$1;

  // instantiateReactComponent.js
  // To avoid a cyclic dependency, we create the final class in this module

  var ReactNativeComponent = require$$0__default['default'];
  var ReactCompositeComponent = ReactCompositeComponent_1;


  var ReactCompositeComponentWrapper = function (element) {
    this.construct(element);
  };
  Object.assign(
    ReactCompositeComponentWrapper.prototype,
    ReactCompositeComponent.Mixin,
    {
      _instantiateReactComponent: instantiateReactComponent$1,
    }
  );
  function isInternalComponentType(type) {
    return (
      typeof type === "function" &&
      typeof type.prototype !== "undefined" &&
      typeof type.prototype.mountComponent === "function" &&
      typeof type.prototype.receiveComponent === "function"
    );
  }
  function instantiateReactComponent$1(node) {
    var instance;
    if (node === null || node === false) {
      console.warn("省略 null / false 的逻辑");
      // instance = ReactEmptyComponent.create(instantiateReactComponent)
    } else if (typeof node === "object") {
      var element = node;
      if (typeof element.type === "string") {
        instance = ReactNativeComponent.createInternalComponent(element);
      } else if (isInternalComponentType(element.type)) {
        instance = new element.type(element);
      } else {
        instance = new ReactCompositeComponentWrapper(element);
      }
    } else if (typeof node === "string" || typeof node === "number") {
      instance = ReactNativeComponent.createInstanceForText(node);
    } else {
      invariant(false, "Encountered invalid React node of type %s", typeof node);
    }

    instance._mountIndex = 0;
    instance._mountImage = null;
    return instance;
  }

  var instantiateReactComponent_1 = instantiateReactComponent$1;

  // ReactCurrentOwner.js
  var ReactCurrentOwner$2 = {
    current: null,
  };

  var ReactCurrentOwner_1 = ReactCurrentOwner$2;

  // ReactElement.js

  var ReactCurrentOwner$1 = ReactCurrentOwner_1;


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
      ReactCurrentOwner$1.current,
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

  // ReactUpdates.js
  var ReactUpdates$1 = {
    batchedUpdates: function (callback, a, b, c, d, e) {
      // 省略 transaction 部分
      // ReactDefaultBatchingStrategy.batchedUpdates(callback, a, b, c, d, e);
      // 直接调
      callback.call(null, a, b, c, d, e);
    },
  };

  var ReactUpdates_1 = ReactUpdates$1;

  // 其他辅助类库
  var invariant$2 = function (condition, format, a, b, c, d, e, f) {
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

  var invariant_1 = invariant$2;

  var emptyObject$2 = {};

  // ReactMount.js

  var ReactReconciler$1 = require$$0__default$1['default'];
  var ReactDOMContainerInfo = require$$1__default['default'];
  var instantiateReactComponent = instantiateReactComponent_1;
  var ReactElement$1 = ReactElement_1;
  var ReactUpdates = ReactUpdates_1;
  var invariant$1 = invariant_1;
  var emptyObject$1 = emptyObject$2;


  var ELEMENT_NODE_TYPE = 1;
  var topLevelRootCounter = 1;
  var DOCUMENT_FRAGMENT_NODE_TYPE = 11;
  var TopLevelWrapper = function () {
    this.rootID = topLevelRootCounter++;
  };
  TopLevelWrapper.prototype.isReactComponent = {};
  TopLevelWrapper.prototype.render = function () {
    return this.props;
  };

  function mountComponentIntoNode(
    wrapperInstance,
    container,
    transaction,
    shouldReuseMarkup,
    context
  ) {
    var markup = ReactReconciler$1.mountComponent(
      wrapperInstance,
      transaction,
      null,
      ReactDOMContainerInfo(wrapperInstance, container),
      context
    );

    wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
    ReactMount$1._mountImageIntoNode(
      markup,
      container,
      wrapperInstance,
      shouldReuseMarkup,
      transaction
    );
  }

  function batchedMountComponentIntoNode(
    componentInstance,
    container,
    shouldReuseMarkup,
    context
  ) {
    var transaction = {};
    // 暂时省略 transaction 部分
    // var transaction = ReactUpdates.ReactReconcilerTransaction.getPooled(
    //   true
    // );
    // transaction.perform(
    //   mountComponentIntoNode,
    //   null,
    //   componentInstance,
    //   container,
    //   transaction,
    //   shouldReuseMarkup,
    //   context
    // );
    // ReactUpdates.ReactReconcilerTransaction.release(transaction);
    // 其实就是直接调用了
    mountComponentIntoNode.call(
      transaction,
      componentInstance,
      container,
      transaction,
      shouldReuseMarkup,
      context
    );
  }
  var ReactMount$1 = {
    _mountImageIntoNode: function (
      markup,
      container,
      instance,
      shouldReuseMarkup,
      transaction
    ) {
      invariant$1(
        container &&
          (container.nodeType === ELEMENT_NODE_TYPE ||
            container.nodeType === DOC_NODE_TYPE ||
            container.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE),
        "mountComponentIntoNode(...): Target container is not valid."
      );

      if (transaction.useCreateElement) {
        while (container.lastChild) {
          container.removeChild(container.lastChild);
        }
        DOMLazyTree.insertTreeBefore(container, markup, null);
      }
    },
    _renderNewRootComponent: function (
      nextElement,
      container,
      shouldReuseMarkup,
      context
    ) {
      var componentInstance = instantiateReactComponent(nextElement);

      ReactUpdates.batchedUpdates(
        batchedMountComponentIntoNode,
        componentInstance,
        container,
        shouldReuseMarkup,
        context
      );

      return componentInstance;
    },
    _renderSubtreeIntoContainer: function (
      parentComponent,
      nextElement,
      container,
      callback
    ) {
      var nextWrapperElement = ReactElement$1(
        TopLevelWrapper,
        null,
        null,
        null,
        null,
        null,
        nextElement
      );
      // 省略更新或者卸载的逻辑
      // var prevComponent = getTopLevelWrapperInContainer(container)

      // 只考虑第一次渲染
      // var shouldReuseMarkup = false
      // var reactRootElement = getReactRootElementInContainer(container);
      var component = ReactMount$1._renderNewRootComponent(
        nextWrapperElement,
        container,
        false, // shouldReuseMarkup,
        emptyObject$1
      ); //._renderedComponent.getPublicInstance(); // 省略这里

      if (callback) {
        callback.call(component);
      }
    },
    render: function (nextElement, container, callback) {
      return ReactMount$1._renderSubtreeIntoContainer(
        null,
        nextElement,
        container,
        callback
      );
    },
  };

  var ReactMount_1 = ReactMount$1;

  // ReactDOM.js

  var ReactMount = ReactMount_1;

  var ReactDOM = {
    render: ReactMount.render,
  };

  var ReactDOM_1 = ReactDOM;

  return ReactDOM_1;

})));
