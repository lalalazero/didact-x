// ReactComponent.js

var ReactNoopUpdateQueue = require('ReactNoopUpdateQueue')

function ReactComponent(props, context, updater) {
  this.props = props;
  // this.context = context;
  // this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

ReactComponent.prototype.setState = function(partialState, callback) {
  console.log('prototype.setState called...')
  this.updater.enqueueSetState(this, partialState);

  if(callback) {
    this.updater.enqueueSetState(this, callback, 'setState')
  }
}



module.exports = ReactComponent;
