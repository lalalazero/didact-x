
const HOST_COMPONENT = "host"
const CLASS_COMPONENT = "class"
const HOST_ROOT ="root"

const updateQueue = []
let nextUnitOfWork = null 
let pendingCommit = null 

const ENOUGH_TIME = 1 // milliseconds 毫秒

function render(elements, containerDom){
    updateQueue.push({
        from: HOST_COMPONENT,
        dom: containerDom,
        newProps: { children: elements }
    })
    requestIdleCallback(performWork)
}

function scheduleUpdate(instance, partialState){
    updateQueue.push({
        from: CLASS_COMPONENT,
        instance,
        partialState
    })
    requestIdleCallback(performWork)
}

function performWork(deadline){
    workLoop(deadline)
    if(nextUnitOfWork || updateQueue.length > 0){
        requestIdleCallback(performWork)
    }
}

function workLoop(deadline){
    if(!nextUnitOfWork){
        resetNextUnitOfWork()
    }

    while(nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME){
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }

    if(pendingCommit){
        commitAllWork(pendingCommit)
    }
}

function performUnitOfWork(wipFiber){
    beginWork(wipFiber)
    if(wipFiber.child){
        return wipFiber.child
    }

    let uow = wipFiber 
    while(uow){
        completeWork(uow)
        if(uow.sibling){
            return uow.sibling
        }
        uow = uow.parent
    }
}

function beginWork(wipFiber) {
    if (wipFiber.tag == CLASS_COMPONENT) {
      updateClassComponent(wipFiber);
    } else {
      updateHostComponent(wipFiber);
    }
  }
  
  function updateHostComponent(wipFiber) {
    if (!wipFiber.stateNode) {
      wipFiber.stateNode = createDomElement(wipFiber);
    }
    const newChildElements = wipFiber.props.children;
    reconcileChildrenArray(wipFiber, newChildElements);
  }
  
  function updateClassComponent(wipFiber) {
    let instance = wipFiber.stateNode;
    if (instance == null) {
      // Call class constructor
      instance = wipFiber.stateNode = createInstance(wipFiber);
    } else if (wipFiber.props == instance.props && !wipFiber.partialState) {
      // No need to render, clone children from last time
      cloneChildFibers(wipFiber);
      return;
    }
  
    instance.props = wipFiber.props;
    instance.state = Object.assign({}, instance.state, wipFiber.partialState);
    wipFiber.partialState = null;
  
    const newChildElements = wipFiber.stateNode.render();
    reconcileChildrenArray(wipFiber, newChildElements);
  }

function resetNextUnitOfWork() {
    const update = updateQueue.shift()
    if(!update){
        return
    }

    if(update.partialState){
        update.instance.__fiber.partialState = update.partialState
    }

    const root = update.from === HOST_COMPONENT ? update.dom.__rootContainerFiber : getRoot(update.instance.__fiber)

    nextUnitOfWork = {
        tag: HOST_ROOT,
        stateNode: update.dom || root.stateNode,
        props: update.newProps || root.props,
        alternate: root
    }
}

function getRoot(fiber){
    let node = fiber 
    while(node.parent){
        node = node.parent
    }
    return node;
}




class Component {
    constructor(props){
        this.props = props
        this.state = this.state || {}
    }
    setState(partialState){
        scheduleUpdate(this, partialState)
    }
}



function createInstance(fiber){
    const instance = new fiber.type(fiber.props)
    instance.__fiber = fiber 
    return instance
}



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

function createPublicInstance(element, internalInstance){
    const { type, props } = element 
    const publicInstance = new type(props)
    publicInstance.__internalInstance = internalInstance
    return publicInstance
}

function isEvent(name){
    return name.startsWith('on')
}

function isAttribute(name){
    return !isEvent(name) && name !== 'children'
}

let rootInstance = null;

// function render(element, container){
//     const prevInstance = rootInstance 
//     const nextInstance = reconcile(container, prevInstance, element) // dom diff 
//     rootInstance = nextInstance
// }

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
    }else if(instance.element.type !== element.type) {
        // replace instance
        const newInstance = instantiate(element)
        parentDom.replaceChild(newInstance.dom, instance.dom)
        return newInstance
    }else if(typeof element.type === 'string') {
        // update instance 复用 dom 节点，免去销毁重建的开销
        updateDomProperties(instance.dom, instance.element.props, element.props)
        // 孩子节点的 dom diff
        instance.childInstances = reconcileChildren(instance, element)
        instance.element = element
        return instance
    } else {
        // 更新自定义组件
        instance.publicInstance.props = element.props 
        const childElement = instance.publicInstance.render()
        const oldChildInstance = instance.childInstance 
        const childInstance = reconcile(parentDom, oldChildInstance, childElement)
        instance.dom = childInstance.dom 
        instance.childInstance = childInstance 
        instance.element = element 
        return instance
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
    const isDomElement = typeof type === 'string'
    if(isDomElement){
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
    }else{
        // 实例化自定义组件
        const instance = {}
        const publicInstance = createPublicInstance(element, instance)
        const childElement = publicInstance.render()
        const childInstance = instantiate(childElement)
        const dom = childInstance.dom 
        Object.assign(instance, { dom, element, childInstance, publicInstance })
        return instance
    }
    

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
    render,
    Component
}

export default Didact