var alreadyInjected = false;

var ReactNativeComponent = require('ReactNativeComponent')
var ReactNativeComponentInjection = ReactNativeComponent.injection
var ReactDOMComponent = require('ReactDOMComponent')
var ReactDOMTextComponent = require('ReactDOMTextComponent')

function inject() {
  if (alreadyInjected) {
    return;
  }

  alreadyInjected = true;
  
  ReactNativeComponentInjection.injectGenericComponentClass(ReactDOMComponent)
  ReactNativeComponentInjection.injectTextComponentClass(ReactDOMTextComponent)
}

module.exports = {
    inject: inject
}
