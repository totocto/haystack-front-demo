import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import sinon from 'sinon'
import VMainLayout from '../VMainLayout.vue'

Vue.use(Vuex)
let wrapper
let actions
let mutations
let router
const globalStubs = ['router-view', 'v-app-bar', 'v-img', 'v-spacer', 'v-combobox', 'v-icon', 'v-text-field']
describe('VMainLayout.vue', () => {
  beforeEach(() => {
    router = { push: sinon.stub(), replace: sinon.stub().returns({ catch: sinon.stub() }) }
    mutations = {
      DELETE_HAYSTACK_API: sinon.stub(),
      SET_FILTER_API: sinon.stub()
    }
    actions = {
      init: sinon.stub(),
      reloadAllData: sinon.stub(),
      createApiServer: sinon.stub(),
      DELETE_HAYSTACK_API: sinon.stub()
    }
    wrapper = shallowMount(VMainLayout, {
      stubs: globalStubs,
      propsData: {
        comboboxInput: 'host1'
      },
      mocks: {
        $router: router,
        $route: { query: { q: 'search1', a: '["host1"]' } },
        $store: new Vuex.Store({
          getters: {
            filterApi: () => 'a filter',
            apiServers: () => [{ haystackApiHost: 'host1' }],
            haystackInformation: () => 'This is Haystack'
          },
          mutations,
          actions
        })
      }
    })
  })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
  describe('methods', () => {
    describe('#isApiServerAlreadyExists', () => {
      describe('When ApiServer already exists', () => {
        it('should return true', () => {
          const haystackApiHost = 'host1'
          const result = wrapper.vm.isApiServerAlreadyExists(haystackApiHost)
          expect(result).toBeTrue()
        })
      })
      describe('When ApiServer does not exist', () => {
        it('should return true', () => {
          const haystackApiHost = 'host2'
          const result = wrapper.vm.isApiServerAlreadyExists(haystackApiHost)
          expect(result).toBeFalse()
        })
      })
    })
    describe('#changeApiServers', () => {
      it('should call commit', async () => {
        const haystackApiHost = 'host1'
        await wrapper.vm.changeApiServers(haystackApiHost)
        expect(mutations.DELETE_HAYSTACK_API.calledOnce).toBeTrue()
        expect(mutations.DELETE_HAYSTACK_API.args[0][1]).toEqual({ haystackApiHost })
      })
      it('should call dispatch', async () => {
        const haystackApiHost = 'host1'
        await wrapper.vm.changeApiServers(haystackApiHost)
        expect(actions.reloadAllData.calledOnce).toBeTrue()
        expect(actions.reloadAllData.args[0][1]).toEqual({ entity: 'a filter' })
      })
      it('should push inside router right parameters', async () => {
        const haystackApiHost = 'host1'
        await wrapper.vm.changeApiServers(haystackApiHost)
        expect(router.push.calledOnce).toBeTrue()
        expect(router.push.args[0]).toEqual([{ query: { a: '["host1"]', q: 'search1' } }])
      })
    })
    describe('#updateAPI', () => {
      describe('When api already exists', () => {
        it('should not call commit', async () => {
          wrapper.setData({
            comboboxInput: 'host1'
          })
          await wrapper.vm.updateAPI()
          expect(actions.createApiServer.called).toBeFalse()
          expect(actions.reloadAllData.called).toBeFalse()
        })
      })
      describe('When api does not exists', () => {
        it('should call commit', async () => {
          const haystackApiHost = 'host2'
          wrapper.setData({
            comboboxInput: haystackApiHost
          })
          await wrapper.vm.updateAPI()
          expect(actions.createApiServer.calledOnce).toBeTrue()
          expect(actions.reloadAllData.calledOnce).toBeTrue()
          expect(actions.createApiServer.args[0][1]).toEqual({ haystackApiHost })
          expect(actions.reloadAllData.args[0][1]).toEqual({ entity: 'a filter' })
        })
        /* it.only('should push right parameters to router', async () => {
          const haystackApiHost = 'host2'
          wrapper.setData({
            comboboxInput: haystackApiHost
          })
          await wrapper.vm.updateAPI()
          expect(router.push.calledOnce).toBeTrue()
          expect(router.push.args[0]).toEqual([{ query: { a: '["host1"]', q: 'search1' } }])
        }) */
      })
    })
    describe('#updateFilter', () => {
      it('should fetch new entity and histories according to the input', async () => {
        const newRequest = 'a request'
        await wrapper.vm.updateFilter(newRequest)
        expect(actions.reloadAllData.calledOnce).toBeTrue()
        expect(mutations.SET_FILTER_API.calledOnce).toBeTrue()
        expect(mutations.SET_FILTER_API.args[0][1]).toEqual({ filterApi: newRequest })
        expect(router.push.calledOnce)
        expect(router.push.args[0]).toEqual([{ query: { a: '["host1"]', q: 'a request' } }])
      })
    })
  })
})
