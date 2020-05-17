#!/usr/bin/env bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source $DIR/../../secret.sh

export NOTIFICATION=$NOTIFICATION
curl 'https://gql.twitch.tv/gql' \
  -H 'Connection: keep-alive' \
  -H 'Authorization: OAuth $TWITCH_OAUTH_ID' \
  -H 'Client-Id: $TWITCH_CLIENT_ID' \
  -H 'Accept-Language: en-US' \
  -H 'Accept: */*' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: https://dashboard.twitch.tv/u/thlorenz/stream-manager' \
  --data-binary "[{\"operationName\":\"EditBroadcastContext_ChannelTagsMutation\",\"variables\":{\"input\":{\"contentID\":\"145377094\",\"contentType\":\"USER\",\"tagIDs\":[\"6ea6bca4-4712-4ab9-a906-e3336a9d8039\",\"6f86127d-6051-4a38-94bb-f7b475dde109\",\"f588bd74-e496-4d11-9169-3597f38a5d25\"],\"authorID\":\"145377094\"}},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"725f062152702638e5df0828be1de3c2e50bc09ce344901d1bb4d48208badc57\"}}},{\"operationName\":\"EditBroadcastContext_LiveUpNotificationMutation\",\"variables\":{\"input\":{\"userID\":\"145377094\",\"liveUpNotification\":\"${NOTIFICATION}\"}},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"d634dffa9efcf9d79c0f4ff8c71f9cb5f6497c806252a3d10f7549676610ee7c\"}}}]" \
  --compressed 
