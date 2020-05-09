const path = require('path')
const extractSchedule = require('./lib/extract-schedule')
const fetchDelete = require('./lib/fetch-delete')
const inspect = require('./lib/inspect')

  ; (async () => {
    try {
      const res = await fetchDelete()
      inspect(res)
      const orgFile = path.join(__dirname, 'schedule.org')
      const schedule = await extractSchedule(orgFile)
      console.log(schedule)
    } catch (err) {
      console.error(err)
    }
  })()
