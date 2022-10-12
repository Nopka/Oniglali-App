<template>
  <div>
    <h1>Total Number of pokemon : {{NumberOfPokemon}}</h1>
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
              <router-link 
                :to="{name:'MoreInfos',params:{idPokemon: pokemon.id}}"
                class="btn btn-info infobutton"
              >
                More Informations
              </router-link>
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
      NumberOfPokemon:this.$store.state.NumberOfPokemons,
      complete_pokedex:[],
    }
  },
  async created(){
    await this.getNumberOfPokemon();
    if (this.$store.state.Pokedex.length != this.$store.state.NumberOfPokemons) {
      console.log("taille du tableau dans le store : "+this.$store.state.Pokedex.length+", et nombre valeur de NumberOfPokemons dans le store : "+ this.$store.state.NumberOfPokemons)
      await this.PopulatePokedex();
    } else{
      console.log("pas besoin d'appeller l'api !");
    }
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
        axios // await devant axios, remettre si jamais les pokemons ne sont pas trié
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
              alert(error);
            } else {
              alert(error);
            }
          });
          
      }
      // trier le tableau complete_pokedex par id de pokemon
      var temp = this.sort_by_key(this.complete_pokedex,'id');
      this.$store.commit('addToPokedex',temp);
      console.log('function populatePokedex ended');
    },
    sort_by_key(array, key){
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
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
</style>