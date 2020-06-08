import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

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
