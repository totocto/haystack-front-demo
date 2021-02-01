<template>
  <div :id="id" class="bar-chart__chart"></div>
</template>

<script>
import Highcharts from 'highcharts'

require('highcharts/modules/networkgraph.js')(Highcharts)

export default {
  name: 'CGraph.vue',
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    keys: {
      type: Array,
      default: () => ['from', 'to']
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handlePointClick(point) {
      console.log(point)
      return ''
    }
  },
  mounted() {
    this.chart = Highcharts.chart(this.id, {
      title: {
        text: this.title
      },
      chart: {
        type: 'networkgraph',
        width: '700',
        height: '400'
      },
      plotOptions: {
        networkgraph: {
          keys: this.keys,
          layoutAlgorithm: {
            enableSimulation: false,
            friction: 1,
            linkLength: 55
          },
          point: {
            events: {
              click(e) {
                console.log(e)
              }
            }
          }
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          dataLabels: {
            enabled: true,
            linkFormat: ''
          },
          id: 'lang-tree',
          data: this.data[0],
          nodes: this.data[1]
        }
      ]
    })
  }
}
</script>

<style lang="scss"></style>
