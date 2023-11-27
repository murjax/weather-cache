# Weather Cache

A React + Express demo weather application for maintaining caches and updating connected clients via server sent events.
The frontend connects to a proxy backend with a default city (New York) for weather data. This city can be changed via the search bar.
The proxy (Express) backend connects to https://wttr.in for weather data for the requested city. This data is then cached for 5 minutes.
Every 5 minutes the server busts the cache and reloads weather data on cities for all connected clients.

### Requirements
- Node 17 (or greater)

### Local Setup
1. Clone project: `git@github.com:murjax/weather-cache.git`
2. Navigate into folder `cd weather-cache`
4. Open at least two shells.
5. Navigate into the server and install dependencies. `cd server; npm install`
6. Navigate into the client and install dependencies. `cd client; npm install`
7. Start the client (in client folder). `npm start`
8. Start the server (in server folder). `node index.js`
9. Search for cities. The weather data should show within a few seconds. It will be updated every 5 minutes thereafter.
