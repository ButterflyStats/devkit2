import Vue from 'vue'
import Router from 'vue-router'

import classes from 'components/classes'
import dashboard from 'components/dashboard'
import entities from 'components/entities'
import stringtables from 'components/stringtables'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: dashboard
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: dashboard
    },
    {
      path: '/classes',
      name: 'Classes',
      component: classes
    },
    {
      path: '/entities',
      name: 'Entities',
      component: entities
    },
    {
      path: '/stringtables',
      name: 'Stringtables',
      component: stringtables
    }
  ]
})
