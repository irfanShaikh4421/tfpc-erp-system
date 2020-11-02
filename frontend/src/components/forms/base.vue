<template>
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
                <v-flex shrink>
                    <v-btn medium  dark 
                        color='black'
                        class='hover-btn mb-2'
                        style='background-image: linear-gradient(to right, #e53935 0%, #e35d5b 51%, #e53935 100%)'
                    rounded @click.stop='++dialog_key; dialog = true; userMethod=methodsEnums.POST' >New Item</v-btn>
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

                        <slot> </slot>

                        <form-jobcard ref='form_child' @init='child_loaded = true'> </form-jobcard>

                        
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
                    <div slot-scope="{ remove, data: post_res, loading : post_loading, create, update, error, }">
                        <v-btn color="blue darken-1" text @click="dialogClose">Cancel</v-btn>
                        <v-btn color="blue darken-1" :loading='post_loading' text @click='dialogSave({functions: {create, remove, update}})'> {{methodToStringPresent(userMethod)}} </v-btn>
                    </div>
                </data-model>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>

import utilities from '@/components/mixins/utilities.js'
import DataModel from '@/components/data/DataModel'

const methodsEnums = {
    GET : 0,
    POST : 1,
    PATCH : 2,
    DELETE : 3
}

Object.freeze(methodsEnums)


export default {
    extends: utilities,

    components: {
        DataModel
    },

    props: {
        userMethod : {
            require: true,
            type: 'number'
        }
    },

    methods: {
        postSuccess(){

        },
        postError(){

        }
    }

}
</script>

<style>

</style>