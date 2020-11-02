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
                label="Site Supervisor"
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

        <v-btn @click='newHeading'> Add Product </v-btn>

        <v-flex xs12 v-if='form.products_headings.length > 0'>
            
            <v-layout style='rgba(0,0,0,.2); border-radius: 15px' v-for='(item,index) in form.products_headings' my-5 pa-5>
                <h1>
                    <v-text-field 
                        v-model="form.products_headings[index].heading" 
                        label="Heading"
                        v-validate="'required|min:3|max:64'"
                        :data-vv-name="'heading_'+index"
                        :error-messages="errors.collect('heading_'+index)"
                    ></v-text-field>
                </h1>
                <h1>
                    <v-text-field 
                        v-model="form.products_headings[index].subheading" 
                        label="Sub-heading"
                        v-validate="'required|min:3|max:64'"
                        :data-vv-name="'subheading'+index"
                        :error-messages="errors.collect('subheading'+index)"
                    ></v-text-field>
                </h1>

                <template v-for='i,ii in item.pItems' >
                    
                    <v-autocomplete 
                        autocomplete="off"
                        label='Product'
                        
                        :loading='!extras.products_headings[index][ii].loading && !extras.products_headings[index][ii].loading ? !extras.products_headings[index][ii].loading : false '
                        :items='!!extras.products_headings[index][ii].loading && !!extras.products_headings[index][ii].error ? !extras.products_headings[index][ii].data : []'
                        v-validate="'required'"
                        :data-vv-name="'product_'+index+'_'+ii"
                        :error-messages="'product_'+index+'_'+ii"
                        v-model='form.products_headings[index][ii].pid'
                        
                    > </v-autocomplete>
                            

                </template>
                
            </v-layout>

        </v-flex>

        
                                
    </v-layout>
</template>

<script>

import DataList from '@/components/data/DataList'
import DataModel from '@/components/data/DataModel'

import queryMixin from '@/components/mixins/query';
// import axios from 'axios';

export default {
    
    name: 'project-form',
    mixins: [],

    props: {
        form: {
            type: Object,
            required: true
        },

        isEdit: {
            type: Boolean
        }
    }, 

    components: {
        DataList
    },

    data(){
        return {

            ready: false,

            default: {
                client_id : 0,
                project_id : 0,
                person_id : 0,


                location : '',
                revision : 0,
                date : null,
                site_supervisor : '',
                autocad_engineer : '',
                plan_approved_by : '',
                labour_contractor : '',
                

                person_id : 0,
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

                }
            },

           
        }
    },

     watch : {

        /*item(newVal){
        
            this.form = Object.assign({},newVal)
        } */

        
        'form.client_id' : {

            deep: true,
            handler: function(newVal,oldVal){
                //alert('yo '+newVal)
                if(newVal && this.ready)
                {
                
                    this.form.project_id = null
                    this.form.person_id = null
                    
                    //alert('yo')
                    axios.get('projects',{params: {
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
                }
            }

        },
        

        'form.project_id' : function(newVal,oldVal){
            if(newVal && this.ready)
            {
            
                this.form.person_id = null


                axios.get('persons',{params: {
                    project_id : this.form.project_id
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
        }
        



    },

    created( ){
        
        
            this.form.products_headings.forEach( (k,i,a) => {
                i.pItems.forEach((kk,ii,aa) => {
                    this.extras['product_headings'][i][ii].loading = true
                    this.extras['product_headings'][i][ii].error = false
                    this.extras['product_headings'][i][ii].data = []
                })
            } )


        if(!this.isEdit)
            this.ready = true
    }
,
    async mounted(){

        this.$emit('init')


        

        /*this.$nextTick( () => {
            this.$emit('init')
        } )*/

        // clients



         axios.get('clients',{params: {}})
         .then( (r) => {
            this.extras['clients'].data = this.generateItems(r.data.results,'client_id')
            this.extras['clients'].loading = false
            this.extras['clients'].error = false 
         } )
         .catch( (e) => {
            this.extras['clients'].error = true
            this.extras['clients'].loading = false
            this.extras['clients'].data = []
         })


        if(this.isEdit)
        {
            // projects



            axios.get('projects',{params: {}})
            .then( (r) => {

                if(r){
                     this.extras['projects'].data = this.generateItems(r.data.results,'project_id')
                this.extras['projects'].loading = falseto
                this.extras['projects'].error = false 
                
                
               

                    axios.get('persons',{params: {}})
                    .then( (r) => {

                        if(r)
                        {
                            this.extras['persons'].data = this.generateItems(r.data.results,'person_id')
                            this.extras['persons'].loading = false
                            this.extras['persons'].error = false 



                            this.$nextTick( () => {

                                alert('ticked')
                                this.ready = true

                            } )
                        }
                        

                    
                        
                    } )
                    .catch( (e) => {
                        this.extras['persons'].error = true
                        this.extras['persons'].loading = false
                        this.extras['persons'].data = []
                })

                }
            } )
            .catch( (e) => {
                this.extras['projects'].error = true
                this.extras['projects'].loading = false
                this.extras['projects'].data = []
            }) 



            //persons

           
        } 
        


         /*this.setTimeout( () => {
             this.ready = true
         }, 1500)*/
        
    
    },

    methods : {

        newHeading(){
            alert('yo')
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
