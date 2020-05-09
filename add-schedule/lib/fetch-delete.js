const fetchWith = require('./fetch-with')
const { CHANNEL_ID, SCHEDULE_ID } = require('./constants')
const inspect = require('./inspect')

module.exports = function fetchDelete() {
  const body = [
    {
      operationName: 'DeleteSchedule',
      variables: {
        input: {
          channelID: CHANNEL_ID,
          scheduleID: SCHEDULE_ID,
        },
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash:
            '64e6ae2d15312515b5436e04f441b106f2a85d6417be7413e107aa121fb3f4b5',
        },
      },
    },
  ]

  return fetchWith(body)
}
