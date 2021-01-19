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
        his: ['hisory']
        }
      })
    })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
})
