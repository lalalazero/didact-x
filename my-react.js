function render(element, container, callback){
    return legacyRenderSubtreeIntoContainer(
        null,
        element,
        container,
        false,
        callback
    )
}

function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback){
    let root = container._reactRootContainer
    let fiberRoot;
    if(!root) {
        // Initial mount 初次渲染
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate)
        fiberRoot = root._internalRoot;

        if(typeof callback === 'function') {
            const originalCallback = callback 
            const callback = function(){
                const instance = getPublicRootInstance(fiberRoot)
                originalCallback.call(instance)
            }
        }
        // Initial mount should not be batched.
        unbatchedUpdates(()=>{
            updateContainer(children, fiberRoot, parentComponent, callback)
        })
    }else{
        fiberRoot = root._internalRoot
        if(typeof callback === 'function') {
            const originalCallback = callback 
            const callback = function(){
                const instance = getPublicRootInstance(fiberRoot)
                originalCallback.call(instance)
            }
        }

        // Update
        updateContainer(children, fiberRoot, parentComponent, callback)
    }

    return getPublicRootInstance(fiberRoot)
}
