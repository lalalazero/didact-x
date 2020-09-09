function createElement(type, props, ...rawChildren){
    const children = rawChildren.length > 0 ? [].concat(...rawChildren) : []
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === 'object' ? child : createTextElement(child))
        }
    }
}
// 封装 text 节点使得 jsx element 的表现一致，都有 type, props, children 属性
function createTextElement(text){
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function isEvent(name){
    return name.startsWith('on')
}

function isAttribute(name){
    return !isEvent(name) && name !== 'children'
}

let rootInstance = null;

function render(element, container){
    const prevInstance = rootInstance 
    const nextInstance = reconcile(container, prevInstance, element) // dom diff 
    rootInstance = nextInstance
}

function reconcile(parentDom, instance, element) {
    if(instance === null){
        // create instance
        const newInstance = instantiate(element)
        parentDom.appendChild(newInstance.dom)
        return newInstance
    } else if(element === null){
        // remove instance
        parentDom.removeChild(instance.dom)
        return null;
    }else if(instance.element.type === element.type){
        // update instance 复用 dom 节点，免去销毁重建的开销
        updateDomProperties(instance.dom, instance.element.props, element.props)
        // 孩子节点的 dom diff
        instance.childInstances = reconcileChildren(instance, element)
        instance.element = element
        return instance
    }else {
        // replace instance
        const newInstance = instantiate(element)
        parentDom.replaceChild(newInstance.dom, instance.dom)
        return newInstance
    }
}

function reconcileChildren(instance, element){
    const { dom, childInstances } = instance 
    const nextChildElements = element.props.children || []
    const newChildInstances = []
    const count = Math.max(childInstances.length, nextChildElements.length)
    for(let i = 0; i < count; i++){
        const childInstance = childInstances[i]
        const childElement = nextChildElements[i]
        const newChildInstance = reconcile(dom, childInstance, childElement)
        newChildInstances.push(newChildInstance)
    }
    return newChildInstances.filter(instance => instance !== null)
}

function instantiate(element){
    const { type, props } = element 
    const isTextElement = type === 'TEXT_ELEMENT'
    const dom = isTextElement ? document.createTextNode("") : document.createElement(type)
    
    updateDomProperties(dom, {}, props)

    // 递归实例化孩子节点 
    const childElements = props.children || []
    const childInstances = childElements.map(instantiate)
    const childDoms = childInstances.map(childInstance => childInstance.dom)
    childDoms.forEach(childDom => dom.appendChild(childDom))

    const instance = { dom, element, childInstances }
    return instance

}
function updateDomProperties(dom, prevProps, nextProps){
    // 移除旧的事件监听
    Object.keys(prevProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2)
        dom.removeEventListener(eventType, prevProps[name])
    })
    // 移除旧的属性
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name] = null
    })
    // 添加新的属性
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
        dom[name] = nextProps[name]
    })
    // 添加新的事件监听
    Object.keys(nextProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2)
        dom.addEventListener(eventType, nextProps[name])
    })
}
const Didact = {
    createElement,
    render
}

export default Didact