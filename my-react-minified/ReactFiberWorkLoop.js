import { SyncLane } from "./ReactFiberLane";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";

export const NoContext = /*             */ 0b000000;
const BatchedContext = /*               */ 0b000001;
const EventContext = /*                 */ 0b000010;
const LegacyUnbatchedContext = /*       */ 0b000100;
const RenderContext = /*                */ 0b001000;
const CommitContext = /*                */ 0b010000;

let executionContext = NoContext;

// 工作的根节点
// The root we're working on
let workInProgressRoot = null;
// 工作的 fiber 节点
// The fiber we're working on
let workInProgress = null;

// Stack that allows components to change the render lanes for its subtree
// This is a superset of the lanes we started working on at the root. The only
// case where it's different from `workInProgressRootRenderLanes` is when we
// enter a subtree that is hidden and needs to be unhidden: Suspense and
// Offscreen component.
//
// Most things in the work loop should deal with workInProgressRootRenderLanes.
// Most things in begin/complete phases should deal with subtreeRenderLanes.
export let subtreeRenderLanes = NoLanes;

export function unbatchedUpdates(fn, a) {
  const prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;
  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
    // if (executionContext === NoContext) {
    //   // Flush the immediate callbacks that were scheduled during this batch
    //   resetRenderTimer();
    //   flushSyncCallbackQueue();
    // }
  }
}

export function scheduleUpdateOnFiber(fiber, lane = SyncLane, eventTime) {
  //   const root = markUpdateLaneFromFiberToRoot(fiber, lane);

  //   markRootUpdated(root, lane, eventTime);
  if (lane === SyncLane) {
    if (
      // Check if we're inside unbatchedUpdates
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      // Check if we're not already rendering
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      performSyncWorkOnRoot(fiber.stateNode);
    }
  }
}

// 不经过调度器，同步任务的起点
// This is the entry point for synchronous tasks that don't go
// through Scheduler
function performSyncWorkOnRoot(root) {
  // flushPassiveEffects();

  let lanes;
  let exitStatus;
  //   if (
  //     root === workInProgressRoot &&
  //     includesSomeLane(root.expiredLanes, workInProgressRootRenderLanes)
  //   ) {
  //     // There's a partial tree, and at least one of its lanes has expired. Finish
  //     // rendering it before rendering the rest of the expired work.
  // lanes = workInProgressRootRenderLanes;
  exitStatus = renderRootSync(root, lanes);
  //   }

  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  // root.finishedLanes = lanes;
  commitRoot(root);

  // ensureRootIsScheduled(root, now());
  return null;
}

function renderRootSync(root, lanes) {
  prepareFreshStack(root, lanes);

  do {
    try {
      workLoopSync();
      break;
    } catch (thrownValue) {
      console.error("thrownValue", thrownValue);
      // handleError(root, thrownValue)
    }
  } while (true);

  if (workInProgress !== null) {
    console.error(
      "error, This is a sync render, so we should have finished the whole tree."
    );
  }

  workInProgressRoot = null;
  // workInProgressRenderLanes = NoLanes
}

function prepareFreshStack(root, lanes) {
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null);
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;

  let next = beginWork(current, unitOfWork, subtreeRenderLanes);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}
