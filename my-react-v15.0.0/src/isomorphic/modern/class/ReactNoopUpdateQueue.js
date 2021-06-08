// ReactNoopUpdateQueue.js
var ReactNoopUpdateQueue = {
  
  enqueueSetState: function(publicInstance, partialState) {
    console.warn('ReactNoopUpdateQueue.enqueueSetState 被调用了，这里啥都不会做')
  }
};

module.exports = ReactNoopUpdateQueue;
