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
                    <v-dialog v-model="dialog" max-width="50%" :key='dialog_key' >
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
                               <!-- <v-flex shrink>
                                    <v-btn medium  dark 
                                        color='black'
                                        class='hover-btn mb-2'
                                        style='background-image: linear-gradient(to right, #e53935 0%, #e35d5b 51%, #e53935 100%)'
                                    rounded @click.stop='++dialog_key; dialog = true; userMethod=methodsEnums.POST' >New Item</v-btn>
                                </v-flex> -->
                            </v-layout>
                        </template>
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap v-if='userMethod == methodsEnums.POST || userMethod == methodsEnums.PATCH'>

                                        <!-- form -->

                                        <!-- 
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
                                                        v-validate="''"
                                                        data-vv-name='client_names'
                                                        v-model='editedItem.client_id'
                                                        
                                                    > </v-select>

                                                </div>
                                            </data-list>
                                        </v-flex>

                                        <v-flex xs12>
                                            <v-textarea 
                                                v-model="editedItem.address" 
                                                label="Godown Address"

                                                v-validate="'required|min:6|max:128'"
                                                data-vv-name='address'
                                                :error-messages="errors.collect('address')"

                                                ></v-textarea>
                                        </v-flex>

                                        -->
                                        <template v-if='userMethod == methodsEnums.POST'>
                                            <form-jobcard ref='form_child'
                                                :form.sync='currentItem'

                                                :isEdit='userMethod == methodsEnums.PATCH ? true : false'
                                                @init='child_loaded = true'> </form-jobcard>
                                        </template>

                                        <template v-else-if="userMethod == methodsEnums.PATCH">
                                            <edit-form ref='edit_form'
                                                :form.sync='currentItem'

                                                :isEdit='userMethod == methodsEnums.PATCH ? true : false'
                                                @init='child_loaded = true'> </edit-form>
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
                                    <div slot-scope="{ remove, data: post_res, loading : post_loading, create, update, error }">
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

                                <template v-slot:item.jobcard_id="{item}">
                        

                                    <router-link tag='div' 
                                        :to="{
                                            name: 'jobcard',
                                            params: {id: item.jobcard_id}
                                        }"  
                                        class='clickable'
                                        
                                    >
                                        <div>  {{item.jobcard_id | jobcard}} </div>
                                    </router-link>
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

                                <!--
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
                                -->
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

//form

import formJobcard from '@/components/forms/jobcard'

import editForm from '@/components/forms/editJobcard'

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
        DataModel,
        formJobcard,
        editForm
    },
    data(){
        return {

            endpoint: 'jobcards',
            child_loaded : false,

            currentItem: {

            },


            search: '',

            dialog: false,
            dialog_key: 555,
            dl_key: 55,
            dialog_loading: false,
            

            items: [],
            options: {},

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
                    text: 'Person Name',
                    value: 'person_name'
                },
                {
                    text: 'Tfpc Site Supervisor',
                    value: 'site_supervisor'
                },
                {
                    text: 'Client Name',
                    value: 'client_name'
                },
                {
                    text: 'Actions',
                    value: 'actions'
                },
                

            ],
            editedIndex: -1,


            editedItem: {
               
            },
            defaultItem: {
            
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
                
                case this.methodsEnums.POST : return 'New Jobcard';
                case this.methodsEnums.PATCH : return 'Update Jobcard';
                case this.methodsEnums.DELETE : return 'Delete Jobcard';
                default : return 'Invalid State'
            }
        },
    },

    watch: 
    {
        dialog (val) {
            val || this.dialogClose()
        }, 

        child_loaded() {
            //alert(this.$refs.child_loaded)
            /*setTimeout( () => {
                this.editedItem = this.$refs.form_child.form
                this.defaultItem = this.$refs.form_child.default
            } ,500 ) */

                this.currentItem = this.$refs.form_child.form
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

        //this.headers = this.generateHeaders(this.schema)

        //alert(JSON.stringify(this.generateHeaders(this.schema)))
       // this.editedItem = this.$refs.form_child.form
       // this.defaultItem = this.$refs.form_child.default
        
        
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
            temp.push({
                text: 'none',
                value: null
            })
            input.forEach( (item,index) => {
                temp.push({
                    text: item.name,
                    value: Number(item.client_id)
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
            //temp.push({text: 'Actions',value: 'actions'})
            return  temp
        },


        actionEditItem (item) {

            this.userMethod = this.methodsEnums.PATCH
            //alert(JSON.stringify(item))
        
            this.editedItem = Object.assign({}, item) // SET selected item to editedItem
            this.editedItem.jobcard_id = String(item.jobcard_id)
            this.currentItem = Object.assign({},item)
            
            this.keyHack()

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
                       this.$refs.form_child.validate().then( (r) => {
                           console.log(r)
                            dialog.functions.create(r);
                        } );
                        break;
                case this.methodsEnums.PATCH :  
                         this.$refs.form_child.validate().then( (r) => {
                             r.products_headings = JSON.stringify(r.products_headings)
                            dialog.functions.update(r);
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { jobcard_id: this.editedItem.jobcard_id } ); break;

        
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

<style scoped>


table {
    border-collapse: separate !important;
    border-spacing: 0px 0px !important;
}

tr {
    bosx-shadow: 0px 0px 5px 0px rgba(0,0,0,.1);
}

thead > tr {
    background: #CCAEB1;
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

