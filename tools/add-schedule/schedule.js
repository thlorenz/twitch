const path = require('path')
const fs = require('fs')
const unschedule = require('./unschedule')
const extractSchedule = require('./lib/extract-schedule')
const fetchAddSchedule = require('./lib/fetch-add-schedule')
const inspect = require('./lib/inspect')
const updateCreatedIds = require('./lib/update-created-ids')

  ; (async () => {
    let res
    let json
    const ids = new Set()
    try {
      const orgFile = path.join(__dirname, 'schedule.org')
      const schedule = await extractSchedule(orgFile)

      res = await unschedule()

      for (const item of schedule) {
        let res = await fetchAddSchedule(item)
        json = await res.json()
        for (const id of json[0].data.createScheduleSegment.schedule.segments.map(
          (x) => x.id
        )) {
          ids.add(id)
        }

        inspect({
          addOK: res.ok,
          status: res.status,
          text: res.statusText,
          header: item.header,
        })
      }
    } catch (err) {
      console.error(err)
      inspect(json)
    } finally {
      await updateCreatedIds(Array.from(ids))
    }
  })()
