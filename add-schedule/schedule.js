const path = require('path')
const extractSchedule = require('./lib/extract-schedule')

  ; (async () => {
    try {
      const orgFile = path.join(__dirname, 'schedule.org')
      const schedule = await extractSchedule(orgFile)
      console.log(schedule)
    } catch (err) {
      console.error(err)
    }
  })()
