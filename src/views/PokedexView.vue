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
                <button class="btn" :class="type.type.name">{{type.type.name}}</button>
              </div>
            </div>
            <div class="moreInfo-container">
              <button class="btn btn-info infobutton">More Informations</button>
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
      complete_pokedex:[],
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
  .moreInfo-container{
    border-top: solid #d2d2d2 1px;
    margin-top: 2px;
    padding-top: 2px;
    display: flex;
    justify-content: center;
  }
  
  .normal{
    background-color: #a8a878;
  }
  .fighting{
    background-color: #bf2f28;
  }
  .flying{
    background-color: #a890ef;
  }
  .poison{
    background-color: #a03fa0;
  }
  .ground{
    background-color: #e0bf67;
  }
  .rock{
    background-color: #b89f38;
  }
  .bug{
    background-color: #a7b821;
  }
  .ghost{
    background-color: #705798;
  }
  .steel{
    background-color: #b8b7cf;
  }
  .fire{
    background-color: #f08031;
  }
  .water{
    background-color: #6890ef;
  }
  .grass{
    background-color: #77c850;
  }
  .electric{
    background-color: #f7d030;
  }
  .psychic{
    background-color: #f75888;
  }
  .ice{
    background-color: #97d8d8;
  }
  .dragon{
    background-color: #6f38f7;
  }
  .dark{
    background-color: #705848;
  }
  .fairy{
    background-color: #fdbae9;
  }

</style>