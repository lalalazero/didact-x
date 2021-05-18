var emptyObject = {};
// ReactNodeTypes.js
var ReactNodeTypes = {
  NATIVE: 0,
  COMPOSITE: 1,
  EMPTY: 2,

  getType: function (node) {
    if (node === null || node === false) {
      return ReactNodeTypes.EMPTY;
    } else if (ReactElement.isValidElement(node)) {
      if (typeof node.type === "function") {
        return ReactNodeTypes.COMPOSITE;
      } else {
        return ReactNodeTypes.NATIVE;
      }
    }
    invariant(false, "Unexpected node: %s", node);
  },
};
// ReactNoopUpdateQueue.js
var ReactNoopUpdateQueue = {
  // todo
};
// ReactCurrentOwner.js
var ReactCurrentOwner = {
  current: null,
};
// ReactElement.js
var REACT_ELEMENT_TYPE =
  (typeof Symbol === "function" && Symbol.for && Symbol.for("react.element")) ||
  0xeac7;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

var ReactElement = function (type, key, ref, self, source, owner, props) {
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

ReactElement.createElement = function (type, config, children) {
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
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
};

ReactElement.isValidElement = function (object) {
  return (
    typeof object === "object" &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
};
// ReactComponent.js
function ReactComponent(props, context, updater) {
  this.props = props;
  // this.context = context;
  // this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

var ReactClassComponent = function () {};
Object.assign(ReactClassComponent.prototype, ReactComponent.prototype);

// ReactClass.js
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

// React.js
var React = {
  createElement: ReactElement.createElement,
  createClass: ReactClass.createClass,
};

// ReactDOMTextComponent.js
var ReactDOMTextComponent = function (text) {
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

Object.assign(ReactDOMTextComponent.prototype, {
  mountComponent: function (
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    console.log("enter ---> ReactDOMTextComponent.mountComponent");

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
    } else {
    }
  },
  receiveComponent: function () {
    console.log("todo mountComponent..");
  },
});

// DOMNamespaces.js
var DOMNamespaces = {
  html: "http://www.w3.org/1999/xhtml",
  mathml: "http://www.w3.org/1998/Math/MathML",
  svg: "http://www.w3.org/2000/svg",
};

// ReactDOMComponentTree.js
var internalInstanceKey =
  "__reactInternalInstance$" + Math.random().toString(36).slice(2);
/**
 * Drill down (through composites and empty components) until we get a native or
 * native text component.
 *
 * This is pretty polymorphic but unavoidable with the current structure we have
 * for `_renderedChildren`.
 */
function getRenderedNativeOrTextFromComponent(component) {
  var rendered;
  while ((rendered = component._renderedComponent)) {
    component = rendered;
  }

  return component;
}
var ReactDOMComponentTree = {
  precacheNode: function (inst, node) {
    var nativeInst = getRenderedNativeOrTextFromComponent(inst);
    nativeInst._nativeNode = node;
    node[internalInstanceKey] = nativeInst;
  },
};

// DOMLazyTree.js

var enableLazy =
  (typeof document !== "undefined" &&
    typeof document.documentMode === "number") ||
  (typeof navigator !== "undefined" &&
    typeof navigator.userAgent === "string" &&
    /\bEdge\/\d/.test(navigator.userAgent));

console.log("enableLazy", enableLazy);

function DOMLazyTree(node) {
  return {
    node: node,
    children: [],
    html: null,
    text: null,
  };
}

function queueChild(parentTree, childTree) {
  if (enableLazy) {
    parentTree.children.push(childTree);
  } else {
    console.log("parentTree.node", parentTree.node);
    console.log("childTree.node", childTree.node);
    parentTree.node.appendChild(childTree.node);
  }
}

function insertTreeBefore(parentNode, tree, referenceNode) {
  // DocumentFragments aren't actually part of the DOM after insertion so
  // appending children won't update the DOM. We need to ensure the fragment
  // is properly populated first, breaking out of our lazy approach for just
  // this level.
  if (tree.node.nodeType === 11) {
    insertTreeChildren(tree);
    parentNode.insertBefore(tree.node, referenceNode);
  } else {
    parentNode.insertBefore(tree.node, referenceNode);
    insertTreeChildren(tree);
  }
}

function insertTreeChildren(tree) {
  if(!enableLazy) {
    return;
  }
}

DOMLazyTree.queueChild = queueChild;
DOMLazyTree.insertTreeBefore = insertTreeBefore;

// ReactMultiChild.js
var ReactMultiChild = {
  Mixin: {
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
  },
};

// ReactDOMComponent.js
var globalIdCounter = 1;
var CONTENT_TYPES = { string: true, number: true };
function ReactDOMComponent(element) {
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

ReactDOMComponent.displayName = "ReactDOMComponent";
ReactDOMComponent.Mixin = {
  _updateDOMProperties: function (lastProps, nextProps, transaction) {},
  mountComponent: function (
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    console.log("enter --> ReactDOMComponent.mountComponent");
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
      case "button":
        // props = ReactDOMButton.getNativeProps(this, props, nativeParent);
        break;
      default:
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
        if (this._tag === "script") {
        } else {
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
      var lazyTree = DOMLazyTree(el);
      this._createInitialChildren(transaction, props, context, lazyTree);
      mountImage = lazyTree;
    } else {
    }

    switch (this._tag) {
      case "button":
      case "input":
      case "select":
      case "textarea":
        if (props.autoFocus) {
          // transaction.getReactMountReady().enqueue(autoFocusUtils.focusDOMComponent, this)
        }
        break;
    }

    return mountImage;
  },
  receiveComponent: function () {
    console.log("receiveComponent todo..");
  },
  _createInitialChildren: function (transaction, props, context, lazyTree) {
    // Intentional use of != to avoid catching zero/false.
    var innerHTML = props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        DOMLazyTree.queueHTML(lazyTree, innerHTML.__html);
      }
    } else {
      var contentToUse = CONTENT_TYPES[typeof props.children]
        ? props.children
        : null;

      var childrenToUse = contentToUse != null ? null : props.children;
      if (contentToUse != null) {
        // TODO: Validate that text is allowed as a child of this node
        DOMLazyTree.queueText(lazyTree, contentToUse);
      } else if (childrenToUse != null) {
        // console.log("this", this);
        // console.log("this.prototype", this.prototype);
        var mountImages = this.mountChildren(
          childrenToUse,
          transaction,
          context
        );

        for (var i = 0; i < mountImages.length; i++) {
          DOMLazyTree.queueChild(lazyTree, mountImages[i]);
        }
      }
    }
  },
};
Object.assign(
  ReactDOMComponent.prototype,
  ReactDOMComponent.Mixin,
  ReactMultiChild.Mixin
);
// ReactInstanceMap.js
/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 */

// TODO: Replace this with ES6: var ReactInstanceMap = new Map();
var ReactInstanceMap = {
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

// ReactUpdateQueue.js
/**
 * ReactUpdateQueue allows for state updates to be scheduled into a later
 * reconciliation step.
 */
var ReactUpdateQueue = {};

// ================ Reconciler        =================
// ReactChildReconciler.js
function instantiateChild(childInstances, child, name) {
  // We found a component instance.
  var keyUnique = childInstances[name] === undefined;
  if (child != null && keyUnique) {
    childInstances[name] = instantiateReactComponent(child);
  }
}
var ReactChildReconciler = {
  instantiateChildren: function (nestedChildNodes, transaction, context) {
    if (nestedChildNodes == null) {
      return null;
    }

    var childInstances = {};
    traverseAllChildren(nestedChildNodes, instantiateChild, childInstances);
    return childInstances;
  },
};
// ReactReconciler.js
var ReactReconciler = {
  mountComponent: function (
    internalInstance,
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    console.log("enter --> ReactReconciler.mountComponent");
    var markup = internalInstance.mountComponent(
      transaction,
      nativeParent,
      nativeContainerInfo,
      context
    );
    return markup;
  },
};
// ReactUpdates.js
var ReactUpdates = {
  batchedUpdates: function (callback, a, b, c, d, e) {
    // 省略 transaction 部分
    // ReactDefaultBatchingStrategy.batchedUpdates(callback, a, b, c, d, e);
    // 直接调
    callback.call(null, a, b, c, d, e);
  },
};
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
// ReactNativeComponent.js
var genericComponentClass = ReactDOMComponent;
var textComponentClass = ReactDOMTextComponent;
var ReactNativeComponent = {
  createInternalComponent: function (element) {
    return new genericComponentClass(element);
  },
  createInstanceForText: function (text) {
    return new textComponentClass(text);
  },
};
// instantiateReactComponent.js
// To avoid a cyclic dependency, we create the final class in this module
var ReactCompositeComponentWrapper = function (element) {
  this.construct(element);
};
Object.assign(
  ReactCompositeComponentWrapper.prototype,
  ReactCompositeComponent.Mixin,
  {
    _instantiateReactComponent: instantiateReactComponent,
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
function instantiateReactComponent(node) {
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

// ================ ReactDOM renderer =================
// ReactDOMContainerInfo.js
var DOC_NODE_TYPE = 9;
function ReactDOMContainerInfo(topLevelWrapper, node) {
  var info = {
    _topLevelWrapper: topLevelWrapper,
    _idCounter: 1,
    _ownerDocument: node
      ? node.nodeType === DOC_NODE_TYPE
        ? node
        : node.ownerDocument
      : null,
    _tag: node ? node.nodeName.toLowerCase() : null,
    _namespaceURI: node ? node.namespaceURI : null,
  };

  return info;
}
// ReactMount.js
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
  var markup = ReactReconciler.mountComponent(
    wrapperInstance,
    transaction,
    null,
    ReactDOMContainerInfo(wrapperInstance, container),
    context
  );

  wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
  ReactMount._mountImageIntoNode(
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
var ReactMount = {
  _mountImageIntoNode: function (
    markup,
    container,
    instance,
    shouldReuseMarkup,
    transaction
  ) {
    invariant(
      container &&
        (container.nodeType === ELEMENT_NODE_TYPE ||
          container.nodeType === DOC_NODE_TYPE ||
          container.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE),
      "mountComponentIntoNode(...): Target container is not valid."
    );

    if (shouldReuseMarkup) {
      // 省略
    } else {
      // 省略 checksum
    }

    if (transaction.useCreateElement) {
      while (container.lastChild) {
        container.removeChild(container.lastChild);
      }
      DOMLazyTree.insertTreeBefore(container, markup, null);
    } else {
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
    var nextWrapperElement = ReactElement(
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
    var component = ReactMount._renderNewRootComponent(
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
    return ReactMount._renderSubtreeIntoContainer(
      null,
      nextElement,
      container,
      callback
    );
  },
};

// ReactDOM.js
var ReactDOM = {
  render: ReactMount.render,
};

// 其他辅助类库
var invariant = function (condition, format, a, b, c, d, e, f) {
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

// traverseAllChildren.js
var SEPARATOR = ".";
var SUBSEPARATOR = ":";

function traverseAllChildren(children, callback, traverseContext) {
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
      var iterator = iteratorFn.call(children);
      var step;
      // 省略
    } else if (type === "object") {
      var addendum = "";
      // 省略
    }
  }

  return subtreeCount;
}

function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === "object" && component.key != null) {
    // Explicit key
    // 省略
    // return wrapUserProvidedKey(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}
