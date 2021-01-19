/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import { actions, getters, mutations } from '../store'
import { haystackApiService } from '../services'

const {
  SET_HAYSTACK_INFORMATION,
  SET_ENTITIES,
  SET_HISTORIES,
} = mutations
const entities = { rows: ['entity1', 'entity2'] }
describe('store', () => {

  beforeAll(() => {
    haystackApiService.getEntity = jest.fn()
    haystackApiService.getHistory = jest.fn()
  })
  beforeEach(() => {
    haystackApiService.getEntity.mockReturnValue(entities)
    haystackApiService.getHistory.mockReturnValue(['history'])
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('mutations', () => {

    describe('#SET_HAYSTACK_INFORMATION', () => {
      it('should set haystack information', () => {
        const state = { haystackInformation: null }
        SET_HAYSTACK_INFORMATION(state, { info: 'Haystack Information' })
        expect(state.haystackInformation).toEqual({ info: 'Haystack Information' })
      })
    })
    describe('#SET_ENTITIES', () => {
      it('should set entities', () => {
        const state = { entities: null }
        let entities = ['entity1', 'entity2']
        SET_ENTITIES(state, entities)
        expect(state.entities).toEqual(entities)
      })
    })
    describe('#SET_HISTORIES', () => {
      it('should set histories', () => {
        const state = { histories: null }
        let histories = [{ 'entity1': ['history'], 'entity2': ['history'] }]
        SET_HISTORIES(state, histories)
        expect(state.histories).toEqual(histories)
      })
    })

  })

  describe('getters', () => {

    describe('#haystackInformation', () => {
      it('should return haystack information', () => {
        const information = 'information'
        const state = { haystackInformation: information }
        const haystackInformation = getters.haystackInformation(state)
        expect(haystackInformation).toBe(information)
      })
    })
    describe('#entities', () => {
      it('should return entities', () => {
        const entities = ['entity1', 'entity2']
        const state = { entities }
        const entitiesStored = getters.entities(state)
        expect(entitiesStored).toEqual(entities)
      })
    })
    describe('#histories', () => {
      it('should return entities', () => {
        const histories = ['history1', 'history2']
        const state = { histories }
        const historiesStored = getters.histories(state)
        expect(historiesStored).toEqual(histories)
      })
    })
  })
  describe('actions', () => {
    let commit
    beforeEach(() => {
      commit = jest.fn()
    })
    afterEach(() => {
      commit.mockReset()
    })
    describe('#fetchEntity', () => {
      it('should commit news entities', async () => {
        const entity = 'site'
        await actions.fetchEntity({ commit }, entity)
        expect(commit).toHaveBeenNthCalledWith(1, 'SET_ENTITIES', entities.rows)
      })
    })
    describe('#fetchHistories', () => {
      it('should commit news histories', async () => {
        const idsEntity = ['id1', 'id2']
        const expected = { 'id1': ['history'], 'id2': ['history'] }
        await actions.fetchHistories({ commit }, { idsEntity })
        expect(commit).toHaveBeenNthCalledWith(1, 'SET_HISTORIES', expected)
      })
    })

  })
})
