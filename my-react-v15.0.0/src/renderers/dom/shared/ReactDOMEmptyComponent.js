'use strict';

var DOMLazyTree = require('./DOMLazyTree');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');


var ReactDOMEmptyComponent = function(instantiate) {
  // ReactCompositeComponent uses this:
  this._currentElement = null;
  // ReactDOMComponentTree uses these:
  this._nativeNode = null;
  this._nativeParent = null;
  this._nativeContainerInfo = null;
  this._domID = null;
};
Object.assign(ReactDOMEmptyComponent.prototype, {
  mountComponent: function(
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    var domID = nativeContainerInfo._idCounter++;
    this._domID = domID;
    this._nativeParent = nativeParent;
    this._nativeContainerInfo = nativeContainerInfo;

    var nodeValue = ' react-empty: ' + this._domID + ' ';
    if (transaction.useCreateElement) {
      var ownerDocument = nativeContainerInfo._ownerDocument;
      var node = ownerDocument.createComment(nodeValue);
      ReactDOMComponentTree.precacheNode(this, node);
      return DOMLazyTree(node);
    } else {
      if (transaction.renderToStaticMarkup) {
        // Normally we'd insert a comment node, but since this is a situation
        // where React won't take over (static pages), we can simply return
        // nothing.
        return '';
      }
      return '<!--' + nodeValue + '-->';
    }
  },
  receiveComponent: function() {
  },
  getNativeNode: function() {
    return ReactDOMComponentTree.getNodeFromInstance(this);
  },
  unmountComponent: function() {
    ReactDOMComponentTree.uncacheNode(this);
  },
});

module.exports = ReactDOMEmptyComponent;