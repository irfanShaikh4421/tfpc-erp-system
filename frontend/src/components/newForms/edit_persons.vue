<template>
    <v-layout wrap>
        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.name" 
                label="Name"
                v-validate="'required|min:3|max:64'"
                data-vv-name='name'
                :error-messages="errors.collect('name')"
            ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
            <v-text-field 
                v-model="form.email" 
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
                v-model="form.number" 
                label="Number"
                v-validate="'required|numeric'"
                data-vv-name='number'
                :error-messages="errors.collect('number')"
            ></v-text-field>
        </v-flex>

        <v-flex xs12>
            <v-text-field 
                v-model="form.designation" 
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

            
                v-model="form.client_id" 
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

            
                v-model="form.project_id" 
                label="Project ID"
                v-validate="'required'"
                data-vv-name='project_id'
                :error-messages="errors.collect('project_id')"


            ></v-select>
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

    async mounted(){
        let client = await axios.get(this.$config.baseUrl+'clients',
                    {params:{}})

        if(client.data.results)
        {
            this.extras.clients.data = this.generateItems(client.data.results,'client_id')
        }

        let projects = await axios({
            method: 'GET',
            baseURL: this.$config.baseUrl,
            url: 'projects',
            params: {
                client_id : this.form.client_id
            }
        })

        if(projects.data.results)
        {
            this.extras.projects.data = this.generateItems(projects.data.results,'project_id')
        }
        this.$emit('init')
    },
    

    data(){
        return {
            default: {
                name: '',
                client_id : -1,
                email : '',
                designation: '',
                person_id : -1
            },

            extras: {
                clients: {
                    loading: true,
                    error: false,
                    data: []
                },
                projects: {
                    loading: true,
                    error: false,
                    data: []
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
        },


        async getProjects(){
            let projects = await axios({
            method: 'GET',
            baseURL: this.$config.baseUrl,
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

</style>