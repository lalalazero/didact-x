// ReactReconciler.js
var ReactReconciler = {
  mountComponent: function (
    internalInstance,
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    console.log("enter --> ReactReconciler.mountComponent");
    console.log('当前的 instance', internalInstance)
    console.log('当前的 instance._currentElement.type', internalInstance._currentElement.type)
    console.log('当前的 instance._currentElement', internalInstance._currentElement)
    console.log('--------------------------------------------')
    var markup = internalInstance.mountComponent(
      transaction,
      nativeParent,
      nativeContainerInfo,
      context
    );
    return markup;
  },
};

module.exports = ReactReconciler;
