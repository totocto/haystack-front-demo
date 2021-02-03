import { formatService } from '..'

describe('formatService', () => {
  describe('#formatXAxis', () => {
    it('should format xAxisValues', () => {
      // GIVEN
      const history = [
        { ts: 't:2020-07-01T00:00:00+00:00 UTC', val: 'n:64.00000' },
        { ts: 't:2020-08-01T00:00:00+00:00 UTC', val: 'n:4.00000' }
      ]
      // WHEN
      const output = formatService.formatXAxis(history)
      // THEN
      const expected = ['07/2020', '08/2020']
      expect(output).toEqual(expected)
    })
  })
  describe('#formatYAxis', () => {
    it('should format formatYAxis', () => {
      // GIVEN
      const history = [
        { ts: 't:2020-07-01T00:00:00+00:00 UTC', val: 'n:64.00000' },
        { ts: 't:2020-08-01T00:00:00+00:00 UTC', val: 'n:4.00000' }
      ]
      // WHEN
      const output = formatService.formatYAxis(history)
      // THEN
      const expected = [64, 4]
      expect(output).toEqual(expected)
    })
  })
  describe('#isRef', () => {
    it('should return true when this is a ref', () => {
      // GIVEN
      const ref = 'r:Something as a ref'
      // WHEN
      const output = formatService.isRef(ref)
      // THEN
      expect(output).toBeTrue()
    })
    it('should return false when this is not a ref', () => {
      // GIVEN
      const ref = 'p:Something which is not a ref'
      // WHEN
      const output = formatService.isRef(ref)
      // THEN
      expect(output).toBeFalse()
    })
  })

  describe('#isEntityFromSource', () => {
    describe('When entity is from source', () => {
      it('should return true', () => {
        // GIVEN
        const entitiesFromAllSource = [[{ id: 'id1' }, { ts: 'id2' }]]
        const entityIdToFind = 'id1'
        // WHEN
        const output = formatService.isEntityFromSource(entitiesFromAllSource, entityIdToFind)
        // THEN
        expect(output).toBeTrue()
      })
      it('should return true', () => {
        // GIVEN
        const entitiesFromAllSource = [
          [{ id: 'id1' }, { id: 'id2' }],
          [{ id: 'id3' }, { id: 'id4' }]
        ]
        const entityIdToFind = 'id4'
        // WHEN
        const output = formatService.isEntityFromSource(entitiesFromAllSource, entityIdToFind)
        // THEN
        expect(output).toBeTrue()
      })
    })
    describe('When entity is not from source', () => {
      it('should return false', () => {
        // GIVEN
        const entitiesFromAllSource = [[{ id: 'id"' }, { id: 'id3' }]]
        const entityIdToFind = 'id1'
        // WHEN
        const output = formatService.isEntityFromSource(entitiesFromAllSource, entityIdToFind)
        // THEN
        expect(output).toBeFalse()
      })
    })
  })

  describe('groupAllEntitiesById', () => {
    it('should Group By Id All entities', () => {
      // GIVEN
      const firstEntity = [{ id: 1, key1: 'value1', key2: 'value2', key3: 'value3' }]
      const secondEntity = [{ id: 1, key1: 'value1', key2: 'value2Bis', key4: 'value4' }]
      const thirdEntity = [{ id: 2, key1: 'value1bis', key5: 'value5' }]
      const entities = [firstEntity, secondEntity, thirdEntity]
      // WHEN
      const output = formatService.groupAllEntitiesById(entities)
      // THEN
      const expected = [
        { id: 1, key1: 'value1', key2_1: 'value2', key2_2: 'value2Bis', key3: 'value3', key4: 'value4' },
        { id: 2, key1: 'value1bis', key5: 'value5' }
      ]
      expect(output).toEqual(expected)
    })
  })
  describe('#getLinkBetweenEntities', () => {
    describe('When entityLink is from source', () => {
      it('should return link from source, and an empty array', () => {
        const entitiesFromAllSource = [
          [{ id: 'r:id1 name of first ref', oneRef: 'r:aRef name of second ref' }, { id: 'r:aRef name of second ref' }]
        ]
        const result = formatService.getLinkBetweenEntities(entitiesFromAllSource)
        const nodeColor = []
        const linkBetweenEntities = [['name of first ref', 'name of second ref']]
        const entityNameToRef = { 'name of second ref': 'aRef' }
        expect(result).toEqual([linkBetweenEntities, nodeColor, entityNameToRef])
      })
      it('should return only link from source', () => {
        const entitiesFromAllSource = [
          [{ id: 'r:id1 name of first ref', oneRef: 'r:aRef name of second ref' }],
          [{ id: 'r:aRef name of second ref' }]
        ]
        const result = formatService.getLinkBetweenEntities(entitiesFromAllSource)
        const colorNodesOutsideFromSource = []
        const linksBetweenEntities = [['name of first ref', 'name of second ref']]
        const entityNameToRef = { 'name of second ref': 'aRef' }
        expect(result).toEqual([linksBetweenEntities, colorNodesOutsideFromSource, entityNameToRef])
      })
    })
    describe('When entityLink is not from source', () => {
      it('should return only link outside from source', () => {
        const entitiesFromAllSource = [[{ id: 'r:id1 name of first ref', oneRef: 'r:aRef name of second ref' }]]
        const result = formatService.getLinkBetweenEntities(entitiesFromAllSource)
        const linkBetweenEntities = [['name of first ref', 'name of second ref']]
        const colorsForNodeOutsideFromSource = [{ color: '#ff0000', id: 'name of second ref' }]
        const entityNameToRef = { 'name of second ref': 'aRef' }
        expect(result).toEqual([linkBetweenEntities, colorsForNodeOutsideFromSource, entityNameToRef])
      })
    })
  })
  describe('#groupTwoEntitiesById', () => {
    describe('When entities have not similar entity', () => {
      it('should merge both entities', () => {
        const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
        const entityFromSecondSource = [{ id: 'id2', key2: 12 }]

        const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

        const expected = [
          { id: 'id1', key1: 10 },
          { id: 'id2', key2: 12 }
        ]
        expect(output).toEqual(expected)
      })
    })
    describe('When both entities have a similar entity', () => {
      describe('When all key are different', () => {
        it('should return a merge of of this entity', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
          const entityFromSecondSource = [{ id: 'id1', key2: 12 }]

          const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: 'id1', key1: 10, key2: 12 }]
          expect(output).toEqual(expected)
        })
      })
      describe('When there is one key with same value', () => {
        it('should merge with only one sample of the key value similar', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
          const entityFromSecondSource = [{ id: 'id1', key2: 12, key1: 10 }]

          const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: 'id1', key1: 10, key2: 12 }]
          expect(output).toEqual(expected)
        })
      })
      describe('when there one key with two differents values', () => {
        it('should merge with two sample of the key annotated with differents values', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
          const entityFromSecondSource = [{ id: 'id1', key2: 12, key1: 12 }]

          const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: 'id1', key1_1: 10, key1_2: 12, key2: 12 }]
          expect(output).toEqual(expected)
        })
      })
      describe('when there is complex situation', () => {
        it('should merge correctly both array', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10, key2: 1, key4: 'value4', key5: 'value5' }]
          const entityFromSecondSource = [{ id: 'id1', key1: 12, key2: 12, key3: 'value3', key4: 'value4' }]

          const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [
            { id: 'id1', key1_1: 10, key1_2: 12, key2_1: 1, key2_2: 12, key3: 'value3', key4: 'value4', key5: 'value5' }
          ]
          expect(output).toEqual(expected)
        })
      })
    })
  })
  describe('#renameObjectKey', () => {
    it('should rename correctly a key object', () => {
      // GIVEN
      const oldKey = 'oldKey'
      const newKey = 'newKey'
      const object = { oldKey: 'value' }
      // WHEN
      const output = formatService.renameObjectKey(object, oldKey, newKey)
      // THEN
      const expected = { newKey: 'value' }
      expect(output).toEqual(expected)
    })
  })
  describe('#findSimilarKeysWithDifferentsValues', () => {
    it('should rename correctly a key object', () => {
      // GIVEN
      const object1 = { key1: 'value1', key2: 'value2', key3: 'value5' }
      const object2 = { key1: 'value2', key2: 'value2', key4: 'value4' }
      // WHEN
      const output = formatService.findSimilarObjectsKeyWithDifferentsValues(object1, object2)
      // THEN
      const expected = ['key1']
      expect(output).toEqual(expected)
    })
  })
})
