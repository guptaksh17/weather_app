import React from 'react';
import PropTypes from 'prop-types';
import './current-weather.css'; // Ensure you have this file for styling

export const CurrentWeather = ({ data }) => {
    return (
        <div className="weather">
            <div className="top">
                <div>
                    <p className="city">{data.city}</p>
                    <p className="weather-description">{data.weather[0].description}</p>
                </div>
                <img 
                    alt="weather" 
                    className="weather-icon" 
                    src={`icons/${data.weather[0].icon}.png`} 
                />
            </div>
            <div className="bottom">
                <p className="temperature">{Math.round(data.temp)}°{data.isCelsius ? 'C' : 'F'}</p>
                <div className="details">
                    <div className="parameter-row">
                        <span className="parameter-label">Details</span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label">Feels like:</span>
                        <span className="parameter-value">{Math.round(data.main.feels_like)}°{data.isCelsius ? 'C' : 'F'}</span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label">Wind:</span>
                        <span className="parameter-value">{data.wind.speed} m/s</span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label">Humidity:</span>
                        <span className="parameter-value">{data.main.humidity}%</span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label">Pressure:</span>
                        <span className="parameter-value">{data.main.pressure} hPa</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// PropTypes for type checking
CurrentWeather.propTypes = {
    data: PropTypes.shape({
        city: PropTypes.string.isRequired,
        weather: PropTypes.arrayOf(
            PropTypes.shape({
                description: PropTypes.string,
                icon: PropTypes.string,
            })
        ).isRequired,
        main: PropTypes.shape({
            feels_like: PropTypes.number.isRequired,
            humidity: PropTypes.number.isRequired,
            pressure: PropTypes.number.isRequired,
        }).isRequired,
        wind: PropTypes.shape({
            speed: PropTypes.number.isRequired,
        }).isRequired,
        temp: PropTypes.number.isRequired,
        isCelsius: PropTypes.bool.isRequired,
    }).isRequired,
};

export default CurrentWeather;
