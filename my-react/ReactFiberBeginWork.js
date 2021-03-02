import { NoFlags } from "./ReactFiberFlags";
import { includesSomeLane } from "./ReactFiberLane";
import { HostComponent, HostRoot } from "./ReactWorkTags";
import { enableCache } from "./ReactFeatureFlags";
import { shouldSetTextContent } from "./ReactDOMHostConfig";
import { ForceUpdateForLegacySuspense } from "./ReactFiberFlags";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";

let didReceiveUpdate = false;

export function beginWork(current, workInProgress, renderLanes) {
  const updateLanes = workInProgress.lanes;

  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps
      // || hasLegacyContextChanged()
      // Force a re-render if the implementation changed due to hot reload:
      // || (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false;
      // This fiber does not have any pending work. Bailout without entering
      // the begin phase. There's still some bookkeeping we that needs to be done
      // in this optimized path, mostly pushing stuff onto the stack.
      // ...省略
      console.log("includeSomeLanes");
    } else {
      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // This is a special case that only exists for legacy mode.
        // See https://github.com/facebook/react/pull/19216.
        didReceiveUpdate = true;
      } else {
        // An update was scheduled on this fiber, but there are no new props
        // nor legacy context. Set this to false. If an update queue or context
        // consumer produces a changed value, it will set this to true. Otherwise,
        // the component will assume the children have not changed and bail out.
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;
  }

  // Before entering the begin phase, clear pending update priority.
  // TODO: This assumes that we're about to evaluate the component and process
  // the update queue. However, there's an exception: SimpleMemoComponent
  // sometimes bails out later in the begin phase. This indicates that we should
  // move this assignment out of the common path and into each branch.
  workInProgress.lanes = NoLanes;

  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
    case HostText:
      return updateHostText(current, workInProgress);
  }
}

function updateHostRoot(current, workInProgress, renderLanes) {
  // pushHostRootContext(workInProgress)
  const updateQueue = workInProgress.updateQueue;

  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState.element;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderLanes);
  const nextState = workInProgress.memoizedState;

  const root = workInProgress.stateNode;

  if (enableCache) {
    // 省略...
  }

  // Caution: React DevTools currently depends on this property
  // being called "element".
  const nextChildren = nextState.element;
  if (nextChildren === prevChildren) {
    //   resetHydrationState()
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  //   if (root.hydrate && enterHydrationState(workInProgress)) {
  // 省略...
  //   }else{
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  //   resetHydrationState()
  //   }

  return workInProgress.child;
}

function updateHostComponent(current, workInProgress, renderLanes) {
  // pushHostContext(workInProgress)

  if (current === null) {
    // tryToClaimNextHydratableInstance(workInProgress)
    console.log("tryToClaimNextHydratableInstance");
  }

  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;

  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also has access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.flags |= ContentReset;
  }

  // markRef(current, workInProgress)
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateHostText(current, workInProgress) {
  if (current === null) {
    // tryToClaimNextHydratableInstance(workInProgress)
    console.log("updateHostText..tryToClaimNextHydratableInstance");
  }

  // Nothing to do here. This is terminal. We'll do the completion step
  // immediately after.
  return null;
}

export function reconcileChildren(
  current,
  workInProgress,
  nextChildren,
  renderLanes
) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}
