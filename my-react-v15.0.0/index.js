var ReactMount = require('./ReactMount')
var renderSubtreeIntoContainer = require('./renderSubtreeIntoContainer')
var ReactUpdates = require('./ReactUpdates')
var render = ReactMount.render

var React = {
    render,
    unstable_batchedUpdates: ReactUpdates.batchedUpdates,
    unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer
}



module.exports = React