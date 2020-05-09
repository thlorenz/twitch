const path = require('path')
const fs = require('fs')
const duration = require('./duration')
const org = require('org')
const { inspect } = require('util')
const parser = new org.Parser()

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

function processMatch(match, node) {
  const header = scheduledHeader(node)
  if (onholdRx.test(header)) return null

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

  const durationMinutes =
    hourEndStr != null && minuteEndStr
      ? duration(
          hourStart,
          minuteStart,
          parseInt(hourEndStr),
          parseInt(minuteEndStr)
        )
      : 60

  const dateInfo = {
    year: parseInt(yearStr),
    month: parseInt(monthStr),
    day: parseInt(dayStr),
    hour: hourStart,
    minute: minuteStart,
    weekday,
    header,
    duration: durationMinutes,
  }
  return dateInfo
}

function findScheduleNodes(nodes) {
  const scheduled = []
  for (const node of nodes) findScheduledNodesRec(node, scheduled)
  return scheduled
}

function findScheduledNodesRec(node, scheduled) {
  const match = node.value != null ? node.value.match(scheduleRx) : null
  if (match != null) {
    const processed = processMatch(match, node)
    if (processed != null) scheduled.push(processed)
  }
  if (node.children == null) return

  for (const n of node.children) {
    findScheduledNodesRec(n, scheduled)
  }
}

async function parseSchedule(orgFile) {
  const orgContent = await fs.promises.readFile(orgFile, 'utf8')
  const parsed = parser.parse(orgContent)
  return findScheduleNodes(parsed.nodes)
}

module.exports = async function extractSchedule(orgFile) {
  return parseSchedule(orgFile)
}
