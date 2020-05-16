var express = require('express')
var session = require('express-session')
var passport = require('passport')
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy
var request = require('request')
var handlebars = require('handlebars')

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID
const TWITCH_SECRET = process.env.TWITCH_CLIENT_SECRET
const SESSION_SECRET = '23423'
const PORT = 3333
const CALLBACK_URL = `http://localhost:${PORT}/auth/twitch/callback`

var app = express()
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
)
app.use(express.static('public'))
app.use(passport.initialize())
app.use(passport.session())

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
  var options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      Accept: 'application/vnd.twitchtv.v5+json',
      Authorization: 'Bearer ' + accessToken,
    },
  }

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body))
    } else {
      done(JSON.parse(body))
    }
  })
}

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(
  'twitch',
  new OAuth2Strategy(
    {
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      clientID: TWITCH_CLIENT_ID,
      clientSecret: TWITCH_SECRET,
      callbackURL: CALLBACK_URL,
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken
      profile.refreshToken = refreshToken
      done(null, profile)
    }
  )
)

// Set route to start OAuth link, this is where you define scopes to request

const allScopes = [
  'analytics:read:extensions', //	View analytics data for your extensions.
  'analytics:read:games', // View analytics data for your games.
  'bits:read', // View Bits information for your channel.
  'channel:edit:commercial', // Run commercials on a channel.
  'channel:read:subscriptions', // Get a list of all subscribers to your channel and check if a user is subscribed to your channel
  'clips:edit', // Manage a clip object.
  'user:edit', // Manage a user object.
  'user:edit:broadcast', //	Edit your channel’s broadcast configuration, including extension configuration. (This scope implies user:read:broadcast , // capability.)
  'user:edit:follows', // Edit your follows.
  'user:read:broadcast', // View your broadcasting configuration, including extension configurations.
  'user:read:email', // Read authorized user’s email address.
]

app.get('/auth/twitch', passport.authenticate('twitch', { scope: allScopes }))

// Set route for OAuth redirect
app.get(
  '/auth/twitch/callback',
  passport.authenticate('twitch', {
    successRedirect: '/',
    failureRedirect: '/',
  })
)

// Define a simple template to safely generate HTML with values from user's profile
var template = handlebars.compile(`
<html><head><title>Twitch Auth Sample</title></head>
<table>
    <tr><th>Access Token</th><td>{{accessToken}}</td></tr>
    <tr><th>Refresh Token</th><td>{{refreshToken}}</td></tr>
    <tr><th>Display Name</th><td>{{display_name}}</td></tr>
    <tr><th>Bio</th><td>{{bio}}</td></tr>
    <tr><th>Image</th><td>{{logo}}</td></tr>
</table></html>`)

// If user has an authenticated session, display it, otherwise display link to authenticate
app.get('/', function (req, res) {
  if (req.session && req.session.passport && req.session.passport.user) {
    res.send(template(req.session.passport.user))
  } else {
    res.send(
      '<html><head><title>Twitch Auth</title></head><a href="/auth/twitch">Auth here</a></html>'
    )
  }
})

app.listen(PORT, function () {
  console.log('Twitch auth sample listening on port', PORT)
})
