const { inspect } = require('util')

module.exports = function insp(...args) {
  console.log(inspect(...args, { colors: true, depth: 20 }))
}
