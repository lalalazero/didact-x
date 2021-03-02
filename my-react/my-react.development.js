(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MyReact = {}));
}(this, (function (exports) { 'use strict';

  // ATTENTION
  // When adding new symbols to this file,
  // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'

  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  let REACT_ELEMENT_TYPE = 0xeac7;
  let REACT_PORTAL_TYPE = 0xeaca;
  let REACT_FRAGMENT_TYPE = 0xeacb;
  let REACT_STRICT_MODE_TYPE$1 = 0xeacc;
  let REACT_PROFILER_TYPE$1 = 0xead2;
  let REACT_PROVIDER_TYPE$1 = 0xeacd;
  let REACT_CONTEXT_TYPE$1 = 0xeace;
  let REACT_FORWARD_REF_TYPE$1 = 0xead0;
  let REACT_SUSPENSE_TYPE$1 = 0xead1;
  let REACT_SUSPENSE_LIST_TYPE$1 = 0xead8;
  let REACT_MEMO_TYPE$1 = 0xead3;
  let REACT_LAZY_TYPE = 0xead4;
  let REACT_FUNDAMENTAL_TYPE = 0xead5;
  let REACT_SCOPE_TYPE = 0xead7;
  let REACT_OPAQUE_ID_TYPE = 0xeae0;
  let REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
  let REACT_OFFSCREEN_TYPE = 0xeae2;
  let REACT_LEGACY_HIDDEN_TYPE = 0xeae3;
  let REACT_CACHE_TYPE$1 = 0xeae4;

  if (typeof Symbol === 'function' && Symbol.for) {
    const symbolFor = Symbol.for;
    REACT_ELEMENT_TYPE = symbolFor('react.element');
    REACT_PORTAL_TYPE = symbolFor('react.portal');
    REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
    REACT_STRICT_MODE_TYPE$1 = symbolFor('react.strict_mode');
    REACT_PROFILER_TYPE$1 = symbolFor('react.profiler');
    REACT_PROVIDER_TYPE$1 = symbolFor('react.provider');
    REACT_CONTEXT_TYPE$1 = symbolFor('react.context');
    REACT_FORWARD_REF_TYPE$1 = symbolFor('react.forward_ref');
    REACT_SUSPENSE_TYPE$1 = symbolFor('react.suspense');
    REACT_SUSPENSE_LIST_TYPE$1 = symbolFor('react.suspense_list');
    REACT_MEMO_TYPE$1 = symbolFor('react.memo');
    REACT_LAZY_TYPE = symbolFor('react.lazy');
    REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
    REACT_SCOPE_TYPE = symbolFor('react.scope');
    REACT_OPAQUE_ID_TYPE = symbolFor('react.opaque.id');
    REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
    REACT_OFFSCREEN_TYPE = symbolFor('react.offscreen');
    REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
    REACT_CACHE_TYPE$1 = symbolFor('react.cache');
  }

  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true,
  };
  const ReactElement = function(type, key, ref, self, source, owner, props) {
      const element = {
          // This tag allows us to uniquely identify this as a React Element

          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type: type,
          key: key,
          ref: ref,
          props: props,

          // Record the component responsible for creating this element.
          _owner: owner,
      };

      return element;
  };


  function hasValidKey(config) {
      return config.key !== undefined
  }

  function hasValidRef(config) {
      return config.ref !== undefined
  }

  function createElement(type, config, children) {
      let propName;

      // Reserved names are extracted
      const props = {};

      let key = null;
      let ref = null;
      let self = null;
      let source = null;

      if(config != null) {
          if(hasValidRef(config)) {
              ref = config.ref;
          }

          if(hasValidKey(config)) {
              key = '' + config.key;
          }

          self = config.__self === undefined ? null : config.__self;
          source = config.__source === undefined ? null : config.__source;
          // Remaining properties are added to a new props object
          for(propName in config) {
              if(hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                  props[propName] = config[propName];
              }
          }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.

      const childrenLength = arguments.length - 2;
      if(childrenLength === 1) {
          props.children = children;
      }else if(childrenLength > 1) {
          const childArray = Array(childrenLength);

          for(let i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
          }
          props.children = childArray;
      }

      // Resolve default props
      if (type && type.defaultProps) {
          const defaultProps = type.defaultProps;
          for(propName in defaultProps) {
              if(props[propName] === undefined) {
                  props[propName] = defaultProps[propName];
              }
          }
      }

      return ReactElement(type, key, ref, self, source, ReactCurrentOwner$1.current,props)
  }

  const ReactCurrentOwner$1 = {
      current: null
  };

  const ReactSharedInternals = {
      ReactCurrentOwner: ReactCurrentOwner$1
  };

  // Don't change these two values. They're used by React Dev Tools.
  const NoFlags = /*                      */ 0b00000000000000000000;
  const PerformedWork = /*                */ 0b00000000000000000001;

  // You can change the rest (and add more).
  const Placement$1 = /*                    */ 0b00000000000000000010;
  const Update = /*                       */ 0b00000000000000000100;
  const PlacementAndUpdate = /*           */ Placement$1 | Update;
  const Deletion = /*                     */ 0b00000000000000001000;
  const ChildDeletion = /*                */ 0b00000000000000010000;
  const ContentReset$1 = /*                 */ 0b00000000000000100000;
  const Callback = /*                     */ 0b00000000000001000000;
  const DidCapture = /*                   */ 0b00000000000010000000;
  const Ref = /*                          */ 0b00000000000100000000;
  const Snapshot = /*                     */ 0b00000000001000000000;
  const Passive = /*                      */ 0b00000000010000000000;
  const Hydrating = /*                    */ 0b00000000100000000000;
  const HydratingAndUpdate = /*           */ Hydrating | Update;
  const Visibility = /*                   */ 0b00000001000000000000;

  // Static tags describe aspects of a fiber that are not specific to a render,
  // e.g. a fiber uses a passive effect (even if there are no updates on this particular render).
  // This enables us to defer more work in the unmount case,
  // since we can defer traversing the tree during layout to look for Passive effects,
  // and instead rely on the static flag as a signal that there may be cleanup work.
  const PassiveStatic = /*                */ 0b00100000000000000000;

  // Union of tags that don't get reset on clones.
  // This allows certain concepts to persist without recalculting them,
  // e.g. whether a subtree contains passive effects or portals.
  const StaticMask = PassiveStatic;

  // TODO (effects) Remove this bit once the new reconciler is synced to the old.
  const PassiveUnmountPendingDev = /*     */ 0b00001000000000000000;
  const ForceUpdateForLegacySuspense = /* */ 0b00010000000000000000;

  const SyncLanePriority = 15;
  const SyncBatchedLanePriority = 14;

  const InputDiscreteHydrationLanePriority = 13;
  const InputDiscreteLanePriority = 12;

  const InputContinuousHydrationLanePriority = 11;
  const InputContinuousLanePriority = 10;

  const DefaultHydrationLanePriority = 9;
  const DefaultLanePriority = 8;

  const TransitionHydrationPriority = 7;
  const TransitionPriority = 6;

  const RetryLanePriority = 5;

  const SelectiveHydrationLanePriority = 4;

  const IdleHydrationLanePriority = 3;
  const IdleLanePriority = 2;

  const OffscreenLanePriority = 1;

  const NoLanePriority = 0;


  const TotalLanes = 31;
  const NoLanes$1 = /*                        */ 0b0000000000000000000000000000000;
  const SyncLane = /*                        */ 0b0000000000000000000000000000001;
  const SyncBatchedLane = /*                */ 0b0000000000000000000000000000010;
  const NoTimestamp = -1;
  const NonIdleLanes = /*                                 */ 0b0000111111111111111111111111111;


  function mergeLanes(a, b) {
    return a | b;
  }

  function createLaneMap(initial) {
    const laneMap = [];
    for (let i = 0; i < TotalLanes; i++) {
      laneMap.push(initial);
    }

    return laneMap;
  }

  function markRootUpdated(root, updateLane, eventTime) {
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

  function includesSomeLane(a, b) {
      return (a & b) !== NoLanes$1;
    }

  function findUpdateLane$1(lanePriority, wipLanes) {
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
          return findUpdateLane$1(InputContinuousLanePriority, wipLanes);
        }
        return lane;
      }
      case InputContinuousLanePriority: {
        const lane = pickArbitraryLane(InputContinuousLanes & ~wipLanes);
        if (lane === NoLane) {
          // Shift to the next priority level
          return findUpdateLane$1(DefaultLanePriority, wipLanes);
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

  function pickArbitraryLane(lanes) {
    // This wrapper function gets inlined. Only exists so to communicate that it
    // doesn't matter which bit is selected; you can pick any bit without
    // affecting the algorithms where its used. Here I'm using
    // getHighestPriorityLane because it requires the fewest operations.
    return getHighestPriorityLane(lanes);
  }

  function getHighestPriorityLane(lanes) {
    return lanes & -lanes;
  }

  function getLowestPriorityLane(lanes) {
      // This finds the most significant non-zero bit.
      const index = 31 - clz32(lanes);
      return index < 0 ? NoLanes$1 : 1 << index;
    }
    
    function getEqualOrHigherPriorityLanes(lanes) {
      return (getLowestPriorityLane(lanes) << 1) - 1;
    }

  // "Registers" used to "return" multiple values
  // Used by getHighestPriorityLanes and getNextLanes:
  let return_highestLanePriority = DefaultLanePriority;

  function getNextLanes(root, wipLanes) {
      // Early bailout if there's no pending work left.
      const pendingLanes = root.pendingLanes;
      if (pendingLanes === NoLanes$1) {
        return_highestLanePriority = NoLanePriority;
        return NoLanes$1;
      }
    
      let nextLanes = NoLanes$1;
      let nextLanePriority = NoLanePriority;
    
      const expiredLanes = root.expiredLanes;
      const suspendedLanes = root.suspendedLanes;
      const pingedLanes = root.pingedLanes;
    
      // Check if any work has expired.
      if (expiredLanes !== NoLanes$1) {
        nextLanes = expiredLanes;
        nextLanePriority = return_highestLanePriority = SyncLanePriority;
      } else {
        // Do not work on any idle work until all the non-idle work has finished,
        // even if the work is suspended.
        const nonIdlePendingLanes = pendingLanes & NonIdleLanes;
        if (nonIdlePendingLanes !== NoLanes$1) {
          const nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes;
          if (nonIdleUnblockedLanes !== NoLanes$1) {
            nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes);
            nextLanePriority = return_highestLanePriority;
          } else {
            const nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes;
            if (nonIdlePingedLanes !== NoLanes$1) {
              nextLanes = getHighestPriorityLanes(nonIdlePingedLanes);
              nextLanePriority = return_highestLanePriority;
            }
          }
        } else {
          // The only remaining work is Idle.
          const unblockedLanes = pendingLanes & ~suspendedLanes;
          if (unblockedLanes !== NoLanes$1) {
            nextLanes = getHighestPriorityLanes(unblockedLanes);
            nextLanePriority = return_highestLanePriority;
          } else {
            if (pingedLanes !== NoLanes$1) {
              nextLanes = getHighestPriorityLanes(pingedLanes);
              nextLanePriority = return_highestLanePriority;
            }
          }
        }
      }
    
      if (nextLanes === NoLanes$1) {
        // This should only be reachable if we're suspended
        // TODO: Consider warning in this path if a fallback timer is not scheduled.
        return NoLanes$1;
      }
    
      // If there are higher priority lanes, we'll include them even if they
      // are suspended.
      nextLanes = pendingLanes & getEqualOrHigherPriorityLanes(nextLanes);
    
      // If we're already in the middle of a render, switching lanes will interrupt
      // it and we'll lose our progress. We should only do this if the new lanes are
      // higher priority.
      if (
        wipLanes !== NoLanes$1 &&
        wipLanes !== nextLanes &&
        // If we already suspended with a delay, then interrupting is fine. Don't
        // bother waiting until the root is complete.
        (wipLanes & suspendedLanes) === NoLanes$1
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
      if (entangledLanes !== NoLanes$1) {
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
      if ((SyncLane & lanes) !== NoLanes$1) {
        return_highestLanePriority = SyncLanePriority;
        return SyncLane;
      }
      if ((SyncBatchedLane & lanes) !== NoLanes$1) {
        return_highestLanePriority = SyncBatchedLanePriority;
        return SyncBatchedLane;
      }
      if ((InputDiscreteHydrationLane & lanes) !== NoLanes$1) {
        return_highestLanePriority = InputDiscreteHydrationLanePriority;
        return InputDiscreteHydrationLane;
      }
      const inputDiscreteLanes = InputDiscreteLanes & lanes;
      if (inputDiscreteLanes !== NoLanes$1) {
        return_highestLanePriority = InputDiscreteLanePriority;
        return inputDiscreteLanes;
      }
      if ((lanes & InputContinuousHydrationLane) !== NoLanes$1) {
        return_highestLanePriority = InputContinuousHydrationLanePriority;
        return InputContinuousHydrationLane;
      }
      const inputContinuousLanes = InputContinuousLanes & lanes;
      if (inputContinuousLanes !== NoLanes$1) {
        return_highestLanePriority = InputContinuousLanePriority;
        return inputContinuousLanes;
      }
      if ((lanes & DefaultHydrationLane) !== NoLanes$1) {
        return_highestLanePriority = DefaultHydrationLanePriority;
        return DefaultHydrationLane;
      }
      const defaultLanes = DefaultLanes & lanes;
      if (defaultLanes !== NoLanes$1) {
        return_highestLanePriority = DefaultLanePriority;
        return defaultLanes;
      }
      if ((lanes & TransitionHydrationLane) !== NoLanes$1) {
        return_highestLanePriority = TransitionHydrationPriority;
        return TransitionHydrationLane;
      }
      const transitionLanes = TransitionLanes & lanes;
      if (transitionLanes !== NoLanes$1) {
        return_highestLanePriority = TransitionPriority;
        return transitionLanes;
      }
      const retryLanes = RetryLanes & lanes;
      if (retryLanes !== NoLanes$1) {
        return_highestLanePriority = RetryLanePriority;
        return retryLanes;
      }
      if (lanes & SelectiveHydrationLane) {
        return_highestLanePriority = SelectiveHydrationLanePriority;
        return SelectiveHydrationLane;
      }
      if ((lanes & IdleHydrationLane) !== NoLanes$1) {
        return_highestLanePriority = IdleHydrationLanePriority;
        return IdleHydrationLane;
      }
      const idleLanes = IdleLanes & lanes;
      if (idleLanes !== NoLanes$1) {
        return_highestLanePriority = IdleLanePriority;
        return idleLanes;
      }
      if ((OffscreenLane & lanes) !== NoLanes$1) {
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

  // Updates that occur in the render phase are not officially supported. But when
  // they do occur, we defer them to a subsequent render by picking a lane that's
  // not currently rendering. We treat them the same as if they came from an
  // interleaved event. Remove this flag once we have migrated to the
  // new behavior.
  const deferRenderPhaseUpdateToNextBatch = true;

  // Replacement for runWithPriority in React internals.
  const decoupleUpdatePriorityFromScheduler$1 = false;

  // Flight experiments
  const enableLazyElements = false;
  const enableCache$1 = false;

  // Gather advanced timing metrics for Profiler subtrees.
  const enableProfilerTimer = false;

  // Trace which interactions trigger each commit.
  const enableSchedulerTracing = false;

  const FunctionComponent = 0;
  const ClassComponent = 1;
  const IndeterminateComponent = 2; // Before we know whether it is function or class
  const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
  const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
  const HostComponent = 5;
  const HostText$1 = 6;
  const Fragment = 7;
  const Mode = 8;
  const ContextConsumer = 9;
  const ContextProvider = 10;
  const ForwardRef = 11;
  const Profiler = 12;
  const SuspenseComponent = 13;
  const MemoComponent = 14;
  const SimpleMemoComponent = 15;
  const LazyComponent = 16;
  const IncompleteClassComponent = 17;
  const DehydratedFragment = 18;
  const SuspenseListComponent = 19;
  const FundamentalComponent = 20;
  const ScopeComponent = 21;
  const OffscreenComponent = 22;
  const LegacyHiddenComponent = 23;
  const CacheComponent = 24;

  // This is a constructor function, rather than a POJO constructor, still
  // please ensure we do the following:
  // 1) Nobody should add any instance methods on this. Instance methods can be
  //    more difficult to predict when they get optimized and they are almost
  //    never inlined properly in static compilers.
  // 2) Nobody should rely on `instanceof Fiber` for type testing. We should
  //    always know when it is a fiber.
  // 3) We might want to experiment with using numeric keys since they are easier
  //    to optimize in a non-JIT environment.
  // 4) We can easily go from a constructor to a createFiber object literal if that
  //    is faster.
  // 5) It should be easy to port this to a C struct and keep a C implementation
  //    compatible.
  const createFiber = function (tag, pendingProps, key, mode) {
    // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
    return new FiberNode(tag, pendingProps, key, mode);
  };

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

    this.lanes = NoLanes$1;
    this.childLanes = NoLanes$1;

    this.alternate = null;

    // ...
  }

  // This is used to create an alternate fiber to do work on.
  function createWorkInProgress(current, pendingProps) {
    let workInProgress = current.alternate;
    if (workInProgress === null) {
      // We use a double buffering pooling technique because we know that we'll
      // only ever need at most two versions of a tree. We pool the "other" unused
      // node that we're free to reuse. This is lazily created to avoid allocating
      // extra objects for things that are never updated. It also allow us to
      // reclaim the extra memory if needed.
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
      workInProgress.pendingProps = pendingProps;
      // Needed because Blocks store data on type.
      workInProgress.type = current.type;

      // We already have an alternate.
      // Reset the effect tag.
      workInProgress.flags = NoFlags;

      // The effects are no longer valid.
      workInProgress.subtreeFlags = NoFlags;
      workInProgress.deletions = null;

      if (enableProfilerTimer) {
        // We intentionally reset, rather than copy, actualDuration & actualStartTime.
        // This prevents time from endlessly accumulating in new commits.
        // This has the downside of resetting values for different priority renders,
        // But works for yielding (the common case) and should support resuming.
        workInProgress.actualDuration = 0;
        workInProgress.actualStartTime = -1;
      }
    }

    // Reset all effects except static ones.
    // Static effects are not specific to a render.
    workInProgress.flags = current.flags & StaticMask;
    workInProgress.childLanes = current.childLanes;
    workInProgress.lanes = current.lanes;

    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;

    // Clone the dependencies object. This is mutated during the render phase, so
    // it cannot be shared with the current fiber.
    const currentDependencies = current.dependencies;
    workInProgress.dependencies =
      currentDependencies === null
        ? null
        : {
            lanes: currentDependencies.lanes,
            firstContext: currentDependencies.firstContext,
          };

    // These will be overridden during the parent's reconciliation
    workInProgress.sibling = current.sibling;
    workInProgress.index = current.index;
    workInProgress.ref = current.ref;

    return workInProgress;
  }

  function createFiberFromText(content, mode, lanes) {
    const fiber = createFiber(HostText$1, content, null, mode);
    fiber.lanes = lanes;
    return fiber;
  }

  function createFiberFromElement(element, mode, lanes) {
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

  function createFiberFromTypeAndProps(
    type,
    key,
    pendingProps,
    owner,
    mode,
    lanes
  ) {
    let fiberTag = IndeterminateComponent;
    // The resolved type is set if we know that the final type will be. I.e. it's not lazy.
    let resolvedType = type;
    if (typeof type === "function") {
      if (shouldConstruct(type)) {
        fiberTag = ClassComponent;
      } else {
      }
    } else if (typeof type === "string") {
      fiberTag = HostComponent;
    } else {
      getTag: switch (type) {
        case REACT_FRAGMENT_TYPE:
          return createFiberFromFragment(pendingProps.children, mode, lanes, key);
        // ... 省略 case
        default: {
          if (typeof type === "object" && type !== null) {
            switch (type.$$typeof) {
              case REACT_PROVIDER_TYPE$1:
                fiberTag = ContextProvider;
                break getTag;
              // ...省略 case
            }
          }
        }
      }
    }

    const fiber = createFiber(fiberTag, pendingProps, key, mode);
    fiber.elementType = type;
    fiber.type = resolvedType;
    fiber.lanes = lanes;

    return fiber;
  }

  const LegacyRoot = 0;
  const BlockingRoot = 1;
  const ConcurrentRoot = 2;
  const enableSuspenseCallback = false;
  const enableCache = false;

  const NoMode = 0b00000;
  const StrictMode = 0b00001;
  // TODO: Remove BlockingMode and ConcurrentMode by reading from the root
  // tag instead
  const BlockingMode = 0b00010;
  const ConcurrentMode = 0b00100;
  // const ProfileMode = 0b01000;
  // const DebugTracingMode = 0b10000;



  function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
    const root = new FiberRootNode(containerInfo, tag, hydrate);

    if (enableSuspenseCallback) {
      root.hydrationCallbacks = hydrationCallbacks;
    }

    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    const uninitializedFiber = createHostRootFiber(tag);
    root.current = uninitializedFiber;
    uninitializedFiber.stateNode = root;

    if (enableCache) {
      // ...
    } else {
      const initialState = {
        element: null,
      };

      uninitializedFiber.memoizedState = initialState;
    }

    initializeUpdateQueue(uninitializedFiber);

    return root;
  }

  function createHostRootFiber(tag) {
    let mode;

    if (tag === ConcurrentRoot) {
      mode = ConcurrentMode | BlockingMode | StrictMode;
    } else if (tag === BlockingRoot) {
      mode = BlockingMode | StrictMode;
    } else {
      mode = NoMode;
    }

    return createFiber(HostRoot, null, null, mode);
  }

  function initializeUpdateQueue(fiber) {
      const queue = {
          baseState: fiber.memoizedState,
          firstBaseUpdate: null,
          lastBaseUpdate: null,
          shared: {
              pending: null
          },
          effects: null,
      };
      fiber.updateQueue = queue;
  }

  function FiberRootNode(containerInfo, tag, hydrate) {
    this.tag = tag;
    this.containerInfo = containerInfo;
    this.pendingChildren = null;
    this.current = null;
    this.pingCache = null;
    this.finishedWork = null;
  //   this.timeoutHandle = noTimeout;
    this.context = null;
    this.pendingContext = null;
    this.hydrate = hydrate;
    this.callbackNode = null;
  //   this.callbackPriority = NoLanePriority;
    this.eventTimes = createLaneMap(NoLanes$1);
    this.expirationTimes = createLaneMap(NoTimestamp);

    this.pendingLanes = NoLanes$1;
    this.suspendedLanes = NoLanes$1;
    this.pingedLanes = NoLanes$1;
    this.expiredLanes = NoLanes$1;
    this.mutableReadLanes = NoLanes$1;
    this.finishedLanes = NoLanes$1;
    this.entangledLanes = NoLanes$1;
    this.entanglements = createLaneMap(NoLanes$1);

    // if (enableCache) {
    //     this.pooledCache = null;
    //     this.pooledCacheLanes = NoLanes;
    // }

    // if (supportsHydration) {
    //     this.mutableSourceEagerHydrationData = null;
    // }

    // if (enableSchedulerTracing) {
    //     this.interactionThreadID = unstable_getThreadID();
    //     this.memoizedInteractions = new Set();
    //     this.pendingInteractionMap = new Map();
    // }
    // if (enableSuspenseCallback) {
    //     this.hydrationCallbacks = null;
    // }
  }

  function getPublicInstance(instance) {
    return instance;
  }

  // This initialization code may run even on server environments
  // if a component just imports ReactDOM (e.g. for findDOMNode).
  // Some environments might not have setTimeout or clearTimeout.
  const scheduleTimeout =
    typeof setTimeout === "function" ? setTimeout : undefined;
  const cancelTimeout =
    typeof clearTimeout === "function" ? clearTimeout : undefined;
  const noTimeout = -1;

  function shouldSetTextContent(type, props) {
    return (
      type === "textarea" ||
      type === "option" ||
      type === "noscript" ||
      typeof props.children === "string" ||
      typeof props.children === "number" ||
      (typeof props.dangerouslySetInnerHTML === "object" &&
        props.dangerouslySetInnerHTML !== null &&
        props.dangerouslySetInnerHTML.__html != null)
    );
  }

  let getCurrentTime;
  const hasPerformanceNow =
    typeof performance === "object" && typeof performance.now === "function";

  if (hasPerformanceNow) {
    const localPerformance = performance;
    getCurrentTime = () => localPerformance.now();
  } else {
    const localDate = Date;
    const initialTime = localDate.now();
    getCurrentTime = () => localDate.now() - initialTime;
  }

  // TODO: Use symbols?
  const NoPriority$1 = 0;
  const ImmediatePriority$1 = 1;
  const UserBlockingPriority$1 = 2;
  const NormalPriority$1 = 3;
  const LowPriority$1 = 4;
  const IdlePriority$1 = 5;

  var currentPriorityLevel = NormalPriority$1;

  function unstable_runWithPriority(priorityLevel, eventHandler) {
    switch (priorityLevel) {
      case ImmediatePriority$1:
      case UserBlockingPriority$1:
      case NormalPriority$1:
      case LowPriority$1:
      case IdlePriority$1:
        break;
      default:
        priorityLevel = NormalPriority$1;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_getCurrentPriorityLevel() {
    return currentPriorityLevel;
  }

  function shouldYieldToHost() {
    if (
      enableIsInputPending &&
      navigator !== undefined &&
      navigator.scheduling !== undefined &&
      navigator.scheduling.isInputPending !== undefined
    ) {
      const scheduling = navigator.scheduling;
      const currentTime = getCurrentTime();
      if (currentTime >= deadline) {
        // There's no time left. We may want to yield control of the main
        // thread, so the browser can perform high priority tasks. The main ones
        // are painting and user input. If there's a pending paint or a pending
        // input, then we should yield. But if there's neither, then we can
        // yield less often while remaining responsive. We'll eventually yield
        // regardless, since there could be a pending paint that wasn't
        // accompanied by a call to `requestPaint`, or other main thread tasks
        // like network events.
        if (needsPaint || scheduling.isInputPending()) {
          // There is either a pending paint or a pending input.
          return true;
        }
        // There's no pending input. Only yield if we've reached the max
        // yield interval.
        return currentTime >= maxYieldInterval;
      } else {
        // There's still time left in the frame.
        return false;
      }
    } else {
      // `isInputPending` is not available. Since we have no way of knowing if
      // there's pending input, always yield at the end of the frame.
      return getCurrentTime() >= deadline;
    }
  }

  var Scheduler = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get unstable_now () { return getCurrentTime; },
    unstable_ImmediatePriority: ImmediatePriority$1,
    unstable_UserBlockingPriority: UserBlockingPriority$1,
    unstable_NormalPriority: NormalPriority$1,
    unstable_IdlePriority: IdlePriority$1,
    unstable_LowPriority: LowPriority$1,
    unstable_runWithPriority: unstable_runWithPriority,
    unstable_getCurrentPriorityLevel: unstable_getCurrentPriorityLevel,
    unstable_shouldYield: shouldYieldToHost
  });

  // Replacement for runWithPriority in React internals.
  const decoupleUpdatePriorityFromScheduler = false;

  // Except for NoPriority, these correspond to Scheduler priorities. We use
  // ascending numbers so we can compare them like numbers. They start at 90 to
  // avoid clashing with Scheduler's priorities.
  const ImmediatePriority = 99;
  const UserBlockingPriority = 98;
  const NormalPriority = 97;
  const LowPriority = 96;
  const IdlePriority = 95;
  // NoPriority is the absence of priority. Also React-only.
  const NoPriority = 90;

  const {
    unstable_now: Scheduler_now,
    unstable_runWithPriority: Scheduler_runWithPriority,
    unstable_ImmediatePriority: Scheduler_ImmediatePriority,
    unstable_UserBlockingPriority: Scheduler_UserBlockingPriority,
    unstable_NormalPriority: Scheduler_NormalPriority,
    unstable_LowPriority: Scheduler_LowPriority,
    unstable_IdlePriority: Scheduler_IdlePriority,
    unstable_getCurrentPriorityLevel: Scheduler_getCurrentPriorityLevel,
    unstable_shouldYield: Scheduler_shouldYield,
  } = Scheduler;

  const shouldYield$1 = Scheduler_shouldYield;

  function flushSyncCallbackQueue() {
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

  function runWithPriority(reactPriorityLevel, fn) {
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

  function getCurrentPriorityLevel() {
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

  const now =
    initialTimeMs < 10000 ? Scheduler_now : () => Scheduler_now() - initialTimeMs;

  const isArray = Array.isArray;

  const mountChildFibers = ChildReconciler(false);
  const reconcileChildFibers = ChildReconciler(true);

  // This wrapper function exists because I expect to clone the code in each path
  // to be able to optimize each path individually by branching early. This needs
  // a compiler or we can do it manually. Helpers that don't need this branching
  // live outside of this function.
  function ChildReconciler(shouldTrackSideEffects) {
    function deleteChild(returnFiber, childToDelete) {
      if (!shouldTrackSideEffects) {
        // Noop.
        return;
      }
      const deletions = returnFiber.deletions;
      if (deletions === null) {
        returnFiber.deletions = [childToDelete];
        returnFiber.flags |= ChildDeletion;
      } else {
        deletions.push(childToDelete);
      }
    }
    function deleteRemainingChildren(returnFiber, currentFirstChild) {
      if (!shouldTrackSideEffects) {
        // Noop.
        return null;
      }

      // TODO: For the shouldClone case, this could be micro-optimized a bit by
      // assuming that after the first child we've already added everything.
      let childToDelete = currentFirstChild;
      while (childToDelete !== null) {
        deleteChild(returnFiber, childToDelete);
        childToDelete = childToDelete.sibling;
      }
      return null;
    }

    function useFiber(fiber, pendingProps) {
      // We currently set sibling to null and index to 0 here because it is easy
      // to forget to do before returning it. E.g. for the single child case.
      const clone = createWorkInProgress(fiber, pendingProps);
      clone.index = 0;
      clone.sibling = null;
      return clone;
    }

    function placeSingleChild(newFiber) {
      // This is simpler for the single child case. We only need to do a
      // placement for inserting new children.
      if (shouldTrackSideEffects && newFiber.alternate === null) {
        newFiber.flags |= Placement;
      }
      return newFiber;
    }
    function reconcileSingleElement(
      returnFiber,
      currentFirstChild,
      element,
      lanes
    ) {
      const key = element.key;
      let child = currentFirstChild;
      while (child !== null) {
        // TODO: If key === null and child.key === null, then this only applies to
        // the first item in the list.
        if (child.key === key) {
          const elementType = element.type;
          if (elementType === REACT_FRAGMENT_TYPE) {
            if (child.tag === Fragment) {
              deleteRemainingChildren(returnFiber, child.sibling);
              const existing = useFiber(child, element.props.children);
              existing.return = returnFiber;

              return existing;
            }
          } else {
            if (
              child.elementType === elementType ||
              // ||
              // // Keep this check inline so it only runs on the false path:
              // (__DEV__
              //   ? isCompatibleFamilyForHotReloading(child, element)
              //   : false)
              // Lazy types should reconcile their resolved type.
              // We need to do this after the Hot Reloading check above,
              // because hot reloading has different semantics than prod because
              // it doesn't resuspend. So we can't let the call below suspend.
              (enableLazyElements &&
                typeof elementType === "object" &&
                elementType !== null &&
                elementType.$$typeof === REACT_LAZY_TYPE)
              //   && resolveLazy(elementType) === child.type
            ) {
              deleteRemainingChildren(returnFiber, child.sibling);
              const existing = useFiber(child, element.props);
              // existing.ref = coerceRef(returnFiber, child, element);
              existing.return = returnFiber;
              return existing;
            }
          }
          // Didn't match;
          deleteRemainingChildren(returnFiber, child);
          break;
        } else {
          deleteChild(returnFiber, child);
        }
        child = child.sibling;
      }

      if (element.type === REACT_FRAGMENT_TYPE) {
        // ...省略
        console.log("createFiberFromFragment");
      } else {
        const created = createFiberFromElement(element, returnFiber.mode, lanes);
        // created.ref = coerceRef(returnFiber, currentFirstChild, element);
        created.return = returnFiber;
        return created;
      }
    }

    function reconcileChildrenArray(
      returnFiber,
      currentFirstChild,
      newChildren,
      lanes
    ) {
      // This algorithm can't optimize by searching from both ends since we
      // don't have backpointers on fibers. I'm trying to see how far we can get
      // with that model. If it ends up not being worth the tradeoffs, we can
      // add it later.

      // Even with a two ended optimization, we'd want to optimize for the case
      // where there are few changes and brute force the comparison instead of
      // going for the Map. It'd like to explore hitting that path first in
      // forward-only mode and only go for the Map once we notice that we need
      // lots of look ahead. This doesn't handle reversal as well as two ended
      // search but that's unusual. Besides, for the two ended optimization to
      // work on Iterables, we'd need to copy the whole set.

      // In this first iteration, we'll just live with hitting the bad case
      // (adding everything to a Map) in for every insert/move.

      // If you change this code, also update reconcileChildrenIterator() which
      // uses the same algorithm.

      let resultingFirstChild = null;
      let previousNewFiber = null;

      let oldFiber = currentFirstChild;
      let lastPlacedIndex = 0;
      let newIdx = 0;
      let nextOldFiber = null;
      for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
        if (oldFiber.index > newIdx) {
          nextOldFiber = oldFiber;
          oldFiber = null;
        } else {
          nextOldFiber = oldFiber.sibling;
        }

        const newFiber = updateSlot(
          returnFiber,
          oldFiber,
          newChildren[newIdx],
          lanes
        );
        if (newFiber === null) {
          // TODO: This breaks on empty slots like null children. That's
          // unfortunate because it triggers the slow path all the time. We need
          // a better way to communicate whether this was a miss or null,
          // boolean, undefined, etc.
          if (oldFiber === null) {
            oldFiber = nextOldFiber;
          }
          break;
        }

        if (shouldTrackSideEffects) {
          if (oldFiber && newFiber.alternate === null) {
            // We matched the slot, but we didn't reuse the existing fiber, so we
            // need to delete the existing child.
            deleteChild(returnFiber, oldFiber);
          }
        }

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          // TODO: Defer siblings if we're not at the right index for this slot.
          // I.e. if we had null values before, then we want to defer this
          // for each null value. However, we also don't want to call updateSlot
          // with the previous one.
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }

      if (newIdx === newChildren.length) {
        // We've reached the end of the new children. We can delete the rest.
        deleteRemainingChildren(returnFiber, oldFiber);
        return resultingFirstChild;
      }

      if (oldFiber === null) {
        // If we don't have any more existing children we can choose a fast path
        // since the rest will all be insertions.
        for (; newIdx < newChildren.length; newIdx++) {
          const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
          if (newFiber === null) {
            continue;
          }
          lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            // TODO: Move out of the loop. This only happens for the first run.
            resultingFirstChild = newFiber;
          } else {
            previousNewFiber.sibling = newFiber;
          }
          previousNewFiber = newFiber;
        }
        return resultingFirstChild;
      }

      // Add all children to a key map for quick lookups.
      const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

      // Keep scanning and use the map to restore deleted items as moves.
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = updateFromMap(
          existingChildren,
          returnFiber,
          newIdx,
          newChildren[newIdx],
          lanes
        );
        if (newFiber !== null) {
          if (shouldTrackSideEffects) {
            if (newFiber.alternate !== null) {
              // The new fiber is a work in progress, but if there exists a
              // current, that means that we reused the fiber. We need to delete
              // it from the child list so that we don't add it to the deletion
              // list.
              existingChildren.delete(
                newFiber.key === null ? newIdx : newFiber.key
              );
            }
          }
          lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            resultingFirstChild = newFiber;
          } else {
            previousNewFiber.sibling = newFiber;
          }
          previousNewFiber = newFiber;
        }
      }

      if (shouldTrackSideEffects) {
        // Any existing children that weren't consumed above were deleted. We need
        // to add them to the deletion list.
        existingChildren.forEach((child) => deleteChild(returnFiber, child));
      }

      return resultingFirstChild;
    }

    function reconcileSingleTextNode(
      returnFiber,
      currentFirstChild,
      textContent,
      lanes
    ) {
      // There's no need to check for keys on text nodes since we don't have a
      // way to define them.
      if (currentFirstChild !== null && currentFirstChild.tag === HostText$1) {
        // We already have an existing node so let's just update it and delete
        // the rest.
        deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
        const existing = useFiber(currentFirstChild, textContent);
        existing.return = returnFiber;
        return existing;
      }

      // The existing first child is not a text node so we need to create one
      // and delete the existing ones.
      deleteRemainingChildren(returnFiber, currentFirstChild);
      const created = createFiberFromText(textContent, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    }

    function updateTextNode(returnFiber, current, textContent, lanes) {
      if (current === null || current.tag !== HostText$1) {
        // Insert
        const created = createFiberFromText(textContent, returnFiber.mode, lanes);
        created.return = returnFiber;
        return created;
      } else {
        // Update
        const existing = useFiber(current, textContent);
        existing.return = returnFiber;
        return existing;
      }
    }

    function updateElement(returnFiber, current, element, lanes) {
      const elementType = element.type;
      if (elementType === REACT_FRAGMENT_TYPE) {
        console.log("updateElement REACT_FRAGMENT_TYPE");
        // return updateFragment(
        //   returnFiber,
        //   current,
        //   element.props.children,
        //   lanes,
        //   element.key
        // )
      }

      if (current !== null) {
        if (
          current.elementType === elementType ||
          // // Keep this check inline so it only runs on the false path:
          // (__DEV__
          //   ? isCompatibleFamilyForHotReloading(current, element)
          //   : false) ||
          // Lazy types should reconcile their resolved type.
          // We need to do this after the Hot Reloading check above,
          // because hot reloading has different semantics than prod because
          // it doesn't resuspend. So we can't let the call below suspend.
          (enableLazyElements &&
            typeof elementType === "object" &&
            elementType !== null &&
            elementType.$$typeof === REACT_LAZY_TYPE)
          // &&
          // resolveLazy(elementType) === current.type
        ) {
          // Move based on index
          const existing = useFiber(current, element.props);
          // existing.ref = coerceRef(returnFiber, current, element)
          existing.return = returnFiber;

          return existing;
        }
      }

      // Insert
      const created = createFiberFromElement(element, returnFiber.mode, lanes);
      // created.ref = coerceRef(returnFiber, current, element)
      created.return = returnFiber;
      return created;
    }

    function updateSlot(returnFiber, oldFiber, newChild, lanes) {
      // Update the fiber if the keys match, otherwise return null.
      const key = oldFiber !== null ? oldFiber.key : null;

      if (typeof newChild === "string" || typeof newChild === "number") {
        // Text nodes don't have keys. If the previous node is implicitly keyed
        // we can continue to replace it without aborting even if it is not a text
        // node.
        if (key !== null) {
          return null;
        }
        return updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
      }

      if (typeof newChild === "object" && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            if (newChild.key === key) {
              return updateElement(returnFiber, oldFiber, newChild, lanes);
            } else {
              return null;
            }
          }
          case REACT_PORTAL_TYPE: {
            // if (newChild.key === key) {
            //   return updatePortal(returnFiber, oldFiber, newChild, lanes);
            // } else {
            //   return null;
            // }
          }
          case REACT_LAZY_TYPE: {
            // if (enableLazyElements) {
            //   const payload = newChild._payload;
            //   const init = newChild._init;
            //   return updateSlot(returnFiber, oldFiber, init(payload), lanes);
            // }
          }
        }

        console.log("uncovered updateSlot");
        // if (isArray(newChild) || getIteratorFn(newChild)) {
        //   if (key !== null) {
        //     return null;
        //   }

        //   return updateFragment(returnFiber, oldFiber, newChild, lanes, null);
        // }

        // throwOnInvalidObjectType(returnFiber, newChild);
      }

      return null;
    }

    // This API will tag the children with the side-effect of the reconciliation
    // itself. They will be added to the side-effect list as we pass through the
    // children and the parent.
    function reconcileChildFibers(
      returnFiber,
      currentFirstChild,
      newChild,
      lanes
    ) {
      // This function is not recursive.
      // If the top level item is an array, we treat it as a set of children,
      // not as a fragment. Nested arrays on the other hand will be treated as
      // fragment nodes. Recursion happens at the normal flow.

      // Handle top level unkeyed fragments as if they were arrays.
      // This leads to an ambiguity between <>{[...]}</> and <>...</>.
      // We treat the ambiguous cases above the same.
      const isUnkeyedTopLevelFragment =
        typeof newChild === "object" &&
        newChild !== null &&
        newChild.type === REACT_FRAGMENT_TYPE &&
        newChild.key === null;
      if (isUnkeyedTopLevelFragment) {
        newChild = newChild.props.children;
      }

      // handle object types
      const isObject = typeof newChild === "object" && newChild !== null;
      if (isObject) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return placeSingleChild(
              reconcileSingleElement(
                returnFiber,
                currentFirstChild,
                newChild,
                lanes
              )
            );
          case REACT_PORTAL_TYPE:
          // ...省略
          case REACT_LAZY_TYPE:
          // ...省略
          default:
            console.error("unhandled $$typeof");
            break;
        }
      }

      if (typeof newChild === "string" || typeof newChild === "number") {
        return placeSingleChild(
          reconcileSingleTextNode(
            returnFiber,
            currentFirstChild,
            "" + newChild,
            lanes
          )
        );
      }

      if (isArray(newChild)) {
        return reconcileChildrenArray(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes
        );
      }

      // if (getIteratorFn(newChild)) {
      //     return reconcileChildrenIterator(
      //       returnFiber,
      //       currentFirstChild,
      //       newChild,
      //       lanes,
      //     );
      //   }

      if (isObject) {
        console.error("throwOnInvalidObjectType");
        // throwOnInvalidObjectType(returnFiber, newChild);
      }

      if (typeof newChild === "undefined" && !isUnkeyedTopLevelFragment) {
        // If the new child is undefined, and the return fiber is a composite
        // component, throw an error. If Fiber return types are disabled,
        // we already threw above.
        switch (returnFiber.tag) {
          case ClassComponent:
          // Intentionally fall through to the next case, which handles both
          // functions and classes
          // eslint-disable-next-lined no-fallthrough
          case FunctionComponent:
          case ForwardRef:
          case SimpleMemoComponent: {
            console.log(
              "Nothing was returned from render. This usually means a " +
                "return statement is missing. Or, to render nothing, " +
                "return null.",
              getComponentName(returnFiber.type) || "Component"
            );
          }
        }
      }

      // Remaining cases are all treated as empty.
      return deleteRemainingChildren(returnFiber, currentFirstChild);
    }

    return reconcileChildFibers;
  }

  function getComponentName(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }

    if (typeof type === "function") {
      return type.displayName || type.name || null;
    }
    if (typeof type === "string") {
      return type;
    }
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      case REACT_PORTAL_TYPE:
        return "Portal";
      case REACT_PROFILER_TYPE:
        return "Profiler";
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
      case REACT_CACHE_TYPE:
        return "Cache";
    }

    if (typeof type === "object") {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          const context = type;
          return getContextName(context) + ".Consumer";
        case REACT_PROVIDER_TYPE:
          const provider = type;
          return getContextName(provider._context) + ".Provider";
        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, "ForwardRef");
        case REACT_MEMO_TYPE:
          return getComponentName(type.type);
        case REACT_LAZY_TYPE: {
          const lazyComponent = type;
          const payload = lazyComponent._payload;
          const init = lazyComponent._init;
          try {
            return getComponentName(init(payload));
          } catch (x) {
            return null;
          }
        }
      }
    }
    return null;
  }

  let didReceiveUpdate = false;

  function beginWork(current, workInProgress, renderLanes) {
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

    if (enableCache$1) {
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

  function reconcileChildren(
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

  // An array of all update queues that received updates during the current
  // render. When this render exits, either because it finishes or because it is
  // interrupted, the interleaved updates will be transfered onto the main part
  // of the queue.
  let interleavedQueues = null;

  function enqueueInterleavedUpdates() {
    // Transfer the interleaved updates onto the main queue. Each queue has a
    // `pending` field and an `interleaved` field. When they are not null, they
    // point to the last node in a circular linked list. We need to append the
    // interleaved list to the end of the pending list by joining them into a
    // single, circular list.
    if (interleavedQueues !== null) {
      for (let i = 0; i < interleavedQueues.length; i++) {
        const queue = interleavedQueues[i];
        const lastInterleavedUpdate = queue.interleaved;
        if (lastInterleavedUpdate !== null) {
          queue.interleaved = null;
          const firstInterleavedUpdate = lastInterleavedUpdate.next;
          const lastPendingUpdate = queue.pending;
          if (lastPendingUpdate !== null) {
            const firstPendingUpdate = lastPendingUpdate.next;
            lastPendingUpdate.next = firstInterleavedUpdate;
            lastInterleavedUpdate.next = firstPendingUpdatey;
          }
          queue.pending = lastInterleavedUpdate;
        }
      }
      interleavedQueues = null;
    }
  }

  const {
    ReactCurrentOwner,
  } = ReactSharedInternals;

  const NoContext = /*             */ 0b0000000;
  const BatchedContext = /*               */ 0b0000001;
  const EventContext = /*                 */ 0b0000010;
  const DiscreteEventContext = /*         */ 0b0000100;
  const LegacyUnbatchedContext = /*       */ 0b0001000;
  const RenderContext = /*                */ 0b0010000;
  const CommitContext = /*                */ 0b0100000;
  const RetryAfterError = /*       */ 0b1000000;

  // Describes where we are in the React execution stack
  let executionContext = NoContext;
  // The root we're working on
  let workInProgressRoot = null;
  // The fiber we're working on
  let workInProgress = null;

  // The lanes we're rendering
  let workInProgressRootRenderLanes = NoLanes$1;
  // The work left over by components that were visited during this render. Only
  // includes unprocessed updates, not work in bailed out children.
  let workInProgressRootSkippedLanes = NoLanes$1;
  // Lanes that were updated (in an interleaved event) during this render.
  let workInProgressRootUpdatedLanes = NoLanes$1;
  // Lanes that were pinged (in an interleaved event) during this render.
  let workInProgressRootPingedLanes = NoLanes$1;

  // Stack that allows components to change the render lanes for its subtree
  // This is a superset of the lanes we started working on at the root. The only
  // case where it's different from `workInProgressRootRenderLanes` is when we
  // enter a subtree that is hidden and needs to be unhidden: Suspense and
  // Offscreen component.
  //
  // Most things in the work loop should deal with workInProgressRootRenderLanes.
  // Most things in begin/complete phases should deal with subtreeRenderLanes.
  let subtreeRenderLanes = NoLanes$1;

  // If two updates are scheduled within the same event, we should treat their
  // event times as simultaneous, even if the actual clock time has advanced
  // between the first and second call.
  let currentEventTime = NoTimestamp;
  let currentEventWipLanes = NoLanes$1;
  let currentEventPendingLanes = NoLanes$1;

  // "Included" lanes refer to lanes that were worked on during this render. It's
  // slightly different than `renderLanes` because `renderLanes` can change as you
  // enter and exit an Offscreen tree. This value is the combination of all render
  // lanes for the entire render phase.
  let workInProgressRootIncludedLanes = NoLanes$1;

  let pendingPassiveEffectsRenderPriority = NoPriority;

  let rootWithPendingPassiveEffects = null;
  let pendingPassiveEffectsLanes = NoLanes$1;

  // Use these to prevent an infinite loop of nested updates
  const NESTED_UPDATE_LIMIT = 50;
  let nestedUpdateCount = 0;
  let rootWithNestedUpdates = null;

  const RootIncomplete = 0;

  // Whether to root completed, errored, suspended, etc.
  let workInProgressRootExitStatus = RootIncomplete;

  const NESTED_PASSIVE_UPDATE_LIMIT = 50;
  let nestedPassiveUpdateCount = 0;

  let mostRecentlyUpdatedRoot = null;

  function unbatchedUpdates(fn, a) {
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

  function requestEventTime() {
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

  function requestUpdateLane(fiber) {
    // Special cases
    const mode = fiber.mode;
    if ((mode & BlockingMode) === NoMode) {
      return SyncLane;
    } else if ((mode & ConcurrentMode) === NoMode) {
      return getCurrentPriorityLevel() === ImmediatePriority
        ? SyncLane
        : SyncBatchedLane;
    } else if (
      !deferRenderPhaseUpdateToNextBatch &&
      (executionContext & RenderContext) !== NoContext &&
      workInProgressRootRenderLanes !== NoLanes$1
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
      console.log("return requestUpdateLane");
      // return requestUpdateLane(workInProgressRootRenderLanes);
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

    if (currentEventWipLanes === NoLanes$1) {
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
      schedulerPriority === UserBlockingPriority
    ) {
      lane = findUpdateLane(InputDiscreteLanePriority, currentEventWipLanes);
    } else if (
      decoupleUpdatePriorityFromScheduler$1 &&
      getCurrentUpdateLanePriority() !== NoLanePriority
    ) {
      // const currentLanePriority = getCurrentUpdateLanePriority();
      // lane = findUpdateLane(currentLanePriority, currentEventWipLanes);
    } else {
      const schedulerLanePriority = schedulerPriorityToLanePriority(
        schedulerPriority
      );

      lane = findUpdateLane(schedulerLanePriority, currentEventWipLanes);
    }

    return lane;
  }

  function scheduleUpdateOnFiber(fiber, lane, eventTime) {
    // checkForNestedUpdates()
    // warnAboutRenderPhaseUpdatesInDEV(fiber);

    const root = markUpdateLaneFromFiberToRoot(fiber, lane);
    if (root === null) {
      //   warnAboutUpdateOnUnmountedFiberInDEV(fiber);
      return null;
    }

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
        console.log("performSyncWorkOnRoot");
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
        (priorityLevel === UserBlockingPriority ||
          priorityLevel === ImmediatePriority)
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

    let lanes;
    let exitStatus;
    if (
      root === workInProgressRoot &&
      includesSomeLane(root.expiredLanes, workInProgressRootRenderLanes)
    ) {
      // There's a partial tree, and at least one of its lanes has expired. Finish
      // rendering it before rendering the rest of the expired work.
      lanes = workInProgressRootRenderLanes;
      exitStatus = renderRootSync(root, lanes);
      if (
        includesSomeLane(
          workInProgressRootIncludedLanes,
          workInProgressRootUpdatedLanes
        )
      ) {
        // The render included lanes that were updated during the render phase.
        // For example, when unhiding a hidden tree, we include all the lanes
        // that were previously skipped when the tree was hidden. That set of
        // lanes is a superset of the lanes we started rendering with.
        //
        // Note that this only happens when part of the tree is rendered
        // concurrently. If the whole tree is rendered synchronously, then there
        // are no interleaved events.
        lanes = getNextLanes(root, lanes);
        exitStatus = renderRootSync(root, lanes);
      }
    } else {
      lanes = getNextLanes(root, NoLanes$1);
      exitStatus = renderRootSync(root, lanes);
    }

    // ============ 错误处理 begin ===================
    //   if (root.tag !== LegacyRoot && exitStatus === RootErrored) {
    //     executionContext |= RetryAfterError;

    //     // If an error occurred during hydration,
    //     // discard server response and fall back to client side render.
    //     if (root.hydrate) {
    //       root.hydrate = false;
    //       clearContainer(root.containerInfo);
    //     }

    //     // If something threw an error, try rendering one more time. We'll render
    //     // synchronously to block concurrent data mutations, and we'll includes
    //     // all pending updates are included. If it still fails after the second
    //     // attempt, we'll give up and commit the resulting tree.
    //     lanes = getLanesToRetrySynchronouslyOnError(root);
    //     if (lanes !== NoLanes) {
    //       exitStatus = renderRootSync(root, lanes);
    //     }
    //   }

    //   if (exitStatus === RootFatalErrored) {
    //     const fatalError = workInProgressRootFatalError;
    //     prepareFreshStack(root, NoLanes);
    //     markRootSuspended(root, lanes);
    //     ensureRootIsScheduled(root, now());
    //     throw fatalError;
    //   }

    // ============ 错误处理 end ===================

    // We now have a consistent tree. Because this is a sync render, we
    // will commit it even if something suspended.
    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
    root.finishedLanes = lanes;
    commitRoot(root);

    // Before exiting, make sure there's a callback scheduled for the next
    // pending level.
    ensureRootIsScheduled(root, now());

    return null;
  }

  function flushPassiveEffects() {
    // Returns whether passive effects were flushed.
    if (pendingPassiveEffectsRenderPriority !== NoPriority) {
      const priorityLevel =
        pendingPassiveEffectsRenderPriority > NormalSchedulerPriority
          ? NormalSchedulerPriority
          : pendingPassiveEffectsRenderPriority;
      pendingPassiveEffectsRenderPriority = NoPriority;
      if (decoupleUpdatePriorityFromScheduler$1) {
        //   const previousLanePriority = getCurrentUpdateLanePriority();
        //   try {
        //     setCurrentUpdateLanePriority(
        //       schedulerPriorityToLanePriority(priorityLevel)
        //     );
        //     return runWithPriority(priorityLevel, flushPassiveEffectsImpl);
        //   } finally {
        //     setCurrentUpdateLanePriority(previousLanePriority);
        //   }
      } else {
        return runWithPriority(priorityLevel, flushPassiveEffectsImpl);
      }
    }

    return false;
  }

  function flushPassiveEffectsImpl() {
    if (rootWithPendingPassiveEffects === null) {
      return false;
    }

    const root = rootWithPendingPassiveEffects;
    const lanes = pendingPassiveEffectsLanes;
    rootWithPendingPassiveEffects = null;
    pendingPassiveEffectsLanes = NoLanes$1;

    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    const prevInteractions = pushInteractions(root);

    commitPassiveUnmountEffects(root.current);
    commitPassiveMountEffects(root, root.current);

    executionContext = prevExecutionContext;
    flushSyncCallbackQueue();

    // If additional passive effects were scheduled, increment a counter. If this
    // exceeds the limit, we'll fire a warning.
    nestedPassiveUpdateCount =
      rootWithPendingPassiveEffects === null ? 0 : nestedPassiveUpdateCount + 1;

    return true;
  }

  function pushInteractions(root) {
    // if (enableSchedulerTracing) {
    //     const prevInteractions = __interactionsRef.current;
    //     __interactionsRef.current = root.memoizedInteractions;
    //     return prevInteractions;
    // }
    return null;
  }

  // This is split into a separate function so we can mark a fiber with pending
  // work without treating it as a typical update that originates from an event;
  // e.g. retrying a Suspense boundary isn't an update, but it does schedule work
  // on a fiber.
  function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
    // Update the source fiber's lanes
    sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
    let alternate = sourceFiber.alternate;
    if (alternate !== null) {
      alternate.lanes = mergeLanes(alternate.lanes, lane);
    }

    // Walk the parent path to the root and update the child expiration time.
    let node = sourceFiber;
    let parent = sourceFiber.return;
    while (parent !== null) {
      parent.childLanes = mergeLanes(parent.childLanes, lane);
      alternate = parent.alternate;
      if (alternate !== null) {
        alternate.childLanes = mergeLanes(alternate.childLanes, lane);
      }

      node = parent;
      parent = parent.return;
    }

    if (node.tag === HostRoot) {
      const root = node.stateNode;
      return root;
    } else {
      return null;
    }
  }

  function pushDispatcher() {
    // const prevDispatcher = ReactCurrentDispatcher.current;
  }

  function popDispatcher(prevDispatcher) {}

  function renderRootSync(root, lanes) {
    const prevExecutionContext = executionContext;
    executionContext |= RenderContext;
    // const prevDispatcher = pushDispatcher();

    // If the root or lanes have changed, throw out the existing stack
    // and prepare a fresh one. Otherwise we'll continue where we left off.
    if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
      prepareFreshStack(root, lanes);
      // startWorkOnPendingInteractions(root, lanes);
    }

    // const prevInteractions = pushInteractions(root);

    do {
      try {
        workLoopSync();
        break;
      } catch (thrownValue) {
        handleError(root, thrownValue);
      }
    } while (true);

    // resetContextDependencies();

    executionContext = prevExecutionContext;
    // popDispatcher(prevDispatcher);

    if (workInProgress !== null) {
      // This is a sync render, so we should have finished the whole tree.
      console.error(
        "Cannot commit an incomplete root. This error is likely caused by a " +
          "bug in React. Please file an issue."
      );
    }

    // Set this to null to indicate there's no in-progress render.
    workInProgressRoot = null;
    workInProgressRootRenderLanes = NoLanes$1;

    return workInProgressRootExitStatus;
  }

  // The work loop is an extremely hot path. Tell Closure not to inline it.
  /** @noinline */
  function workLoopSync() {
    // Already timed out, so perform work without checking if we need to yield.
    while (workInProgress !== null) {
      performUnitOfWork(workInProgress);
    }
  }

  /** @noinline */
  function workLoopConcurrent() {
    // Perform work until Scheduler asks us to yield
    while (workInProgress !== null && !shouldYield()) {
      performUnitOfWork(workInProgress);
    }
  }

  function performUnitOfWork(unitOfWork) {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    const current = unitOfWork.alternate;

    let next;
    //   if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    //     startProfilerTimer(unitOfWork);
    //     next = beginWork(current, unitOfWork, subtreeRenderLanes);
    //     stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
    //   } else {
    next = beginWork(current, unitOfWork, subtreeRenderLanes);
    //   }

    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    if (next === null) {
      // If this doesn't spawn new work, complete the current work.
      completeUnitOfWork(unitOfWork);
    } else {
      workInProgress = next;
    }

    ReactCurrentOwner.current = null;
  }

  function commitRoot(root) {
    const renderPriorityLevel = getCurrentPriorityLevel();
    runWithPriority(
      ImmediatePriority,
      commitRootImpl.bind(null, root, renderPriorityLevel)
    );

    return null;
  }

  function commitRootImpl(root, renderPriorityLevel) {
    console.error("todo commitRootImpl...");
    do {
      // `flushPassiveEffects` will call `flushSyncUpdateQueue` at the end, which
      // means `flushPassiveEffects` will sometimes result in additional
      // passive effects. So we need to keep flushing in a loop until there are
      // no more pending effects.
      // TODO: Might be better if `flushPassiveEffects` did not automatically
      // flush synchronous work at the end, to avoid factoring hazards like this.
      flushPassiveEffects();
    } while (rootWithPendingPassiveEffects !== null);
  }

  function prepareFreshStack(root, lanes) {
    root.finishedWork = null;
    root.finishedLanes = NoLanes$1;

    const timeoutHandle = root.timeoutHandle;
    if (timeoutHandle !== noTimeout) {
      // The root previous suspended and scheduled a timeout to commit a fallback
      // state. Now that we have additional work, cancel the timeout.
      root.timeoutHandle = noTimeout;
      // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
      cancelTimeout(timeoutHandle);
    }

    if (workInProgress !== null) {
      let interruptedWork = workInProgress.return;
      console.log("unwindInterruptedWork..");
      while (interruptedWork !== null) {
        unwindInterruptedWork(interruptedWork, workInProgressRootRenderLanes);
        interruptedWork = interruptedWork.return;
      }
    }

    workInProgressRoot = root;
    workInProgress = createWorkInProgress(root.current, null);
    workInProgressRootRenderLanes = subtreeRenderLanes = workInProgressRootIncludedLanes = lanes;
    workInProgressRootExitStatus = RootIncomplete;

    workInProgressRootSkippedLanes = NoLanes$1;
    workInProgressRootUpdatedLanes = NoLanes$1;
    workInProgressRootPingedLanes = NoLanes$1;

    enqueueInterleavedUpdates();
  }

  function startWorkOnPendingInteractions(root, lanes) {
    if (!enableSchedulerTracing) {
      return;
    }
  }

  function handleError(root, thrownValue) {
    do {
      let erroredWork = workInProgress;
      try {
        // // Reset module-level state that was set during the render phase.
        // resetContextDependencies();
        // resetHooksAfterThrow();
        // resetCurrentDebugFiberInDEV();
        // // TODO: I found and added this missing line while investigating a
        // // separate issue. Write a regression test using string refs.
        // ReactCurrentOwner.current = null;

        // if (erroredWork === null || erroredWork.return === null) {
        //   // Expected to be working on a non-root fiber. This is a fatal error
        //   // because there's no ancestor that can handle it; the root is
        //   // supposed to capture all errors that weren't caught by an error
        //   // boundary.
        //   workInProgressRootExitStatus = RootFatalErrored;
        //   workInProgressRootFatalError = thrownValue;
        //   // Set `workInProgress` to null. This represents advancing to the next
        //   // sibling, or the parent if there are no siblings. But since the root
        //   // has no siblings nor a parent, we set it to null. Usually this is
        //   // handled by `completeUnitOfWork` or `unwindWork`, but since we're
        //   // intentionally not calling those, we need set it here.
        //   // TODO: Consider calling `unwindWork` to pop the contexts.
        //   workInProgress = null;
        //   return;
        // }

        // if (enableProfilerTimer && erroredWork.mode & ProfileMode) {
        //   // Record the time spent rendering before an error was thrown. This
        //   // avoids inaccurate Profiler durations in the case of a
        //   // suspended render.
        //   stopProfilerTimerIfRunningAndRecordDelta(erroredWork, true);
        // }

        // throwException(
        //   root,
        //   erroredWork.return,
        //   erroredWork,
        //   thrownValue,
        //   workInProgressRootRenderLanes
        // );
        console.log("handleError, completeUnitOfWork");
        completeUnitOfWork(erroredWork);
      } catch (yetAnotherThrownValue) {
        // Something in the return path also threw.
        thrownValue = yetAnotherThrownValue;
        if (workInProgress === erroredWork && erroredWork !== null) {
          // If this boundary has already errored, then we had trouble processing
          // the error. Bubble it to the next boundary.
          erroredWork = erroredWork.return;
          workInProgress = erroredWork;
        } else {
          erroredWork = workInProgress;
        }
        continue;
      }
      // Return to the normal work loop;
      return;
    } while (true);
  }

  function createUpdate(eventTime, lane) {
      const update = {
          eventTime,
          lane,

          tag: UpdateState,
          payload: null,
          callback: null,

          next: null,
      };

      return update;
  }

  function enqueueUpdate(fiber, update) {
      const updateQueue = fiber.updateQueue;
      if (updateQueue === null) {
          // Only occurs if the fiber has been unmounted.
          return;
      }

      const sharedQueue = updateQueue.shared;
      const pending = sharedQueue.pending;
      if (pending === null) {
          // This is the first update. Create a circular list.
          update.next = update;
      } else {
          update.next = pending.next;
          pending.next = update;
      }

      sharedQueue.pending = update;
  }

  const UpdateState = 0;
  const ReplaceState = 1;
  const ForceUpdate = 2;
  const CaptureUpdate = 3;

  function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
    return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
  }

  function updateContainer(element, container, parentComponent, callback) {
    const current = container.current;
    const eventTime = requestEventTime();

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
      update.callback = callback;
    }

    enqueueUpdate(current, update);
    scheduleUpdateOnFiber(current, lane, eventTime);

    return lane;
  }

  function getPublicRootInstance(container) {
    const containerFiber = container.current;
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

  const ELEMENT_NODE = 1;
  const TEXT_NODE = 3;
  const COMMENT_NODE = 8;
  const DOCUMENT_NODE = 9;
  const DOCUMENT_FRAGMENT_NODE = 11;


  function isValidContainer(node) {
    return !!(
      node &&
      (node.nodeType === ELEMENT_NODE ||
        node.nodeType === DOCUMENT_NODE ||
        node.nodeType === DOCUMENT_FRAGMENT_NODE ||
        (node.nodeType === COMMENT_NODE &&
          node.nodeValue === " react-mount-point-unstable "))
    );
  }
  function render(element, container, callback) {
    if (!isValidContainer(container)) {
      console.error("Target container is not a DOM element.");
      return;
    }
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback
    );
  }

  function legacyRenderSubtreeIntoContainer(
    parentComponent,
    children,
    container,
    forceHydrate,
    callback
  ) {
    let root = container._reactRootContainer;
    let fiberRoot;
    if (!root) {
      // Initial mount 初次渲染
      root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
        container,
        forceHydrate
      );
      fiberRoot = root._internalRoot;

      // if (typeof callback === "function") {
      //   const originalCallback = callback;
      //   const callback = function () {
      //     const instance = getPublicRootInstance(fiberRoot);
      //     originalCallback.call(instance);
      //   };
      // }

      // Initial mount should not be batched.
      unbatchedUpdates(() => {
        updateContainer(children, fiberRoot, parentComponent, callback);
      });
    } else {
      fiberRoot = root._internalRoot;
      // if (typeof callback === "function") {
      //   const originalCallback = callback;
      //   const callback = function () {
      //     const instance = getPublicRootInstance(fiberRoot);
      //     originalCallback.call(instance);
      //   };
      // }

      // Update
      updateContainer(children, fiberRoot, parentComponent, callback);
    }

    return getPublicRootInstance(fiberRoot);
  }



  function legacyCreateRootFromDOMContainer(container, forceHydrate) {
    return createLegacyRoot(container);
  }

  function createLegacyRoot(container, options) {
    return new ReactDOMBlockingRoot(container, LegacyRoot, options);
  }

  function ReactDOMBlockingRoot(container, tag, options) {
    this._internalRoot = createRootImpl(container, tag, options);
  }

  function createRootImpl(container, tag, options) {
      // Tag is either LegacyRoot or Concurrent Root
      const hydrate = options != null && options.hydrate === true;
      const hydrationCallbacks = (options != null && options.hydrationCallbacks) || null;

      const root = createContainer(container, tag, hydrate, hydrationCallbacks);
      markContainerAsRoot(root.current, container);

      const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
      listenToAllSupportedEvents(rootContainerElement);

      return root;
  }

  const randomKey = Math.random()
    .toString(36)
    .slice(2);
  const internalContainerInstanceKey = '__reactContainer$' + randomKey;

  function markContainerAsRoot(hostRoot, node) {
      node[internalContainerInstanceKey] = hostRoot;
  }

  const listeningMarker =
    '_reactListening' +
    Math.random()
      .toString(36)
      .slice(2);

  const allNativeEvents = new Set();

  function listenToAllSupportedEvents(rootContainerElement) {
      if(!(rootContainerElement[listeningMarker])) {
          rootContainerElement[listeningMarker] = true; 
          allNativeEvents.forEach(domEventName => {
              // We handle selectionchange separately because it
              // doesn't bubble and needs to be on the document.
              if(domEventName !== 'selectionchange') {
                  if(!nonDelegatedEvents.has(domEventName)) {
                      listenToNativeEvent(domEventName, false, rootContainerElement);
                  }
                  listenToNativeEvent(domEventName, true, rootContainerElement);  
              }
          });

          const ownerDocument = rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
          if (ownerDocument !== null) {
              // The selectionchange event also needs deduplication
              // but it is attached to the document.
              if (!ownerDocument[listeningMarker]) {
                  ownerDocument[listeningMarker] = true; 
                  listenToNativeEvent('selectionchange', false, ownerDocument);
              }
          }
      }
  }
  const IS_CAPTURE_PHASE = 1 << 2;

  function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
      let eventSystemFlags = 0; 
      if (isCapturePhaseListener) {
          eventSystemFlags |= IS_CAPTURE_PHASE;
      }
      // ...
      // addTrappedEventListener(
      //     target,
      //     domEventName,
      //     eventSystemFlags,
      //     isCapturePhaseListener
      // )
  }

  const React = {
    createElement,
    render,
  };

  exports.createElement = createElement;
  exports.default = React;
  exports.render = render;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
