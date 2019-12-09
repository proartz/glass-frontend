import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Orders from './views/Orders.vue'
import Positions from './views/Positions.vue'
import Materials from './views/Materials.vue'
import OrdersToolbar from './components/OrdersToolbar.vue'
import AddOrder from './views/AddOrder.vue'
import AddOrderToolbar from './components/AddOrderToolbar.vue'
import PositionsToolbar from './components/PositionsToolbar.vue'
import ViewOrder from './views/ViewOrder.vue'
import ViewOrderToolbar from './components/ViewOrderToolbar.vue'
import EditOrder from './views/EditOrder.vue'
import EditOrderToolbar from './components/EditOrderToolbar.vue'
import store from './store'
import Login from './views/Login.vue'
import Users from './views/Users.vue'
import AddUser from './views/AddUser.vue'
import UsersToolbar from './components/UsersToolbar.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,

  routes: [
    {
      path: '/login',
      name: 'Zaloguj',
      component: Login
    },
    {
      path: '/users',
      name: 'Użytkownicy',
      components: {
        default: Users,
        navigation: UsersToolbar
      },
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/users/add',
      name: 'Dodaj Użytkownika',
      component: AddUser,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/orders',
      name: 'Zlecenia',
      components: {
        default: Orders,
        navigation: OrdersToolbar
      },
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/orders/add',
      name: 'Dodaj Zlecenie',
      components: {
        default: AddOrder,
        navigation: AddOrderToolbar
      },
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/orders/:id',
      name: 'Zlecenie',
      components: {
        default: ViewOrder,
        navigation: ViewOrderToolbar
      },
      props: {default: true, navigation: true},
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/orders/:id/edit',
      name: 'Edytuj Zlecenie',
      components: {
        default: EditOrder,
        navigation: EditOrderToolbar
      },
      props: {default: true, navigation: true},
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/positions',
      name: 'Pozycje',
      components: {
        default: Positions,
        navigation: PositionsToolbar
      },
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/materials',
      name: 'materials',
      component: Materials,
      meta: {
        requiresAuth: true,
      }
    },
    { path: '*', redirect: '/orders' }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(!store.getters.isLoggedIn) {
      next({
        path: '/login'
      })
    } else {
      if(to.matched.some(record => record.meta.requiresAdmin)) {
        if(!store.getters.isAdmin) {
          next({
            path: '/login'
          })
        } else {
          next();
        }
      } else {
        next();
      } 
    }
  } else {
    next();
  }
});

export default router;