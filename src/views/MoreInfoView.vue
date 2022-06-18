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
              <h3>Effectivness (damage from) :</h3>
              <div class="x4container" v-if="type_effectivness.x4.length > 0">
                <h4>x4</h4>
                <div class="type-container">
                  <button class="btn" v-for="type in this.type_effectivness.x4" :key="type" :class="type">
                    {{type}}
                  </button>
                </div>
              </div>
              <div class="x2container"  v-if="type_effectivness.x2.length > 0">
                <h4>x2</h4>
                <div class="type-container">
                  <button class="btn" v-for="type in this.type_effectivness.x2" :key="type" :class="type">
                    {{type}}
                  </button>
                </div>
              </div>
              <div class="x1container"  v-if="type_effectivness.x1.length > 0">
                <h4>x1</h4>
                <div class="type-container">
                  <button class="btn" v-for="type in this.type_effectivness.x1" :key="type" :class="type">
                    {{type}}
                  </button>
                </div>
              </div>
              <div class="x05container"  v-if="type_effectivness.x05.length > 0">
                <h4>x0.5</h4>
                <div class="type-container">
                  <button class="btn" v-for="type in this.type_effectivness.x05" :key="type" :class="type">
                    {{type}}
                  </button>
                </div>
              </div>
              <div class="x025container"  v-if="type_effectivness.x025.length > 0">
                <h4>x0.25</h4>
                <div class="type-container">
                  <button class="btn" v-for="type in this.type_effectivness.x025" :key="type" :class="type">
                    {{type}}
                  </button>
                </div>
              </div>
              <div class="x0container"  v-if="type_effectivness.x0.length > 0">
                <h4>x0</h4>
                <div class="type-container">
                  <button class="btn" v-for="type in this.type_effectivness.x0" :key="type" :class="type">
                    {{type}}
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "MoreInfos",
  data() {
    return {
      pokemonId: "",
      pokemonName: "",
      pokemonType1: "",
      pokemonType2: "",
      pokemonSprite: "",
      type_effectivness:{
        x4:[],
        x2:[],
        x1:[],
        x05:[],
        x025:[],
        x0:[]
      },
      tempDoubleTypes:{
        type1:{
          x2:[],
          x1:[],
          x05:[],
          x0:[]
        },
        type2:{
          x2:[],
          x1:[],
          x05:[],
          x0:[]
        }
      },
      Types:[]
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
        axios
          .get('https://pokeapi.co/api/v2/type')
          .then((response) => {
            response.data.results.forEach(element => {
              if (element.name !== "unknown" && element.name !== "shadow") {
                this.Types.push(element.name);
              }
            });
          })
        this.assess_effectiveness();
      }
    });
  },
  methods:{
    async assess_effectiveness(){
      if (this.pokemonType2 != '') {
        console.log("pokemonType2 = defined")
        // get type1 infos
        await axios 
          .get('https://pokeapi.co/api/v2/type/'+this.pokemonType1)
          .then((response) => {
            response.data.damage_relations.double_damage_from.forEach(element =>{
              this.distributeTypes(1,"2",element.name)
            });
            response.data.damage_relations.half_damage_from.forEach(element => {
              this.distributeTypes(1,"05",element.name)
            });
            response.data.damage_relations.no_damage_from.forEach(element =>{
              this.distributeTypes(1,"0",element.name)
            });
            var tempTypes = this.Types;
            const typesToDelete = [];
            this.type_effectivness.x2.forEach(typex2 => {
              typesToDelete.push(typex2);
            });
            this.type_effectivness.x05.forEach(typex05 => {
              typesToDelete.push(typex05);
            });
            this.type_effectivness.x0.forEach(typex0 => {
              typesToDelete.push(typex0);
            });
            const typesToDeleteSet = new Set(typesToDelete);
            const x1Types = tempTypes.filter((type) => {
              return !typesToDeleteSet.has(type);
            });
            x1Types.forEach(element => {
              this.distributeTypes(1,"1",element);
            });
            this.type_effectivness.x2 = [];
            this.type_effectivness.x05 = [];
            this.type_effectivness.x0 = [];
            this.type_effectivness.x1 = [];
            
          })

          //get type2 infos
          await axios 
          .get('https://pokeapi.co/api/v2/type/'+this.pokemonType2)
          .then((response) => {
            response.data.damage_relations.double_damage_from.forEach(element =>{
              this.distributeTypes(2,"2",element.name)
            });
            response.data.damage_relations.half_damage_from.forEach(element => {
              this.distributeTypes(2,"05",element.name)
            });
            response.data.damage_relations.no_damage_from.forEach(element =>{
              this.distributeTypes(2,"0",element.name)
            });
            var tempTypes = this.Types;
            const typesToDelete = [];
            this.type_effectivness.x2.forEach(typex2 => {
              typesToDelete.push(typex2);
            });
            this.type_effectivness.x05.forEach(typex05 => {
              typesToDelete.push(typex05);
            });
            this.type_effectivness.x0.forEach(typex0 => {
              typesToDelete.push(typex0);
            });
            const typesToDeleteSet = new Set(typesToDelete);
            const x1Types = tempTypes.filter((type) => {
              return !typesToDeleteSet.has(type);
            });
            x1Types.forEach(element => {
              this.distributeTypes(2,"1",element);
            });
            this.type_effectivness.x2 = [];
            this.type_effectivness.x05 = [];
            this.type_effectivness.x0 = [];
            this.type_effectivness.x1 = [];
          })
          this.Types.forEach(type => {
            var multiplierSlot1 = this.findMultiplier(type,"slot1");
            var multiplierSlot2 = this.findMultiplier(type,"slot2");
            console.log("multiplierSlot1 : ",multiplierSlot1,"multiplierSlot2 : ",multiplierSlot2);
            var convertedMultiplier1 = this.convertMultiplierToInteger(multiplierSlot1);
            var convertedMultiplier2 = this.convertMultiplierToInteger(multiplierSlot2);
            var finalTypeMultiplier = this.convertMultiplierToInteger(multiplierSlot1) * this.convertMultiplierToInteger(multiplierSlot2);
            console.log(finalTypeMultiplier);
            //"ranger" le {type} dans le bon {finalTypeMultiplier}
            this.distributeTypes("",finalTypeMultiplier,type);
          });
      } else {
        console.log("pokemonType2 = undefined")
        await axios
          .get('https://pokeapi.co/api/v2/type/'+this.pokemonType1)
          .then((response) => {
            response.data.damage_relations.double_damage_from.forEach(element => {
              this.distributeTypes(1,"2",element.name)
            });
            response.data.damage_relations.half_damage_from.forEach(element => {
              this.distributeTypes(1,"05",element.name)
            });
            response.data.damage_relations.no_damage_from.forEach(element => {
              this.distributeTypes(1,"0",element.name)
            })
            var tempTypes = this.Types;
            const typesToDelete = [];
            this.tempDoubleTypes.type1.x2.forEach(typex2 => {
              typesToDelete.push(typex2);
            });
            this.tempDoubleTypes.type1.x05.forEach(typex05 => {
              typesToDelete.push(typex05);
            });
            this.tempDoubleTypes.type1.x0.forEach(typex0 => {
              typesToDelete.push(typex0);
            });
            const typesToDeleteSet = new Set(typesToDelete);
            const x1Types = tempTypes.filter((type) => {
              return !typesToDeleteSet.has(type);
            });
            x1Types.forEach(element => {
              this.distributeTypes(1,"1",element);
            });
            
            
          })
      }
    },
    distributeTypes(slot,multiplier,type){
      if (slot == 1) {
        switch (multiplier) {
          case "2":
            this.type_effectivness.x2.push(type);
            this.tempDoubleTypes.type1.x2.push(type);
            break;
          case "05":
            this.type_effectivness.x05.push(type);
            this.tempDoubleTypes.type1.x05.push(type);
            break;
          case "0":
            this.type_effectivness.x0.push(type);
            this.tempDoubleTypes.type1.x0.push(type);
            break;
          case "1":
            this.type_effectivness.x1.push(type);
            this.tempDoubleTypes.type1.x1.push(type);
            break;
        }
      } else if (slot == 2){
        switch (multiplier) {
          case "2":
            this.type_effectivness.x2.push(type);
            this.tempDoubleTypes.type2.x2.push(type);
            break;
          case "05":
            this.type_effectivness.x05.push(type);
            this.tempDoubleTypes.type2.x05.push(type);
            break;
          case "0":
            this.type_effectivness.x0.push(type);
            this.tempDoubleTypes.type2.x0.push(type);
            break;
          case "1":
            this.type_effectivness.x1.push(type);
            this.tempDoubleTypes.type2.x1.push(type);
            break;
        }
      } else{
        switch (multiplier) {
          case 0:
            this.type_effectivness.x0.push(type);
            break;
          case 0.25:
            this.type_effectivness.x025.push(type);
            break;
          case 0.5:
            this.type_effectivness.x05.push(type);
            break;
          case 1:
            this.type_effectivness.x1.push(type);
            break;
          case 2:
            this.type_effectivness.x2.push(type);
            break;
          case 4:
            this.type_effectivness.x4.push(type);
            break;
          default:
            console.log("erreur avec le multiplier : ",multiplier," pour le type : ",type);
            break;
        }
      }
    },
    findMultiplier(type,slot){
      // console.log("findMultiplier was called with : "+type +" & "+slot+" as parameters");
      var multiplier = "something went wrong when finding the multiplier for : "+type;
      //pour le {type}, parcourir les listes des effectiveness du {slot}
      // console.log("findmultiplier called on slot :",slot,"with type : ",type);
      switch (slot) {
        case "slot1":
          Object.entries(this.tempDoubleTypes.type1).forEach( ([x,value]) => {
            // console.log("x = "+x+" value = "+value);
            value.forEach(typeX =>{
              // console.log("typeX = "+typeX);
              if (typeX === type) {
                multiplier = x;
              }
            });
          });
          break;
        case "slot2":
          Object.entries(this.tempDoubleTypes.type2).forEach( ([x,value]) => {
            // console.log("x = "+x);
            value.forEach(typeX =>{
              // console.log("typeX = "+typeX);
              if (typeX === type) {
                multiplier = x;
              }
            });
          });
          break;
      }
      return multiplier
    },
    convertMultiplierToInteger(multiplierString){
      switch (multiplierString) {
        case "x2":
          return 2;
          break;
        case "x1":
          return 1;
          break;
        case "x0":
          return 0;
          break;
        case "x05":
          return 0.5;
          break;
        default:
          return null;
          break;
      }
    }
  }
  
};
</script>

<style scoped>
.type-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
