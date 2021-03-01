(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MyReact = {}));
}(this, (function (exports) { 'use strict';

  let REACT_ELEMENT_TYPE = 0xeac7;

  if (typeof Symbol === "function" && Symbol.for) {
    const symbolFor = Symbol.for;
    REACT_ELEMENT_TYPE = symbolFor("react.element");
  }

  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true,
  };
  const ReactElement = function(type, key, ref, self, source, owner, props) {
      const element = {
          // This tag allows us to uniquely identify this as a React Element

          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type: type,
          key: key,
          ref: ref,
          props: props,

          // Record the component responsible for creating this element.
          _owner: owner,
      };

      return element;
  };

  const ReactCurrentOwner = {
      current: null
  };

  function hasValidKey(config) {
      return config.key !== undefined
  }

  function hasValidRef(config) {
      return config.ref !== undefined
  }

  function createElement(type, config, children) {
      let propName;

      // Reserved names are extracted
      const props = {};

      let key = null;
      let ref = null;
      let self = null;
      let source = null;

      if(config != null) {
          if(hasValidRef(config)) {
              ref = config.ref;
          }

          if(hasValidKey(config)) {
              key = '' + config.key;
          }

          self = config.__self === undefined ? null : config.__self;
          source = config.__source === undefined ? null : config.__source;
          // Remaining properties are added to a new props object
          for(propName in config) {
              if(hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                  props[propName] = config[propName];
              }
          }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.

      const childrenLength = arguments.length - 2;
      if(childrenLength === 1) {
          props.children = children;
      }else if(childrenLength > 1) {
          const childArray = Array(childrenLength);

          for(let i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
          }
          props.children = childArray;
      }

      // Resolve default props
      if (type && type.defaultProps) {
          const defaultProps = type.defaultProps;
          for(propName in defaultProps) {
              if(props[propName] === undefined) {
                  props[propName] = defaultProps[propName];
              }
          }
      }

      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current,props)
  }

  // Don't change these two values. They're used by React Dev Tools.
  const NoFlags = /*                      */ 0b00000000000000000000;

  const TotalLanes = 31;
  const NoLanes = 0b0000000000000000000000000000000;
  const NoTimestamp = -1;

  function createLaneMap(initial){
      const laneMap = [];
      for(let i = 0; i < TotalLanes; i++) {
          laneMap.push(initial);
      }

      return laneMap;
  }

  // This is a constructor function, rather than a POJO constructor, still
  // please ensure we do the following:
  // 1) Nobody should add any instance methods on this. Instance methods can be
  //    more difficult to predict when they get optimized and they are almost
  //    never inlined properly in static compilers.
  // 2) Nobody should rely on `instanceof Fiber` for type testing. We should
  //    always know when it is a fiber.
  // 3) We might want to experiment with using numeric keys since they are easier
  //    to optimize in a non-JIT environment.
  // 4) We can easily go from a constructor to a createFiber object literal if that
  //    is faster.
  // 5) It should be easy to port this to a C struct and keep a C implementation
  //    compatible.
  const createFiber = function (tag, pendingProps, key, mode) {
    // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
    return new FiberNode(tag, pendingProps, key, mode);
  };

  function FiberNode(tag, pendingProps, key, mode) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;

    // Fiber
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;

    this.ref = null;

    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
    this.dependencies = null;

    this.mode = mode;

    // Effects
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.deletions = null;

    this.lanes = NoLanes;
    this.childLanes = NoLanes;

    this.alternate = null;

    // ...
  }

  const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
  const HostComponent = 5;

  const LegacyRoot = 0;
  const BlockingRoot = 1;
  const ConcurrentRoot = 2;

  const NoMode = 0b00000;
  const StrictMode = 0b00001;
  // TODO: Remove BlockingMode and ConcurrentMode by reading from the root
  // tag instead
  const BlockingMode = 0b00010;
  const ConcurrentMode = 0b00100;
  // const ProfileMode = 0b01000;
  // const DebugTracingMode = 0b10000;



  function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
    const root = new FiberRootNode(containerInfo, tag, hydrate);

    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    const uninitializedFiber = createHostRootFiber(tag);
    root.current = uninitializedFiber;
    uninitializedFiber.stateNode = root;

    {
      const initialState = {
        element: null,
      };

      uninitializedFiber.memoizedState = initialState;
    }

    initializeUpdateQueue(uninitializedFiber);

    return root;
  }

  function createHostRootFiber(tag) {
    let mode;

    if (tag === ConcurrentRoot) {
      mode = ConcurrentMode | BlockingMode | StrictMode;
    } else if (tag === BlockingRoot) {
      mode = BlockingMode | StrictMode;
    } else {
      mode = NoMode;
    }

    return createFiber(HostRoot, null, null, mode);
  }

  function initializeUpdateQueue(fiber) {
      const queue = {
          baseState: fiber.memoizedState,
          firstBaseUpdate: null,
          lastBaseUpdate: null,
          shared: {
              pending: null
          },
          effects: null,
      };
      fiber.updateQueue = queue;
  }

  function FiberRootNode(containerInfo, tag, hydrate) {
    this.tag = tag;
    this.containerInfo = containerInfo;
    this.pendingChildren = null;
    this.current = null;
    this.pingCache = null;
    this.finishedWork = null;
  //   this.timeoutHandle = noTimeout;
    this.context = null;
    this.pendingContext = null;
    this.hydrate = hydrate;
    this.callbackNode = null;
  //   this.callbackPriority = NoLanePriority;
    this.eventTimes = createLaneMap(NoLanes);
    this.expirationTimes = createLaneMap(NoTimestamp);

    this.pendingLanes = NoLanes;
    this.suspendedLanes = NoLanes;
    this.pingedLanes = NoLanes;
    this.expiredLanes = NoLanes;
    this.mutableReadLanes = NoLanes;
    this.finishedLanes = NoLanes;
    this.entangledLanes = NoLanes;
    this.entanglements = createLaneMap(NoLanes);

    // if (enableCache) {
    //     this.pooledCache = null;
    //     this.pooledCacheLanes = NoLanes;
    // }

    // if (supportsHydration) {
    //     this.mutableSourceEagerHydrationData = null;
    // }

    // if (enableSchedulerTracing) {
    //     this.interactionThreadID = unstable_getThreadID();
    //     this.memoizedInteractions = new Set();
    //     this.pendingInteractionMap = new Map();
    // }
    // if (enableSuspenseCallback) {
    //     this.hydrationCallbacks = null;
    // }
  }

  function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
    return createFiberRoot(containerInfo, tag, hydrate);
  }

  function updateContainer(element, container, parentComponent, callback) {
    console.log('to do update container..');
  }

  function getPublicRootInstance(container) {
    const containerFiber = container.current;
    if (!containerFiber.child) {
      return null;
    }

    switch(containerFiber.child.tag) {
      case HostComponent:
        return getPublicInstance(containerFiber.child.stateNode);
      default:
        return containerFiber.child.stateNode;
    }
  }

  let getCurrentTime;
  const hasPerformanceNow =
    typeof performance === 'object' && typeof performance.now === 'function';

  if (hasPerformanceNow) {
    const localPerformance = performance;
    getCurrentTime = () => localPerformance.now();
  } else {
    const localDate = Date;
    const initialTime = localDate.now();
    getCurrentTime = () => localDate.now() - initialTime;
  }
  const ImmediatePriority = 1;
  const UserBlockingPriority = 2;
  const NormalPriority = 3;
  const LowPriority = 4;
  const IdlePriority = 5;

  function unstable_runWithPriority(priorityLevel, eventHandler) {
      switch (priorityLevel) {
        case ImmediatePriority:
        case UserBlockingPriority:
        case NormalPriority:
        case LowPriority:
        case IdlePriority:
          break;
        default:
          priorityLevel = NormalPriority;
      }
    
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
    
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    }

  var Scheduler = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get unstable_now () { return getCurrentTime; },
    unstable_ImmediatePriority: ImmediatePriority,
    unstable_UserBlockingPriority: UserBlockingPriority,
    unstable_NormalPriority: NormalPriority,
    unstable_IdlePriority: IdlePriority,
    unstable_LowPriority: LowPriority,
    unstable_runWithPriority: unstable_runWithPriority
  });

  const {
    unstable_now: Scheduler_now,
    unstable_runWithPriority: Scheduler_runWithPriority,
    unstable_ImmediatePriority: Scheduler_ImmediatePriority,
    unstable_UserBlockingPriority: Scheduler_UserBlockingPriority,
    unstable_NormalPriority: Scheduler_NormalPriority,
    unstable_LowPriority: Scheduler_LowPriority,
    unstable_IdlePriority: Scheduler_IdlePriority,
  } = Scheduler;

  const initialTimeMs = Scheduler_now();

  const now =
    initialTimeMs < 10000 ? Scheduler_now : () => Scheduler_now() - initialTimeMs;

  const NoContext = /*             */ 0b0000000;
  const BatchedContext = /*               */ 0b0000001;
  const LegacyUnbatchedContext = /*       */ 0b0001000;

  // Describes where we are in the React execution stack
  let executionContext = NoContext;

  function unbatchedUpdates(fn, a) {
      const prevExecutionContext = executionContext;
      executionContext &= ~BatchedContext;
      executionContext |= LegacyUnbatchedContext;

      try {
          return fn(a)
      } finally {
          executionContext = prevExecutionContext; 
          if (executionContext === NoContext) {
              // Flush the immediate callbacks that were scheduled during this batch
              resetRenderTimer();
          }
      }
  }
  // How long a render is supposed to take before we start following CPU
  // suspense heuristics and opt out of rendering more content.
  const RENDER_TIMEOUT_MS = 500;

  function resetRenderTimer() {
      now() + RENDER_TIMEOUT_MS;
  }

  const ELEMENT_NODE = 1;
  const COMMENT_NODE = 8;
  const DOCUMENT_NODE = 9;
  const DOCUMENT_FRAGMENT_NODE = 11;


  function isValidContainer(node) {
    return !!(
      node &&
      (node.nodeType === ELEMENT_NODE ||
        node.nodeType === DOCUMENT_NODE ||
        node.nodeType === DOCUMENT_FRAGMENT_NODE ||
        (node.nodeType === COMMENT_NODE &&
          node.nodeValue === " react-mount-point-unstable "))
    );
  }
  function render(element, container, callback) {
    if (!isValidContainer(container)) {
      console.error("Target container is not a DOM element.");
      return;
    }
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback
    );
  }

  function legacyRenderSubtreeIntoContainer(
    parentComponent,
    children,
    container,
    forceHydrate,
    callback
  ) {
    let root = container._reactRootContainer;
    let fiberRoot;
    if (!root) {
      // Initial mount 初次渲染
      root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
        container);
      fiberRoot = root._internalRoot;

      // if (typeof callback === "function") {
      //   const originalCallback = callback;
      //   const callback = function () {
      //     const instance = getPublicRootInstance(fiberRoot);
      //     originalCallback.call(instance);
      //   };
      // }

      // Initial mount should not be batched.
      unbatchedUpdates(() => {
        updateContainer(children, fiberRoot, parentComponent, callback);
      });
    } else {
      fiberRoot = root._internalRoot;
      // if (typeof callback === "function") {
      //   const originalCallback = callback;
      //   const callback = function () {
      //     const instance = getPublicRootInstance(fiberRoot);
      //     originalCallback.call(instance);
      //   };
      // }

      // Update
      updateContainer();
    }

    return getPublicRootInstance(fiberRoot);
  }

  function getPublicInstance(instance) {
      return instance;
  }

  function legacyCreateRootFromDOMContainer(container, forceHydrate) {
    return createLegacyRoot(container);
  }

  function createLegacyRoot(container, options) {
    return new ReactDOMBlockingRoot(container, LegacyRoot, options);
  }

  function ReactDOMBlockingRoot(container, tag, options) {
    this._internalRoot = createRootImpl(container, tag, options);
  }

  function createRootImpl(container, tag, options) {
      // Tag is either LegacyRoot or Concurrent Root
      const hydrate = options != null && options.hydrate === true;
      (options != null && options.hydrationCallbacks) || null;

      const root = createContainer(container, tag, hydrate);
      markContainerAsRoot(root.current, container);

      const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
      listenToAllSupportedEvents(rootContainerElement);

      return root;
  }

  const randomKey = Math.random()
    .toString(36)
    .slice(2);
  const internalContainerInstanceKey = '__reactContainer$' + randomKey;

  function markContainerAsRoot(hostRoot, node) {
      node[internalContainerInstanceKey] = hostRoot;
  }

  const listeningMarker =
    '_reactListening' +
    Math.random()
      .toString(36)
      .slice(2);

  const allNativeEvents = new Set();

  function listenToAllSupportedEvents(rootContainerElement) {
      if(!(rootContainerElement[listeningMarker])) {
          rootContainerElement[listeningMarker] = true; 
          allNativeEvents.forEach(domEventName => {
              // We handle selectionchange separately because it
              // doesn't bubble and needs to be on the document.
              if(domEventName !== 'selectionchange') {
                  if(!nonDelegatedEvents.has(domEventName)) ;
              }
          });

          const ownerDocument = rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
          if (ownerDocument !== null) {
              // The selectionchange event also needs deduplication
              // but it is attached to the document.
              if (!ownerDocument[listeningMarker]) {
                  ownerDocument[listeningMarker] = true; 
              }
          }
      }
  }

  const React = {
    createElement,
    render,
  };

  exports.createElement = createElement;
  exports.default = React;
  exports.render = render;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
