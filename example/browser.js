var main = require('main-loop')
var z = require('../')

z.configure({dbName: 'example'})

var loop = main({}, require('./component'), require('virtual-dom'))

z.update(loop.update)

document.body.appendChild(loop.target)

z.initState({
  title: 'Hello World'
})
