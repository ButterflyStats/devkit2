/** Butterfly bindings for VueJS */
import Vue from 'vue'
import enums from '../worker_enums'

var Worker = require("worker-loader!../worker")

/** Butterfly object */
function bf() {
  this.loaded = false
  this.worker = null
  this.handlers = {}
}

/** Send message to webworker */
bf.prototype.send = function(type, message) {
  if (type !== 'openRequest') {
    var data = {type: enums[type], data: message}
    this.worker.postMessage(JSON.stringify(data))
  } else {
    this.worker.postMessage({type: enums[type], data: message})
  }
}

/** Load webworker */
bf.prototype.load = function() {
  var self = this
  this.worker = new Worker()

  // callback for messages
  this.worker.onmessage = function(event) {
    var data = JSON.parse(event['data'])
    self.on(data['type'], data['data'])
  }

  // send actual load
  this.send('loadRequest', null)
}

/** Open a new replay */
bf.prototype.open = function(file) {
  this.send('openRequest', {file: file})
}

/** Seek to a specific position */
bf.prototype.seek = function(time) {
  this.send('seekRequest', {time: time})
}

/** Parse a single message */
bf.prototype.parseOne = function() {
  this.send('parseOneRequest', null)
}

/** Toggle playing */
bf.prototype.togglePlaying = function() {
  this.send('togglePlayRequest', null)
}

/** Spew class */
bf.prototype.spewClass = function(id) {
  this.send('spewClassRequest', {id: id})
}

/** Spew entity */
bf.prototype.spewEntity = function(id) {
  this.send('spewEntityRequest', {id: id})
}

/** Get list of entities */
bf.prototype.getEntities = function() {
  this.send('entitiesRequest', null)
}

/** Get list of stringtables */
bf.prototype.getStringtables = function() {
  this.send('stringtablesRequest', null)
}

/** Called on each new worker message */
bf.prototype.on = function(type, data) {
  console.log("Got from webworker", enums.i2s(type))

  if (typeof this.handlers[type] !== "undefined") {
    this.handlers[type].forEach(function(c) {
      c(type, data)
    })
  }

  switch (type) {
    case enums['loadResponse']:
      this.loaded = true
      break
  }
}

/** Register a new bf handler */
bf.prototype.register = function(type, callback) {
  if (typeof this.handlers[enums[type]] === "undefined") {
    this.handlers[enums[type]] = []
  }

  this.handlers[enums[type]].push(callback)
}

const butterfly = {
  install(vue, options) {
    console.log(vue)
    vue.prototype.$bf = new bf()
  }
}

Vue.use(butterfly)
export default butterfly
