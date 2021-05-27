// ReactMultiChild.js
var ReactChildReconciler = require('ReactChildReconciler')
var ReactReconciler = require('ReactReconciler')

var ReactMultiChild = {
  Mixin: {
    _reconcilerInstantiateChildren: function (
      nestedChildren,
      transaction,
      context
    ) {
      return ReactChildReconciler.instantiateChildren(
        nestedChildren,
        transaction,
        context
      );
    },
    mountChildren: function (nestedChildren, transaction, context) {
      var children = this._reconcilerInstantiateChildren(
        nestedChildren,
        transaction,
        context
      );
      this._renderedChildren = children;

      var mountImages = [];
      var index = 0;
      for (var name in children) {
        if (children.hasOwnProperty(name)) {
          var child = children[name];
          var mountImage = ReactReconciler.mountComponent(
            child,
            transaction,
            this,
            this._nativeContainerInfo,
            context
          );
          child._mountIndex = index++;
          mountImages.push(mountImage);
        }
      }

      return mountImages;
    },
  },
};

module.exports = ReactMultiChild;
