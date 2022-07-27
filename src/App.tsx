import React from 'react';
import styled from 'styled-components/native';
import WeatherView from '~/components/WeatherView';

const Container = styled.View`
  flex: 1;
`;

function App() {
  return (
    <Container>
      <WeatherView />
    </Container>
  );
}

export default App;
