import Vue from 'vue'
import Router from 'vue-router'
// eslint-disable-next-line import/no-cycle
import VMainLayout from './views/VMainLayout/VMainLayout.vue'
import VSummaryContent from './views/VSummaryContent/VSummaryContent.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
router.beforeEach((to, from, next) => next())
export default router
