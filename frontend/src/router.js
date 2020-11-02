import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Clients from './views/clients.vue'
import Godowns from './views/godowns.vue'
import Jobcards from './views/jobcards.vue'

import Projects from './views/projects.vue'
import Project from './views/singleProject.vue'

import Products from './views/products.vue'
import Persons from './views/persons.vue'
import Inventories from './views/inventories.vue'
import Vendors from './views/vendors.vue'
import PurchaseOrder from './views/PurchaseOrder.vue'
import StockTransfer from './views/StockTransfer.vue'
import login from './views/login.vue'

import Users from './views/users.vue'

// singular

import Client from './views/client.vue'
import Jobcard from './views/jobcard.vue'
import Inventory from './views/inventory.vue'
import Po from './views/po.vue'



// breads eye view

import productWise from './views/overall/productWise'
import projectWise from './views/overall/projectWise'
import jobcardWise from './views/overall/jobcardWise'


import projectWiseDash from './views/projectWise'


Vue.use(Router);






export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/',
      name: 'login',
      component:  login
    },
    {
      path: '/clients',
      name: 'clients',

      component: Clients
    },
    {
      path: '/users',
      name: 'users',

      component: Users
    },
    {
      path: '/clients/:id',
      name: 'client',
      component: Client
    },
    {
      path: '/godowns',
      name: 'godown',
      component: Godowns
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/projectWiseDash',
      name: 'Project Wise Dash',
      component: projectWiseDash
    },
    {
      path: '/projects/:id',
      name: 'project',
      component: Project
    },
    {
      path: '/persons',
      name: 'persons',
      component: Persons
    },
    {
      path: '/Jobcards',
      name: 'jobcards',
      component: Jobcards
    },
    {
      path: '/jobcards/:id',
      name: 'jobcard',
      component: Jobcard
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/inventory',
      name: 'inventories',
      component: Inventories
    },
    {
      path: '/inventory/:id',
      name: 'inventory',
      component: Inventory
    },
    {
      path: '/vendors',
      name: 'vendors',
      component: Vendors
    },
    {
      path: '/purchase-orders',
      name: 'PurchaseOrder',
      component: PurchaseOrder
    },
    {
      path: '/purchase-orders/:id',
      name: 'po',
      component: Po
    },
    {
      path: '/stock-transfer',
      name: 'StockTransfer',
      component: StockTransfer
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },


    {
      path: '/projectWise/:id',
      name: 'projectWise',
      component: projectWise
    },
    {
      path: '/productWise',
      name: 'productWise',
      component: productWise
    },
    {
      path: '/jobcardWise',
      name: 'jobcardWise',
      component: jobcardWise
    }

  ],
});
