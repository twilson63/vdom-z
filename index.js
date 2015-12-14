var PouchDB = require('pouchdb')
var xtend = require('xtend')
var EventHook = require('./event-hook')

var db
var listening = false

var listeners = []
var actions = []

/*
# get

Get the current state from the pouchdb state store

*/
function get () {
  return db.get('state')
}

/*
# set

sets the new state to the pouchdb state store

*/
function set (state) {
  return db.put(state)
}
/*
# do

The do action finds a registered actions and invokes them
with the current state and passed arguments and the source element

When the function is invoked - it provides a done function
that will set the state and triggers a document update
to re-render the presentation layer
*/
function doAction (action, args, e) {
  get().then(function (state) {
    if (args) state.args = args
    if (e) state.el = e.srcElement

    actions.filter(function (a) {
      return a.action === action
    }).forEach(function (a) {
      a.fn(state, set)
    })
  })
}

/*
# send

The method return a hook object based on the virtual-dom hook spec, this
method takes an action and optional args parameter to bind an event to
a registered action

Parameters:

* action [string] - name of the action to call when the event is invoked
* args [array] - [optional] array of additional values to send to action

Usage:

```
return h('button', { 'z-click': z.send('click_action')}, ['Click Button'])
```

*/
function send (action, args) {
  var fn = function (e) {
    doAction(action, args, e)
  }
  return new EventHook(fn)
}

/*
# notify

When a changes event fires from the pouch state store,
notify all listeners

*/
function notify (doc) {
  listeners.forEach(function (fn) {
    fn(doc)
  })
}

/*
# update

Add a notify function to the list of listener functions that will
get invoked when state changes

Parameters

* fn [function] - this function should expect one param to be passed when invoked
this param will be the new state.

*/
function update (fn) {
  listeners.push(fn)
}

/*
# register

Register actions to be triggered by events or manually when async operations
are completed.

Parameters

* action [string] - the name of the action that can trigger this function
* fn [function] - the function that will be invoked from an event or manually
using the do method call.

Usage:

```
z.register('click_action', function (state, done) {
  // do stuff
  state.route = 'list'
  // let store know when done
  done(state)
})
```

*/
function register (action, fn) {
  actions.push({ action: action, fn: fn })
}

/*
# init

Initializes get previous state or initializes state

*/
function init (state) {
  get().then(notify).catch(function (err) {
    state._id = 'state'
    return set(state)
  })
}

/*
# configure

Configure your state store

Params

* config
  - dbName
  - dbOptions

*/
function configure (config) {
  if (!listening) {
    var dbName = config.dbName || 'app'
    var options = xtend({ auto_compaction: true}, config.dbOptions)

    db = PouchDB(dbName, options)
    db.changes({
      live: true,
      since: 'now',
      include_docs: true
    }).on('change', function (chg) {
      notify(chg.doc)
    })
    listening = true
  }
}

module.exports = Object.freeze({
  configure: configure,
  update: update,
  register: register,
  do: doAction,
  getState: get,
  setState: set,
  send: send,
  initState: init,
  stateDb: db
})
