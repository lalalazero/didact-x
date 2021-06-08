(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ReactDOM = factory());
}(this, (function () { 'use strict';

  // ReactReconciler.js
  var ReactReconciler$4 = {
    /**
     * Update a component using a new element
     * 
     * @param {*} internalInstance 
     * @param {*} nextElement 
     * @param {*} transaction 
     * @param {*} context 
     */
    receiveComponent: function(internalInstance, nextElement, transaction, context) {
      var prevElement = internalInstance._currentElement;

      if (nextElement === prevElement && context === internalInstance._context) {
        console.log('进入了 receiveComponent 但是不用做什么东西');
        return
      }

      internalInstance.receiveComponent(nextElement, transaction, context);
    },
    mountComponent: function (
      internalInstance,
      transaction,
      nativeParent,
      nativeContainerInfo,
      context
    ) {
      console.log("enter --> ReactReconciler.mountComponent");
      console.log("当前的 instance", internalInstance);
      console.log(
        "当前的 instance._currentElement.type",
        internalInstance._currentElement.type
      );
      console.log(
        "当前的 instance._currentElement",
        internalInstance._currentElement
      );
      console.log("--------------------------------------------");
      var markup = internalInstance.mountComponent(
        transaction,
        nativeParent,
        nativeContainerInfo,
        context
      );
      return markup;
    },
    /**
     * Flush any dirty changes in a component.
     *
     * @param {ReactComponent} internalInstance
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    performUpdateIfNecessary: function (internalInstance, transaction) {
      internalInstance.performUpdateIfNecessary(transaction);
    },
  };

  var ReactReconciler_1 = ReactReconciler$4;

  // ReactDOMContainerInfo.js
  var DOC_NODE_TYPE$1 = 9;
  function ReactDOMContainerInfo$1(topLevelWrapper, node) {
    var info = {
      _topLevelWrapper: topLevelWrapper,
      _idCounter: 1,
      _ownerDocument: node
        ? node.nodeType === DOC_NODE_TYPE$1
          ? node
          : node.ownerDocument
        : null,
      _tag: node ? node.nodeName.toLowerCase() : null,
      _namespaceURI: node ? node.namespaceURI : null,
    };

    return info;
  }

  var ReactDOMContainerInfo_1 = ReactDOMContainerInfo$1;

  // ReactNativeComponent.js

  var genericComponentClass = null;
  var textComponentClass = null;
  // This registry keeps track of wrapper classes around native tags.
  var tagToComponentClass = {};
  var textComponentClass = null;

  var ReactNativeComponentInjection$1 = {
    // This accepts a class that receives the tag string. This is a catch all
    // that can render any kind of tag.
    injectGenericComponentClass: function (componentClass) {
      genericComponentClass = componentClass;
    },
    // This accepts a text component class that takes the text string to be
    // rendered as props.
    injectTextComponentClass: function (componentClass) {
      textComponentClass = componentClass;
    },
    // This accepts a keyed object with classes as values. Each key represents a
    // tag. That particular tag will use this class instead of the generic one.
    injectComponentClasses: function (componentClasses) {
      Object.assign(tagToComponentClass, componentClasses);
    },
  };

  var ReactNativeComponent$2 = {
    createInternalComponent: function (element) {
      return new genericComponentClass(element);
    },
    createInstanceForText: function (text) {
      return new textComponentClass(text);
    },
    injection: ReactNativeComponentInjection$1,
  };

  var ReactNativeComponent_1 = ReactNativeComponent$2;

  var emptyObject$2 = {};

  // ReactInstanceMap.js
  /**
   * `ReactInstanceMap` maintains a mapping from a public facing stateful
   * instance (key) and the internal representation (value). This allows public
   * methods to accept the user facing instance as an argument and map them back
   * to internal methods.
   */

  // TODO: Replace this with ES6: var ReactInstanceMap = new Map();
  var ReactInstanceMap$2 = {
    /**
     * This API should be called `delete` but we'd have to make sure to always
     * transform these to strings for IE support. When this transform is fully
     * supported we can rename it.
     */
    remove: function (key) {
      key._reactInternalInstance = undefined;
    },

    get: function (key) {
      return key._reactInternalInstance;
    },

    has: function (key) {
      return key._reactInternalInstance !== undefined;
    },

    set: function (key, value) {
      key._reactInternalInstance = value;
    },
  };

  var ReactInstanceMap_1 = ReactInstanceMap$2;

  // ReactUpdates.js

  var ReactReconciler$3 = ReactReconciler_1;
  var dirtyComponents = [];


  function mountOrderComparator(c1, c2) {
    return c1._mountOrder - c2._mountOrder;
  }

  var ReactUpdates$2 = {
    batchedUpdates: function (callback, a, b, c, d, e) {
      // 省略 transaction 部分
      // ReactDefaultBatchingStrategy.batchedUpdates(callback, a, b, c, d, e);
      // 直接调
      callback.call(null, a, b, c, d, e);
    },
    enqueueUpdate: function (component) {
      dirtyComponents.push(component);
      // 省略 transaction 的逻辑，直接调用更新
      runBatchedUpdates();
    },
  };

  function runBatchedUpdates(transaction) {
    // 省略 transaction 的逻辑

    dirtyComponents.sort(mountOrderComparator);

    var len = dirtyComponents.length;

    for (var i = 0; i < len; i++) {
      // If a component is unmounted before pending changes apply, it will still
      // be here, but we assume that it has cleared its _pendingCallbacks and
      // that performUpdateIfNecessary is a noop.
      var component = dirtyComponents[i];

      // If performUpdateIfNecessary happens to enqueue any new updates, we
      // shouldn't execute the callbacks until the next render happens, so
      // stash the callbacks first
      // var callbacks = component._pendingCallbacks;
      component._pendingCallbacks = null;

      // var markerName;
      // if (ReactFeatureFlags.logTopLevelRenders) {
      //   var namedComponent = component;
      //   // Duck type TopLevelWrapper. This is probably always true.
      //   if (
      //     component._currentElement.props ===
      //     component._renderedComponent._currentElement
      //   ) {
      //     namedComponent = component._renderedComponent;
      //   }
      //   markerName = "React update: " + namedComponent.getName();
      //   console.time(markerName);
      // }

      ReactReconciler$3.performUpdateIfNecessary(
        component,
        // transaction.reconcileTransaction
      );
    }
  }

  var ReactUpdates_1 = ReactUpdates$2;

  var ReactInstanceMap$1 = ReactInstanceMap_1;
  var ReactUpdates$1 = ReactUpdates_1;

  function enqueueUpdate(internalInstance) {
    ReactUpdates$1.enqueueUpdate(internalInstance);
  }

  // ReactUpdateQueue.js
  /**
   * ReactUpdateQueue allows for state updates to be scheduled into a later
   * reconciliation step.
   */
  var ReactUpdateQueue$1 = {
    enqueueSetState: function (publicInstance, partialState) {
      var internalInstance = ReactInstanceMap$1.get(publicInstance);

      if (!internalInstance) {
        return;
      }

      var queue =
        internalInstance._pendingStateQueue ||
        (internalInstance._pendingStateQueue = []);
      queue.push(partialState);

      enqueueUpdate(internalInstance);
    },
  };

  var ReactUpdateQueue_1 = ReactUpdateQueue$1;

  // 其他辅助类库
  var invariant$3 = function (condition, format, a, b, c, d, e, f) {
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

  var invariant_1 = invariant$3;

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

  var ReactElement$4 = function (type, key, ref, self, source, owner, props) {
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

  ReactElement$4.createElement = function (type, config, children) {
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
    return ReactElement$4(
      type,
      key,
      ref,
      self,
      source,
      ReactCurrentOwner$1.current,
      props
    );
  };

  ReactElement$4.isValidElement = function (object) {
    return (
      typeof object === "object" &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE
    );
  };

  var ReactElement_1 = ReactElement$4;

  var ReactElement$3 = ReactElement_1;


  var ReactNodeTypes$1 = {
    NATIVE: 0,
    COMPOSITE: 1,
    EMPTY: 2,

    getType: function (node) {
      if (node === null || node === false) {
        return ReactNodeTypes$1.EMPTY;
      } else if (ReactElement$3.isValidElement(node)) {
        if (typeof node.type === "function") {
          return ReactNodeTypes$1.COMPOSITE;
        } else {
          return ReactNodeTypes$1.NATIVE;
        }
      }
      invariant(false, "Unexpected node: %s", node);
    },
  };

  var ReactNodeTypes_1 = ReactNodeTypes$1;

  /**
   * Given a `prevElement` and `nextElement`, determines if the existing
   * instance should be updated as opposed to being destroyed or replaced by a new
   * instance. Both arguments are elements. This ensures that this logic can
   * operate on stateless trees without any backing instance.
   *
   * @param {?object} prevElement
   * @param {?object} nextElement
   * @return {boolean} True if the existing instance should be updated.
   * @protected
   */
  function shouldUpdateReactComponent$1(prevElement, nextElement) {
    var prevEmpty = prevElement === null || prevElement === false;
    var nextEmpty = nextElement === null || nextElement === false;
    if (prevEmpty || nextEmpty) {
      return prevEmpty === nextEmpty;
    }

    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === "string" || prevType === "number") {
      return nextType === "string" || nextType === "number";
    } else {
      return (
        nextType === "object" &&
        prevElement.type === nextElement.type &&
        prevElement.key === nextElement.key
      );
    }
  }

  var shouldUpdateReactComponent_1 = shouldUpdateReactComponent$1;

  // ReactCompositeComponent.js
  var emptyObject$1 = emptyObject$2;
  var ReactUpdateQueue = ReactUpdateQueue_1;
  var ReactInstanceMap = ReactInstanceMap_1;
  var invariant$2 = invariant_1;
  var ReactCurrentOwner = ReactCurrentOwner_1;
  var ReactElement$2 = ReactElement_1;
  var ReactNodeTypes = ReactNodeTypes_1;
  var ReactReconciler$2 = ReactReconciler_1;
  var shouldUpdateReactComponent = shouldUpdateReactComponent_1;

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
        return emptyObject$1;
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
          invariant$2(
            inst === null || inst === false || ReactElement$2.isValidElement(inst),
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
      inst.refs = emptyObject$1;
      inst.updater = ReactUpdateQueue;

      this._instance = inst;

      // Store a reference from the instance back to the internal representation
      ReactInstanceMap.set(inst, this);

      var initialState = inst.state;
      if (initialState === undefined) {
        inst.state = initialState = null;
      }
      invariant$2(
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
    receiveComponent: function (nextElement, transaction, nextContext) {
      var prevElement = this._currentElement;
      var prevContext = this._context;

      this._pendingElement = null;

      this.updateComponent(
        transaction,
        prevElement,
        nextElement,
        prevContext,
        nextContext
      );
    },
    /**
     * Perform an update to a mounted component. The componentWillReceiveProps and
     * shouldComponentUpdate methods are called, then (assuming the update isn't
     * skipped) the remaining update lifecycle methods are called and the DOM
     * representation is updated.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @param {ReactElement} prevParentElement
     * @param {ReactElement} nextParentElement
     * @internal
     * @overridable
     */
    updateComponent: function (
      transaction,
      prevParentElement,
      nextParentElement,
      prevUnmaskedContext,
      nextUnmaskedContext
    ) {
      var inst = this._instance;
      var willReceive = false;
      var nextContext;
      var nextProps;

      // Determine if the context has changed or not
      if (this._context === nextUnmaskedContext) {
        nextContext = inst.context;
      } else {
        nextContext = this._processContext(nextUnmaskedContext);
        willReceive = true;
      }

      // Distinguish between a props update versus a simple state update
      if (prevParentElement === nextParentElement) {
        // Skip checking prop types again -- we don't read inst.props to avoid
        // warning for DOM component props in this upgrade
        nextProps = nextParentElement.props;
      } else {
        nextProps = this._processProps(nextParentElement.props);
        willReceive = true;
      }

      // An update here will schedule an update but immediately set
      // _pendingStateQueue which will ensure that any state updates gets
      // immediately reconciled instead of waiting for the next batch.
      if (willReceive && inst.componentWillReceiveProps) {
        inst.componentWillReceiveProps(nextProps, nextContext);
      }

      var nextState = this._processPendingState(nextProps, nextContext);

      var shouldUpdate =
        this._pendingForceUpdate ||
        !inst.shouldComponentUpdate ||
        inst.shouldComponentUpdate(nextProps, nextState, nextContext);

      if (shouldUpdate) {
        this._pendingForceUpdate = false;
        // Will set `this.props`, `this.state` and `this.context`.
        this._performComponentUpdate(
          nextParentElement,
          nextProps,
          nextState,
          nextContext,
          transaction,
          nextUnmaskedContext
        );
      } else {
        // If it's determined that a component should not update, we still want
        // to set props and state but we shortcut the rest of the update.
        this._currentElement = nextParentElement;
        this._context = nextUnmaskedContext;
        inst.props = nextProps;
        inst.state = nextState;
        inst.context = nextContext;
      }
    },
    /**
     * Merges new props and state, notifies delegate methods of update and
     * performs update.
     *
     * @param {ReactElement} nextElement Next element
     * @param {object} nextProps Next public object to set as properties.
     * @param {?object} nextState Next object to set as state.
     * @param {?object} nextContext Next public object to set as context.
     * @param {ReactReconcileTransaction} transaction
     * @param {?object} unmaskedContext
     * @private
     */
    _performComponentUpdate: function (
      nextElement,
      nextProps,
      nextState,
      nextContext,
      transaction,
      unmaskedContext
    ) {
      var inst = this._instance;

      var hasComponentDidUpdate = Boolean(inst.componentDidUpdate);
      if (hasComponentDidUpdate) {
        inst.props;
        inst.state;
        inst.context;
      }

      if (inst.componentWillUpdate) {
        inst.componentWillUpdate(nextProps, nextState, nextContext);
      }

      this._currentElement = nextElement;
      this._context = unmaskedContext;
      inst.props = nextProps;
      inst.state = nextState;
      inst.context = nextContext;

      this._updateRenderedComponent(transaction, unmaskedContext);
    },

    /**
     * Call the component's `render` method and update the DOM accordingly.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    _updateRenderedComponent: function (transaction, context) {
      var prevComponentInstance = this._renderedComponent;
      var prevRenderedElement = prevComponentInstance._currentElement;
      var nextRenderedElement = this._renderValidatedComponent();
      if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
        ReactReconciler$2.receiveComponent(
          prevComponentInstance,
          nextRenderedElement,
          transaction,
          // this._processChildContext(context)
        );
      } else {
        var oldNativeNode = ReactReconciler$2.getNativeNode(prevComponentInstance);
        ReactReconciler$2.unmountComponent(prevComponentInstance, false);

        this._renderedNodeType = ReactNodeTypes.getType(nextRenderedElement);
        this._renderedComponent =
          this._instantiateReactComponent(nextRenderedElement);
        var nextMarkup = ReactReconciler$2.mountComponent(
          this._renderedComponent,
          transaction,
          this._nativeParent,
          this._nativeContainerInfo,
          this._processChildContext(context)
        );
        this._replaceNodeWithMarkup(oldNativeNode, nextMarkup);
      }
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
      invariant$2(
        // TODO: An `isValidNode` function would probably be more appropriate
        renderedComponent === null ||
          renderedComponent === false ||
          ReactElement$2.isValidElement(renderedComponent),
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

      var markup = ReactReconciler$2.mountComponent(
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
    performUpdateIfNecessary: function (transaction) {
      if (this._pendingElement != null) {
        ReactReconciler$2.receiveComponent(
          this,
          this._pendingElement,
          transaction,
          this._context
        );
      }

      if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
        this.updateComponent(
          transaction,
          this._currentElement,
          this._currentElement,
          this._context,
          this._context
        );
      }
    },
    _processPendingState: function (props, context) {
      var inst = this._instance;
      var queue = this._pendingStateQueue;
      var replace = this._pendingReplaceState;
      this._pendingReplaceState = false;
      this._pendingStateQueue = null;

      if (!queue) {
        return inst.state;
      }

      if (replace && queue.length === 1) {
        return queue[0];
      }

      var nextState = Object.assign({}, replace ? queue[0] : inst.state);
      for (var i = replace ? 1 : 0; i < queue.length; i++) {
        var partial = queue[i];
        Object.assign(
          nextState,
          typeof partial === "function"
            ? partial.call(inst, nextState, props, context)
            : partial
        );
      }

      return nextState;
    },
  };
  var ReactCompositeComponent$1 = {
    Mixin: ReactCompositeComponentMixin,
  };

  var ReactCompositeComponent_1 = ReactCompositeComponent$1;

  // instantiateReactComponent.js

  var ReactNativeComponent$1 = ReactNativeComponent_1;
  var ReactCompositeComponent = ReactCompositeComponent_1;

  // To avoid a cyclic dependency, we create the final class in this module
  var ReactCompositeComponentWrapper = function (element) {
    this.construct(element);
  };
  Object.assign(
    ReactCompositeComponentWrapper.prototype,
    ReactCompositeComponent.Mixin,
    {
      _instantiateReactComponent: instantiateReactComponent$2,
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
  function instantiateReactComponent$2(node) {
    var instance;
    if (node === null || node === false) {
      console.warn("省略 null / false 的逻辑");
      // instance = ReactEmptyComponent.create(instantiateReactComponent)
    } else if (typeof node === "object") {
      var element = node;
      if (typeof element.type === "string") {
        instance = ReactNativeComponent$1.createInternalComponent(element);
      } else if (isInternalComponentType(element.type)) {
        instance = new element.type(element);
      } else {
        instance = new ReactCompositeComponentWrapper(element);
      }
    } else if (typeof node === "string" || typeof node === "number") {
      instance = ReactNativeComponent$1.createInstanceForText(node);
    } else {
      invariant(false, "Encountered invalid React node of type %s", typeof node);
    }

    instance._mountIndex = 0;
    instance._mountImage = null;
    return instance;
  }



  var instantiateReactComponent_1 = instantiateReactComponent$2;

  // DOMLazyTree.js

  var enableLazy =
    (typeof document !== "undefined" &&
      typeof document.documentMode === "number") ||
    (typeof navigator !== "undefined" &&
      typeof navigator.userAgent === "string" &&
      /\bEdge\/\d/.test(navigator.userAgent));

  // console.log("enableLazy", enableLazy);

  function DOMLazyTree$3(node) {
    return {
      node: node,
      children: [],
      html: null,
      text: null,
    };
  }

  function queueChild(parentTree, childTree) {
    if (enableLazy) {
      console.log('queueChild enableLazy');
      parentTree.children.push(childTree);
    } else {
      // console.log("parentTree.node", parentTree.node);
      // console.log("childTree.node", childTree.node);
      parentTree.node.appendChild(childTree.node);
    }
  }

  function insertTreeBefore(parentNode, tree, referenceNode) {
    // DocumentFragments aren't actually part of the DOM after insertion so
    // appending children won't update the DOM. We need to ensure the fragment
    // is properly populated first, breaking out of our lazy approach for just
    // this level.
    if (tree.node.nodeType === 11) {
      insertTreeChildren();
      parentNode.insertBefore(tree.node, referenceNode);
    } else {
      parentNode.insertBefore(tree.node, referenceNode);
      insertTreeChildren();
    }
  }

  function insertTreeChildren(tree) {
    if (!enableLazy) {
      return;
    }

    console.log('insertTreeChildren enableLazy', enableLazy);
  }

  function queueText(tree, text) {
    if(enableLazy) {
      tree.text = text;
    }else {
      tree.node.textContent = text;
    }
  }


  DOMLazyTree$3.queueChild = queueChild;
  DOMLazyTree$3.insertTreeBefore = insertTreeBefore;
  DOMLazyTree$3.queueText = queueText;

  var DOMLazyTree_1 = DOMLazyTree$3;

  // ReactMount.js

  var ReactReconciler$1 = ReactReconciler_1;
  var ReactDOMContainerInfo = ReactDOMContainerInfo_1;
  var instantiateReactComponent$1 = instantiateReactComponent_1;
  var ReactElement$1 = ReactElement_1;
  var ReactUpdates = ReactUpdates_1;
  var invariant$1 = invariant_1;
  var emptyObject = emptyObject$2;
  var DOMLazyTree$2 = DOMLazyTree_1;


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
        DOMLazyTree$2.insertTreeBefore(container, markup, null);
      }
    },
    _renderNewRootComponent: function (
      nextElement,
      container,
      shouldReuseMarkup,
      context
    ) {
      var componentInstance = instantiateReactComponent$1(nextElement);

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
        emptyObject
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

  // traverseAllChildren.js
  var SEPARATOR = ".";
  var SUBSEPARATOR = ":";

  var ReactElement = ReactElement_1;

  function traverseAllChildren$1(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }

    return traverseAllChildrenImpl(children, "", callback, traverseContext);
  }

  function traverseAllChildrenImpl(
    children,
    nameSoFar,
    callback,
    traverseContext
  ) {
    var type = typeof children;

    if (type === "undefined" || type === "boolean") {
      children = null;
    }

    if (
      children === null ||
      type === "string" ||
      type === "number" ||
      ReactElement.isValidElement(children)
    ) {
      callback(
        traverseContext,
        children,
        // If it's the only child, treat the name as if it was wrapped in an array
        // so that it's consistent if the number of children grows.
        nameSoFar === "" ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
      );
      return 1;
    }

    var child;
    var nextName;
    var subtreeCount = 0; // Count of children found in the current subtree.
    var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext
        );
      }
    } else {
      var iteratorFn = getIteratorFn(children);
      if (iteratorFn) {
        iteratorFn.call(children);
        // 省略
      }
    }

    return subtreeCount;
  }

  function getComponentKey(component, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (component && typeof component === "object" && component.key != null) ;
    // Implicit key determined by the index in the set
    return index.toString(36);
  }

  var traverseAllChildren_1 = traverseAllChildren$1;

  // ReactChildReconciler.js

  var instantiateReactComponent = instantiateReactComponent_1;
  var traverseAllChildren = traverseAllChildren_1;

  function instantiateChild(childInstances, child, name) {
    // We found a component instance.
    var keyUnique = childInstances[name] === undefined;
    if (child != null && keyUnique) {
      
      childInstances[name] = instantiateReactComponent(child);
    }
  }
  var ReactChildReconciler$1 = {
    instantiateChildren: function (nestedChildNodes, transaction, context) {
      if (nestedChildNodes == null) {
        return null;
      }

      var childInstances = {};
      traverseAllChildren(nestedChildNodes, instantiateChild, childInstances);
      return childInstances;
    },
  };

  var ReactChildReconciler_1 = ReactChildReconciler$1;

  // ReactMultiChild.js
  var ReactChildReconciler = ReactChildReconciler_1;
  var ReactReconciler = ReactReconciler_1;

  var ReactMultiChild$1 = {
    Mixin: {
      _reconcilerUpdateChildren: function (
        prevChildren,
        nextNestedChildrenElements,
        removedNodes,
        transaction,
        context
      ) {
        var nextChildren;

        nextChildren = flattenChildren(nextNestedChildrenElements);
        ReactChildReconciler.updateChildren(
          prevChildren,
          nextChildren,
          removedNodes,
          transaction,
          context
        );
        return nextChildren;
      },
      _reconcilerInstantiateChildren: function (
        nestedChildren,
        transaction,
        context
      ) {
        return ReactChildReconciler.instantiateChildren(
          nestedChildren,
          transaction,
          context
        );
      },
      mountChildren: function (nestedChildren, transaction, context) {
        var children = this._reconcilerInstantiateChildren(
          nestedChildren,
          transaction,
          context
        );
        this._renderedChildren = children;

        var mountImages = [];
        var index = 0;
        for (var name in children) {
          if (children.hasOwnProperty(name)) {
            var child = children[name];
            var mountImage = ReactReconciler.mountComponent(
              child,
              transaction,
              this,
              this._nativeContainerInfo,
              context
            );
            child._mountIndex = index++;
            mountImages.push(mountImage);
          }
        }

        return mountImages;
      },
      updateChildren: function (
        nextNestedChildrenElements,
        transaction,
        context
      ) {
        this._updateChildren(nextNestedChildrenElements, transaction, context);
      },
      _updateChildren: function (
        nextNestedChildrenElements,
        transaction,
        context
      ) {
        var prevChildren = this._renderedChildren;
        var removedNodes = {};
        var nextChildren = this._reconcilerUpdateChildren(
          prevChildren,
          nextNestedChildrenElements,
          removedNodes,
          transaction,
          context
        );
        if (!nextChildren && !prevChildren) {
          return;
        }
        var updates = null;
        var name;
        // `nextIndex` will increment for each child in `nextChildren`, but
        // `lastIndex` will be the last index visited in `prevChildren`.
        var lastIndex = 0;
        var nextIndex = 0;
        var lastPlacedNode = null;
        for (name in nextChildren) {
          if (!nextChildren.hasOwnProperty(name)) {
            continue;
          }
          var prevChild = prevChildren && prevChildren[name];
          var nextChild = nextChildren[name];
          if (prevChild === nextChild) {
            updates = enqueue(
              updates,
              this.moveChild(prevChild, lastPlacedNode, nextIndex, lastIndex)
            );
            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
            prevChild._mountIndex = nextIndex;
          } else {
            if (prevChild) {
              // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
              lastIndex = Math.max(prevChild._mountIndex, lastIndex);
              // The `removedNodes` loop below will actually remove the child.
            }
            // The child must be instantiated before it's mounted.
            updates = enqueue(
              updates,
              this._mountChildAtIndex(
                nextChild,
                lastPlacedNode,
                nextIndex,
                transaction,
                context
              )
            );
          }
          nextIndex++;
          lastPlacedNode = ReactReconciler.getNativeNode(nextChild);
        }
        // Remove children that are no longer present.
        for (name in removedNodes) {
          if (removedNodes.hasOwnProperty(name)) {
            updates = enqueue(
              updates,
              this._unmountChild(prevChildren[name], removedNodes[name])
            );
          }
        }
        if (updates) {
          processQueue(this, updates);
        }
        this._renderedChildren = nextChildren;
      },
    },
  };

  var ReactMultiChild_1 = ReactMultiChild$1;

  // DOMNamespaces.js
  var DOMNamespaces$1 = {
    html: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    svg: "http://www.w3.org/2000/svg",
  };

  var DOMNamespaces_1 = DOMNamespaces$1;

  // ReactDOMComponent.js

  var ReactMultiChild = ReactMultiChild_1;
  var DOMNamespaces = DOMNamespaces_1;
  var DOMLazyTree$1 = DOMLazyTree_1;

  var globalIdCounter = 1;
  var CONTENT_TYPES = { string: true, number: true };
  function ReactDOMComponent$1(element) {
    var tag = element.type;
    // validateDangerousTag(tag);
    this._currentElement = element;
    this._tag = tag.toLowerCase();
    this._namespaceURI = null;
    this._renderedChildren = null;
    this._previousStyle = null;
    this._previousStyleCopy = null;
    this._nativeNode = null;
    this._nativeParent = null;
    this._rootNodeID = null;
    this._domID = null;
    this._nativeContainerInfo = null;
    this._wrapperState = null;
    this._topLevelWrapper = null;
    this._flags = 0;
  }

  ReactDOMComponent$1.displayName = "ReactDOMComponent";
  ReactDOMComponent$1.Mixin = {
    mountComponent: function (
      transaction,
      nativeParent,
      nativeContainerInfo,
      context
    ) {
      // console.log("enter --> ReactDOMComponent.mountComponent");
      this._rootNodeID = globalIdCounter++;
      this._domID = nativeContainerInfo._idCounter++;
      this._nativeParent = nativeParent;
      this._nativeContainerInfo = nativeContainerInfo;

      var props = this._currentElement.props;

      switch (this._tag) {
        // 省略其他情况
        case "object":
          this._wrapperState = {
            listeners: null,
          };
          // transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
          break;
      }

      // assertValidProps(this, props)

      var namespaceURI;
      var parentTag;
      if (nativeParent != null) {
        namespaceURI = nativeParent._namespaceURI;
        parentTag = nativeParent._tag;
      } else if (nativeContainerInfo._tag) {
        namespaceURI = nativeContainerInfo._namespaceURI;
        parentTag = nativeContainerInfo._tag;
      }

      if (
        namespaceURI == null ||
        (namespaceURI === DOMNamespaces.svg && parentTag === "foreignobject")
      ) {
        namespaceURI = DOMNamespaces.html;
      }
      if (namespaceURI === DOMNamespaces.html) {
        if (this._tag === "svg") {
          namespaceURI = DOMNamespaces.svg;
        } else if (this._tag === "math") {
          namespaceURI = DOMNamespaces.mathml;
        }
      }

      this._namespaceURI = namespaceURI;

      var mountImage;
      transaction.useCreateElement = true;
      if (transaction.useCreateElement) {
        var ownerDocument = nativeContainerInfo._ownerDocument;
        var el;
        if (namespaceURI === DOMNamespaces.html) {
          if (this._tag === "script") ; else {
            el = ownerDocument.createElement(this._currentElement.type);
          }
        } else {
          el = ownerDocument.createElementNS(
            namespaceURI,
            this._currentElement.type
          );
        }

        // ReactDOMComponentTree.precacheNode(this, el);
        // this._flags != Flags.hasCachedChildNodes;
        // if (!this._nativeParent) {
        //   DOMPropertyOperations.setAttributeForRoot(el);
        // }
        // this._updateDOMProperties(null, props, transaction);
        var lazyTree = DOMLazyTree$1(el);
        this._createInitialChildren(transaction, props, context, lazyTree);
        mountImage = lazyTree;
      }

      switch (this._tag) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          if (props.autoFocus) ;
          break;
      }

      return mountImage;
    },
    _createInitialChildren: function (transaction, props, context, lazyTree) {
      // Intentional use of != to avoid catching zero/false.
      var innerHTML = props.dangerouslySetInnerHTML;
      if (innerHTML != null) {
        if (innerHTML.__html != null) {
          DOMLazyTree$1.queueHTML(lazyTree, innerHTML.__html);
        }
      } else {
        var contentToUse = CONTENT_TYPES[typeof props.children]
          ? props.children
          : null;

        var childrenToUse = contentToUse != null ? null : props.children;
        if (contentToUse != null) {
          // TODO: Validate that text is allowed as a child of this node
          DOMLazyTree$1.queueText(lazyTree, contentToUse);
        } else if (childrenToUse != null) {
          // console.log("this", this);
          // console.log("this.prototype", this.prototype);
          var mountImages = this.mountChildren(
            childrenToUse,
            transaction,
            context
          );

          for (var i = 0; i < mountImages.length; i++) {
            DOMLazyTree$1.queueChild(lazyTree, mountImages[i]);
          }
        }
      }
    },
    receiveComponent: function (nextElement, transaction, context) {
      var prevElement = this._currentElement;
      this._currentElement = nextElement;
      this.updateComponent(transaction, prevElement, nextElement, context);
    },
    /**
     * Updates a native DOM component after it has already been allocated and
     * attached to the DOM. Reconciles the root DOM node, then recurses.
     *
     * @param {ReactReconcileTransaction} transaction
     * @param {ReactElement} prevElement
     * @param {ReactElement} nextElement
     * @internal
     * @overridable
     */
    updateComponent: function (transaction, prevElement, nextElement, context) {
      var lastProps = prevElement.props;
      var nextProps = this._currentElement.props;

      switch (
        this._tag
        // case "button":
        // lastProps = ReactDOMButton.getNativeProps(this, lastProps);
        // nextProps = ReactDOMButton.getNativeProps(this, nextProps);
        // break;
        // case "input":
        //   ReactDOMInput.updateWrapper(this);
        //   lastProps = ReactDOMInput.getNativeProps(this, lastProps);
        //   nextProps = ReactDOMInput.getNativeProps(this, nextProps);
        //   break;
        // case "option":
        //   lastProps = ReactDOMOption.getNativeProps(this, lastProps);
        //   nextProps = ReactDOMOption.getNativeProps(this, nextProps);
        //   break;
        // case "select":
        //   lastProps = ReactDOMSelect.getNativeProps(this, lastProps);
        //   nextProps = ReactDOMSelect.getNativeProps(this, nextProps);
        //   break;
        // case "textarea":
        //   ReactDOMTextarea.updateWrapper(this);
        //   lastProps = ReactDOMTextarea.getNativeProps(this, lastProps);
        //   nextProps = ReactDOMTextarea.getNativeProps(this, nextProps);
        //   break;
      ) {
      }

      // assertValidProps(this, nextProps);
      // this._updateDOMProperties(lastProps, nextProps, transaction);
      this._updateDOMChildren(lastProps, nextProps, transaction, context);

      if (this._tag === "select") ;
    },
    _updateDOMChildren: function (lastProps, nextProps, transaction, context) {
      var lastContent = CONTENT_TYPES[typeof lastProps.children]
        ? lastProps.children
        : null;
      var nextContent = CONTENT_TYPES[typeof nextProps.children]
        ? nextProps.children
        : null;

      var lastHtml =
        lastProps.dangerouslySetInnerHTML &&
        lastProps.dangerouslySetInnerHTML.__html;
      var nextHtml =
        nextProps.dangerouslySetInnerHTML &&
        nextProps.dangerouslySetInnerHTML.__html;

      // Note the use of `!=` which checks for null or undefined.
      var lastChildren = lastContent != null ? null : lastProps.children;
      var nextChildren = nextContent != null ? null : nextProps.children;

      // If we're switching from children to content/html or vice versa, remove
      // the old content
      var lastHasContentOrHtml = lastContent != null || lastHtml != null;
      var nextHasContentOrHtml = nextContent != null || nextHtml != null;
      if (lastChildren != null && nextChildren == null) {
        this.updateChildren(null, transaction, context);
      } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
        this.updateTextContent("");
      }

      if (nextContent != null) {
        if (lastContent !== nextContent) {
          this.updateTextContent("" + nextContent);
        }
      } else if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          this.updateMarkup("" + nextHtml);
        }
      } else if (nextChildren != null) {
        this.updateChildren(nextChildren, transaction, context);
      }
    },
  };
  Object.assign(
    ReactDOMComponent$1.prototype,
    ReactDOMComponent$1.Mixin,
    ReactMultiChild.Mixin
  );

  var ReactDOMComponent_1 = ReactDOMComponent$1;

  // ReactDOMTextComponent.js
  var DOMLazyTree = DOMLazyTree_1;

  var ReactDOMTextComponent$1 = function (text) {
    // TODO: This is really a ReactText (ReactNode), not a ReactElement
    this._currentElement = text;
    this._stringText = "" + text;

    // ReactDOMComponentTree uses these:
    this._nativeNode = null;
    this._nativeParent = null;

    // Properties
    this._domID = null;
    this._mountIndex = 0;
    this._closingComment = null;
    this._commentNodes = null;
  };

  Object.assign(ReactDOMTextComponent$1.prototype, {
    mountComponent: function (
      transaction,
      nativeParent,
      nativeContainerInfo,
      context
    ) {
      // console.log("enter ---> ReactDOMTextComponent.mountComponent");

      var domID = nativeContainerInfo._idCounter++;
      var openingValue = " react-text: " + domID + " ";
      var closingValue = " /react-text ";
      this._domID = domID;
      this._nativeParent = nativeParent;
      if (transaction.useCreateElement) {
        var ownerDocument = nativeContainerInfo._ownerDocument;
        var openingComment = ownerDocument.createComment(openingValue);
        var closingComment = ownerDocument.createComment(closingValue);
        var lazyTree = DOMLazyTree(ownerDocument.createDocumentFragment());
        DOMLazyTree.queueChild(lazyTree, DOMLazyTree(openingComment));
        if (this._stringText) {
          DOMLazyTree.queueChild(
            lazyTree,
            DOMLazyTree(ownerDocument.createTextNode(this._stringText))
          );
        }
        DOMLazyTree.queueChild(lazyTree, DOMLazyTree(closingComment));
        // ReactDOMComponentTree.precacheNode(this, openingComment);
        this._closingComment = closingComment;
        return lazyTree;
      }
    },
    receiveComponent: function (nextText, transaction) {
      if (nextText !== this._currentElement) {
        this._currentElement = nextText;
        var nextStringText = "" + nextText;
        if (nextStringText !== this._stringText) {
          // TODO: Save this as pending props and use performUpdateIfNecessary
          // and/or updateComponent to do the actual update for consistency with
          // other component types?
          this._stringText = nextStringText;
          var commentNodes = this.getNativeNode();
          DOMChildrenOperations.replaceDelimitedText(
            commentNodes[0],
            commentNodes[1],
            nextStringText
          );
        }
      }
    },
    getNativeNode: function () {
      var nativeNode = this._commentNodes;
      if (nativeNode) {
        return nativeNode;
      }
      if (!this._closingComment) {
        var openingComment = ReactDOMComponentTree.getNodeFromInstance(this);
        var node = openingComment.nextSibling;
        while (true) {
          invariant(
            node != null,
            "Missing closing comment for text component %s",
            this._domID
          );
          if (node.nodeType === 8 && node.nodeValue === " /react-text ") {
            this._closingComment = node;
            break;
          }
          node = node.nextSibling;
        }
      }
      nativeNode = [this._nativeNode, this._closingComment];
      this._commentNodes = nativeNode;
      return nativeNode;
    },
  });

  var ReactDOMTextComponent_1 = ReactDOMTextComponent$1;

  var alreadyInjected = false;

  var ReactNativeComponent = ReactNativeComponent_1;
  var ReactNativeComponentInjection = ReactNativeComponent.injection;
  var ReactDOMComponent = ReactDOMComponent_1;
  var ReactDOMTextComponent = ReactDOMTextComponent_1;

  function inject() {
    if (alreadyInjected) {
      return;
    }

    alreadyInjected = true;
    
    ReactNativeComponentInjection.injectGenericComponentClass(ReactDOMComponent);
    ReactNativeComponentInjection.injectTextComponentClass(ReactDOMTextComponent);
  }

  var ReactDefaultInjection$1 = {
      inject: inject
  };

  // ReactDOM.js

  var ReactMount = ReactMount_1;
  var ReactDefaultInjection = ReactDefaultInjection$1;

  ReactDefaultInjection.inject();

  var ReactDOM = {
    render: ReactMount.render,
  };

  var ReactDOM_1 = ReactDOM;

  return ReactDOM_1;

})));
