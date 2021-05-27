// ReactNativeComponent.js

var genericComponentClass = null;
var textComponentClass = null;
// This registry keeps track of wrapper classes around native tags.
var tagToComponentClass = {};
var textComponentClass = null;

var ReactNativeComponentInjection = {
  // This accepts a class that receives the tag string. This is a catch all
  // that can render any kind of tag.
  injectGenericComponentClass: function (componentClass) {
    genericComponentClass = componentClass;
  },
  // This accepts a text component class that takes the text string to be
  // rendered as props.
  injectTextComponentClass: function (componentClass) {
    textComponentClass = componentClass;
  },
  // This accepts a keyed object with classes as values. Each key represents a
  // tag. That particular tag will use this class instead of the generic one.
  injectComponentClasses: function (componentClasses) {
    Object.assign(tagToComponentClass, componentClasses);
  },
};

var ReactNativeComponent = {
  createInternalComponent: function (element) {
    return new genericComponentClass(element);
  },
  createInstanceForText: function (text) {
    return new textComponentClass(text);
  },
  injection: ReactNativeComponentInjection,
};

module.exports = ReactNativeComponent;
