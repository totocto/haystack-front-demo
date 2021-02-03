import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import sinon from 'sinon'
import VMainLayout from '../VMainLayout.vue'

Vue.use(Vuex)
let wrapper
let actions
let mutations
const globalStubs = ['router-view', 'v-app-bar', 'v-img', 'v-spacer', 'v-text-field', 'v-select']
describe('VMainLayout.vue', () => {
  beforeEach(() => {
    mutations = {
      DELETE_HAYSTACK_API: sinon.stub()
    }
    actions = {
      init: sinon.stub(),
      reloadAllData: sinon.stub(),
      createApiServer: sinon.stub(),
      DELETE_HAYSTACK_API: sinon.stub()
    }
    wrapper = shallowMount(VMainLayout, {
      stubs: globalStubs,
      mocks: {
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
    })
    describe('#updateAPI', () => {
      describe('When api already exists', () => {
        it('should call commit', async () => {
          const haystackApiHost = 'host1'
          await wrapper.vm.updateAPI(haystackApiHost)
          expect(actions.createApiServer.called).toBeFalse()
          expect(actions.reloadAllData.called).toBeFalse()
        })
      })
      describe('When api does not exists', () => {
        it('should call commit', async () => {
          const haystackApiHost = 'host2'
          await wrapper.vm.updateAPI(haystackApiHost)
          expect(actions.createApiServer.calledOnce).toBeTrue()
          expect(actions.reloadAllData.calledOnce).toBeTrue()
          expect(actions.createApiServer.args[0][1]).toEqual({ haystackApiHost })
          expect(actions.reloadAllData.args[0][1]).toEqual({ entity: 'a filter' })
        })
      })
    })
  })
})
