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
      <v-text-field
        class="main-layout__text-field"
        label="API to query"
        outlined
        dense
        background-color="white"
        @change="updateAPI($event)"
      />
      <v-select
        class="main-layout__api-server-selection"
        :items="getApiServers"
        label="Unselect Api"
        hide-details
        single-line
        v-on:change="changeApiServers($event)"
      ></v-select>
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
    getApiServers() {
      return this.$store.getters.apiServers.map(apiServer => apiServer.haystackApiHost)
    }
  },
  methods: {
    isApiServerAlreadyExists(host) {
      return Boolean(this.$store.getters.apiServers.find(apiServer => apiServer.haystackApiHost === host))
    },
    async changeApiServers(haystackApiHost) {
      this.$store.commit('DELETE_HAYSTACK_API', { haystackApiHost })
      await this.$store.dispatch('reloadAllData', { entity: this.$store.getters.filterApi })
    },
    async updateAPI(haystackApiHost) {
      if (!this.isApiServerAlreadyExists(haystackApiHost)) {
        this.$store.dispatch('createApiServer', { haystackApiHost })
        await this.$store.dispatch('reloadAllData', { entity: this.$store.getters.filterApi })
      }
    }
  }
}
</script>

<style lang="scss">
.main-layout {
  background-color: #f2f2f2;
}
.main-layout__api-server-selection {
  padding-left: 5px;
  width: 100px;
}
.main-layout__title {
  color: black;
}
.main-layout__bar {
  background-color: white;
}
.main-layout__text-field {
  margin-top: 23px !important;
  padding: 0 20px !important;
  width: 1%;
  .v-input--is-focused {
    background: white;
  }
}
.v-toolbar__content {
  background-color: white;
}
</style>
