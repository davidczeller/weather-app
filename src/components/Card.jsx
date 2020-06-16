import React, {useEffect, useState} from "react"
import './Card.scss'

import {Paper, Typography, IconButton, Icon} from '@material-ui/core'
import {LocationSearching, Grain, WbSunny, Cloud} from '@material-ui/icons';

export default function Card() {

  const [currWeather, setCurrWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [city, setCity] = useState('Florida')
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bb6d0e601597f17b2c6b2e6bc419ac17&units=metric`)
    .then(res => res.json())
    .then(response => {
      setCurrWeather(response)
    })
    //TODO error handling
    .catch(error => console.log(error));
  }, [refresh]);


  useEffect(() => {
    fetch("http://api.openweathermap.org/data/2.5/forecast?q=Vienna&appid=bb6d0e601597f17b2c6b2e6bc419ac17&units=metric")
    .then(res => res.json())
    .then(response => setForecast(response))
    .catch(error => console.log(error));
  }, []);

  console.log(currWeather && {currWeather})
  console.log(forecast && {forecast})

  let icon = '-'

  const items = forecast && forecast.list.slice(0, 10).map(item => {
    if (item.weather[0].description.includes('cloud')) icon = <Cloud/>
    if (item.weather[0].description.includes('rain')) icon = <Grain/>
    if (item.weather[0].description.includes('sun')) icon = <WbSunny/>
    return <div key={item.dt}>
      <Typography>{`${item.dt_txt.charAt(11)}${item.dt_txt.charAt(12)}:00`}</Typography>
      {icon}
      {/*<Typography>{item.weather[0].description}</Typography>*/}
      <Typography>{`${Math.round(item.main.temp)}°`}</Typography>
    </div>
  })

  return (
    <Paper className='paper'>
      <div className='topContainer'>
        <div className='background'/>
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
                onChange={e => setCity(e.target.value)}
              />
              <IconButton onClick={() => setRefresh(!refresh)}>
                <LocationSearching style={{color: 'white'}}/>
              </IconButton>
            </div>
            <Typography className='city'>
              {currWeather && currWeather.name}
            </Typography>
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
  )
}
