const fetchWith = require('./fetch-with')
const { CHANNEL_ID, SCHEDULE_ID } = require('./constants')
const inspect = require('./inspect')

module.exports = function fetchDelete(id) {
  const body = [
    {
      operationName: 'DeleteScheduleSegment',
      variables: {
        input: {
          channelID: CHANNEL_ID,
          scheduleID: SCHEDULE_ID,
          segmentID: id,
        },
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash:
            '294ea895ad49260cb577d3ee883d4894c12a1c58f9f3ada1a2364314de64d609',
        },
      },
    },
  ]

  return fetchWith(body)
}
