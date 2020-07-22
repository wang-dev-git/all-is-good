import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, StatusBar, ScrollView, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Notifications } from 'expo'

import SearchScreen from '../Search/SearchScreen'
import OrdersScreen from '../Orders/OrdersScreen'
import ProfileScreen from '../Profile/ProfileScreen'
import WishesScreen from '../Wishes/WishesScreen'
import MapScreen from '../Map/MapScreen'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'
import { Fire, Stripe, Modal, Maps, Flash } from '../../services'

import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';

import Icon from '@expo/vector-icons/FontAwesome'
import AntIcon from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo'
import Material from '@expo/vector-icons/MaterialCommunityIcons'

import OrderStatus from '../../types/order_status'
import { switchTab, switchOrderTab } from '../../actions/tab.action'
import { updateLang } from '../../actions/lang.action'
import { fetchOrders } from '../../actions/orders.action'
import { autologin, finishLogin, updatePosition } from '../../actions/auth.action'
import { refreshWishes } from '../../actions/wishes.action'
import { loadCategories, loadSearchable, loadMap } from '../../actions/filters.action'
import Cache from '../../services/Cache.service'

import { NotifBubble, ListEmpty, AssetImage } from '../Reusable'
import { mainStyle } from '../../styles'

const tabColor = '#fff'
const tabActiveColor = mainStyle.themeColor
const routes = [
  {
    component: SearchScreen,
    renderIcon: (active: boolean) => !active ? (
      <View style={{ ...mainStyle.circle(52), backgroundColor: 'transparent', ...mainStyle.row, justifyContent: 'center' }}>
        <Icon name="home" size={22} color={tabColor} />
      </View>
    ) : (
      <View style={{ ...mainStyle.circle(52), backgroundColor: tabColor, ...mainStyle.row, justifyContent: 'center' }}>
        <Icon name="home" size={22} color={tabActiveColor} />
      </View>
    )
  },
  {
    component: OrdersScreen,
    renderIcon: (active: boolean) => !active ? (
      <View style={{ ...mainStyle.circle(52), backgroundColor: 'transparent', ...mainStyle.row, justifyContent: 'center' }}>
        <Entypo name="shopping-bag" size={22} color={tabColor} />
      </View>
    ) : (
      <View style={{ ...mainStyle.circle(52), backgroundColor: tabColor, ...mainStyle.row, justifyContent: 'center' }}>
        <Entypo name="shopping-bag" size={22} color={tabActiveColor} />
      </View>
    )
  },
  {
    component: MapScreen,
    renderIcon: (active: boolean) => !active ? (
      <View style={{ ...mainStyle.circle(52), backgroundColor: 'transparent', ...mainStyle.row, justifyContent: 'center' }}>
        <Material name="map-search" size={22} color={tabColor} />
      </View>
    ) : (
      <View style={{ ...mainStyle.circle(52), backgroundColor: tabColor, ...mainStyle.row, justifyContent: 'center' }}>
        <Material name="map-search" size={22} color={tabActiveColor} />
      </View>
    )
  },
  {
    component: WishesScreen,
    renderIcon: (active: boolean) => !active ? (
      <View style={{ ...mainStyle.circle(52), backgroundColor: 'transparent', ...mainStyle.row, justifyContent: 'center' }}>
        <Icon name="heart" size={22} color={tabColor} />
      </View>
    ) : (
      <View style={{ ...mainStyle.circle(52), backgroundColor: tabColor, ...mainStyle.row, justifyContent: 'center' }}>
        <Icon name="heart-o" size={22} color={tabActiveColor} />
      </View>
    )
  },
  {
    component: ProfileScreen,
    renderIcon: (active: boolean) => !active ? (
      <View style={{ ...mainStyle.circle(52), backgroundColor: 'transparent', ...mainStyle.row, justifyContent: 'center' }}>
        <Icon name="user" size={22} color={tabColor} />
      </View>
    ) : (
      <View style={{ ...mainStyle.circle(52), backgroundColor: tabColor, ...mainStyle.row, justifyContent: 'center' }}>
        <Icon name="user-o" size={22} color={tabActiveColor} />
      </View>
    )
  },
]

interface Props {
  user: any;
  tab: number;
  wishes: any;
  lang: any;
  langId: string;
  position: any;

  autologin: (user: any) => void;
  switchTab: (idx: number) => void;
  switchOrderTab: (idx: number) => void;
  finishLogin: () => void;
  fetchOrders: () => void;
  loadMap: () => void;
  loadSearchable: () => void;
  loadCategories: () => void;
  updateLang: (id: string) => void;
  updatePosition: (pos: any) => void;
  refreshWishes: () => void;
}
interface State {
  booted: boolean;
  error: boolean;
  loading: boolean;
}
class TabsScreen extends React.Component<Props, State>  {
 
  state = {
    booted: false,
    error: false,
    loading: false,
  }

  notifListener: any = null
  async componentDidMount() {

    this.props.updateLang(this.props.langId)

    Fire.auth().onAuthStateChanged(async (user: any) => {
      if (user) {
        if (this.state.booted)
          Actions.popTo('tabs')
        this.props.autologin(user)

        await this.connect()
        await this.saveLanguage()
        
        /*setTimeout(() => {
          this.savePushToken(user.uid)
        }, 1000)*/
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

  connect = async () => {
    //this.props.updatePosition(null)
    this.setState({ loading: true })
    try {
      await this.props.finishLogin()
      await this.props.refreshWishes()
      await this.props.loadCategories()
      await this.props.loadSearchable()

      this.setState({ error: false, loading: false })
    } catch (err) {
      this.setState({ error: true, loading: false })
    }

    
    //setTimeout(() => Actions.userBank({optionals: false}), 200)
  }

  saveLanguage = async () => {
    const { user, langId } = this.props
    if (user && user.lang !== langId)
      await Fire.store().collection('users').doc(user.id).update({ lang: langId })
  }

  receivedNotif = async (notification) => {
    const data = notification.data
    if (data.proId) {
      const ref = Fire.store().collection('pros').doc(data.proId)
      const pro = await Fire.get(ref)
      if (pro)
        Actions.pro({ pro: pro })
    } else if (data.orderId) {
      const ref = Fire.store().collection('orders').doc(data.orderId)
      const order = await Fire.get(ref)
      if (order) {
        Actions.popTo('tabs')
        this.props.switchTab(1)
        this.props.fetchOrders()
        if (order.status === OrderStatus.ORDER_DELIVERED ||
          order.status === OrderStatus.ORDER_CANCELED_BY_USER ||
          order.status === OrderStatus.ORDER_CANCELED_BY_PRO ||
          order.status === OrderStatus.ORDER_USER_UNAVAILABLE) {
          // Go to PAST
          this.props.switchOrderTab(0)
        } else {
          // Go to CURRENT
          this.props.switchOrderTab(1)
        }

      }
    }
  };

  selectTab(index: number) {
    if (index === 2) {
      this.props.loadMap()
    }
    this.props.switchTab(index)
  }

  isSelected(index: number) {
    return this.props.tab == index
  }
  
  renderRoute(item: any, index: number) {
    const Route = item.component
    const isCurrent = this.props.tab == index
    return (
      <View key={index} style={{flex: 1, ...mainStyle.abs, opacity: isCurrent ? 1 : 0}} pointerEvents={isCurrent ? 'auto': 'none'}>
        <Route />
      </View>
    )
  }

  render() {
    const { user, lang } = this.props
    const { error, booted, loading } = this.state
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        {/* Content */}
        { (user && booted) ? (
          <View style={styles.content}>
            {routes.map((item, index) => this.renderRoute(item, index))}
          </View>
        ) : loading ? (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <AssetImage style={{width: 40, height: 40}} src={require('../../images/loader.gif')} />
          </View>
        ) : error === true ? (
          <ScrollView scrollEnabled={false} contentContainerStyle={{ paddingTop: 80 }}>
            <ListEmpty
              text={lang.NO_INTERNET_TITLE}
              subtext={lang.NO_INTERNET_MSG}
              wrapperStyle={{marginTop: 40}}
              imageSize={120}
              image={require('../../images/noconnection.png')}
              btnTxt={lang.NO_INTERNET_BTN}
              onPressBtn={connect}
              />
          </ScrollView>
        ) : (null)}

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
    //if (index == 3)
      //count = wishes ? wishes.length : 0
    return (
      <TouchableWithoutFeedback key={index} onPress={() => this.selectTab(index)}>
        <View style={[styles.tab, isSelected ? {} : {}]}>
          {item.renderIcon(isSelected)}
          <NotifBubble count={count} backgroundColor={index == 4 ? undefined : mainStyle.themeColor} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const barHeightX = 80
const barHeight = 68
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainStyle.themeColor,
  },
  content: {
    flex: 1,
    ...ifIphoneX({
      marginBottom: barHeightX,
    }, {
      marginBottom: barHeight,
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
    backgroundColor: mainStyle.themeColor,
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
  position: state.authReducer.position,
  tab: state.tabReducer.tab,
  lang: state.langReducer.lang,
  langId: state.langReducer.id,
  wishes: state.wishesReducer.list,
  toggleWishes: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  switchOrderTab: (tab: number) => dispatch(switchOrderTab(tab)),
  autologin: (user: any) => dispatch(autologin(user)),
  finishLogin: () => dispatch(finishLogin()),
  loadMap: () => dispatch(loadMap()),
  loadCategories: () => dispatch(loadCategories()),
  loadSearchable: () => dispatch(loadSearchable()),
  fetchOrders: () => dispatch(fetchOrders()),
  refreshWishes: () => dispatch(refreshWishes()),
  updateLang: (id: string) => dispatch(updateLang(id)),
  updatePosition: (pos: any) => dispatch(updatePosition(pos)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TabsScreen)
