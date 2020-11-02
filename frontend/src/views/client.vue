<template>
    <data-list endpoint='clients' :entity='{"client_id": $route.params.id}'

    @success='test'
    

    >
        <div slot-scope="{ data : client , error : client_error, loading : client_loading }">
        
            <v-layout pa-5 row fill-height class='white elevation-2' style='border-radius: 20px;'  
                :justify-center='client_loading'
                wrap

            >   
                    <template >
                        

                        <template v-if='!client_loading'>
        
                            <template v-if=' !client_error && client.result.length > 0'>

                                <v-flex xs12 lg3 class='white elevastion-2' style='border-radius: 25px; ' py-5 px-3 > 
                                    <h1 class='display-1' style='opacity: .6;'> {{firstCharUpperCase($route.name)}} </h1>
                                    <client-details class='pa-5' :entity='client.result[0]'>    </client-details>
                                </v-flex>


                                <!-- right side panel -->

                                <v-flex xs12 lg9 py-5> 
                                    <div class='elevation-2' style='border-radius: 20px;' >
                                        <v-tabs 
                                            active-class='tab-active'

                                            class='elevation-0 myTabs'
                                            style='border-radius: 20px 20px 0 0; 
                                            background: #F5EAEA'
                                            
                                            v-model='tab'
                                        >
                                            
                                            <v-tab> Projects </v-tab>
                                            <v-tab> Persons </v-tab>
                                            <v-tab> Job Cards </v-tab>
                                        </v-tabs>


                                        <v-tabs-items
                                            v-model='tab'
                                            class='tab-item py-2'
                                            style='height: 100%;'
                                            
                                        >
                                            <!-- products -->
                                            <v-tab-item> 
                                                <client-projects
                                                    :entity='{"client_id": client.result[0].client_id}'
                                                > </client-projects>
                                            </v-tab-item>

                                            <v-tab-item>

                                                <client-persons
                                                    :entity='{"client_id": client.result[0].client_id}'
                                                >

                                                </client-persons>

                                            </v-tab-item>

                                          

                                            <!-- Job cards -->
                                            <v-tab-item>
                                                <client-jobcards 
                                                    :entity='{"client_id": client.result[0].client_id}'

                                                > </client-jobcards>
                                            </v-tab-item>                        
                                        </v-tabs-items>
                                    </div>
                                </v-flex>
                                
                            </template>


                            <!-- NOT FOUND -->
                            <not-found name='client'  v-else>
                            </not-found>

                        </template>

                        <!-- loader -->

                        <template v-else>
                            <v-flex shrink  align-self-center>
                                <v-progress-circular
                                    :size="70"
                                    :width="7"
                                    color="red"
                                    indeterminate
                                ></v-progress-circular>
                            </v-flex>
                        </template>

                    </template>

                
            </v-layout>
        </div>
    </data-list>
    
</template>

<script>

import utilities from '@/components/mixins/utilities.js'
// import axios from 'axios'

import DataList from '@/components/data/DataList'
import DataModel from '@/components/data/DataModel'


// helpers

import notFound from '@/components/notFound'

//child

import clientDetails from '@/components/client/details'
import clientJobcards from '@/components/client/jobcards'
import clientProjects from '@/components/client/projects'
import clientPersons from '@/components/client/persons'



export default {
    extends: utilities,
    components: {
        clientDetails,
        DataList,
        DataModel,
        clientProjects,
        clientJobcards,
        clientPersons,
        notFound
    },

    data(){
        return {
            tab: null,
            state: true,

            local: {
                client_id: 0,
                person_id: 0,
                project_id: 0
            }

        }
    },

    methods:{
        test(){
            
        }
    },

    mounted(){
        
    }

}
</script>

<style>

.tab-item{
    background: #FBFBFF !important;
    border-radius: 0 0px 20px 20px;

}

.v-tabs-slider-wrapper{
    z-index: 1000;
    transform: scalex(.8);
}
.tab-active{
    background: #FBFBFF;
    color: black !important; 
    border-radius: 20px 20px 0 0;
}


#tabshape{
    height: 16px;
    width: 16px;
    z-index: 1000;
}

.myTabs > div{
    background: none !important;
}

</style>
