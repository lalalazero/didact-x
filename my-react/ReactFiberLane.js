export const TotalLanes = 31;
export const NoLanes = /*                        */ 0b0000000000000000000000000000000;
export const SyncLane = /*                        */ 0b0000000000000000000000000000001;
export const SyncBatchedLane = /*                */ 0b0000000000000000000000000000010;
export const NoTimestamp = -1;

export const InputDiscreteLanePriority = 12;
export const NoLanePriority = 0;

export function mergeLanes(a, b) {
  return a | b;
}

export function createLaneMap(initial) {
  const laneMap = [];
  for (let i = 0; i < TotalLanes; i++) {
    laneMap.push(initial);
  }

  return laneMap;
}

export function markRootUpdated(root, updateLane, eventTime) {
  root.pendingLanes |= updateLane;

  // TODO: Theoretically, any update to any lane can unblock any other lane. But
  // it's not practical to try every single possible combination. We need a
  // heuristic to decide which lanes to attempt to render, and in which batches.
  // For now, we use the same heuristic as in the old ExpirationTimes model:
  // retry any lane at equal or lower priority, but don't try updates at higher
  // priority without also including the lower priority updates. This works well
  // when considering updates across different priority levels, but isn't
  // sufficient for updates within the same priority, since we want to treat
  // those updates as parallel.

  // Unsuspend any update at equal or lower priority.
  const higherPriorityLanes = updateLane - 1; // Turns 0b1000 into 0b0111

  root.suspendedLanes &= higherPriorityLanes;
  root.pingedLanes &= higherPriorityLanes;

  const eventTimes = root.eventTimes;
  const index = laneToIndex(updateLane);
  // We can always overwrite an existing timestamp because we prefer the most
  // recent event, and we assume time is monotonically increasing.
  eventTimes[index] = eventTime;
}

const clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;

// Count leading zeros. Only used on lanes, so assume input is an integer.
// Based on:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32
const log = Math.log;
const LN2 = Math.LN2;
function clz32Fallback(lanes) {
  if (lanes === 0) {
    return 32;
  }
  return (31 - ((log(lanes) / LN2) | 0)) | 0;
}

function pickArbitraryLaneIndex(lanes) {
  return 31 - clz32(lanes);
}

function laneToIndex(lane) {
  return pickArbitraryLaneIndex(lane);
}

export function includesSomeLane(a, b) {
    return (a & b) !== NoLanes;
  }

export function findUpdateLane(lanePriority, wipLanes) {
  switch (lanePriority) {
    case NoLanePriority:
      break;
    case SyncLanePriority:
      return SyncLane;
    case SyncBatchedLanePriority:
      return SyncBatchedLane;
    case InputDiscreteLanePriority: {
      const lane = pickArbitraryLane(InputDiscreteLanes & ~wipLanes);
      if (lane === NoLane) {
        // Shift to the next priority level
        return findUpdateLane(InputContinuousLanePriority, wipLanes);
      }
      return lane;
    }
    case InputContinuousLanePriority: {
      const lane = pickArbitraryLane(InputContinuousLanes & ~wipLanes);
      if (lane === NoLane) {
        // Shift to the next priority level
        return findUpdateLane(DefaultLanePriority, wipLanes);
      }
      return lane;
    }
    case DefaultLanePriority: {
      let lane = pickArbitraryLane(DefaultLanes & ~wipLanes);
      if (lane === NoLane) {
        // If all the default lanes are already being worked on, look for a
        // lane in the transition range.
        lane = pickArbitraryLane(TransitionLanes & ~wipLanes);
        if (lane === NoLane) {
          // All the transition lanes are taken, too. This should be very
          // rare, but as a last resort, pick a default lane. This will have
          // the effect of interrupting the current work-in-progress render.
          lane = pickArbitraryLane(DefaultLanes);
        }
      }
      return lane;
    }
    case TransitionPriority: // Should be handled by findTransitionLane instead
    case RetryLanePriority: // Should be handled by findRetryLane instead
      break;
    case IdleLanePriority:
      let lane = pickArbitraryLane(IdleLanes & ~wipLanes);
      if (lane === NoLane) {
        lane = pickArbitraryLane(IdleLanes);
      }
      return lane;
    default:
      // The remaining priorities are not valid for updates
      break;
  }
}

export function pickArbitraryLane(lanes) {
  // This wrapper function gets inlined. Only exists so to communicate that it
  // doesn't matter which bit is selected; you can pick any bit without
  // affecting the algorithms where its used. Here I'm using
  // getHighestPriorityLane because it requires the fewest operations.
  return getHighestPriorityLane(lanes);
}

function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}

export function getNextLanes(root, wipLanes) {
    // Early bailout if there's no pending work left.
    const pendingLanes = root.pendingLanes;
    if (pendingLanes === NoLanes) {
      return_highestLanePriority = NoLanePriority;
      return NoLanes;
    }
  
    let nextLanes = NoLanes;
    let nextLanePriority = NoLanePriority;
  
    const expiredLanes = root.expiredLanes;
    const suspendedLanes = root.suspendedLanes;
    const pingedLanes = root.pingedLanes;
  
    // Check if any work has expired.
    if (expiredLanes !== NoLanes) {
      nextLanes = expiredLanes;
      nextLanePriority = return_highestLanePriority = SyncLanePriority;
    } else {
      // Do not work on any idle work until all the non-idle work has finished,
      // even if the work is suspended.
      const nonIdlePendingLanes = pendingLanes & NonIdleLanes;
      if (nonIdlePendingLanes !== NoLanes) {
        const nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes;
        if (nonIdleUnblockedLanes !== NoLanes) {
          nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes);
          nextLanePriority = return_highestLanePriority;
        } else {
          const nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes;
          if (nonIdlePingedLanes !== NoLanes) {
            nextLanes = getHighestPriorityLanes(nonIdlePingedLanes);
            nextLanePriority = return_highestLanePriority;
          }
        }
      } else {
        // The only remaining work is Idle.
        const unblockedLanes = pendingLanes & ~suspendedLanes;
        if (unblockedLanes !== NoLanes) {
          nextLanes = getHighestPriorityLanes(unblockedLanes);
          nextLanePriority = return_highestLanePriority;
        } else {
          if (pingedLanes !== NoLanes) {
            nextLanes = getHighestPriorityLanes(pingedLanes);
            nextLanePriority = return_highestLanePriority;
          }
        }
      }
    }
  
    if (nextLanes === NoLanes) {
      // This should only be reachable if we're suspended
      // TODO: Consider warning in this path if a fallback timer is not scheduled.
      return NoLanes;
    }
  
    // If there are higher priority lanes, we'll include them even if they
    // are suspended.
    nextLanes = pendingLanes & getEqualOrHigherPriorityLanes(nextLanes);
  
    // If we're already in the middle of a render, switching lanes will interrupt
    // it and we'll lose our progress. We should only do this if the new lanes are
    // higher priority.
    if (
      wipLanes !== NoLanes &&
      wipLanes !== nextLanes &&
      // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (wipLanes & suspendedLanes) === NoLanes
    ) {
      getHighestPriorityLanes(wipLanes);
      const wipLanePriority = return_highestLanePriority;
      if (nextLanePriority <= wipLanePriority) {
        return wipLanes;
      } else {
        return_highestLanePriority = nextLanePriority;
      }
    }
  
    // Check for entangled lanes and add them to the batch.
    //
    // A lane is said to be entangled with another when it's not allowed to render
    // in a batch that does not also include the other lane. Typically we do this
    // when multiple updates have the same source, and we only want to respond to
    // the most recent event from that source.
    //
    // Note that we apply entanglements *after* checking for partial work above.
    // This means that if a lane is entangled during an interleaved event while
    // it's already rendering, we won't interrupt it. This is intentional, since
    // entanglement is usually "best effort": we'll try our best to render the
    // lanes in the same batch, but it's not worth throwing out partially
    // completed work in order to do it.
    //
    // For those exceptions where entanglement is semantically important, like
    // useMutableSource, we should ensure that there is no partial work at the
    // time we apply the entanglement.
    const entangledLanes = root.entangledLanes;
    if (entangledLanes !== NoLanes) {
      const entanglements = root.entanglements;
      let lanes = nextLanes & entangledLanes;
      while (lanes > 0) {
        const index = pickArbitraryLaneIndex(lanes);
        const lane = 1 << index;
  
        nextLanes |= entanglements[index];
  
        lanes &= ~lane;
      }
    }
  
    return nextLanes;
  }

  function getHighestPriorityLanes(lanes) {
    if ((SyncLane & lanes) !== NoLanes) {
      return_highestLanePriority = SyncLanePriority;
      return SyncLane;
    }
    if ((SyncBatchedLane & lanes) !== NoLanes) {
      return_highestLanePriority = SyncBatchedLanePriority;
      return SyncBatchedLane;
    }
    if ((InputDiscreteHydrationLane & lanes) !== NoLanes) {
      return_highestLanePriority = InputDiscreteHydrationLanePriority;
      return InputDiscreteHydrationLane;
    }
    const inputDiscreteLanes = InputDiscreteLanes & lanes;
    if (inputDiscreteLanes !== NoLanes) {
      return_highestLanePriority = InputDiscreteLanePriority;
      return inputDiscreteLanes;
    }
    if ((lanes & InputContinuousHydrationLane) !== NoLanes) {
      return_highestLanePriority = InputContinuousHydrationLanePriority;
      return InputContinuousHydrationLane;
    }
    const inputContinuousLanes = InputContinuousLanes & lanes;
    if (inputContinuousLanes !== NoLanes) {
      return_highestLanePriority = InputContinuousLanePriority;
      return inputContinuousLanes;
    }
    if ((lanes & DefaultHydrationLane) !== NoLanes) {
      return_highestLanePriority = DefaultHydrationLanePriority;
      return DefaultHydrationLane;
    }
    const defaultLanes = DefaultLanes & lanes;
    if (defaultLanes !== NoLanes) {
      return_highestLanePriority = DefaultLanePriority;
      return defaultLanes;
    }
    if ((lanes & TransitionHydrationLane) !== NoLanes) {
      return_highestLanePriority = TransitionHydrationPriority;
      return TransitionHydrationLane;
    }
    const transitionLanes = TransitionLanes & lanes;
    if (transitionLanes !== NoLanes) {
      return_highestLanePriority = TransitionPriority;
      return transitionLanes;
    }
    const retryLanes = RetryLanes & lanes;
    if (retryLanes !== NoLanes) {
      return_highestLanePriority = RetryLanePriority;
      return retryLanes;
    }
    if (lanes & SelectiveHydrationLane) {
      return_highestLanePriority = SelectiveHydrationLanePriority;
      return SelectiveHydrationLane;
    }
    if ((lanes & IdleHydrationLane) !== NoLanes) {
      return_highestLanePriority = IdleHydrationLanePriority;
      return IdleHydrationLane;
    }
    const idleLanes = IdleLanes & lanes;
    if (idleLanes !== NoLanes) {
      return_highestLanePriority = IdleLanePriority;
      return idleLanes;
    }
    if ((OffscreenLane & lanes) !== NoLanes) {
      return_highestLanePriority = OffscreenLanePriority;
      return OffscreenLane;
    }
    if (__DEV__) {
      console.error('Should have found matching lanes. This is a bug in React.');
    }
    // This shouldn't be reachable, but as a fallback, return the entire bitmask.
    return_highestLanePriority = DefaultLanePriority;
    return lanes;
  }
