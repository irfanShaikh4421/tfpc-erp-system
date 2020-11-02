<template>
    <v-layout v-bind='$attrs' wrap>

        <v-flex xs12 sm6 >
            <v-text-field 
                v-model="form.subject" 
                label="Subject"
                v-validate="'required|min:3|max:128'"
                data-vv-name='subject'
                :error-messages="errors.collect('subject')"
            ></v-text-field>
        </v-flex>


        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.ref" 
                label="Ref"
                v-validate="'required|min:1|max:64'"
                data-vv-name='ref'
                :error-messages="errors.collect('ref')"
                hint='Must Be A Letters'
                persistent-hint
            ></v-text-field>
        </v-flex>

        


        <v-flex xs12 sm12>
             <v-autocomplete 
                autocomplete="off"
                label='Vendors'
                :loading='!extras.vendors.error && extras.vendors.loading ? extras.vendors.loading : false '
                :items='!extras.vendors.loading && !extras.vendors.error ? extras.vendors.data : []'
                v-validate="'required'"
                data-vv-name='vendor_name'
                :error-messages="errors.collect('vendor_name')"
                v-model='form.vendor_id'

                type='search'
                
            > </v-autocomplete>
        </v-flex>

        <v-flex xs12 mb-5>

            <!--<v-date-picker

                full-width
                landscape
                v-model="form.date"
                label="Date"
                v-validate="'required'"
                data-vv-name='date'
                :error-messages="errors.collect('date')"


            ></v-date-picker> -->

            <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
              
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
            >
                <template v-slot:activator="{ on }">
                <v-text-field
        
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    v-model="form.date"
                    label="Date"
                    v-validate="'required'"
                    data-vv-name='date'
                    :error-messages="errors.collect('date')"
                ></v-text-field>
                </template>
                <v-date-picker v-model="form.date" no-title scrollable @input='menu=false'>
        
                </v-date-picker>
            </v-menu>
        </v-flex>


        <!-- auto generated -->



        <v-flex xs12 style='border: 1px solid rgba(0,0,0,.1); border-radius: 12px' pa-3 my-5>
            
            <v-layout wrap>
                <v-flex xs12 md10 shrink> 
                    <h1 class='title'> Products </h1>
                </v-flex>
                <v-flex xs12 md2 shrink > 
                    <v-btn @click='newProduct' rounded color='red'> Add Product </v-btn>
                </v-flex>
            </v-layout>
            
            <transition-group name='fade' v-if='form.products.length > 0'>            
                <v-layout wrap style='rgba(0,0,0,.2); border-radius: 15px' 
                    
                    v-for='(item,index) in form.products' 
                    :key='index'
                    my-1 >


                        <v-flex xs12>
                            <v-layout>
                                
                                <v-flex xs6>
                                    <v-autocomplete 
                                    autocomplete="off"
                                    label='Products'
                                    
                                    :items='products? products : []'
                                    v-validate="'required'"
                                    :data-vv-name='"product_name_"+index'
                                    :error-messages='errors.collect("product_name_"+index)'
                                    v-model='form.products[index].product_id'

                                    type='search'
                                    
                                    > </v-autocomplete> 
                                </v-flex>

                                <!-- <v-flex xs6>
                                    <v-text-field 
                                        v-model="form.products[index].delivery_address" 
                                        label="Delivery Address"
                                        v-validate="'required|min:1|max:128'"
                                        :data-vv-name='"del_address_"+index'
                                        :error-messages='errors.collect("del_address_"+index)'
                                    ></v-text-field>
                                </v-flex>
                                -->
                                <v-flex xs6>
                                    <v-select 

                                        :loading='extras.projects.loading'
                                        :items='extras.projects.data'

                                        v-model='form.products[index].project_id'
                                        label="Project ID"
                                        v-validate="'required'"
                                        data-vv-name='project_id'
                                        :error-messages="errors.collect('project_id')"


                                    ></v-select>
                                </v-flex>

                                <v-flex shrink>
                                    <v-text-field 
                                        v-model="form.products[index].quantity" 
                                        label="Quantity"
                                        v-validate="'required|numeric|min:1'"
                                        :data-vv-name='"quantity_"+index'
                                        :error-messages='errors.collect("quantity_"+index)'
                                    ></v-text-field>
                                </v-flex>

                                <v-flex shrink>
                                    <v-text-field 
                                        v-model="form.products[index].avg_rate" 
                                        label="Rate"
                                        v-validate="'required|decimal|min:1'"
                                        :data-vv-name='"rate_"+index'
                                        :error-messages='errors.collect("rate_"+index)'
                                    ></v-text-field>
                                </v-flex>

                                <!--
                                <v-flex shrink style=''>
                                    <v-text-field 
                                        v-model="form.products[index].delivered" 
                                        label="Delivered"
                                        v-validate="'required|decimal|min:1'"
                                        :data-vv-name='"rate_"+index'
                                        :error-messages='errors.collect("rate_"+index)'
                                      
                                    ></v-text-field>
                                </v-flex>
                                -->


                                <!-- 
                                <v-flex shrink>
                                    <v-text-field 
                                        v-model="form.products[index].cgst" 
                                        label="CGST"
                                        v-validate="'required|decimal|min:1'"
                                        :data-vv-name='"cgst_"+index'
                                        :error-messages='errors.collect("cgst_"+index)'
                                    ></v-text-field>
                                </v-flex >


                                <v-flex shrink>
                                    <v-text-field 
                                        v-model="form.products[index].igst" 
                                        label="IGST"
                                        v-validate="'required|decimal|min:1'"
                                        :data-vv-name='"igst_"+index'
                                        :error-messages='errors.collect("igst_"+index)'
                                    ></v-text-field>
                                </v-flex>

                                <v-flex>
                                    <v-text-field 
                                        v-model="form.products[index].sgst" 
                                        label="SGST"
                                        v-validate="'required|decimal|min:1'"
                                        :data-vv-name='"sgst_"+index'
                                        :error-messages='errors.collect("sgst_"+index)'
                                    ></v-text-field>
                                </v-flex>

                                -->
                                
                                

                                <v-icon pa-2 my-2 @click='deleteItem(index)'> delete </v-icon>

                                

                        
                            </v-layout>
                        </v-flex>
                    
                

                        
                    
                </v-layout>
            </transition-group>

        </v-flex>
        

        <!-- tac -->


        

        <v-flex xs12>
            <h1 class='title'> Terms Of Service </h1>
            <v-text-field 
                v-model="form.tac.payment" 
                label="Payment"
                v-validate="'required|min:3|max:64'"
                data-vv-name='tac.payment'
                :error-messages="errors.collect('tac.payment')"
            ></v-text-field>
        </v-flex>
        <v-flex xs12>
            <v-text-field 
                v-model="form.tac.remarks" 
                label="Remarks"
                v-validate="'required|min:3|max:64'"
                data-vv-name='tac.remarks'
                :error-messages="errors.collect('tac.remarks')"
            ></v-text-field>
        </v-flex>

        <v-flex xs12>
            <v-select
                v-model="form.tac.tax_type" 
                label="Tax Type"
                v-validate="'required'"
                data-vv-name='tac.tax_type'
                :error-messages="errors.collect('tac.tax_type')"
                :items="enums.tac"
            ></v-select>
        </v-flex>

        <v-flex xs12>
            <v-text-field 
                v-model="form.tac.warranty" 
                label="Warranty"
                v-validate="'required|min:3|max:64'"
                data-vv-name='tac.warranty'
                :error-messages="errors.collect('tac.warranty')"
            ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.tac.delivery_period" 
                label="Delivery Period"
                v-validate="'required|numeric'"
                data-vv-name='tac.delivery_period'
                :error-messages="errors.collect('tac.delivery_period')"
            ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.tac.tax_price" 
                label="Tax Price"
                v-validate="'required|decimal'"
                data-vv-name='tac.tax_price'
                :error-messages="errors.collect('tac.tax_price')"
            ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6>
            <v-select
                v-model="form.tac.freight_tax" 
                :items="
                    ['inclusive',
                    'extra at actual']"
                label="Freight Tax"
                v-validate="''"
                data-vv-name='tac.freight_tax'
                :error-messages="errors.collect('tac.freight_tax')"
            ></v-select>
        </v-flex>

        
                                
    </v-layout>
</template>

<script>

import DataList from '@/components/data/DataList'
import DataModel from '@/components/data/DataModel'

import queryMixin from '@/components/mixins/query';
// import axios from 'axios';



export default {
    
    name: 'project-form',
    mixins: [],

    props: {
        form: {
            type: Object,
            required: true
        },
        products: {
            type: Array,
            required: true
        },
        refProducts: {
            type: Object,
            required: true
        }
    }, 

    components: {
        DataList
    },

        data(){
            return {
                
                menu: false,
                extras: {
                    vendors: {
                        data: [],
                        loading: true,
                        error: false,
                        loaded: false
                    },
                    projects: {
                        loading: true,
                        error: false,
                        data: []
                    },

                },

                enums: {
                    tac: [
                            {
                                text: 'all inclusive in price',
                                value: 'all inclusive in price'
                            },
                            {
                                text: 'gst extra as applicable',

                                value: 'gst extra as applicable'

                            },

                            {
                                text: 'gst as mentioned',
                                value: 'gst as mentioned'
                            }]
                },

               
            }
        },

        watch: {

            'form.date': {
                deep: true,
                handler: function(newVal){
                // this.form.date = $moment(newVal).format('yyyy,mm,dd')
                }
            }
        },
        mounted( ){
            
        
                this.$emit('init')

                //this.form.date2 = this.form.date

                this.$nextTick( () => {
                    //this.watchClientId()
                    //this.watchProjectId()
                } )

    
        },

        computed: {

        },
        async created(){

            


            /*this.setTimeout( () => {
                this.ready = true
            }, 1500)*/



            let vendors = await axios.get('vendors',{withCredentials: true})

            if(vendors)
            {
                this.extras.vendors.loading = false
                this.extras.vendors.error = false
                this.extras.vendors.data = this.generateItems(vendors.data.results,'vendor_id')

            }
            
            
            

            this.getProjects()
        
        },

        methods : {
            



            newProduct(){

                let tempObj = {
                    product_id: -1,
                    project_id: -1,
                    quantity: 0,
                    avg_rate: 0,
                    delivered: 0
                }
                

                this.form.products.push(tempObj)
            
            },

            deleteItem(i){
                this.form.products.splice(i,1)
            },

            formSubmit(){
                this.$validator.validateAll().then( (r) => {
                            // dialog.functions.create(this.editedItem);
                } );
            },

            validate(){
                return new Promise( (resolve,reject) => {
                    this.$validator.validateAll()
                    .then( (r) => {
                        resolve(this.form)
                    } )
                    .catch( (e) => {
                        reject(e)
                    } )
                } ) 
            },

            cloneData(r,to,primary_key){

                
                this.extras[to].data = this.generateItems(r.data.results,primary_key)
                this.extras[to].loading = true
            },

            cloneError(e){
                this.extras.clients.error = true
                this.extras.clients.loading = false
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

            async getProjects(){
                
                let projects = await axios({
                method: 'GET',
                withCredentials: true,
                url: 'projects',
                params: {
                    client_id : this.form.client_id
                    }
                })

                if(projects.data.results)
                {
                    this.extras.projects.data = this.generateItems(projects.data.results,'project_id')
                }
            }
        }

    }


</script>

<style>

.fade-enter-active, .fade-leave-active {
  transition: all .5s;

}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-50);
}
</style>
