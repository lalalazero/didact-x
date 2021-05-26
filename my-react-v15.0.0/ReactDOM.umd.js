(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ReactDOM = factory());
}(this, (function () { 'use strict';

  // ReactMount.js
  var ELEMENT_NODE_TYPE = 1;
  var topLevelRootCounter = 1;
  var DOCUMENT_FRAGMENT_NODE_TYPE = 11;
  var TopLevelWrapper = function () {
    this.rootID = topLevelRootCounter++;
  };
  TopLevelWrapper.prototype.isReactComponent = {};
  TopLevelWrapper.prototype.render = function () {
    return this.props;
  };

  function mountComponentIntoNode(
    wrapperInstance,
    container,
    transaction,
    shouldReuseMarkup,
    context
  ) {
    var markup = ReactReconciler.mountComponent(
      wrapperInstance,
      transaction,
      null,
      ReactDOMContainerInfo(wrapperInstance, container),
      context
    );

    wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
    ReactMount$1._mountImageIntoNode(
      markup,
      container,
      wrapperInstance,
      shouldReuseMarkup,
      transaction
    );
  }

  function batchedMountComponentIntoNode(
    componentInstance,
    container,
    shouldReuseMarkup,
    context
  ) {
    var transaction = {};
    // 暂时省略 transaction 部分
    // var transaction = ReactUpdates.ReactReconcilerTransaction.getPooled(
    //   true
    // );
    // transaction.perform(
    //   mountComponentIntoNode,
    //   null,
    //   componentInstance,
    //   container,
    //   transaction,
    //   shouldReuseMarkup,
    //   context
    // );
    // ReactUpdates.ReactReconcilerTransaction.release(transaction);
    // 其实就是直接调用了
    mountComponentIntoNode.call(
      transaction,
      componentInstance,
      container,
      transaction,
      shouldReuseMarkup,
      context
    );
  }
  var ReactMount$1 = {
    _mountImageIntoNode: function (
      markup,
      container,
      instance,
      shouldReuseMarkup,
      transaction
    ) {
      invariant(
        container &&
          (container.nodeType === ELEMENT_NODE_TYPE ||
            container.nodeType === DOC_NODE_TYPE ||
            container.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE),
        "mountComponentIntoNode(...): Target container is not valid."
      );

      if (transaction.useCreateElement) {
        while (container.lastChild) {
          container.removeChild(container.lastChild);
        }
        DOMLazyTree.insertTreeBefore(container, markup, null);
      }
    },
    _renderNewRootComponent: function (
      nextElement,
      container,
      shouldReuseMarkup,
      context
    ) {
      var componentInstance = instantiateReactComponent(nextElement);

      ReactUpdates.batchedUpdates(
        batchedMountComponentIntoNode,
        componentInstance,
        container,
        shouldReuseMarkup,
        context
      );

      return componentInstance;
    },
    _renderSubtreeIntoContainer: function (
      parentComponent,
      nextElement,
      container,
      callback
    ) {
      var nextWrapperElement = ReactElement(
        TopLevelWrapper,
        null,
        null,
        null,
        null,
        null,
        nextElement
      );
      // 省略更新或者卸载的逻辑
      // var prevComponent = getTopLevelWrapperInContainer(container)

      // 只考虑第一次渲染
      // var shouldReuseMarkup = false
      // var reactRootElement = getReactRootElementInContainer(container);
      var component = ReactMount$1._renderNewRootComponent(
        nextWrapperElement,
        container,
        false, // shouldReuseMarkup,
        emptyObject
      ); //._renderedComponent.getPublicInstance(); // 省略这里

      if (callback) {
        callback.call(component);
      }
    },
    render: function (nextElement, container, callback) {
      return ReactMount$1._renderSubtreeIntoContainer(
        null,
        nextElement,
        container,
        callback
      );
    },
  };

  var ReactMount_1 = ReactMount$1;

  // ReactDOM.js

  var ReactMount = ReactMount_1;

  var ReactDOM = {
    render: ReactMount.render,
  };

  var ReactDOM_1 = ReactDOM;

  return ReactDOM_1;

})));
