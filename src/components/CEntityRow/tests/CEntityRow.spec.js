import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import sinon from 'sinon'
import CEntityRow from '../CEntityRow.vue'

Vue.use(Vuex)
let wrapper
let emit
describe('CEntityRow.vue', () => {
  beforeEach(() => {
    emit = sinon.stub()
    wrapper = shallowMount(CEntityRow, {
      stubs: ['v-data-table'],
      propsData: {
        id: 'id1',
        his: [[{ ts: 't:2020-07-01T00:00:00+00:00 UTC', val: 'n:64.00000' }], []],
        dataEntity: {
          id: { val: 'id1', apiSource: 1 },
          'Some Key': { val: 's:A val1', apiSource: 1 },
          dis: { val: 'a description', apisource: 1 },
          marker: { val: 'm:', apiSource: 1 },
          number: { val: 'n:64.00000', apiSource: 1 },
          coordinate: { val: 'c:12,12', apiSource: 1 }
        },
        isFromExternalSource: false,
        isDataLoaded: true
      },
      mocks: {
        $store: new Vuex.Store({
          getters: {
            entities: () => [[{ id: { val: 'id1' } }]]
          }
        }),
        $emit: emit
      }
    })
  })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
  it('should display the entity title', () => {
    expect(wrapper.find('[data-test-entity-title]').exists()).toBeTrue()
  })
  it('should display the entity title', () => {
    expect(wrapper.find('[data-test-entity-title]').exists()).toBeTrue()
  })
  describe('When entity has a his marker', () => {
    describe('When data are loaded', () => {
      it('should display a chart', () => {
        expect(wrapper.find('[data-test-history-chart]').exists()).toBeTrue()
      })
    })
    describe('When data are not loaded', () => {
      it('should not display a chart', () => {
        wrapper.setProps({ isDataLoaded: false })
        expect(wrapper.find('[data-test-history-chart]').exists()).toBeTrue()
      })
    })
  })
  describe('When entity has not a his marker', () => {
    beforeEach(() => {
      wrapper = shallowMount(CEntityRow, {
        stubs: ['v-data-table'],
        propsData: {
          id: 'id1',
          his: [null, null],
          dataEntity: {
            id: { val: 'id1', apiSource: 1 },
            'Some Key': { val: 's:A val1', apiSource: 1 },
            marker: { val: 'm:', apiSource: 1 },
            number: { val: 'n:64.00000', apiSource: 1 }
          },
          isFromExternalSource: false,
          isDataLoaded: true
        }
      })
    })
    it('should not display a chart', () => {
      expect(wrapper.find('[data-test-history-chart]').exists()).toBeFalse()
    })
  })
  describe('#methods', () => {
    describe('#getEntityValue', () => {
      it('should return formatted string value when value is a string', () => {
        const dataEntityKey = 'Some Key'
        const result = wrapper.vm.getEntityValue(dataEntityKey)
        const expected = { val: 'A val1', apiSource: 1 }
        expect(result).toEqual(expected)
      })
      it('should return formatted number value when value is a number', () => {
        const dataEntityKey = 'number'
        const result = wrapper.vm.getEntityValue(dataEntityKey)
        const expected = { val: 64, apiSource: 1 }
        expect(result).toEqual(expected)
      })
      it('should return tick when value is a marker', () => {
        const dataEntityKey = 'marker'
        const result = wrapper.vm.getEntityValue(dataEntityKey)
        const expected = { val: '✓', apiSource: 1 }
        expect(result).toEqual(expected)
      })
      it('should return brut value when coordinate', () => {
        const dataEntityKey = 'coordinate'
        const result = wrapper.vm.getEntityValue(dataEntityKey)
        const expected = { val: 'c:12,12', apiSource: 1 }
        expect(result).toEqual(expected)
      })
    })
    describe('#getUrlCoordinate', () => {
      it('should return formatted url to Google Maps', () => {
        const coordinate = 'c:145,13'
        const result = wrapper.vm.getUrlCoordinate(coordinate)
        const expected = 'http://www.google.com/maps/place/145,13'
        expect(result).toBe(expected)
      })
    })
    describe('#isRef', () => {
      it('should return true', () => {
        const value = 'r:anything'
        const result = wrapper.vm.isRef(value)
        expect(result).toBeTrue()
      })
      it('should return false', () => {
        const value = 'anything'
        const result = wrapper.vm.isRef(value)
        expect(result).toBeFalse()
      })
    })
    // REFACTO TO DO
    describe('#refClicked', () => {
      it('should emit an event', () => {
        wrapper.vm.refClicked('anid')
        expect(emit.calledOnce).toBeTrue()
        expect(emit.args[0]).toEqual(['onRefClick', 'anid'])
      })
    })
    describe('#isRefClickable', () => {
      describe('When item is an id', () => {
        it('should return false', () => {
          const item = { tag: 'id', value: 'Something' }
          const result = wrapper.vm.isRefClickable(item)
          expect(result).toBeFalse()
        })
      })
      describe('When item is not an id', () => {
        describe('when item ref does not exists in entities', () => {
          it('should return false', () => {
            const item = { tag: 'notId', value: 'not valid id' }
            const result = wrapper.vm.isRefClickable(item)
            expect(result).toBeFalse()
          })
        })
        describe('when item ref  exists in entities', () => {
          it('should return true', () => {
            const item = { tag: 'notId', value: 'id1' }
            const result = wrapper.vm.isRefClickable(item)
            expect(result).toBeTrue()
          })
        })
      })
    })
    describe('#getRefName', () => {
      describe('when item is of type id', () => {
        describe('When entity has a description', () => {
          it('should return entity description', () => {
            const entity = { tag: 'id', value: 'id1' }
            const result = wrapper.vm.getRefName(entity)
            const expected = 'description'
            expect(result).toBe(expected)
          })
        })
        describe('When entity has not a description', () => {
          it('should return entity name', () => {
            wrapper.setProps({
              dataEntity: { id: { val: 'id1', apiSource: 1 }, number: { val: 'n:64.00000', apiSource: 1 } }
            })
            const entity = { tag: 'id', value: 'id1' }
            const result = wrapper.vm.getRefName(entity)
            const expected = 'description'
            expect(result).toBe(expected)
          })
        })
      })
    })
    describe('#isCoordinate', () => {
      it('should return true', () => {
        const itemValue = 'c:i-am-a-coordinate'
        const result = wrapper.vm.isCoordinate(itemValue)
        expect(result).toBeTrue()
      })
      it('should return true', () => {
        const itemValue = 'o:i-am-not-coordinate'
        const result = wrapper.vm.isCoordinate(itemValue)
        expect(result).toBeFalse()
      })
    })
  })
})
