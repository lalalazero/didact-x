import { initializeUpdateQueue } from './ReactUpdateQueue'
import { createHostRootFiber } from './ReactFiber'

export function createFiberRoot(containerInfo, tag) {
  const root = new FiberRootNode(containerInfo, tag);
  const uninitializedFiber = createHostRootFiber(tag)
  root.current = uninitializedFiber
  uninitializedFiber.stateNode = root;

  const initialState = {
      element: null
  }

  uninitializedFiber.memoizedState = initialState
  initializeUpdateQueue(uninitializedFiber)
  return root
}

function FiberRootNode(containerInfo, tag) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
//   this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
//   this.hydrate = hydrate;
  this.callbackNode = null;
//   this.callbackPriority = NoLanePriority;
//   this.eventTimes = createLaneMap(NoLanes);
//   this.expirationTimes = createLaneMap(NoTimestamp);

//   this.pendingLanes = NoLanes;
//   this.suspendedLanes = NoLanes;
//   this.pingedLanes = NoLanes;
//   this.expiredLanes = NoLanes;
//   this.mutableReadLanes = NoLanes;
//   this.finishedLanes = NoLanes;

//   this.entangledLanes = NoLanes;
//   this.entanglements = createLaneMap(NoLanes);
}
