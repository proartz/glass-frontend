import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Orders from './views/Orders.vue'
import Positions from './views/Positions.vue'
import Operations from './views/Operations.vue'
import Materials from './views/Materials.vue'
import OrdersToolbar from './components/OrdersToolbar.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component:  Home
    },
    {
      path: '/orders',
      name: 'Zlecenia',
      components: {
        default: Orders,
        navigation: OrdersToolbar
      }
    },
    {
      path: '/positions',
      name: 'Pozycje',
      component: Positions
    },
    {
      path: '/blah',
      name: 'blah',
      component: OrdersToolbar
    },
    {
      path: '/operations',
      name: 'operations',
      component: Operations
    },
    {
      path: '/materials',
      name: 'materials',
      component: Materials
    }
  ]
})
