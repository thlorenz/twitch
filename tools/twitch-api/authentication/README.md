# Twitch Authentication

Adapted from
[twitchdev/authentication-node-sample](https://github.com/twitchdev/authentication-node-sample).

This is designed to work for the [new twitch API](https://dev.twitch.tv/docs/api) (the one
after v5).

Declare the following env vars

1. `TWITCH_CLIENT_ID` - This is the Client ID of your registered application.  You can register a new application at [https://dev.twitch.tv/dashboard/apps]
2. `TWITCH_CLIENT_SECRET` - This is the secret generated for you when you register your application, do not share this. In a production environment, it is STRONGLY recommended that you do not store application secrets on your file system or in your source code.
3. `SESSION_SECRET` -  This is the secret Express session middleware uses to sign the session ID cookie.

Callback URL is set to `http://localhost:3333/auth/twitch/callback` so make sure to configure
this for your app in [apps](https://dev.twitch.tv/console/apps) as well.

At this point all scopes are requested, see
[scopes](https://dev.twitch.tv/docs/authentication#scope://dev.twitch.tv/docs/authentication#scopes).

```
analytics:read:extensions	View analytics data for your extensions.
analytics:read:games	View analytics data for your games.
bits:read	View Bits information for your channel.
channel:edit:commercial	Run commercials on a channel.
channel:read:subscriptions	Get a list of all subscribers to your channel and check if a user is subscribed to your channel
clips:edit	Manage a clip object.
user:edit	Manage a user object.
user:edit:broadcast	Edit your channel’s broadcast configuration, including extension configuration. (This scope implies user:read:broadcast capability.)
user:edit:follows	Edit your follows.
user:read:broadcast	View your broadcasting configuration, including extension configurations.
user:read:email	Read authorized user’s email address.
```

```sh
$ node index.js
```

