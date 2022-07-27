import React, { useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import styled from 'styled-components/native';
import { weatherAPI } from '../../lib/api/weather';
import { getCurrentLocation } from '~/components/geolocation';

const Container = styled.View`
  border: 3px solid orange;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Button = styled.Pressable`
  flex: 1;
`;

const MovieList = styled.FlatList`
  flex: 10;
`;

const Item = styled.Text``;

const Spinner = styled.ActivityIndicator``;

function WeatherView() {
  const [todos, setTodos] = useState<any[]>([]);

  const delayTime = () => {
    return new Promise<void>(resolve => {
      console.log('delay start!');
      setTimeout(() => {
        resolve();
        console.log('delay finish!');
      }, 3000);
    });
  };

  async function getData() {
    try {
      // const result = await weatherAPI().then(res => res.data);
      // await delayTime();
      // setTodos(result);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    console.log('useEffect');
    getData();
  }, []);

  return (
    <Container>
      <Button
        onPress={() => {
          getCurrentLocation();
        }}>
        <Text>Go</Text>
      </Button>
      <MovieList
        ListEmptyComponent={<Spinner size={60} color="#00a6fb" />}
        contentContainerStyle={todos.length === 0 && style.empty}
        keyExtractor={(item: any) => item.id}
        data={todos}
        renderItem={({ item }: any) => {
          return <Item>{`${item.id}. ${item.title}`}</Item>;
        }}
      />
    </Container>
  );
}

const style = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default WeatherView;
