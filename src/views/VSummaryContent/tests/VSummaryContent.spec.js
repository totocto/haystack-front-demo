import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import sinon from 'sinon'
import VSummaryContent from '../VSummaryContent.vue'
import CEntityRow from '../../../components/CEntityRow/CEntityRow.vue'

Vue.use(Vuex)
let wrapper
let actions
const globalStubs = ['router-view', 'v-text-field']
describe('VSummaryContent.vue', () => {
  beforeEach(() => {
    actions = {
      fetchEntity: sinon.stub(),
      fetchHistories: sinon.stub()
    }
    wrapper = shallowMount(VSummaryContent, {
      stubs: globalStubs,
      mocks: {
        $store: new Vuex.Store({
          getters: {
            histories: () => {
              return { 'p:thisisademo1': ['history1'] }
            },
            entities: () => [{ id: 'r:p:thisisademo1 demoEngie1', his: 'm:' }, { id: 'r:p:thisisademo2 demoEngie2' }]
          },
          actions
        })
      }
    })
  })
  afterEach(() => {
    sinon.restore()
  })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
  it('should dispatch fetchEntity with right args', () => {
    expect(actions.fetchEntity.calledOnce).toBeTrue()
    expect(actions.fetchEntity.args[0][1]).toEqual({ entity: '' })
  })
  it('should call fetchHistory with right args', () => {
    expect(actions.fetchHistories.calledOnce).toBeTrue()
    expect(actions.fetchHistories.args[0][1]).toEqual({ idsEntity: ['p:thisisademo1'] })
  })
  it('should create CEntityRow component', () => {
    expect(wrapper.findComponent(CEntityRow).exists()).toBeTrue()
  })
  describe('methods', () => {
    describe('#getHistory', () => {
      it('should return history associated to the entityId', () => {
        const idEntity = 'r:p:thisisademo1 demoEngie1'
        const historyResult = wrapper.vm.getHistory(idEntity)
        expect(historyResult).toEqual(['history1'])
      })
    })
    describe('#updateFilter', () => {
      it('should dispatch according to the input', async () => {
        const newRequest = 'a request'
        await wrapper.vm.updateFilter(newRequest)
        expect(actions.fetchEntity.calledTwice).toBeTrue()
        expect(actions.fetchEntity.args[1][1]).toEqual({ entity: newRequest })
        expect(actions.fetchHistories.calledTwice).toBeTrue()
      })
    })
  })
})
