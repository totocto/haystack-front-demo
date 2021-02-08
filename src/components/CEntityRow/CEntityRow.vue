<template>
  <div class="entity-row__container">
    <h2 data-test-entity-title class="entity-row__title">{{ entityName }}</h2>
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
        >
          <template v-slot:[`item.value`]="{ item }">
            <a v-if="isCoordinate(item.value)" :href="getUrlCoordinate(item.value)">{{ item.value.substring(2) }}</a>
            <div v-else-if="isRef(item.value)">
              <span>{{ getRefName(item) }}</span>
              <v-icon class="material-icons entity-row__click-button" @click="copyText(item)">content_copy</v-icon>
            </div>
            <span v-else>{{ item.value }}</span>
          </template>
        </v-data-table>
      </div>
      <c-chart
        data-test-history-chart
        class="entity-row__chart"
        v-if="displayChart"
        :id="chartId"
        :categories="categories"
        :data="data"
        :unit="unit"
      />
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
    },
    isFromExternalSource: {
      type: Boolean,
      default: false
    },
    isDataLoaded: {
      type: Boolean,
      default: false
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
        const value = this.getEntityValue(key)
        // eslint-disable-next-line
        return { tag: key, value: value, row_class: value === '✓' ? `${key} haystack-marker` : key }
      })
    },
    entityId() {
      return this.id.split(' ')[0]
    },
    displayChart() {
      return this.his.filter(his => his).length > 0 && this.isDataLoaded
    },
    chartId() {
      return this.isFromExternalSource ? `${this.id}-external` : this.id
    },
    entityName() {
      return formatService.formatEntityName(this.dataEntity)
    },
    categories() {
      return this.his.map(historic => (historic ? formatService.formatXAxis(historic) : null))
    },
    data() {
      return this.his.map(historic => (historic ? formatService.formatYAxis(historic) : null))
    },
    dataEntityKeys() {
      return Object.keys(this.dataEntity)
    },
    unit() {
      return this.dataEntity.unit ? this.dataEntity.unit.substring(2) : ''
    }
  },
  methods: {
    getRefName(item) {
      if (item.tag === 'id') {
        const entityName = item.value.substring(2).split(' ')
        if (entityName.length === 1) {
          if (this.dataEntity.dis) return this.dataEntity.dis.substring(2)
          return `@${entityName[0]}`
        }
        entityName.shift()
        return entityName.join(' ')
      }
      const entityName = item.value.substring(2).split(' ')
      if (entityName.length === 1) return entityName[0]
      entityName.shift()
      return entityName.join(' ')
    },
    isRef(item) {
      if (typeof item !== 'string') return false
      return item.substring(0, 2) === 'r:'
    },
    isCoordinate(item) {
      if (typeof item !== 'string') return false
      // if (item.value.length < 4) return false
      return item.substring(0, 2) === 'c:'
    },
    copyText(item) {
      const id = `@${item.value.split(' ')[0].substring(2)}`
      const virtualElement = document.createElement('textarea')
      document.body.appendChild(virtualElement)
      virtualElement.value = id
      virtualElement.select()
      document.execCommand('copy')
      document.body.removeChild(virtualElement)
    },
    getUrlCoordinate(coordinate) {
      return `http://www.google.com/maps/place/${coordinate.substring(2)}`
    },
    getEntityValue(dataEntityKey) {
      const value = this.dataEntity[dataEntityKey]
      if (value === 'm:') return '✓'
      if (value.substring(0, 2) === 'c:') return value
      if (value.substring(0, 2) === 'r:') return value
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
.entity-row__title {
  padding-bottom: 20px;
}
.entity-row__subtitle {
  padding-bottom: 10px;
}
.entity-row__container {
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  padding: 5px 0 10px 10px;
  margin-bottom: 30px;
}
.entity-row__chart {
  float: right;
  padding-left: 200px;
}
.entity-row__click-button {
  float: right;
}
.v-btn {
  text-transform: none;
  height: 21px !important;
  padding: 0 !important;
  font-weight: bold;
  letter-spacing: normal;
  background-color: white !important;
}
</style>
