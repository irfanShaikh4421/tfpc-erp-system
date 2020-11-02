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
                                    rounded @click.stop='++dialog_key; dialog = true; userMethod=methodsEnums.POST' >New Person</v-btn>
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
                                                v-model="editedItem.name" 
                                                label="Name"
                                                v-validate="'required|min:3|max:64'"
                                                data-vv-name='name'
                                                :error-messages="errors.collect('name')"
                                            ></v-text-field>
                                        </v-flex>

                                        <v-flex xs12 sm6>
                                            <v-text-field 
                                                v-model="editedItem.email" 
                                                label="Email"
                                                hint="Optional"
                                                persistent-hint
                                                v-validate="'email|min:3'"
                                                data-vv-name='email'
                                                :error-messages="errors.collect('email')"
                                            ></v-text-field>
                                        </v-flex>

                                                                        
                                        <v-flex xs12 sm6>
                                            <v-text-field 
                                                v-model="editedItem.number" 
                                                label="Number"
                                                v-validate="'required|numeric'"
                                                data-vv-name='number'
                                                :error-messages="errors.collect('number')"
                                            ></v-text-field>
                                        </v-flex>

                                         <v-flex xs12>
                                            <v-text-field 
                                                v-model="editedItem.designation" 
                                                label="designation"
                                                v-validate="'required|min:3'"
                                                data-vv-name='designation'
                                                :error-messages="errors.collect('designation')"
                                            ></v-text-field>
                                        </v-flex>

                                        <v-flex xs6>
                                                
                                            <v-select 

                                                :loading='extras.clients.loading'
                                                :items='extras.clients.data'

                                            
                                                v-model="editedItem.client_id" 
                                                label="Client ID"
                                                v-validate="'required'"
                                                data-vv-name='client_id'
                                                :error-messages="errors.collect('client_id')"


                                            ></v-select>
                                        </v-flex>

                                        <v-flex xs6>

                                            <v-select 

                                                :loading='extras.projects.loading'
                                                :items='extras.projects.data'

                                            
                                                v-model="editedItem.project_id" 
                                                label="Project ID"
                                                v-validate="'required'"
                                                data-vv-name='project_id'
                                                :error-messages="errors.collect('project_id')"


                                            ></v-select>
                                        </v-flex>


                                       


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
                                </v-container>
                            </v-card-text>
                            
                            <!-- dialog actions -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <data-model :endpoint="endpoint" @success='postSuccess();' @error='postError()'>
                                    <div slot-scope="{ remove, data: post_res, loading : post_loading, create, update,error, }">
                                        <v-btn color="blue darken-1" text @click="dialogClose">Cancel</v-btn>
                                        <v-btn color="blue darken-1" :loading='post_loading' text @click='dialogSave({functions: {create, remove, update}})'> {{methodToStringPresent(userMethod)}} </v-btn>
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

                                <template v-slot:item.person_id="{item}">
                                    {{ item.person_id | person }}
                                </template>
                                
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
import utilities from '@/components/mixins/utilities.js'
import DataList from '@/components/data/DataList'
import DataModel from '@/components/data/DataModel'

// import axios from 'axios'

import Vue from 'vue'

const methodsEnums = {
    GET : 0,
    POST : 1,
    PATCH : 2,
    DELETE : 3
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

            endpoint: 'persons',

            search: '',

            dialog: false,
            dialog_key: 0,
            dl_key: 55,
            dialog_loading: false,
            

            items: [],

            options: {},

            headers: [
                {
                    text: 'Person ID',
                    value: 'person_id'
                },
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Number',
                    value: 'number'
                },
                {
                    text: 'Email',
                    value: 'email'
                },
                {
                    text: 'Designation',
                    value: 'designation'
                },
                {
                    text: 'Client Name',
                    value: 'client_name'
                },
                
                {
                    text: 'Project Name',
                    value: 'project_name'
                },
                {
                    text: 'Actions',
                    value: 'actions'
                }
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
            methodsEnums : methodsEnums,
            userMethod : 0,
            table: {
                sortBy: '',
                sortDesc: false
            },

            extras: {
                projects: {
                    loading: true,
                    error: false,
                    data: []
                },
                clients: {
                    loading: true,
                    error: false,
                    data: []
                }
            }

        

            

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
                
                case this.methodsEnums.POST : return 'New Person';
                case this.methodsEnums.PATCH : return 'Update Person';
                case this.methodsEnums.DELETE : return 'Delete Person';
                default : return 'Invalid State'
            }
        },
    },

    watch: {
        dialog (val) {
            val || this.dialogClose()
        },

        'editedItem.client_id': {
            deep: true,
            handler: async function() {

                this.editedItem.project_id = ''

                let projects = await axios({
                    method: 'GET',
                    baseURL: this.$config.baseUrl,
                    url: 'projects',
                    params: {
                        client_id : this.editedItem.client_id
                    }
                })

                if(projects.data.results)
                {
                    this.extras.projects.data = this.generateItems(projects.data.results,'project_id')
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

    async created(){
        let client = await axios({
                method: 'GET',
                baseURL: this.$config.baseUrl,
                url: 'clients'
            })

        if(client.data.results)
        {
            this.extras.clients.data = this.generateItems(client.data.results,'client_id')
        }
    },
    async mounted(){

        
        //alert(JSON.stringify(this.generateHeaders(this.schema)))
        
        
    },
    


    methods: {

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
                case this.methodsEnums.DELETE :  dialog.functions.remove( { person_id: this.editedItem.person_id } ); break;

        
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

