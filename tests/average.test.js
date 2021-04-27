const { average } = require('../utils/for_testing')

describe.skip('average', () => {
  test('of one value is itself', () => {
    expect(average([1])).toBe(1)
  })
})
