// ReactDOMComponent.js

var ReactMultiChild = require("ReactMultiChild");
var DOMNamespaces = require("DOMNamespaces");
var DOMLazyTree = require("DOMLazyTree");
var ReactDOMComponentTree = require('ReactDOMComponentTree');


var getNode = ReactDOMComponentTree.getNodeFromInstance;


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
  mountComponent: function (
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    // console.log("enter --> ReactDOMComponent.mountComponent");
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
  receiveComponent: function (nextElement, transaction, context) {
    var prevElement = this._currentElement;
    this._currentElement = nextElement;
    this.updateComponent(transaction, prevElement, nextElement, context);
  },
  /**
   * Updates a native DOM component after it has already been allocated and
   * attached to the DOM. Reconciles the root DOM node, then recurses.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @param {ReactElement} nextElement
   * @internal
   * @overridable
   */
  updateComponent: function (transaction, prevElement, nextElement, context) {
    var lastProps = prevElement.props;
    var nextProps = this._currentElement.props;

    switch (
      this._tag
      // case "button":
      // lastProps = ReactDOMButton.getNativeProps(this, lastProps);
      // nextProps = ReactDOMButton.getNativeProps(this, nextProps);
      // break;
      // case "input":
      //   ReactDOMInput.updateWrapper(this);
      //   lastProps = ReactDOMInput.getNativeProps(this, lastProps);
      //   nextProps = ReactDOMInput.getNativeProps(this, nextProps);
      //   break;
      // case "option":
      //   lastProps = ReactDOMOption.getNativeProps(this, lastProps);
      //   nextProps = ReactDOMOption.getNativeProps(this, nextProps);
      //   break;
      // case "select":
      //   lastProps = ReactDOMSelect.getNativeProps(this, lastProps);
      //   nextProps = ReactDOMSelect.getNativeProps(this, nextProps);
      //   break;
      // case "textarea":
      //   ReactDOMTextarea.updateWrapper(this);
      //   lastProps = ReactDOMTextarea.getNativeProps(this, lastProps);
      //   nextProps = ReactDOMTextarea.getNativeProps(this, nextProps);
      //   break;
    ) {
    }

    // assertValidProps(this, nextProps);
    // this._updateDOMProperties(lastProps, nextProps, transaction);
    this._updateDOMChildren(lastProps, nextProps, transaction, context);

    if (this._tag === "select") {
      // <select> value update needs to occur after <option> children
      // reconciliation
      // transaction.getReactMountReady().enqueue(postUpdateSelectWrapper, this);
    }
  },
  _updateDOMChildren: function (lastProps, nextProps, transaction, context) {
    var lastContent = CONTENT_TYPES[typeof lastProps.children]
      ? lastProps.children
      : null;
    var nextContent = CONTENT_TYPES[typeof nextProps.children]
      ? nextProps.children
      : null;

    var lastHtml =
      lastProps.dangerouslySetInnerHTML &&
      lastProps.dangerouslySetInnerHTML.__html;
    var nextHtml =
      nextProps.dangerouslySetInnerHTML &&
      nextProps.dangerouslySetInnerHTML.__html;

    // Note the use of `!=` which checks for null or undefined.
    var lastChildren = lastContent != null ? null : lastProps.children;
    var nextChildren = nextContent != null ? null : nextProps.children;

    // If we're switching from children to content/html or vice versa, remove
    // the old content
    var lastHasContentOrHtml = lastContent != null || lastHtml != null;
    var nextHasContentOrHtml = nextContent != null || nextHtml != null;
    if (lastChildren != null && nextChildren == null) {
      this.updateChildren(null, transaction, context);
    } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
      this.updateTextContent("");
    }

    if (nextContent != null) {
      if (lastContent !== nextContent) {
        this.updateTextContent("" + nextContent);
      }
    } else if (nextHtml != null) {
      if (lastHtml !== nextHtml) {
        this.updateMarkup("" + nextHtml);
      }
    } else if (nextChildren != null) {
      this.updateChildren(nextChildren, transaction, context);
    }
  },
  getNativeNode: function () {
    return getNode(this);
  },
};
Object.assign(
  ReactDOMComponent.prototype,
  ReactDOMComponent.Mixin,
  ReactMultiChild.Mixin
);

module.exports = ReactDOMComponent;
