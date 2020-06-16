import React, {useEffect, useState} from "react"

import {Paper, Typography, IconButton} from '@material-ui/core'
import {LocationSearching, Grain, WbSunny, Cloud} from '@material-ui/icons';
import Button from "@material-ui/core/Button";

import moment from 'moment';

import './Card.scss'
import Sunny from '../static/images/sunny.gif'
import Rainy from '../static/images/rain.gif'
import Cloudy from '../static/images/cloud.gif'

export default function Card() {

  const [currWeather, setCurrWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [city, setCity] = useState('Vienna')
  const [refresh, setRefresh] = useState(false)
  const [unit, setUnit] = useState('metric')

  useEffect(() => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bb6d0e601597f17b2c6b2e6bc419ac17&units=${unit}`)
    .then(res => res.json())
    .then(response => {
      setCurrWeather(response)
    })
    //TODO error handling
    .catch(error => console.log(error));
  }, [refresh]);


  useEffect(() => {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=bb6d0e601597f17b2c6b2e6bc419ac17&units=${unit}`)
    .then(res => res.json())
    .then(response => setForecast(response))
    .catch(error => console.log(error));
  }, [refresh]);

  //TODO
  const sunset = currWeather && moment(currWeather.sys.sunset).format('hh:mm')
  const sunrise = currWeather && moment(currWeather.sys.sunrise).format('hh:mm')

  console.log(currWeather && {currWeather})
  console.log(forecast && {forecast})
  console.log({sunset, sunrise})

  const today = moment().format('dddd');
  const now = moment()


  let icon = '-'
  let background = ''
  const highArr = forecast && forecast.list.slice(0, 10).map(item => item.main.temp_max)
  const highest = highArr && Math.max(...highArr)
  const lowArr = forecast && forecast.list.slice(0, 10).map(item => item.main.temp_min)
  const lowest = lowArr && Math.min(...lowArr)

  console.log({highArr, highest, lowArr, lowest, now})

  const items = forecast && forecast.list.slice(0, 10).map(item => {
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
        </div>
      </Paper>
    </div>
  )
}
