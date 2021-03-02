import { createContainer, updateContainer, getPublicRootInstance } from './ReactFiberReconciler'
import { LegacyRoot } from './ReactFiberRoot'
import { unbatchedUpdates } from './ReactFiberWorkLoop'

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;


function isValidContainer(node) {
  return !!(
    node &&
    (node.nodeType === ELEMENT_NODE ||
      node.nodeType === DOCUMENT_NODE ||
      node.nodeType === DOCUMENT_FRAGMENT_NODE ||
      (node.nodeType === COMMENT_NODE &&
        node.nodeValue === " react-mount-point-unstable "))
  );
}
function render(element, container, callback) {
  if (!isValidContainer(container)) {
    console.error("Target container is not a DOM element.");
    return;
  }
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback
  );
}

function legacyRenderSubtreeIntoContainer(
  parentComponent,
  children,
  container,
  forceHydrate,
  callback
) {
  let root = container._reactRootContainer;
  let fiberRoot;
  if (!root) {
    // Initial mount 初次渲染
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate
    );
    fiberRoot = root._internalRoot;

    // if (typeof callback === "function") {
    //   const originalCallback = callback;
    //   const callback = function () {
    //     const instance = getPublicRootInstance(fiberRoot);
    //     originalCallback.call(instance);
    //   };
    // }

    // Initial mount should not be batched.
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;
    // if (typeof callback === "function") {
    //   const originalCallback = callback;
    //   const callback = function () {
    //     const instance = getPublicRootInstance(fiberRoot);
    //     originalCallback.call(instance);
    //   };
    // }

    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}



function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  return createLegacyRoot(container);
}

function createLegacyRoot(container, options) {
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}

function ReactDOMBlockingRoot(container, tag, options) {
  this._internalRoot = createRootImpl(container, tag, options);
}

function createRootImpl(container, tag, options) {
    // Tag is either LegacyRoot or Concurrent Root
    const hydrate = options != null && options.hydrate === true;
    const hydrationCallbacks = (options != null && options.hydrationCallbacks) || null;

    const root = createContainer(container, tag, hydrate, hydrationCallbacks)
    markContainerAsRoot(root.current, container)

    const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);

    return root;
}

const randomKey = Math.random()
  .toString(36)
  .slice(2);
const internalContainerInstanceKey = '__reactContainer$' + randomKey;

function markContainerAsRoot(hostRoot, node) {
    node[internalContainerInstanceKey] = hostRoot
}

const listeningMarker =
  '_reactListening' +
  Math.random()
    .toString(36)
    .slice(2);

const allNativeEvents = new Set()

function listenToAllSupportedEvents(rootContainerElement) {
    if(!(rootContainerElement[listeningMarker])) {
        rootContainerElement[listeningMarker] = true 
        allNativeEvents.forEach(domEventName => {
            // We handle selectionchange separately because it
            // doesn't bubble and needs to be on the document.
            if(domEventName !== 'selectionchange') {
                if(!nonDelegatedEvents.has(domEventName)) {
                    listenToNativeEvent(domEventName, false, rootContainerElement)
                }
                listenToNativeEvent(domEventName, true, rootContainerElement)  
            }
        })

        const ownerDocument = rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument
        if (ownerDocument !== null) {
            // The selectionchange event also needs deduplication
            // but it is attached to the document.
            if (!ownerDocument[listeningMarker]) {
                ownerDocument[listeningMarker] = true 
                listenToNativeEvent('selectionchange', false, ownerDocument)
            }
        }
    }
}
const IS_CAPTURE_PHASE = 1 << 2;

function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
    let eventSystemFlags = 0 
    if (isCapturePhaseListener) {
        eventSystemFlags |= IS_CAPTURE_PHASE
    }
    // ...
    // addTrappedEventListener(
    //     target,
    //     domEventName,
    //     eventSystemFlags,
    //     isCapturePhaseListener
    // )
}


export {
    render
}