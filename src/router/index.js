import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokedexView from '../views/PokedexView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path:'/pokedex',
    name:'pokedex',
    component: PokedexView
  },
  {
    path: '/moreInformations/:idPokemon',
    name: 'MoreInfos',
    component: () => import('../views/MoreInfoView.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
