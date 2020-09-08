import Didact from '../didact'

const App = <div id='container'>
    <input value="foo" type="text"></input>
    <a href="/bar">bar link</a>
    <span>hello didact</span>
</div>

Didact.render(App, document.querySelector('#root'))