<template>
    <v-layout row pa-5>
        <v-snackbar v-model="snackbar.visible" :timeout=2000 :color='snackbar.state ? "success" : "error"'> 
            {{ snackbar.message }} <v-btn text @click="snackbar.visible = false" >Close</v-btn>
        </v-snackbar>

        <!-- <v-flex xs12 >
            <h1 class='display-1' style='opacity: .6;'>  </h1>
            <br/>
        </v-flex> -->
 
        <v-flex xs12 class='white elevation-2' py-5 style='border-radius: 25px; '> 
                    <!-- DIALOG -->
                    <v-dialog v-model="dialog" max-width="80%" :key='dialog_key' >
                        <template v-slot:activator="{ on }" class='white' >
                            <v-layout rows justify-end pr-5>
                                <v-flex px-5>
                                    <h1 class='display-1' style='opacity: .6;'> {{firstCharUpperCase($route.name)}} </h1>
                                </v-flex>
                                <v-flex lg6 shrink > 
                                    <v-text-field single-line
                                        style='height: 14px !important;transform: scale(0.75);'
                                        rounded 
                                        v-model='search' 
                                        label='Search'
                                        outlined
                                        prepend-inner-icon='search'

                                        
                                         > </v-text-field>  
                                </v-flex>
                                <v-flex shrink>
                                    <v-btn medium  dark 
                                        color='black'
                                        class='hover-btn mb-2'
                                        style='background-image: linear-gradient(to right, #e53935 0%, #e35d5b 51%, #e53935 100%)'
                                    rounded @click.stop='++dialog_key; dialog = true; userMethod=methodsEnums.POST' >Add</v-btn>
                                </v-flex>
                                <v-flex shrink ml-2>
                                    <v-btn medium  dark 
                                        color='black'
                                        class='hover-btn mb-2'
                                        style='background-image: linear-gradient(to right, #e53935 0%, #e35d5b 51%, #e53935 100%)'
                                    rounded @click.stop='++dialog_key; dialog = true; userMethod=methodsEnums.PO' >Add From PO</v-btn>
                                </v-flex>

                                <v-flex shrink ml-2>
                                    <v-icon @click='reload'> refresh </v-icon>
                                </v-flex>
                            </v-layout>
                        </template>
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>

                                    <!-- form -->
                                    <v-layout wrap v-if='userMethod == methodsEnums.POST || userMethod == methodsEnums.PATCH'>

                            
                                        <v-flex xs12 sm6>
                                            <v-text-field 
                                                v-model="editedItem.stock" 
                                                label="Stock"
                                                v-validate="'required|decimal'"
                                                data-vv-name='stock'
                                                :error-messages="errors.collect('stock')"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field 
                                                v-model="editedItem.avg_rate" 
                                                label="Rate"
                                                v-validate="'required|min:0|decimal'"
                                                data-vv-name='rate'
                                                :error-messages="errors.collect('rate')"
                                            ></v-text-field>
                                        </v-flex>

                                        <v-flex xs12 md6>
                                            <v-autocomplete 
                                                autocomplete="off"
                                                label='Project'
                                                :loading='!extras.projects.error && extras.projects.loading ? extras.projects.loading : false '
                                                :items='!extras.projects.loading && !extras.projects.error ? extras.projects.data : []'
                                                v-validate="'required'"
                                                data-vv-name='project'
                                                :error-messages="errors.collect('project')"
                                                v-model='editedItem.project_id'

                                                type='search'
                                                
                                            > </v-autocomplete>
                                        </v-flex>
                                         <v-flex xs6 >
                                            <v-autocomplete 
                                            autocomplete="off"
                                            label='Products'
                                            hide-selected
                                            :items='extras.products.data'
                                            v-validate="'required'"
                                            :data-vv-name='"product_name"'
                                            :error-messages='errors.collect("product_name_")'
                                            v-model='editedItem.product_id'

                                            type='search'

                                           
                                            
                                            > </v-autocomplete> 
                                        </v-flex>
                                       


                                        <!--
                                        <v-flex xs12 sm6>
                                            <v-text-field 
                                                v-model="editedItem.brand" 
                                                label="Brand"
                                                v-validate="'required|min:3|max:64'"
                                                data-vv-name='brand'
                                                :error-messages="errors.collect('brand')"
                                            ></v-text-field>
                                        </v-flex>

                                        
                                        <v-flex xs12  sm6 >

                                        
                                            <data-list endpoint="units" >
                                                <div slot-scope="{ data : units , error : unit_error, loading : unit_loading }">
                                                    <v-select 
                                                        label='units'
                                                        
                                                        :loading='!unit_error && unit_loading ? unit_loading : "" '
                                                        :items='!unit_loading && !unit_error ? generateItems(units.results,"unit_id") : []'
                                                        v-validate="'required'"
                                                        data-vv-name='unit_names'
                                                        :error='unit_error'
                                                        :error-messages='errors.collect("unit_name")'
                                                        
                                                        v-model='editedItem.unit_id'
                                                        
                                                    > </v-select>

                                                </div>
                                            </data-list>
                                        </v-flex>
                                        -->

                    

                    

                                       


                                        <!-- <v-flex xs12>
                                            <v-textarea 
                                                v-model="editedItem.xress" 
                                                label="Godown Address"

                                                v-validate="'required|min:6|max:128'"
                                                data-vv-name='address'
                                                :error-messages="errors.collect('address')"

                                                ></v-textarea>
                                        </v-flex>
                                        -->
                                        
                                    </v-layout>

                                    <v-layout wrap v-if='userMethod == methodsEnums.PO'>
                                        

                                        <v-flex xs11 md11>
                                            <v-autocomplete 
                                                autocomplete="off"
                                                label='Purchase Order'
                                                :loading='!extras.po.error && extras.po.loading ? extras.po.loading : false '
                                                :items='!extras.po.loading && !extras.po.error ? extras.po.data : []'
                                                v-validate="'required'"
                                                data-vv-name='po'
                                                :error-messages="errors.collect('po')"
                                                v-model='editedItem.po_data'
                                                type='search'
                                                
                                            > </v-autocomplete>
                                        </v-flex>

                                         <v-flex xs1 v-if='editedItem.po_data'>
                                            <v-text-field 
                                                    disabled
                                                    v-model="editedItem.po_data.po_id" 
                                                    label="po_id"
                                                    v-validate="'required|numeric|min:1'"
                                                    data-vv-name='"id"'
                                                    :error-messages='errors.collect("id")'
                                            ></v-text-field>
                                        </v-flex>

                                        
                                       
                                        <!-- product loop -->
                                        <template v-if='editedItem.po_data'>
                                            
                                        <v-layout wrap style='rgba(0,0,0,.2); border-radius: 15px' 
                                            

                                            v-for='(item,index) in editedItem.po_data.products' 
                                            :key='index'
                                            my-1 >


                                                <v-flex xs12>
                                                    <v-layout>
                                                    
                                                        <v-flex xs12>
                                                            <v-autocomplete 
                                                            autocomplete="off"
                                                            label='Products'

                                                            disabled
                                                            
                                                            :loading='extras.products.loading'
                                                            :items='extras.products? extras.products.data : []'
                                                            v-validate="'required'"
                                                            :data-vv-name='"product_name_"+index'
                                                            :error-messages='errors.collect("product_name_"+index)'
                                                            v-model='editedItem.po_data.products[index].product_id'

                                                            type='search'
                                                            
                                                            > </v-autocomplete> 
                                                        </v-flex>

                                                        <v-flex xs6>
                                                            <v-select 

                                                                disabled

                                                                :loading='extras.projects.loading'
                                                                :items='extras.projects.data'

                                                                v-model='editedItem.po_data.products[index].project_id'
                                                                label="Project ID"
                                                                v-validate="'required'"
                                                                data-vv-name='project_id'
                                                                :error-messages="errors.collect('project_id')"


                                                            ></v-select>
                                                        </v-flex>

                                                        <v-flex shrink>
                                                            <v-text-field 
                                                                disabled
                                                                v-model="editedItem.po_data.products[index].quantity" 
                                                                label="Quantity"
                                                                v-validate="'required|numeric|min:1'"
                                                                :data-vv-name='"quantity_"+index'
                                                                :error-messages='errors.collect("quantity_"+index)'
                                                            ></v-text-field>
                                                        </v-flex>

                                                        <v-flex shrink>
                                                            <v-text-field 
                                                                disabled
                                                                v-model="editedItem.po_data.products[index].avg_rate" 
                                                                label="Rate"
                                                                v-validate="'required|decimal|min:1'"
                                                                :data-vv-name='"rate_"+index'
                                                                :error-messages='errors.collect("rate_"+index)'
                                                            ></v-text-field>
                                                        </v-flex>

                                                        <v-flex shrink style=''>

                                                            <!-- 
                                                                :v-validate=
                                                                "'required|decimal|min:1'+ 'max:'+Number(editedItem.po_data.products[index].quantity) "
                                                                :data-vv-name='"rate_"+index'
                                                                -->

                                                            <v-text-field 
                                                                
                                                                disabled
                                                                v-model="editedItem.po_data.products[index].delivered" 
                                                                label="Delivered"

                                                                
                                                                :data-vv-name='"deliver_"+index'
                                                                :error-messages='errors.collect("deliver_"+index)'
                                                            
                                                            ></v-text-field>


                                                        </v-flex>

                                                        <v-flex shrink  >
                                                            <v-text-field

                                                            
                                                                v-model="editedItem.po_data.products[index].toDeliver" 
                                                                label="To Deliver"

                                                                :patch="editedItem.po_data.products[index].toDeliver ? editedItem.po_data.products[index].toDeliver : editedItem.po_data.products[index].toDeliver = 0.00 "


                                                                :data-vv-name='"to_deliver_"+index'
                                                                :error-messages='errors.collect("to_deliver_"+index)'
                                                                :rules="generateDeliveredRule(editedItem.po_data.products[index].quantity,editedItem.po_data.products[index].delivered)"
                                                            >

                                                            </v-text-field>
                                                        </v-flex>

                                                        

                                                        <v-icon pa-2 my-2 @click='deleteItem(index)'> delete </v-icon>

                                                        

                                                
                                                    </v-layout>
                                                </v-flex>
                                            
                                        

                                                
                                            
                                        </v-layout>
                                        
                                        </template>
                                        

                                        
                                        
                                        
                                    </v-layout>

                                    <v-layout v-else-if='userMethod == methodsEnums.DELETE' wrap style='background: rgba(0,0,0,.15);border-radius: 12px'>
                                        <v-flex    v-for='(item,index) in Object.values(editedItem)' 
                                            style=''
                                            class='pa-2'
                                        > {{item}} </v-flex>
                                        
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            
                            <!-- dialog actions -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <data-model :endpoint="endpoint" @success='postSuccess();' @error='postError()'>
                                    <div slot-scope="{ remove, data: post_res, loading : post_loading, create, update,error,dynamic }">
                                        <v-btn color="blue darken-1" text @click="dialogClose">Cancel</v-btn>
                                        <v-btn color="blue darken-1" :loading='post_loading' text @click='dialogSave({functions: {create, remove, update,dynamic}})'> {{methodToStringPresent(userMethod)}} </v-btn>
                                    </div>
                                </data-model>
                            </v-card-actions>
                        </v-card>

                    </v-dialog>

                    <!-- DATA -->

                    <data-list :endpoint="endpoint+'/distinct/product'" :key='dl_key' @success='listSuccess' @error='listError'>
                        <div slot-scope="{ data , error, loading }">

                            
                            <v-data-table 

                                :sort-by.sync='table.sortBy'
                                :sort-desc.sync='table.sortDesc'
                                :loading='loading'
                                :headers='headers'
                                :items='items'
                                :options.sync='options'

                                :search='search'
                                
                                class='elevation-0' 
                                :style="{ borderRadius: '15px !important' }"
                            >   

                                

                                <template v-slot:item.inventory_id="props">
                                    <router-link tag="div" :to="{
                                            name: 'inventory',
                                            params: { id :  props.item.product_id }
                                        }" 
                                        append class='clickable'>
                                        <div> {{ props.item.inventory_id | inventory }}</div>
                                    </router-link>
                                </template>
                                
                                 <template v-slot:item.currency="props">
                                     {{ props.item.total_amount | currency }}
                                
                                </template>

                                <!-- <template v-slot:item.actions="{ item }">
                                    
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
                                </template> -->

                            </v-data-table>
                        </div>
                    </data-list>
        </v-flex>

    </v-layout>
</template>

<script>
import utilities from '@/components/mixins/utilities.js'
import DataList from '@/components/data/DataList'
import DataModel from '@/components/data/DataModel'

// import axios from 'axios'

import Vue from 'vue'

const methodsEnums = {
    GET : 0,
    POST : 1,
    PATCH : 2,
    DELETE : 3,
    PO: 4
}

Object.freeze(methodsEnums)

function parseRule(obj){
       let str = ''
       Object.keys(obj).forEach( (k,i) => {
              str += k
              if(obj[k].length > 0)
                     str += ':'  + obj[k].join(',').trim()
       
              str += '|'

       } )

       return str
}

export default {
    extends: utilities,
    components: {
        DataList,
        DataModel
    },
    data(){
        return {

            endpoint: 'inventory',

            extras: {
                    products: {
                        data: [
            
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
                    po: {
                        loading: true,
                        error: false,
                        data: []
                    },

            },

            search: '',

            dialog: false,
            dialog_key: 0,
            dl_key: 55,
            dialog_loading: false,
            

            items: [],

            options: {},

            headers: [
                {
                    text: 'Inventory ID',
                    value: 'inventory_id'
                },
                {
                    text: 'Product name',
                    value: 'product_name'
                },

                {
                    text: 'Type',
                    value: 'inventory_type'
                },
                /*{
                    text: 'Godown Name',
                    value: 'godown_name'
                },*/
                {
                    text: 'Stock',
                    value: 'stock'
                },
                {
                    text: 'Avg Rate',
                    value: 'avg_rate'
                },
                {
                    text: 'Total Amount',
                    value: 'total_amount'
                },
               
                
                {
                    text: 'Unit',
                    value: 'unit_name'
                },
                /*
                {
                    text: 'Actions',
                    value: 'actions'
                }*/
            ],

            enums: {
                type: [
                    'purchase',
                    'selling',
                    'trade'

                ]
            },

            editedIndex: -1,


            editedItem: {
                type: 1
            },
            defaultItem: {
                project_id: null,
                product_id: null,
                stock: null,
                avg_rate: null,
                type : 1
            },
    
            snackbar: {
                visible: false,
                state: false,
                message : ''

            },
            methodsEnums : methodsEnums,
            userMethod : 0,
            table: {
                sortBy: '',
                sortDesc: false
            }

            

        }},

    computed: {
        formTitle () {
            //return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
             switch(this.userMethod){
                
                case this.methodsEnums.POST : return 'New Item';
                case this.methodsEnums.PATCH : return 'Update Item';
                case this.methodsEnums.DELETE : return 'Delete Item';
                case this.methodsEnums.PO : return 'Add Delivery';
                default : return 'Invalid State'
            }
        },


    },

    watch: {
        dialog (val) {
            val || this.dialogClose()
        },

        'editedItem.po_data': {
            handler() {
                

                if(this.editedItem.po_data)
                {
                    //console.log('s -> '+ (typeof this.editedItem.po_data) === 'object' )
                    //alert(JSON.stringify(this.editedItem.po_data,'',2))
                    //if(typeof this.editedItem.po_data !== 'object' )
                    //    this.editedItem.po_data = JSON.parse(this.editedItem.po_data)
                    //if(this.editedItem.po_data.products )
                    //    this.editedItem.po_data.products = JSON.parse(this.editedItem.po_data.products )
                }   
                    

                
            }
        }

        /*
        
        'options.page': {
            handler () {
                const { page } = this.options
                
                this.getItems('/projects',{
                    limit: 10,
                    offset: 5
                })
            },
        },
        'options.sortBy': {
            handler (newVal, oldVal) {

                const { sortBy, sortDesc } = this.options
                this.table.sortBy = sortBy
                this.table.sortDesc = sortDesc
            }
        },
        */



    },

    async mounted(){

        
        //alert(JSON.stringify(this.generateHeaders(this.schema)))
        
        
    },

    async created(){
        this.reload()
    },
    
    methods: {


        reload(){
            this.dl_key++
            this.getProjects()
            this.getProducts()
            this.getPo()
        },

        
        generateDeliveredRule(qty,delivered){
            

            return [
            //    r => !!r || 'Required',
                r => !isNaN(parseFloat(r)) || 'Should be float value',
                r => !!(r => 0) || 'Invalid value',
                r => !(r < 0) || 'Negative value',
                r => !!(r <= (qty-delivered < 0 ? 0 : qty-delivered ) ) || 'Max exceeded'
            ]
            //return `required|decimal:2|min_value:0.01|max_value:${parseFloat(qty)}`

        },

        async getProjects(){
                
                this.extras.projects.loading = true

                let projects = await axios({
                method: 'GET',
                baseURL: this.$config.baseUrl,
                url: 'projects',
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
                
                this.extras.products.loading = true

                let products = await axios({
                method: 'GET',
                baseURL: this.$config.baseUrl,
                url: 'products',
                params: {
                        //client_id : this.form.client_id
                        //project_id: this.form.sender
                    }
                })



                if(products.data.results)
                {
                   
                    this.extras.products.loading = false
                    this.extras.products.data = this.generateItems(products.data.results,'product_id')
                    
                }
            },
            async getPo(){

                this.extras.po.loading = true
                
                let po = await axios({
                method: 'GET',
                baseURL: this.$config.baseUrl,
                url: 'purchase-orders',
                params: {
                        //client_id : this.form.client_id
                        //project_id: this.form.sender
                    }
                })



                if(po.data.results)
                {
                   
                    this.extras.po.loading = false
                    this.extras.po.data = this.generateItems(po.data.results,'po_id','subject',true)
                    
                }
            },

            async getItems(endpoint,data) {

                return await axios({
                    method: 'GET',
                    baseURL: this.$config.baseUrl,
                    url: endpoint,
                    data: data
                })






            },

        generateInstance(){

        },
        listSuccess (r){
            this.items = r.data.results
        },
        listError(e){
            this.items = []
        },
        
        generateItems(input,key,name,whole){
            let temp = []
            temp.push({
                text: 'none',
                value: null
            })
            input.forEach( (item,index) => {
                temp.push({
                    text: name ? item[name] : item.name,
                    value: whole ? item : item[key]
                    })
            } )

        
            return temp
        },

        keyHack(){
            return ++this.dialog_key
        },
        
        generateIterable(input){
            let temp = []
            
            for( let i in input  )
            {
                let obj = input[i]
                if(!obj.ignore)
                    temp.push(obj)
            }

            return temp
        },
        
        generateHeaders(input){

            let temp = []
            for( var i in input )
            {
               let { text, value } = input[i]
                temp.push({text,value})
            }
            temp.push({text: 'Actions',value: 'actions'})
            return  temp
        },


        actionEditItem (item) {

            this.userMethod = this.methodsEnums.PATCH
            
            this.editedItem = Object.assign({}, item) // SET selected item to editedItem
            this.editedItem.unit_id = String(item.unit_id)



            this.editedItem.type = String(item.type)


            this.dialog = true // start the dialog
        
        },

        actionDeleteItem (item) {

            this.userMethod = this.methodsEnums.DELETE
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },


        dialogClose(){

            this.dialog = false

            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)


        },

        dialogSave (dialog) {

           // dialog.functions.update(this.editedItem)

            //console.log(dialog.functions)
            

           switch(this.userMethod)
           {
                case this.methodsEnums.POST :  
                       this.$validator.validateAll().then( (r) => {
                            if(r)
                                dialog.functions.create(this.editedItem);
                        } );
                        break;
                case this.methodsEnums.PATCH :  
                        this.$validator.validateAll().then( (r) => {
                            if(r)
                                dialog.functions.update(this.editedItem);
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { inventory_id: this.editedItem.inventory_id } ); break;
                case this.methodsEnums.PO :  
                    this.$validator.validateAll().then( (r) => {
                            if(r)
                                dialog.functions.dynamic('delivery','patch',{
                                    po_id : this.editedItem.po_data.po_id,
                                    products : JSON.stringify(this.deliveryFix(this.editedItem.po_data.products))
                                });
                    } );
                    break;
        
           }
           
            
            //this.dialogClose()
        },

        deliveryFix(products){
            let temp = []

            products.forEach( (k,i) => {
            
                    k.delivered = k.toDeliver


                    console.log(k)
        


                temp.push(k)
            } )

            console.log(JSON.stringify(temp,'',2))
            return temp
        },

        postSuccess(){
        
            this.snackbar.message = `Successfully ${this.methodToString(this.userMethod)} a project`
            this.snackbar.state = true
            this.snackbar.visible = true

            ++this.dl_key
            this.dialogClose()


           /* if(this.userMethod == this.methodsEnums.PO)
            {
                this.getPo()
            }*/

            this.reload()
        },
        postError(){

            this.snackbar.state = false
            this.snackbar.visible = true
            this.snackbar.message = 'Something Went Wrong. Try again later' 

        },

        methodToString(choice){
            switch(choice)
            {
                case this.methodsEnums.POST : return 'added';
                case this.methodsEnums.PATCH : return 'updated';
                case this.methodsEnums.DELETE : return 'deleted';
                case this.methodsEnums.PO : return 'delivered';
            }
        },
        methodToStringPresent(choice){
            switch(choice)
            {
                case this.methodsEnums.POST : return 'add';
                case this.methodsEnums.PATCH : return 'update';
                case this.methodsEnums.DELETE : return 'delete';
                case this.methodsEnums.PO : return 'deliver'

            }
        }
    },
}
</script>

<style>


table {
    border-collapse: separate !important;
    border-spacing: 0px 0px !important;
}

tr {
    bosx-shadow: 0px 0px 5px 0px rgba(0,0,0,.1);
}

thead > tr {
    background: s#CCAEB1;
}

tbody > tr:nth-child(even){
    background: #fff;

   
}
tbody > tr:nth-child(odd){
    background: linear-gradient(to right, rgba(237, 66, 100, .1), rgba(255, 237, 188, .2)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */;
   
}

tbody > tr > td:fsirst-child {
     border-radius: 15px 0 0 15px;
}
tbody > tr > td:lasst-child {
     border-radius: 0 15px 15px 0px;
}

.hover-btn:hover {
     background-position: right center !important;
    
}

table {
}

.text-start{
     color: #2e343b;
     fot-size: .9em !important;
}

</style>

