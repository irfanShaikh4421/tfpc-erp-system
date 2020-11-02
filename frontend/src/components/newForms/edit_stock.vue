<template>
    <v-layout v-bind='$attrs' wrap>   
        
        <v-flex xs12 md6>
             <v-autocomplete 
                autocomplete="off"
                label='Sender'
                :loading='!extras.projects.error && extras.projects.loading ? extras.projects.loading : false '
                :items='!extras.projects.loading && !extras.projects.error ? extras.projects.data : []'
                v-validate="'required'"
                data-vv-name='sender'
                :error-messages="errors.collect('sender')"
                v-model='form.sender'

                type='search'
                
            > </v-autocomplete>
        </v-flex>
        <v-flex xs12 md6>
             <v-autocomplete 
                autocomplete="off"
                label='Receiver'
                :loading='!extras.projects.error && extras.projects.loading ? extras.projects.loading : false '
                :items='!extras.projects.loading && !extras.projects.error ? receiverItems : []'
                v-validate="'required'"
                data-vv-name='receiver'
                :error-messages="errors.collect('receiver')"
                v-model='form.receiver'

                type='search'
                
            > </v-autocomplete>
        </v-flex>


        <v-flex xs12 >
            <v-text-field 
                v-model="form.reason" 
                label="Reason"
                v-validate="'required|min:3|max:128'"
                data-vv-name='reason'
                :error-messages="errors.collect('reason')"
            ></v-text-field>
        </v-flex>



        <!-- auto generated -->
        
        

        <v-flex xs12 style='border: 1px solid rgba(0,0,0,.1); border-radius: 12px' pa-3 my-5>
            
            <v-layout wrap>
                <v-flex xs12 md10 shrink> 
                    <h1 class='title'> transfers </h1>
                </v-flex>
                <v-flex xs12 md2 shrink > 
                    <v-btn @click='newProduct' rounded color='red'> Add Product </v-btn>
                </v-flex>
            </v-layout>
            
            <transition-group name='fade' v-if='form.transfers.length > 0'>            
                <v-layout wrap style='rgba(0,0,0,.2); border-radius: 15px' 
                    
                    v-for='(item,index) in form.transfers' 
                    :key='index'
                    my-1 >


                        <v-flex xs12>
                            <v-layout>
                                
                                <v-flex xs6 >
                                    <v-autocomplete 
                                    autocomplete="off"
                                    label='Products'
                                    hide-selected
                                    :items='extras.products.data'
                                    v-validate="'required'"
                                    :data-vv-name='"product_name_"+index'
                                    :error-messages='errors.collect("product_name_"+index)'
                                    v-model='form.transfers[index].product_id'

                                    type='search'

                                    @change='changed'
                                    
                                    > </v-autocomplete> 
                                </v-flex>


                                <v-flex shrink>
                                    <v-text-field 
                                        v-model="form.transfers[index].stock" 
                                        label="Stock"
                                        :v-validate="generateValidation(item)"
                                            
                                        :data-vv-name='"stock_"+index'
                                        :error-messages='errors.collect("stock_"+index)'
                                    ></v-text-field>
                                </v-flex>


                                <v-flex shrink>
                                    <v-text-field 
                                        v-model="form.transfers[index].avg_rate" 
                                        label="Rate"
                                        v-validate="'decimal|min:0'"
                                        :data-vv-name='"rate_"+index'


                                       
                                        
                                        :error-messages='errors.collect("rate_"+index)'
                                    ></v-text-field>
                                </v-flex>

                                
                                
                                
                                

                                <v-icon pa-2 my-2 @click='deleteItem(index)'> delete </v-icon>

                                

                        
                            </v-layout>
                        </v-flex>
                    
                

                        
                    
                </v-layout>
            </transition-group>

        </v-flex>
        
        


        
                                
    </v-layout>
</template>

<script>

import DataList from '@/components/data/DataList'
import DataModel 
from '@/components/data/DataModel'

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
        products: {
            type: Array,
            required: false
        },
        refProducts: {
            type: Object,
            required: false
        }
    }, 

    components: {
        DataList
    },

        data(){
            return {
                
                menu: false,
                used:[],
                extras: {
                    products: {
                        data: [
                            {
                                text: '',
                                value: '',
                                max: 0
                            }
                        ],
                        loading: true,
                        error: false,
                        loaded: false
                    },
                    projects: {
                        loading: true,
                        error: false,
                        data: []
                    },

                },

                enums: {
                    tac: [
                            {
                                text: 'all inclusive in price',
                                value: 'all inclusive in price'
                            },
                            {
                                text: 'gst extra as applicable',

                                value: 'gst extra as applicable'

                            },

                            {
                                text: 'gst as mentioned',
                                value: 'gst as mentioned'
                            }]
                }
            }
        },

        watch: {

            'form.date': {
                deep: true,
                handler: function(newVal){
                // this.form.date = $moment(newVal).format('yyyy,mm,dd')
                }
            },

            'form.sender': {
                deep: false,
                handler: async function(newVal){
                    
                  //  alert('updated')

                    if(newVal)
                    {   
                    this.getProducts()
                    }
                }
            }
        },
        mounted( ){
            
        
                this.$emit('init')

                //this.form.date2 = this.form.date

                this.$nextTick( () => {
                    //this.watchClientId()
                    //this.watchProjectId()
                } )

    
        },

        computed: {

            receiverItems(){
                if(this.extras.projects.data.length > 0)
                {
                    return this.extras.projects.data.filter( (k,i,a) => k.value != this.form.sender
                     )
                }
                else
                    return []
            },

            filteredProducts(){
                if(this.extras.products.data.length > 0)
                    return this.extras.products.data.filter( (k,i,a) => !this.used.includes(k.value)  )
            }

        },
        async created(){

            


            /*this.setTimeout( () => {
                this.ready = true
            }, 1500)*/
        
            

            this.getProjects()
        
        
        },

        

        methods : {

            generateValidation(item){
                let a = `'required|decimal|min:0'` 
                //alert(a)

                

               // alert(JSON.stringify(item))
                return a
            },
            
            changed(e){
                //alert(JSON.stringify(e))
                //this.used.push(e)



            },

            newProduct(){

                let tempObj = {
                    product_id: null,
                    stock: null,
                    avg_rate: null
                }
                

                this.form.transfers.push(tempObj)
            
            },

            deleteItem(i){
                this.form.transfers.splice(i,1)
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
            generateItemsNew(input,key){
                let temp = []
                input.forEach( (item,index) => {
                    temp.push({
                            text: item.product_name + ` [ In Stock :- ${item.stock} ]`,
                            value: item[key],
                            max: item.stock

                        })
                } )

                return temp
            },

            async getProjects(){
                
                let projects = await axios({
                method: 'GET',
                url: 'projects',
                withCredentials: true,
                params: {
                        //client_id : this.form.client_id
                    }
                })

 

                if(projects.data.results)
                {
                    this.extras.projects.loading = false
                    this.extras.projects.data = this.generateItems(projects.data.results,'project_id')
                }
            },

            async getProducts(){

               // alert('in Products')
                
                let products = await axios({
                method: 'GET',
                withCredentials: true,
                url: 'inventory/project',
                params: {
                        //client_id : this.form.client_id
                        project_id: this.form.sender
                    }
                })



                if(products.data.result)
                {
                   
                    this.extras.products.loading = false
                    this.extras.products.data = this.generateItemsNew(products.data.result,'product_id')
                    
                }

                return products
            }
        }

    }


</script>

<style>

.fade-enter-active, .fade-leave-active {
  transition: all .5s;

}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-50);
}
</style>
