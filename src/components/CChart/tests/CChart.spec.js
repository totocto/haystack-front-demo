import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import Highcharts from 'highcharts'
import CChart from '../CChart.vue'

Vue.use(Vuex)
let wrapper
describe('CChart.vue', () => {
  beforeEach(() => {
    Highcharts.chart = jest.fn()
    wrapper = shallowMount(CChart, {
      propsData: {
        id: 'id1'
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
