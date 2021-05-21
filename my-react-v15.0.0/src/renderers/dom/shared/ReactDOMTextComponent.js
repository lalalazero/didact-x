// ReactDOMTextComponent.js
var ReactDOMTextComponent = function (text) {
  // TODO: This is really a ReactText (ReactNode), not a ReactElement
  this._currentElement = text;
  this._stringText = "" + text;

  // ReactDOMComponentTree uses these:
  this._nativeNode = null;
  this._nativeParent = null;

  // Properties
  this._domID = null;
  this._mountIndex = 0;
  this._closingComment = null;
  this._commentNodes = null;
};

Object.assign(ReactDOMTextComponent.prototype, {
  mountComponent: function (
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    console.log("enter ---> ReactDOMTextComponent.mountComponent");

    var domID = nativeContainerInfo._idCounter++;
    var openingValue = " react-text: " + domID + " ";
    var closingValue = " /react-text ";
    this._domID = domID;
    this._nativeParent = nativeParent;
    if (transaction.useCreateElement) {
      var ownerDocument = nativeContainerInfo._ownerDocument;
      var openingComment = ownerDocument.createComment(openingValue);
      var closingComment = ownerDocument.createComment(closingValue);
      var lazyTree = DOMLazyTree(ownerDocument.createDocumentFragment());
      DOMLazyTree.queueChild(lazyTree, DOMLazyTree(openingComment));
      if (this._stringText) {
        DOMLazyTree.queueChild(
          lazyTree,
          DOMLazyTree(ownerDocument.createTextNode(this._stringText))
        );
      }
      DOMLazyTree.queueChild(lazyTree, DOMLazyTree(closingComment));
      // ReactDOMComponentTree.precacheNode(this, openingComment);
      this._closingComment = closingComment;
      return lazyTree;
    } else {
    }
  },
  receiveComponent: function () {
    console.log("todo mountComponent..");
  },
});

module.exports = ReactDOMTextComponent;
