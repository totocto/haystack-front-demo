/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import sinon from 'sinon'
import { actions, getters, mutations } from '../store'
import HaystackApiService from '../services/haystackApi.service'

const { SET_ENTITIES, SET_HISTORIES } = mutations
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
        const state = { entities: [null, null] }
        const entities = ['entity1', 'entity2']
        SET_ENTITIES(state, { entities, apiNumber: 0 })
        expect(state.entities).toEqual([entities, null])
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
    describe('#fetchEntity', () => {
      describe('When api exists', () => {
        it('should commit news entities to the first api', async () => {
          const entity = 'site'
          const apiNumber = 0
          await actions.fetchEntity({ commit }, { entity, apiNumber })
          expect(commit).toHaveBeenNthCalledWith(1, 'SET_ENTITIES', { entities: entities.rows, apiNumber: 0 })
        })
      })
      describe('When api does not exist', () => {
        it('should not commit news entities to the second api if no api declared', async () => {
          const entity = 'site'
          const apiNumber = 1
          await actions.fetchEntity({ commit }, { entity, apiNumber })
          expect(commit).not.toHaveBeenCalled()
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
      describe('When Api exists', () => {
        it('should not commit news histories to the second api', async () => {
          const idsEntity = ['id1', 'id2']
          const apiNumber = 1
          await actions.fetchHistories({ commit }, { idsEntity, apiNumber })
          expect(commit).not.toHaveBeenCalled()
        })
      })
    })
    describe('#fetchAllHistories', () => {
      it('should fetch histories for both api', async () => {
        const idsEntity = ['id1', 'id2']
        await actions.fetchAllHistories({ dispatch }, { idsEntity })
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(dispatch).toHaveBeenNthCalledWith(1, 'fetchHistories', { apiNumber: 0, idsEntity: ['id1', 'id2'] })
        expect(dispatch).toHaveBeenNthCalledWith(2, 'fetchHistories', { apiNumber: 1, idsEntity: ['id1', 'id2'] })
      })
    })
    describe('#fetchAllEntity', () => {
      it('should fetch entities for both api', async () => {
        const entity = 'site'
        await actions.fetchAllEntity({ dispatch }, { entity })
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(dispatch).toHaveBeenNthCalledWith(1, 'fetchEntity', { apiNumber: 0, entity: 'site' })
        expect(dispatch).toHaveBeenNthCalledWith(2, 'fetchEntity', { apiNumber: 1, entity: 'site' })
      })
    })
  })
})
