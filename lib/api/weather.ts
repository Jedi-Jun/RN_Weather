import axios from '.';
import Config from 'react-native-config';

type WeatherAPIBody = {
  lat: number;
  lng: number;
};

export const weatherAPI = ({ lat, lng }: WeatherAPIBody) =>
  axios.get<any>(
    `?lat=${lat}&lon=${lng}&units=metric&appid=${Config.WEATHER_API_APPID}`,
  );
