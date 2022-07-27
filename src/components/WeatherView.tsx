import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Button } from 'react-native';
import styled from 'styled-components/native';
import { weatherAPI } from '../../lib/api/weather';
import { getCurrentLocation } from '~/components/geolocation';
import Config from 'react-native-config';

const Container = styled.View`
  flex: 1;
  background-color: #dbdbdb;
`;

const WeatherContainer = styled(FlatList)``;

const InfoWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const Info = styled.Text`
  margin-bottom: 5px;
  font-size: 16px;
`;

const LoadingView = styled.View``;

const Spinner = styled.ActivityIndicator``;

const LoadingLabel = styled.Text`
  padding-left: 8px;
  padding-top: 15px;
  text-align: center;
`;

type LocationType = {
  id: number;
  country: string;
  city: string;
  list: any;
  currentTime: any;
};

function WeatherView() {
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);
  const [location, setLocation] = useState<LocationType[]>([]);

  /* const delayTime = () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }; */
  const delayTime = (ms: number) =>
    new Promise<void>(resolve => setTimeout(resolve, ms));

  const openWeatherApiObject = {
    list: [
      {
        dt: 1657994400, // dt * 1000 required to be milliseconds
        dt_txt: '2022-07-16 18:00:00',
        main: {
          temp: 15.65,
          humidity: 81,
        },
        weather: [
          {
            main: 'Cloud',
            description: 'few clouds',
          },
        ],
      },
    ],
  };

  type OptionType = {
    refreshControl: boolean;
  };

  async function getCurrentWeather(option?: OptionType) {
    let refreshControl;

    if (!option) {
      refreshControl = true;
    } else {
      refreshControl = option.refreshControl;
    }

    refreshControl && setIsRefreshLoading(true); // RefreshControl start
    const { status, lat, lng } = await getCurrentLocation();

    // eslint-disable-next-line curly
    if (status !== 'ok') return;

    try {
      await delayTime(1200);
      const { list, city } = await weatherAPI({ lat, lng }).then(
        res => res.data,
      );
      console.log('get api data');
      const currentTime = new Date(Date.now())
        .toISOString()
        .toString()
        .split('.')[0];
      setLocation([
        {
          id: 1,
          country: city.country,
          city: city.name,
          list,
          currentTime,
        },
      ]);
      refreshControl && setIsRefreshLoading(false); // RefreshControl finish
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    console.log(JSON.stringify(Config, null, 2));
    getCurrentWeather({ refreshControl: false });
  }, []);

  /* const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setIsloading(true);
    wait(2000).then(() => setIsloading(false));
  }, []); */

  return (
    <Container>
      <Button title="refresh!" onPress={() => getCurrentWeather()} />
      <WeatherContainer
        refreshing={isRefreshLoading}
        onRefresh={getCurrentWeather}
        ListEmptyComponent={
          <LoadingView>
            <Spinner size={60} color="#00a6fb" />
            <LoadingLabel>Loading...</LoadingLabel>
          </LoadingView>
        }
        // contentContainerStyle={location.length === 0 && style.empty}
        contentContainerStyle={style.empty}
        keyExtractor={(item: any, index: number) => `Weather-${index}`}
        data={location}
        renderItem={({ item }: any) => (
          <InfoWrapper>
            <Info>{item.currentTime}</Info>
            <Info>{`${item.list[0].weather[0].main}`}</Info>
            <Info>{`(${item.list[0].weather[0].description})`}</Info>
            <Info>Temperature / Humidity</Info>
            <Info>{`${item.list[0].main.temp}°C / ${item.list[0].main.humidity}%`}</Info>
            <Info>{`${item.city} / ${item.country}`}</Info>
            <Info>Last update: {item.list[0].dt_txt.slice(0, -3)}</Info>
          </InfoWrapper>
        )}
      />
    </Container>
  );
}

const style = StyleSheet.create({
  empty: {
    // flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default WeatherView;
