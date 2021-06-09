// ReactChildReconciler.js

var instantiateReactComponent = require('instantiateReactComponent')
var traverseAllChildren = require('traverseAllChildren')
var shouldUpdateReactComponent = require('shouldUpdateReactComponent')
var ReactReconciler = require('ReactReconciler')

function instantiateChild(childInstances, child, name) {
  // We found a component instance.
  var keyUnique = childInstances[name] === undefined;
  if (child != null && keyUnique) {
    
    childInstances[name] = instantiateReactComponent(child);
  }
}
var ReactChildReconciler = {
  instantiateChildren: function (nestedChildNodes, transaction, context) {
    if (nestedChildNodes == null) {
      return null;
    }

    var childInstances = {};
    traverseAllChildren(nestedChildNodes, instantiateChild, childInstances);
    return childInstances;
  },

  /**
   * Updates the rendered children and returns a new set of children.
   *
   * @param {?object} prevChildren Previously initialized set of children.
   * @param {?object} nextChildren Flat child element maps.
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   * @return {?object} A new set of child instances.
   * @internal
   */
   updateChildren: function(
    prevChildren,
    nextChildren,
    removedNodes,
    transaction,
    context) {
    // We currently don't have a way to track moves here but if we use iterators
    // instead of for..in we can zip the iterators and check if an item has
    // moved.
    // TODO: If nothing has changed, return the prevChildren object so that we
    // can quickly bailout if nothing has changed.
    if (!nextChildren && !prevChildren) {
      return;
    }
    var name;
    var prevChild;
    for (name in nextChildren) {
      if (!nextChildren.hasOwnProperty(name)) {
        continue;
      }
      prevChild = prevChildren && prevChildren[name];
      var prevElement = prevChild && prevChild._currentElement;
      var nextElement = nextChildren[name];
      if (prevChild != null &&
          shouldUpdateReactComponent(prevElement, nextElement)) {
        ReactReconciler.receiveComponent(
          prevChild, nextElement, transaction, context
        );
        nextChildren[name] = prevChild;
      } else {
        if (prevChild) {
          console.warn('省略 unmount 逻辑，应该不会走这里，这里还没实现....')
          // removedNodes[name] = ReactReconciler.getNativeNode(prevChild);
          // ReactReconciler.unmountComponent(prevChild, false);
        }
        // The child must be instantiated before it's mounted.
        var nextChildInstance = instantiateReactComponent(nextElement);
        nextChildren[name] = nextChildInstance;
      }
    }
    // Unmount children that are no longer present.
    // for (name in prevChildren) {
    //   if (prevChildren.hasOwnProperty(name) &&
    //       !(nextChildren && nextChildren.hasOwnProperty(name))) {
    //     prevChild = prevChildren[name];
    //     removedNodes[name] = ReactReconciler.getNativeNode(prevChild);
    //     ReactReconciler.unmountComponent(prevChild, false);
    //   }
    // }
  },

  /**
   * Unmounts all rendered children. This should be used to clean up children
   * when this component is unmounted.
   *
   * @param {?object} renderedChildren Previously initialized set of children.
   * @internal
   */
  // unmountChildren: function(renderedChildren, safely) {
  //   for (var name in renderedChildren) {
  //     if (renderedChildren.hasOwnProperty(name)) {
  //       var renderedChild = renderedChildren[name];
  //       ReactReconciler.unmountComponent(renderedChild, safely);
  //     }
  //   }
  // },
};

module.exports = ReactChildReconciler;
