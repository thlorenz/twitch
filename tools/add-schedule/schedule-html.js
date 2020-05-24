const path = require('path')
const fs = require('fs')
const org = require('org')
const inspect = require('./lib/inspect')
const parser = new org.Parser()

const { scheduleRx, processScheduleMatch } = require('./lib/extract-utils')

function processHeader(node) {
  const firstChild = node.children[0]
  if (firstChild == null) return null
  const firstNestedChild = firstChild.children && firstChild.children[0]
  return (
    firstNestedChild && { value: firstNestedChild.value, level: node.level }
  )
}

function walkScheduleNodes(nodes) {
  const result = []
  for (const node of nodes) walkNodesRec(node, result)
  return result
}

function walkNodesRec(node, result) {
  const scheduleMatch = node.value != null ? node.value.match(scheduleRx) : null
  const includeOnHold = false
  if (scheduleMatch != null) {
    const processed = processScheduleMatch(scheduleMatch, node, includeOnHold)
    if (processed != null) result.push({ type: 'schedule', ...processed })
  } else if (node.type === 'header') {
    result.push({ type: 'header', ...processHeader(node) })
  }
  if (node.children == null) return

  for (const n of node.children) {
    walkNodesRec(n, result)
  }
}

async function parse(orgFile) {
  const orgContent = await fs.promises.readFile(orgFile, 'utf8')
  const parsed = parser.parse(orgContent)
  return walkScheduleNodes(parsed.nodes)
}

function getItemsHtml(results, indent = '    ') {
  let s = ''
  for (const item of results) {
    if (item.type === 'header') {
      const h = item.level + 1
      s += `${indent}<h${h}>${item.value}</h${h}<br>\n`
    } else if (item.type === 'schedule') {
      const { weekday, hour, minute, hourEnd, minuteEnd } = item
      s += `${indent}<br><p class="schedule">${weekday} ${hour}:${minute
        .toString()
        .padEnd(2, '0')}-${hourEnd}:${minuteEnd
        .toString()
        .padEnd(2, '0')}</p>\n`
    }
  }
  return s
}

function getPageHtml(itemsHtml) {
  return `
<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="utf-8" />

    <title>thlorenz stream schedule</title>
    <meta name="author" content="Thorsten Lorenz" />

    <link rel="stylesheet" href="css/index.css" />
    <title>thlorenz stream schedule</title>
  </head>

  <body>
    <h1>thlorenz stream schedule</h1>
<div class="center">
    <a href="https://www.twitch.tv/thlorenz">Follow on Twitch</a>
    <span> Times are shown in Mountain Time which is 2 hours behind EST.</span>
${itemsHtml}
</div>
  </body>
</html>
`
}

;(async () => {
  const ids = new Set()
  try {
    const orgFile = path.join(__dirname, 'schedule.org')
    const htmlFile = path.join(__dirname, '..', '..', 'schedule.html')
    const results = await parse(orgFile)
    const itemsHtml = getItemsHtml(results)
    const pageHtml = getPageHtml(itemsHtml)
    await fs.promises.writeFile(htmlFile, pageHtml, 'utf8')
    console.error(`wrote to ${htmlFile}`)
  } catch (err) {
    console.error(err)
  }
})()
