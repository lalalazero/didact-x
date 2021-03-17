import { ReactDOMLegacyRoot } from './ReactDOMRoot.js'
import { updateContainer } from './ReactFiberReconciler'
import { unbatchedUpdates } from './ReactFiberWorkLoop'

export function legacyRenderSubtreeIntoContainer(parentComponent, children, container) {
    let root = container_reactRootContainer
    let fiberRoot
    if(!root) {
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container)
        fiberRoot = root._internalRoot;
        unbatchedUpdates(() => {
            updateContainer(children, fiberRoot, parentComponent)
        })
    }else{
        fiberRoot = root_internalRoot;
        updateContainer(children, fiberRoot, parentComponent)
    }
}

function legacyCreateRootFromDOMContainer(container) {
    return new ReactDOMLegacyRoot(container)
}