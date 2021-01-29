import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import sinon from 'sinon'
import VSummaryContent from '../VSummaryContent.vue'
import CEntityRow from '../../../components/CEntityRow/CEntityRow.vue'

// TODO : Tester les clicks update des v-text-field
Vue.use(Vuex)
let wrapper
let actions
const globalStubs = ['router-view', 'v-text-field']
describe('VSummaryContent.vue', () => {
  beforeEach(() => {
    actions = {
      fetchAllEntity: sinon.stub(),
      fetchAllHistories: sinon.stub(),
      fetchEntity: sinon.stub(),
      fetchHistories: sinon.stub(),
      createApiServer: sinon.stub(),
      activateMultiApi: sinon.stub()
    }
    wrapper = shallowMount(VSummaryContent, {
      stubs: globalStubs,
      data() {
        return {
          isDataLoaded: true
        }
      },
      mocks: {
        $store: new Vuex.Store({
          getters: {
            apiServers: () => ['an api'],
            histories: () => {
              return [{ 'p:thisisademo1': ['history1'] }, []]
            },
            entities: () => [[{ id: 'r:p:thisisademo1 demoEngie1', his: 'm:' }, { id: 'r:p:thisisademo2 demoEngie2' }]]
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
    expect(actions.fetchAllEntity.calledOnce).toBeTrue()
    expect(actions.fetchAllEntity.args[0][1]).toEqual({ entity: '' })
  })
  it('should call fetchHistory with right args', () => {
    expect(actions.fetchAllHistories.calledOnce).toBeTrue()
    expect(actions.fetchAllHistories.args[0][1]).toEqual({ idsEntity: ['p:thisisademo1'] })
  })
  it('should create CEntityRow component', () => {
    expect(wrapper.vm.$data.isDataLoaded).toBeTrue()
    expect(wrapper.findComponent(CEntityRow).exists()).toBeTrue()
  })
  describe('When data are not loaded', () => {
    beforeEach(() => {
      wrapper = shallowMount(VSummaryContent, {
        stubs: globalStubs,
        data() {
          return {
            isDataLoaded: false
          }
        },
        mocks: {
          $store: new Vuex.Store({
            getters: {
              apiServers: () => ['an api'],
              histories: () => {
                return [{ 'p:thisisademo1': ['history1'] }, []]
              },
              entities: () => [
                [{ id: 'r:p:thisisademo1 demoEngie1', his: 'm:' }, { id: 'r:p:thisisademo2 demoEngie2' }]
              ]
            },
            actions
          })
        }
      })
    })
    it('should not display CEntityRow', () => {
      expect(wrapper.findComponent(CEntityRow).exists()).toBeFalse()
    })
  })
  describe('methods', () => {
    describe('#getHistory', () => {
      it('should return history associated to the entityId', () => {
        const idEntity = 'r:p:thisisademo1 demoEngie1'
        const historyResult = wrapper.vm.getHistory(idEntity, 0)
        expect(historyResult).toEqual(['history1'])
      })
    })
    describe('#getHistories', () => {
      beforeEach(() => {
        wrapper = shallowMount(VSummaryContent, {
          stubs: globalStubs,
          mocks: {
            $store: new Vuex.Store({
              getters: {
                apiServers: () => ['an api', null],
                histories: () => {
                  return [
                    { 'p:thisisademo1': ['history1'], 'p:thisisademo2': ['history2'] },
                    { 'p:thisisademo1': ['history1_bis'] }
                  ]
                },
                entities: () => [
                  [{ id: 'r:p:thisisademo1 demoEngie1', his: 'm:' }],
                  [{ id: 'r:p:thisisademo2 demoEngie1', his: 'm:' }]
                ]
              },
              actions
            })
          }
        })
      })
      it('should return histories associated with entityId', () => {
        const idEntity = 'r:p:thisisademo2 demoEngie1'
        const historyResult = wrapper.vm.getHistories(idEntity)
        expect(historyResult).toEqual([['history2'], null])
      })
      it('should return histories associated to the entityId', () => {
        const idEntity = 'r:p:thisisademo1 demoEngie1'
        const historyResult = wrapper.vm.getHistories(idEntity)
        expect(historyResult).toEqual([['history1'], ['history1_bis']])
      })
    })
    describe('#updateFilter', () => {
      it('should fetch new entity and histories according to the input', async () => {
        const newRequest = 'a request'
        await wrapper.vm.updateFilter(newRequest)
        expect(actions.fetchAllEntity.calledTwice).toBeTrue()
        expect(actions.fetchAllHistories.calledTwice).toBeTrue()
      })
    })
    describe('#updateAPI', () => {
      it('should dispatch according to the input', async () => {
        const newApiHost = 'an  api'
        const apiNumber = 0
        await wrapper.vm.updateAPI(newApiHost, apiNumber)
        expect(actions.createApiServer.calledOnce).toBeTrue()
      })
    })
  })
})
