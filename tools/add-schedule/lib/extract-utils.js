const duration = require('./duration')
// SCHEDULED: <2020-05-10 Sun 11:00>
// SCHEDULED: <2020-05-10 Sun 11:00-14:00>
// SCHEDULED: <2020-05-10 Sun 11:00-14:00 +1w
const scheduleRx = /SCHEDULED: <(\d+)-(\d+)-(\d+) (\w+) (\d+):(\d+)(?:-(\d+):(\d+))?(?: \+\d+[wmdy])?>/
const onholdRx = /^HOLD/

function scheduledHeader(node) {
  // TODO: how to make this less brittle
  const siblings = node.parent.previousSibling.children
  return siblings[0].children[0].value
}

function processScheduleMatch(match, node, includeOnHold) {
  const header = scheduledHeader(node)
  if (!includeOnHold && onholdRx.test(header)) return null

  const [
    ,
    yearStr,
    monthStr,
    dayStr,
    weekday,
    hourStartStr,
    minuteStartStr,
    hourEndStr,
    minuteEndStr,
  ] = match

  const hourStart = parseInt(hourStartStr)
  const minuteStart = parseInt(minuteStartStr)

  let durationMinutes
  let hourEnd
  let minuteEnd

  if (hourEndStr != null && minuteEndStr != null) {
    hourEnd = parseInt(hourEndStr)
    minuteEnd = parseInt(minuteEndStr)
    durationMinutes = duration(hourStart, minuteStart)
  } else {
    durationMinutes = 60
    hourEnd = hourStart + 1
    minuteEnd = minuteStart
  }
  const dateInfo = {
    year: parseInt(yearStr),
    month: parseInt(monthStr),
    day: parseInt(dayStr),
    hour: hourStart,
    minute: minuteStart,
    hourEnd,
    minuteEnd,
    weekday,
    header,
    duration: durationMinutes,
  }
  return dateInfo
}

module.exports = {
  scheduleRx,
  onholdRx,
  processScheduleMatch,
}
