// Vue and Vuex
import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './modules/app'
import bf from './modules/butterfly'
import loading from './modules/loading'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    bf,
    loading
  }
})
