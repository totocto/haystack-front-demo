<template>
  <div :id="id" class="bar-chart__chart"></div>
</template>

<script>
import Highcharts from 'highcharts'
import { API_COLORS } from '@/services'

export default {
  name: 'CChart.vue',
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    yLabel: {
      type: String,
      default: ''
    },
    xLabel: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    unit: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      colors: API_COLORS
    }
  },
  mounted() {
    this.chart = Highcharts.chart(this.id, {
      title: {
        text: this.title
      },
      chart: {
        width: '700',
        height: '400'
      },
      xAxis: {
        type: 'datetime'
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      tooltip: {
        valueSuffix: this.unit
      },
      series: this.data.map(data => ({ data: data.his, color: this.colors[data.apiNumber] }))
    })
  }
}
</script>

<style lang="scss"></style>
