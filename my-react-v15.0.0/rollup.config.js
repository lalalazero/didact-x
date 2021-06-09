import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'



const plugins = [commonjs(), alias({
    entries: [
        { find: 'ReactElement', replacement: 'src/isomorphic/classic/element/ReactElement.js'},
        { find: 'ReactClass', replacement: 'src/isomorphic/classic/class/ReactClass.js'},
        { find: 'ReactCurrentOwner', replacement: 'src/isomorphic/classic/element/ReactCurrentOwner.js'},
        { find: 'ReactComponent', replacement: 'src/isomorphic/modern/class/ReactComponent.js'},
        { find: 'instantiateReactComponent', replacement: 'src/renderers/shared/reconciler/instantiateReactComponent.js'},
        { find: 'ReactCompositeComponent', replacement: 'src/renderers/shared/reconciler/ReactCompositeComponent.js'},
        { find: 'ReactUpdates', replacement: 'src/renderers/shared/reconciler/ReactUpdates.js'},
        { find: 'ReactMount', replacement: 'src/renderers/dom/client/ReactMount.js'},
        { find: 'invariant', replacement: 'src/util/invariant.js'},
        { find: 'emptyObject', replacement: 'src/util/emptyObject.js'},
        { find: 'ReactNoopUpdateQueue', replacement: 'src/isomorphic/modern/class/ReactNoopUpdateQueue.js'},
        { find: 'ReactDOMComponent', replacement: 'src/renderers/dom/shared/ReactDOMComponent.js'},
        { find: 'ReactDOMTextComponent', replacement: 'src/renderers/dom/shared/ReactDOMTextComponent.js'},
        { find: 'ReactDOMContainerInfo', replacement: 'src/renderers/dom/shared/ReactDOMContainerInfo.js'},
        { find: 'ReactReconciler', replacement: 'src/renderers/shared/reconciler/ReactReconciler.js'},
        { find: 'ReactInstanceMap', replacement: 'src/renderers/shared/reconciler/ReactInstanceMap.js'},
        { find: 'ReactNodeTypes', replacement: 'src/shared/utils/ReactNodeTypes.js'},
        { find: 'ReactNativeComponent', replacement: 'src/renderers/shared/reconciler/ReactNativeComponent.js'},
        { find: 'ReactMultiChild', replacement: 'src/renderers/shared/reconciler/ReactMultiChild.js'},
        { find: 'ReactUpdateQueue', replacement: 'src/renderers/shared/reconciler/ReactUpdateQueue.js'},
        { find: 'DOMNamespaces', replacement: 'src/renderers/dom/shared/DOMNamespaces.js'},
        { find: 'DOMLazyTree', replacement: 'src/renderers/dom/client/utils/DOMLazyTree.js'},
        { find: 'ReactChildReconciler', replacement: 'src/renderers/shared/reconciler/ReactChildReconciler.js'},
        { find: 'traverseAllChildren', replacement: 'src/shared/utils/traverseAllChildren.js'},
        { find: 'ReactDefaultInjection', replacement: 'src/renderers/dom/shared/ReactDefaultInjection.js'},
        { find: 'shouldUpdateReactComponent', replacement: 'src/renderers/shared/reconciler/shouldUpdateReactComponent.js'},
        { find: 'flattenChildren', replacement: 'src/shared/utils/flattenChildren.js'},
        { find: 'DOMChildrenOperations', replacement: 'src/renderers/dom/client/utils/DOMChildrenOperations.js'},
        { find: 'ReactDOMComponentTree', replacement: 'src/renderers/dom/client/ReactDOMComponentTree.js'}
    ]
})]

export default [
    {
        input: 'src/isomorphic/React.js',
        output: {
            file: 'build/mine/React.umd.js',
            format: 'umd',
            name: 'React',
        },
        plugins
    },
    {
        input: 'src/renderers/dom/ReactDOM.js',
        output: {
            file: 'build/mine/ReactDOM.umd.js',
            format: 'umd',
            name: 'ReactDOM'
        },
        plugins
    }
] 