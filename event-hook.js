function Event (fn) {
  this.event = event
  this.fn = function (e) {
    e.preventDefault()
    // TODO: if e.srcElement === form - get children values as object
    // TODO: if e.srcElement === a - get href as param
    fn(e)
  }
}

Event.prototype.hook = function (node, propertyName) {
  if (propertyName.indexOf('z-') > -1) {
    node.addEventListener(propertyName.split('-')[1], this.fn)
  }
}

Event.prototype.unhook = function (node, propertyName) {
  if (propertyName.indexOf('z-') > -1) {
    node.removeEventListener(propertyName.split('-')[1], this.fn)
  }
}

module.exports = Event
