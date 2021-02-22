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
      SET_API_SERVERS: sinon.stub(),
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
        $route: {
          query: {}
        },
        $store: new Vuex.Store({
          getters: {
            filterApi: () => '',
            isDataLoaded: () => true,
            apiServers: () => ['an api'],
            histories: () => [{ 'p:thisisademo1': ['history1'] }, []],
            entities: () => [[{ id: { val: 'r:p:thisisademo1 demoEngie1' }, his: { val: 'm:' } }, { id: { val: 'r:p:thisisademo2 demoEngie2' }}]]
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
  describe('When there is no query parameter', () => {
    it('should dispatch reloadAllData with right args', () => {
      expect(actions.reloadAllData.calledOnce).toBeTrue()
      expect(actions.reloadAllData.args[0][1]).toEqual({ entity: '' })
    })
  })
  describe('When there is query parameter', () => {
    beforeEach(() => {
      wrapper = shallowMount(VSummaryContent, {
        stubs: globalStubs,
        mocks: {
          $route: {
            query: { apiServers: '["aserver"]', filterApi: 'afilter'}
          },
          $store: new Vuex.Store({
            getters: {
              filterApi: () => '',
              isDataLoaded: () => true,
              apiServers: () => ['an api'],
              histories: () => [{ 'p:thisisademo1': ['history1'] }, []],
              entities: () => [[{ id: { val: 'r:p:thisisademo1 demoEngie1' }, his: { val: 'm:' } }, { id: { val: 'r:p:thisisademo2 demoEngie2' }}]]
            },
            actions,
            mutations
        })
      }
    })
  })
    it('should dispatch reloadAllData with right args', () => {
      expect(actions.reloadAllData.called).toBeTrue()
      expect(actions.reloadAllData.args[0][1]).toEqual({ entity: '' })
    })
    it('it should commit default api Servers', () => {
      expect(mutations.SET_API_SERVERS.calledOnce).toBeTrue()
      expect(mutations.SET_API_SERVERS.args[0][1]).toEqual({ apiServers: ['aserver'] })
    })
    it('should commit new api filter', () => {
      expect(mutations.SET_FILTER_API.calledOnce).toBeTrue()
      expect(mutations.SET_FILTER_API.args[0][1]).toEqual({ filterApi: 'afilter' })
    })
  })
  it('should create CEntityRow component', () => {
    expect(wrapper.findComponent(CEntityRow).exists()).toBeTrue()
  })
  describe('When data are not loaded', () => {
    beforeEach(() => {
      wrapper = shallowMount(VSummaryContent, {
        stubs: globalStubs,
        mocks: {
          $route: {
            query: {}
          },
          $store: new Vuex.Store({
            getters: {
              apiServers: () => ['an api'],
              histories: () => [{ 'p:thisisademo1': ['history1'] }, []],
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
            $route: {
              query: {}
            },
            $store: new Vuex.Store({
              getters: {
                apiServers: () => ['an api', null],
                histories: () => [
                  { 'p:thisisademo1': ['history1'], 'p:thisisademo2': ['history2'] },
                  { 'p:thisisademo1': ['history1_bis'] }
                ],
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
            $route: {
              query: {}
            },
            $store: new Vuex.Store({
              getters: {
                apiServers: () => ['an api', null],
                histories: () => [
                  { 'p:thisisademo1': ['history1'], 'p:thisisademo2': ['history2'] },
                  { 'p:thisisademo1': ['history1_bis'] }
                ],
                entities: () => [
                  [
                    { id: { val: 'r:p:thisisademo1 demoEngie1' } },
                    { id: { val: 'r:p:thisisademo1 demoEngie2' },  siteRef: { val: 'r:idStuff demoEngie1' } }
                  ],
                  [{ id: { val: 'r:p:thisisademo2 demoEngie3' }, siteRef: { val: 'r:idPoint a point' } }]
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
