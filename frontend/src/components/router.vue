<template>

    <v-layout wrap  fluid column >

        <v-flex xs12 class='hidden-lg-and-up'>
            <v-toolbar style=''>
                <v-spacer> </v-spacer>
                <v-app-bar-nav-icon @click='drawer = true'></v-app-bar-nav-icon>
            </v-toolbar>
        </v-flex>

    <v-flex  >
        <!--    :expand-on-hover='$vuetify.breakpoint.mdAndUp'          -->

            <v-navigation-drawer 
                v-resize='onResize'
                style='position: fixed;  top: 0px; left: 0px; max-height: 100vh'
                class='px-5 navbar '
                fixed
               
                
                :temporary='$vuetify.breakpoint.mdAndDown ? true : false'
                mobile-break-point='md-and-down'
                v-model='drawer'
                absolute

        
                
                >

                <v-layout :style='dynamicHeight' wrap row  align-center justify-center>

                    <v-flex align-self-start  shrink >
                        <v-layout wrap row justify-center >
                            <v-img src='/logo.png' contain  aspect-ratio=3 min-width=240> </v-img>
                            <v-flex xs6 pl-3 v-if='isLoggedIn() == true'
                               
                            > 
                                <h1 class='subtitle-1'> Hello {{$root.$data.$name}} </h1>
                                <v-btn small @click='logout' rounded > Log Out </v-btn>
                            </v-flex>
                            <v-flex xs6 pl-3 v-else
                               
                            > 
                                
                                <v-btn small @click="$router.push('/')" rounded > Log in </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                 

                    <v-flex pa-1 align-self-start class='content'
                            :style='dynamicStyle'>
                        <v-list rounded dense>
                            <template v-for='(item,index) in items'>
                            
                                <v-list-group
                                    v-if='item.group'
                                    :prepend-icon="item.icon"
                                    :key='index'
                                    class=''
                                    no-action
                                >

                                    <template v-slot:activator>
                                        <v-list-item-subtitle>{{item.name}}</v-list-item-subtitle>
                                    </template>


                                    <v-list-item
                                        v-for="(subitem, subindex) in item.group"
                                        :key="subindex"
                                        
                                        :to='subitem.route'
                                        link
                                        
                                    >
                                        <v-list-item-icon>
                                                <v-icon > {{subitem.icon}}</v-icon> 
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-subtitle >{{subitem.name}}</v-list-item-subtitle>
                                        </v-list-item-content>
                                        
                                    </v-list-item>

                                </v-list-group>

                                <template v-else>
                                    <v-list-item
                                        
                                        :to='item.route'

                                    >
                                        <v-list-item-icon> <v-icon > {{item.icon}}</v-icon> </v-list-item-icon>
                                        <v-list-item-subtitle> {{item.name}} </v-list-item-subtitle>
                                    </v-list-item>
                                    
                                        <!-- <v-list-item-subtitle> Subtitle </v-list-item-subtitle> -->
                                    
                                </template>
                            

                            </template>
                        </v-list>
                    </v-flex>
                </v-layout>
            </v-navigation-drawer>



    </v-flex>
    </v-layout>
</template>

<script>
export default {

    data(){
        return {
            mini: true,
            drawer: true,
            items: [
                {
                    name: 'Dashboard',
                    icon: 'account_circle',
                    
                    group: [
                        {
                            name: 'Product Wise',
                            icon: 'list',
                            route: '/productWise'
                        },
                        {
                            name: 'Project Wise',
                            icon: 'list',
                            route: '/projectWiseDash'
                        },
                        {
                            name: 'Users',
                            icon: 'account_circle',
                            route: '/users'
                        }
                    ]
                },

                {
                    name: 'Clients',
                    icon: 'account_circle',
                    
                    group: [
                        {
                            name: 'Clients List',
                            icon: 'account_circle',
                            route: '/clients'
                        },
                        /*{
                            name: 'Godown',
                            icon: 'store',
                            route: '/godowns'
                        }, */
                        {
                            name: 'Projects',
                            route: '/projects',
                            icon: 'assignment_ind'
                        },
                        {
                            name: 'Persons',
                            route: '/persons',
                            icon: 'account_circle'
                        },
                        {
                            name: 'Job Card',
                            route: '/jobcards',
                            icon: 'assignment'
                        }
                    ]
                },
                {
                    name: 'Products',
                    icon: 'layers',
                    group: [
                        {
                            name: 'List',
                            route: '/products',
                            icon: 'list',
                            
                        },
                        {
                            name: 'Inventory',
                            route: '/inventory',
                            icon: 'storage'
                        },
                        {
                            name: 'Vendor',
                            route: '/vendors',
                            icon: 'people'
                        }
                    ]
                },
                {
                    name: 'Purchase Order',
                    route: '/purchase-orders',
                    icon: 'library_books',
                },
                {
                    name: 'Stock Transfer',
                    route: '/stock-transfer',
                    icon: 'swap_horiz',
                }
            ]
        }
    },

    computed:{

        dynamicStyle(){
            if(this.$root.$data.$loggedIn)
            {
                return { filter: '', pointerEvents: 'auto', transform: 'scale(1)'}
            }
            else
                return {
                    filter: 'blur(6px)',
                    pointerEvents: 'none',
                    transform: 'scale(.9)'
                }
        },
        dynamicHeight(){
            if(this.$vuetify.breakpoint.mdAndUp)
                return { height: '100%' }
            else    
                return {}
        }

    },

    methods: {

        onResize(){
            if(this.$vuetify.breakpoint.lgAndUp)
            {
                this.drawer = true
            }
        },
        isLoggedIn(){
            
            return this.$root.$data.$loggedIn
        },
        logout(){
            axios({
                baseURL : this.$config.baseUrl,
                url: '/logout',
                method: 'GET'
            })
            .then( (r) => {
                if(r)
                {
                    this.$router.push('/')
                    this.$root.$data.$loggedIn = false
                }
            } )
        }
    }
}
</script>

<style>

    .content{
        transition: all linear .5s;
    }

</style>

