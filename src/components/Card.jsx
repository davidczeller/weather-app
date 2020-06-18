import React, {useEffect, useState} from "react"

import {Paper, Typography, IconButton, Button} from '@material-ui/core'
import {LocationSearching, Grain, WbSunny, Cloud} from '@material-ui/icons';

import moment from 'moment';

import './Card.scss'
import Sunny from '../static/images/sunny.jpg'
import Rainy from '../static/images/rain.jpg'
import Cloudy from '../static/images/cloud.jpg'

export default function Card() {

  const [currWeather, setCurrWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [city, setCity] = useState('Vienna')
  const [refresh, setRefresh] = useState(false)
  const [unit, setUnit] = useState('metric')
  const [quote, setQuote] = useState('')

  //current weather
  useEffect(() => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bb6d0e601597f17b2c6b2e6bc419ac17&units=${unit}`)
    .then(res => res.json())
    .then(response => {
      setCurrWeather(response)
    })
    //TODO error handling
    .catch(error => console.log(error));
  }, [refresh]);


  //hourly forecast
  useEffect(() => {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=bb6d0e601597f17b2c6b2e6bc419ac17&units=${unit}`)
    .then(res => res.json())
    .then(response => setForecast(response))
    .catch(error => console.log(error));
  }, [refresh]);


  //quote
  useEffect(() => {
    fetch('http://quotes.rest/qod.json?category=inspire&maxlength=50')
    .then(res => res.json())
    .then(response => setQuote(response.contents.quotes[0]))
    .catch(error => console.log(error));
  }, [refresh]);


  //TODO
  // const sunset = currWeather && moment(currWeather.sys.sunset).format('hh:mm')
  // const sunrise = currWeather && moment(currWeather.sys.sunrise).format('hh:mm')

  // console.log(currWeather && {currWeather})
  // console.log(forecast && {forecast})
  // console.log({sunset, sunrise})

  const today = moment().format('dddd');


  let icon = '-'
  let background = ''
  const highArr = forecast && forecast.list.slice(1, 11).map(item => item.main.temp_max)
  const highest = highArr && Math.max(...highArr)
  const lowArr = forecast && forecast.list.slice(1, 11).map(item => item.main.temp_min)
  const lowest = lowArr && Math.min(...lowArr)


  const items = forecast && forecast.list.slice(1, 11).map(item => {
    if (item.weather[0].description.includes('cloud')) {
      icon = <Cloud/>
      background = Cloudy
    }
    if (item.weather[0].description.includes('rain')) {
      icon = <Grain/>
      background = Rainy
    }
    if (item.weather[0].description.includes('sun') || item.weather[0].description.includes('clear')) {
      icon = <WbSunny/>
      background = Sunny
    }

    return (
      <div key={item.dt}>
        <Typography>{`${item.dt_txt.charAt(11)}${item.dt_txt.charAt(12)}:00`}</Typography>
        {icon}
        <Typography>{`${Math.round(item.main.temp)}°`}</Typography>
      </div>
    )
  })


  const dailyForecastDayArr = forecast && forecast.list.filter((value, index) => index % 8 - 5 === 0)
  const dailyForecastDay = dailyForecastDayArr && dailyForecastDayArr.map(item => item.main.temp)
  const dailyForecastDay2 = dailyForecastDayArr && dailyForecastDayArr.map(item => item.weather[0].description)

  const dailyForecastNightArr = forecast && forecast.list.filter((value, index) => index % 8 - 2 === 0)
  const dailyForecastNight = dailyForecastNightArr && dailyForecastNightArr.map(item => item.main.temp)

  let days = []
  for (let i = 0; i < 5; i++) {
    days.push(moment().add(i + 1, 'days').format('dddd'))
  }


  let bottomIcon = '-'
  const day = days && days.map((item, index) => {
    if (dailyForecastDay2 && dailyForecastDay2[index].includes('cloud')) {
      bottomIcon = <Cloud fontSize="large"/>
    }
    if (dailyForecastDay2 && dailyForecastDay2[index].includes('rain')) {
      bottomIcon = <Grain fontSize="large"/>
    }
    if ((dailyForecastDay2 && dailyForecastDay2[index].includes('sun'))
      || (dailyForecastDay2 && dailyForecastDay2[index].includes('clear'))) {
      bottomIcon = <WbSunny fontSize="large"/>
    }
    return (
      <div key={index} className='forecastInner'>
        <div>{item}</div>
        <div>{bottomIcon}</div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>{dailyForecastDay && Math.round(dailyForecastDay[index])}</div>
          <div>{dailyForecastNight && Math.round(dailyForecastNight[index])}</div>
        </div>
      </div>
    )
  })


  return (
    <div className='page' style={{backgroundImage: `url(${background})`}}>
      <div className='overlay'/>
      <Paper className='paper'>
        <div className='background' style={{backgroundImage: `url(${background})`}}/>
        <div className='topContainer'>
          <div className='innerContainer'>
            <div className='leftContainer'>
              <Typography className='cloudy'>
                {currWeather && currWeather.weather[0].description}
              </Typography>
              <Typography className='degrees'>
                {currWeather && `${Math.round(currWeather.main.temp)}°`}
              </Typography>
            </div>
            <div className='rightContainer'>
              <div className='searchContainer'>
                <input
                  type="text"
                  value={city}
                  style={{textTransform: 'capitalize'}}
                  onChange={e => setCity(e.target.value)}
                />
                <IconButton onClick={() => setRefresh(!refresh)}>
                  <LocationSearching style={{color: 'white'}}/>
                </IconButton>
                <div className='unitContainer'>
                  <Button
                    onClick={() => {
                      setUnit('metric')
                      setRefresh(!refresh)
                    }}
                    className='unitButton'
                    style={{color: unit === 'metric' ? 'red' : 'white'}}
                  >
                    C°
                  </Button>
                  <Typography style={{color: '#fff'}}>/</Typography>
                  <Button
                    onClick={() => {
                      setUnit('imperial')
                      setRefresh(!refresh)
                    }}
                    className='unitButton'
                    style={{color: unit !== 'metric' ? 'red' : 'white'}}
                  >
                    F°
                  </Button>
                </div>
              </div>
              <Typography className='city'>
                {currWeather && currWeather.name}
              </Typography>
            </div>
          </div>
          <div className='todayInfo'>
            <Typography className='day'>{today}</Typography>
            <div className='highLow'>
              <Typography>{Math.round(highest)}</Typography>
              <Typography>{Math.round(lowest)}</Typography>
            </div>
          </div>
        </div>
        <div className='slider'>
          <div>
            <Typography>
              Now
            </Typography>
            <Typography>
              {currWeather && icon}
            </Typography>
            <Typography>
              {currWeather && `${Math.round(currWeather.main.temp)}°`}
            </Typography>
          </div>
          {items}
        </div>
        <div className='bottomContainer'>
          <div className='forecast'>
            {day}
          </div>
          <div className='quote'>
            <div>
              {quote.quote}
            </div>
            <div>
              {quote.author}
            </div>
          </div>
        </div>
      </Paper>
    </div>
  )
}
