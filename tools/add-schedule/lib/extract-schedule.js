const path = require('path')
const fs = require('fs')
const org = require('org')
const { inspect } = require('util')
const parser = new org.Parser()
const {
  scheduleRx,
  onholdRx,
  processScheduleMatch,
} = require('./extract-utils')

function findScheduleNodes(nodes) {
  const scheduled = []
  for (const node of nodes) findScheduledNodesRec(node, scheduled)
  return scheduled
}

function findScheduledNodesRec(node, scheduled) {
  const match = node.value != null ? node.value.match(scheduleRx) : null
  if (match != null) {
    const processed = processScheduleMatch(match, node)
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
