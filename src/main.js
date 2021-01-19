import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'

Vue.config.productionTip = false

async function mountApp() {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

mountApp()
