<template>
    <v-layout v-bind='$attrs' wrap>

        <v-flex xs12  sm12 >
            <v-autocomplete 
                autocomplete="off"
                label='Clients'
                :loading='!extras.clients.error && extras.clients.loading ? extras.clients.loading : false '
                :items='!extras.clients.loading && !extras.clients.error ? extras.clients.data : []'
                v-validate="'required'"
                data-vv-name='client_names'
                :error-messages="errors.collect('client_names')"
                v-model='form.client_id'

                type='search'
                
            > </v-autocomplete>

        </v-flex>

        <v-flex xs12  sm6 >
            <v-autocomplete 
                autocomplete="off"
                label='Projects'
                :loading='!extras.projects.error && extras.projects.loading ? extras.projects.loading : false '
                :items='!extras.projects.loading && !extras.projects.error ? extras.projects.data : []'
                v-validate="'required'"
                data-vv-name='project_names'
                :error-messages="errors.collect('project_names')"
                v-model='form.project_id'
                type='search'
                
            > </v-autocomplete>

        </v-flex>

        <v-flex xs12  sm6 >
            <v-autocomplete 
                autocomplete="off"
                label='Persons'
                :loading='!extras.persons.error && extras.persons.loading ? extras.persons.loading : false '
                :items='!extras.persons.loading && !extras.persons.error ? extras.persons.data : []'
                v-validate="'required'"
                data-vv-name='person_names'
                :error-messages="errors.collect('person_names')"
                v-model='form.person_id'
                
            > </v-autocomplete>

        </v-flex>

        <v-flex xs12 sm6 >
            <v-text-field 
                v-model="form.location" 
                label="Location"
                v-validate="'required|min:3|max:128'"
                data-vv-name='location'
                :error-messages="errors.collect('location')"
            ></v-text-field>
        </v-flex>


        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.revision" 
                label="Revision"
                v-validate="'numeric|required|min:1'"
                data-vv-name='revision'
                :error-messages="errors.collect('revision')"
            ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.site_supervisor" 
                label="Tfpc's Site Supervisor"
                v-validate="'required|min:3|max:64'"
                data-vv-name='site_supervisor'
                :error-messages="errors.collect('site_supervisor')"
            ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.autocad_engineer" 
                label="Autocad Engineer"
                v-validate="'required|min:3|max:64'"
                data-vv-name='autocad_engineer'
                :error-messages="errors.collect('autocad_engineer')"
            ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.plan_approved_by" 
                label="Plan Approved By"
                v-validate="'required|min:3|max:64'"
                data-vv-name='plan_approved_by'
                :error-messages="errors.collect('plan_approved_by')"
            ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.labour_contractor" 
                label="Labour Contractor"
                v-validate="'required|min:3|max:64'"
                data-vv-name='labour_contractor'
                :error-messages="errors.collect('labour_contractor')"
            ></v-text-field>
        </v-flex>



        <!-- auto generated -->

        <v-flex shrink align-self-end>
            <v-btn @click='newHeading'> Add Product </v-btn>
        </v-flex>

         
        <v-flex xs12 v-if='form.products_headings.length > 0'>
            
            <v-layout wrap style='rgba(0,0,0,.2); border-radius: 15px' v-for='(item,index) in form.products_headings' my-5 pa-5
            
                align-center
            >



            
                <v-flex xs11>
                    <h1>
                        <v-text-field 
                            v-model="form.products_headings[index].heading" 
                            label="Heading"
                            v-validate="'required|min:3|max:64'"
                            :data-vv-name="'heading_'+index"
                            :error-messages="errors.collect('heading_'+index)"
                        ></v-text-field>
                    </h1>
                </v-flex>

                <v-flex xs1 shrink> 
                    <v-icon @click='removeHeading(index)'> delete </v-icon>
                </v-flex>



                <v-flex xs12>
                    <h1>
                        <v-text-field 
                            v-model="form.products_headings[index].subheading" 
                            label="Sub-heading"
                            v-validate="'required|min:3|max:64'"
                            :data-vv-name="'subheading'+index"
                            :error-messages="errors.collect('subheading'+index)"
                        ></v-text-field>
                    </h1>
                </v-flex>


                <template v-for='(i,ii,arr) in item.pItems' >

                    <v-flex xs6>
                    
                        <v-autocomplete 
                            autocomplete="off"
                            label='Product'

                            class='px-5'
                            
                        
                            v-validate="'required'"
                            :data-vv-name="'product_'+index+'_'+ii"
                            
                            :items='products'

                            v-model='form.products_headings[index].pItems[ii].pid'
                            
                        > </v-autocomplete>

                    </v-flex>

                    <v-flex xs5>
                    
                        <v-text-field 
                            autocomplete="off"
                            label='Quantity'
                        
                            v-validate="'required'"
                            :data-vv-name="'quantity'+index+'_'+ii"


                            v-model='form.products_headings[index].pItems[ii].quantity'
                            
                        > </v-text-field>

                    </v-flex>

                    <v-flex xs1 shrink>
                        <v-icon @click='removeProduct(index,ii)'> delete </v-icon>
                    </v-flex>
                    
                    

                    <v-flex xs12 ml-5 v-if='ii == (item.pItems.length - 1)'>
                        <v-btn small rounded dark fab color='red'
                            @click='addPitem(index)'
                        >  <v-icon> add </v-icon> </v-btn>
                    </v-flex>

                </template>
                
            </v-layout>

        </v-flex>
        

        <!-- TAC -->



        
                                
    </v-layout>
</template>

<script>

import DataList from '@/components/data/DataList'
import DataModel from '@/components/data/DataModel'

import queryMixin from '@/components/mixins/query';
// import axios from 'axios';

export default {
    
    name: 'jobcard-form',
    mixins: [],

    props: {
        form: {
            type: Object,
            required: true
        }
    }, 

    components: {
        DataList
    },

    data(){
        return {

            products: [],
            refProducts: {},

            default: {
                client_id : 0,
                project_id : 0,
                person_id : 0,


                location : '',
                revision : 1,
                date : null,
                site_supervisor : '',
                autocad_engineer : '',
                plan_approved_by : '',
                labour_contractor : '',
                

                products_headings: []
            },

            extras: {
                clients: {
                    data: [],
                    loading: true,
                    error: false,
                    loaded: false
                },
                projects: {
                    data: [],
                    loading: true,
                    error: false,
                    loaded: false
                },
                persons: {
                    data: [],
                    loading: true,
                    error: false,
                    loaded: false
                },

                products_headings: {

                    data: [],
                    loading: true,
                    error: false,
                    loaded: false

                }
            },

            
        }
    },

    watch: {


    },
    mounted( ){
        
    
            this.$emit('init')

            

            this.$nextTick( () => {
                this.watchClientId()
                this.watchProjectId()
            } )

  
    },
    async created(){

        

        let client, projects, person = null

        try{
            client = await axios.get('clients',
                                        {
                                            withCredentials: true,
                                            params:{
                                            
                                        } })

            if(client)
            {
                this.extras.clients.loading = false
                this.extras.clients.error = false
                this.extras.clients.data = this.generateItems(client.data.results,'client_id')

                try{
                    projects = await axios(
                                        {
                                            methods: 'GET',
                                           
                                            url: 'projects',
                                            withCredentials: true,
                                            params: {
                                                client_id : this.form.client_id
                                            }
                                        }
                                        )
                                        
                
                    if(projects)
                    {

                        this.extras.projects.loading = false
                        this.extras.projects.error = false
                        this.extras.projects.data = this.generateItems(projects.data.results,'project_id')

                        try{

                            person = await axios.get('persons',
                                            {
                                                withCredentials: true,
                                                params : {
                                                    client_id : this.form.client_id
                                                } 
                                            })

                            if(person)
                            {
                                this.extras.persons.loading = false
                                this.extras.persons.error = false
                                this.extras.persons.data = this.generateItems(person.data.results,'person_id')
                            }
                        }

                        catch(e){
                            console.log('Persons -> '+ e)
                            if(e)
                                this.extras.persons.error = true
                        }
                        

                    }


                } 
                catch(e){

                    
                    if(e)
                    {
                        this.extras.projects.error = true
                        //alert(JSON.stringify(e))
                    }
                        
                    // projects catch
                }

            }
 

        }
        catch(e)
        {
            // client catch

            if(e)
                extras.client.error = true
        }
            
        


         /*this.setTimeout( () => {
             this.ready = true
         }, 1500)*/



         let products = await axios.get('products',{withCredentials: true})
         this.products = this.generateItems(products.data.results,'product_id')

         if(products)
         {
             this.refProducts = this.productsToObj(products.data.results)
         }
        
    
    },

    methods : {
        


        removeHeading(i){
            this.form.products_headings.splice(i,1)
        },
        removeProduct(i,ii){
            this.form.products_headings[i].pItems.splice(ii,1)
        },

        productsToObj(input){

            let temp = {}
            Object.keys(input).forEach( (k,i,a) => {
                temp[Number(input[k].product_id)] = input[k]
            } )
            return temp

        },
        
        watchClientId(){
            this.$watch( 'form.client_id', function( newVal, oldVal ) {
                if(newVal )
                {

                   
                
                    this.form.project_id = null
                    this.form.person_id = null
                    
                    //alert('yo')
                    axios.get('projects',{withCredentials: true,
                        params: {
                        client_id : this.form.client_id
                    }})
                    .then( (r) => {
                        this.extras['projects'].data = this.generateItems(r.data.results,'project_id')
                        this.extras['projects'].loading = false
                        this.extras['projects'].error = false 
                    } )
                    .catch( (e) => {
                        this.extras['projects'].error = true
                        this.extras['projects'].loading = false
                        this.extras['projects'].data = []
                    })

                    axios.get('persons',{
                        withCredentials: true,
                        params: {
                        client_id : this.form.client_id
                    }})
                    .then( (r) => {
                        this.extras['persons'].data = this.generateItems(r.data.results,'person_id')
                        this.extras['persons'].loading = false
                        this.extras['persons'].error = false 
                    } )
                    .catch( (e) => {
                        this.extras['persons'].error = true
                        this.extras['persons'].loading = false
                        this.extras['persons'].data = []
                    })
                }
            } )
        },
        watchProjectId(){
            this.$watch( 'form.project_id', function( newVal, oldVal ) {
                if(newVal)
                {
                
                    //this.form.person_id = null

                }
            } )
        },



        newHeading(){

            let tempObj = {
                heading: '',
                subheading: '',
                pItems: [
                    {
                        pid: -1,
                        quantity: 0
                    }
                ]
            }
            

            this.form.products_headings.push(tempObj)
        
        },

        addPitem(i){
            let tempObj = { pid: -1, quantity: 0 }
            this.form.products_headings[i].pItems.push(tempObj)
        },

        formSubmit(){
            this.$validator.validateAll().then( (r) => {
                           // dialog.functions.create(this.editedItem);
            } );
        },

        validate(){
            return new Promise( (resolve,reject) => {
                this.$validator.validateAll()
                .then( (r) => {
                    resolve(this.form)
                } )
                .catch( (e) => {
                    reject(e)
                } )
            } ) 
        },

        cloneData(r,to,primary_key){

            
            this.extras[to].data = this.generateItems(r.data.results,primary_key)
            this.extras[to].loading = true
        },

        cloneError(e){
            this.extras.clients.error = true
            this.extras.clients.loading = false
        },

        generateItems(input,key){
            let temp = []
            input.forEach( (item,index) => {
                temp.push({
                    text: item.name,
                    value: Number(item[key])
                    })
            } )

            return temp
        },
    }

}
</script>

<style>

</style>
