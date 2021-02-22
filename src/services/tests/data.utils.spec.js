import dataUtils from '../data.utils'

describe('dataUtils', () => {
  describe('#formatDate', () => {
    it('should format correctly date', () => {
      // GIVEN
      const date = 't:2020-07-01T00:00:00+00:00 UTC'
      // WHEN
      const output = dataUtils.formatDate(date)
      // THEN
      const expected = 1593561600000
      expect(output).toEqual(expected)
    })
  })
  describe('#formatval', () => {
    it('should format correctly values', () => {
      // GIVEN
      const val = 'n:64.00000'
      // WHEN
      const output = dataUtils.formatVal(val)
      // THEN
      const expected = 64.0
      expect(output).toEqual(expected)
    })
  })
})
