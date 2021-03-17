import { markContainerAsRoot } from './ReactDOMComponentTree'
import { createContainer } from './ReactFiberReconciler'


export const LegacyRoot = 0
export const ConcurrentRoot = 1

export function ReactDOMLegacyRoot(container) {
    this._internalRoot = createRootImpl(container, LegacyRoot)
}

function createRootImpl(container, tag) {
    const root = createContainer(container, tag)
    markContainerAsRoot(root.current, container)

    return root
}
