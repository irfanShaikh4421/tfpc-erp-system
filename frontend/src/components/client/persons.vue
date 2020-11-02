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
                        <v-layout wrap v-if='userMethod == methodsEnums.POST || userMethod == methodsEnums.PATCH'>

                            <!-- form -->         
                            <template v-if='' >

                                <edit-person
                                    
                                    :form.sync='editedItem'     
                                    ref='jc'

                                > </edit-person>

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
            <data-list endpoint='persons' :entity='entity' :key='dl_key' >

                <template slot-scope="{ data : project , error : project_error, loading : project_loading }">
                    
                    <template v-if='!project_loading'>
                        
                        <!-- projects found -->
                        <template  >

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

                                                <v-flex small shrink>
                                                    <v-btn rounded @click='dialogOpen'> Add </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>

                                        <v-flex xs12 v-if='!project_error && project.results.length > 0'>
                                            <v-data-table
                                                dense
                                                :headers='headers'
                                                :items='project.results.length > 0 ? project.results : []'
                                                :search='search'
                                               >
                                            
                                                <template v-slot:item.person_id="{item}">
                                                    {{ item.person_id | person }}
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
                                        </v-flex>
                                    </v-layout>
                                </template>
                     
                        </template>

                         <!-- nnot found -->
                        <template>

                        </template>

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


import EditPerson from '@/components/newForms/edit_persons'



const methodsEnums = {
    GET : 0,
    POST : 1,
    PATCH : 2,
    DELETE : 3
}


export default {
    name: 'clientProjects',
    components: {
        DataList,
        DataModel,
        sad,
        EditPerson
    },
    props: {
        entity: {
            type: Object,
            required: true
        }
    },
    mounted(){
        this.editedItem.client_id = this.entity.client_id
    },
    data() {
        return {
            search :'',
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

            snackbar: {
                    visible: false,
                    state: false,
                    message : ''

            },

            // dialogs

            dialog: false,
            dialog_key: 555,
            dl_key: 55,
            dialog_loading: false,

            //form data

            endpoint: 'persons',
            methodsEnums : methodsEnums,

            editedItem: {
                
            },

            userMethod: ''
        }
        
    },

    methods: {
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
                                dialog.functions.create(temp);
                                this.dl_key++
                            }
                                
                        } );
                        break;
                case this.methodsEnums.PATCH :  

                        
                        this.$refs.jc.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                                let temp = _.cloneDeep(this.editedItem)
                                
                                //this.entity.products_headings = JSON.stringify(this.entity.products_headings)
                                dialog.functions.update(temp);
                                this.dl_key++
                            }
                               
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { person_id: this.editedItem.person_id } ); this.dl_key++; break;

        
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
        productsToObj(input){

            let temp = {}
            Object.keys(input).forEach( (k,i,a) => {
                temp[Number(input[k].product_id)] = input[k]
            } )
            return temp

        },


    }

}
</script>

<style>

</style>
