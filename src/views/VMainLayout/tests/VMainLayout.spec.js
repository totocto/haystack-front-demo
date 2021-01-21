import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import sinon from 'sinon'
import VMainLayout from '../VMainLayout.vue'

Vue.use(Vuex)
let wrapper
let actions
const globalStubs = ['router-view', 'v-app-bar', 'v-img', 'v-spacer']
describe('VMainLayout.vue', () => {
  beforeEach(() => {
    actions = {
      init: sinon.stub()
    }
    wrapper = shallowMount(VMainLayout, {
      stubs: globalStubs,
      mocks: {
        $store: new Vuex.Store({
          getters: {
            haystackInformation: () => 'This is Haystack'
          },
          actions
        })
      }
    })
  })
  it('should mount the component', () => {
    expect(wrapper).toBeDefined()
  })
  it('should dispatch init', () => {
    expect(actions.init.calledOnce).toBeTrue()
  })
})
