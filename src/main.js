// specific dependencies
import Vue from 'vue'
import App from './App'

// local plugins
import store from './store'
import router from './plugins/router'
import butterfly from './plugins/butterfly'

// application-wide css
import Bootstrap from 'bootstrap/dist/css/bootstrap.css'
import FontAwesome from 'font-awesome/css/font-awesome.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
