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
    <div v-if="isDataLoaded">
      <c-entity-row
        v-for="row in entitiesGroupedById"
        :key="row.id"
        :id="row.id"
        :dataEntity="row"
        :his="getHistories(row.id)"
        :isDataLoaded="isDataLoaded"
        class="summary-content__entity-row"
      />
    </div>
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
      isDataLoaded: false,
      filterApi: ''
    }
  },
  computed: {
    entities() {
      return this.$store.getters.entities
    },
    idsWithHis() {
      return this.entitiesGroupedById
        .filter(entity => entity.his)
        .map(entity => {
          return formatService.formatIdEntity(entity.id)
        })
    },
    histories() {
      return this.$store.getters.histories
    },
    getDefaultApiHost() {
      return this.$store.getters.apiServers[0].haystackApiHost
    },
    entitiesGroupedById() {
      // eslint-disable-next-line
      const { entities } = this.$store.getters
      if (this.entities.length === 1) return entities[0]
      return this.groupByIdEntities(entities)
      // return this.groupByIdEntities(entities[0], entities[1])
    }
  },
  methods: {
    groupByIdEntities(entityFromFirstSource, entityFromSecondSource) {
      return formatService.groupAllEntitiesById(entityFromFirstSource, entityFromSecondSource)
    },
    getHistory(idEntity, sourceNumber) {
      const formattedId = formatService.formatIdEntity(idEntity)
      if (!this.histories[sourceNumber][formattedId]) return null
      return this.histories[sourceNumber][formattedId]
    },
    getHistories(idEntity) {
      if (this.histories.length === 1) return [this.getHistory(idEntity, 0)]
      // eslint-disable-next-line
      return this.histories.map((history, index) => this.getHistory(idEntity, index))
    },
    async updateFilter(newFilter) {
      this.filterApi = newFilter
      await Promise.all([
        await this.$store.dispatch('fetchAllEntity', { entity: newFilter }),
        await this.$store.dispatch('fetchAllHistories', { idsEntity: this.idsWithHis })
      ])
    },
    async updateAPI(haystackApiHost, apiNumber) {
      this.isDataLoaded = false
      this.$store.dispatch('createApiServer', { haystackApiHost, apiNumber })
      await Promise.all([
        await this.$store.dispatch('fetchAllEntity', { entity: this.filterApi }),
        await this.$store.dispatch('fetchAllHistories', { idsEntity: this.idsWithHis })
      ])
      this.isDataLoaded = true
    }
  },
  async beforeMount() {
    await this.$store.dispatch('fetchAllEntity', { entity: '' })
    await this.$store.dispatch('fetchAllHistories', { idsEntity: this.idsWithHis })
    this.isDataLoaded = true
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
    background: white;
  }
}
.summary-content__entity-row {
  background-color: white;
}
</style>
