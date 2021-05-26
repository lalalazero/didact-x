import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'



const plugins = [commonjs(), alias({
    entries: [
        { find: 'ReactElement', replacement: 'src/isomorphic/classic/element/ReactElement.js'},
        { find: 'ReactClass', replacement: 'src/isomorphic/classic/class/ReactClass.js'},
        { find: 'ReactCurrentOwner', replacement: 'src/isomorphic/classic/element/ReactCurrentOwner.js'},
        { find: 'ReactComponent', replacement: 'src/isomorphic/modern/class/ReactComponent.js'},
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