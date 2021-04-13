var ReactDOMEmptyComponent = require("../ReactDOMEmptyComponent");
var ReactNativeComponent = require("../ReactNativeComponent");

// To avoid a cyclic dependency, we create the final class in this module
var ReactCompositeComponentWrapper = function (element) {
  this.construct(element);
};
Object.assign(ReactCompositeComponentWrapper.prototype, {
  _instantiateReactComponent: instantiateReactComponent,
});

/**
 * Given a ReactNode, create an instance that will actually be mounted.
 *
 * @param {ReactNode} node
 * @return {object} A new instance of the element's constructor.
 * @protected
 */
function instantiateReactComponent(node) {
  var instance;

  if (node === null || node === false) {
    instance = ReactDOMEmptyComponent(instantiateReactComponent);
  } else if (typeof node === "object") {
    var element = node;

    // Special case string values
    if (typeof element.type === "string") {
      instance = ReactNativeComponent.createInternalComponent(element);
    } else if (isInternalComponentType(element.type)) {
      // This is temporarily available for custom components that are not string
      // representations. I.e. ART. Once those are updated to use the string
      // representation, we can drop this code path.
      instance = new element.type(element);
    } else {
      instance = new ReactCompositeComponentWrapper(element);
    }
  } else if (typeof node === "string" || typeof node === "number") {
    instance = ReactNativeComponent.createInstanceForText(node);
  } else {
    invariant(false, "Encountered invalid React node of type %s", typeof node);
  }

  // These two fields are used by the DOM and ART diffing algorithms
  // respectively. Instead of using expandos on components, we should be
  // storing the state needed by the diffing algorithms elsewhere.
  instance._mountIndex = 0;
  instance._mountImage = null;

  return instance;
}

/**
 * Check if the type reference is a known internal type. I.e. not a user
 * provided composite type.
 *
 * @param {function} type
 * @return {boolean} Returns true if this is a valid internal type.
 */
function isInternalComponentType(type) {
  return (
    typeof type === "function" &&
    typeof type.prototype !== "undefined" &&
    typeof type.prototype.mountComponent === "function" &&
    typeof type.prototype.receiveComponent === "function"
  );
}

module.exports = instantiateReactComponent;
