const palindrome = (string) => {
  if (string === undefined) {
    return undefined
  }

  return string
    .split('')
    .reverse()
    .join('')
}

const average = array => {
  let sum = 0
  array.forEach(num => { sum += num })
  return sum / array.length
}

module.exports = {
  palindrome,
  average
}
