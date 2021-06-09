// ReactMultiChild.js
var ReactChildReconciler = require("ReactChildReconciler");
var ReactReconciler = require("ReactReconciler");
var flattenChildren = require("flattenChildren");
var ReactChildReconciler = require("ReactChildReconciler");

var ReactMultiChildUpdateTypes = {
  MOVE_EXISTING: 'move',
}

function enqueue(queue, update) {
  if (update) {
    queue = queue || [];
    queue.push(update);
  }

  return queue;
}

function makeMove(child, afterNode, toIndex) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: ReactMultiChildUpdateTypes.MOVE_EXISTING,
    content: null,
    fromIndex: child._mountIndex,
    fromNode: ReactReconciler.getNativeNode(child),
    toIndex: toIndex,
    afterNode: afterNode,
  };
}

var ReactMultiChild = {
  Mixin: {
    moveChild: function(child, afterNode, toIndex, lastIndex) {
      // If the index of `child` is less than `lastIndex`, then it needs to
      // be moved. Otherwise, we do not need to move it because a child will be
      // inserted or moved before `child`.
      if (child._mountIndex < lastIndex) {
        return makeMove(child, afterNode, toIndex);
      }
    },
    _reconcilerUpdateChildren: function (
      prevChildren,
      nextNestedChildrenElements,
      removedNodes,
      transaction,
      context
    ) {
      var nextChildren;

      nextChildren = flattenChildren(nextNestedChildrenElements);
      ReactChildReconciler.updateChildren(
        prevChildren,
        nextChildren,
        removedNodes,
        transaction,
        context
      );
      return nextChildren;
    },
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
    updateChildren: function (
      nextNestedChildrenElements,
      transaction,
      context
    ) {
      this._updateChildren(nextNestedChildrenElements, transaction, context);
    },
    _updateChildren: function (
      nextNestedChildrenElements,
      transaction,
      context
    ) {
      var prevChildren = this._renderedChildren;
      var removedNodes = {};
      var nextChildren = this._reconcilerUpdateChildren(
        prevChildren,
        nextNestedChildrenElements,
        removedNodes,
        transaction,
        context
      );
      if (!nextChildren && !prevChildren) {
        return;
      }
      var updates = null;
      var name;
      // `nextIndex` will increment for each child in `nextChildren`, but
      // `lastIndex` will be the last index visited in `prevChildren`.
      var lastIndex = 0;
      var nextIndex = 0;
      var lastPlacedNode = null;
      for (name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }
        var prevChild = prevChildren && prevChildren[name];
        var nextChild = nextChildren[name];
        if (prevChild === nextChild) {
          updates = enqueue(
            updates,
            this.moveChild(prevChild, lastPlacedNode, nextIndex, lastIndex)
          );
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          prevChild._mountIndex = nextIndex;
        } else {
          if (prevChild) {
            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
            // The `removedNodes` loop below will actually remove the child.
          }
          // The child must be instantiated before it's mounted.
          updates = enqueue(
            updates,
            this._mountChildAtIndex(
              nextChild,
              lastPlacedNode,
              nextIndex,
              transaction,
              context
            )
          );
        }
        nextIndex++;
        lastPlacedNode = ReactReconciler.getNativeNode(nextChild);
      }
      // Remove children that are no longer present.
      // 省略这部分，目前暂时不涉及
      // for (name in removedNodes) {
      //   if (removedNodes.hasOwnProperty(name)) {
      //     updates = enqueue(
      //       updates,
      //       this._unmountChild(prevChildren[name], removedNodes[name])
      //     );
      //   }
      // }
      // if (updates) {
      //   processQueue(this, updates);
      // }
      this._renderedChildren = nextChildren;
    },
  },
  
};

module.exports = ReactMultiChild;
