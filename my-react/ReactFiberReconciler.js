import { createFiberRoot } from './ReactFiberRoot'
import { HostComponent } from './ReactWorkTags'
import { getPublicInstance } from './ReactDOM'

export function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}

export function updateContainer(element, container, parentComponent, callback) {
  console.log('to do update container..')
}

export function getPublicRootInstance(container) {
  const containerFiber = container.current
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
