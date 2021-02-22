import { formatService } from '..'

describe('formatService', () => {
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
        const entitiesFromAllSource = [[{ id: { val: 'id1' } }, { id: { val: 'an id' }, ts: 'id2' }]]
        const entityIdToFind = 'id1'
        // WHEN
        const output = formatService.isEntityFromSource(entitiesFromAllSource, entityIdToFind)
        // THEN
        expect(output).toBeTrue()
      })
      it('should return true', () => {
        // GIVEN
        const entitiesFromAllSource = [
          [{ id: { val: 'id1' } }, { id: { val: 'id2' } }],
          [{ id: { val: 'id3' } }, { id: { val: 'id4' } }]
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
        const entitiesFromAllSource = [[{ id: { val: 'id"' } }, { id: { val: 'id3' } }]]
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
      const firstEntity = [
        {
          id: { val: '1', apiSource: 1 },
          key1: { val: 'value1', apiSource: 1 },
          key2: { val: 'value2', apiSource: 1 },
          key3: { val: 'value3', apiSource: 1 }
        }
      ]
      const secondEntity = [
        {
          id: { val: '1', apiSource: 2 },
          key1: { val: 'value1', apiSource: 2 },
          key2: { val: 'value2Bis', apiSource: 2 },
          key4: { val: 'value4', apiSource: 2 }
        }
      ]
      const thirdEntity = [
        {
          id: { val: '2', apiSource: 3 },
          key1: { val: 'value1bis', apiSource: 3 },
          key5: { val: 'value5', apiSource: 3 }
        }
      ]
      const entities = [firstEntity, secondEntity, thirdEntity]
      // WHEN
      const output = formatService.groupAllEntitiesById(entities)
      // THEN
      const expected = [
        {
          id: { val: '1', apiSource: 1 },
          key1_1: { val: 'value1', apiSource: 1 },
          key1_3: { val: 'value1bis', apiSource: 3 },
          key2_1: { val: 'value2', apiSource: 1 },
          key2_2: { val: 'value2Bis', apiSource: 2 },
          key3: { val: 'value3', apiSource: 1 },
          key4: { val: 'value4', apiSource: 2 },
          key5: { val: 'value5', apiSource: 3 }
        }
      ]
      expect(output).toEqual(expected)
    })
  })
  describe('#getLinkBetweenEntities', () => {
    describe('When entityLink is from source', () => {
      it('should return link from source, and an empty array', () => {
        const entitiesFromAllSource = [
          [
            {
              id: { val: 'r:id1 name of first ref', apiSource: 1 },
              oneRef: { val: 'r:aRef name of second ref', apiSource: 1 }
            },
            { id: { val: 'r:aRef name of second ref', apiSource: 1 } }
          ]
        ]
        const result = formatService.getLinkBetweenEntities(entitiesFromAllSource)
        const nodeColor = [
          {
            color: '#dc143c',
            id: 'name of second ref',
            marker: {
              radius: 10
            }
          },
          {
            color: '#dc143c',
            dis: 'name of first ref',
            id: 'name of first ref',
            marker: {
              radius: 10
            }
          },
          {
            color: '#dc143c',
            dis: 'name of second ref',
            id: 'name of second ref',
            marker: {
              radius: 10
            }
          }
        ]
        const linkBetweenEntities = [['name of first ref', 'name of second ref']]
        const entityNameToRef = { aRef: 'name of second ref', id1: 'name of first ref' }
        expect(result).toEqual([linkBetweenEntities, nodeColor, entityNameToRef])
      })
      it('should return only link from source', () => {
        const entitiesFromAllSource = [
          [
            {
              id: { val: 'r:id1 name of first ref', apiSource: 1 },
              oneRef: { val: 'r:aRef name of second ref', apiSource: 1 }
            }
          ],
          [{ id: { val: 'r:aRef name of second ref', apiSource: 2 } }]
        ]
        const result = formatService.getLinkBetweenEntities(entitiesFromAllSource)
        const nodeColor = [
          {
            color: '#dc143c',
            id: 'name of second ref',
            marker: {
              radius: 10
            }
          },
          {
            color: '#dc143c',
            dis: 'name of first ref',
            id: 'name of first ref',
            marker: {
              radius: 10
            }
          },
          {
            color: '#0000ff',
            dis: 'name of second ref',
            id: 'name of second ref',
            marker: {
              radius: 10
            }
          }
        ]
        const linksBetweenEntities = [['name of first ref', 'name of second ref']]
        const entityNameToRef = { aRef: 'name of second ref', id1: 'name of first ref' }
        expect(result).toEqual([linksBetweenEntities, nodeColor, entityNameToRef])
      })
    })
    describe('When entityLink is not from source', () => {
      it('should return only link outside from source', () => {
        const entitiesFromAllSource = [
          [
            {
              id: { val: 'r:id1 name of first ref', apiSource: 1 },
              oneRef: { val: 'r:aRef name of second ref', apiSource: 1 }
            }
          ]
        ]
        const result = formatService.getLinkBetweenEntities(entitiesFromAllSource)
        const linkBetweenEntities = [['name of first ref', 'aRef']]
        const colorsForNodeOutsideFromSource = [
          {
            color: '#c1e1ec',
            id: 'aRef',
            marker: {
              radius: 5
            }
          },
          {
            color: '#dc143c',
            dis: 'name of first ref',
            id: 'name of first ref',
            marker: {
              radius: 10
            }
          }
        ]
        const entityNameToRef = { id1: 'name of first ref' }
        expect(result).toEqual([linkBetweenEntities, colorsForNodeOutsideFromSource, entityNameToRef])
      })
    })
  })
  describe('#groupTwoEntitiesById', () => {
    describe('When entities have not similar entity', () => {
      it('should merge both entities', () => {
        const entityFromFirstSource = [{ id: { val: 'id1' }, key1: { val: 10 } }]
        const entityFromSecondSource = [{ id: { val: 'id2' }, key2: { val: 12 } }]

        const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

        const expected = [
          { id: { val: 'id1' }, key1: { val: 10 } },
          { id: { val: 'id2' }, key2: { val: 12 } }
        ]
        expect(output).toEqual(expected)
      })
    })
    describe('When both entities have a similar entity', () => {
      describe('When all key are different', () => {
        it('should return a merge of of this entity', () => {
          const entityFromFirstSource = [{ id: { val: 'id1' }, key1: { val: 10 } }]
          const entityFromSecondSource = [{ id: { val: 'id1' }, key2: { val: 12 } }]

          const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: { val: 'id1' }, key1: { val: 10 }, key2: { val: 12 } }]
          expect(output).toEqual(expected)
        })
      })
      describe('When there is one key with same value', () => {
        it('should merge with only one sample of the key value similar', () => {
          const entityFromFirstSource = [{ id: { val: 'id1' }, key1: { val: 10 } }]
          const entityFromSecondSource = [{ id: { val: 'id1' }, key2: { val: 12 }, key1: { val: 10 } }]

          const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [{ id: { val: 'id1' }, key1: { val: 10 }, key2: { val: 12 } }]
          expect(output).toEqual(expected)
        })
      })
      describe('when there one key with two differents values', () => {
        it('should merge with two sample of the key annotated with differents values', () => {
          const entityFromFirstSource = [{ id: { val: 'id1', apiSource: 1 }, key1: { val: 10, apiSource: 1 } }]
          const entityFromSecondSource = [
            { id: { val: 'id1', apiSource: 2 }, key2: { val: 12, apiSource: 2 }, key1: { val: 12, apiSource: 2 } }
          ]

          const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [
            {
              id: { val: 'id1', apiSource: 1 },
              key1_1: { val: 10, apiSource: 1 },
              key1_2: { val: 12, apiSource: 2 },
              key2: { val: 12, apiSource: 2 }
            }
          ]
          expect(output).toEqual(expected)
        })
      })
      describe('when there is complex situation', () => {
        it('should merge correctly both array', () => {
          const entityFromFirstSource = [
            {
              id: { val: 'id1', apiSource: 1 },
              key1: { val: 10, apiSource: 1 },
              key2: { val: 1, apiSource: 1 },
              key4: { val: 'value4', apiSource: 1 },
              key5: { val: 'value5', apiSource: 1 }
            }
          ]
          const entityFromSecondSource = [
            {
              id: { val: 'id1', apiSource: 2 },
              key1: { val: 12, apiSource: 2 },
              key2: { val: 12, apiSource: 2 },
              key3: { val: 'value3', apiSource: 2 },
              key4: { val: 'value4', apiSource: 2 }
            }
          ]

          const output = formatService.groupTwoEntitiesById(entityFromFirstSource, entityFromSecondSource)

          const expected = [
            {
              id: { val: 'id1', apiSource: 1 },
              key1_1: { val: 10, apiSource: 1 },
              key1_2: { val: 12, apiSource: 2 },
              key2_1: { val: 1, apiSource: 1 },
              key2_2: { val: 12, apiSource: 2 },
              key3: { val: 'value3', apiSource: 2 },
              key4: { val: 'value4', apiSource: 1 },
              key5: { val: 'value5', apiSource: 1 }
            }
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
      const object1 = { key1: { val: 'value1' }, key2: { val: 'value2' }, key3: { val: 'value5' } }
      const object2 = { key1: { val: 'value2' }, key2: { val: 'value2' }, key4: { val: 'value4' } }
      // WHEN
      const output = formatService.findSimilarObjectsKeyWithDifferentsValues(object1, object2)
      // THEN
      const expected = ['key1']
      expect(output).toEqual(expected)
    })
  })
})
