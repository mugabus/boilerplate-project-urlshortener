require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrls = [];
const shortUrls = [];

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const urlIndex = originalUrls.indexOf(url);

  if (!url.includes('https://') && !url.includes('http://')) {
    return res.json({
      error: "invalid url"
    });
  }

  if (urlIndex === -1) {
    originalUrls.push(url);
    shortUrls.push(shortUrls.length);
    return res.json({
      original_url: url,
      short_url: shortUrls.length - 1,
    });
  }
  
  return res.json({
    original_url: url,
    short_url: urlIndex
  });
});

// Redirect endpoint for shortened URLs
app.get('/api/shorturl/:shorturl', (req, res) => {
  const shorturl = parseInt(req.params.shorturl);
  const urlIndex = shortUrls.indexOf(shorturl);

  if (urlIndex === -1) {
    return res.json({
      error: "No short URL found for the input given"
    });
  }

  res.redirect(originalUrls[urlIndex]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
