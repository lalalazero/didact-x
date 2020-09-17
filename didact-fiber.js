// fiber type
const HOST_COMPONENT = "host"
const CLASS_COMPONENT = "class"
const HOST_ROOT ="root"

const updateQueue = []
let nextUnitOfWork = null 
let pendingCommit = null 

const ENOUGH_TIME = 1 // milliseconds 毫秒

// effect tag
const PLACEMENT = 1;
const DELETION = 2;
const UPDATE = 3;


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


  function completeWork(fiber) {
    if (fiber.tag == CLASS_COMPONENT) {
      fiber.stateNode.__fiber = fiber;
    }
  
    if (fiber.parent) {
      const childEffects = fiber.effects || [];
      const thisEffect = fiber.effectTag != null ? [fiber] : [];
      const parentEffects = fiber.parent.effects || [];
      fiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
    } else {
      pendingCommit = fiber;
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

  function cloneChildFibers(parentFiber) {
    const oldFiber = parentFiber.alternate;
    if (!oldFiber.child) {
      return;
    }
  
    let oldChild = oldFiber.child;
    let prevChild = null;
    while (oldChild) {
      const newChild = {
        type: oldChild.type,
        tag: oldChild.tag,
        stateNode: oldChild.stateNode,
        props: oldChild.props,
        partialState: oldChild.partialState,
        alternate: oldChild,
        parent: parentFiber
      };
      if (prevChild) {
        prevChild.sibling = newChild;
      } else {
        parentFiber.child = newChild;
      }
      prevChild = newChild;
      oldChild = oldChild.sibling;
    }
  }

  function arrify(val) {
    return val == null ? [] : Array.isArray(val) ? val : [val];
  }
  
  function reconcileChildrenArray(wipFiber, newChildElements) {
    const elements = arrify(newChildElements);
  
    let index = 0;
    let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null;
    let newFiber = null;
    while (index < elements.length || oldFiber != null) {
      const prevFiber = newFiber;
      const element = index < elements.length && elements[index];
      const sameType = oldFiber && element && element.type == oldFiber.type;
  
      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          tag: oldFiber.tag,
          stateNode: oldFiber.stateNode,
          props: element.props,
          parent: wipFiber,
          alternate: oldFiber,
          partialState: oldFiber.partialState,
          effectTag: UPDATE
        };
      }
  
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          tag:
            typeof element.type === "string" ? HOST_COMPONENT : CLASS_COMPONENT,
          props: element.props,
          parent: wipFiber,
          effectTag: PLACEMENT
        };
      }
  
      if (oldFiber && !sameType) {
        oldFiber.effectTag = DELETION;
        wipFiber.effects = wipFiber.effects || [];
        wipFiber.effects.push(oldFiber);
      }
  
      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }
  
      if (index == 0) {
        wipFiber.child = newFiber;
      } else if (prevFiber && element) {
        prevFiber.sibling = newFiber;
      }
  
      index++;
    }
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


function commitAllWork(fiber) {
    fiber.effects.forEach(f => {
      commitWork(f);
    });
    fiber.stateNode._rootContainerFiber = fiber;
    nextUnitOfWork = null;
    pendingCommit = null;
  }
  
  function commitWork(fiber) {
    if (fiber.tag == HOST_ROOT) {
      return;
    }
  
    let domParentFiber = fiber.parent;
    while (domParentFiber.tag == CLASS_COMPONENT) {
      domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.stateNode;
  
    if (fiber.effectTag == PLACEMENT && fiber.tag == HOST_COMPONENT) {
      domParent.appendChild(fiber.stateNode);
    } else if (fiber.effectTag == UPDATE) {
      updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag == DELETION) {
      commitDeletion(fiber, domParent);
    }
  }
  
  function commitDeletion(fiber, domParent) {
    let node = fiber;
    while (true) {
      if (node.tag == CLASS_COMPONENT) {
        node = node.child;
        continue;
      }
      domParent.removeChild(node.stateNode);
      while (node != fiber && !node.sibling) {
        node = node.parent;
      }
      if (node == fiber) {
        return;
      }
      node = node.sibling;
    }
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

function createDomElement(fiber) {
    const isTextElement = fiber.type === "TEXT_ELEMENT";
    const dom = isTextElement
      ? document.createTextNode("")
      : document.createElement(fiber.type);
    updateDomProperties(dom, [], fiber.props);
    return dom;
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

function isEvent(name){
    return name.startsWith('on')
}

function isAttribute(name){
    return !isEvent(name) && name !== 'children'
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