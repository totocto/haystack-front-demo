<template>
  <div>
    <h2>Informations</h2>
    <c-entity-row v-for="row in entities" :key="row.id" :id="row.id" :his="getHistory(row.id)"> </c-entity-row>
  </div>
</template>

<script>
import { formatService } from '@/services'
import CEntityRow from '../../components/CEntityRow/CEntityRow.vue'

export default {
  name: 'VSummaryContent',
  components: { CEntityRow },
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
    }
  },
  async beforeMount() {
    await this.$store.dispatch('fetchEntity', { entity: 'site' })
    await this.$store.dispatch('fetchHistories', { idsEntity: this.idsWithHis })
  }
}
</script>

<style lang="scss"></style>
