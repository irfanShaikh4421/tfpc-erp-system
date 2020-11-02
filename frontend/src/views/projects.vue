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
                                    rounded @click.stop='++dialog_key; dialog = true; userMethod=methodsEnums.POST' >New Project</v-btn>
                                </v-flex>
                            </v-layout>
                        </template>
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
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

                                        <v-flex xs12  sm6 >
                                            <data-list endpoint="clients" >
                                                <div slot-scope="{ data : clients , error : client_error, loading : client_loading }">
                                                    <v-select 
                                                        label='Clients'
                                                        :error='client_error'
                                                        :error-messages='client_error ? client_error.statusText + ". Try Reloading the page" : ""'
                                                        :loading='!client_error && client_loading ? client_loading : "" '
                                                        :items='!client_loading && !client_error ? generateItems(clients.results) : []'
                                                        v-validate="'required'"
                                                        data-vv-name='client_names'
                                                        v-model='editedItem.client_id'
                                                        
                                                    > </v-select>

                                                </div>
                                            </data-list>
                                        </v-flex>

                                        <v-flex xs12>
                                            <v-textarea 
                                                v-model="editedItem.site_address" 
                                                label="Site Address"

                                                v-validate="'required|min:6|max:128'"
                                                data-vv-name='site_address'
                                                :error-messages="errors.collect('site_address')"

                                                ></v-textarea>
                                        </v-flex>

                                        <v-flex xs12 sm6>
                                            <v-text-field 
                                                v-model="editedItem.godown_name" 
                                                label="Godown Name"
                                                v-validate="'required|min:3|max:64'"
                                                data-vv-name='godown name'
                                                :error-messages="errors.collect('godown_name')"
                                            ></v-text-field>
                                        </v-flex>

                                        
                                        
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
                                <data-model endpoint="projects" @success='postSuccess();' @error='postError()'>
                                    <div slot-scope="{ remove, data: post_res, loading : post_loading, create, update,error, }">
                                        <v-btn color="blue darken-1" text @click="dialogClose">Cancel</v-btn>
                                        <v-btn color="blue darken-1" :loading='post_loading' text @click='dialogSave({functions: {create, remove, update}})'> {{methodToStringPresent(userMethod)}} </v-btn>
                                    </div>
                                </data-model>
                            </v-card-actions>
                        </v-card>

                    </v-dialog>

                    <!-- DATA -->

                    <data-list endpoint="projects" :key='dl_key' @success='listSuccess' @error='listError'>
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
                                <template v-slot:item.client_name="props">
                                    <router-link tag="div" :to="{
                                            name: 'client',
                                            params: { id :  props.item.client_id }
                                        }" 
                                        append class='clickable'>
                                        <div> {{ props.item.client_name }}</div>
                                    </router-link>
                                </template>

                                <template v-slot:item.project_id="{item}">
                                    {{ item.project_id | project }}
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


                                <template v-slot:item.dashboard= "{ item }">
                                               
                                    <router-link tag="div" :to="{
                                            name: 'projectWise',
                                            params: { id :  item.project_id }
                                        }" 
                                        class='clickable'>
                                        <div> Open </div>
                                    </router-link>
                                    
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
            search: '',

            dialog: false,
            dialog_key: 0,
            dl_key: 0,
            dialog_loading: false,
            
            schema: {
                project_id: {
                    text: 'Project ID', // User friendly name
                    'v-validate' : "'integer'" , // validation rules
                    value : 'project_id', // validation name identifier
                    edit_value : "'integer'", //  different for edit
                    default: 0, // default value
                    ignore: true
                },
                name: {
                    text: 'Project Name', // User friendly name
                    'v-validate' : "'required|min:3|max:64'" , // validation rules
                    value : 'name', // validation name identifier
                    
                    edit_value : "'min:3|max:64'", //  different for edit
                    default: 0 // default value
                },
                site_address: {
                    text: 'Project Address', // User friendly name
                    'v-validate' : "'required|min:3|max:128'" , // validation rules
                    value : 'site_address', // validation name identifier
                    
                    edit_value : "'min:3|max:128'", //  different for edit
                    default: 0 // default value
                },
                client_name: {
                    text: 'Client Name', // User friendly name
                    type: 'select',
                    'v-validate' : "'required'" , // validation rules
                    value : 'client_name', // validation name identifier (data-vv-name)
                    default: 0 // default value
                },
                 dashboard: {
                    text: 'Dashboard', // User friendly name
                    type: 'select',
                    'v-validate' : "'required'" , // validation rules
                    value : 'dashboard', // validation name identifier (data-vv-name)
                    default: 0 // default value
                },

            },

            items: [],

            options: {},

            headers: [] ,
            editedIndex: -1,


            editedItem: {
                project_id: 0,
                name: '',
                site_address: '',
                client_name: '',
                client_id : 0,
                godown_name : ''
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
                
                case this.methodsEnums.POST : return 'New Project';
                case this.methodsEnums.PATCH : return 'Update Project';
                case this.methodsEnums.DELETE : return 'Delete Project';
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

        this.headers = this.generateHeaders(this.schema)
        
        
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
        
        generateItems(input){
            let temp = []
            input.forEach( (item,index) => {
                temp.push({
                    text: item.name,
                    value: item.client_id
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
            this.dialog = true // start the dialog
        
        },

        actionDeleteItem (item) {

            this.userMethod = this.methodsEnums.DELETE
            this.editedItem = Object.assign({}, item)
            this.dialog = true

            //const index = this.desserts.indexOf(item)
            //confirm('Are you sure you want to delete this item?') //&& this.desserts.splice(index, 1)
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

            console.log(dialog.functions)
            

           switch(this.userMethod)
           {
                case this.methodsEnums.POST :  
                       this.$validator.validateAll().then( (r) => {
                            dialog.functions.create(this.editedItem);
                        } );
                        break;
                case this.methodsEnums.PATCH :  
                        this.$validator.validateAll().then( (r) => {
                            dialog.functions.update(this.editedItem);
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { project_id: this.editedItem.project_id } ); break;

        
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

