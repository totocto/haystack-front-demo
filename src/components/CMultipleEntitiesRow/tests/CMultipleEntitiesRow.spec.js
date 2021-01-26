import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import CMultipleEntitiesRow from '../CMultipleEntitiesRow.vue'
import CEntityRow from '../../CEntityRow/CEntityRow.vue'

Vue.use(Vuex)
let wrapper
describe('CMultipleEntitiesRow.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(CMultipleEntitiesRow, {
      stubs: ['v-data-table'],
      propsData: {
        id: 'id1',
        dataEntities: [{ 'Some Key': 's:A val1' }, { 'Some Key': 's:A val1' }]
      }
    })
  })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
  it('should mount two CEntityRow components', () => {
    const entityRowComponents = wrapper.findAllComponents(CEntityRow)
    expect(entityRowComponents.length).toBe(2)
  })
})
