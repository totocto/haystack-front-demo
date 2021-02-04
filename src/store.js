/* eslint-disable no-shadow */
import Vuex from 'vuex'
import Vue from 'vue'
import HaystackApiService from './services/haystackApi.service'
import formatService from './services/format.service'

Vue.use(Vuex)
window.env = window.env || {}
const state = {
  entities: [[]],
  histories: [{}],
  apiServers: [new HaystackApiService({ haystackApiHost: window.env.HAYSTACK_API_HOST })],
  isDataLoaded: false,
  filterApi: ''
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
  DELETE_HAYSTACK_API(state, { haystackApiHost }) {
    const newApiServers = state.apiServers.slice()
    const newHistories = state.histories.slice()
    const indexOfApiServerToDelete = state.apiServers.findIndex(
      apiServer => apiServer.haystackApiHost === haystackApiHost
    )
    state.histories = newHistories.slice(indexOfApiServerToDelete, indexOfApiServerToDelete)
    state.apiServers = newApiServers.filter(apiServer => apiServer.haystackApiHost !== haystackApiHost)
  },
  SET_IS_DATA_LOADED(state, { isDataLoaded }) {
    state.isDataLoaded = isDataLoaded
  },
  SET_API_SERVERS(state, { apiServers }) {
    const newApiServers = []
    // eslint-disable-next-line
    apiServers.map(apiServer => {
      newApiServers.push(new HaystackApiService({ haystackApiHost: apiServer }))
    })
    state.apiServers = apiServers
  },
  SET_HAYSTACK_API(state, { haystackApiHost }) {
    const newApiServers = state.apiServers.slice()
    newApiServers.push(new HaystackApiService({ haystackApiHost }))
    state.apiServers = newApiServers
  },
  SET_FILTER_API(state, { filterApi }) {
    state.filterApi = filterApi
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
  },
  isDataLoaded(state) {
    return state.isDataLoaded
  },
  filterApi(state) {
    return state.filterApi
  }
}
export const actions = {
  createApiServer(context, { haystackApiHost }) {
    context.commit('SET_HAYSTACK_API', { haystackApiHost })
  },
  async fetchEntity(context, { entity, apiNumber }) {
    const entities = await state.apiServers[apiNumber].getEntity(entity)
    await context.commit('SET_ENTITIES', { entities: entities.rows, apiNumber })
  },
  async fetchHistories(context, { idsEntityWithHis, apiNumber }) {
    const histories = await Promise.all(
      idsEntityWithHis.map(async id => {
        return state.apiServers[apiNumber].getHistory(id)
      })
    )
    const idHistories = {}
    // eslint-disable-next-line no-return-assign
    idsEntityWithHis.forEach((key, index) => (idHistories[key] = histories[index]))
    await context.commit('SET_HISTORIES', { idHistories, apiNumber })
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
  async fetchAllHistories(context) {
    const { apiServers } = context.getters
    const { entities } = context.getters
    const groupEntities = entities.length === 1 ? entities[0] : formatService.groupAllEntitiesById(entities)
    const idsEntityWithHis = groupEntities
      .filter(entity => entity.his)
      .map(entity => {
        return formatService.formatIdEntity(entity.id)
      })
    await Promise.all(
      // eslint-disable-next-line
      await apiServers.map(async (apiServer, index) => {
        await context.dispatch('fetchHistories', { idsEntityWithHis, apiNumber: index })
      })
    )
  },
  async reloadAllData(context, { entity }) {
    context.commit('SET_IS_DATA_LOADED', { isDataLoaded: false })
    await Promise.all([
      await context.dispatch('fetchAllEntity', { entity }),
      await context.dispatch('fetchAllHistories')
    ])
    context.commit('SET_IS_DATA_LOADED', { isDataLoaded: true })
  }
}
export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state
})
