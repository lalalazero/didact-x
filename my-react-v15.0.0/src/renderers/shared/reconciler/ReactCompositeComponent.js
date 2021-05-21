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
var ReactCompositeComponent = {
  Mixin: ReactCompositeComponentMixin,
};

module.exports = ReactCompositeComponent;
