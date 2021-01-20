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
})
