
const MyReact = require('../my-react')

const { createElement, render } = MyReact

let element = createElement('div', { name: 'test-div', className: 'container' }, 'Text')

console.log('element..', element)
console.log('render...', render)


