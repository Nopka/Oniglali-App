import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage:window.localStorage
})

export default new Vuex.Store({
  plugins:[vuexLocal.plugin],
  state: {
    NumberOfPokemons:0,
    Pokedex:{},
  },
  getters: {
  },
  mutations: {
    addToPokedex(state, complete_pokedex){
      state.Pokedex = complete_pokedex
    },
    setNumberOfPokemon(state, number){
      state.NumberOfPokemons = number
    }
  },
  actions: {
  },
  modules: {
  }
})
