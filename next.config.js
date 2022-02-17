  
const withProgressBar = require('next-progressbar')
module.exports = withProgressBar({
  images: {
    loader: 'imgix',
    path: '',
    domains: ['i.scdn.co', 'mosaic.scdn.co', 'newjams-images.scdn.co', 'lineup-images.scdn.co', 'seeded-session-images.scdn.co', 'www.searchpng.com'],
  },
})
