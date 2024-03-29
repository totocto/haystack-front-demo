/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import sinon from 'sinon'
import { actions, getters, mutations } from '../store'
import HaystackApiService from '../services/haystackApi.service'

const {
  ADD_NEW_ENTITIES,
  ADD_NEW_HISTORIES,
  SET_HAYSTACK_API,
  SET_FILTER_API,
  DELETE_HAYSTACK_API,
  SET_API_SERVERS
} = mutations
const entities = { rows: [{ entityName: 'entity1' }, { entityName: 'entity2' }] }
describe('store', () => {
  beforeAll(() => {
    const getEntityStub = sinon.stub(HaystackApiService.prototype, 'getEntity')
    getEntityStub.returns(entities)
    const getIsHisAvailableStub = sinon.stub(HaystackApiService.prototype, 'isHisReadAvailable')
    getIsHisAvailableStub.returns(true)
    const isHaystackApiStub = sinon.stub(HaystackApiService.prototype, 'isHaystackApi')
    isHaystackApiStub.returns(true)
    const getHistoryStub = sinon.stub(HaystackApiService.prototype, 'getHistory')
    getHistoryStub.returns(['history1'])
  })
  describe('mutations', () => {
    describe('#ADD_NEW_ENTITIES', () => {
      it('should set entities', () => {
        const state = { entities: [[]] }
        const entities = ['entity1', 'entity2']
        ADD_NEW_ENTITIES(state, { entities, apiNumber: 0 })
        expect(state.entities).toEqual([entities])
      })
      it('should set entities', () => {
        const state = { entities: [['entity1']] }
        const entities = ['entity1', 'entity2']
        ADD_NEW_ENTITIES(state, { entities, apiNumber: 1 })
        expect(state.entities).toEqual([['entity1'], entities])
      })
      it('should set entities', () => {
        const state = { entities: [['entity1'], ['entity2']] }
        const entities = ['entity1', 'entity2']
        ADD_NEW_ENTITIES(state, { entities, apiNumber: 1 })
        expect(state.entities).toEqual([['entity1'], entities])
      })
    })
    describe('#SET_FILTER_API', () => {
      it('should set filterApi', () => {
        const state = { filterApi: '' }
        const newFilterApi = 'a filter'
        SET_FILTER_API(state, { filterApi: newFilterApi })
        expect(state.filterApi).toBe(newFilterApi)
      })
    })
    describe('#ADD_NEW_HISTORIES', () => {
      it('should set histories', () => {
        const state = { histories: [{}, {}] }
        const idHistories = { entity1: ['history'], entity2: ['history'] }
        ADD_NEW_HISTORIES(state, { idHistories, apiNumber: 0 })
        expect(state.histories).toEqual([idHistories, {}])
      })
    })
    describe('#DELETE_HAYSTACK_API', () => {
      it('should delete the corresponding apiServer', () => {
        const haystackApiHost = 'a server'
        const state = { apiServers: [{ haystackApiHost }], histories: [['an history']], entities: [['an entity']] }
        DELETE_HAYSTACK_API(state, { haystackApiHost })
        expect(state.apiServers).toEqual([])
        expect(state.histories).toEqual([])
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
    describe('#SET_API_SERVERS', () => {
      it('should create default apiServers in store', () => {
        // GIVEN
        const state = { apiServers: [] }
        const apiServers = ['apiServer1', 'apiServer2']
        // WHEN
        SET_API_SERVERS(state, { apiServers })
        // THEN
        const expected = [
          new HaystackApiService({ haystackApiHost: 'apiServer1' }),
          new HaystackApiService({ haystackApiHost: 'apiServer2' })
        ]
        expect(state.apiServers).toEqual(expected)
      })
    })
  })

  describe('getters', () => {
    describe('#filterApi', () => {
      it('should return filterApi', () => {
        const filterApi = 'a filter'
        const state = { filterApi }
        const filterApiStored = getters.filterApi(state)
        expect(filterApiStored).toBe(filterApi)
      })
    })
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
          const haystackApiHost = ''
          const getters = { apiServers: [new HaystackApiService({ haystackApiHost })] }
          await actions.fetchEntity({ getters, dispatch }, { entity, apiNumber })
          expect(dispatch).toHaveBeenNthCalledWith(1, 'commitNewEntities', { entities: entities.rows, apiNumber: 0 })
        })
      })
    })
    describe('#fetchHistories', () => {
      // MORE TEST TO RIGHT: WHICH API CALL
      describe('When Api exists', () => {
        describe('When histories asked are from the correct API', () => {
          it('should commit news histories to the api record', async () => {
            // GIVEN
            const idsEntityWithHis = [
              { id: 'id1', apiSource: 1 },
              { id: 'id2', apiSource: 1 }
            ]
            const apiNumber = 0
            const haystackApiHost = ''
            const getters = { apiServers: [new HaystackApiService({ haystackApiHost })] }

            // WHEN
            await actions.fetchHistories({ getters, commit }, { idsEntityWithHis, apiNumber })

            // THEN
            const expected = { apiNumber: 0, idHistories: { id1: ['history1'], id2: ['history1'] } }
            expect(commit).toHaveBeenNthCalledWith(1, 'ADD_NEW_HISTORIES', expected)
          })
        })
        describe('When histories asked are not from the correct API', () => {
          it('should commit empty array as histories to the api record', async () => {
            // GIVEN
            const idsEntityWithHis = [
              { id: 'id1', apiSource: 2 },
              { id: 'id2', apiSource: 2 }
            ]
            const apiNumber = 0
            const haystackApiHost = ''
            const getters = { apiServers: [new HaystackApiService({ haystackApiHost })] }

            // WHEN
            await actions.fetchHistories({ getters, commit }, { idsEntityWithHis, apiNumber })

            // THEN
            const expected = { apiNumber: 0, idHistories: { id1: [], id2: [] } }
            expect(commit).toHaveBeenNthCalledWith(1, 'ADD_NEW_HISTORIES', expected)
          })
        })
      })
    })
    describe('#fetchAllHistories', () => {
      it('should fetch histories for 2 api when there is 2 api', async () => {
        const getters = {
          apiServers: ['api1', 'api2'],
          entities: [
            [
              { id: { val: 'r:id1 entity name' }, his: { val: 'm:', apiSource: 1 } },
              { id: { val: 'r:id2 entity name' }, his: { val: 'm:', apiSource: 2 } }
            ]
          ]
        }
        await actions.fetchAllHistories({ dispatch, getters })
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(dispatch).toHaveBeenNthCalledWith(1, 'fetchHistories', {
          apiNumber: 0,
          idsEntityWithHis: [
            { id: 'id1', apiSource: 1 },
            { id: 'id2', apiSource: 2 }
          ]
        })
        expect(dispatch).toHaveBeenNthCalledWith(2, 'fetchHistories', {
          apiNumber: 1,
          idsEntityWithHis: [
            { id: 'id1', apiSource: 1 },
            { id: 'id2', apiSource: 2 }
          ]
        })
      })
      it('should fetch histories for 3 api when there is 3 api', async () => {
        const getters = {
          apiServers: ['api1', 'api2', 'api3'],
          entities: [
            [
              { id: { val: 'r:id1 entity name' }, his: { val: 'm:', apiSource: 1 } },
              { id: { val: 'r:id2 entity name' }, his: { val: 'm:', apiSource: 2 } }
            ]
          ]
        }
        await actions.fetchAllHistories({ dispatch, getters })
        expect(dispatch).toHaveBeenCalledTimes(3)
        expect(dispatch).toHaveBeenNthCalledWith(1, 'fetchHistories', {
          apiNumber: 0,
          idsEntityWithHis: [
            { id: 'id1', apiSource: 1 },
            { id: 'id2', apiSource: 2 }
          ]
        })
        expect(dispatch).toHaveBeenNthCalledWith(2, 'fetchHistories', {
          apiNumber: 1,
          idsEntityWithHis: [
            { id: 'id1', apiSource: 1 },
            { id: 'id2', apiSource: 2 }
          ]
        })
        expect(dispatch).toHaveBeenNthCalledWith(3, 'fetchHistories', {
          apiNumber: 2,
          idsEntityWithHis: [
            { id: 'id1', apiSource: 1 },
            { id: 'id2', apiSource: 2 }
          ]
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
    describe('#reloadAllData', () => {
      it('should call fetchAllHistories', async () => {
        const entity = 'an entity'
        const getters = { apiServers: ['1', '2'] }
        await actions.reloadAllData({ dispatch, commit, getters }, { entity })
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(dispatch).toHaveBeenNthCalledWith(1, 'fetchAllEntity', { entity })
        expect(dispatch).toHaveBeenNthCalledWith(2, 'fetchAllHistories')
      })
      it('should commit twice SET_IS_DATA_LOADED', async () => {
        const entity = 'an entity'
        const getters = { apiServers: ['1', '2'] }
        await actions.reloadAllData({ dispatch, commit, getters }, { entity })
        expect(commit).toHaveBeenCalledTimes(2)
        expect(commit).toHaveBeenNthCalledWith(1, 'SET_IS_DATA_LOADED', { isDataLoaded: false })
        expect(commit).toHaveBeenNthCalledWith(2, 'SET_IS_DATA_LOADED', { isDataLoaded: true })
      })
    })
  })
})
