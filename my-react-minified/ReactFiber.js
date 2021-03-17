import { ConcurrentRoot, } from './ReactDOMRoot'
import { HostRoot } from './ReactWorkTags'

const NoMode = 0
const ConcurrentMode = 1

export function createHostRootFiber(tag) {
    let mode
    if(tag === ConcurrentRoot) {
        mode = ConcurrentMode
    }else{
        mode = NoMode
    }
    return createFiber(HostRoot,null,null,NoMode)
}

// 这里写 const xxx = function 是有原因的，见源码
const createFiber = function(tag, pendingProps, key, mode) {
    return new FiberNode(tag, pendingProps, key, mode)
}

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

// This is used to create an alternate fiber to do work on.
export function createWorkInProgress(current, pendingProps) {
    let workInProgress = current.alternate
    if(workInProgress === null) {
        workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode)
    }
}