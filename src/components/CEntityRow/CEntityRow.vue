<template>
  <div class="entity-row__container">
    <div>{{ entityName }}</div>
    <div>{{ entityId }}</div>
    <div>{{ his }}</div>
    <div>{{ type }}</div>
  </div>
</template>

<script>
export default {
  name: 'CEntityRow',
  props: {
    id: {
      type: String,
      default: ''
    },
    his: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: null
    }
  },
  computed: {
    entityId() {
      return this.id.split(' ')[0]
    },
    entityName() {
      return this.id.replace(`${this.entityId} `, '')
    }
  }
}
</script>

<style lang="scss">
.entity-row__container {
  margin: auto;
  border-radius: 15px;
  height: 150px;
  width: 1000px;
  background-color: #d3d3d3;
  padding: 5px 0 0 10px;
  margin-bottom: 30px;
}
</style>
