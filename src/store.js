/* eslint-disable no-shadow */
import Vuex from 'vuex'
import Vue from 'vue'
import { haystackApiService } from './services'

Vue.use(Vuex)
const state = {
  haystackInformation: null,
  entities: null,
  histories: []
}
export const mutations = {
  SET_HAYSTACK_INFORMATION(state, information) {
    state.haystackInformation = information
  },
  SET_ENTITIES(state, entities) {
    state.entities = entities
  },
  SET_HISTORIES(state, histories) {
    state.histories = histories
  }
}
export const getters = {
  haystackInformation(state) {
    return state.haystackInformation
  },
  entities(state) {
    return state.entities
  },
  histories(state) {
    return state.histories
  }
}
export const actions = {
  async init(context) {
    const apiInformation = await haystackApiService.getHaystackInformation()
    context.commit('SET_HAYSTACK_INFORMATION', apiInformation)
  },
  async fetchEntity(context, { entity }) {
    const entities = await haystackApiService.getEntity(entity)
    context.commit('SET_ENTITIES', entities.rows)
  },
  async fetchHistories(context, { idsEntity }) {
    const historiesPromises = await idsEntity.map(async id => {
      return haystackApiService.getHistory(id)
    })
    const histories = await Promise.all(historiesPromises)
    const idHistories = {}
    // eslint-disable-next-line no-return-assign
    idsEntity.forEach((key, index) => (idHistories[key] = histories[index]))
    context.commit('SET_HISTORIES', idHistories)
  }
}
export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state
})
