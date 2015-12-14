var h = require('virtual-dom/h')
var z = require('../')

z.register('click', function (state, done) {
  state.title = state.args[0] + (new Date()).toISOString()
  done(state)
})

module.exports = function (state) {
  return h('div', [
    h('h1', [state.title]),
    h('button', { 'z-click': z.send('click', ['foo']) }, ['Change Title'])
  ])
}
