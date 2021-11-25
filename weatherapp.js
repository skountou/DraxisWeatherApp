const timeElement = document.getElementById('time')
const dateElement = document.getElementById('date')
const curWeatherItem = document.getElementById('current-weather-items')
const timezone = document.getElementById('time-zone')
const country = document.getElementById('country')
const weatherForecast = document.getElementById('weather-forecast')
const currentForecast = document.getElementById('current-forecast')


//Update Date-Time
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const API_KEY = '3e8dfafc21db238b9cba49e8edc04802';

setInterval(() => {
    const presentTime = new Date();
    const month = presentTime.getMonth();
    const date = presentTime.getDate();
    const day = presentTime.getDay();
    const hour = presentTime.getHours();
    const hours12hformat = hour >= 13 ? hour %12: hour
    const minutes = presentTime.getMinutes();
    // const ampm = hour >= 12 ? 'PM' : 'AM'

    timeElement.innerHTML = hour + ':' + (minutes <10? '0'+ minutes: minutes)
    dateElement.innerHTML = days[day] + ','+ date + ' '+ months[month]

}, 1000);   //interval that is called each second to update time and date.





getWeatherData() //Where we fetch the data from the API

//First we try to get the location of "us", and after a successful call, we pass the coordinates into two new variables named latitude longitude.

//After that, using fetch we connect to the API using the API_KEY we defined above. We changed the coordinates to match the ones we received from our earlier geolocation call.We excluded hourly and minutely. We also changed the units to be metric as we don't Farenheit but Celsius.
//Next we call another function so we can show the data we collected.
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude,longitude} = success.coords; 
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    })
}


//we take these specific values that are declared in the let brackets from the API. We found these names in the console return we used in the function above. Console.log(data)
function showWeatherData (data){
    let { temp, feels_like, pressure, humidity, wind_speed, wind_deg, clouds} = data.current;

    //We also pass these information
    timezone.innerHTML = data.timezone;
    // country.innerHTML = data.lat + 'N ' + data.lon + 'E'


    // We present the data collected in our HTML
    curWeatherItem.innerHTML = 
    `<div class="weather-item">
    <div>Temperature&nbsp;&nbsp;</div>
    <div>${temp}&#176;C</div>
    </div>

    <div class="weather-item">
    <div>Feels like </div>
    <div>${feels_like}&#176;C</div>
    </div>

    <div class="weather-item">
    <div>Pressure</div>
    <div>${pressure}</div>
    </div>

    <div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
    </div>

    <div class="weather-item">
    <div>Wind Speed</div>
    <div>${wind_speed}km/h</div>
    </div>

    <div class="weather-item">
    <div>Wind Direction</div>
    <div>${wind_deg}&#176;</div>
    </div>

    <div class="weather-item">
    <div>Clouds</div>
    <div>${clouds}</div>
    </div>`;




    let otherDayForecast = ''


    data.daily.forEach(day, index => {
        if (index == 0){
            currentForecast.innerHTML = `
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="weather-icon">
                <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            
            `
        }else{
            otherDayForecast +=`
            <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd') 
            }</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="weather-icon">
            <div class="temp">Night - ${day.temp.night}&#176; C</div>
            <div class="temp">Day - ${day.temp.day}&#176; C</div>
            `
        }
    });

    weatherForecast.innerHTML = otherDayForecast;
}




