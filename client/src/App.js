import { useEffect, useState, useRef, useCallback } from 'react';

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [city, setCity] = useState('New York');
  const [currentEventSource, setCurrentEventSource] = useState(null);
  const searchInput = useRef(null);

  const getWeatherData = useCallback(() => {
    const eventSource = new EventSource(`http://localhost:3001/weather?city=${city}`);
    eventSource.onmessage = (event) => {
      setWeatherData(JSON.parse(event.data));
    };
    setCurrentEventSource(eventSource);
  }, [city]);

  const handleSearch = (event) => {
    event.preventDefault()
    currentEventSource?.close();
    setCity(searchInput.current.value);
  };

  useEffect(() => {
    getWeatherData();
  }, [getWeatherData]);

  return (
    <div className="carousel-cell">
      <form onSubmit={handleSearch}>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search City..."
            required
            ref={searchInput}
          />
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
      </form>
      <div className="flex mt-4">
        <div className="py-4 mx-2 px-2 bg-white rounded-md w-3/12">
          <div id="current-weather-snapshot">
            <div className="text-xl mb-2">{city}</div>
            <div className="text-xl mb-2">Currently</div>

            <div className="flex">
              <div className="text-5xl">{weatherData.temp_F}°</div>
            </div>
            <p>Feels Like: {weatherData.FeelsLikeF}°</p>
            <p>Conditions: {weatherData.weatcherDesc && weatherData.weatherDesc[0].value}</p>

            <table className="table-auto w-full mt-3">
              <tbody>
                <tr className="border-b">
                  <td>Humidity</td>
                  <td>{weatherData.humidity}%</td>
                </tr>
                <tr className="border-b">
                  <td>Visibility</td>
                  <td>
                    {weatherData.visibilityMiles} miles
                  </td>
                </tr>
                <tr className="border-b">
                  <td>Wind</td>
                  <td>
                    {weatherData.windspeedMiles}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
