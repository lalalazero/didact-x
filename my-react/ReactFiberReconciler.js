import { createFiberRoot } from './ReactFiberRoot'
import { HostComponent } from './ReactWorkTags'
import { getPublicInstance } from './ReactDOMHostConfig'
import { requestEventTime, requestUpdateLane, scheduleUpdateOnFiber } from './ReactFiberWorkLoop'
import { createUpdate, enqueueUpdate } from './ReactUpdateQueue'

export function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}

export function updateContainer(element, container, parentComponent, callback) {
  const current = container.current;
  const eventTime = requestEventTime()

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
    update.callback = callback
  }

  enqueueUpdate(current, update);
  scheduleUpdateOnFiber(current, lane, eventTime);

  return lane;
}

export function getPublicRootInstance(container) {
  const containerFiber = container.current
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
