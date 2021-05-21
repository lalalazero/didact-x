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
