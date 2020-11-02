<template>
    <v-layout row pa-5>
    
        <v-flex xs12 class='white elevation-2' py-5 style='border-radius: 25px; '> 
                    <!-- DIALOG -->

                    <v-layout pa-4 justify-end>
                        <v-flex> <h1 class='display-1' style='opacity: .6'>

                            <template v-if='items.length > 0'>
                                 {{items[0].project_name}}
                            </template>
                            
                             
                              </h1> </v-flex>
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
                    </v-layout>

                    <!-- DATA -->

                    <data-list :endpoint="endpoint+'/'+$route.params.id" :key='dl_key' @success='listSuccess' @error='listError'>
                        <div slot-scope="{ data , error, loading }" :ab=' $set(dataG, data.results) ' >

                            
                            <v-data-table 

                                
                                :headers='headers'
                                :items='items ? items : []'
                                :loading='loading'


                                :search='search'
                                
                                class='elevation-0' 
                                :style="{ borderRadius: '15px !important' }"
                            >   

                                <template v-slot:item.status="{item}">
                                    
                                   <template v-if='item.status > 0' >
                                       <div style='color: green'> 
                                        <span class='body-2'>{{item.status | currency('') }}</span>
                                        <v-icon color='green'
                                            style='transform: rotate(-90deg);'
                                            size='20px'
                                            class='ml-1'
                                        > play_arrow </v-icon> 
                                       </div>
                                   </template>
                                   <template v-else >
                                       <div style='color: red'> 
                                        <span class='body-2'>{{item.status | currency('') }}</span>
                                        <v-icon color='red'
                                            style='transform: rotate(90deg)'
                                            size='20px'
                                            class='ml-1'
                                        > play_arrow </v-icon> 
                                       </div>
                                   </template>
                                    
                                </template>

                                <template v-slot:item.product_name="{item}">
                                    <router-link tag="div" :to="{
                                            name: 'inventory',
                                            params: { id :  item.product_id }
                                        }" 
                                        append class='clickable'>
                                        <div> {{ item.product_name }}</div>
                                    </router-link>
                                </template>

                                <template v-slot:item.jobcard_quantity="{item}">
                                    {{ item.jobcard_quantity | currency('')}}
                                </template>
                                 <template v-slot:item.avg_rate="{item}">
                                    {{ item.avg_rate | currency('₹')}}
                                </template>
                                 <template v-slot:item.stock="{item}">
                                    {{ item.stock  | currency('')  }}
                                </template>

                                <template v-slot:item.cost="{item}">
                                    <div style='
                                            background: #dfecf3;
                                            color: #356179;
                                            padding: 3px 6px 3px 6px;

                                            border-radius: 6px;

                                            display: inline;
                                            

                                            '
                                            v-if='item.cost'
                                        >
                                        {{item.cost | currency('₹') }}
                                    </div>

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

import Vue from 'vue'


export default {
    extends: utilities,
    name: 'projectWise',
    components: {
        DataList,
        DataModel
    },
    data(){
        return {

            endpoint: 'inventory/projectWise',

            search: '',

            dataG: [],

            dialog: false,
            dialog_key: 0,
            dl_key: 55,
            dialog_loading: false,




            items: [],

            options: {},

            headers: [
                /*{
                    text: 'Project Name',
                    value: 'project_name'
                },
                {
                    text: 'Godown Name',
                    value: 'godown_name'
                },*/
                {
                    text: 'Product Name',
                    value: 'product_name'
                },
                {
                    text: 'Stock',
                    value: 'stock'
                },
                {
                    text: 'Jobcard Requirement',
                    value: 'jobcard_quantity'
                },
                /*{
                    text: 'Rate',
                    value: 'avg_rate'
                }, */
                {
                    text: 'Status',
                    value: 'status'
                },
                /*{
                    text: 'Total Cost',
                    value: 'cost'
                }*/

            ],
            editedIndex: -1,


            editedItem: {
                godown_id: 0,
                name: '',
                address: '',
                client_name: '',
                client_id : null
            },
            defaultItem: {
                project_id: 0,
                name: '',
                site_address: '',
                client_name: '',
                client_id : 0
            },

            snackbar: {
                visible: false,
                state: false,
                message : ''

            },


            

        }},

    computed: {
      
    },

    watch: {
        dialog (val) {
            val || this.dialogClose()
        },

    },

    async mounted(){

    
        
        
    },
    
    methods: {
        listSuccess (r){
            this.items = r.data.results
        },
        listError(e){
            this.items = []
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

