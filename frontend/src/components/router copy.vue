<template>

    <v-layout wrap>

        <v-flex xs12 class='hidden-md-and-up'>
            <v-toolbar>
                <v-spacer> </v-spacer>
                <v-app-bar-nav-icon @click='drawer = true'></v-app-bar-nav-icon>
            </v-toolbar>
        </v-flex>

    <v-flex xs12> 
    <v-navigation-drawer 
        class='px-5 navbar '
        
        :expand-on-hover='$vuetify.breakpoint.mdAndUp'
        
        :temporary='$vuetify.breakpoint.mdAndDown'
      
        v-model='drawer'
        
        >

        <v-layout row   align-center justify-center>

            <v-flex align-self-start  shrink >
                <v-img src='logo.png' contain  aspect-ratio=3 min-width=260> </v-img>
            </v-flex>

            <v-flex pa-1 align-self-center>
                <v-list rounded>
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

    watch: {
        '$vuetify.breakpoint.mdAndUp': function(val){
                if(val)
                    this.drawer = true
            }
    },

    data(){
        return {
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
                        {
                            name: 'Godown',
                            icon: 'store',
                            route: '/godowns'
                        },
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
    }
}
</script>

<style>

</style>

