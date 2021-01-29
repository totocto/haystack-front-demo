/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import sinon from 'sinon'
import { actions, getters, mutations } from '../store'
import HaystackApiService from '../services/haystackApi.service'

const { SET_ENTITIES, SET_HISTORIES, SET_HAYSTACK_API } = mutations
const entities = { rows: ['entity1', 'entity2'] }
describe('store', () => {
  beforeAll(() => {
    const getEntityStub = sinon.stub(HaystackApiService.prototype, 'getEntity')
    getEntityStub.returns(entities)
    const getHistoryStub = sinon.stub(HaystackApiService.prototype, 'getHistory')
    getHistoryStub.returns(['history1'])
  })
  describe('mutations', () => {
    describe('#SET_ENTITIES', () => {
      it('should set entities', () => {
        const state = { entities: [[]] }
        const entities = ['entity1', 'entity2']
        SET_ENTITIES(state, { entities, apiNumber: 0 })
        expect(state.entities).toEqual([entities])
      })
      it('should set entities', () => {
        const state = { entities: [['entity1']] }
        const entities = ['entity1', 'entity2']
        SET_ENTITIES(state, { entities, apiNumber: 1 })
        expect(state.entities).toEqual([['entity1'], entities])
      })
      it('should set entities', () => {
        const state = { entities: [['entity1'], ['entity2']] }
        const entities = ['entity1', 'entity2']
        SET_ENTITIES(state, { entities, apiNumber: 1 })
        expect(state.entities).toEqual([['entity1'], entities])
      })
    })
    describe('#SET_HISTORIES', () => {
      it('should set histories', () => {
        const state = { histories: [{}, {}] }
        const idHistories = { entity1: ['history'], entity2: ['history'] }
        SET_HISTORIES(state, { idHistories, apiNumber: 0 })
        expect(state.histories).toEqual([idHistories, {}])
      })
    })
    describe('#SET_HAYSTACK_API', () => {
      describe('When there is no available Api servers', () => {
        it('should instanced a new haystackApi', () => {
          const state = { apiServers: [] }
          const haystackApiHost = 'anHost'
          const expected = new HaystackApiService({ haystackApiHost })
          SET_HAYSTACK_API(state, { haystackApiHost })
          expect(state.apiServers).toEqual([expected])
        })
      })
      describe('When there is already api servers', () => {
        it('should instanced a new haystackApi and add it in state', () => {
          const state = { apiServers: ['an api server'] }
          const haystackApiHost = 'anHost'
          const expected = ['an api server', new HaystackApiService({ haystackApiHost })]
          SET_HAYSTACK_API(state, { haystackApiHost })
          expect(state.apiServers).toEqual(expected)
        })
      })
    })
  })

  describe('getters', () => {
    describe('#entities', () => {
      it('should return entities', () => {
        const entities = [['entity1', 'entity2'], null]
        const state = { entities }
        const entitiesStored = getters.entities(state)
        expect(entitiesStored).toEqual(entities)
      })
    })
    describe('#histories', () => {
      it('should return entities', () => {
        const histories = [['history1', 'history2'], []]
        const state = { histories }
        const historiesStored = getters.histories(state)
        expect(historiesStored).toEqual(histories)
      })
    })
    describe('#apiServers', () => {
      it('should return apiServers', () => {
        const apiServers = ['api1', 'api2']
        const state = { apiServers }
        const apiServersStored = getters.apiServers(state)
        expect(apiServersStored).toEqual(apiServers)
      })
    })
  })
  describe('actions', () => {
    let commit
    let dispatch
    beforeEach(() => {
      dispatch = jest.fn()
      commit = jest.fn()
    })
    afterEach(() => {
      commit.mockReset()
      dispatch.mockReset()
    })
    describe('#createApiServer', () => {
      it('should commit a new apiServer', async () => {
        const haystackApiHost = 'aHost'
        await actions.createApiServer({ commit }, { haystackApiHost })
        expect(commit).toHaveBeenCalled()
        expect(commit).toHaveBeenNthCalledWith(1, 'SET_HAYSTACK_API', { haystackApiHost })
      })
    })
    describe('#fetchEntity', () => {
      describe('When api exists', () => {
        it('should commit news entities to the first api', async () => {
          const entity = 'site'
          const apiNumber = 0
          await actions.fetchEntity({ commit }, { entity, apiNumber })
          expect(commit).toHaveBeenNthCalledWith(1, 'SET_ENTITIES', { entities: entities.rows, apiNumber: 0 })
        })
      })
    })
    describe('#fetchHistories', () => {
      describe('When Api exists', () => {
        it('should commit news histories to the first api', async () => {
          const idsEntity = ['id1', 'id2']
          const apiNumber = 0
          const expected = { apiNumber: 0, idHistories: { id1: ['history1'], id2: ['history1'] } }
          await actions.fetchHistories({ commit }, { idsEntity, apiNumber })
          expect(commit).toHaveBeenNthCalledWith(1, 'SET_HISTORIES', expected)
        })
      })
    })
    describe('#fetchAllHistories', () => {
      it('should fetch histories for 2 api when there is 2 api', async () => {
        const getters = { apiServers: ['api1', 'api2'] }
        const idsEntity = ['id1', 'id2']
        await actions.fetchAllHistories({ dispatch, getters }, { idsEntity })
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(dispatch).toHaveBeenNthCalledWith(1, 'fetchHistories', { apiNumber: 0, idsEntity: ['id1', 'id2'] })
        expect(dispatch).toHaveBeenNthCalledWith(2, 'fetchHistories', { apiNumber: 1, idsEntity: ['id1', 'id2'] })
      })
      it('should fetch histories for 3 api when there is 3 api', async () => {
        const getters = { apiServers: ['api1', 'api2', 'api3'] }
        const idsEntity = ['id1', 'id2']
        await actions.fetchAllHistories({ dispatch, getters }, { idsEntity })
        expect(dispatch).toHaveBeenCalledTimes(3)
        expect(dispatch).toHaveBeenNthCalledWith(1, 'fetchHistories', { apiNumber: 0, idsEntity: ['id1', 'id2'] })
        expect(dispatch).toHaveBeenNthCalledWith(2, 'fetchHistories', { apiNumber: 1, idsEntity: ['id1', 'id2'] })
        expect(dispatch).toHaveBeenNthCalledWith(3, 'fetchHistories', { apiNumber: 2, idsEntity: ['id1', 'id2'] })
      })
    })
    describe('#fetchAllEntity', () => {
      it('should fetch entities for 2 api when there is 2 api servers', async () => {
        const entity = 'site'
        const getters = { apiServers: ['api1', 'api2'] }
        await actions.fetchAllEntity({ dispatch, getters }, { entity })
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(dispatch).toHaveBeenNthCalledWith(1, 'fetchEntity', { apiNumber: 0, entity: 'site' })
        expect(dispatch).toHaveBeenNthCalledWith(2, 'fetchEntity', { apiNumber: 1, entity: 'site' })
      })
      it('should fetch entities for 3 api when there is 3 api servers', async () => {
        const entity = 'site'
        const getters = { apiServers: ['api1', 'api2', 'api3'] }
        await actions.fetchAllEntity({ dispatch, getters }, { entity })
        expect(dispatch).toHaveBeenCalledTimes(3)
        expect(dispatch).toHaveBeenNthCalledWith(1, 'fetchEntity', { apiNumber: 0, entity: 'site' })
        expect(dispatch).toHaveBeenNthCalledWith(2, 'fetchEntity', { apiNumber: 1, entity: 'site' })
        expect(dispatch).toHaveBeenNthCalledWith(3, 'fetchEntity', { apiNumber: 2, entity: 'site' })
      })
    })
  })
})
