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
    dataEntities: {
      type: Array,
      default: () => []
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
              click: function emitEvent(event) {
                this.$emit('pointClicked', event.point.id)
              }.bind(this)
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
          data: this.dataEntities[0],
          nodes: this.dataEntities[1]
        }
      ]
    })
  }
}
</script>

<style lang="scss"></style>
