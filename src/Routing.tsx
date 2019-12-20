import React, { Component } from 'react';

// Libs
import { Router, Stack, Scene, Modal } from 'react-native-router-flux'
import { View, Dimensions, Image } from 'react-native';

import FlashMessage from 'react-native-flash-message'
import ModalContainer from './components/Modal/ModalContainer'

import LandingScreen from './components/Landing/LandingScreen'
import LoginScreen from './components/Login/LoginScreen'

import TabsScreen from './components/Tabs/TabsScreen'

import ProfileScreen from './components/Profile/ProfileScreen'
import UserInfoScreen from './components/UserInfo/UserInfoScreen'
import WishesScreen from './components/Wishes/WishesScreen'
import CreditCardsScreen from './components/CreditCards/CreditCardsScreen'
import AddCardScreen from './components/AddCard/AddCardScreen'

import ProScreen from './components/Pro/ProScreen'
import MoreProsScreen from './components/Pros/MoreProsScreen'
import LoaderWrapper from './components/Loader/LoaderWrapper'


import { Asset } from 'expo-asset'
import { AppLoading } from 'expo';
import * as Font from 'expo-font'

function cacheImages(images: any[]) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

interface Props {}
interface State {}
export default class Routing extends React.Component<Props, State> {

  state = {
    loaded: false
  }

  async loadPictures() {
    const imageAssets = cacheImages([
      require('./images/bg-landing.jpg'),
      require('./images/intro.png'),
      require('./images/like.png'),
      require('./images/like_empty.png'),
      require('./images/logo.png'),
      require('./images/wall.png'),

      require('./images/categories/women/women_accessories.png'),
      require('./images/categories/women/women_bags.png'),
      require('./images/categories/women/women_clothes.png'),
      require('./images/categories/women/women_jewelry.png'),
      require('./images/categories/women/women_makeup.png'),
      require('./images/categories/women/women_parfums.png'),
      //require('./images/categories/women/women_shoes.png'),

      require('./images/categories/men/men_accessories.png'),
      require('./images/categories/men/men_bags.png'),
      require('./images/categories/men/men_clothes.png'),
      require('./images/categories/men/men_jewelry.png'),
      require('./images/categories/men/men_parfums.png'),
      require('./images/categories/men/men_shoes.png'),

      require('./images/categories/children/children_accessories.png'),
      require('./images/categories/children/children_bags.png'),
      require('./images/categories/children/children_clothes.png'),
      require('./images/categories/children/children_jewelry.png'),
      require('./images/categories/children/children_parfums.png'),
      require('./images/categories/children/children_shoes.png'),
    ])

    const fontAssets = cacheFonts([
      { 'montserrat-light': require('../assets/fonts/Montserrat-Light.ttf') },
      { 'montserrat': require('../assets/fonts/Montserrat-Regular.ttf') },
      { 'montserrat-bold': require('../assets/fonts/Montserrat-Bold.ttf') }
    ]);

    await Promise.all([...imageAssets, ...fontAssets]);
  }

  render() {
    if (!this.state.loaded) {
      return (
        <AppLoading
          startAsync={this.loadPictures}
          onFinish={() => this.setState({loaded: true})}
          onError={() => alert('Veuillez vous connecter à internet')}
          />
      )
    }

    return (
      <View style={{flex: 1}}>
        { /** Routes **/ }
        <Router>
          <Modal>
            <Stack key="root" hideNavBar>
              <Scene key="tabs" component={TabsScreen} />

              <Scene key="more" component={MoreProsScreen} />

              <Scene key="profile" component={ProfileScreen} />
              <Scene key="pro" component={ProScreen} />

              <Scene key="userInfo" component={UserInfoScreen} />
              <Scene key="wishes" component={WishesScreen} />
              <Scene key="creditCards" component={CreditCardsScreen} />
              <Scene key="addCard" component={AddCardScreen} />
            </Stack>
            <Stack key="landing">
              <Scene key="landing" panHandlers={null} component={LandingScreen} hideNavBar modal />
              <Scene key="login" component={LoginScreen} hideNavBar />
            </Stack>
          </Modal>
        </Router>

        { /** Flash Messages **/ }
        <FlashMessage
          position="top"
          floating={true}
          hideStatusBar
          />
        { /** Global Loader **/ }
        <LoaderWrapper />

        { /** Global Loader **/ }
        <ModalContainer />
      </View>
    )  
  }
}