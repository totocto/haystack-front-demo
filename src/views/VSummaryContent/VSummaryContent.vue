<template>
  <div class="summary-content">
    <h2>Informations</h2>
    <v-text-field
      class="summary-content__text-field"
      label="Filter API"
      outlined
      dense
      :value="track.api"
      @change="updateFilter($event)"
    />
    <c-entity-row v-for="row in entities" :key="row.id" :id="row.id" :dataEntity="row" :his="getHistory(row.id)">
    </c-entity-row>
  </div>
</template>

<script>
import { formatService } from '@/services'
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
      return this.entities.filter(entity => entity.his).map(entity => formatService.formatIdEntity(entity.id))
    },
    idHistories() {
      return this.$store.getters.histories
    }
  },
  methods: {
    getHistory(idEntity) {
      const formattedId = formatService.formatIdEntity(idEntity)
      if (!this.idHistories[formattedId]) return null
      return this.idHistories[formattedId]
    },
    async updateFilter(newFilter) {
      await this.$store.dispatch('fetchEntity', { entity: newFilter })
      await this.$store.dispatch('fetchHistories', { idsEntity: this.idsWithHis })
    }
  },
  async beforeMount() {
    await this.$store.dispatch('fetchEntity', { entity: '' })
    await this.$store.dispatch('fetchHistories', { idsEntity: this.idsWithHis })
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
