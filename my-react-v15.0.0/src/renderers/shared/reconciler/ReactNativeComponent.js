
function createInternalComponent(element) {
    return new ReactDOMComponent(element)
}

var ReactNativeComponent = {
    createInternalComponent: createInternalComponent,
}

module.exports = ReactNativeComponent