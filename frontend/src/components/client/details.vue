<template>
    <v-layout stsyle='background: rgba(0,0,0,.1); border-radius: 25px' my-2 row wrap justify-left align-center>

        <v-flex xs12 >
            <v-icon size='128'> supervised_user_circle </v-icon>
        </v-flex>

        <v-flex xs12 lg12 my-1 >
            <v-layout align-center wrap>
                    <v-flex xs12   style='opacity: .5'>
                        <h1 class='body-2'> NAME   </h1>
                    </v-flex >
                    <v-flex xs12 >
                        <h1 class='body-2'>
                            {{form.name}}
                        </h1>
                    </v-flex>
            </v-layout>
        </v-flex>

        <v-flex xs12 lg12 my-1>
            <v-layout align-center wrap>
                    <v-flex xs12  style='opacity: .5'>
                        <h1 class='body-2'> STATE   </h1>
                    </v-flex >
                    <v-flex xs12  >
                        <h1 class='body-2'>
                            {{form.state}}
                        </h1>
                    </v-flex>
            </v-layout>
        </v-flex>
        
        <v-flex xs12 lg12 my-1>
            <v-layout align-center wrap>
                    <v-flex xs12 style='opacity: .5'>
                        <h1 class='body-2'> ADDRESS   </h1>
                    </v-flex >
                    <v-flex xs12  >
                        <h1 class='body-2'>
                            {{form.address}}
                        </h1>
                    </v-flex>
            </v-layout>
        </v-flex>

        <v-flex xs12 lg12 my-1>
            <v-layout align-center wrap>
                    <v-flex xs12 style='opacity: .5'>
                        <h1 class='body-2'> GST NO.   </h1>
                    </v-flex >
                    <v-flex xs12 >
                        <h1 class='body-2'>
                            {{form.gst_no}}
                        </h1>
                    </v-flex>
            </v-layout>
        </v-flex>
        <v-flex xs12 lg12 my-1>
            <v-layout align-center wrap>
                    <v-flex xs12  style='opacity: .5'>
                        <h1 class='body-2'> PROJECT TYPE   </h1>
                    </v-flex >
                    <v-flex xs12  >
                        <h1 class='body-2'>
                            {{form.project_type}}
                        </h1>
                    </v-flex>
            </v-layout>
        </v-flex>
        
       <!-- <v-flex shrink   mt-5>
            <v-btn
            text 

          
            >
            <v-layout justify-space-around align-center>
                <v-flex shrink>
                     edit 
                </v-flex>
            </v-layout>
        </v-btn>
       </v-flex>

       -->

    </v-layout>
</template>

<script>
export default {
    props: {
        entity: {
            type: Object,
            required: true
        }
    },

    data(){
        return {
            form : this.entity || this.default,

            default : {
                name : '',
                state: '',
                address: '',
                gst_no : '',
                project_type: ''
            }

        }
    },



    mounted(){


    }
}
</script>

<style>

</style>
