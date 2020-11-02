2<template>
    <v-layout wrap>

        <v-flex xs12  sm6 >
            <data-list endpoint="godowns" >
                <div slot-scope="{ data : clients , error : client_error, loading : client_loading }">
                    <v-select 
                        label='Sender Godown'
                        :error='client_error'
                        :error-messages='client_error ? client_error.statusText + ". Try Reloading the page" : ""'
                        :loading='!client_error && client_loading ? client_loading : "" '
                        :items='!client_loading && !client_error ? generateItems(clients.results,"client_id") : []'
                        v-validate="'required'"
                        data-vv-name='sender'
                        v-model='form.sender'
                        
                    > </v-select>

                </div>
            </data-list>
        </v-flex>

        <v-flex xs12  sm6 >
            <data-list endpoint="godowns" >
                <div slot-scope="{ data : clients , error : client_error, loading : client_loading }">
                    <v-select 
                        label='Receiver Godown'
                        :error='client_error'
                        :error-messages='client_error ? client_error.statusText + ". Try Reloading the page" : ""'
                        :loading='!client_error && client_loading ? client_loading : "" '
                        :items='!client_loading && !client_error ? generateItems(clients.results,"client_id") : []'
                        v-validate="'required'"
                        data-vv-name='receiver'
                        v-model='form.receiver'
                        
                    > </v-select>

                </div>
            </data-list>
        </v-flex>

        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.reason" 
                label="Reason"
                v-validate="'required|min:3|max:64'"
                data-vv-name='reason'
                :error-messages="errors.collect('reason')"
            ></v-text-field>
        </v-flex>


        
    </v-layout>

</template>

<script>

import DataList from '@/components/data/DataList'
const axios = require('axios')

export default {
    name: 'project-form',
    mixins: [],
    components: {
        DataList
    },

    props: {
        form: {
            type: Object,
            required: true
        }
    },

    // hooks

    async created(){
        let client = await axios.get(this.baseUrl+'clients',
                    {withCredentials: true})
    },
    mounted(){
        this.$emit('init')
    },

    data(){
        return {
            default: {
                name: '',
                client_id : -1,
                site_address : '',
                client_id : -1
            },

            extras: {
                clients: {
                    data: [],
                    loading: true,
                    error: false,
                    loaded: false
                }
            }
        }
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
        }
    }

    

    
}
</script>

<style>

</style>