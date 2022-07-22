import { useState, useEffect } from 'react';
import axios from 'axios';

const kelvinToCelsius = (kelvin) => kelvin - 273.15;

const Weather = ({ country }) => {
  const conditionCodes = [
    {
      id: 200,
      main: 'ThunderStorm',
      description: 'thunderstorm with light rain',
      icon: '11',
    },
    {
      id: 201,
      main: 'ThunderStorm',
      description: 'thunderstorm with rain',
      icon: '11',
    },
    {
      id: 202,
      main: 'ThunderStorm',
      description: 'thunderstorm with heavy rain',
      icon: '11',
    },
    {
      id: 210,
      main: 'ThunderStorm',
      description: 'light thunderstorm ',
      icon: '11',
    },
    { id: 211, main: 'ThunderStorm', description: 'thunderstorm', icon: '11' },
    {
      id: 212,
      main: 'ThunderStorm',
      description: 'heavy thunderstorm',
      icon: '11',
    },
    {
      id: 221,
      main: 'ThunderStorm',
      description: 'ragged thunderstorm',
      icon: '11',
    },
    {
      id: 230,
      main: 'ThunderStorm',
      description: 'thunderstorm with light drizzle',
      icon: '11',
    },
    {
      id: 231,
      main: 'ThunderStorm',
      description: 'thunderstorm with drizzle',
      icon: '11',
    },
    {
      id: 232,
      main: 'ThunderStorm',
      description: 'thunderstorm with heavy drizzle',
      icon: '11',
    },

    {
      id: 300,
      main: 'Drizzle',
      description: 'light intensity drizzle',
      icon: '09',
    },
    { id: 301, main: 'Drizzle', description: 'drizzle', icon: '09' },
    {
      id: 302,
      main: 'Drizzle',
      description: 'heavy intensity drizzle',
      icon: '09',
    },
    {
      id: 310,
      main: 'Drizzle',
      description: 'light intensity drizzle rain',
      icon: '09',
    },
    { id: 311, main: 'Drizzle', description: 'drizzle rain', icon: '09' },
    {
      id: 312,
      main: 'Drizzle',
      description: 'heavy intensity drizzle rain',
      icon: '09',
    },
    {
      id: 313,
      main: 'Drizzle',
      description: 'shower rain and drizzle',
      icon: '09',
    },
    {
      id: 314,
      main: 'Drizzle',
      description: 'heavy shower rain and drizzle',
      icon: '09',
    },
    { id: 321, main: 'Drizzle', description: 'shower drizzle', icon: '09' },
    { id: 500, main: 'Rain', description: 'light rain', icon: '10' },
    { id: 501, main: 'Rain', description: 'moderate rain', icon: '10' },
    {
      id: 502,
      main: 'Rain',
      description: 'heavy intensity rain',
      icon: '10',
    },
    { id: 503, main: 'Rain', description: 'very heavy rain', icon: '10' },
    { id: 504, main: 'Rain', description: 'extreme rain', icon: '10' },
    { id: 511, main: 'Rain', description: 'freezing rain', icon: '13' },
    {
      id: 520,
      main: 'Rain',
      description: 'light intensity shower rain',
      icon: '09',
    },
    { id: 521, main: 'Rain', description: 'shower rain', icon: '09' },
    {
      id: 522,
      main: 'Rain',
      description: 'heavy intensity shower rain',
      icon: '09',
    },
    { id: 531, main: 'Rain', description: 'ragged shower rain', icon: '09' },
    { id: 600, main: 'Snow', description: 'light snow', icon: '13' },
    { id: 601, main: 'Snow', description: 'Snow', icon: '13' },
    { id: 602, main: 'Snow', description: 'Heavy snow', icon: '13' },
    { id: 611, main: 'Snow', description: 'Sleet', icon: '13' },
    { id: 612, main: 'Snow', description: 'Light shower sleet', icon: '13' },
    { id: 613, main: 'Snow', description: 'Shower sleet', icon: '13' },
    { id: 615, main: 'Snow', description: 'Light rain and snow', icon: '13' },
    { id: 616, main: 'Snow', description: 'Rain and snow', icon: '13' },
    { id: 620, main: 'Snow', description: 'Light shower snow', icon: '13' },
    { id: 621, main: 'Snow', description: 'Shower snow', icon: '13' },
    { id: 622, main: 'Snow', description: 'Heavy shower snow', icon: '13' },
    { id: 701, main: 'Mist', description: 'mist', icon: '50' },
    { id: 711, main: 'Smoke', description: 'Smoke', icon: '50' },
    { id: 721, main: 'Haze', description: 'Haze', icon: '50' },
    { id: 731, main: 'Dust', description: 'sand/ dust whirls', icon: '50' },
    { id: 741, main: 'Fog', description: 'fog', icon: '50' },
    { id: 751, main: 'Sand', description: 'sand', icon: '50' },
    { id: 761, main: 'Dust', description: 'dust', icon: '50' },
    { id: 762, main: 'Ash', description: 'volcanic ash', icon: '50' },
    { id: 771, main: 'Squall', description: 'squalls', icon: '50' },
    { id: 781, main: 'Tornado', description: 'tornado', icon: '50' },
    { id: 800, main: 'Clear', description: 'clear sky', icon: '01' },
    {
      id: 801,
      main: 'Clouds',
      description: 'few clouds: 11-25%',
      icon: '02',
    },
    {
      id: 802,
      main: 'Clouds',
      description: 'scattered clouds: 25-50%',
      icon: '03',
    },
    {
      id: 803,
      main: 'Clouds',
      description: 'broken clouds: 51-84%',
      icon: '04',
    },
    {
      id: 804,
      main: 'Clouds',
      description: 'overcast clouds: 85-100%',
      icon: '04',
    },
  ];

  const [weather, setWeather] = useState([]);
  const api_key = process.env.REACT_APP_API_KEY;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${api_key}`;

  const hook = () => {
    axios.get(weatherUrl).then((response) => {
      setWeather(response.data);
    });
  };

  useEffect(hook, []);

  if (weather.length === 0) return;

  console.log(weather);

  const temperature = parseFloat(kelvinToCelsius(weather.main.temp).toFixed(2));
  const wind = weather.wind.speed;
  const sunrise = parseInt(weather.sys.sunrise);
  const sunset = parseInt(weather.sys.sunset);
  const currentTime = parseInt(new Date().getTime() / 1000);
  const dayNight = currentTime > sunrise && currentTime < sunset ? 'd' : 'n';
  const imageId = parseInt(weather.weather[0].id);
  const imageIcon = conditionCodes.find((cc) => cc.id === imageId).icon;
  const imageAlt = conditionCodes.find((cc) => cc.id === imageId).description;
  const imageUrl = `http://openweathermap.org/img/wn/${imageIcon}${dayNight}@2x.png`;

  return (
    <div>
      <div>temperature {temperature} celsius</div>
      <img src={imageUrl} alt={'Icon of ' + imageAlt} />
      <div>wind {wind} m/s</div>
    </div>
  );
};

const Country = ({ name, setSearch }) => {
  return (
    <div>
      {name} <button onClick={() => setSearch(name)}>show</button>
    </div>
  );
};

const CountryDetail = ({ country }) => {
  const alt = `"flag of ${country.name.common}"`;
  const capital = country.capital[0];

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} height='150px' alt={alt} />
      <h2>Weather in {capital}</h2>
      <Weather country={country} />
    </div>
  );
};

const Countries = ({ countries, search, setSearch }) => {
  if (search === '') return <div></div>;

  const newCountries = countries.filter((c) => {
    return c.name.common.toLowerCase().includes(search.toLowerCase());
  });

  if (newCountries.length == 1) {
    return (
      <>
        <CountryDetail country={newCountries[0]} />
      </>
    );
  } else if (newCountries.length > 10) {
    return (
      <>
        <div>Too many matches, specify another filter</div>
      </>
    );
  } else {
    return (
      <>
        {newCountries.map((country) => (
          <Country
            key={country.ccn3}
            name={country.name.common}
            setSearch={setSearch}
          />
        ))}
      </>
    );
  }
};

const Filter = ({ search, handler }) => (
  <div>
    find countries <input value={search} onChange={handler} />
  </div>
);

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  const hook = () => {
    axios.get('https://restcountries.com/v3.1/all').then((response) => {
      setCountries(response.data);
    });
  };

  useEffect(hook, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <Filter search={search} handler={handleSearchChange} />
      <Countries countries={countries} search={search} setSearch={setSearch} />
    </div>
  );
};

export default App;
