<template>
  <div class="entity-row__container">
    <h3 class="entity-row__title">{{ entityName }}</h3>
    <div class="content-container">
      <div class="entity-row__table">
        <v-data-table
          :headers="headers"
          :items="tableValues"
          :items-per-page="5"
          :hide-default-footer="true"
          :disable-pagination="true"
          :dense="true"
          item-class="row_class"
        ></v-data-table>
      </div>
      <c-chart class="entity-row__chart" v-if="his" :id="id" :categories="categories" :data="data" :unit="unit" />
    </div>
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
    dataEntity: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'Tag',
          align: 'start',
          sortable: false,
          value: 'tag'
        },
        { text: 'Value', value: 'value' }
      ]
    }
  },
  computed: {
    tableValues() {
      return Object.keys(this.dataEntity).map(key => {
        return { tag: key, value: this.getEntityValue(key), row_class: key }
      })
    },
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
    },
    unit() {
      return this.dataEntity.unit ? this.dataEntity.unit.substring(2) : ''
    }
  },
  methods: {
    getEntityValue(dataEntityKey) {
      const value = this.dataEntity[dataEntityKey]
      if (value === 'm:') return '✓'
      if (value.substring(0, 2) === 'n:') return Number(value.substring(2))
      if (value === '') return ''
      return value.substring(2)
    }
  }
}
</script>

<style lang="scss">
.content-container {
  display: flex;
  flex-direction: row;
}
.entity-row__table {
  width: 500px;
}
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
  padding-left: 200px;
}
</style>
