<template>
  <div class="summary-content">
    <h2>Sélectionner les API à requêter</h2>
    <div class="summary-content__api-selector-container">
      <v-text-field
        class="summary-content__text-field"
        label="API to query"
        outlined
        dense
        background-color="white"
        :value="getDefaultApiHost"
        @change="updateAPI($event, 0)"
      />
      <v-text-field
        class="summary-content__text-field"
        label="API to query"
        outlined
        dense
        background-color="white"
        @change="updateAPI($event, 1)"
      />
    </div>
    <h2>Recherche dans Haystack</h2>
    <v-text-field
      class="summary-content__text-field"
      label="Filter API"
      outlined
      dense
      background-color="white"
      @change="updateFilter($event)"
    />
    <div v-if="isMultiApi">
      <c-multiple-entities-row
        v-for="row in entitiesGroupedById"
        :key="row.id"
        :id="row.id"
        :entities="row.entities"
        :his="getHistories(row.id)"
      ></c-multiple-entities-row>
    </div>
    <div v-else>
      <c-entity-row
        v-for="row in entities[0]"
        :key="row.id"
        :id="row.id"
        :dataEntity="row"
        :his="getHistory(row.id, 0)"
      />
    </div>
  </div>
</template>

<script>
// <c-entity-row v-for="row in entities[1]" :key="row.id" :id="row.id" :dataEntity="row" :his="getHistory(row.id)" />
import { formatService } from '../../services'
import CEntityRow from '../../components/CEntityRow/CEntityRow.vue'
import CMultipleEntitiesRow from '../../components/CMultipleEntitiesRow/CMultipleEntitiesRow.vue'

export default {
  name: 'VSummaryContent',
  components: { CEntityRow, CMultipleEntitiesRow },
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
      const apiHost = this.$store.getters.apiServers
      return apiHost[1] ? apiHost[1].haystackApiHost : ''
    },
    isMultiApi() {
      return this.$store.getters.isMultiApi
    },
    entitiesGroupedById() {
      // eslint-disable-next-line
      const entities = this.entities
      return this.groupByIdEntities(entities[0], entities[0])
    }
  },
  methods: {
    groupByIdEntities(entityFromFirstSource, entityFromSecondSource) {
      return formatService.groupById(entityFromFirstSource, entityFromSecondSource)
    },
    getHistory(idEntity, sourceNumber) {
      const formattedId = formatService.formatIdEntity(idEntity)
      if (!this.histories[sourceNumber][formattedId]) return null
      return this.histories[sourceNumber][formattedId]
    },
    getHistories(idEntity) {
      return [this.getHistory(idEntity, 0), this.getHistory(idEntity, 1)]
    },
    async updateFilter(newFilter) {
      await Promise.all([
        await this.$store.dispatch('fetchAllEntity', { entity: newFilter }),
        await this.$store.dispatch('fetchAllHistories', { idsEntity: this.idsWithHis })
      ])
    },
    updateAPI(haystackApiHost, apiNumber) {
      this.$store.dispatch('createApiServer', { haystackApiHost, apiNumber, isMultiApi: true })
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
  padding-top: 25px;
}
.summary-content__text-field {
  padding-top: 10px !important;
  width: 30%;
  .v-input--is-focused {
    background: white !important;
  }
}
</style>
