#!/usr/bin/env bash
set -euo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

CHANNEL_ID='145377094'

source $DIR/../../secret.sh

export STATUS=$STATUS
curl \
    -H "Client-ID: $TWITCH_CLIENT_ID" \
    -H "Authorization: OAuth $TWITCH_OAUTH_ID" \
    -H 'Accept: application/vnd.twitchtv.v5+json' \
    -H 'Content-Type: application/json' \
    -d "{\"channel\": {\"status\": \"${STATUS}\", \"game\": \"Science & Technology\", \"channel_feed_enabled\": true}}" \
    -X PUT "https://api.twitch.tv/kraken/channels/$CHANNEL_ID"
