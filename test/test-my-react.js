const { createElement } = require('../my-react/React')

let element = createElement('div', { name: 'test-div', className: 'container' }, 'Text')

console.log('element..', element)