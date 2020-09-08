const path = require('path')

module.exports = {
    entry: {
        main: './example/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    optimization: {
        minimize: false
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [[
                            '@babel/plugin-transform-react-jsx',
                            { pragma: 'Didact.createElement' }
                        ]]
                    }
                }
            }
        ]
    }
}