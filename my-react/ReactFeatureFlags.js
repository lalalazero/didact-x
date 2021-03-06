// Updates that occur in the render phase are not officially supported. But when
// they do occur, we defer them to a subsequent render by picking a lane that's
// not currently rendering. We treat them the same as if they came from an
// interleaved event. Remove this flag once we have migrated to the
// new behavior.
export const deferRenderPhaseUpdateToNextBatch = true;

// Replacement for runWithPriority in React internals.
export const decoupleUpdatePriorityFromScheduler = false;

// Flight experiments
export const enableLazyElements = false;
export const enableCache = false;

// Gather advanced timing metrics for Profiler subtrees.
export const enableProfilerTimer = false;

// Trace which interactions trigger each commit.
export const enableSchedulerTracing = false;
