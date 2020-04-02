import React from 'react';
import { YellowBox, View } from 'react-native'

import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/store'
import { Provider } from 'react-redux'

import Routing from './src/Routing'

import { Fire } from './src/services'

Fire.init()

YellowBox.ignoreWarnings(['Warning: `flexWrap: `wrap`` ']);
YellowBox.ignoreWarnings(['Setting a timer'])
YellowBox.ignoreWarnings(['componentWill'])

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<View style={{flex: 1, backgroundColor: '#fff'}}></View>} persistor={persistor}>
        <Routing />
      </PersistGate>
    </Provider>
  );
}