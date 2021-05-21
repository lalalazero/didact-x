// ReactDOMComponentTree.js
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
};

module.exports = ReactDOMComponentTree;
