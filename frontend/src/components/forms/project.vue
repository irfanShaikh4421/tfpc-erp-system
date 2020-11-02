<template>
    <v-layout v-bind='options'>
        
        <v-flex>
            
        </v-flex>

    </v-layout>
</template>

<script>

export default {
    
    name: 'project-form',

    props: {
        options: {
            type: 'object'
        }
    }

    data(){
        return {
            
            form : {
                client_id : 0,
                project_id : 0,
                location : '',
                revision : 0,
                date : null,
                site_supervisor : '',
                autocad_engineer : '',
                plan_approved_by : '',
                labour_contractor : '',
                

                person_id : 0,
                products_headings: []

            },

            default: {
                client_id : 0,
                project_id : 0,
                location : '',
                revision : 0,
                date : null,
                site_supervisor : '',
                autocad_engineer : '',
                plan_approved_by : '',
                labour_contractor : '',
                

                person_id : 0,
                products_headings: []
            }
        }
    }

}
</script>

<style>

</style>
