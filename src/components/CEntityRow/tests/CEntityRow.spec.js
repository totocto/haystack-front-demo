import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import CEntityRow from '../CEntityRow.vue'

Vue.use(Vuex)
let wrapper
describe('CEntityRow.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(CEntityRow, {
      propsData: {
        id: 'id1',
        his: [{ ts: 't:2020-07-01T00:00:00+00:00 UTC', val: 'n:64.00000' }],
        dataEntity: { 'Some  Key1': 's:A val1', 'Some Key2': 's:A val2' }
      }
    })
  })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
  it('should display all couples (keys, val) from entity', ()  => {
    expect(wrapper.html()).toContain('Some Key1')
    expect(wrapper.html()).toContain('A val1')
    expect(wrapper.html()).toContain('Some Key2')
    expect(wrapper.html()).toContain('A val2')
  })
})
