import { now, flushSyncCallbackQueue, NoPriority as NoSchedulerPriority } from "./SchedulerWithReactIntegration";
import {
  NoTimestamp,
  SyncLane,
  SyncBatchedLane,
  NoLanes,
} from "./ReactFiberLane";
import { BlockingMode, NoMode, ConcurrentMode } from "./ReactFiberRoot";

export const NoContext = /*             */ 0b0000000;
const BatchedContext = /*               */ 0b0000001;
const EventContext = /*                 */ 0b0000010;
const DiscreteEventContext = /*         */ 0b0000100;
const LegacyUnbatchedContext = /*       */ 0b0001000;
const RenderContext = /*                */ 0b0010000;
const CommitContext = /*                */ 0b0100000;
export const RetryAfterError = /*       */ 0b1000000;

// Describes where we are in the React execution stack
let executionContext = NoContext;
// The root we're working on
let workInProgressRoot = null;
// The fiber we're working on
let workInProgress = null;
// The lanes we're rendering
let workInProgressRootRenderLanes = NoLanes;

// Stack that allows components to change the render lanes for its subtree
// This is a superset of the lanes we started working on at the root. The only
// case where it's different from `workInProgressRootRenderLanes` is when we
// enter a subtree that is hidden and needs to be unhidden: Suspense and
// Offscreen component.
//
// Most things in the work loop should deal with workInProgressRootRenderLanes.
// Most things in begin/complete phases should deal with subtreeRenderLanes.
export let subtreeRenderLanes = NoLanes;

// If two updates are scheduled within the same event, we should treat their
// event times as simultaneous, even if the actual clock time has advanced
// between the first and second call.
let currentEventTime = NoTimestamp;
let currentEventWipLanes = NoLanes;
let currentEventPendingLanes = NoLanes;

// "Included" lanes refer to lanes that were worked on during this render. It's
// slightly different than `renderLanes` because `renderLanes` can change as you
// enter and exit an Offscreen tree. This value is the combination of all render
// lanes for the entire render phase.
let workInProgressRootIncludedLanes = NoLanes;
// Lanes that were updated (in an interleaved event) during this render.
let workInProgressRootUpdatedLanes = NoLanes;


let pendingPassiveEffectsRenderPriority = NoSchedulerPriority;

export function unbatchedUpdates(fn, a) {
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
      flushSyncCallbackQueue();
    }
  }
}

// The absolute time for when we should start giving up on rendering
// more and prefer CPU suspense heuristics instead.
let workInProgressRootRenderTargetTime = Infinity;
// How long a render is supposed to take before we start following CPU
// suspense heuristics and opt out of rendering more content.
const RENDER_TIMEOUT_MS = 500;

function resetRenderTimer() {
  workInProgressRootRenderTargetTime = now() + RENDER_TIMEOUT_MS;
}

export function requestEventTime() {
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

export function requestUpdateLane(fiber) {
  // Special cases
  const mode = fiber.mode;
  if ((mode & BlockingMode) === NoMode) {
    return SyncLane;
  } else if ((mode & ConcurrentMode) === NoMode) {
    // return getCurrentPriorityLevel() === ImmediateSchedulerPriority ? SyncLane : SyncBatchedLane;
  } else if (
    !deferRenderPhaseUpdateToNextBatch &&
    (executionContext & RenderContext) !== NoContext &&
    workInProgressRootRenderLanes !== NoLanes
  ) {
    // This is a render phase update. These are not officially supported. The
    // old behavior is to give this the same "thread" (expiration time) as
    // whatever is currently rendering. So if you call `setState` on a component
    // that happens later in the same render, it will flush. Ideally, we want to
    // remove the special case and treat them as if they came from an
    // interleaved event. Regardless, this pattern is not officially supported.
    // This behavior is only a fallback. The flag only exists until we can roll
    // out the setState warning, since existing code might accidentally rely on
    // the current behavior.
    // return pickArbitraryLane(workInProgressRootRenderLanes);
  }

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
    schedulerPriority === UserBlockingSchedulerPriority
  ) {
    lane = findUpdateLane(InputDiscreteLanePriority, currentEventWipLanes);
  } else if (
    decoupleUpdatePriorityFromScheduler &&
    getCurrentUpdateLanePriority() !== NoLanePriority
  ) {
    const currentLanePriority = getCurrentUpdateLanePriority();
    lane = findUpdateLane(currentLanePriority, currentEventWipLanes);
  } else {
    const schedulerLanePriority = schedulerPriorityToLanePriority(
      schedulerPriority
    );

    lane = findUpdateLane(schedulerLanePriority, currentEventWipLanes);
  }

  return lane;
}

export function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  // checkForNestedUpdates()
  // warnAboutRenderPhaseUpdatesInDEV(fiber);

  // const root = markUpdateLaneFromFiberToRoot(fiber, lane);
  // if (root === null) {
  //     warnAboutUpdateOnUnmountedFiberInDEV(fiber);
  //     return null;
  // }

  // Mark that the root has a pending update.
  markRootUpdated(root, lane, eventTime);

  // if (enableProfilerTimer && enableProfilerNestedUpdateScheduledHook) {
  //     // ...
  // }

  if (root === workInProgressRoot) {
    // Received an update to a tree that's in the middle of rendering. Mark
    // that there was an interleaved update work on this root. Unless the
    // `deferRenderPhaseUpdateToNextBatch` flag is off and this is a render
    // phase update. In that case, we don't treat render phase updates as if
    // they were interleaved, for backwards compat reasons.
    if (
      deferRenderPhaseUpdateToNextBatch ||
      (executionContext & RenderContext) === NoContext
    ) {
      workInProgressRootUpdatedLanes = mergeLanes(
        workInProgressRootUpdatedLanes,
        lane
      );
    }

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
    ) {
      // Register pending interactions on the root to avoid losing traced interaction data.
      schedulePendingInteractions(root, lane);

      // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
      // root inside of batchedUpdates should be synchronous, but layout updates
      // should be deferred until the end of the batch.
      performSyncWorkOnRoot(root);
    } else {
      ensureRootIsScheduled(root, eventTime);
      schedulePendingInteractions(root, lane);
      if (executionContext === NoContext) {
        // Flush the synchronous work now, unless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of legacy mode.
        resetRenderTimer();
        flushSyncCallbackQueue();
      }
    }
  } else {
    // Schedule a discrete update but only if it's not Sync.
    if (
      (executionContext & DiscreteEventContext) !== NoContext &&
      // Only updates at user-blocking priority or greater are considered
      // discrete, even inside a discrete event.
      (priorityLevel === UserBlockingSchedulerPriority ||
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
    schedulePendingInteractions(root, lane);
  }

  // We use this when assigning a lane for a transition inside
  // `requestUpdateLane`. We assume it's the same as the root being updated,
  // since in the common case of a single root app it probably is. If it's not
  // the same root, then it's not a huge deal, we just might batch more stuff
  // together more than necessary.
  mostRecentlyUpdatedRoot = root;

  return root;
}

function schedulePendingInteractions(root, lane) {
  // This is called when work is scheduled on a root.
  // It associates the current interactions with the newly-scheduled expiration.
  // They will be restored when that expiration is later committed.
//   if (!enableSchedulerTracing) {
//     return;
//   }

//   scheduleInteractions(root, lane, __interactionsRef.current);
}

// This is the entry point for synchronous tasks that don't go
// through Scheduler
function performSyncWorkOnRoot(root) {
    // if (enableProfilerTimer && enableProfilerNestedUpdatePhase) {
    //     syncNestedUpdateFlag();
    //   }

    flushPassiveEffects();
}

export function flushPassiveEffects() {
    // Returns whether passive effects were flushed.
    if(pendingPassiveEffectsRenderPriority !== NoSchedulerPriority) {
        const priorityLevel = pendingPassiveEffectsRenderPriority > NormalSchedulerPriority ? NormalSchedulerPriority : pendingPassiveEffectsRenderPriority
        pendingPassiveEffectsRenderPriority = NoSchedulerPriority;
        // if ()
    }
}
