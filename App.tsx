import React from 'react';
import { YellowBox } from 'react-native'

import { store } from './src/store'
import { Provider } from 'react-redux'

import Routing from './src/Routing'

import { Fire } from './src/services'

Fire.init()

YellowBox.ignoreWarnings(['Warning: `flexWrap: `wrap`` ']);
YellowBox.ignoreWarnings(['Setting a timer'])

export default function App() {
  return (
    <Provider store={store}>
      <Routing />
    </Provider>
  );
}