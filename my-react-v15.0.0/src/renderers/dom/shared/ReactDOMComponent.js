// ReactDOMComponent.js
var globalIdCounter = 1;
var CONTENT_TYPES = { string: true, number: true };
function ReactDOMComponent(element) {
  var tag = element.type;
  // validateDangerousTag(tag);
  this._currentElement = element;
  this._tag = tag.toLowerCase();
  this._namespaceURI = null;
  this._renderedChildren = null;
  this._previousStyle = null;
  this._previousStyleCopy = null;
  this._nativeNode = null;
  this._nativeParent = null;
  this._rootNodeID = null;
  this._domID = null;
  this._nativeContainerInfo = null;
  this._wrapperState = null;
  this._topLevelWrapper = null;
  this._flags = 0;
}

ReactDOMComponent.displayName = "ReactDOMComponent";
ReactDOMComponent.Mixin = {
  _updateDOMProperties: function (lastProps, nextProps, transaction) {},
  mountComponent: function (
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    console.log("enter --> ReactDOMComponent.mountComponent");
    this._rootNodeID = globalIdCounter++;
    this._domID = nativeContainerInfo._idCounter++;
    this._nativeParent = nativeParent;
    this._nativeContainerInfo = nativeContainerInfo;

    var props = this._currentElement.props;

    switch (this._tag) {
      // 省略其他情况
      case "object":
        this._wrapperState = {
          listeners: null,
        };
        // transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
      case "button":
        // props = ReactDOMButton.getNativeProps(this, props, nativeParent);
        break;
      default:
        break;
    }

    // assertValidProps(this, props)

    var namespaceURI;
    var parentTag;
    if (nativeParent != null) {
      namespaceURI = nativeParent._namespaceURI;
      parentTag = nativeParent._tag;
    } else if (nativeContainerInfo._tag) {
      namespaceURI = nativeContainerInfo._namespaceURI;
      parentTag = nativeContainerInfo._tag;
    }

    if (
      namespaceURI == null ||
      (namespaceURI === DOMNamespaces.svg && parentTag === "foreignobject")
    ) {
      namespaceURI = DOMNamespaces.html;
    }
    if (namespaceURI === DOMNamespaces.html) {
      if (this._tag === "svg") {
        namespaceURI = DOMNamespaces.svg;
      } else if (this._tag === "math") {
        namespaceURI = DOMNamespaces.mathml;
      }
    }

    this._namespaceURI = namespaceURI;

    var mountImage;
    transaction.useCreateElement = true;
    if (transaction.useCreateElement) {
      var ownerDocument = nativeContainerInfo._ownerDocument;
      var el;
      if (namespaceURI === DOMNamespaces.html) {
        if (this._tag === "script") {
        } else {
          el = ownerDocument.createElement(this._currentElement.type);
        }
      } else {
        el = ownerDocument.createElementNS(
          namespaceURI,
          this._currentElement.type
        );
      }

      // ReactDOMComponentTree.precacheNode(this, el);
      // this._flags != Flags.hasCachedChildNodes;
      // if (!this._nativeParent) {
      //   DOMPropertyOperations.setAttributeForRoot(el);
      // }
      // this._updateDOMProperties(null, props, transaction);
      var lazyTree = DOMLazyTree(el);
      this._createInitialChildren(transaction, props, context, lazyTree);
      mountImage = lazyTree;
    } else {
    }

    switch (this._tag) {
      case "button":
      case "input":
      case "select":
      case "textarea":
        if (props.autoFocus) {
          // transaction.getReactMountReady().enqueue(autoFocusUtils.focusDOMComponent, this)
        }
        break;
    }

    return mountImage;
  },
  receiveComponent: function () {
    console.log("receiveComponent todo..");
  },
  _createInitialChildren: function (transaction, props, context, lazyTree) {
    // Intentional use of != to avoid catching zero/false.
    var innerHTML = props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        DOMLazyTree.queueHTML(lazyTree, innerHTML.__html);
      }
    } else {
      var contentToUse = CONTENT_TYPES[typeof props.children]
        ? props.children
        : null;

      var childrenToUse = contentToUse != null ? null : props.children;
      if (contentToUse != null) {
        // TODO: Validate that text is allowed as a child of this node
        DOMLazyTree.queueText(lazyTree, contentToUse);
      } else if (childrenToUse != null) {
        // console.log("this", this);
        // console.log("this.prototype", this.prototype);
        var mountImages = this.mountChildren(
          childrenToUse,
          transaction,
          context
        );

        for (var i = 0; i < mountImages.length; i++) {
          DOMLazyTree.queueChild(lazyTree, mountImages[i]);
        }
      }
    }
  },
};
Object.assign(
  ReactDOMComponent.prototype,
  ReactDOMComponent.Mixin,
  ReactMultiChild.Mixin
);

module.exports = ReactDOMComponent;
