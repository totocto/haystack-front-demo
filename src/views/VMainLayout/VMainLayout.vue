<template>
  <div class="main-layout">
    <v-app-bar app>
      <div class="d-flex align-center main-layout__bar">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require('../../assets/engieLogo.png')"
          transition="scale-transition"
          width="90"
        />
        <h2 class="main-layout__title">Haystack Démo</h2>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <main>
      <router-view class="router-view" />
    </main>
  </div>
</template>

<script>
export default {
  name: 'VMainLayout',
  computed: {
    haystackInformation() {
      return this.$store.getters.haystackInformation
    }
  },
  async beforeMount() {
    await this.$store.dispatch('init')
  }
}
</script>

<style lang="scss">
.main-layout__title {
  color: black;
}
.main-layout__bar {
  background-color: white;
}
.v-toolbar__content {
  background-color: white;
}
</style>
