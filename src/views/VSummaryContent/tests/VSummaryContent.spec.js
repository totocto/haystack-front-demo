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
let mutations
const globalStubs = ['router-view', 'v-text-field']
describe('VSummaryContent.vue', () => {
  beforeEach(() => {
    mutations = {
      SET_FILTER_API: sinon.stub()
    }
    actions = {
      reloadAllData: sinon.stub(),
      fetchEntity: sinon.stub(),
      fetchHistories: sinon.stub(),
      createApiServer: sinon.stub(),
      activateMultiApi: sinon.stub()
    }
    wrapper = shallowMount(VSummaryContent, {
      stubs: globalStubs,
      mocks: {
        $store: new Vuex.Store({
          getters: {
            isDataLoaded: () => true,
            apiServers: () => ['an api'],
            histories: () => {
              return [{ 'p:thisisademo1': ['history1'] }, []]
            },
            entities: () => [[{ id: 'r:p:thisisademo1 demoEngie1', his: 'm:' }, { id: 'r:p:thisisademo2 demoEngie2' }]]
          },
          actions,
          mutations
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
  it('should dispatch reloadAllData with right args', () => {
    expect(actions.reloadAllData.calledOnce).toBeTrue()
    expect(actions.reloadAllData.args[0][1]).toEqual({ entity: '' })
  })
  it('should create CEntityRow component', () => {
    expect(wrapper.findComponent(CEntityRow).exists()).toBeTrue()
  })
  describe('When data are not loaded', () => {
    beforeEach(() => {
      wrapper = shallowMount(VSummaryContent, {
        stubs: globalStubs,
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
            actions,
            mutations
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
    describe('#onGraphClick', () => {
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
                  [
                    { id: 'r:p:thisisademo1 demoEngie1' },
                    { id: 'r:p:thisisademo1 demoEngie2', siteRef: 'r:idStuff demoEngie1' }
                  ],
                  [{ id: 'r:p:thisisademo2 demoEngie3', siteRef: 'r:idPoint a point' }]
                ]
              },
              mutations,
              actions
            })
          }
        })
      })
      describe('When point clicked on graph is not in api answer', () => {
        it('should call reloadAllData', async () => {
          const pointName = 'a point'
          await wrapper.vm.onGraphClick(pointName)
          expect(actions.reloadAllData.called).toBeTrue()
          expect(mutations.SET_FILTER_API.called).toBeTrue()
        })
      })
    })
  })
})
