<template>
  <div :id="id" class="bar-chart__chart"></div>
</template>

<script>
import Highcharts from 'highcharts'

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
    categories: {
      type: Array,
      default: () => null
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
      colors: ['#DC143C', '#0000ff']
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
      yAxis: {
        title: {
          text: this.yLabel
        }
      },
      xAxis: {
        title: {
          text: this.xLabel
        },
        categories: this.categories[0]
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
      series: this.data
        .filter(data => data)
        .map((data, index) => {
          return { data, color: this.colors[index] }
        })
    })
  }
}
</script>

<style lang="scss"></style>
