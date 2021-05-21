var ReactElement = require('ReactElement')


var ReactNodeTypes = {
  NATIVE: 0,
  COMPOSITE: 1,
  EMPTY: 2,

  getType: function (node) {
    if (node === null || node === false) {
      return ReactNodeTypes.EMPTY;
    } else if (ReactElement.isValidElement(node)) {
      if (typeof node.type === "function") {
        return ReactNodeTypes.COMPOSITE;
      } else {
        return ReactNodeTypes.NATIVE;
      }
    }
    invariant(false, "Unexpected node: %s", node);
  },
};

module.exports = ReactNodeTypes;
