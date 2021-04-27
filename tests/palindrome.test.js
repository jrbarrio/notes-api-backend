const { palindrome } = require('../utils/for_testing')

test.skip('palindrome function', () => {
  const result = palindrome('jorgerb')
  expect(result).toBe('bregroj')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
