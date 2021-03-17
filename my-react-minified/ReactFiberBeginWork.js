import { HostRoot } from "./ReactWorkTags";
import { cloneUpdateQueue, processUpdateQueue } from "./ReactUpdateQueue";
import { shouldSetTextContent } from "./ReactDOMHostConfig";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";

export function beginWork(current, workInProgress, renderLanes) {
  let updateLanes = workInProgress.lanes;

  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingprops;

    // ....更新 didReceiveUpdate
  }

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
  const updateQueue = workInProgress.updateQueue;

  const nextProps = workInProgress.pendingprops;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState.element;

  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderLanes);

  const nextState = workInProgress.memoizedState;
  const root = workInProgress.stateNode;

  const nextChildren = nextState.element;
  if (nextChildren === prevChildren) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  reconcileChildren(current, workInProgress, nextChildren, renderLanes);

  return workInProgress.child;
}

function updateHostComponent(current, workInProgress, renderLanes) {
  const type = workInProgress.type;
  const nextProps = workInProgress.pendingprops;
  const prevProps = current !== null ? current.memoizedProps : null;

  let nextChildren = nextProps.nextChildren;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    workInProgress.flags |= ContentReset;
  }

  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateHostText() {
  return null;
}

export function reconcileChildren(
  current,
  workInProgress,
  nextChildren,
  renderLanes
) {
  if (current === null) {
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}
