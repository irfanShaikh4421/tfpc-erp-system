<template>
  
  <v-layout wrap

  >

    <v-snackbar
        v-model="snackbar.status"
        top
        :color='snackbar.color'
    >
        <v-layout justify-center>
            <h1 class='body-1'> {{ snackbar.message }} </h1>

        </v-layout>

    </v-snackbar>

    <v-flex xs12
        
    >

        <v-text-field
            v-model='email'
            label='Email'
            solo
            rounded
            :filled='!isFirefox()'
            dark

            v-validate="'required|email'"
            data-vv-name='email'
            :error-messages="errors.collect('email')"
            
        >
        </v-text-field>

    </v-flex>

    <v-flex xs12>
        <v-text-field
        v-model='password'
        label='password'
        type='password'
        solo
        rounded
        :filled='!isFirefox()'
        dark

        v-validate="'required|min:3|max:128'"
        data-vv-name='password'
        :error-messages="errors.collect('password')"
      >

      </v-text-field>
    
    </v-flex>

    <v-flex xs12 grow>
        <v-btn text color='info' light @click='onLogin' rounded width='100%' > login </v-btn>
    </v-flex>
     

      
  </v-layout>


</template>


<script>


import qs from 'qs'



export default {



   /* beforeRouteEnter( to,from, next ){

        alert('hi')

        console.log('yo')
        if(localStorage.email)
        {
            next('/')

        }
        else
            next()
    },*/

    mounted(){

        //alert(localStorage.email)

        if(this.$root.$data.$loggedIn == true)
        {
            this.$router.push('/clients')

        }
    },

    data(){
        return {
            isLoggedIn(){
                return this.$root.$data.$loggedIn
            },
            email: '',
            password: '',
           // error: '',

            snackbar: {
                message: '',
                status: false,
                color: ''
            }
        }
    },


    methods: {
        
        isFirefox(){

            return typeof InstallTrigger !== 'undefined'
        },
        onLogin(){

            
            this.$validator.validateAll().then( (r) => {
                if(r)
                {
                    axios({
                        method: 'POST',
                        baseURL: this.$config.baseUrl,
                        url: '/login_f',
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },

                        data:  qs.stringify({
                            email: this.email,
                                password: this.password
                            })

                    })
                    .then( (r) => {
                        if(r)
                        {

                            this.$root.$data.$loggedIn = true
                            this.$root.$data.$name = r.data.name

                            this.$nextTick( () => {
                                this.$router.push('/clients')
                            } )
                            
                        }
                    } )
                    .catch( (e) => {

                        this.$root.$data.$loggedIn = false
                       
                        if(e.response.status == 400)
                        {
                            this.snackbar.message = 'Invalid form details. Please rectify errors in the login form'
                            this.snackbar.color = 'red'
                            this.snackbar.status = true
                            
                        }
                        else if(e.response.status == 401)
                        {
                            this.snackbar.message = 'Incorrect login details.'
                            this.snackbar.color = 'orange'
                            this.snackbar.status = true
                        }
                    } )
                }
            } )
            





            

        }

    }

}
</script>

<style>

</style>