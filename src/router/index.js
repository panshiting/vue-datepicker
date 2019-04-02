import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Datepicker',
      component: () => import('@/views/Index'),
      meta: {
        title: '日历'
      }
    }
  ]
})