var defaultBatchingStrategy = require('./ReactDefaultBatchingStrategy')

// 这里是根据 injection 来的，会有不同的策略（比如 ssr 是不同的）。为了学习，这里简化了直接用默认的
var batchingStrategy = defaultBatchingStrategy


function batchedUpdates(callback, a, b, c, d, e) {
    batchingStrategy.batchedUpdates(callback, a, b, c, d, e);
}

var ReactUpdates = {
    batchedUpdates: batchedUpdates,
}


module.exports = ReactUpdates