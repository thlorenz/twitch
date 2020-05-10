const fetchDeleteSchedule = require('./lib/fetch-delete')
const createdIDs = require('./created-ids.json')
const updateCreatedIds = require('./lib/update-created-ids')
const inspect = require('./lib/inspect')

async function unschedule() {
  for (const id of createdIDs) {
    res = await fetchDeleteSchedule(id)
    inspect({
      delOK: res.ok,
      status: res.status,
      text: res.statusText,
      id,
    })
  }
}

module.exports = unschedule
;(async () => {
  let res
  try {
    res = await unschedule()
    await updateCreatedIds([])
  } catch (err) {
    console.error(err)
    inspect(res)
  } finally {
  }
})()
