function Event (fn) {
  this.fn = function (e) {
    if (!e.keyCode) e.preventDefault()
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
