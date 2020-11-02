<template>
    <v-layout pa-5 row 

        justify-center

        class='white elevation-2' style='border-radius: 25px; text-align: center'>

      
            <v-flex shrink>

                <data-list endpoint="inventory/project" 
                    :entity='{
                    
                            project_id : $route.params.id
                        
                    }'  
                    :key='dl_key' @success='listSuccess' @error='listError'>
                    <div slot-scope="{ data , error, loading }">

                        <v-flex shrink my-4>
                            <h1 class='display-1' style='opacity: .6'> {{data.result[0].project_name}} </h1>
                        </v-flex>

                            <v-data-table 

                                :loading='loading'
                                :headers='headers'
                                :items='data.result'
                             

                                :search='search'
                                
                                class='elevation-0' 
                                :style="{ borderRadius: '15px !important' }"
                            >   
                                <template v-slot:item.client_name="props">
                                    <router-link tag="div" :to="{
                                            name: 'client',
                                            params: { id :  props.item.client_id }
                                        }" 
                                        append class='clickable'>
                                        <div> {{ props.item.client_name }}</div>
                                    </router-link>
                                </template>

                                <template v-slot:item.actions="{ item }">
                                    
                                    <v-icon
                                        small
                                        class="mr-2"
                                        @click="actionEditItem(item)"
                                    >
                                        edit
                                    </v-icon>
                                    <v-icon
                                        small
                                        @click="actionDeleteItem(item)"
                                    >
                                       delete
                                    </v-icon>
                                </template>

                            </v-data-table>
                        </div>
                    </data-list>
                
            </v-flex>
        
    </v-layout>
</template>

<script>



const methodsEnums = {
    GET : 0,
    POST : 1,
    PATCH : 2,
    DELETE : 3
}

import utilities from '@/components/mixins/utilities.js'
import DataList from '@/components/data/DataList'
import DataModel from '@/components/data/DataModel'
// import axios from 'axios'



// custom

import EditPo from '@/components/newForms/edit_po'
import _ from 'lodash'

//import moment from 'moment'
Object.freeze(methodsEnums)

export default {
    extends: utilities,

    components: {

        DataList,
        DataModel,
        
        EditPo
    },

    props: {

    },


    data(){
        return {

            style: {
                parent: {
                    background : '#F4F5F6',
                    borderRadius : '15px'
                },

                heading: {
                    opacity: '.7'
                },

                subheading: {
                    opacity: '.5'
                }
            },


            entity: {},
            
            state: {
                error: false
            },

            /* 
             form related
            */
        
           headers: [
               {
                   text: 'Product Name',
                   value: 'product_name'
               },
               {
                   text: 'stock',
                   value: 'stock'
               },
               {
                   text: 'avg_rate',
                   value: 'avg_rate'
               } 
           ],
           products: [],
           refProducts : [],
            endpoint: 'purchase-orders' ,

            userMethod : 0,

            dialog: false,
            dialog_key: 555,
            dl_key: 55,
            dialog_loading: false,

            methodsEnums : methodsEnums,

            snackbar: {
                    visible: false,
                    state: false,
                    message : ''

                },



            

            


        }
    },

    computed: {

        formTitle(){

        }

    },

    



    async created(){

        /*try{
             let r = await axios({
                method: 'GET',
                baseURL: this.$config.baseUrl,
                url: 'inventory/product',
                params: {
                    po_id : this.$route.params.id
                }
            })

            if(r)
            {
                //alert(JSON.stringify(r.data))
                this.entity = Object.assign({},r.data.results)
                this.entity.products = JSON.parse(this.entity.products)




                // dirty patch

        



            }
                

        }

        catch(e){

            if(e)
            {
                this.state.error = true
            }

        }
        */

        let products = await axios.get('products')
        this.products = this.generateItems(products.data.results,'product_id')

        if(products)
        {
            this.refProducts = this.productsToObj(products.data.results)
        }

        
       


    },
    mounted(){

        // dirty patch
        
                this.entity.project_id = Number(this.entity.project_id)
                this.entity.person_id = Number(this.entity.person_id)

               
    },


    methods: {

        productsToObj(input){

            let temp = {}
            Object.keys(input).forEach( (k,i,a) => {
                temp[Number(input[k].product_id)] = input[k]
            } )
            return temp

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

        dialogOpen(){
            this.dialog = true
            this.userMethod = this.methodsEnums.PATCH
        },
        dialogClose(){
            this.dialog = false
        },

        dialogSave (dialog) {
            
            let temp = _.cloneDeep(this.entity)
            temp.products = JSON.stringify(temp.products)
            
            if(temp.tac.freight_tax == undefined || temp.tac.freight_tax == '' || temp.tac.freight_tax == null)
            {
                delete temp.tac.freight_tax

            }

            temp.tac = JSON.stringify(temp.tac)
        

      // alert(JSON.stringify(temp))
        
           switch(this.userMethod)
           {
                case this.methodsEnums.POST :  
                       this.$refs.poRef.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                                dialog.functions.create(temp);
                            }  
                                
                        } );
                        break;
                case this.methodsEnums.PATCH :  
                       // alert('in Patch')
                        
                        this.$refs.poRef.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                         //       alert('in r')
                                dialog.functions.update(temp);
                            }
                
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { po_id: this.entity.po_id } ); break;

        
           }
           
            
            //this.dialogClose()
        },

        postSuccess(){
        
            this.snackbar.message = `Successfully ${this.methodToString(this.userMethod)} a project`
            this.snackbar.state = true
            this.snackbar.visible = true

            ++this.dl_key
            this.dialogClose()

            this.reloadData()
        },


        postError(){

            this.snackbar.state = false
            this.snackbar.visible = true
            this.snackbar.message = 'Something Went Wrong. Try again later' 

        },

        async   reloadData(){

            let r = await axios({
                method: 'GET',
                url: 'purchase-orders',
                params: {
                    po_id : this.$route.params.id
                }
            })

            if(r)
            {
                //alert(JSON.stringify(r.data))
                this.entity = Object.assign({},r.data.result[0])
                this.entity.products = JSON.parse(this.entity.products)

            }
        },

        //extras

        methodToString(choice){


                switch(choice)
                {
                    case this.methodsEnums.POST : return 'added';
                    case this.methodsEnums.PATCH : return 'updated';
                    case this.methodsEnums.DELETE : return 'deleted';
                }
            },
            methodToStringPresent(choice){
            switch(choice)
            {
                case this.methodsEnums.POST : return 'add';
                case this.methodsEnums.PATCH : return 'update';
                case this.methodsEnums.DELETE : return 'delete';
            }
        }
    }



}
</script>

<style>


    .jobcard-data-fields {
        text-align: left;
    }


    .jobcard-data-fields > * > h1{
        font-weight: 400 !important;
    }


    .innerValue{
        opacity: .8;
    }

</style>
