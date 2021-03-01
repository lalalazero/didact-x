const { createFiber } = require("./ReactFiber");
const { createLaneMap, NoLanes, NoTimestamp } = require("./ReactFiberLane")

const LegacyRoot = 0;
const BlockingRoot = 1;
const ConcurrentRoot = 2;
const enableSuspenseCallback = false;
const enableCache = false;

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

  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  }

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  if (enableCache) {
    // ...
  } else {
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
    }
    fiber.updateQueue = queue
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



module.exports = {
  createFiberRoot,
  LegacyRoot,
  BlockingRoot,
  ConcurrentRoot,
};
