import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'

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
    component: Home
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach( (to, from, next) => {
  if(to.path === '/login') return next();
  const token = window.sessionStorage.getItem('token');
  if(!token) return next('/login');
  next();
})

export default router
