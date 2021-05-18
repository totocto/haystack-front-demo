import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// Vue.use(MyCustomPlugin)
async function mountApp() {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
}

mountApp()
