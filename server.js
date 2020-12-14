const express = require('express');
const next = require('next');
const path = require('path');
const url = require('url');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const request = require('request'); // "Request" library
const bodyParser = require('body-parser')
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

// Multi-process to utilize all CPU cores.
if (!dev && cluster.isMaster) {
  console.log(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = next({ dir: '.', dev });
  const nextHandler = app.getRequestHandler();

  app.prepare()
    .then(() => {
      const server = express();
      server.use(bodyParser.urlencoded({ extended: false }))
      server.use(bodyParser.json())
     
      // Static files
      // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
      server.use('/static', express.static(path.join(__dirname, 'static'), {
        maxAge: dev ? '0' : '365d'
      }));

      const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
    
        /**
       * Generates a random string containing numbers and letters
       * @param  {number} length The length of the string
       * @return {string} The generated string
       */
      const generateRandomString = function(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      };
    
      const stateKey = 'spotify_auth_state';
    
      server.use(cors())
            .use(cookieParser());
    
       // Redirect user to spotify for initial login
      server.get('/login', function(req, res) {
        const state = generateRandomString(16);
        res.cookie(stateKey, state);
    
        // your application requests authorization
        const scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-modify-private user-read-recently-played user-follow-modify user-follow-read';
        
        res.redirect('https://accounts.spotify.com/authorize?' +
          querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state
          }));
      });

      // Handle callback 
      server.get('/callback', function(req, res) {

        // your application requests refresh and access tokens
        // after checking the state parameter
      
        const code = req.query.code || null;
        const state = req.query.state || null;
        const storedState = req.cookies ? req.cookies[stateKey] : null;
      
        if (state === null || state !== storedState) {
          res.redirect('/' +
            querystring.stringify({
              error: 'state_mismatch'
            }));
        } else {
          res.clearCookie(stateKey);
          const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: REDIRECT_URI,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            json: true
          };
      
          request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
      
              const { access_token, refresh_token } = body

              const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
              };

              res.cookie('refresh_token_v2', refresh_token, { maxAge: 604800000, httpOnly: false });

              res.redirect('/')

            } else {
              res.redirect('/#' +
                querystring.stringify({
                  error: 'invalid_token'
                }));
            }
          });
        }
      });

      // setup POST request to get access_token from refresh_token
      const getAccessToken = async (refresh_token) => {
        const data = {
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        }

        const options = {
          method: 'POST',
          headers: { 'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
          url: 'https://accounts.spotify.com/api/token',
          data: querystring.stringify(data)
        }

        const response = await axios(options)
        const access_token = response.data.access_token

        return(access_token)
      }

      // GET user's top tracks
      server.get('/api/tracks', async function(req, res) {

        // requesting access token from refresh token
        const refresh_token = req.query.refresh_token;
        const time_range = req.query.time_range
        const limit = req.query.limit

        const getTracks = async (accessToken) => {
          const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            url: `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${limit}`
          }
          const response = await axios(options)
          return(response.data)
        }
        
        const access_token = await getAccessToken(refresh_token)

        const tracks = await getTracks(access_token)
        
        res.json(tracks)
      });

      // GET user's top artists
      server.get('/api/artists', async function(req, res) {

        // requesting access token from refresh token
        const refresh_token = req.query.refresh_token;
        const time_range = req.query.time_range
        const limit = req.query.limit

        const getArtists = async (accessToken) => {
          const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            url: `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=${limit}`
          }
          const response = await axios(options)
          return(response.data)
        }
        
        const access_token = await getAccessToken(refresh_token)

        const artists = await getArtists(access_token)
        
        res.json(artists)
      });

      // GET user's listening history
      server.get('/api/history', async function(req, res){

        const refresh_token = req.query.refresh_token;
        const limit = req.query.limit

        const getHistory = async (accessToken) => {
          const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            url: `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`
          }
          const response = await axios(options)
          return(response.data)
        }

        const access_token = await getAccessToken(refresh_token)
        const history = await getHistory(access_token)
        res.json(history)

      })

      // GET user's profile
      server.get('/api/profile', async function(req, res){
        const refresh_token = req.query.refresh_token;
        try{
          const getProfile = async (accessToken) => {
            const options = {
              method: 'GET',
              headers: { 'Authorization': 'Bearer ' + accessToken },
              url: `https://api.spotify.com/v1/me`
            }
            const response = await axios(options)
            return(response.data)
          }
      
          const access_token = await getAccessToken(refresh_token)
          const profile = await getProfile(access_token)
          res.json(profile)

        } catch(err) {
          res.json(`Error: ${err}`)
        }
      })

      server.get('/api/followed', async function(req, res){
        const refresh_token = req.query.refresh_token;
        try{
          const getFollowed = async (accessToken) => {
            const options = {
              method: 'GET',
              headers: { 'Authorization': 'Bearer ' + accessToken },
              url: `https://api.spotify.com/v1/me/following?type=artist`
            }
            const response = await axios(options)
            return(response.data)
          }
      
          const access_token = await getAccessToken(refresh_token)
          const followed = await getFollowed(access_token)

          res.json(followed)

        } catch(err) {
          res.json(`Error: ${err}`)
        }
      })

      server.get('/api/followingArtist', async function(req, res){
        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        try{
          const getFollowing = async (accessToken) => {
            const options = {
              method: 'GET',
              headers: { 'Authorization': 'Bearer ' + accessToken },
              url: `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${id}`
            }
            const response = await axios(options)
            return(response.data)
          }
      
          const access_token = await getAccessToken(refresh_token)
          const following = await getFollowing(access_token)

          res.json(following)

        } catch(err) {
          res.json(`Error: ${err}`)
        }
      })

      server.get('/api/getPlaylist', async function(req, res){
        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        try{
          const getPlaylist = async (accessToken) => {
            const options = {
              method: 'GET',
              headers: { 'Authorization': 'Bearer ' + accessToken },
              url: `https://api.spotify.com/v1/playlists/${id}`
            }
            const response = await axios(options)
            return(response.data)
          }
      
          const access_token = await getAccessToken(refresh_token)
          const playlist = await getPlaylist(access_token)

          res.json(playlist)

        } catch(err) {
          res.json(`Error: ${err}`)
        }
      })

      server.put('/api/followArtist', async function(req, res){
        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        try{
          const followArtist = async (accessToken) => {
            const options = {
              method: 'PUT',
              headers: { 'Authorization': 'Bearer ' + accessToken },
              url: `https://api.spotify.com/v1/me/following?type=artist&ids=${id}`
            }
            const response = await axios(options)
            return(response.data)
          }
      
          const access_token = await getAccessToken(refresh_token)
          const follow = await  followArtist(access_token)

          res.json(follow)

        } catch(err) {
          res.json(`Error: ${err}`)
        }
      })

      server.delete('/api/unfollowArtist', async function(req, res){
        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        try{
          const unfollowArtist = async (accessToken) => {
            const options = {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + accessToken },
              url: `https://api.spotify.com/v1/me/following?type=artist&ids=${id}`
            }
            const response = await axios(options)
            return(response.data)
          }
      
          const access_token = await getAccessToken(refresh_token)
          const unfollow = await  unfollowArtist(access_token)

          res.json(unfollow)

        } catch(err) {
          res.json(`Error: ${err}`)
        }
      })

      server.get('/api/track', async function(req, res){

        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        const getTrack = async (accessToken) => {
          const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            url: `https://api.spotify.com/v1/tracks/${id}`
          }
          const response = await axios(options)
         
          return(response.data)
          
        }

        const access_token = await getAccessToken(refresh_token)
        const track = await getTrack(access_token)
        res.json(track)

      })

      server.get('/api/artist', async function(req, res){

        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        const getArtist = async (accessToken) => {
          const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            url: `https://api.spotify.com/v1/artists/${id}`
          }
          const response = await axios(options)
         
          return(response.data)
          
        }

        const access_token = await getAccessToken(refresh_token)
        const artist = await getArtist(access_token)
        res.json(artist)

      })

      server.get('/api/relatedArtist', async function(req, res){

        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        const getRA = async (accessToken) => {
          const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            url: `https://api.spotify.com/v1/artists/${id}/related-artists`
          }
          const response = await axios(options)
         
          return(response.data)
          
        }

        const access_token = await getAccessToken(refresh_token)
        const artist = await getRA(access_token)
        res.json(artist)

      })

      server.get('/api/feature', async function(req, res){

        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        const getFeatures = async (accessToken) => {
          const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            url: `https://api.spotify.com/v1/audio-features/${id}`
          }
          const response = await axios(options)
         
          return(response.data)
          
        }

        const access_token = await getAccessToken(refresh_token)
        const features = await getFeatures(access_token)
        res.json(features)

      })

      server.get('/api/features', async function(req, res){

        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        const getFeatures = async (accessToken) => {
          const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            url: `https://api.spotify.com/v1/audio-features?ids=${id}`
          }
          const response = await axios(options)
         
          return(response.data)
          
        }

        const access_token = await getAccessToken(refresh_token)
        const features = await getFeatures(access_token)
        res.json(features)

      })


      server.get('/api/analysis', async function(req, res){

        const refresh_token = req.query.refresh_token;
        const id = req.query.id
        const getAnalysis = async (accessToken) => {
          const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            url: `https://api.spotify.com/v1/audio-analysis/${id}`
          }
          const response = await axios(options)
         
          return(response.data)
          
        }

        const access_token = await getAccessToken(refresh_token)
        const analysis = await getAnalysis(access_token)
        res.json(analysis)

      })

      server.get('/api/list', async function(req, res){
        const refresh_token = req.query.refresh_token;
        try{
          const getList = async (accessToken) => {
            const options = {
              method: 'GET',
              headers: { 'Authorization': 'Bearer ' + accessToken },
              url: `https://api.spotify.com/v1/me/playlists?limit=50`
            }
            const response = await axios(options)
            return(response.data)
          }
      
          const access_token = await getAccessToken(refresh_token)
          const list = await getList(access_token)

          res.json(list)

        } catch(err) {
          res.json(`Error: ${err}`)
        }
      })

      // POST new playlist with user's top tracks 
      server.post('/api/playlist', async function(req, res){
        const {refresh_token, name, id, playlist} = req.body
        // const refresh_token = req.body.refresh_token;
        // const id = req.body.id
        // const name = req.body.name

        try{
          const newPlaylist  = async(accessToken) => {
            const options = {
              method: 'POST',
              headers: { 
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
              },
              url: `https://api.spotify.com/v1/users/${id}/playlists`,
              data: { "name": name, "public": 'false' }
            }
            const response = await axios(options)
            return(response.data)
          }

          const postPlaylist  = async(accessToken, playlist_id) => {
            const options = {
              method: 'POST',
              headers: { 
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
              },
              url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
              data: { "uris": playlist }
            }
            const response = await axios(options)
            return(response.data)
          }

          const access_token = await getAccessToken(refresh_token)
          const createdPlaylist = await newPlaylist(access_token)
          playlistId = createdPlaylist.id
          const response = await postPlaylist(access_token, playlistId)
          if(response.snapshot_id){
            res.json('success')
          }
          // res.json(response)


        } catch(err){
          res.json(err)
        }
      })
    
      // Example server-side routing
      server.get('/a', (req, res) => {
        return app.render(req, res, '/b', req.query)
      })

      // Example server-side routing
      server.get('/b', (req, res) => {
        return app.render(req, res, '/a', req.query)
      })



      // Default catch-all renders Next app
      server.get('*', (req, res) => {
        // res.set({
        //   'Cache-Control': 'public, max-age=3600'
        // });
        const parsedUrl = url.parse(req.url, true);
        nextHandler(req, res, parsedUrl);
      });

      server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Listening on http://localhost:${port}`);
      });
    });
}