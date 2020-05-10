const fs = require('fs')

module.exports = function updateCreatedIDs(ids) {
  return fs.promises.writeFile(
    require.resolve('../created-ids.json'),
    JSON.stringify(ids, null, 2),
    'utf8'
  )
}
