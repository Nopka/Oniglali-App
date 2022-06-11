<template>
  <div>
    <h1>Total Number of pokemon : {{NumberOfPokemon}}</h1>
    <!-- <button class="btn btn-warning" @click="this.PopulatePokedex">Charger les pokemons</button> -->
    <br>
    <br>
    <div class="cards-container">
      <div class="card" style="width: 18rem;" v-for="pokemon in this.$store.state.Pokedex" :key="pokemon.id || pokemon.name">
        <img :src=pokemon.sprite class="card-img-top" alt="image du pokemon"/>
          <div class="card-body">
            <h5 class="card-title">{{pokemon.name}}</h5>
            <h6>#{{pokemon.id}}</h6>
            <div class="type-container">
              <div class="card-text" v-for="type in pokemon.types" :key="type.slot">
                <button class="btn btn-secondary">{{type.type.name}}</button>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require('axios').default;

export default {
  name: 'Pokedex',
  data(){
    return {
      NumberOfPokemon:0,
      complete_pokedex:[]
    }
  },
  async created(){
    await this.getNumberOfPokemon();
    if (this.$store.state.Pokedex.length === this.$store.state.NumberOfPokemon) {
      await this.PopulatePokedex();
    }
  },
  components: {
  },
  methods:{
    async getNumberOfPokemon(){
      await axios
        .get('https://pokeapi.co/api/v2/pokemon-species/')
        .then((response) => {
          this.$store.commit('setNumberOfPokemon',response.data.count);
          this.NumberOfPokemon = response.data.count;

        })
    },
    async PopulatePokedex(){
      console.log('function populatePokedex launched');
      for (let pokeId = 1; pokeId <= this.NumberOfPokemon; pokeId++) {
        await axios
          .get('https://pokeapi.co/api/v2/pokemon/'+pokeId)
          .then((response) => {
            console.log(response)
            const TempPokemon = {
              "name" : response.data.name,
              "id" : response.data.id,
              "sprite" : response.data.sprites.front_default,
              "types" : response.data.types
            };
            this.complete_pokedex.push(TempPokemon);
          })
          .catch((error) => {
            if (axios.isAxiosError(error)) {
              handleAxiosError(error);
            } else {
              handleUnexpectedError(error);
            }
          });
          
      }
      this.$store.commit('addToPokedex',this.complete_pokedex);
      console.log('function populatePokedex ended');
    }
  }
}
</script>

<style scoped>
  .cards-container{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .type-container{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
  }
</style>