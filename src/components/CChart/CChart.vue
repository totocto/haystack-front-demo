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
      default: () => null
    }
  },
  mounted() {
    this.chart = Highcharts.chart(this.id, {
      title: {
        text: this.title
      },
      chart: {
        width: '300',
        height: '200'
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
        categories: this.categories ? this.categories : ['07/20', '08/20', '09/20', '10/20', '11/20', '12/20']
      },
      legend: {
        enabled: false
      },
      credits: {
        xenabled: false
      },
      tooltip: {
        valueSuffix: 'kw'
      },
      series: [
        {
          data: this.data ? this.data : [74.0, 69.0, 64.0, 65.0, 68.0, 71.0],
          color: '#DC143C'
        }
      ]
    })
  }
}
</script>

<style lang="scss"></style>
