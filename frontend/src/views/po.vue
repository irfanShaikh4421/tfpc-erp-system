<template>
    <v-layout pa-5 row 
        
        align-start
        justify-center
        wrap
        class='white elevation-0 main ' style='border-radius: 25px; text-align: center; margin-left: 0px !important; margin-right: 0px !important'>

         <v-snackbar v-model="snackbar.visible" :timeout=2000 :color='snackbar.state ? "success" : "error"'> 
            {{ snackbar.message }} <v-btn text @click="snackbar.visible = false" >Close</v-btn>
        </v-snackbar>
        <v-dialog v-model="dialog" max-width="80%" :key='dialog_key' >
                
                <v-card >
                    <v-card-title>
                    <span class="headline ">{{ formTitle }}</span>
                    </v-card-title>


                    <!-- content -->

                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap v-if='userMethod == methodsEnums.PATCH'>

                                <!-- form -->

                                
                                <template v-if='' >
                                    <edit-po
                                        :form.sync='entity'
                                        :products='products'
                                        :refProducts='refProducts'

                                        ref='poRef'
                                        

                                    > </edit-po>

                                </template>

                            

                                
                            </v-layout>

                            <v-layout v-else-if='userMethod == methodsEnums.DELETE' wrap style='background: rgba(0,0,0,.15);border-radius: 12px'>
                                <v-flex    v-for='(item,index) in Object.values(this.entity)' 
                                    style=''
                                    class='pa-2'
                                > {{item}} 
                                </v-flex>

                            </v-layout>
                        </v-container>



                    </v-card-text>
                    
                    <!-- dialog actions -->
                    <v-card-actions >
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
           

            
            

            <!-- <my-form class='pa-5'> </my-form> -->

        </v-flex>

        <v-flex xs12 
            
            class='printable'
        > 

            <v-layout justify-end  class='toHide'>
                <v-btn text rounded @click='print()'> PRINT </v-btn>
                <v-btn v-if='!entity.status' text rounded @click='userMethod = methodsEnums.PATCH; dialog=true'> EDIT </v-btn>
                <v-btn text rounded @click='userMethod = methodsEnums.DELETE;dialog=true;'> DELETE </v-btn>
            </v-layout>
        </v-flex>

        <v-flex xs12 class='' >

            <v-layout fluid row wrap justify-center class='jobcard-data-fields ' 
                         >

               <!-- <v-flex xs12 md10> -->



                        <v-flex  xs6 md5 style='border: 1px solid #000; margin-left: -1px'> 

                            <v-layout>
                                <img :src='logo' style='width: 240px; height: 70px'>
                                </img> 

                            </v-layout>
                            
                        </v-flex>

                        <v-flex xs6 md5 pa-5 >
                             <h1 class='title' style='opacity: .6; text-align: right'> Purchase Order </h1>
                        </v-flex>

                        <v-flex xs12 md10 class='noBorders'> &nbsp; </v-flex>

                        <v-flex xs6 md5 justify-space-around class='noBorders'>
                            <h1 class='subtitle-1'> Purchase Order ID : <span class='innerValue'> {{entity.po_id | po }}, </span> </h1>
                        </v-flex>
                        <v-flex xs6 md5 class='noBorders' shrink>
                            <v-layout justify-end>
                                <h1 class='subtitle-1'> Date : <span class='innerValue'> {{entity.date | formatDate}} </span> </h1>
                            </v-layout>
                        </v-flex>

                        <!--<v-flex xs12 md10 class='noBorders toHide'>
                            <h1 class='title'> Subject : <span class='innerValue'> {{entity.subject}} </span> </h1>
                        </v-flex> -->
 
                        <!-- <v-flex xs12 md10> &nbsp; </v-flex> -->

                        <v-flex xs12 md10 class='noBorders'> 
                            <!-- <h1 class='title'> Vendor Name : --> <h1 class='subtitle-1 innerValue' style='font-weight: 600 !important'> {{entity.vendor_name}}, </h1>  
                        </v-flex>
                        <v-flex xs12 md10 class='noBorders'>
                           
                                <h1 class='subtitle-1 innerValue'> {{entity.vendor_address}}. </h1>   
                        </v-flex>

                        <v-flex xs12 md10 class='noBorders'> &nbsp; </v-flex>

                        <v-flex xs12 md10 justify-space-around class='noBorders'>
                            <h1 class='subtitle-1'> Ref : {{entity.ref | uppercase }}  </h1>
                        </v-flex>

                        <v-flex xs12 md10 class='noBorders'> &nbsp; </v-flex>

                        <v-flex xs12 md10 class='noBorders'>
                                <h1 class='subtitle-1 innerValue'> 
                                    Dear Sir,  <br/>
                                    We are pleased to place a purchase order with your company, as follows    
                                </h1>   
                        </v-flex>

                        <v-flex xs12 md10 class='noBorders'> &nbsp; </v-flex>


                        




                        
                       
                        

 

               <!-- </v-flex> -->

                <!-- dynamic part -->

               <!-- <v-flex xs12 md10>
                    <h1 class='body-1' style='opacity: 1; text-align: left;'> Products </h1>
                </v-flex> -->
                

                <v-flex xs12 md10 pa-0 my-0 style=''  
                    :stsyle='style.parent'
                  
                >
                    
                  <!--  <v-layout justify-center>

                        <v-flex xs12 > -->
                           <!--<v-simple-table class=' ptable' dense style='overflow: hidden !important; table-layout:fixed; width: 100%'>
                                <thead>
                                    
                                    <th> Sr No. </th>
                        
                                    <th style='width: 25% !important'> Product Name </th>

                                    <th style='width: 25% !important'> Delivery Address </th>
                                    
                                    <th> Quantity </th>
                                    <th> Rate </th>
    

                                    


                                    <th> Unit </th>
                                    <th> IGST </th>
                                    <th> CGST </th>
                                    <th> SGST </th>
                                    <th style=''> Amount </th>


                                
                                </thead>

                                <tbody style=''>
                                    <tr v-for=' (i,num) in entity.products'> 
                                        
                                        <td> {{num+1}} </td>

                                        <td > {{ i.product_name  }} </td>
                                        <td style='' > {{ i.site_address  }} </td>

                                        
                                        <td> {{i.quantity}} </td>
                                        <td> {{i.avg_rate | currency('₹') }} </td>
                                        
                                        
                                        <td > {{ i.name  }} </td>
                                        <td > {{ i.igst | percentage }} </td>
                                        <td > {{ i.cgst | percentage }} </td>
                                        <td > {{ i.sgst | percentage }} </td>
                                        <td > {{ generateGst($Big(i.avg_rate).times(i.quantity),i.igst, i.cgst, i.sgst) | currency('₹') }}  </td>

                                    </tr>
                                </tbody>
                            </v-simple-table> 

                            -->

                        <v-data-table
                            dense
                            :items='entity.products'
                            :headers='headers'
                            disable-pagination
                            disable-sort
                            hide-default-footer
                            
                        >   

                            <template v-slot:item.amount="{item:i}">
                                {{ generateGst($Big(i.avg_rate).times(i.quantity),i.igst, i.cgst, i.sgst) | currency('₹') }}
                            </template>
                            
                           <!-- <template v-slot:item.srno="props">
                                {{ num++ }}
                            </template> -->
                            
                        </v-data-table>


                       <!-- <v-layout wrap>

                            <v-flex shrink>
                                Sr No.
                            </v-flex>

                            <v-flex shrink>
                                Product Name
                            </v-flex>

                            <v-flex shrink>
                                Quantity
                            </v-flex>
                            
                            <v-flex shrink>
                                Rate
                            </v-flex>

                            <v-flex shrink>
                                Delivery Address
                            </v-flex>

                            <v-flex shrink>
                                Unit
                            </v-flex>

                            <v-flex shrink>
                                IGST
                            </v-flex>

                            <v-flex shrink>
                                CGST
                            </v-flex>

                            <v-flex shrink>
                                SGST
                            </v-flex>

                            <v-flex shrink>
                                Amount
                            </v-flex>

                            

                        </v-layout> -->

                            
                    <!--    </v-flex>

                    </v-layout> -->


                </v-flex>
                
                <v-flex xs12 md10 class='noBorders'> &nbsp; </v-flex>
                

                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left; font-weight: 500 !important' > Terms Of Service </h1>
                </v-flex>
                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1'> Payment : <span class='innerValue'> {{entity.tac.payment |capitalize}} </span> </h1>
                </v-flex>
                <v-flex xs12 md10 class='noBorders toHide'>
                    <h1 class='subtitle-1'> Remarks : <span class='innerValue'> {{entity.tac.remarks |capitalize}} </span> </h1>
                </v-flex>

                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1'> Tax Type : <span class='innerValue'> {{entity.tac.tax_type |capitalize}} </span> </h1>
                </v-flex>


                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1'> Warranty : <span class='innerValue'> {{entity.tac.warranty |capitalize}} </span> </h1>
                </v-flex>

                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1'> Tax Price : <span class='innerValue'> {{entity.tac.tax_price }} </span> </h1>
                </v-flex>

                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1'> Freight Tax : <span class='innerValue'> {{entity.tac.freight_tax |capitalize}} </span> </h1>
                </v-flex>

                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1'> Delivery Period : <span class='innerValue'> {{entity.tac.delivery_period |capitalize}} </span> </h1>
                </v-flex>
                    
                <v-flex xs12 md10 class='noBorders'> &nbsp; </v-flex>
                
                <v-divider></v-divider>
                
                <v-flex xs12 md10 class='noBorders'> <br/> <v-divider></v-divider> </v-flex>

                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left; font-weight: 500 !important'> Billing Address : </h1>
                </v-flex>
                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left;'> THE FIRE PROTECTION COMPANY </h1>
                </v-flex>
                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left;'> B-601, North Lanes shopping complex, Opp Vartak College, Vasai West, Palghar - 401 202, India. </h1>
                </v-flex>
                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left;'> GST NO : 27BBKPG9094E1ZC </h1>
                </v-flex>
                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left;'> PAN NO : BBKPG9094E </h1>
                </v-flex>

               

                <v-flex xs12 md10 class='noBorders'> <v-divider></v-divider> <br/> </v-flex>

                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left; font-weight: 500 !important'> Declaration: </h1>
                </v-flex>

                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left;'> Kindly acknowledge the receipt of this purchase order duty signed and stamped as token of your unconditional acceptance </h1>
                </v-flex>

                <v-flex xs12 md10 class='noBorders'> &nbsp; </v-flex>

                <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left;'> Signature: </h1>
                </v-flex>
                
                <template v-if='!entity.status'>
                 <v-flex xs12 md10 class='noBorders'> &nbsp; </v-flex>
                 <v-flex xs12 md10 class='noBorders'> &nbsp; </v-flex>
                </template>

                <template v-else>
                    
                    <v-flex xs12 md10 ml-0 align-self-start shrink class='noBorders'>
                       <v-layout align-self-start>
                           <v-flex xs12 md6 pa-2 shrink style='border: 1px solid #000;'>
                                <span style='font-weight: 500'> This is a digitally signed document </span><br/>
                           </v-flex>
                       </v-layout>
                    </v-flex>
                    
                </template>

                 <v-flex xs12 md10 class='noBorders'>
                    <h1 class='subtitle-1' style='opacity: 1; text-align: left; font-weight: 500 !important'> Authorized Signatory </h1>
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

import EditPo from '@/components/newForms/edit_po'
import _ from 'lodash'

Object.freeze(methodsEnums)

export default {
    extends: utilities,

    components: {

        DataList,
        DataModel,
        
        EditPo
    },

    props: {

    },


    data(){
        return {
            
            num: 1,
            logo: require('../../public/logo.png') ,

            style: {
                parent: {
                    background : '#F4F5F6',
                    borderRadius : '15px'
                },

                heading: {
                    opacity: '.7'
                },

                subheading: {
                    opacity: '.5'
                }
            },

            headers: [
                {
                    text: 'Sr No.',
                    value: 'srno',
                    align: 'center'
                },
                {
                    text: 'Product Name',
                    value: 'product_name',
                  //  align: 'center',
                
                },
                {
                    text: 'Delivery Address',
                    value: 'site_address',
                   // align: 'center',
                    width: '130px'
                },
                {
                    text: 'Quantity',
                    value: 'quantity',
                    align: 'center'
                },
                {
                    text: 'Rate',
                    value: 'avg_rate',
                    align: 'center'
                },
                {
                    text: 'Unit',
                    value: 'name',
                    align: 'center'
                },
                {
                    text: 'IGST',
                    value: 'igst',
                    align: 'center'
                },
                {
                    text: 'CGST',
                    value: 'cgst',
                    align: 'center'
                },
                {
                    text: 'SGST',
                    value: 'sgst',
                    align: 'center'
                },
                {
                    text: 'Amount',
                    value: 'amount',
                    align: 'center'
                }

            ],


            entity: {},
            
            state: {
                error: false
            },

            /* 
             form related
            */

           products: [],
           refProducts : [],
            endpoint: 'purchase-orders' ,

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
                url: 'purchase-orders',
                params: {
                    po_id : this.$route.params.id
                },
                withCredentials: true
            })

            if(r)
            {
                //alert(JSON.stringify(r.data))
                this.entity = Object.assign({},r.data.result[0])
                this.entity.products = JSON.parse(this.entity.products)

                if(!this.entity.products)
                    this.entity.products = []

                // dirty patch

        



            }
                

        }

        catch(e){

            if(e)
            {
                this.state.error = true
            }

        }

        let products = await axios.get('products',{
            withCredentials: true
        })
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

        generateGst(amount,igst,cgst,sgst){

            let totalGst = this.$Big(0)
            if(igst > 0)
                totalGst = totalGst.plus(igst)
            if(cgst > 0)
            {
                //alert('cgst '+cgst)
                totalGst = totalGst.plus(cgst)
            }
                
        
            if(sgst > 0)
                totalGst = totalGst.plus(sgst)

           // alert(igst+cgst+sgst)

           //alert(totalGst)

            //alert(totalGst)
            return totalGst.eq(0) ? amount : ((this.$Big(amount).times(totalGst)).div(100)).plus(this.$Big(amount))


        },
        print(){
            window.print()
        },

        productsToObj(input){

            let temp = {}
            Object.keys(input).forEach( (k,i,a) => {
                temp[Number(input[k].product_id)] = input[k]
            } )
            return temp

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

        dialogOpen(){
            this.dialog = true
            this.userMethod = this.methodsEnums.PATCH
        },
        dialogClose(){
            this.dialog = false
        },

        dialogSave (dialog) {
            
            let temp = _.cloneDeep(this.entity)
            temp.products = JSON.stringify(temp.products)
            
            if(temp.tac.freight_tax == undefined || temp.tac.freight_tax == '' || temp.tac.freight_tax == null)
            {
                delete temp.tac.freight_tax

            }

            temp.tac = JSON.stringify(temp.tac)
        

      // alert(JSON.stringify(temp))
        
           switch(this.userMethod)
           {
                case this.methodsEnums.POST :  
                       this.$refs.poRef.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                                dialog.functions.create(temp);
                            }  
                                
                        } );
                        break;
                case this.methodsEnums.PATCH :  
                       // alert('in Patch')
                        
                        this.$refs.poRef.$validator.validateAll().then( (r) => {
                            if(r)
                            {
                         //       alert('in r')
                                dialog.functions.update(temp);
                            }
                
                        } );
                        break;
                case this.methodsEnums.DELETE :  dialog.functions.remove( { po_id: this.entity.po_id } ); break;

        
           }
           
            
            //this.dialogClose()
        },

        postSuccess(){
        
            this.snackbar.message = `Successfully ${this.methodToString(this.userMethod)} a project`
            this.snackbar.state = true
            this.snackbar.visible = true

            ++this.dl_key
            this.dialogClose()

            this.reloadData()
        },


        postError(){

            this.snackbar.state = false
            this.snackbar.visible = true
            this.snackbar.message = 'Something Went Wrong. Try again later' 

        },

        async   reloadData(){

            let r = await axios({
                method: 'GET',
                url: 'purchase-orders',
                params: {
                    po_id : this.$route.params.id
                },
                withCredentials: true
            })

            if(r)
            {
                //alert(JSON.stringify(r.data))
                this.entity = Object.assign({},r.data.result[0])
                this.entity.products = JSON.parse(this.entity.products)

            }
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


    .noBorders{
        border: 0px solid #000 !important;
    }

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


       /* td > * {
            font-size: 6px !important;
        } */

        .v-data-table__wrapper{
            overflow: hidden !important;
        }


        * {
            line-height: 110% !important;
        }

    

        .toStretch{


            width: 100vw !important;
            height: 100vh !important;
            z-index: 10000 !important;
            position: absolute !important;
            left: 0px !important;
            top: 0px !important;
        }

        *,h1,h2,h3,h4,h5,h6,span {
            font-size: 14px !important;
        }
        
        tr > td , th > span, th, .text-start {
            font-size: 14px !important;
            padding: 0px 6px !important;
            
        }

        .main {
            border-radius: 0px !important;
            box-shadow: 0px 0px 0 0 !important; 
            -webkit-box-shadow: 0px 0px 0 0 !important; 

            align-items: flex-start !important;
        }

        .elevation-2{
             box-shadow: 0px 0px 0 0 rgba(0,0,0,0) !important; 
            -webkit-box-shadow: 0px 0px 0 0 rgba(0,0,0,0) !important; 
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


                

    
        html, body {
                width: 210mm !important;
                height: 297mm !important;
            }
       
         
        
        
    }
   




     /*  tbody > tr > td {
            padding: 0 14px !important;
        } */


</style>
