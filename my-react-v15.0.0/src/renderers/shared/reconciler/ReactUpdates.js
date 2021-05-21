// ReactUpdates.js
var ReactUpdates = {
  batchedUpdates: function (callback, a, b, c, d, e) {
    // 省略 transaction 部分
    // ReactDefaultBatchingStrategy.batchedUpdates(callback, a, b, c, d, e);
    // 直接调
    callback.call(null, a, b, c, d, e);
  },
};

module.exports = ReactUpdates;
