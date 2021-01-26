/* eslint-disable no-shadow */
import Vuex from 'vuex'
import Vue from 'vue'
import HaystackApiService from './services/haystackApi.service'

Vue.use(Vuex)
window.env = window.env || {}
const state = {
  entities: { 0: null, 1: null },
  histories: { 0: [], 1: [] },
  apiServers: [new HaystackApiService({ haystackApiHost: window.env.HAYSTACK_API_HOST }), null],
  isMultiApi: false
}
export const mutations = {
  SET_ENTITIES(state, { entities, apiNumber }) {
    state.entities[apiNumber] = entities
  },
  SET_IS_MULTI_API(state, isMultiApi) {
    state.isMultiApi = isMultiApi
  },
  SET_HISTORIES(state, { idHistories, apiNumber }) {
    state.histories[apiNumber] = idHistories
  },
  SET_HAYSTACK_API(state, { apiNumber, haystackApiHost }) {
    const newApi = new HaystackApiService({ haystackApiHost })
    state.apiServers[apiNumber] = newApi
  }
}
export const getters = {
  apiServers(state) {
    return state.apiServers
  },
  entities(state) {
    return state.entities
  },
  histories(state) {
    return state.histories
  },
  isMultiApi(state) {
    return state.isMultiApi
  }
}
export const actions = {
  createApiServer(context, { haystackApiHost, apiNumber }) {
    context.commit('SET_HAYSTACK_API', { apiNumber, haystackApiHost })
  },
  activateMultiApi(context, isMultiApi) {
    context.commit('SET_IS_MULTI_API', isMultiApi)
  },
  async fetchEntity(context, { entity, apiNumber }) {
    if (!state.apiServers[apiNumber]) return
    const entities = await state.apiServers[apiNumber].getEntity(entity)
    context.commit('SET_ENTITIES', { entities: entities.rows, apiNumber })
  },
  async fetchHistories(context, { idsEntity, apiNumber }) {
    if (!state.apiServers[apiNumber]) return
    const historiesPromises = await idsEntity.map(async id => {
      return state.apiServers[apiNumber].getHistory(id)
    })
    const histories = await Promise.all(historiesPromises)
    const idHistories = {}
    // eslint-disable-next-line no-return-assign
    idsEntity.forEach((key, index) => (idHistories[key] = histories[index]))
    context.commit('SET_HISTORIES', { idHistories, apiNumber })
  },
  async fetchAllEntity(context, { entity }) {
    await Promise.all([
      context.dispatch('fetchEntity', { entity, apiNumber: 0 }),
      context.dispatch('fetchEntity', { entity, apiNumber: 1 })
    ])
  },
  async fetchAllHistories(context, { idsEntity }) {
    await Promise.all([
      context.dispatch('fetchHistories', { idsEntity, apiNumber: 0 }),
      context.dispatch('fetchHistories', { idsEntity, apiNumber: 1 })
    ])
  }
}
export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state
})
