import { ConcurrentRoot } from "./ReactDOMRoot";
import { HostRoot, IndeterminateComponent, HostComponent } from "./ReactWorkTags";

const NoMode = 0;
const ConcurrentMode = 1;

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
  }


export function createHostRootFiber(tag) {
  let mode;
  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode;
  } else {
    mode = NoMode;
  }
  return createFiber(HostRoot, null, null, NoMode);
}

// 这里写 const xxx = function 是有原因的，见源码
const createFiber = function (tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
};


// This is used to create an alternate fiber to do work on.
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = current.pendingProps;
    workInProgress.type = current.type;

    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
  }

  // Reset all effects except static ones.
  // Static effects are not specific to a render.
  workInProgress.flags = current.flags & StaticMask;
  //   workInProgress.childLanes = current.childLanes;
  workInProgress.lanes = current.lanes;

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  // These will be overridden during the parent's reconciliation
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  return workInProgress;
}

export function createFiberFromElement(element, mode, lanes) {
  let owner = null;
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(
    type,
    key,
    pendingProps,
    owner,
    mode,
    lanes
  );

  return fiber;
}

export function createFiberFromText(content, mode, lanes) {
  const fiber = createFiber(HostText, content, null, mode);
  fiber.lanes = lanes;
  return fiber;
}

export function createFiberFromTypeAndProps(
  type,
  key,
  pendingProps,
  owner,
  mode,
  lanes
) {
  let fiberTag = IndeterminateComponent;
  // The resolved type is set if we know what the final type will be. I.e. it's not lazy.
  let resolvedType = type;
  if (typeof type === "string") {
    fiberTag = HostComponent;
  } else if (typeof type === "function") {
    // ...省略
  } else {
    // ...省略
  }

  const fiber = createFiber(fiberTag, pendingProps, key, mode);
  fiber.elementType = type;
  fiber.type = resolvedType;
  fiber.lanes = lanes;

  return fiber;
}
