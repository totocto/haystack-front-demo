<template>
  <div>
    <h2>Informations</h2>
    <c-entity-row v-for="row in entities" :key="row.id" :id="row.id" :his="row.his"> </c-entity-row>
  </div>
</template>

<script>
import CEntityRow from '../components/CEntityRow/CEntityRow.vue'

export default {
  name: 'VSummaryContent',
  components: { CEntityRow },
  computed: {
    entities() {
      return this.$store.getters.entities
    }
  },
  async beforeMount() {
    await this.$store.dispatch('fetchEntity', { entity: 'point' })
  }
}
</script>

<style lang="scss"></style>
