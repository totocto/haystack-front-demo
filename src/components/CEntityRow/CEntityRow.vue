<template>
  <div class="entity-row__container">
    <div>{{ entityName }}</div>
    <div>{{ entityId }}</div>
    <div>{{ type }}</div>
    <div v-for="dataEntityKey in dataEntityKeys" :key="dataEntityKey">
      {{ dataEntityKey }} : {{ dataEntity[dataEntityKey] }}
    </div>
    <c-chart class="entity-row__chart" v-if="his" :id="id" :categories="categories" :data="data"></c-chart>
  </div>
</template>

<script>
import { formatService } from '@/services'
import CChart from '../CChart/CChart.vue'

export default {
  name: 'CEntityRow',
  components: { CChart },
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
    },
    dataEntity: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    entityId() {
      return this.id.split(' ')[0]
    },
    entityName() {
      return this.id.replace(`${this.entityId} `, '')
    },
    categories() {
      return formatService.formatXAxis(this.his)
    },
    data() {
      return formatService.formatYAxis(this.his)
    },
    dataEntityKeys() {
      return Object.keys(this.dataEntity)
    }
  }
}
</script>

<style lang="scss">
.entity-row__container {
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  background-color: #d3d3d3;
  padding: 5px 0 10px 10px;
  margin-bottom: 30px;
}
.entity-row__chart {
  float: right;
  padding-right: 20px;
}
</style>
