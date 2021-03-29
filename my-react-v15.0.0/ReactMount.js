var ReactMount = {
    renderSubtreeIntoContainer: function(parentComponent, nextElement, container, callback) {
        return ReactMount._renderSubtreeIntoContainer(parentComponent, nextElement, container, callback)
    },
    render: function(nextElement, container, callback) {
        return ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback)
    },
    _renderSubtreeIntoContainer: function(parentComponent, nextElement, container, callback) {
        var nextWrappedElement = ReactElement(TopLevelWrapper, null, null, null, null, null, nextElement)
        // 省略 prevComponent 的逻辑
        var prevComponent = null

        var reactRootElement = getReactRootElementInContainer(container)
        var containerHasReactMarkup = reactRootElement && !!internalGetID(reactRootElement) 
        var containerHasNonRootReactChild = hasNonRootReactChild(container)

        var shouldReuseMarkup = containerHasReactMarkup && !prevComponent && !containerHasNonRootReactChild

        var component = ReactMount._renderNewRootComponent(
            nextWrappedElement,
            container,
            shouldReuseMarkup,
            parentComponent != null ? parentComponent._reactInternalInstance._processChildContext(parentComponent._reactInternalInstance._context) : emptyObject
        )._renderedComponent.getPublicInstance()

        return component
    }
}


module.exports = ReactMount