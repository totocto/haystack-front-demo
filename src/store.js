/* eslint-disable no-shadow */
import Vuex from 'vuex'
import Vue from 'vue'
import { haystackApiService } from './services'

Vue.use(Vuex)
const state = {
  haystackInformation: null,
  entities: null
}
export const mutations = {
  SET_HAYSTACK_INFORMATION(state, information) {
    state.haystackInformation = information
  },
  SET_ENTITIES(state, entities) {
    state.entities = entities
  }
}
export const getters = {
  haystackInformation(state) {
    return state.haystackInformation
  },
  entities(state) {
    return state.entities
  }
}
export const actions = {
  async init(context) {
    const apiInformation = await haystackApiService.getHaystackInformation()
    context.commit('SET_HAYSTACK_INFORMATION', apiInformation)
  },
  async fetchEntity(context, { entity }) {
    console.log('IN FETCH')
    const entities = await haystackApiService.getEntity(entity)
    console.log(entities)
    context.commit('SET_ENTITIES', entities.rows)
  }
}
export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state
})
