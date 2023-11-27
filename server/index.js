const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let clients = [];
let weatherByCity = {};

async function reloadClientWeather() {
  console.log('reloading client weather...');

  const cities = clients.map((client) => client.city);
  const newWeatherData = await Promise.all(cities.map(async (city) => {
    const weatherResponse = await fetch(`https://wttr.in/${city}?format=j1`)
    const json = await weatherResponse.json();
    const weatherData = json.current_condition[0];

    return {
      city,
      weatherData
    };
  }));

  newWeatherData.forEach((weatherData) => weatherByCity[weatherData.city] = weatherData.weatherData);
  clients.forEach(client => {
    console.log(`updating client: ${client.id}`);

    const weatherData = weatherByCity[client.city];
    const data = `data: ${JSON.stringify(weatherData)}\n\n`;
    client.response.write(data);
  });

  console.log('weather reload complete.');
}

setInterval(() => {
  reloadClientWeather();
}, 30000);

app.get('/weather', weatherHandler);

async function weatherHandler(request, response, next) {
  const city = request.query.city;
  const weatherResponse = await fetch(`https://wttr.in/${city}?format=j1`);
  const weatherData = await weatherResponse.json();
  const currentCondition = weatherData.current_condition[0];
  weatherByCity[city] = currentCondition;

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(weatherByCity[city])}\n\n`;

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    city,
    response
  };

  clients.push(newClient);
  newClient.response.write(data);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
