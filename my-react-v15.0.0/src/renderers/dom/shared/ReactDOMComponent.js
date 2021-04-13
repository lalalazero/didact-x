var globalIdCounter = 1;

/**
 * Creates a new React class that is idempotent and capable of containing other
 * React components. It accepts event listeners and DOM properties that are
 * valid according to `DOMProperty`.
 *
 *  - Event listeners: `onClick`, `onMouseDown`, etc.
 *  - DOM properties: `className`, `name`, `title`, etc.
 *
 * The `style` property functions differently from the DOM API. It accepts an
 * object mapping of style properties to values.
 *
 * @constructor ReactDOMComponent
 * @extends ReactMultiChild
 */
function ReactDOMComponent(element) {
  var tag = element.type;
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
    this._rootNodeID = globalIdCounter++;
    this._domID = nativeContainerInfo._idCounter++;
    this._nativeParent = nativeParent;
    this._nativeContainerInfo = nativeContainerInfo;

    var props = this._currentElement.props;

    switch (this._tag) {
      case "iframe":
      case "object":
      case "img":
      case "form":
      case "video":
      case "audio":
        this._wrapperState = {
          listeners: null,
        };
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
      case "button":
        props = ReactDOMButton.getNativeProps(this, props, nativeParent);
        break;
      case "input":
        ReactDOMInput.mountWrapper(this, props, nativeParent);
        props = ReactDOMInput.getNativeProps(this, props);
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
      case "option":
        ReactDOMOption.mountWrapper(this, props, nativeParent);
        props = ReactDOMOption.getNativeProps(this, props);
        break;
      case "select":
        ReactDOMSelect.mountWrapper(this, props, nativeParent);
        props = ReactDOMSelect.getNativeProps(this, props);
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
      case "textarea":
        ReactDOMTextarea.mountWrapper(this, props, nativeParent);
        props = ReactDOMTextarea.getNativeProps(this, props);
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
    }

    assertValidProps(this, props);

    // We create tags in the namespace of their parent container, except HTML
    // tags get no namespace.
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
    if (transaction.useCreateElement) {
      var ownerDocument = nativeContainerInfo._ownerDocument;
      var el;
      if (namespaceURI === DOMNamespaces.html) {
        if (this._tag === "script") {
          // Create the script via .innerHTML so its "parser-inserted" flag is
          // set to true and it does not execute
          var div = ownerDocument.createElement("div");
          var type = this._currentElement.type;
          div.innerHTML = `<${type}></${type}>`;
          el = div.removeChild(div.firstChild);
        } else {
          el = ownerDocument.createElement(this._currentElement.type);
        }
      } else {
        el = ownerDocument.createElementNS(
          namespaceURI,
          this._currentElement.type
        );
      }
      ReactDOMComponentTree.precacheNode(this, el);
      this._flags |= Flags.hasCachedChildNodes;
      if (!this._nativeParent) {
        DOMPropertyOperations.setAttributeForRoot(el);
      }
      this._updateDOMProperties(null, props, transaction);
      var lazyTree = DOMLazyTree(el);
      this._createInitialChildren(transaction, props, context, lazyTree);
      mountImage = lazyTree;
    } else {
      var tagOpen = this._createOpenTagMarkupAndPutListeners(
        transaction,
        props
      );
      var tagContent = this._createContentMarkup(transaction, props, context);
      if (!tagContent && omittedCloseTags[this._tag]) {
        mountImage = tagOpen + "/>";
      } else {
        mountImage =
          tagOpen + ">" + tagContent + "</" + this._currentElement.type + ">";
      }
    }

    switch (this._tag) {
      case "button":
      case "input":
      case "select":
      case "textarea":
        if (props.autoFocus) {
          transaction
            .getReactMountReady()
            .enqueue(AutoFocusUtils.focusDOMComponent, this);
        }
        break;
    }

    return mountImage;
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

    switch (this._tag) {
      case "button":
        lastProps = ReactDOMButton.getNativeProps(this, lastProps);
        nextProps = ReactDOMButton.getNativeProps(this, nextProps);
        break;
      case "input":
        ReactDOMInput.updateWrapper(this);
        lastProps = ReactDOMInput.getNativeProps(this, lastProps);
        nextProps = ReactDOMInput.getNativeProps(this, nextProps);
        break;
      case "option":
        lastProps = ReactDOMOption.getNativeProps(this, lastProps);
        nextProps = ReactDOMOption.getNativeProps(this, nextProps);
        break;
      case "select":
        lastProps = ReactDOMSelect.getNativeProps(this, lastProps);
        nextProps = ReactDOMSelect.getNativeProps(this, nextProps);
        break;
      case "textarea":
        ReactDOMTextarea.updateWrapper(this);
        lastProps = ReactDOMTextarea.getNativeProps(this, lastProps);
        nextProps = ReactDOMTextarea.getNativeProps(this, nextProps);
        break;
    }

    assertValidProps(this, nextProps);
    // Todo
    this._updateDOMProperties(lastProps, nextProps, transaction);
    this._updateDOMChildren(lastProps, nextProps, transaction, context);

    if (this._tag === "select") {
      // <select> value update needs to occur after <option> children
      // reconciliation
      transaction.getReactMountReady().enqueue(postUpdateSelectWrapper, this);
    }
  },
};

Object.assign(ReactDOMComponent.prototype, ReactDOMComponent.Mixin);

module.exports = ReactDOMComponent;
