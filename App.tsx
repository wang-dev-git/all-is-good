import React, { useEffect } from "react"
import { LogBox, View } from 'react-native'

import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/store'
import { Provider } from 'react-redux'

import Routing from './src/Routing'
import { Fire } from './src/services'
import { mainStyle } from './src/styles'

Fire.init()

LogBox.ignoreLogs(['Warning: `flexWrap: `wrap`` ']);
LogBox.ignoreLogs(['Setting a timer'])
LogBox.ignoreLogs(['componentWill'])

export default function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={<View style={{flex: 1, backgroundColor: mainStyle.themeColor}}></View>} persistor={persistor}>
        <Routing />
      </PersistGate>
    </Provider>
  );
}
