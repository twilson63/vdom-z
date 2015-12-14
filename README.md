# z

A redux like library for the virtual-dom

## Component Example

``` js
var h = require('virtual-dom/h')
var z = require('vdom-z')

z.register('click_action', function (state, done) {
  // do stuff
  state.title = 'Foo - ' + (new Date()).toISOString()
  // set state when done
  done(state)
})

module.exports = function (state) {
  return h('div', [
    h('h1', [state.title]),
    h('button', { 'z-click': z.send('click_action')}, ['Change Title'])
  ])
}

```

## Config Example

``` js
var main = require('main-loop')
var z = require('vdom-z')

z.configure({dbName: 'vdom-z'})

var loop = main({}, require('./component'), require('virtual-dom'))

z.update(loop.update)

document.body.appendChild(loop.target)

z.initState({
  title: 'Hello World'
})

```

## API

### configure

Configures the z-store with a pouchdb data-store

### initState

Sets the initial state of the application

### register

Registers action handlers that will be called via an event handler or manually

### update

Adds an update method to the listeners collection that are to be notified when
a change occurs to state.

### send

Send is the event handler that sends a notification based on the given action and
optional args.

### do

Manually invoke an action

### getState

Returns a promise and then the current state document

### setState

Sets the current state, if it is an update, it must have a valid _id and _rev attributes

### stateDb

Returns the current state persistence database, this is handy if you want to sync
your state database to the cloud.

## LICENSE

MIT
