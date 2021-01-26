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
      mocks: {
        $store: new Vuex.Store({
          getters: {
            isMultiApi: () => false
          }
        })
      },
      propsData: {
        id: 'id1',
        his: [{ ts: 't:2020-07-01T00:00:00+00:00 UTC', val: 'n:64.00000' }],
        dataEntity: { 'Some Key': 's:A val1', marker: 'm:', number: 'n:64.00000' },
        isFromExternalSource: false
      }
    })
  })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
  describe('When there is only one api', () => {
    it('should display the entity title', () => {
      expect(wrapper.find('[data-test-entity-title]').exists()).toBeTrue()
    })
  })
  describe('When there is two apis', () => {
    beforeEach(() => {
      wrapper = shallowMount(CEntityRow, {
        stubs: ['v-data-table'],
        mocks: {
          $store: new Vuex.Store({
            getters: {
              isMultiApi: () => true
            }
          })
        },
        propsData: {
          id: 'id1',
          his: null,
          dataEntity: { 'Some Key': 's:A val1', marker: 'm:', number: 'n:64.00000' },
          isFromExternalSource: false
        }
      })
    })
    describe('When this is the main api', () => {
      it('should display the entity title', () => {
        expect(wrapper.find('[data-test-entity-title]').exists()).toBeTrue()
      })
      it('should display subtitle', () => {
        expect(wrapper.find('[data-test-entity-subtitle]').exists()).toBeTrue()
      })
    })
    describe('When entity has a his marker', () => {
      beforeEach(() => {
        wrapper = shallowMount(CEntityRow, {
          stubs: ['v-data-table'],
          mocks: {
            $store: new Vuex.Store({
              getters: {
                isMultiApi: () => true
              }
            })
          },
          propsData: {
            id: 'id1',
            his: [{ ts: 't:2020-07-01T00:00:00+00:00 UTC', val: 'n:64.00000' }],
            dataEntity: { 'Some Key': 's:A val1', marker: 'm:', number: 'n:64.00000' },
            isFromExternalSource: false
          }
        })
      })
      it('should display a chart', () => {
        expect(wrapper.find('[data-test-history-chart]').exists()).toBeTrue()
      })
    })
    describe('When entity has not a his marker', () => {
      it('should not display a chart', () => {
        expect(wrapper.find('[data-test-history-chart]').exists()).toBeFalse()
      })
    })
    describe('When this is the second api', () => {
      beforeEach(() => {
        wrapper.setProps({ isFromExternalSource: true })
      })
      it('should not display the entity title', () => {
        expect(wrapper.find('[data-test-entity-title]').exists()).toBeFalse()
      })
      it('should display subtitle', () => {
        expect(wrapper.find('[data-test-entity-subtitle]').exists()).toBeTrue()
      })
    })
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
    describe('#getUrlCoordinate', () => {
      it('should return formatted url to Google Maps', () => {
        const coordinate = '145,13'
        const result = wrapper.vm.getUrlCoordinate(coordinate)
        expect(result).toBe(`http://www.google.com/maps/place/${coordinate}`)
      })
    })
  })
})
