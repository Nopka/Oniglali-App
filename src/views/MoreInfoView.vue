<template>
  <div class="card mb-3">
    <div class="row g-0">
      <div class="col-md-4">
        <img :src="this.pokemonSprite" class="img-fluid rounded-start imgPokemon" />
      </div>
      <div class="col-md-8">
        <div class="card-body">
            <h1 class="card-title"><u>Name :</u> {{ pokemonName }}</h1>
            <h3><u>National Pokedex :</u> #{{ pokemonId }}</h3>
            <h3>Types :</h3>
            <div class="type-container" v-if="pokemonType2 != ''">
                <button class="btn" :class="pokemonType1">{{ pokemonType1 }}</button>
                <button class="btn" :class="pokemonType2">{{ pokemonType2 }}</button>
            </div>
            <div class="type-container" v-else>
                <button class="btn" :class="pokemonType1">{{pokemonType1}}</button>
            </div>
            <div class="effectivness-container">
                <h3>Effectivness :</h3>
            </div>
        </div>
      </div>
    </div>
    

    
    
  </div>
</template>

<script>
export default {
  name: "MoreInfos",
  data() {
    return {
      pokemonId: "",
      pokemonName: "",
      pokemonType1: "",
      pokemonType2: "",
      pokemonSprite: "",
    };
  },
  mounted() {
    this.$store.state.Pokedex.forEach((pokemon) => {
      if (pokemon.id == this.$route.params.idPokemon) {
        this.pokemonId = pokemon.id;
        this.pokemonName = pokemon.name;
        this.pokemonSprite = pokemon.sprite;
        if (pokemon.types.length == 2) {
          this.pokemonType1 = pokemon.types[0].type.name;
          this.pokemonType2 = pokemon.types[1].type.name;
        } else {
          this.pokemonType1 = pokemon.types[0].type.name;
        }
      }
    });
  },
};
</script>

<style scoped>
.type-container{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
}
.imgPokemon{
    width: 60%;
}
.card{
    margin-left: 1%;
    margin-right: 1%;
}
</style>
