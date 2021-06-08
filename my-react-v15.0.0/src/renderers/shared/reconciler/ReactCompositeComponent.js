// ReactCompositeComponent.js
var emptyObject = require("emptyObject");
var ReactUpdateQueue = require("ReactUpdateQueue");
var ReactInstanceMap = require("ReactInstanceMap");
var invariant = require("invariant");
var ReactCurrentOwner = require("ReactCurrentOwner");
var ReactElement = require("ReactElement");
var ReactNodeTypes = require("ReactNodeTypes");
var ReactReconciler = require("ReactReconciler");
var shouldUpdateReactComponent = require('shouldUpdateReactComponent')

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
    var prevProps;
    var prevState;
    var prevContext;
    if (hasComponentDidUpdate) {
      prevProps = inst.props;
      prevState = inst.state;
      prevContext = inst.context;
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

    if (hasComponentDidUpdate) {
      // transaction
      //   .getReactMountReady()
      //   .enqueue(
      //     inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext),
      //     inst
      //   );
    }
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
      ReactReconciler.receiveComponent(
        prevComponentInstance,
        nextRenderedElement,
        transaction,
        // this._processChildContext(context)
      );
    } else {
      var oldNativeNode = ReactReconciler.getNativeNode(prevComponentInstance);
      ReactReconciler.unmountComponent(prevComponentInstance, false);

      this._renderedNodeType = ReactNodeTypes.getType(nextRenderedElement);
      this._renderedComponent =
        this._instantiateReactComponent(nextRenderedElement);
      var nextMarkup = ReactReconciler.mountComponent(
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
  performUpdateIfNecessary: function (transaction) {
    if (this._pendingElement != null) {
      ReactReconciler.receiveComponent(
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
var ReactCompositeComponent = {
  Mixin: ReactCompositeComponentMixin,
};

module.exports = ReactCompositeComponent;
