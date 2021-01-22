import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import CEntityRow from '../CEntityRow.vue'

Vue.use(Vuex)
let wrapper
describe('CEntityRow.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(CEntityRow, {
      stubs: ['v-data-table'],
      propsData: {
        id: 'id1',
        his: [{ ts: 't:2020-07-01T00:00:00+00:00 UTC', val: 'n:64.00000' }],
        dataEntity: { 'Some Key': 's:A val1', marker: 'm:', number: 'n:64.00000' }
      }
    })
  })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
  describe('#methods', () => {
    describe('#getEntityValue', () => {
      it('should return formatted string value when value is a string', () => {
        const dataEntityKey = 'Some Key'
        const result = wrapper.vm.getEntityValue(dataEntityKey)
        expect(result).toBe('A val1')
      })
      it('should return formatted number value when value is a number', () => {
        const dataEntityKey = 'number'
        const result = wrapper.vm.getEntityValue(dataEntityKey)
        expect(result).toBe(64)
      })
      it('should return tick when value is a marker', () => {
        const dataEntityKey = 'marker'
        const result = wrapper.vm.getEntityValue(dataEntityKey)
        expect(result).toBe('✓')
      })
    })
  })
})
