
function createInternalComponent(element) {
    return ReactDOMComponent(element)
}

var ReactNativeComponent = {
    createInternalComponent: createInternalComponent,
}

module.exports = ReactNativeComponent