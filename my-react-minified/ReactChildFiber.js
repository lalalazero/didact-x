import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from "./ReactSymbols";
import { createFiberFromElement, createFiberFromText, createWorkInProgress } from "./ReactFiber";

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);

function ChildReconciler(shouldTrackSideEffects) {
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
    
  }
  function placeSingleChild(newFiber) {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }
  function useFiber(fiber, pendingProps) {
    // We currently set sibling to null and index to 0 here because it is easy
    // to forget to do before returning it. E.g. for the single child case.
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if(!shouldTrackSideEffects) {
      return null
    }

    // TODO: For the shouldClone case, this could be micro-optimized a bit by
    // assuming that after the first child we've already added everything.
    // let childToDelete = currentFirstChild;
    // while (childToDelete !== null) {
    //   deleteChild(returnFiber, childToDelete);
    //   childToDelete = childToDelete.sibling;
    // }
    // return null;
  }
  function reconcileSingleTextNode(
    returnFiber,
    currentFirstChild,
    textContent,
    lanes
  ) {
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
      const existing = useFiber(currentFirstChild, textContent);
      existing.return = returnFiber;
      return existing;
    }

    deleteRemainingChildren(returnFiber, currentFirstChild);
    const created = createFiberFromText(textContent, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleElement(
    returnFiber,
    currentFirstChild,
    element,
    lanes
  ) {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) { // 暂时不会进到这里
      console.error('不应该进到这里，需要再完善代码')
      if (child.key === key) {
        const elementType = element.type;
        if (elementType === REACT_FRAGMENT_TYPE) {
          // ...省略
        } else {
          if (child.elementType === elementType) {
            deleteRemainingChildren(returnFiber, child.sibling);
            const existing = useFiber(child, element.props);
            existing.return = returnFiber;
            return existing;
          }
        }
        // Didn't match.
        deleteRemainingChildren(returnFiber, child);
        break;
      } else {
        // deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }

    if (element.type === REACT_FRAGMENT_TYPE) {
      // ...省略
    } else {
      const created = createFiberFromElement(element, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    }
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
    // 换行
    // 换行
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

    // Handle object types
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
      }
    }

    if (typeof newChild === "string" || typeof newChild === "number") { // 这里暂时也没有进
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

    // ...省略其他
    // Remaining cases are all treated as empty.
    return deleteRemainingChildren(returnFiber, currentFirstChild)
  }

  return reconcileChildFibers;
}
