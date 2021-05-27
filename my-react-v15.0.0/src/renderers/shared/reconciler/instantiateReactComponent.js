// instantiateReactComponent.js
// To avoid a cyclic dependency, we create the final class in this module

var ReactNativeComponent = require('ReactNativeComponent')
var ReactCompositeComponent = require('ReactCompositeComponent')


var ReactCompositeComponentWrapper = function (element) {
  this.construct(element);
};
Object.assign(
  ReactCompositeComponentWrapper.prototype,
  ReactCompositeComponent.Mixin,
  {
    _instantiateReactComponent: instantiateReactComponent,
  }
);
function isInternalComponentType(type) {
  return (
    typeof type === "function" &&
    typeof type.prototype !== "undefined" &&
    typeof type.prototype.mountComponent === "function" &&
    typeof type.prototype.receiveComponent === "function"
  );
}
function instantiateReactComponent(node) {
  var instance;
  if (node === null || node === false) {
    console.warn("省略 null / false 的逻辑");
    // instance = ReactEmptyComponent.create(instantiateReactComponent)
  } else if (typeof node === "object") {
    var element = node;
    if (typeof element.type === "string") {
      instance = ReactNativeComponent.createInternalComponent(element);
    } else if (isInternalComponentType(element.type)) {
      instance = new element.type(element);
    } else {
      instance = new ReactCompositeComponentWrapper(element);
    }
  } else if (typeof node === "string" || typeof node === "number") {
    instance = ReactNativeComponent.createInstanceForText(node);
  } else {
    invariant(false, "Encountered invalid React node of type %s", typeof node);
  }

  instance._mountIndex = 0;
  instance._mountImage = null;
  return instance;
}

module.exports = instantiateReactComponent;
