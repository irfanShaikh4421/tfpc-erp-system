<template>
    <v-layout pa-0 row 
        
        wrap
        align-start
        justify-center
        class='white elevation-0 main ' style='border-radius: 25px; text-align: center; margin-left: 0px !important; margin-right: 0px !important'>


         <v-snackbar v-model="snackbar.visible" :timeout=2000 :color='snackbar.state ? "success" : "error"'> 
            {{ snackbar.message }} <v-btn text @click="snackbar.visible = false" >Close</v-btn>
        </v-snackbar>
        <v-dialog v-model="dialog" max-width="50%" :key='dialog_key' >
                
            <v-card>
                    
                   
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>


                    <!-- content -->

                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap v-if='userMethod == methodsEnums.PATCH'>

                                <!-- form -->

                                
                                <template v-if='' >
                                    <edit-jobcard
                                        :form.sync='entity'
                                        

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

        

        <v-flex xs12 
        > 

            <v-layout justify-end class='btns'>
                <v-btn text rounded @click='print()'> PRINT </v-btn>
                <v-btn text rounded @click='userMethod = methodsEnums.PATCH; dialog=true'> EDIT </v-btn>
                <v-btn text rounded @click='userMethod = methodsEnums.DELETE;dialog=true;'> DELETE </v-btn>
            </v-layout>
        </v-flex>

        <v-flex xs12 class='printable'>

            <v-layout justify-center wrap>

                <v-flex xs12>

                    <v-layout row wrap class='jobcard-data-fields'
                        justify-center  
                    >

                        <v-flex  xs6 md5 style='border: 1px solid #000; margin-left: -1px'> 

                            <v-layout>
                                <img :src='logo' style='width: 240px'>
                                </img> 

                            </v-layout>
                            
                        </v-flex>

                        
                        <v-flex shrink xs6 md5 pa-5 
                                style='border: 1px solid #000'
                    
                            
                        > 

                            <v-layout justify-end>
                                <h1 class='display-1' style='opacity: .6;'> {{firstCharUpperCase($route.name)}} </h1>
                            </v-layout>

                            
                            

                            <!-- <my-form class='pa-5'> </my-form> -->

                        </v-flex>

                        <v-flex xs6 md5 >
                            <h1 class='body-1'> Jobcard ID : <span class='innerValue'> {{entity.jobcard_id | jobcard }} </span> </h1>
                        </v-flex>

                        <v-flex xs6 md5>
                            <h1 class='body-1'> Client Name : <span class='innerValue'> {{entity.client_name}} </span>  </h1>   
                        </v-flex>

                        <v-flex xs6 md5>
                            <h1 class='body-1'> Project Name : <span class='innerValue'> {{entity.project_name}} </span> </h1>
                        </v-flex>

                        <v-flex xs6 md5>
                            <h1 class='body-1'> Location : <span class='innerValue'> {{entity.location}} </span> </h1>
                        </v-flex>

                        <v-flex xs6 md5>
                            <h1 class='body-1'> Revision : <span class='innerValue'> {{entity.revision}} </span> </h1>
                        </v-flex>

                        <v-flex xs6 md5>
                            <h1 class='body-1'> Date : <span class='innerValue'> {{entity.date}} </span> </h1>
                        </v-flex>

                       
                        <v-flex xs6 md5>
                            <h1 class='body-1'> Tfpc's Site supervisor : <span class='innerValue'> {{entity.site_supervisor}} </span> </h1>
                        </v-flex>

                        <v-flex xs6 md5>
                            <h1 class='body-1'> Location : <span class='innerValue'> {{entity.location}} </span> </h1>
                        </v-flex>

                        <v-flex xs6 md5>
                            <h1 class='body-1'> Autocad Engineer : <span class='innerValue'> {{entity.autocad_engineer}} </span> </h1>
                        </v-flex>

                        <v-flex xs6 md5>
                            <h1 class='body-1'> Plan Approved By : <span class='innerValue'> {{entity.plan_approved_by}} </span> </h1>
                        </v-flex>

                        <v-flex xs12 md10

                        >
                            <h1 class='body-1'> Labour Contractor : <span class='innerValue'> {{entity.labour_contractor}} </span> </h1>
                        </v-flex>
                        <v-flex xs12 md10>
                            <h1 class='body-1' style='opacity: 1; text-align: left;'> Products </h1>
                        </v-flex>

    
                            
                        <v-flex xs12 md10 pa-2 my-2>
                            
                            <v-layout wrap v-for=' (item,index) in entity.products_headings'  :key='index' mt-2 mb-2 class='perProduct' >
                                 <v-flex xs12 grow style='border: 1px solid #000; padding: 3px 0px 3px 14px;margin-left: -1px; margin-top: -1px; ' >
                                    <h1 class='subtitle-1'> {{item.heading}}   &nbsp;&nbsp;&nbsp; <span class='caption'> {{item.subheading}} </span>  </h1>  
                                </v-flex>
 
                         
                                <v-flex  my-0>
                                    <v-simple-table class='py-0 ptable' dense> 
                                        
                                        <thead>
                                            <th> Name </th>
                                            <th> Quantity </th>
                                            <th class='toHide'> Site Stock </th>
                                            <th class='toHide'> Global Stock </th>
                                        
                                        </thead>

                                        <tbody>
                                            <tr v-for=' (i) in item.pItems'> 
                                                <td> {{refProducts[i.pid] ? refProducts[i.pid].name : 'Null'}} </td>
                                                <td> {{i.quantity}} </td>
                                                <td class='toHide'> {{i.site_stock}} </td>
                                                <td class='toHide'> {{i.global_stock}} </td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-flex>


                            </v-layout>
                        </v-flex>

                    </v-layout>
                        </v-flex>
                        

                    </v-layout>

                </v-flex>

                <!-- dynamic part -->

                <v-flex xs12 my-2 px-0 
                    
                >
                    <!--
                    <v-layout justify-center wrap class='jobcard-data-fields'>
                        <v-flex xs10>
                            <h1 class='subtitle-1' style='opacity: .6; text-align: left;'> Products </h1>
                        </v-flex>

                        <v-flex  xs10>
                            <v-layout wrap v-for=' (item,index) in entity.products_headings'  :key='index'>

                                <v-flex  my-2>
                                    <v-simple-table class='py-2'>
                                        
                                        <thead>
                                            <tr>
                                                <td> 
                                                    <h1 class='subtitle-1'> {{item.heading}} <br/> {{item.subheading}} </h1>  
                                                    
                                                </td>
                                            </tr>
                                            <th> Name </th>
                                            <th> Quantity </th>
                                            <th> Site Stock </th>
                                            <th> Global Stock </th>
                                        
                                        </thead>

                                        <tbody>
                                            <tr v-for=' (i) in item.pItems'> 
                                                <td> {{refProducts[i.pid] ? refProducts[i.pid].name : 'Null'}} </td>
                                                <td> {{i.quantity}} </td>
                                                <td> {{i.site_stock}} </td>
                                                <td> {{i.global_stock}} </td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-flex>


                            </v-layout>
                        </v-flex>

                    </v-layout>

                    -->

                </v-flex>

            </v-layout>

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

import EditJobcard from '@/components/newForms/edit_jobcard'
import _ from 'lodash'

Object.freeze(methodsEnums)

export default {
    extends: utilities,

    components: {

        DataList,
        DataModel,
        
        EditJobcard
    },

    props: {

    },


    data(){
        return {


            logo: require('../../public/logo.png') ,

            products: [],
            refProducts: {},

            style: {
                parent: {
                    backgrosund : '#F4F5F6',
                    bordesrRadius : '15px',
                    padding: '0px'
                },

                heading: {
                    opacity: '.7'
                },

                subheading: {
                    opacity: '.5'
                }
            },


            entity: {},
            backupEntity: {},
            
            state: {
                error: false
            },

            /* 
             form related
            */


            endpoint: 'jobcards' ,

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

        try{
             let r = await axios({
                method: 'GET',
                url: 'jobcards/stock',
                params: {
                    jobcard_id : this.$route.params.id
                }
            })

            if(r)
            {
                //alert(JSON.stringify(r.data))
                //alert(JSON.stringify(r.data.results))
                this.entity = Object.assign({},r.data.results[0])
        
                this.entity.product_headings = JSON.parse(this.entity.product_headings)


                // dirty patch



            }
                

        }

        catch(e){

            if(e)
            {
                this.state.error = true
            }

        }
       

       
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

        print(){
            window.print()
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
        dialogOpen(){
            this.dialog = true
            this.userMethod = this.methodsEnums.PATCH
        },
        dialogClose(){
            this.dialog = false
        },

        dialogSave (dialog) {

        
           switch(this.userMethod)
           {
                case this.methodsEnums.POST :  
                       this.$validator.validateAll().then( (r) => {
                            if(r)
                                dialog.functions.create(this.entity);
                        } );
                        break;
                case this.methodsEnums.PATCH :  

                        
                        this.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                                let temp = _.cloneDeep(this.entity)
                                temp.products_headings = JSON.stringify(temp.products_headings)
                                //this.entity.products_headings = JSON.stringify(this.entity.products_headings)
                                dialog.functions.update(temp);
                            }
                               
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { jobcard_id: this.entity.jobcard_id } ); break;

        
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


    .jobcard-data-fields {
        text-align: left;
    }



    .jobcard-data-fields > * > h1{
        font-weight: 400 !important;
    }


    .innerValue{
        opacity: .95 !important;
    }

    .jobcard-data-fields > div{
        margin-left: -1px;
         margin-top: -1px;
        
        padding: 2px 0px 2px 12px;
        
        border: 1px solid #000;
    }


    .ptable  {
        margin-left: -1px;
         margin-top: -1px;
        padding: 0px;
        
        border: 1px solid #000;

    }

    tbody > tr:nth-child(odd){
    background: #fff !important;
   
    }

    @media print {

        .toStretch{
            width: 100vw !important;
            height: 100vh !important;
            position: absolute !important;
            left: 0px !important;
            top: 0px !important;
            z-index: 100;

        }

        

        *,h1,h2,h3,h4,h5,h6,span {
            font-size: 12px !important;
        }
        
        .main {
            border-radius: 0px !important;
            box-shadow: 0px !important; 
        }

        .btns, .toHide , .navbar { 
             display: none !important
        }   

        .printable{

            padding: 24px 16px 24px 16px;

        }


        .pes    rProduct {
            page-break-inside: avoid !important
        }

        .navRouter{
            display: none;
        }
        
         
        
        
    }


</style>
