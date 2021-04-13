'use strict';


function DOMLazyTree(node) {
    return {
      node: node,
      children: [],
      html: null,
      text: null,
    };
  }

  module.exports = DOMLazyTree;
