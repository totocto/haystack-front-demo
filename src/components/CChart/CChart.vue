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
      colors: ['#dc143c', '#0000ff', '#00a86b', '#cc5500']
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
      series: this.data.map((data, index) => {
        return { data: this.data[index], color: API_COLORS[index] }
      })
    })
  }
}
</script>

<style lang="scss"></style>
