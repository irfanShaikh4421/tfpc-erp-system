<template>
    <v-layout row pa-5 >
        <v-snackbar v-model="snackbar.visible" :timeout=2000 :color='snackbar.state ? "success" : "error"'> 
            {{ snackbar.message }} <v-btn text @click="snackbar.visible = false" >Close</v-btn>
        </v-snackbar>

        <!-- <v-flex xs12 >
            <h1 class='display-1' style='opacity: .6;'>  </h1>
            <br/>
        </v-flex> -->
 
        <v-flex xs12 class='white elevation-2' py-5 style='border-radius: 25px; '> 
                    <!-- DIALOG -->
                    <v-dialog v-model="dialog" :max-width="dynamicWidth" :key='dialog_key' >
                        <template v-slot:activator="{ on }" class='white' >
                            <v-layout row 
                                        :wrap='$vuetify.breakpoint.smAndDown' 
                                        :justify-end='$vuetify.breakpoint.lgAndUp' 
                                        :justify-center='$vuetify.breakpoint.smAndDown' pr-5    >
                                <v-flex :xs6='$vuetify.breakpoint.smAndDown' px-5 >
                                    <h1 class='display-1' style='opacity: .6;'> {{firstCharUpperCase($route.name)}} </h1>
                                </v-flex>
                                <v-flex xs12 lg5 shrink  :mb-5='$vuetify.breakpoint.smAndDown' > 
                                    <v-text-field single-line
                                        style='height: 14px !important;transform: scale(0.75);'
                                        rounded 
                                        v-model='search' 
                                        label='Search'
                                        outlined
                                        prepend-inner-icon='search'

                                        
                                         > </v-text-field>  
                                </v-flex>
                                <v-flex xs6 lg2 shrink :mt-5='$vuetify.breakpoint.smAndDown' >
                                    <v-btn medium  dark 
                                        color='black'
                                        class='hover-btn mb-2'
                                        style='background-image: linear-gradient(to right, #e53935 0%, #e35d5b 51%, #e53935 100%)'
                                    rounded @click.stop='++dialog_key; dialog = true; userMethod=methodsEnums.POST' >New Purchase Order</v-btn>
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

                                        <edit-po 
                                            :form.sync='editedItem'
                                            :products='products'
                                            :refProducts='refProducts'
                                        >
                                        </edit-po>

                                       


                                        <!-- <v-flex xs12>
                                            <v-textarea 
                                                v-model="editedItem.address" 
                                                label="Godown Address"

                                                v-validate="'required|min:6|max:128'"
                                                data-vv-name='address'
                                                :error-messages="errors.collect('address')"

                                                ></v-textarea>
                                        </v-flex>
                                        -->
                                        
                                    </v-layout>

                                    <v-layout v-else-if='userMethod == methodsEnums.DELETE' wrap style='background: rgba(0,0,0,.15);border-radius: 12px'>
                                        <v-flex    v-for='(item,index) in Object.values(editedItem)' 
                                            style=''
                                            class='pa-2'
                                        > {{item}} </v-flex>
                                        
                                    </v-layout>

                                    <v-layout v-else-if='userMethod == methodsEnums.APPROVE' wrap style='background: rgba(0,0,0,.15);border-radius: 12px'>
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
                                    <div slot-scope="{ remove, data: post_res, loading : post_loading, create, update,error, dynamic }">
                                        <v-btn color="blue darken-1" text @click="dialogClose">Cancel</v-btn>
                                        <v-btn color="blue darken-1" :loading='post_loading' text @click='dialogSave({functions: {create, remove, update, dynamic}})'> {{methodToStringPresent(userMethod)}} </v-btn>
                                    </div>
                                </data-model>
                            </v-card-actions>
                        </v-card>

                    </v-dialog>

                    <!-- DATA -->

                    <data-list :endpoint="endpoint" :key='dl_key' @success='listSuccess' @error='listError'>
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

                                <template v-slot:item.po_id="props">
                                    <router-link tag="div" :to="{
                                            name: 'po',
                                            params: { id :  props.item.po_id }
                                        }" 
                                        append class='clickable'>
                                        <div> {{ props.item.po_id | po }}</div>
                                    </router-link>
                                </template>

                                
                                <template v-slot:item.date="props">
                                     {{ props.item.date | formatDate }}
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

                                <template v-slot:item.status="{ item }">
                                         
                                    <template v-if='item.status'>
                                        <v-icon
                                        small
                                        class="mr-2"
                                        color='green'
                                        
                                        >   
                                            check_circle
                                        </v-icon>
                                        
                                        Approved
                                    </template>

                                    <template v-else 
                                        
                                        
                                    >
                                        <div @click='dialog=true;userMethod=methodsEnums.APPROVE;
                                            editedItem = Object.assign({}, item)
                                        '
                                            style='cursor: pointer !important'
                                        >
                                            <v-icon
                                                small
                                                class="mr-2"
                                                color='red'
                                                
                                                >   
                                                remove_circle
                                            </v-icon>
                                            
                                            Approve Now

                                        </div>
                                    </template>
                                </template>

                                <template v-slot:item.delivery_status="{ item }">
                                         
                                    <template v-if='item.delivery_status'>
                                        <v-icon
                                        small
                                        class="mr-2"
                                        color='green'
                                        
                                        >   
                                            check_circle
                                        </v-icon>
                                        
                                        Delivered
                                    </template>

                                    <template v-else 
                                        
                                        
                                    >
                                       <div class='pa-1'>
                                            <v-progress-circular
                                                
                                                size=60
                                                width=6
                                                :value='item.percentage'
                                            >
                                                <span class='caption'> {{Math.trunc(item.percentage)}} % </span>
                                            </v-progress-circular>
                                       </div>

                                   
                                    </template>
                                </template>

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

import editPo from '@/components/newForms/edit_po'


import _ from 'lodash'

const methodsEnums = {
    GET : 0,
    POST : 1,
    PATCH : 2,
    DELETE : 3,
    APPROVE : 4
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
        DataModel,
        editPo
    },
    data(){
        return {

            endpoint: 'purchase-orders',

            search: '',

            products: [],
            refProducts : [],

            dialog: false,
            dialog_key: 0,
            dl_key: 55,
            dialog_loading: false,
            

            items: [],

            options: {},

            headers: [
                {
                    text: 'Purchase Order ID',
                    value: 'po_id'
                },
                {
                    text: 'Subject',
                    value: 'subject'
                },

                {
                    text: 'date',
                    value: 'date'
                },
                {
                    text: 'Vendor Name',
                    value: 'vendor_name'
                },
                {
                    text: 'Status',
                    value: 'status'
                },
                {
                    text: 'Delivery Status',
                    value: 'delivery_status'
                }
                /*{
                    text: 'Actions',
                    value: 'actions'
                } */
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
                
                date: this.$dayjs().format('YYYY-MM-DD'),
                products: [{
                
                    product_id: -1,
                    project_id: -1,
                    quantity: 0,
                    avg_rate: 0,
                    delivered: 0
                }],
                ref : '',
                tac: {
                    "payment": "",
                    "remarks": "",
                    "tax_type": "",
                    "warranty": "",
                    "tax_price": 1.0,
                    "freight_tax": null,
                    "delivery_period": 0
                }
            

                
            },
            defaultItem: {
                date: this.$dayjs().format('YYYY-MM-DD'),
                products: [{
                    product_id: -1,
                    project_id: -1,
                    quantity: 0,
                    avg_rate: 0,
                    delivered: 0
                }],
                ref : '',
                tac: {
                    "payment": "",
                    "remarks": "",
                    "tax_type": "",
                    "warranty": "",
                    "tax_price": 1.0,
                    "freight_tax": null,
                    "delivery_period": 0
                }
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
            },

             baseUrl: 'http://34.83.223.211/api/v1/'


            

        }},

    computed: {
        dynamicWidth(){
            switch(this.$vuetify.breakpoint.name)
            {
                case 'xs': return '100%'
                case 'sm': return '100%'
                case 'md': return '80%'
                case 'lg': return '50%'
                case 'xl': return '50%'
            }
        },
        formTitle () {
            //return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
             switch(this.userMethod){
                
                case this.methodsEnums.POST : return 'New Purchase Order';
                case this.methodsEnums.PATCH : return 'Update Purchase Order';
                case this.methodsEnums.DELETE : return 'Delete Purchase Order';
                case this.methodsEnums.APPROVE : return 'Approve Purchase Order';
                default : return 'Invalid State'
            }
        },
    },

    watch: {
        dialog (val) {
            val || this.dialogClose()
        },


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

        let products = await axios.get(this.baseUrl+'products',{
            withCredentials: true
        })
        this.products = this.generateItems(products.data.results,'product_id')



        if(products)
        {


            this.refProducts = this.productsToObj(products.data.results)
        }


        
        
        
    },
    
    methods: {

        async getItems(endpoint,data) {

            return await axios({
                method: 'GET',
                baseURL: this.$config.baseUrl,
                url: endpoint,
                data: data,
                withCredentials: true
            })






        },

        productsToObj(input){

            let temp = {}
            Object.keys(input).forEach( (k,i,a) => {
                temp[Number(input[k].product_id)] = input[k]
            } )
            return temp

        },

        generateInstance(){

        },
        listSuccess (r){
            this.items = r.data.results
        },
        listError(e){
            this.items = []
        },
        
        generateItems(input,key){
            let temp = []
            temp.push({
                text: 'none',
                value: null
            })
            input.forEach( (item,index) => {
                temp.push({
                    text: item.name,
                    value: item[key]
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

            let temp = _.cloneDeep(this.editedItem)
            temp.products = JSON.stringify(temp.products)
            temp.tac = JSON.stringify(temp.tac)

                               // temp.date = temp.date2
            

           switch(this.userMethod)
           {
                case this.methodsEnums.POST :  
                       this.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                                
                                dialog.functions.create(temp);
                            }
                               
                        } );
                        break;
                case this.methodsEnums.PATCH :  
                        this.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                        
                               // temp.date = temp.date2
                                dialog.functions.update(temp);
                            }
                                
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { inventory_id: this.editedItem.inventory_id } ); break;
                case this.methodsEnums.APPROVE : dialog.functions.dynamic( 'delivery','patch',temp); break;
                //edit this i
        
           }
           
            
            //this.dialogClose()
        },

        postSuccess(){
        
            this.snackbar.message = `Successfully ${this.methodToString(this.userMethod)} a project`
            this.snackbar.state = true
            this.snackbar.visible = true
            ++this.dl_key
            this.dialogClose()
        },
        postError(){

            this.snackbar.state = false
            this.snackbar.visible = true
            this.snackbar.message = 'Something Went Wrong. Try again later' 

        },

        methodToString(choice){
            switch(choice)
            {
                case this.methodsEnums.POST : return 'saved';
                case this.methodsEnums.PATCH : return 'updated';
                case this.methodsEnums.DELETE : return 'deleted';
                case this.methodsEnums.APPROVE : return 'approve';
            }
        },
        methodToStringPresent(choice){
            switch(choice)
            {
                case this.methodsEnums.POST : return 'save';
                case this.methodsEnums.PATCH : return 'update';
                case this.methodsEnums.DELETE : return 'delete';
                case this.methodsEnums.APPROVE : return 'approve';
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

