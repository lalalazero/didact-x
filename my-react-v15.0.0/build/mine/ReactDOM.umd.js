(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ReactDOM = factory());
}(this, (function () { 'use strict';

  // ReactReconciler.js
  var ReactReconciler$3 = {
    mountComponent: function (
      internalInstance,
      transaction,
      nativeParent,
      nativeContainerInfo,
      context
    ) {
      console.log("enter --> ReactReconciler.mountComponent");
      console.log('当前的 instance', internalInstance);
      console.log('当前的 instance._currentElement.type', internalInstance._currentElement.type);
      console.log('当前的 instance._currentElement', internalInstance._currentElement);
      console.log('--------------------------------------------');
      var markup = internalInstance.mountComponent(
        transaction,
        nativeParent,
        nativeContainerInfo,
        context
      );
      return markup;
    },
  };

  var ReactReconciler_1 = ReactReconciler$3;

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

  // ReactUpdateQueue.js
  /**
   * ReactUpdateQueue allows for state updates to be scheduled into a later
   * reconciliation step.
   */
  var ReactUpdateQueue$1 = {};

  var ReactUpdateQueue_1 = ReactUpdateQueue$1;

  // ReactInstanceMap.js
  /**
   * `ReactInstanceMap` maintains a mapping from a public facing stateful
   * instance (key) and the internal representation (value). This allows public
   * methods to accept the user facing instance as an argument and map them back
   * to internal methods.
   */

  // TODO: Replace this with ES6: var ReactInstanceMap = new Map();
  var ReactInstanceMap$1 = {
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

  var ReactInstanceMap_1 = ReactInstanceMap$1;

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

  // ReactCompositeComponent.js
  var emptyObject$1 = emptyObject$2;
  var ReactUpdateQueue = ReactUpdateQueue_1;
  var ReactInstanceMap = ReactInstanceMap_1;
  var invariant$2 = invariant_1;
  var ReactCurrentOwner = ReactCurrentOwner_1;
  var ReactElement$2 = ReactElement_1;
  var ReactNodeTypes = ReactNodeTypes_1;
  var ReactReconciler$2 = ReactReconciler_1;

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

  DOMLazyTree$3.queueChild = queueChild;
  DOMLazyTree$3.insertTreeBefore = insertTreeBefore;

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
    _updateDOMProperties: function (lastProps, nextProps, transaction) {},
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
    receiveComponent: function () {
      console.log("receiveComponent todo..");
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
    receiveComponent: function () {
      console.log("todo mountComponent..");
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
