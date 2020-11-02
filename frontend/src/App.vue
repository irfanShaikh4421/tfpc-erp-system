<template>
  <v-app>
    <v-layout row  fluid wrap  style='position: relative'
      fill-height
    
      :justify-center='$vuetify.breakpoint.mdAndDown'
      :align-end='$vuetify.breakpoint.mdAndDown'
      
    >
      

      <v-layout style='position: absolute; top: 0px left: 0px; width: 100%; height: 100%; background: url("/bg.jpg"); background-repeat: repeat;background-position: center;background-size: cover;  z-index: -1'>
      </v-layout>

      <v-flex class='navRouter' xs12 lg2 shrink>

       
          <router> </router>
        
      </v-flex>
 
      <v-flex pa-5 :ml-5='$vuetify.breakpoint.mdAndUp' xs11 lg9 style='min-height: 100vh' 
        :shsrink='$vuetify.breakpoint.smAndDown'
      >

        
         <transition name='fade' mode='out-in'>
            <router-view> </router-view>
        </transition>

      </v-flex>

      <v-flex lg1 shrink>
      </v-flex>
      
      

    </v-layout>
  </v-app>
</template>

<script>
import router from './components/router';

export default {
  name: 'App',
  components: {
    router,
  },
  data: () => ({
    //
  }),

  async mounted(){
    //alert(`Mounted -> ${this.$route.path}`)
    
    if(!this.$root.$data.$loggedIn)
    {
      let res = await axios.get(this.$config.baseUrl+'isLoggedIn')

      if(res.status == 200)
      {
        //alert(JSON.stringify(res,'',2))
        this.$root.$data.$loggedIn = true
        this.$root.$data.$name = res.data.name

        if(this.$route.path == '/')
        {
          this.$router.push('/clients').catch( err => console.log('err -> '+err))
        }
        /*else
        {
          this.$router.push(this.$route.path).catch( err => console.log('err -> '+err))
        }*/
      }
    }
  }
};



</script>


<style >
  .theme--light.v-application
  {
    background: rgba(0,0,0,0) !important;
  }

  .fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(10%)
}

.v-application--is-ltr .v-list-group--no-action > .v-list-group__items > div > .v-list-item 
{
  padding-left: 36px !important;
}

  @page :first
  {
      margin: 0mm !important;
      size: A4;
  }
  @page {
  margin-left: 0mm !important;
  }


</style>