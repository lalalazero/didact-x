// DOMLazyTree.js

var enableLazy =
  (typeof document !== "undefined" &&
    typeof document.documentMode === "number") ||
  (typeof navigator !== "undefined" &&
    typeof navigator.userAgent === "string" &&
    /\bEdge\/\d/.test(navigator.userAgent));

// console.log("enableLazy", enableLazy);

function DOMLazyTree(node) {
  return {
    node: node,
    children: [],
    html: null,
    text: null,
  };
}

function queueChild(parentTree, childTree) {
  if (enableLazy) {
    console.log('queueChild enableLazy')
    parentTree.children.push(childTree);
  } else {
    // console.log("parentTree.node", parentTree.node);
    // console.log("childTree.node", childTree.node);
    parentTree.node.appendChild(childTree.node);
  }
}

function insertTreeBefore(parentNode, tree, referenceNode) {
  // DocumentFragments aren't actually part of the DOM after insertion so
  // appending children won't update the DOM. We need to ensure the fragment
  // is properly populated first, breaking out of our lazy approach for just
  // this level.
  if (tree.node.nodeType === 11) {
    insertTreeChildren(tree);
    parentNode.insertBefore(tree.node, referenceNode);
  } else {
    parentNode.insertBefore(tree.node, referenceNode);
    insertTreeChildren(tree);
  }
}

function insertTreeChildren(tree) {
  if (!enableLazy) {
    return;
  }

  console.log('insertTreeChildren enableLazy', enableLazy)
}

DOMLazyTree.queueChild = queueChild;
DOMLazyTree.insertTreeBefore = insertTreeBefore;

module.exports = DOMLazyTree;
