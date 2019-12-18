import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { Notifications } from 'expo'

import ProductsScreen from '../Products/ProductsScreen'
import SearchScreen from '../Search/SearchScreen'
import SellScreen from '../Sell/SellScreen'
import WishesScreen from '../Wishes/WishesScreen'
import CartScreen from '../Cart/CartScreen'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'
import { Fire, Stripe } from '../../services'

import Icon from '@expo/vector-icons/FontAwesome'
import AntIcon from '@expo/vector-icons/AntDesign'

import { switchTab } from '../../actions/tab.action'
import { autologin, finishLogin } from '../../actions/auth.action'
import { loadCart, refreshCart } from '../../actions/cart.action'
import { loadWishes, refreshWishes } from '../../actions/wishes.action'
import { loadCards } from '../../actions/cards.action'
import Cache from '../../services/Cache.service'

import { NotifBubble } from '../Reusable'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  tab: number;
  cart: any;
  wishes: any;

  autologin: (user: any) => void;
  switchTab: (idx: number) => void;
  finishLogin: () => void;
  loadCart: () => void;
  loadCards: () => void;
  loadWishes: () => void;
  refreshWishes: () => void;
  refreshCart: () => void;
}
interface State {
  booted: boolean;
}

const tabColor = '#999'
const tabActiveColor = '#222'
const routes = [
  {
    title: 'Flux',
    component: ProductsScreen,
    renderIcon: (active: boolean) => (
      <Icon name="home" size={25} color={active ? tabActiveColor : tabColor} />
    )
  },
  {
    title: 'Search',
    component: SearchScreen,
    renderIcon: (active: boolean) => (
      <Icon name="search" size={22} color={active ? tabActiveColor : tabColor} />
    )
  },
  {
    title: 'Vendre',
    component: SellScreen,
    renderIcon: (active: boolean) => active ? (
      <View style={{ ...mainStyle.circle(52), backgroundColor: 'transparent', ...mainStyle.row, justifyContent: 'center' }}>
        <AntIcon name="plus" size={32} color={mainStyle.themeColor} />
      </View>
    ) : (
      <View style={{ ...mainStyle.circle(52), backgroundColor: mainStyle.themeColor, ...mainStyle.row, justifyContent: 'center' }}>
        <AntIcon name="plus" size={32} color={'#fff'} />
      </View>
    )
  },
  {
    title: 'Favoris',
    component: WishesScreen,
    renderIcon: (active: boolean) => active ? (
      <Icon name="heart" size={22} color={active ? tabActiveColor : tabColor} />
    ) : (
      <Icon name="heart-o" size={22} color={active ? tabActiveColor : tabColor} />
    )
  },
  {
    title: 'Panier',
    component: CartScreen,
    renderIcon: (active: boolean) => (
      <Icon name="shopping-cart" size={22} color={active ? tabActiveColor : tabColor} />
    )
  },
]

class TabsScreen extends React.Component<Props, State>  {
 
  state = {
    booted: false,
  }

  notifListener: any = null
  async componentDidMount() {
    Fire.auth().onAuthStateChanged(async (user: any) => {
      if (user) {
        if (this.state.booted)
          Actions.popTo('tabs')
        this.props.autologin(user)

        await this.props.finishLogin()
        await this.props.loadWishes()
        await this.props.loadCart()
        await this.props.loadCards()
        await this.props.refreshCart()
        await this.props.refreshWishes()
       
        //setTimeout(() => Actions.sell(), 200)
        //setTimeout(() => Actions.userBank({optionals: false}), 200)
      }
      else {
        this.props.autologin(null)
        Actions.landing()
      }

      if (!this.state.booted)
        this.setState({ booted: true })
    });

     this.notifListener = Notifications.addListener(this.receivedNotif);
  }

  receivedNotif = async (notification) => {
    const data = notification.data
    if (data.productId) {
      const ref = Fire.store().collection('products').doc(data.productId)
      const product = await Fire.get(ref)
      if (product) {
        Actions.product({ product: product })
        if (data.newComment) {
          Actions.comments({ product: product })
        }
      }
      await this.props.refreshCart()
      await this.props.refreshWishes()
    } else {

      // Refresh user
      await this.props.finishLogin()
    }

  };

  selectTab(index: number) {
    if (index == 2) {
      if (this.props.user.blocked) {
        alert("Votre compte a été bloqué, veuillez contacter IsClothing pour plus d'informations")
        return
      }

      Actions.sell()
    } else {
      this.props.switchTab(index)
    }
  }

  isSelected(index: number) {
    return this.props.tab == index
  }

  renderCurrentRoute() {
    const idx = this.props.tab
    if (idx >= routes.length)
      return null

    const CurrentRoute = routes[idx].component
    return (
      <CurrentRoute />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        {/* Content */}
        { (this.state.booted && this.props.user) &&
          <View style={styles.content}>
            {this.renderCurrentRoute()}
          </View>
        }

        {/* TabBar */}
        <View style={styles.tabs}>
          { routes.map((item, index) => this.renderTabBarItem(item, index))}
        </View>
      </View>
    );
  }
  
  renderTabBarItem(item: any, index: number) {
    const { wishes, cart } = this.props

    const isSelected = this.isSelected(index)
    let count = 0
    if (index == 4)
      count = cart && cart.products ? cart.products.length : 0
    else if (index == 3)
      count = wishes ? wishes.length : 0
    return (
      <TouchableOpacity key={index} disabled={!this.props.user} onPress={() => this.selectTab(index)}>
        <View style={[styles.tab, isSelected ? {backgroundColor: '#eee'} : {}]}>
          {item.renderIcon(isSelected)}
          <NotifBubble count={count} backgroundColor={index == 4 ? undefined : mainStyle.themeColor} />
        </View>
      </TouchableOpacity>
    )
  }
}

const barHeightX = 80
const barHeight = 68
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    ...ifIphoneX({
      paddingBottom: barHeightX,
    }, {
      paddingBottom: barHeight,
    })
  },

  tabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...ifIphoneX({
      height: barHeightX,
    }, {
      height: barHeight,
    }),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ede',

    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    width: Dimensions.get('window').width / 5,
    justifyContent: 'center',
    alignItems: 'center',
    ...ifIphoneX({
      paddingBottom: 15,
    }, {
      paddingBottom: 0,
    })
  },
  tabTxt: {
    textAlign: 'center',
  }
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  tab: state.tabReducer.tab,
  cart: state.cartReducer.cart,
  wishes: state.wishesReducer.list,
  toggleCart: state.cartReducer.toggle,
  toggleWishes: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  autologin: (user: any) => dispatch(autologin(user)),
  finishLogin: () => dispatch(finishLogin()),
  loadWishes: () => dispatch(loadWishes()),
  loadCart: () => dispatch(loadCart()),
  loadCards: () => dispatch(loadCards()),
  refreshCart: () => dispatch(refreshCart()),
  refreshWishes: () => dispatch(refreshWishes()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TabsScreen)
