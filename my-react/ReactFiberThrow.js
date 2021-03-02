import { Incomplete } from "./ReactFiberFlags";

export function throwException(
  root,
  returnFiber,
  sourceFiber,
  value,
  rootRenderLanes
) {
  // The source fiber did not complete
  sourceFiber.flags |= Incomplete;

  if (value !== null && typeof value === 'object' && typeof value.then === 'function') {
      // This is a wakeable.
      const wakeable = value;

      // ...省略
      const tag = sourceFiber.tag;
      if (
          
      )
  }
}
