// ReactComponent.js

var ReactNoopUpdateQueue = require('ReactNoopUpdateQueue')

function ReactComponent(props, context, updater) {
  this.props = props;
  // this.context = context;
  // this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};



module.exports = ReactComponent;
