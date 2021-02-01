import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import Highcharts from 'highcharts'
import CGraph from '../CGraph.vue'

Vue.use(Vuex)
let wrapper
describe('CGraph.vue', () => {
  beforeEach(() => {
    Highcharts.chart = jest.fn()
    wrapper = shallowMount(CGraph, {
      propsData: {
        id: 'id1',
        data: [[1, 2, 3], null],
        categories: [['month1', 'month2', 'month3'], null]
      }
    })
  })
  afterEach(() => {
    Highcharts.chart.mockReset()
  })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
  it('should mount chart', () => {
    expect(Highcharts.chart.mock.calls.length).toBe(1)
  })
})
