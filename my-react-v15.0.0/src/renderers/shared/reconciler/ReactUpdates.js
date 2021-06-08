// ReactUpdates.js

var ReactReconciler = require('ReactReconciler')
var dirtyComponents = [];


function mountOrderComparator(c1, c2) {
  return c1._mountOrder - c2._mountOrder;
}

var ReactUpdates = {
  batchedUpdates: function (callback, a, b, c, d, e) {
    // 省略 transaction 部分
    // ReactDefaultBatchingStrategy.batchedUpdates(callback, a, b, c, d, e);
    // 直接调
    callback.call(null, a, b, c, d, e);
  },
  enqueueUpdate: function (component) {
    dirtyComponents.push(component);
    // 省略 transaction 的逻辑，直接调用更新
    runBatchedUpdates();
  },
};

function runBatchedUpdates(transaction) {
  // 省略 transaction 的逻辑

  dirtyComponents.sort(mountOrderComparator);

  var len = dirtyComponents.length;

  for (var i = 0; i < len; i++) {
    // If a component is unmounted before pending changes apply, it will still
    // be here, but we assume that it has cleared its _pendingCallbacks and
    // that performUpdateIfNecessary is a noop.
    var component = dirtyComponents[i];

    // If performUpdateIfNecessary happens to enqueue any new updates, we
    // shouldn't execute the callbacks until the next render happens, so
    // stash the callbacks first
    // var callbacks = component._pendingCallbacks;
    component._pendingCallbacks = null;

    // var markerName;
    // if (ReactFeatureFlags.logTopLevelRenders) {
    //   var namedComponent = component;
    //   // Duck type TopLevelWrapper. This is probably always true.
    //   if (
    //     component._currentElement.props ===
    //     component._renderedComponent._currentElement
    //   ) {
    //     namedComponent = component._renderedComponent;
    //   }
    //   markerName = "React update: " + namedComponent.getName();
    //   console.time(markerName);
    // }

    ReactReconciler.performUpdateIfNecessary(
      component,
      // transaction.reconcileTransaction
    );
  }
}

module.exports = ReactUpdates;
