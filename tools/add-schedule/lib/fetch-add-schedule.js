const fetchWith = require('./fetch-with')
const {
  CHANNEL_ID,
  SCHEDULE_ID,
  TIME_ZONE,
  CATEGORIES,
} = require('./constants')

function twitchifyDay(day) {
  switch (day) {
    case 'Mon':
      return 'MONDAY'
    case 'Tue':
      return 'TUESDAY'
    case 'Wed':
      return 'WEDNESDAY'
    case 'Thur':
      return 'THURSDAY'
    case 'Fri':
      return 'FRIDAY'
    case 'Sat':
      return 'SATURDAY'
    case 'Sun':
      return 'SUNDAY'
    default:
      throw new Error(`Unknown weekday ${day}`)
  }
}

module.exports = function fetchAddSchedule(item) {
  const body = [
    {
      operationName: 'CreateStreamScheduleSegment',
      variables: {
        input: {
          scheduleID: SCHEDULE_ID,
          channelID: CHANNEL_ID,
          timezone: TIME_ZONE,
          categories: CATEGORIES,
          durationMinutes: item.duration,
          start: {
            day: twitchifyDay(item.weekday),
            hour: item.hour,
            minute: item.minute,
          },
          title: item.header,
        },
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash:
            'f0185c49c779add3e17668ec17f21ea3ff122dbcc934c4af711ab4845e38a7f0',
        },
      },
    },
  ]

  return fetchWith(body)
}
