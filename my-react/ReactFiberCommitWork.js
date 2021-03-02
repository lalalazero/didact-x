import { NoFlags } from "./ReactFiberFlags";

let nextEffect = null;

export function commitPassiveUnmountEffects(firstChild) {
  nextEffect = firstChild;
  commitPassiveUnmountEffects_begin();
}

function commitPassiveUnmountEffects_begin() {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    const child = fiber.child;

    if ((nextEffect.flags & ChildDeletion) !== NoFlags) {
      const deletions = fiber.deletions;
      if (deletions !== null) {
        for (let i = 0; i < deletions.length; i++) {
          const fiberToDelete = deletions[i];
          nextEffect = fiberToDelete;
          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
            fiberToDelete,
            fiber
          );

          // Now that passive effects have been processed, it's safe to detach lingering pointers.
          const alternate = fiberToDelete.alternate;
          detachFiberAfterEffects(fiberToDelete);
          if (alternate !== null) {
            detachFiberAfterEffects(alternate);
          }
        }

        nextEffect = fiber;
      }
    }

    if ((fiber.subtreeFlags & PassiveMask) !== NoFlags && child !== null) {
      ensureCorrectReturnPointer(child, fiber);
      nextEffect = child;
    } else {
      commitPassiveUnmountEffects_complete();
    }
  }
}

function commitPassiveUnmountEffects_complete() {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    if ((fiber.flags & Passive) !== NoFlags) {
      // setCurrentDebugFiberInDEV(fiber);
      commitPassiveUnmountOnFiber(fiber);
      // resetCurrentDebugFiberInDEV();
    }

    const sibling = fiber.sibling;
    if (sibling !== null) {
      ensureCorrectReturnPointer(sibling, fiber.return);
      nextEffect = sibling;
      return;
    }

    nextEffect = fiber.return;
  }
}

function commitPassiveUnmountOnFiber(finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwarfRef:
    case SimpleMemoComponent: {
      // if (
      //     enableProfilerTimer &&
      //     enableProfilerCommitHooks &&
      //     finishedWork.mode & ProfileMode
      //   ) {
      //     startPassiveEffectTimer();
      //     commitHookEffectListUnmount(
      //       HookPassive | HookHasEffect,
      //       finishedWork,
      //       finishedWork.return,
      //     );
      //     recordPassiveEffectDuration(finishedWork);
      //   } else {
      commitHookEffectListUnmount(
        HookPassive | HookHasEffect,
        finishedWork,
        finishedWork.return
      );
      //   }

      break;
    }
  }
}

function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor) {
    const updateQueue = finishedWork.updateQueue
    const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
    if (lastEffect !== null) {
        const firstEffect = lastEffect.next;
        let effect = firstEffect;
        do {
            if ((effect.tag & flags) === flags) {
                // Unmount
                const destroy = effect.destroy;
                effect.destroy = undefined;
                if (destroy !== undefined) {
                    safelyCallDestroy(finishedWork, nearestMountedAncestor)
                }
            }
            effect = effect.next;
        } while (effect !== firstEffect)
    }
}
