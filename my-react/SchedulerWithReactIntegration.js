import * as Scheduler from './SchedulerDOM'


// Replacement for runWithPriority in React internals.
export const decoupleUpdatePriorityFromScheduler = false;

// Except for NoPriority, these correspond to Scheduler priorities. We use
// ascending numbers so we can compare them like numbers. They start at 90 to
// avoid clashing with Scheduler's priorities.
export const ImmediatePriority = 99;
export const UserBlockingPriority = 98;
export const NormalPriority = 97;
export const LowPriority = 96;
export const IdlePriority = 95;
// NoPriority is the absence of priority. Also React-only.
export const NoPriority = 90;

const {
  unstable_now: Scheduler_now,
  unstable_runWithPriority: Scheduler_runWithPriority,
  unstable_ImmediatePriority: Scheduler_ImmediatePriority,
  unstable_UserBlockingPriority: Scheduler_UserBlockingPriority,
  unstable_NormalPriority: Scheduler_NormalPriority,
  unstable_LowPriority: Scheduler_LowPriority,
  unstable_IdlePriority: Scheduler_IdlePriority,
  unstable_getCurrentPriorityLevel: Scheduler_getCurrentPriorityLevel,
} = Scheduler;

export function flushSyncCallbackQueue() {
  // if (immediateQueueCallbackNode !== null) {
  //     const node = immediateQueueCallbackNode;
  //     immediateQueueCallbackNode = null;
  //     Scheduler_cancelCallback(node);
  // }

  flushSyncCallbackQueueImpl();
}

let isFlushingSyncQueue = false;
let syncQueue = null;

function flushSyncCallbackQueueImpl() {
  if (!isFlushingSyncQueue && syncQueue !== null) {
    // Prevent re-entrancy.
    isFlushingSyncQueue = true;
    let i = 0;
    if (decoupleUpdatePriorityFromScheduler) {
      // const previousLanePriority = getCurrentUpdateLanePriority()
      // try {
      //     const isSync = true;
      //     const queue = syncQueue
      //     setCurrentUpdateLanePriority(SyncLanePriority);
      //     runWithPriority(ImmediatePriority, () => {
      //         for(; i < queue.length; i++) {
      //             let callback = queue[i];
      //             do {
      //                 callback = callback(isSync)
      //             } while (callback !== null)
      //         }
      //     })
      //     syncQueue = null;
      // } catch (error) {
      //     // ...
      //     // If something throws, leave the remaining callbacks on the queue.
      //     // if (syncQueue !== null) {
      //     //     syncQueue = syncQueue.slice(i + 1);
      //     // }
      //     // // Resume flushing in the next tick
      //     // Scheduler_scheduleCallback(
      //     //     Scheduler_ImmediatePriority,
      //     //     flushSyncCallbackQueue,
      //     // );
      //     // throw error;
      // } finally {
      //     setCurrentUpdateLanePriority(previousLanePriority);
      //     isFlushingSyncQueue = false;
      // }
    } else {
      try {
        const isSync = true;
        const queue = syncQueue;
        runWithPriority(ImmediatePriority, () => {
          for (; i < queue.length; i++) {
            let callback = queue[i];
            do {
              callback = callback(isSync);
            } while (callback !== null);
          }
        });
        syncQueue = null;
      } catch (error) {
        // ...
        // If something throws, leave the remaining callbacks on the queue.
        // if (syncQueue !== null) {
        //     syncQueue = syncQueue.slice(i + 1);
        // }
        // // Resume flushing in the next tick
        // Scheduler_scheduleCallback(
        //     Scheduler_ImmediatePriority,
        //     flushSyncCallbackQueue,
        // );
        // throw error;
      } finally {
        isFlushingSyncQueue = false;
      }
    }
  }
}

export function runWithPriority(reactPriorityLevel, fn) {
  const priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
  return Scheduler_runWithPriority(priorityLevel, fn);
}

function reactPriorityToSchedulerPriority(reactPriorityLevel) {
  switch (reactPriorityLevel) {
    case ImmediatePriority:
      return Scheduler_ImmediatePriority;
    case UserBlockingPriority:
      return Scheduler_UserBlockingPriority;
    case NormalPriority:
      return Scheduler_NormalPriority;
    case LowPriority:
      return Scheduler_LowPriority;
    case IdlePriority:
      return Scheduler_IdlePriority;
    default:
      console.error("Unknown priority level.");
  }
}

export function getCurrentPriorityLevel() {
  switch(Scheduler_getCurrentPriorityLevel()) {
    case Scheduler_ImmediatePriority:
      return ImmediatePriority;
    case Scheduler_UserBlockingPriority:
      return UserBlockingPriority;
    case Scheduler_NormalPriority:
      return NormalPriority;
    case Scheduler_LowPriority:
      return LowPriority;
    case Scheduler_IdlePriority:
      return IdlePriority;
    default:
      console.error('Unknown priority level.');
  }
}

const initialTimeMs = Scheduler_now();

export const now =
  initialTimeMs < 10000 ? Scheduler_now : () => Scheduler_now() - initialTimeMs;
