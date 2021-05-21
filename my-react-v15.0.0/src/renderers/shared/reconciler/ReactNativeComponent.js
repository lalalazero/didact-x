// ReactNativeComponent.js
var genericComponentClass = ReactDOMComponent;
var textComponentClass = ReactDOMTextComponent;
var ReactNativeComponent = {
  createInternalComponent: function (element) {
    return new genericComponentClass(element);
  },
  createInstanceForText: function (text) {
    return new textComponentClass(text);
  },
};

module.exports = ReactNativeComponent;

