// ReactDOMComponentTree.js
var invariant = require('invariant')


var internalInstanceKey =
  "__reactInternalInstance$" + Math.random().toString(36).slice(2);
/**
 * Drill down (through composites and empty components) until we get a native or
 * native text component.
 *
 * This is pretty polymorphic but unavoidable with the current structure we have
 * for `_renderedChildren`.
 */
function getRenderedNativeOrTextFromComponent(component) {
  var rendered;
  while ((rendered = component._renderedComponent)) {
    component = rendered;
  }

  return component;
}
var ReactDOMComponentTree = {
  precacheNode: function (inst, node) {
    var nativeInst = getRenderedNativeOrTextFromComponent(inst);
    nativeInst._nativeNode = node;
    node[internalInstanceKey] = nativeInst;
  },
  getNodeFromInstance: getNodeFromInstance,
};


/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
 function getNodeFromInstance(inst) {
  // Without this first invariant, passing a non-DOM-component triggers the next
  // invariant for a missing parent, which is super confusing.
  invariant(
    inst._nativeNode !== undefined,
    'getNodeFromInstance: Invalid argument.'
  );

  if (inst._nativeNode) {
    return inst._nativeNode;
  }

  // Walk up the tree until we find an ancestor whose DOM node we have cached.
  var parents = [];
  while (!inst._nativeNode) {
    parents.push(inst);
    invariant(
      inst._nativeParent,
      'React DOM tree root should always have a node reference.'
    );
    inst = inst._nativeParent;
  }

  // Now parents contains each ancestor that does *not* have a cached native
  // node, and `inst` is the deepest ancestor that does.
  // for (; parents.length; inst = parents.pop()) {
    // precacheChildNodes(inst, inst._nativeNode);
  // }

  return inst._nativeNode;
}

module.exports = ReactDOMComponentTree;
