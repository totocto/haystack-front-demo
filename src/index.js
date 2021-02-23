import VMainLayout from './views/VMainLayout/VMainLayout.js'
console.log('HEY YOU')
console.log('HEY YOU')
const App = {
  el: 'main',
  components: {
    'app-layout': VMainLayout,
  }
}
const router = new VueRouter({
  routes: [
    {
      path: '',
      component: VMainLayout,
      children: [
        {
          path: '/',
          name: 'summary',
          component: VSummaryContent
        }
      ]
    }
  ]
})
console.log('HEY YOU')
window.addEventListener('load', () => {
  new Vue(App, router)
})