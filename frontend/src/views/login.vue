<template>
  
  <v-layout justify-center align-center fluid fill-height
    
  >

   
    <v-flex shrink
      class='login'
      pa-5

      xs12 lg6
    >
    <v-layout wrap align-center justify-center>
       <v-flex  shrink my-3>
        <h1 class='display-1' style='color: white;opacity: .7'> Hello There </h1>
      </v-flex>
      <v-flex xs12>
        <login> </login>
      </v-flex>
    </v-layout>
    </v-flex>
  </v-layout>

</template>

<script>

import login from '../components/auth/login'

export default {

    components: {
        login
    }





}
</script>

<style>

  .login{

    background: rgb(245, 249, 248,.1);
    
    border-radius: 15px;
    backdrop-filter: blur(13px);
    box-shadow: 0px 0px 10px 0px #000;
  }

  #input-42:-webkit-autofill,
  #input-42:-webkit-autofill:hover,
  #input-42:-webkit-autofill:focus,
  #input-42:-webkit-autofill:active {
      -webkit-transition-delay: 99999s;
  }

  @supports not ( backdrop-filter: blur(10px) )
  {
    .login
    {

      background: rgba(30, 30, 30, 1);

    }
  }


</style>