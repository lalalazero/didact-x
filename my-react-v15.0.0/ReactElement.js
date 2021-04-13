
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
var ReactElement = function(type, key, ref, self, source, owner, props) {
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
    }
    return element
}

module.exports = ReactElement