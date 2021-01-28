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
  describe('#groupByIdBis', () => {
    describe('When entities have not similar entity', () => {
      it('should merge both entities', () => {
        const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
        const entityFromSecondSource = [{ id: 'id2', key2: 12 }]

        const output = formatService.groupByIdBis(entityFromFirstSource, entityFromSecondSource)

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

          const output = formatService.groupByIdBis(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: 'id1', key1: 10, key2: 12 }]
          expect(output).toEqual(expected)
        })
      })
      describe('When there is one key with same value', () => {
        it('should merge with only one sample of the key value similar', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
          const entityFromSecondSource = [{ id: 'id1', key2: 12, key1: 10 }]

          const output = formatService.groupByIdBis(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: 'id1', key1: 10, key2: 12 }]
          expect(output).toEqual(expected)
        })
      })
      describe('when there one key with two differents values', () => {
        it('should merge with two sample of the key annotated with differents values', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10 }]
          const entityFromSecondSource = [{ id: 'id1', key2: 12, key1: 12 }]

          const output = formatService.groupByIdBis(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: 'id1', key1_1: 10, key1_2: 12, key2: 12 }]
          expect(output).toEqual(expected)
        })
      })
      describe('when there is complex situation', () => {
        it('should merge correctly both array', () => {
          const entityFromFirstSource = [{ id: 'id1', key1: 10, key2: 1, key4: 'value4', key5: 'value5' }]
          const entityFromSecondSource = [{ id: 'id1', key1: 12, key2: 12, key3: 'value3', key4: 'value4' }]

          const output = formatService.groupByIdBis(entityFromFirstSource, entityFromSecondSource)

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

  describe('#groupById', () => {
    describe('When ids are the same in both sources', () => {
      it('should group entities with same id', () => {
        // GIVEN
        const entityFromFirstSource = [{ id: 'id1', val: 10 }]
        const entityFromSecondSource = [{ id: 'id1', val: 12 }]
        // WHEN
        const output = formatService.groupById(entityFromFirstSource, entityFromSecondSource)
        // THEN
        const expected = [{ id: 'id1', entities: [entityFromFirstSource[0], entityFromSecondSource[0]] }]
        expect(output).toEqual(expected)
      })
    })
    describe('When id is only in firstSource', () => {
      it('should format correctly the output', () => {
        // GIVEN
        const entityFromFirstSource = [{ id: 'id1', val: 10 }]
        const entityFromSecondSource = []
        // WHEN
        const output = formatService.groupById(entityFromFirstSource, entityFromSecondSource)
        // THEN
        const expected = [{ id: 'id1', entities: [entityFromFirstSource[0], {}] }]
        expect(output).toEqual(expected)
      })
    })
    describe('When id is only in second source', () => {
      it('should format correctly the output', () => {
        // GIVEN
        const entityFromFirstSource = []
        const entityFromSecondSource = [{ id: 'id1', val: 10 }]
        // WHEN
        const output = formatService.groupById(entityFromFirstSource, entityFromSecondSource)
        // THEN
        const expected = [{ id: 'id1', entities: [{}, entityFromSecondSource[0]] }]
        expect(output).toEqual(expected)
      })
    })
    describe('When both source have different id entitiy', () => {
      it('should format correctly the output', () => {
        // GIVEN
        const entityFromFirstSource = [{ id: 'id1', val: 5 }]
        const entityFromSecondSource = [{ id: 'id2', val: 3 }]
        // WHEN
        const output = formatService.groupById(entityFromFirstSource, entityFromSecondSource)
        // THEN
        const expected = [
          { id: 'id1', entities: [entityFromFirstSource[0], {}] },
          { id: 'id2', entities: [{}, entityFromSecondSource[0]] }
        ]
        expect(output).toEqual(expected)
      })
    })
    describe('When both source have similars and differents id entitiy', () => {
      it('should format correctly the output', () => {
        // GIVEN
        const entityFromFirstSource = [
          { id: 'id1', val: 5 },
          { id: 'id2', val: 4 }
        ]
        const entityFromSecondSource = [
          { id: 'id2', val: 3 },
          { id: 'id3', val: 1 }
        ]
        // WHEN
        const output = formatService.groupById(entityFromFirstSource, entityFromSecondSource)
        // THEN
        const expected = [
          { id: 'id1', entities: [{ id: 'id1', val: 5 }, {}] },
          {
            id: 'id2',
            entities: [
              { id: 'id2', val: 4 },
              { id: 'id2', val: 3 }
            ]
          },
          { id: 'id3', entities: [{}, { id: 'id3', val: 1 }] }
        ]
        expect(output).toEqual(expected)
      })
    })
  })
})
