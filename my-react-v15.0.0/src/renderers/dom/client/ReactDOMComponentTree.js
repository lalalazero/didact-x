var internalInstanceKey =
  "__reactInternalInstance$" + Math.random().toString(36).slice(2);

/**
 * Given a DOM node, return the closest ReactDOMComponent or
 * ReactDOMTextComponent instance ancestor.
 *
 * 给定一个 DOM 节点，返回最近的 ReactDOMComponent 或者 ReactDOMTextComponent 实例的祖先
 */
function getClosestInstanceFromNode(node) {
  if (node[internalInstanceKey]) {
    return node[internalInstanceKey];
  }

  // Walk up the tree until we find an ancestor whose instance we have cached.
  // 遍历树直到找到已缓存的符合条件的实例的祖先
  var parents = [];
  while (!node[internalInstanceKey]) {
    parents.push(node);
    if (node.parentNode) {
      node = node.parentNode;
    } else {
      // Top of the tree. This node must not be part of a React tree (or is
      // unmounted, potentially).
      // 遍历到树的顶点
      return null;
    }
  }

  var closest;
  var inst;
  for (; node && (inst = node[internalInstanceKey]); node = parents.pop()) {
    closest = inst;
    if (parents.length) {
      precacheChildNodes(inst, node);
    }
  }

  return closest;
}

/**
 * Drill down (through composites and empty components) until we get a native or
 * native text component.
 *
 * This is pretty polymorphic but unavoidable with the current structure we have
 * for `_renderedChildren`.
 */
function getRenderedNativeOrTextFromComponent(component) {
  var rendered;
  while ((rendered = component._renderedComponent)) {
    component = rendered;
  }
  return component;
}

/**
 * Populate `_nativeNode` on the rendered native/text component with the given
 * DOM node. The passed `inst` can be a composite.
 */
function precacheNode(inst, node) {
  var nativeInst = getRenderedNativeOrTextFromComponent(inst);
  nativeInst._nativeNode = node;
  node[internalInstanceKey] = nativeInst;
}

/**
 * Populate `_nativeNode` on each child of `inst`, assuming that the children
 * match up with the DOM (element) children of `node`.
 *
 * We cache entire levels at once to avoid an n^2 problem where we access the
 * children of a node sequentially and have to walk from the start to our target
 * node every time.
 *
 * Since we update `_renderedChildren` and the actual DOM at (slightly)
 * different times, we could race here and see a newer `_renderedChildren` than
 * the DOM nodes we see. To avoid this, ReactMultiChild calls
 * `prepareToManageChildren` before we change `_renderedChildren`, at which
 * time the container's child nodes are always cached (until it unmounts).
 */
function precacheChildNodes(inst, node) {
  if (inst._flags & Flags.hasCachedChildNodes) {
    return;
  }
  var children = inst._renderedChildren;
  var childNode = node.firstChild;
  outer: for (var name in children) {
    if (!children.hasOwnProperty(name)) {
      continue;
    }
    var childInst = children[name];
    var childID = getRenderedNativeOrTextFromComponent(childInst)._domID;
    if (childID == null) {
      // We're currently unmounting this child in ReactMultiChild; skip it.
      continue;
    }
    // We assume the child nodes are in the same order as the child instances.
    for (; childNode !== null; childNode = childNode.nextSibling) {
      if (
        (childNode.nodeType === 1 &&
          childNode.getAttribute(ATTR_NAME) === String(childID)) ||
        (childNode.nodeType === 8 &&
          childNode.nodeValue === " react-text: " + childID + " ") ||
        (childNode.nodeType === 8 &&
          childNode.nodeValue === " react-empty: " + childID + " ")
      ) {
        precacheNode(childInst, childNode);
        continue outer;
      }
    }
    // We reached the end of the DOM children without finding an ID match.
    invariant(false, "Unable to find element with ID %s.", childID);
  }
  inst._flags |= Flags.hasCachedChildNodes;
}

function getInstanceFromNode(node) {
  var inst = getClosestInstanceFromNode(node);
  if (inst != null && inst._nativeNode === node) {
    return inst;
  } else {
    return null;
  }
}

var ReactDOMComponentTree = {
  getInstanceFromNode: getInstanceFromNode,
};

module.exports = ReactDOMComponentTree;
