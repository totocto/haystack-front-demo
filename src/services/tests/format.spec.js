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
