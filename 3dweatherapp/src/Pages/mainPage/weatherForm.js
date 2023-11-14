import React, { useEffect, useState, useContext } from "react";
import { TextField, Skeleton, Autocomplete } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import styles from "./weatherForm.module.css";
import WeeklyWeatherItem from "../../components/weeklyWeatherItem/weeklyWeatherItem";
import HourlyWeatherItem from "../../components/hourlyWeatherItem/hourlyWeatherItem";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AirIcon from '@mui/icons-material/Air';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import OpacityIcon from '@mui/icons-material/Opacity';
import { ThemeContext } from "../../contexts/themeContext";


function WeatherForm() {

    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [weatherInfo, setWeatherInfo] = useState({});
    const [location, setLocation] = useState("");
    const [locationDateTime, setLocationDateTime] = useState("");
    const key = process.env.REACT_APP_API_KEY;
    const mapTilerKey = process.env.REACT_APP_MAPTILER_API_KEY;
    const { theme } = useContext(ThemeContext);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    let timeOutId = null;

    useEffect(() => {
        setIsLoading(true);

        // fetch the weather info of location
        // if(navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(
        //         (position) => {
        //             const {latitude, longitude} = position.coords;

        //             Promise.all([
        //                 fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${key}`),
        //                 fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${key}`)
        //             ])
        //             .then(([resWeather, resLocation]) => 
        //                 Promise.all([resWeather.json(), resLocation.json()])
        //             )
        //             .then(([dataWeather, dataLocation]) => {
        //                 setWeatherInfo(dataWeather);
        //                 setLocation(dataLocation[0]);
        //                 setLocationDateTime(convertEpochToDateTime(dataWeather.current.dt));
        //                 setIsLoading(false);
        //             })
        //         },
        //         (error) => {
        //             console.error(error);
        //             setIsLoading(false);
        //         }
        //     )
        // }
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=51.0447&lon=-114.0719&exclude=minutely&units=metric&appid=${key}`)
            .then(res => res.json())
            .then(data => {
                // Fetch the location name 
                fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${data.lat}&lon=${data.lon}&limit=1&appid=${key}`)
                    .then(res => res.json())
                    .then(data => {
                        setLocation(data[0]);
                    })
                    .catch(err => console.error(err))
                setWeatherInfo(data);
                setLocationDateTime(convertEpochToDateTime(data.current.dt));
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if(inputValue) {

        }
    },[inputValue])

    const convertEpochToDateTime = (epoch) => {
        return new Date(epoch * 1000);
    }

    const handleCitySelect = (event, value) => {
        console.log(value);
    }

    const handleInputChange = ( event, value ) => {
        // Clear ongoing timeout
        clearTimeout(timeOutId);

        // wait before setting inputValue to avoid making too many api calls
        // 500ms
        timeOutId = setTimeout(() => {
            setInputValue(value)
        }, 500)
    }

    // const handleDragEnd = (result) => {
    //     if (!result.destination) return;

    //     const items = Array.from(weatherList);
    //     const [reorderedItem] = items.splice(result.source.index, 1);
    //     items.splice(result.destination.index, 0, reorderedItem);
    //     updateWeatherList(items);
    // }

    return (
        <div className={styles.container} data-theme={theme}>
            {/* <TextField
                onChange={searchChange}
                value={searchQuery}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                }} /> */}
            {/* <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {weatherList.map((item, index) => (
                                <Draggable
                                    key={item.lat}
                                    draggableId={item.lat.toString()}
                                    index={index}>
                                    {(provided) => (
                                        <div
                                            className={styles.draggableWrapper}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {item.temp}
                                            <WeatherBlock weather={weatherInfo} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext> */}
            <div className={styles.contentContainer}>
                <div className={styles.mainLocationContainer}>
                    <div className={styles.currentWeatherContainer}>
                        <div className={styles.searchBarWrapper}>
                            <Autocomplete
                                onInputChange={handleInputChange}
                                onChange={handleCitySelect}
                                className={styles.searchLocation}
                                selectOnFocus
                                options={citySuggestions}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => (
                                    <TextField {...params} label="City" variant="standard" />
                                )} />
                            {/* <TextField
                                sx={{
                                    input: { color: theme === "light" ? '#303042' : '#ffffff' },
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: theme === "light" ? '#303042' : '#856f72',
                                    },
                                    "& .MuiInput-underline:before": {
                                        borderBottomColor: theme === "light" ? '#303042' : '#ffffff',
                                    },
                                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                                        borderBottomColor: theme === "light" ? '#303042' : '#ffffff',
                                    },
                                    "& label.Mui-focused": {
                                        color: theme === "light" ? '#303042' : '#ffffff',
                                    }
                                }}
                                InputLabelProps={{
                                    sx: {
                                        color: theme === "light" ? '#303042' : '#ffffff',
                                    },
                                }}
                                variant="standard"
                                className={styles.searchLocation}
                                value={searchQuery}
                                label="Search for City"
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <SearchIcon sx={{ color: theme === "light" ? '#303042' : '#ffffff', }} />
                                        </InputAdornment>
                                }} /> */}
                        </div>
                        <div className={styles.currentWeatherWrapper}>
                            {
                                !isLoading ? (
                                    <>
                                        <h1 className={styles.locationTitle}>
                                            {location.name}
                                            <span className={styles.locationCountry}>
                                                {location.country}
                                            </span>
                                        </h1>
                                        <span className={styles.locationDate}>{locationDateTime.toDateString()}</span>
                                        <img className={styles.mainWeatherIcon}
                                            src={`https://openweathermap.org/img/wn/${weatherInfo.current.weather[0].icon}@4x.png`}
                                            alt="main_weather_icon" />
                                        <span id={styles.currentTemp}>
                                            {Math.round(weatherInfo && weatherInfo.current.temp)}&deg;C
                                        </span>
                                        <span id={styles.feelsLike}>
                                            Feels like: {Math.round(weatherInfo && weatherInfo.current.feels_like)}&deg;C
                                        </span>
                                    </>
                                ) : (
                                    <div className={styles.currentWeatherWrapper}>
                                        <div className={styles.locationTitle}>
                                            <Skeleton width={200} height={100} />
                                        </div>
                                        <div className={styles.locationDate}>
                                            <Skeleton width={220} height={30} />
                                        </div>
                                        <div id={styles.currentTemp}>
                                            <Skeleton width={130} height={130} />
                                        </div>
                                        <div id={styles.feelsLike}>
                                            <Skeleton width={150} height={30} />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className={styles.weatherInfo}>
                        <div className={styles.weatherInfoWrapper}>
                            {
                                !isLoading ? (
                                    <>
                                        <h3 className={styles.subTitle}>
                                            Weather Conditions
                                        </h3>
                                        <div className={styles.informationContainer}>
                                            <div>
                                                <div className={styles.infoTitle}>
                                                    <OpacityIcon />
                                                    <span>Humidity</span>
                                                </div>
                                                <span className={styles.infoText}>
                                                    {weatherInfo.current.humidity}%
                                                </span>
                                            </div>
                                            <div>
                                                <div className={styles.infoTitle}>
                                                    <AirIcon />
                                                    <span>Wind Speed</span>
                                                </div>
                                                <span className={styles.infoText}>
                                                    {weatherInfo.current.wind_speed}m/s
                                                </span>
                                            </div>
                                            <div>
                                                <div className={styles.infoTitle}>
                                                    <WbSunnyIcon />
                                                    <span>UV Index</span>
                                                </div>
                                                <span className={styles.infoText}>
                                                    {weatherInfo.current.uvi}%
                                                </span>
                                            </div>
                                            <div>
                                                <div className={styles.infoTitle}>
                                                    <Brightness4Icon />
                                                    <span>Sunrise/Sunset</span>
                                                </div>
                                                <span className={styles.infoText}>
                                                    {convertEpochToDateTime(weatherInfo.current.sunrise).getHours()}:
                                                    {convertEpochToDateTime(weatherInfo.current.sunrise).getMinutes()}
                                                    /
                                                    {convertEpochToDateTime(weatherInfo.current.sunset).getHours()}:
                                                    {convertEpochToDateTime(weatherInfo.current.sunset).getMinutes()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className={styles.infoTitle}>
                                                    <AvTimerIcon />
                                                    <span>Pressure</span>
                                                </div>
                                                <span className={styles.infoText}>
                                                    {weatherInfo.current.pressure / 1000}khPa
                                                </span>
                                            </div>
                                            <div>
                                                <span className={styles.infoTitle}>
                                                    Precipitation
                                                </span>
                                                <div>
                                                    {
                                                        weatherInfo.current.rain || weatherInfo.current.snow ? (
                                                            <>
                                                                {
                                                                    weatherInfo.current.rain ? (
                                                                        <div className={styles.infoText}
                                                                            style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                            <WaterDropIcon />
                                                                            <span style={{ marginLeft: "5px" }}>
                                                                                {weatherInfo.current.rain["1h"]} mm/h
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className={styles.infoText}
                                                                            style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                            <AcUnitIcon />
                                                                            <span style={{ marginLeft: "5px" }}>
                                                                                {weatherInfo.current.snow["1h"]} mm/h
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className={styles.infoText}>0 mm/h</span>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.weatherInfoWrapper}>
                                        <h3 className={styles.subTitle}>
                                            <Skeleton animation="wave" width={150} height={30} />
                                        </h3>
                                        <div className={styles.informationContainer}>
                                            <div>
                                                <Skeleton animation="wave" width={120} height={90} />
                                            </div>
                                            <div>
                                                <Skeleton animation="wave" width={120} height={90} />
                                            </div>
                                            <div>
                                                <Skeleton animation="wave" width={120} height={90} />
                                            </div>
                                            <div>
                                                <Skeleton animation="wave" width={120} height={90} />
                                            </div>
                                            <div>
                                                <Skeleton animation="wave" width={120} height={90} />
                                            </div>
                                            <div>
                                                <Skeleton animation="wave" width={120} height={90} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className={styles.hourlyWeatherContainer}>
                        <div className={styles.hourlyWeatherWrapper}>
                            {
                                !isLoading ? (
                                    <>
                                        <h3 className={styles.subTitle}>
                                            Hourly Forecast
                                        </h3>
                                        <div className={styles.scrollableContainer}>
                                            {
                                                weatherInfo.hourly.map((hourData, index) => (
                                                    <HourlyWeatherItem key={index} weather={hourData} />
                                                ))
                                            }
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <Skeleton variant="rounded" animation="wave" width={210} height={60} />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.weeklyWeatherContainer}>
                    {
                        !isLoading ? (
                            <div className={styles.weeklyWeatherWrapper}>
                                <h3 className={styles.weekTitle}>7-Day Forecast</h3>
                                <div className={styles.weeklyList}>
                                    {
                                        weatherInfo.daily.map((item, index) => (
                                            <WeeklyWeatherItem
                                                key={index}
                                                weather={item} />
                                        ))
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className={styles.weeklyWeatherWrapper}>
                                <div className={styles.weekTitle}>
                                    <Skeleton variant="rounded" animation="wave" width={200} height={30} />
                                </div>
                                <div className={styles.loaderWrapper}>
                                    <Skeleton variant="rounded" animation="wave" width={300} height={50} />
                                    <Skeleton variant="rounded" animation="wave" width={300} height={50} />
                                    <Skeleton variant="rounded" animation="wave" width={300} height={50} />
                                    <Skeleton variant="rounded" animation="wave" width={300} height={50} />
                                    <Skeleton variant="rounded" animation="wave" width={300} height={50} />
                                    <Skeleton variant="rounded" animation="wave" width={300} height={50} />
                                    <Skeleton variant="rounded" animation="wave" width={300} height={50} />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default WeatherForm;