<template>
    <v-layout fill-height>

        <v-snackbar v-model="snackbar.visible" :timeout=2000 :color='snackbar.state ? "success" : "error"'> 
            {{ snackbar.message }} <v-btn text @click="snackbar.visible = false" >Close</v-btn>
        </v-snackbar>
        <v-dialog v-model="dialog" max-width="50%" :key='dialog_key' >
            <v-card>
                <v-card-title>
                <span class="headline">{{ }}</span>
                </v-card-title>


                <!-- content -->

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap v-if='userMethod == methodsEnums.POST'>

                             <!-- form -->

                            
                            <template v-if='' >

                                <edit-jobcard

                                    :form.sync='editedItem'
                                    :products='products'
                                    :refProducts='refProducts'
                                    ref='jc'
                     

                                > </edit-jobcard>

                            </template>

                        

                            
                        </v-layout>

                        <v-layout v-else-if='userMethod == methodsEnums.DELETE' wrap style='background: rgba(0,0,0,.15);border-radius: 12px'>
                            <v-flex    v-for='(item,index) in Object.values(this.entity)' 
                                style=''
                                class='pa-2'
                            > {{item}} </v-flex>

                        </v-layout>
                    </v-container>



                </v-card-text>
                
                <!-- dialog actions -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <data-model 
                        :endpoint="endpoint" 
                        
                        @success='postSuccess();' @error='postError()'>
                        <div slot-scope="{ remove, data: post_res, loading : post_loading, create, update, error }">
                            <v-btn color="blue darken-1" text @click="dialogClose"> Cancel </v-btn>
                            <v-btn color="blue darken-1" :loading='post_loading' text @click='dialogSave({functions: {create, remove, update}})'> {{methodToStringPresent(userMethod)}} </v-btn>
                        </div>
                    </data-model>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-flex>
            <data-list endpoint='jobcards' :entity='entity' :key='dl_key'>

                <template slot-scope="{ data : jobcard , error : jobcard_error, loading : jobcard_loading }">
                    
                    <template v-if='!jobcard_loading'>

                        <!-- projects found -->
                        <template >
                                <template>
                                    <v-layout wrap fill-height>
                                        <v-flex xs12 py-1>
                                            <v-layout justify-end>
                                                <v-flex shrink px-2>
                                                    <input 
                                                    single-line
                                                    type='text'

                                                    style='border-radius: 15px;
                                                            padding:2px;
                                                            transform: scale(1); 
                                                            text-align: center;
                                                            border: 1px solid rgba(0,0,0,.1); outline: none'
                                                    rounded 
                                                    v-model='search' 
                                                    placeholder='Search'
                                                    outlined
                                                    prepend-inner-icon='search'

                                                    > </input>
                                                </v-flex>

                                                <v-flex shrink px-2>
                                                    <v-btn small rounded @click='dialogOpen' > Add </v-btn>
                                                </v-flex>  
                                            </v-layout>
                                        </v-flex>

                                        <v-flex xs12  v-if='!jobcard_error && jobcard.results.length > 0'>
                                            <v-data-table
                                                dense
                                                :headers='headers'
                                                :items='jobcard.results'
                                                :search='search'
                                            >

                                                
                                                    
                                                <template  v-slot:item.jobcard_id="props">
                                                    <router-link tag="tr" 
                                                    :to="{
                                                        name: 'jobcard',
                                                        params: {
                                                            'id' : props.item['jobcard_id']
                                                        }
                                                    }" 
                                                         class='clickable'>
                                                        <td> {{ props.item.jobcard_id | jobcard }}</td>
                                                    </router-link>
                                                </template>

                                            
                                            </v-data-table>
                                        </v-flex>
                                    </v-layout>
                                </template>
                     
                        </template>

                         <!-- nnot found -->
                      

                    </template>

                    <!-- loader -->
                    <template v-else>
                        <v-flex shrink  align-self-center>
                                <v-progress-circular
                                    :size="16"
                                    :width="7"
                                    color="red"
                                    indeterminate
                                ></v-progress-circular>
                            </v-flex>
                    </template>

                </template>

            </data-list>
        </v-flex>
    </v-layout>
</template>

<script>

import DataList from '@/components/data/DataList'
import DataModel from '@/components/data/DataModel'
import sad from '@/components/sad'

import _ from 'lodash'

import EditJobcard from '@/components/newForms/edit_jobcard_client'

import axios from 'axios'

import qs from 'qs'

const methodsEnums = {
    GET : 0,
    POST : 1,
    PATCH : 2,
    DELETE : 3
}


export default {
    name: 'clientJobcards',
    components: {
        DataList,
        DataModel,
        sad,
        EditJobcard
    },
    props: {
        entity: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            search :'',
            headers: [  
                {
                    text: 'Jobcard ID',
                    value: 'jobcard_id'
                },
                {
                    text: 'Project Name',
                    value: 'project_name'
                },
                {
                    text: 'Person name',
                    value: 'person_name'
                }
            ],
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
            endpoint: 'jobcards',
            products: [],
            refProducts: {},

            editedItem: 
            {
                "jobcard_id": 0,
                "client_id": parent.client_id,
                "project_id": 0,
                "person_id": 0,
                "location": "",
                "revision": 1,
                "date": null,
                "site_supervisor": "",
                "autocad_engineer": "",
                "plan_approved_by": "",
                "labour_contractor": "",
                "client_name": "",
                "project_name": "",
                "person_name": "",
                "products_headings": [
                    {
                        "pItems": 
                        [
                                {
                                    "pid": 0,
                                    "quantity": 0
                                }
                        ],
                        "heading": "",
                        "subheading" : ""

                    }
                   
                ]
            }


        }
        
    },

    async created(){
        let products = await axios.get('products')
        this.products = this.generateItems(products.data.results,'product_id')

        if(products)
        {
            this.refProducts = this.productsToObj(products.data.results)
        }

        this.editedItem.client_id = this.entity.client_id
        
    },

    methods: {

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
        productsToObj(input){

            let temp = {}
            Object.keys(input).forEach( (k,i,a) => {
                temp[Number(input[k].product_id)] = input[k]
            } )
            return temp

        },
        dialogOpen(){
            this.dialog = true
            this.userMethod = this.methodsEnums.POST
        },
        dialogClose(){
            this.dialog = false
        },

        dialogSave (dialog) {

        
           switch(this.userMethod)
           {
                case this.methodsEnums.POST :  
                       this.$refs.jc.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                                let  temp =  _.cloneDeep(this.editedItem)
                                temp.products_headings = JSON.stringify(temp.products_headings)
                                this.dl_key++
                                dialog.functions.create(temp);
                            }
                                
                        } );
                        break;
                case this.methodsEnums.PATCH :  

                        
                        this.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                                let temp = _.cloneDeep(this.entity)
                                temp.products_headings = JSON.stringify(temp.products_headings)
                                this.dl_key++
                                //this.entity.products_headings = JSON.stringify(this.entity.products_headings)
                                dialog.functions.update(temp);
                            }
                               
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { jobcard_id: this.entity.jobcard_id } ); this.dl_key++; break;

        
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

</style>
