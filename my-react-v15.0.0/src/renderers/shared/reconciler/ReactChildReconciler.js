// ReactChildReconciler.js

var instantiateReactComponent = require('instantiateReactComponent')
var traverseAllChildren = require('traverseAllChildren')

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
};

module.exports = ReactChildReconciler;
