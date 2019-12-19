import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Notifications } from 'expo'

import ProductsScreen from '../Products/ProductsScreen'
import SearchScreen from '../Search/SearchScreen'
import WishesScreen from '../Wishes/WishesScreen'
import ProfileScreen from '../Profile/ProfileScreen'
import MapScreen from '../Map/MapScreen'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'
import { Fire, Stripe, Modal } from '../../services'

import Icon from '@expo/vector-icons/FontAwesome'
import AntIcon from '@expo/vector-icons/AntDesign'
import Material from '@expo/vector-icons/MaterialCommunityIcons'

import { switchTab } from '../../actions/tab.action'
import { autologin, finishLogin } from '../../actions/auth.action'
import { loadWishes, refreshWishes } from '../../actions/wishes.action'
import { loadCards } from '../../actions/cards.action'
import Cache from '../../services/Cache.service'

import { NotifBubble } from '../Reusable'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  tab: number;
  wishes: any;

  autologin: (user: any) => void;
  switchTab: (idx: number) => void;
  finishLogin: () => void;
  loadCards: () => void;
  loadWishes: () => void;
  refreshWishes: () => void;
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
      <Icon name="search" size={22} color={active ? tabActiveColor : tabColor}  />  
    )
  },
  {
    title: 'Map',
    component: MapScreen,
    renderIcon: (active: boolean) => active ? (
      <View style={{ ...mainStyle.circle(52), backgroundColor: 'transparent', ...mainStyle.row, justifyContent: 'center' }}>
        <Material name="map-search" size={22} color={mainStyle.themeColor} />
      </View>
    ) : (
      <View style={{ ...mainStyle.circle(52), backgroundColor: mainStyle.themeColor, ...mainStyle.row, justifyContent: 'center' }}>
        <Material name="map-search" size={22} color={'#fff'} />
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
    title: 'Menu',
    component: ProfileScreen,
    renderIcon: (active: boolean) => (
      <Icon name={active ? "user" : "user-o"} size={active ? 25 : 22} color={active ? tabActiveColor : tabColor} />
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
        await this.props.loadCards()
        await this.props.refreshWishes()
       
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
      await this.props.refreshWishes()
    } else {

      // Refresh user
      await this.props.finishLogin()
    }

  };

  selectTab(index: number) {
    this.props.switchTab(index)
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
    const { wishes } = this.props

    const isSelected = this.isSelected(index)
    let count = 0
    if (index == 3)
      count = wishes ? wishes.length : 0
    return (
      <TouchableOpacity key={index} disabled={!this.props.user} onPress={() => this.selectTab(index)}>
        <View style={[styles.tab, isSelected ? {} : {}]}>
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
  wishes: state.wishesReducer.list,
  toggleWishes: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  autologin: (user: any) => dispatch(autologin(user)),
  finishLogin: () => dispatch(finishLogin()),
  loadWishes: () => dispatch(loadWishes()),
  loadCards: () => dispatch(loadCards()),
  refreshWishes: () => dispatch(refreshWishes()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TabsScreen)
