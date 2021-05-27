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
        
    ]
})]

export default [
    {
        input: 'src/isomorphic/React.js',
        output: {
            file: 'React.umd.js',
            format: 'umd',
            name: 'React',
        },
        plugins
    },
    {
        input: 'src/renderers/dom/ReactDOM.js',
        output: {
            file: 'ReactDOM.umd.js',
            format: 'umd',
            name: 'ReactDOM'
        },
        plugins
    }
] 