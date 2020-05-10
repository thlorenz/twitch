const assert = require('assert')
const fetch = require('node-fetch')
const { TWITCH_ENDPOINT } = require('./constants')

const oauthId = process.env.TWITCH_OAUTH_ID
const clientId = process.env.TWITCH_CLIENT_ID

module.exports = function fetchWith(body) {
  assert(oauthId != null, 'need to supply TWITCH_OAUTH_ID')
  assert(clientId != null, 'need to supply TWITCH_CLIENT_ID')

  const headers = {
    accept: '*/*',
    'accept-language': 'en-US',
    authorization: `OAuth ${oauthId}`,
    'client-id': clientId,
    'content-type': 'text/plain;charset=UTF-8',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
  }

  return fetch(TWITCH_ENDPOINT, {
    headers,
    body: JSON.stringify(body),
    method: 'POST',
    mode: 'cors',
  })
}
