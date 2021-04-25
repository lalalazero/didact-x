var ReactNoopUpdateQueue = require('../../modern/class/ReactNoopUpdateQueue')

var ReactClassComponent = function() {}
Object.assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin,
)

var ReactClass = {
    createClass: function(spec) {
        var Constructor = function (props, context, updater) {
            this.props = props;
            this.context = context;
            // this.refs = emptyObject;
            // this.updater = updater || ReactNoopUpdateQueue;

            this.state = null;

            // ReactClasses doesn't have constructors. Instead, they use the
            // getInitialState and componentWillMount methods for initialization.

            var initialState = this.getInitialState
              ? this.getInitialState()
              : null;

            this.state = initialState;
          };

          Constructor.prototype = new ReactClassComponent();
          Constructor.prototype.constructor = Constructor;
          Constructor.prototype.__reactAutoBindPairs = [];

          return Constructor;
    }
}


module.exports = ReactClass