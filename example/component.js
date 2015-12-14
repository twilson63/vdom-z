var h = require('virtual-dom/h')
var z = require('../')

z.register('click', function (state, done) {
  state.title = state.args[0] + (new Date()).toISOString()
  done(state)
})

z.register('keydown', function (state, done) {
  state.title = state.el.value
  done(state)
})

module.exports = function (state) {
  return h('div', [
    h('h1', [state.title]),
    h('p', [
      h('input', { 'z-keydown': z.send('keydown'), value: state.title })
    ]),
    h('button', { 'z-click': z.send('click', ['foo']) }, ['Change Title'])
  ])
}
