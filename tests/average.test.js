const { average } = require('../utils/for_testing')

describe('average', () => {
  test('of one value is itself', () => {
    expect(average([1])).toBe(1)
  })
})
