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
  describe('#groupTwoEntitiesById', () => {
    describe('When entities have not similar entity', () => {
      it('should merge both entities', () => {
        const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
        const entityFromSecondSource = [{ id: 'id2', key2: 12 }]

        const output = formatService.GroupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

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

          const output = formatService.GroupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: 'id1', key1: 10, key2: 12 }]
          expect(output).toEqual(expected)
        })
      })
      describe('When there is one key with same value', () => {
        it('should merge with only one sample of the key value similar', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
          const entityFromSecondSource = [{ id: 'id1', key2: 12, key1: 10 }]

          const output = formatService.GroupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: 'id1', key1: 10, key2: 12 }]
          expect(output).toEqual(expected)
        })
      })
      describe('when there one key with two differents values', () => {
        it('should merge with two sample of the key annotated with differents values', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
          const entityFromSecondSource = [{ id: 'id1', key2: 12, key1: 12 }]

          const output = formatService.GroupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: 'id1', key1_1: 10, key1_2: 12, key2: 12 }]
          expect(output).toEqual(expected)
        })
      })
      describe('when there is complex situation', () => {
        it('should merge correctly both array', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10, key2: 1, key4: 'value4', key5: 'value5' }]
          const entityFromSecondSource = [{ id: 'id1', key1: 12, key2: 12, key3: 'value3', key4: 'value4' }]

          const output = formatService.GroupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

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
