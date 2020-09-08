function createElement(type, props, ...children){
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

function isListener(name){
    return name.startsWith('on')
}

function isAttribute(name){
    return !isListener(name) && name !== 'children'
}


function render(element, parentDom){
    console.log('element ', element)
    const { type, props } = element 
    const isTextElement = type === 'TEXT_ELEMENT'
    const dom = isTextElement ? document.createTextNode("") : document.createElement(type)

    // 绑定事件监听
    Object.keys(props).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2)
        dom.addEventListener(eventType, props[name])
    })
    // 设置dom属性
    Object.keys(props).filter(isAttribute).forEach(name => {
        dom[name] = props[name]
    })
    // render children
    const childElements = props.children || []
    childElements.forEach(childElement => render(childElement, dom))
    parentDom.appendChild(dom)
}

const Didact = {
    createElement,
    render
}

export default Didact