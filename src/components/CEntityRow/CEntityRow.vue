<template>
  <div class="entity-row__container">
    <h2 data-test-entity-title class="entity-row__title">{{ entityName }}</h2>
    <div class="content-container">
      <div class="entity-row__table">
        <p-his-data-table
          :isEntityData="true"
          @onRefClick="onRefClick"
          @onExternalRefClick="onExternalRefClick"
          :dataHisTable="entityTableValues"
          :dataEntity="dataEntity"
          :allEntities="allEntities"
        />
      </div>
      <div class="entity-row__chart">
        <c-chart
          data-test-history-chart
          v-if="displayChart"
          :id="chartId"
          :data="sortDataChart(dataChart)"
          :unit="unit"
          title="Historical values"
        />
        <p-his-data-table
          :isEntityData="false"
          v-if="displayHisTableData"
          @onRefClick="onRefClick"
          @onExternalRefClick="onExternalRefClick"
          :dataHisTable="hisTableValues"
          :dataEntity="dataEntity"
          :allEntities="allEntities"
        >
        </p-his-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import { formatService, dataUtils } from '@/services'
import CChart from '../CChart/CChart.vue'
import PHisDataTable from '../../presenters/PHisDataTable/PHisDataTable.vue'

export default {
  name: 'CEntityRow',
  components: { CChart, PHisDataTable },
  props: {
    idEntity: {
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
        { text: 'Value', value: 'value', sortable: false }
      ]
    }
  },
  computed: {
    entityTableValues() {
      return Object.keys(this.dataEntity).map(key => {
        const result = this.getEntityValue(key)
        let apiSource = null
        let tagKey = key
        const splittedKey = key.split('_')
        if (splittedKey.length > 1) {
          if (Number(splittedKey[1])) {
            // eslint-disable-next-line
            tagKey = splittedKey[0]
          }
        }
        if (key !== 'his') {
          apiSource = result.apiSource
        } else {
          apiSource = typeof result.apiSource === 'object' ? result.apiSource[0] : result.apiSource
        }
        return {
          tag: tagKey,
          value: result.val,
          row_class: [result.val === '✓' ? `${key} haystack-marker` : key, `apiSource_${apiSource}`]
        }
      })
    },
    hisTableValues() {
      if (!this.his) return []
      return this.dataHisTable
        .map(history => {
          return history.map(row => {
            return {
              ts: row.ts.substring(2),
              value: this.getHisTableValue(row),
              row_class: [`apiSource_${row.apiSource + 1}`]
            }
          })
        })
        .flatMap(history => history)
    },
    displayChart() {
      return (
        this.his.filter(his => (his ? his.length > 0 : his)).length > 0 &&
        this.isDataLoaded &&
        this.dataChart.length > 0
      )
    },
    chartId() {
      return this.isFromExternalSource ? `${this.idEntity}-external` : this.idEntity
    },
    entityName() {
      return formatService.formatEntityName(this.dataEntity)
    },
    dataChart() {
      return this.his
        .filter(hisData => dataUtils.isNumberTypeChart(hisData))
        .map(historic => (historic ? formatService.formatCharts(historic) : null))
    },
    dataHisTable() {
      const dataHisTable = this.his.filter(hisData => !dataUtils.isNumberTypeChart(hisData))
      if (dataHisTable.length === 1 && dataHisTable[0].length === 0) return []
      return dataHisTable
    },
    displayHisTableData() {
      return this.hisTableValues.length > 0
    },
    dataEntityKeys() {
      return Object.keys(this.dataEntity)
    },
    unit() {
      return this.dataEntity.unit ? this.dataEntity.unit.val.substring(2) : ''
    },
    allEntities() {
      return this.$store.getters.entities
    }
  },
  methods: {
    onRefClick(refId) {
      this.$emit('onRefClick', refId)
    },
    onExternalRefClick(refId) {
      this.$emit('onExternalRefClick', refId)
    },
    sortDataChart(dataChart) {
      return dataUtils.sortChartDataByDate(dataChart)
    },
    getNumberValue(dataEntityKey) {
      const numberStringValue = this.dataEntity[dataEntityKey].val.substring(2).split(' ')
      const numberValue =
        numberStringValue.length > 1
          ? `${Number(numberStringValue[0])} ${numberStringValue[1]}`
          : Number(numberStringValue[0])
      return { val: numberValue, apiSource: this.dataEntity[dataEntityKey].apiSource }
    },
    getUrlCoordinate(coordinate) {
      return `http://www.google.com/maps/place/${coordinate.substring(2)}`
    },
    getEntityValue(dataEntityKey) {
      const value = this.dataEntity[dataEntityKey].val
      const { apiSource } = this.dataEntity[dataEntityKey]
      if (!value) return 'NaN'
      if (value === 'b:') return { val: value.substring(2), apiSource }
      if (value === 'm:') return { val: '✓', apiSource }
      if (value.substring(0, 2) === 'c:') return { val: value, apiSource }
      if (value.substring(0, 2) === 'r:') return { val: value, apiSource }
      if (value.substring(0, 2) === 'n:') return this.getNumberValue(dataEntityKey)
      if (value.substring(0, 2) === 'r:') return { val: value, apiSource }
      if (value === '') return { val: '', apiSource }
      return { val: value.substring(2), apiSource }
    },
    getHisTableValue(row) {
      const value = row.val
      if (typeof value === 'boolean') return value
      if (!value) return value
      if (value === 'm:') return '✓'
      if (value.substring(0, 2) === 'c:') return value
      if (value.substring(0, 2) === 'r:') return value
      if (value.substring(0, 2) === 'n:') return this.getNumberValue(value)
      if (value.substring(0, 2) === 'r:') return value
      if (value === '') return value
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
  width: 30%;
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
  width: 50%;
  margin: 0 auto;
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
.apiSource_1 {
  background: #d4bbbb;
}
.apiSource_2 {
  background: #8080ff;
}
.apiSource_3 {
  background: #80a86b;
}
.apiSource_4 {
  background: #bb9857;
}
.apiSource_5 {
  background: #ad77df;
}
.apiSource_6 {
  background: #a39178;
}
.apiSource_7 {
  background: #ebeb2c;
}
.apiSource_8 {
  background: #f516d0;
}
.apiSource_9 {
  background: #16f5dd;
}
.apiSource_10 {
  background: #4516f5;
}

.entity-row__ref-row {
  text-decoration: underline dotted;
  cursor: pointer;
}
.entity-row__external-ref-row {
  text-decoration: underline dotted;
  cursor: pointer;
  color: grey;
}
</style>
