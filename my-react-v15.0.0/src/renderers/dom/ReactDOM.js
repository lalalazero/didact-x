// ReactDOM.js

var ReactMount = require('ReactMount')
var ReactDefaultInjection = require('ReactDefaultInjection')

ReactDefaultInjection.inject()

var ReactDOM = {
  render: ReactMount.render,
};

module.exports = ReactDOM;
