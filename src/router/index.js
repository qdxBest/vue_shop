import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Goodslist from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: 'Welcome',
    children:[
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'Users',
        component: Users
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'Cate',
        component: Cate
      },
      {
        path: '/params',
        name: 'Params',
        component: Params
      },
      {
        path: '/goods',
        name: 'Goodslist',
        component: Goodslist,
      },
      {
        path: '/goods/add',
        name: 'Add',
        component: Add,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach( (to, from, next) => {
  if(to.path === '/login')
    return next();

  const token = window.sessionStorage.getItem('token');

  if(!token)
    return next('/login');
  next();
})

export default router
