// ReactReconciler.js
var ReactReconciler = {
  /**
   * Update a component using a new element
   * 
   * @param {*} internalInstance 
   * @param {*} nextElement 
   * @param {*} transaction 
   * @param {*} context 
   */
  receiveComponent: function(internalInstance, nextElement, transaction, context) {
    var prevElement = internalInstance._currentElement;

    // if (nextElement === prevElement && context === internalInstance._context) {
    // 这里有点问题，先暂时注解掉
    //   console.log('进入了 receiveComponent 但是不用做什么东西')
    //   return
    // }

    internalInstance.receiveComponent(nextElement, transaction, context)
  },
  mountComponent: function (
    internalInstance,
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    console.log("enter --> ReactReconciler.mountComponent");
    console.log("当前的 instance", internalInstance);
    console.log(
      "当前的 instance._currentElement.type",
      internalInstance._currentElement.type
    );
    console.log(
      "当前的 instance._currentElement",
      internalInstance._currentElement
    );
    console.log("--------------------------------------------");
    var markup = internalInstance.mountComponent(
      transaction,
      nativeParent,
      nativeContainerInfo,
      context
    );
    return markup;
  },
  /**
   * Flush any dirty changes in a component.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function (internalInstance, transaction) {
    internalInstance.performUpdateIfNecessary(transaction);
  },
  getNativeNode: function(internalInstance) {
    return internalInstance.getNativeNode();
  },
};

module.exports = ReactReconciler;
