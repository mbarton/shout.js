# Shout Serverless

## Requirements

- Elm 0.17

## Get started

- Run `build.bat` to compile the Elm code
- View `index.html` over HTTP (doesn't work over `file://`)

## Local server

The fetch API doesn't seem to work properly over `file://` so you
must run a local server to view the app over HTTP.

Unfortunately, the Python HTTP server (`python -m SimpleHTTPServer/http.server`)
doesn't work very well serving the MP3 samples in parallel.

A good alternative is `http-server` from `npm`:

```
npm install http-server -g
http-server
```

The app is available on `http://localhost:8080`.