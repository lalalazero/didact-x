var ReactElement = require('./ReactElement')
var ReactDOMComponentTree = require('./ReactDOMComponentTree')
var instantiateReactComponent = require('./reconciler/instantiateReactComponent')
var ReactUpdates = require('./reconciler/ReactUpdates')

var DOC_NODE_TYPE = 9;


var topLevelRootCounter = 1;
var TopLevelWrapper = function() {
  this.rootID = topLevelRootCounter++
}
TopLevelWrapper.prototype.isReactElement = {}
TopLevelWrapper.prototype.render = function() {
  // this.props 事实上是一个 ReactElement
  return this.props
}


var ReactMount = {
  renderSubtreeIntoContainer: function (
    parentComponent,
    nextElement,
    container,
    callback
  ) {
    return ReactMount._renderSubtreeIntoContainer(
      parentComponent,
      nextElement,
      container,
      callback
    );
  },
  render: function (nextElement, container, callback) {
    return ReactMount._renderSubtreeIntoContainer(
      null,
      nextElement,
      container,
      callback
    );
  },
  _renderSubtreeIntoContainer: function (
    parentComponent,
    nextElement,
    container,
    callback
  ) {
    var nextWrappedElement = ReactElement(
      TopLevelWrapper,
      null,
      null,
      null,
      null,
      null,
      nextElement
    );
    // 省略 prevComponent 的逻辑
    var prevComponent = null;

    var reactRootElement = getReactRootElementInContainer(container);
    var containerHasReactMarkup =
      reactRootElement && !!internalGetID(reactRootElement);
    var containerHasNonRootReactChild = hasNonRootReactChild(container);

    var shouldReuseMarkup =
      containerHasReactMarkup &&
      !prevComponent &&
      !containerHasNonRootReactChild;

    var component = ReactMount._renderNewRootComponent(
      nextWrappedElement,
      container,
      shouldReuseMarkup,
      parentComponent != null
        ? parentComponent._reactInternalInstance._processChildContext(
            parentComponent._reactInternalInstance._context
          )
        : emptyObject
    )._renderedComponent.getPublicInstance();

    return component;
  },
  _renderNewRootComponent: function(
    nextElement,
    container,
    shouldReuseMarkup,
    context
  ) {
    var componentInstance = instantiateReactComponent(nextElement)

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.

    // 初次渲染是同步的，之后发生在 componentWillMount 和 componentDidMount 的 re-render 的更新都会根据当前的更新策略做 batch 批量处理

    ReactUpdates.batchedUpdates(
      batchedMountComponentIntoNode,
      componentInstance,
      container,
      shouldReuseMarkup,
      context
    );

    var wrapperID = componentInstance._instance.rootID;
    instancesByReactRootID[wrapperID] = componentInstance;

    return componentInstance;
  }
};

function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

function internalGetID(node) {
  // If node is something like a window, document, or text node, none of
  // which support attributes or a .getAttribute method, gracefully return
  // the empty string, as if the attribute were missing.
  // 如果是 window, document 或者是文本节点，这些不支持属性的节点直接返回空字符串
  return node.getAttribute && node.getAttribute(ATTR_NAME) || ''
}

// 返回 true 如果 DOM element 包含一个直接的由 React 渲染的子节点但是其本身不是 root element
function hasNonRootReactChild(container) {
  var rootEl = getReactRootElementInContainer(container)
  if (rootEl) {
    var inst = ReactDOMComponentTree.getInstanceFromNode(rootEl)
    return !!(inst && inst._nativeParent)
  }
}

module.exports = ReactMount;
