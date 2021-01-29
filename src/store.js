/* eslint-disable no-shadow */
import Vuex from 'vuex'
import Vue from 'vue'
import HaystackApiService from './services/haystackApi.service'

Vue.use(Vuex)
window.env = window.env || {}
const state = {
  entities: [[]],
  histories: [{}],
  apiServers: [new HaystackApiService({ haystackApiHost: window.env.HAYSTACK_API_HOST })]
}
export const mutations = {
  SET_ENTITIES(state, { entities, apiNumber }) {
    const newEntities = state.entities.slice()
    // eslint-disable-next-line
    newEntities.length < apiNumber ? newEntities.push(entities) : (newEntities[apiNumber] = entities)
    state.entities = newEntities
  },
  SET_HISTORIES(state, { idHistories, apiNumber }) {
    const newHistories = state.histories.slice()
    // eslint-disable-next-line
    newHistories.length < apiNumber + 1 ? newHistories.push(idHistories) : (newHistories[apiNumber] = idHistories)
    state.histories = newHistories
  },
  SET_HAYSTACK_API(state, { haystackApiHost }) {
    const newApiServers = state.apiServers.slice()
    newApiServers.push(new HaystackApiService({ haystackApiHost }))
    state.apiServers = newApiServers
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
  apiNumber(state) {
    return state.apiServers.length
  }
}
export const actions = {
  createApiServer(context, { haystackApiHost }) {
    context.commit('SET_HAYSTACK_API', { haystackApiHost })
  },
  async fetchEntity(context, { entity, apiNumber }) {
    const entities = await state.apiServers[apiNumber].getEntity(entity)
    context.commit('SET_ENTITIES', { entities: entities.rows, apiNumber })
  },
  async fetchHistories(context, { idsEntity, apiNumber }) {
    const histories = await Promise.all(
      idsEntity.map(async id => {
        return state.apiServers[apiNumber].getHistory(id)
      })
    )
    const idHistories = {}
    // eslint-disable-next-line no-return-assign
    idsEntity.forEach((key, index) => (idHistories[key] = histories[index]))
    context.commit('SET_HISTORIES', { idHistories, apiNumber })
  },
  async fetchAllEntity(context, { entity }) {
    const { apiServers } = context.getters
    await Promise.all(
      // eslint-disable-next-line
      apiServers.map(async (apiServer, index) => {
        await context.dispatch('fetchEntity', { entity, apiNumber: index })
      })
    )
  },
  async fetchAllHistories(context, { idsEntity }) {
    const { apiServers } = context.getters
    await Promise.all(
      // eslint-disable-next-line
      apiServers.map((apiServer, index) => {
        context.dispatch('fetchHistories', { idsEntity, apiNumber: index })
      })
    )
  }
}
export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state
})
