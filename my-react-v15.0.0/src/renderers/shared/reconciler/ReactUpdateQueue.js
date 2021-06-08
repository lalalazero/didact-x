var ReactInstanceMap = require("ReactInstanceMap");
var ReactUpdates = require("ReactUpdates");

function enqueueUpdate(internalInstance) {
  ReactUpdates.enqueueUpdate(internalInstance);
}

// ReactUpdateQueue.js
/**
 * ReactUpdateQueue allows for state updates to be scheduled into a later
 * reconciliation step.
 */
var ReactUpdateQueue = {
  enqueueSetState: function (publicInstance, partialState) {
    var internalInstance = ReactInstanceMap.get(publicInstance);

    if (!internalInstance) {
      return;
    }

    var queue =
      internalInstance._pendingStateQueue ||
      (internalInstance._pendingStateQueue = []);
    queue.push(partialState);

    enqueueUpdate(internalInstance);
  },
};

module.exports = ReactUpdateQueue;
