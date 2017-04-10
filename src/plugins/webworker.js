/** Vuejs Webworker plugin */
import Vue from 'vue'

const WebWorker = {
  install(Vue, options) {
    Vue.myGlobalMethod = function() {
      console.log("called")
    }
  }
}

Vue.use(WebWorker)
export default WebWorker
