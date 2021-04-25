
'use strict';

var ReactCurrentOwner = require('ReactCurrentOwner');

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};


/** 用来创建 React element 的工厂方法，不要用 new 的方式调用
 * 也不要用 instanceof 来检查是否是这个方法创建的实例。
 * 总是用 $$typeof === Symbol.for('react.element') 来检测是否是 React Element
 *
 * @param {*} type
 * @param {*} key
 * @param {*} ref
 * @param {*} self
 * @param {*} source
 * @param {*} owner
 * @param {*} props
 * @returns
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // 唯一用来标志 React Element 的标识符
    $$typeof: REACT_ELEMENT_TYPE,
    // element 内建的属性
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 标识哪个组件(component)负责创建了当前element
    _owner: owner,
  };
  return element;
};

ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : "" + config.key;
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        config.hasOwnProperty(propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
};

module.exports = ReactElement;
