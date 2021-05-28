<template>
  <v-app>
    <v-main>
      <router-view />
      <c-footer></c-footer>
    </v-main>
  </v-app>
</template>

<script>
import CFooter from './components/CFooter/CFooter.vue'

export default {
  name: 'App',
  components: { CFooter },
  data: () => ({
    //
  })
}
</script>
