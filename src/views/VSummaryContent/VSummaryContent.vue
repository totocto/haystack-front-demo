<template>
  <div class="summary-content">
    <div class="summary-content__api-selector-container">
      <c-graph
        v-if="isDataLoaded"
        @pointClicked="onGraphClick"
        :dataEntities="getRelationGraphEntity(entities)"
        id="test"
        title="Relation entre les entités"
      ></c-graph>
    </div>
    <h2>Recherche dans Haystack</h2>
    <v-text-field
      class="summary-content__text-field"
      label="Filter API"
      outlined
      v-model="filterApi"
      dense
      background-color="white"
      @change="updateFilter($event)"
    />
    <div v-if="isDataLoaded">
      <c-entity-row
        v-for="row in entitiesGroupedById"
        :ref="getEntityName(row.id)"
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
import CGraph from '../../components/CGraph/CGraph.vue'

export default {
  name: 'VSummaryContent',
  components: { CEntityRow, CGraph },
  computed: {
    filterApi() {
      return this.$store.getters.filterApi
    },
    isDataLoaded() {
      return this.$store.getters.isDataLoaded
    },
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
      if (this.entities.length === 1) return this.entities[0]
      return this.groupByIdEntities(this.entities)
    }
  },
  methods: {
    isPointOutFromSource(pointName, colorEntities) {
      return colorEntities.find(entityColor => entityColor.id === pointName)
    },
    async onGraphClick(pointName) {
      const linkBetweenEntities = this.getRelationGraphEntity(this.entities)
      const colorEntities = linkBetweenEntities[1]
      const entityNameToEntityId = linkBetweenEntities[2]
      if (this.isPointOutFromSource(pointName, colorEntities)) {
        const newApiFilter = `id==@${entityNameToEntityId[pointName]}`
        await this.$store.dispatch('reloadAllData', {
          entity: newApiFilter
        })
        this.$store.commit('SET_FILTER_API', { filterApi: newApiFilter })
      } else {
        this.$refs[pointName][0].$el.scrollIntoView()
        window.scrollBy(0, -90)
      }
    },
    getEntityName(idEntity) {
      return formatService.formatEntityName(idEntity)
    },
    groupByIdEntities(entities) {
      return formatService.groupAllEntitiesById(entities)
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
      if (newFilter !== this.$store.getters.filterApi) {
        this.$store.commit('SET_FILTER_API', { filterApi: newFilter })
        await this.$store.dispatch('reloadAllData', { entity: newFilter })
      }
    },
    getRelationGraphEntity(entities) {
      return formatService.getLinkBetweenEntities(entities)
    }
  },
  async beforeMount() {
    await this.$store.dispatch('reloadAllData', { entity: '' })
  }
}
</script>

<style lang="scss">
.summary-content {
  padding-top: 25px;
}
.summary-content__entity-row {
  background-color: white;
}
.summary-content__text-field {
  margin-top: 10px !important;
  width: 30%;
  .v-input--is-focused {
    background: white;
  }
}
</style>
