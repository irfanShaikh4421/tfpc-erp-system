<template>
  
  <v-layout>
      <v-text-field
        :value='email'
        label='Email'
      >

      </v-text-field>

      <v-text-field
        :value='password'
        label='password'
        type='password'
      >

      </v-text-field>
  </v-layout>


</template>

<script>
export default {

    data(){
        return {
            email: '',
            password: ''
        }
    }

}
</script>

<style>

</style>