import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

//import Vuetify from 'vuetify/lib'
//import vuetify from './plugins/vuetify';
//Vue.use(Vuetify)

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

import dayjs from 'dayjs'

Vue.prototype.$dayjs = dayjs


import Big from 'big.js';
Vue.prototype.$Big = Big
 



//import VDateTimePicker from 'vuetify2.x-datetime-picker'
//Vue.use(VDateTimePicker)


import axios from 'axios'
window.axios = axios

axios.defaults.withCredentials = true

/*

axios.defaults.baseURL = 'http://localhost/api/v1/'

Vue.prototype.$config = {
  baseUrl : 'http://localhost/api/v1/'
}

*/



axios.defaults.baseURL = 'http://34.83.223.211/api/v1/'

Vue.prototype.$config = {
  baseUrl : 'http://34.83.223.211/api/v1/'
}






/*import VueCurrencyFilter from 'vue-currency-filter'



Vue.use(VueCurrencyFilter,
  {
    symbol : '₹',
    thousandsSeparator: ',',
    fractionCount: 0,
    fractionSeparator: '.',
    symbolPosition: 'front',
    symbolSpacing: true
  })*/


import Vue2Filters from 'vue2-filters'

import vuetify from './plugins/vuetify';
//import 'roboto-fontface/css/roboto/roboto-fontface.css'

Vue.use(Vue2Filters)


Vue.config.productionTip = false;


Vue.filter('formatDate', function (value) {
  if (!value) return ''
  return dayjs(value).format('DD/MM/YYYY')
})

router.beforeEach( (to,from,next) => {
 /* let path = (to.path.slice(1).split('/'))[0]

  if(path != 'login')
  {
    if(!localStorage.email)
    {
      next('/login')
      return;
    }
  }

 */
  next()
} )

router.beforeResolve((to,from,next) => {
  /*
  let path = (to.path.slice(1).split('/'))[0]

  if(localStorage.roles)
  {
    let roles = JSON.parse(localStorage.roles)
    
    checkAuth(roles,path) ? next() : next('/')
  }
  

*/


  next()
} )


function checkAuth( roles, against )
{
  let keys = Object.keys(roles)
  if(keys.includes(against) && roles[against].includes('get')  )
  {
    return true
    
  }
  else
    return false
}

let filters = {
  client(val){
    return `CLIENT-${val}`
  },
  project(val){
    return `PROJ-${val}`
  },
  person(val){
    return `PRSN-${val}`
  },
  jobcard(val){
    return `JC-${val}`
  },
  product(val){
    return `PRDCT-${val}`
  },
  inventory(val){
    return `INV-${val}`
  },
  vendor(val){
    return `VDR-${val}`
  },
  po(val){
    return `PO-${val}`
  },
  stock(val){
    return `STK-${val}`
  },
  user(val){
    return `USER-${val}`
  },

  percentage(val){
    return `${val} %`
  }

}

Object.keys(filters).forEach( (k,i) => {
  if(filters[k])
  {
    Vue.filter(k,filters[k])
  }
} )

const $login = { isLoggedIn: false }

new Vue({
  router,
  store,

  //vuetify,
  data: {
      $loggedIn : false
  },

  vuetify,
  render: h => h(App)
}).$mount('#app');
