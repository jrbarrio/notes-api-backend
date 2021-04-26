const { palindrome } = require('../utils/for_testing')

test('palindrome function', () => {
  const result = palindrome('jorgerb')
  expect(result).toBe('bregroj')
})

test('palindrome of empty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})

test('palindrome of undefined', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
