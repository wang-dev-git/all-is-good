import React, { Component } from 'react';

// Libs
import { Router, Stack, Scene, Modal } from 'react-native-router-flux'
import { View, Dimensions, Image } from 'react-native';

import FlashMessage from 'react-native-flash-message'

import LandingScreen from './components/Landing/LandingScreen'
import LoginScreen from './components/Login/LoginScreen'

import TabsScreen from './components/Tabs/TabsScreen'
import SellScreen from './components/Sell/SellScreen'
import ImagePickerScreen from './components/Sell/ImagePickerScreen'
import PickTypeScreen from './components/PickType/PickTypeScreen'

import PaymentScreen from './components/Payment/PaymentScreen'
import RecapScreen from './components/Payment/RecapScreen'
import ProfileScreen from './components/Profile/ProfileScreen'
import ShopScreen from './components/Shop/ShopScreen'
import BoostScreen from './components/Boost/BoostScreen'
import ProLoginScreen from './components/Login/ProLoginScreen'
import UserInfoScreen from './components/UserInfo/UserInfoScreen'
import UserBankScreen from './components/UserBank/UserBankScreen'
import UserBankMoreScreen from './components/UserBank/UserBankMoreScreen'
import OrdersScreen from './components/Orders/OrdersScreen'
import SalesScreen from './components/Sales/SalesScreen'
import MyProductsScreen from './components/MyProducts/MyProductsScreen'
import CreditCardsScreen from './components/CreditCards/CreditCardsScreen'
import RelaysScreen from './components/Relays/RelaysScreen'
import AddCardScreen from './components/AddCard/AddCardScreen'

import WalletScreen from './components/Wallet/WalletScreen'
import CertifScreen from './components/Certif/CertifScreen'
import TrackingScreen from './components/Tracking/TrackingScreen'
import ProductScreen from './components/Product/ProductScreen'
import UpdatePriceScreen from './components/Product/UpdatePriceScreen'
import MoreProductsScreen from './components/Products/MoreProductsScreen'
import CommentsScreen from './components/Comments/CommentsScreen'

import CategoryScreen from './components/Category/CategoryScreen'
import NotifsScreen from './components/Notifs/NotifsScreen'

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
              <Scene key="notifs" component={NotifsScreen} />
              <Scene key="category" component={CategoryScreen} />

              <Scene key="more" component={MoreProductsScreen} />
              <Scene key="payment" component={PaymentScreen} />
              <Scene key="recap" component={RecapScreen} />

              <Scene key="profile" component={ProfileScreen} />
              <Scene key="product" component={ProductScreen} />
              <Scene key="updatePrice" component={UpdatePriceScreen} />
              <Scene key="shop" component={ShopScreen} />

              <Scene key="comments" component={CommentsScreen} />

              <Scene key="wallet" component={WalletScreen} />
              <Scene key="userInfo" component={UserInfoScreen} />
              <Scene key="userBank" component={UserBankScreen} />
              <Scene key="userBankMore" component={UserBankMoreScreen} />
              <Scene key="orders" component={OrdersScreen} />
              <Scene key="tracking" component={TrackingScreen} />
              <Scene key="sales" component={SalesScreen} />
              <Scene key="myProducts" component={MyProductsScreen} />
              <Scene key="creditCards" component={CreditCardsScreen} />
              <Scene key="relays" component={RelaysScreen} />
              <Scene key="addCard" component={AddCardScreen} />
              <Scene key="certif" component={CertifScreen} />
            </Stack>
            <Stack key="landing">
              <Scene key="landing" panHandlers={null} component={LandingScreen} hideNavBar modal />
              <Scene key="login" component={LoginScreen} hideNavBar />
              <Scene key="proLogin" component={ProLoginScreen} hideNavBar />
            </Stack>
            <Stack key="sell" hideNavBar>
              <Scene key="selling" component={SellScreen} modal />
              <Scene key="category" component={CategoryScreen} />
              <Scene key="pickType" component={PickTypeScreen} />
              <Scene key="userBank" component={UserBankScreen} />
              <Scene key="userBankMore" component={UserBankMoreScreen} />
              <Scene key="addCard" component={AddCardScreen} />
              <Scene key="imagePicker" component={ImagePickerScreen} />
            </Stack>
            <Stack key="boost" hideNavBar>
              <Scene key="boost" component={BoostScreen} modal />
              <Scene key="addCard" component={AddCardScreen} />
            </Stack>
          </Modal>
        </Router>

        { /** Flash Messages **/ }
        <FlashMessage
          position="top"
          floating={true}
          hideStatusBar
          />
      </View>
    )  
  }
}