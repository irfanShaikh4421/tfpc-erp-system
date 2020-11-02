<template>
    <v-layout row pa-5 style=''>
        <v-snackbar v-model="snackbar.visible" :timeout=2000 :color='snackbar.state ? "success" : "error"'> 
            {{ snackbar.message }} <v-btn text @click="snackbar.visible = false" >Close</v-btn>
        </v-snackbar>
        
        <v-dialog v-model="dialog" :max-width="dynamicWidth" :key='dialog_key' >
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

                                <edit-stock
                                    
                                    :form.sync='editedItem'     
                                    ref='jc'

                                > </edit-stock>

                            </template>
                    
                        </v-layout>

                        <v-layout v-else-if='userMethod == methodsEnums.DELETE' wrap style='background: rgba(0,0,0,.15);border-radius: 12px'>
                            <v-flex    v-for='(item,index) in Object.values(this.editedItem)' 
                                style=''
                                class='pa-2'
                            > {{item}} </v-flex>

                        </v-layout>

                        <v-layout v-else-if='userMethod == methodsEnums.APPROVE' wrap >
                           
                           <h1 class='display-1'> Are you sure, you want to Approve this ? </h1>
                           

                            <v-flex    
                                v-for='(item,index) in Object.values(this.editedItem)' 
                                style='background: rgba(0,0,0,.15);border-radius: 12px'
                                class='pa-2'

                            > 
                                {{item}} 
                                
                            </v-flex>

                            


                        </v-layout>
                    </v-container>



                </v-card-text>
                
                <!-- dialog actions -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <data-model 
                        :endpoint="endpoint" 
                        
                        @success='postSuccess();' @error='postError()'>
                        <div slot-scope="{ approve,remove, data: post_res, loading : post_loading, create, update, error }">
                            <v-btn color="blue darken-1" text @click="dialogClose"> Cancel </v-btn>
                            <v-btn color="blue darken-1" :loading='post_loading' text @click='dialogSave({functions: {create, approve, remove, update}})'> {{methodToStringPresent(userMethod)}} </v-btn>
                        </div>
                    </data-model>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-flex class='white elevation-2' py-5 style='border-radius: 25px; '>
            
            <v-flex px-5>
                <h1 class='display-1' style='opacity: .6;'> {{firstCharUpperCase($route.name)}} </h1>
            </v-flex>
            <data-list endpoint='stock-transfer' :key='dl_key' >

                <template slot-scope="{ data : project , error : project_error, loading : project_loading }">
                    

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

                                                <v-flex  shrink>
                                                    <v-btn rounded @click='dialogOpen'> Add </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>

                                        <v-flex xs12>
                                            <v-data-table
                                            
                                                :headers='headers'
                                                :items='project && project.results ? project.results : []'
                                                :search='search'
                                                :loading='project_loading'

                                               >
                                            
                                                <template v-slot:item.st_id="{item}">
                                                    {{ item.st_id | stock }}
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

                                            </v-data-table>
                                        </v-flex>
                                    </v-layout>
                                </template>
                    

                         <!-- nnot found -->
    

                    <!-- loader -->

                </template>

            </data-list>
        </v-flex>

    </v-layout>
</template>

<script>



import DataList from '@/components/data/DataList'
import DataModel from '@/components/data/DataModel'
import sad from '@/components/sad'


import EditStock from '@/components/newForms/edit_stock'
import utilities from '@/components/mixins/utilities.js'



const methodsEnums = {
    GET : 0,
    POST : 1,
    PATCH : 2,
    DELETE : 3,
    APPROVE: 4
}


export default {    
    name: 'stock-transfer',
    extends: utilities,
    components: {
        DataList,
        DataModel,
        sad,
        EditStock
    },
    props: {
        
    },
    mounted(){
        
    },
    data() {
        return {
            search :'',
            headers: [
                {
                    text: 'Stock Transfer ID',
                    value: 'st_id'
                },
                {
                    text: 'From',
                    value: 'sender_name'
                },
                {
                    text: 'To',
                    value: 'receiver_name'
                },
                {
                    text: 'Reason',
                    value: 'reason'
                },
                {
                    text: 'Status',
                    value: 'status'
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

            endpoint: 'stock-transfer',
            methodsEnums : methodsEnums,

            editedItem: {
                
            },

            default: {
                sender: null,
                receiver: null,
                reason: '',
                transfers: [
                    {
                        product_id: null,
                        stock: null,
                        avg_rate: null
                    }
                ]
            },

            userMethod: ''
        }
        
    },

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
            this.editedItem = Object.assign({},this.default)
        },
        dialogClose(){
            this.dialog = false
        },
        dialogSave (dialog) {


            
            let  temp =  _.cloneDeep(this.editedItem)    

            temp.transfers = JSON.stringify(temp.transfers)

           switch(this.userMethod)
           {
                case this.methodsEnums.POST :  
                       this.$refs.jc.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                               
                                dialog.functions.create(temp);
                            }
                                
                        } );
                        break;
                case this.methodsEnums.PATCH :  

                        
                        this.$refs.jc.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                              
                                
                                //this.entity.products_headings = JSON.stringify(this.entity.products_headings)
                                dialog.functions.update(temp);
                            }
                               
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { st_id: this.editedItem.st_id } ); break;

                case this.methodsEnums.APPROVE : dialog.functions.approve(temp.st_id); break;

        
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
                    case this.methodsEnums.APPROVE : return 'approved';
                }
            },
            methodToStringPresent(choice){
            switch(choice)
            {
                case this.methodsEnums.POST : return 'add';
                case this.methodsEnums.PATCH : return 'update';
                case this.methodsEnums.DELETE : return 'delete';
                case this.methodsEnums.APPROVE : return 'approve';
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
