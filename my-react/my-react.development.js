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
  const NoLanes = /*                        */ 0b0000000000000000000000000000000;
  const SyncLane = /*                        */ 0b0000000000000000000000000000001;
  const SyncBatchedLane = /*                */ 0b0000000000000000000000000000010;
  const NoTimestamp = -1;

  const InputDiscreteLanePriority = 12;

  function mergeLanes(a, b) {
    return a | b;
  }

  function createLaneMap(initial) {
    const laneMap = [];
    for (let i = 0; i < TotalLanes; i++) {
      laneMap.push(initial);
    }

    return laneMap;
  }

  function markRootUpdated(root, updateLane, eventTime) {
    root.pendingLanes != updateLane;

    // TODO: Theoretically, any update to any lane can unblock any other lane. But
    // it's not practical to try every single possible combination. We need a
    // heuristic to decide which lanes to attempt to render, and in which batches.
    // For now, we use the same heuristic as in the old ExpirationTimes model:
    // retry any lane at equal or lower priority, but don't try updates at higher
    // priority without also including the lower priority updates. This works well
    // when considering updates across different priority levels, but isn't
    // sufficient for updates within the same priority, since we want to treat
    // those updates as parallel.

    // Unsuspend any update at equal or lower priority.
    const higherPriorityLanes = updateLane - 1; // Turns 0b1000 into 0b0111

    root.suspendedLanes &= higherPriorityLanes;
    root.pingedLanes &= higherPriorityLanes;

    const eventTimes = root.eventTimes;
    const index = laneToIndex(updateLane);
    // We can always overwrite an existing timestamp because we prefer the most
    // recent event, and we assume time is monotonically increasing.
    eventTimes[index] = eventTime;
  }

  const clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;

  // Count leading zeros. Only used on lanes, so assume input is an integer.
  // Based on:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32
  const log = Math.log;
  const LN2 = Math.LN2;
  function clz32Fallback(lanes) {
    if (lanes === 0) {
      return 32;
    }
    return (31 - ((log(lanes) / LN2) | 0)) | 0;
  }

  function pickArbitraryLaneIndex(lanes) {
    return 31 - clz32(lanes);
  }

  function laneToIndex(lane) {
    return pickArbitraryLaneIndex(lane);
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

  let getCurrentTime;
  const hasPerformanceNow =
    typeof performance === "object" && typeof performance.now === "function";

  if (hasPerformanceNow) {
    const localPerformance = performance;
    getCurrentTime = () => localPerformance.now();
  } else {
    const localDate = Date;
    const initialTime = localDate.now();
    getCurrentTime = () => localDate.now() - initialTime;
  }
  const ImmediatePriority$1 = 1;
  const UserBlockingPriority$1 = 2;
  const NormalPriority$1 = 3;
  const LowPriority$1 = 4;
  const IdlePriority$1 = 5;

  var currentPriorityLevel = NormalPriority$1;

  function unstable_runWithPriority(priorityLevel, eventHandler) {
    switch (priorityLevel) {
      case ImmediatePriority$1:
      case UserBlockingPriority$1:
      case NormalPriority$1:
      case LowPriority$1:
      case IdlePriority$1:
        break;
      default:
        priorityLevel = NormalPriority$1;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_getCurrentPriorityLevel() {
    return currentPriorityLevel;
  }

  var Scheduler = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get unstable_now () { return getCurrentTime; },
    unstable_ImmediatePriority: ImmediatePriority$1,
    unstable_UserBlockingPriority: UserBlockingPriority$1,
    unstable_NormalPriority: NormalPriority$1,
    unstable_IdlePriority: IdlePriority$1,
    unstable_LowPriority: LowPriority$1,
    unstable_runWithPriority: unstable_runWithPriority,
    unstable_getCurrentPriorityLevel: unstable_getCurrentPriorityLevel
  });

  // Except for NoPriority, these correspond to Scheduler priorities. We use
  // ascending numbers so we can compare them like numbers. They start at 90 to
  // avoid clashing with Scheduler's priorities.
  const ImmediatePriority = 99;
  const UserBlockingPriority = 98;
  const NormalPriority = 97;
  const LowPriority = 96;
  const IdlePriority = 95;

  const {
    unstable_now: Scheduler_now,
    unstable_runWithPriority: Scheduler_runWithPriority,
    unstable_ImmediatePriority: Scheduler_ImmediatePriority,
    unstable_UserBlockingPriority: Scheduler_UserBlockingPriority,
    unstable_NormalPriority: Scheduler_NormalPriority,
    unstable_LowPriority: Scheduler_LowPriority,
    unstable_IdlePriority: Scheduler_IdlePriority,
    unstable_getCurrentPriorityLevel: Scheduler_getCurrentPriorityLevel,
  } = Scheduler;

  function getCurrentPriorityLevel() {
    switch(Scheduler_getCurrentPriorityLevel()) {
      case Scheduler_ImmediatePriority:
        return ImmediatePriority;
      case Scheduler_UserBlockingPriority:
        return UserBlockingPriority;
      case Scheduler_NormalPriority:
        return NormalPriority;
      case Scheduler_LowPriority:
        return LowPriority;
      case Scheduler_IdlePriority:
        return IdlePriority;
      default:
        console.error('Unknown priority level.');
    }
  }

  const initialTimeMs = Scheduler_now();

  const now =
    initialTimeMs < 10000 ? Scheduler_now : () => Scheduler_now() - initialTimeMs;

  const NoContext = /*             */ 0b0000000;
  const BatchedContext = /*               */ 0b0000001;
  const DiscreteEventContext = /*         */ 0b0000100;
  const LegacyUnbatchedContext = /*       */ 0b0001000;
  const RenderContext = /*                */ 0b0010000;
  const CommitContext = /*                */ 0b0100000;

  // Describes where we are in the React execution stack
  let executionContext = NoContext;
  // The root we're working on
  let workInProgressRoot = null;
  // The lanes we're rendering
  let workInProgressRootRenderLanes = NoLanes;

  // If two updates are scheduled within the same event, we should treat their
  // event times as simultaneous, even if the actual clock time has advanced
  // between the first and second call.
  let currentEventTime = NoTimestamp;
  let currentEventWipLanes = NoLanes;

  // "Included" lanes refer to lanes that were worked on during this render. It's
  // slightly different than `renderLanes` because `renderLanes` can change as you
  // enter and exit an Offscreen tree. This value is the combination of all render
  // lanes for the entire render phase.
  let workInProgressRootIncludedLanes = NoLanes;

  function unbatchedUpdates(fn, a) {
    const prevExecutionContext = executionContext;
    executionContext &= ~BatchedContext;
    executionContext |= LegacyUnbatchedContext;

    try {
      return fn(a);
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

  function requestEventTime() {
    if (executionContext & ((RenderContext | CommitContext) !== NoContext)) {
      // We're inside React, so it's fine to read the actual time.
      return now();
    }
    // We're not inside React, so we may be in the middle of a browser event.
    if (currentEventTime !== NoTimestamp) {
      // Use the same start time for all updates until we enter React again.
      return currentEventTime;
    }
    // This is the first update since React yielded. Compute a new start time.
    currentEventTime = now();
    return currentEventTime;
  }

  function requestUpdateLane(fiber) {
    // Special cases
    const mode = fiber.mode;
    if ((mode & BlockingMode) === NoMode) {
      return SyncLane;
    } else if ((mode & ConcurrentMode) === NoMode) {
      return getCurrentPriorityLevel() === ImmediateSchedulerPriority ? SyncLane : SyncBatchedLane;
    } else ;

    // The algorithm for assigning an update to a lane should be stable for all
    // updates at the same priority within the same event. To do this, the inputs
    // to the algorithm must be the same. For example, we use the `renderLanes`
    // to avoid choosing a lane that is already in the middle of rendering.
    //
    // However, the "included" lanes could be mutated in between updates in the
    // same event, like if you perform an update inside `flushSync`. Or any other
    // code path that might call `prepareFreshStack`.
    //
    // The trick we use is to cache the first of each of these inputs within an
    // event. Then reset the cached values once we can be sure the event is over.
    // Our heuristic for that is whenever we enter a concurrent work loop.
    //
    // We'll do the same for `currentEventPendingLanes` below.

    if (currentEventWipLanes === NoLanes) {
      currentEventWipLanes = workInProgressRootIncludedLanes;
    }

    // const isTransition = requestCurrentTransition() !== NoTransition;
    // if (isTransition) {
    //     if (currentEventPendingLanes !== NoLanes) {
    //         currentEventPendingLanes = mostRecentlyUpdateRoot !== null ? mostRecentlyUpdateRoot.pendingLanes : NoLanes;
    //     }

    //     return findTransitionLane(currentEventWipLanes, currentEventPendingLanes)
    // }

    // TODO: Remove this dependency on the Scheduler priority.
    // To do that, we're replacing it with an update lane priority.
    const schedulerPriority = getCurrentPriorityLevel();

    // Find the correct lane based on priorities. Ideally, this would just be
    // the update lane priority, but for now we're also checking for discrete
    // updates and falling back to the scheduler priority.
    let lane;
    if (
      // TODO: Temporary. We're removing the concept of discrete updates.
      (executionContext & DiscreteEventContext) !== NoContext &&
      schedulerPriority === UserBlockingPriority
    ) {
      lane = findUpdateLane(InputDiscreteLanePriority, currentEventWipLanes);
    } else {
      const schedulerLanePriority = schedulerPriorityToLanePriority(
        schedulerPriority
      );

      lane = findUpdateLane(schedulerLanePriority, currentEventWipLanes);
    }

    return lane;
  }

  function scheduleUpdateOnFiber(fiber, lane, eventTime) {
    // checkForNestedUpdates()
    // warnAboutRenderPhaseUpdatesInDEV(fiber);

    const root = markUpdateLaneFromFiberToRoot(fiber, lane);
    if (root === null) {
      //   warnAboutUpdateOnUnmountedFiberInDEV(fiber);
        return null;
    }

    // Mark that the root has a pending update.
    markRootUpdated(root, lane, eventTime);

    // if (enableProfilerTimer && enableProfilerNestedUpdateScheduledHook) {
    //     // ...
    // }

    if (root === workInProgressRoot) {

      if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
        // The root already suspended with a delay, which means this render
        // definitely won't finish. Since we have a new update, let's mark it as
        // suspended now, right before marking the incoming update. This has the
        // effect of interrupting the current render and switching to the update.
        // TODO: Make sure this doesn't override pings that happen while we've
        // already started rendering.
        markRootSuspended(root, workInProgressRootRenderLanes);
      }
    }

    // TODO: requestUpdateLanePriority also reads the priority. Pass the
    // priority as an argument to that function and this one.
    const priorityLevel = getCurrentPriorityLevel();

    if (lane === SyncLane) {
      if (
        // Check if we're inside unbatchedUpdates
        (executionContext & LegacyUnbatchedContext) !== NoContext &&
        // Check if we're not already rendering
        (executionContext & (RenderContext | CommitContext)) === NoContext
      ) ; else {
        ensureRootIsScheduled(root, eventTime);
        if (executionContext === NoContext) {
          // Flush the synchronous work now, unless we're already working or inside
          // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
          // scheduleCallbackForFiber to preserve the ability to schedule a callback
          // without immediately flushing it. We only do this for user-initiated
          // updates, to preserve historical behavior of legacy mode.
          resetRenderTimer();
        }
      }
    } else {
      // Schedule a discrete update but only if it's not Sync.
      if (
        (executionContext & DiscreteEventContext) !== NoContext &&
        // Only updates at user-blocking priority or greater are considered
        // discrete, even inside a discrete event.
        (priorityLevel === UserBlockingPriority ||
          priorityLevel === ImmediateSchedulerPriority)
      ) {
        // This is the result of a discrete event. Track the lowest priority
        // discrete update per root so we can flush them early, if needed.
        if (rootsWithPendingDiscreteUpdates === null) {
          rootsWithPendingDiscreteUpdates = new Set([root]);
        } else {
          rootsWithPendingDiscreteUpdates.add(root);
        }
      }
      // Schedule other updates after in case the callback is sync.
      ensureRootIsScheduled(root, eventTime);
    }

    return root;
  }

  // This is split into a separate function so we can mark a fiber with pending
  // work without treating it as a typical update that originates from an event;
  // e.g. retrying a Suspense boundary isn't an update, but it does schedule work
  // on a fiber.
  function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
      // Update the source fiber's lanes
      sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
      let alternate = sourceFiber.alternate;
      if (alternate !== null) {
          alternate.lanes = mergeLanes(alternate.lanes, lane);
      }

      // Walk the parent path to the root and update the child expiration time.
      let node= sourceFiber;
      let parent = sourceFiber.return;
      while (parent !== null) {
          parent.childLanes = mergeLanes(parent.childLanes, lane);
          alternate = parent.alternate;
          if (alternate !== null) {
              alternate.childLanes = mergeLanes(alternate.childLanes, lane);
          }

          node = parent;
          parent = parent.return;
      }

      if (node.tag === HostRoot) {
          const root = node.stateNode;
          return root;
      } else {
          return null;
      }
  }

  function createUpdate(eventTime, lane) {
      const update = {
          eventTime,
          lane,

          tag: UpdateState,
          payload: null,
          callback: null,

          next: null,
      };

      return update;
  }

  function enqueueUpdate(fiber, update) {
      const updateQueue = fiber.updateQueue;
      if (updateQueue === null) {
          // Only occurs if the fiber has been unmounted.
          return;
      }

      const sharedQueue = updateQueue.shared;
      const pending = sharedQueue.pending;
      if (pending === null) {
          // This is the first update. Create a circular list.
          update.next = update;
      } else {
          update.next = pending.next;
          pending.next = update;
      }

      sharedQueue.pending = update;
  }

  const UpdateState = 0;

  function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
    return createFiberRoot(containerInfo, tag, hydrate);
  }

  function updateContainer(element, container, parentComponent, callback) {
    const current = container.current;
    const eventTime = requestEventTime();

    const lane = requestUpdateLane(current);

    // if(enableSchedulingProfiler) {
    //   markRenderScheduled(lane);
    // }

    // const context = getContextForSubtree(parentComponent)
    // if (container.context === null) {
    //   container.context = context;
    // } else {
    //   container.pendingContext = context;
    // }

    const update = createUpdate(eventTime, lane);
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = {element};

    callback = callback === undefined ? null : callback;
    if (callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(current, update);
    scheduleUpdateOnFiber(current, lane, eventTime);

    return lane;
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
      updateContainer(children, fiberRoot, parentComponent, callback);
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
