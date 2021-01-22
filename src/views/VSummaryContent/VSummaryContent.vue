<template>
  <div class="summary-content">
    <h2>Sélectionner les API à requêter</h2>
    <div class="summary-content__api-selector-container">
      <v-text-field
        class="summary-content__text-field"
        label="API to query"
        outlined
        dense
        :value="getDefaultApiHost"
        @change="updateAPI($event, 0)"
      />
      <v-text-field
        class="summary-content__text-field"
        label="API to query"
        outlined
        dense
        @change="updateAPI($event, 1)"
      />
    </div>
    <h2>Recherche dans Haystack</h2>
    <v-text-field
      class="summary-content__text-field"
      label="Filter API"
      outlined
      dense
      @change="updateFilter($event)"
    />
    <h2>Result API 1</h2>
    <c-entity-row v-for="row in entities[0]" :key="row.id" :id="row.id" :dataEntity="row" :his="getHistory(row.id)" />
    <h2>Result API 2</h2>
    <c-entity-row v-for="row in entities[1]" :key="row.id" :id="row.id" :dataEntity="row" :his="getHistory(row.id)" />
  </div>
</template>

<script>
import { formatService } from '../../services'
import CEntityRow from '../../components/CEntityRow/CEntityRow.vue'

export default {
  name: 'VSummaryContent',
  components: { CEntityRow },
  data() {
    return {
      track: {
        filterApi: ''
      }
    }
  },
  computed: {
    entities() {
      return this.$store.getters.entities
    },
    idsWithHis() {
      return this.entities[0].filter(entity => entity.his).map(entity => formatService.formatIdEntity(entity.id))
    },
    histories() {
      return this.$store.getters.histories
    },
    getDefaultApiHost() {
      return this.$store.getters.apiServers[0].haystackApiHost
    },
    getSecondApiHost() {
      return this.$store.getters.apiServers[1] ? this.$store.getters.apiServers[1].haystackApiHost : ''
    }
  },
  methods: {
    getHistory(idEntity) {
      const formattedId = formatService.formatIdEntity(idEntity)
      if (!this.histories[0][formattedId]) return null
      return this.histories[0][formattedId]
    },
    async updateFilter(newFilter) {
      await Promise.all([
        await this.$store.dispatch('fetchAllEntity', { entity: newFilter }),
        await this.$store.dispatch('fetchAllHistories', { idsEntity: this.idsWithHis })
      ])
    },
    updateAPI(haystackApiHost, apiNumber) {
      this.$store.dispatch('createApiServer', { haystackApiHost, apiNumber })
    }
  },
  async beforeMount() {
    await this.$store.dispatch('fetchAllEntity', { entity: '' })
    await this.$store.dispatch('fetchAllHistories', { idsEntity: this.idsWithHis })
  }
}
</script>

<style lang="scss">
.summary-content {
  margin-top: 20px;
}
.summary-content__text-field {
  padding-top: 10px !important;
  width: 30%;
}
</style>
