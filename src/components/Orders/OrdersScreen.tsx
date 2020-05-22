import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Alert, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { HeaderBar, MyText, ListEmpty } from '../Reusable'

import OrderItem from './OrderItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash, Loader, Modal, Time } from '../../services'

import { fetchOrders } from '../../actions/orders.action'
import { switchTab, switchOrderTab } from '../../actions/tab.action'

import { mainStyle } from '../../styles'

import OrderStatus from '../../types/order_status'
import RateModal from './RateModal'

interface Props {
  user: any;
}
const OrdersScreen: React.FC<Props> = (props) => {
  
  const tab = useSelector(state => state.tabReducer.orderTab)
  const tabRefresh = useSelector(state => state.tabReducer.orderTabRefresh)
  const lang = useSelector(state => state.langReducer.lang)
  const langId = useSelector(state => state.langReducer.id)
  const orders = useSelector(state => state.ordersReducer.list)
  const loading = useSelector(state => state.ordersReducer.loading)
  const dispatch = useDispatch()
  const [shown, setShown] = React.useState<any>(null)
  const listRef = React.useRef<FlatList<any[]>>()

  const refresh = async () => {
    try {
      await dispatch(fetchOrders())
      setShown(null)
    } catch (err) {
      console.log(err)
      Flash.error('Vérifiez votre connexion internet')
    }
  }

  React.useEffect(() => {
    refresh()
  }, [])

  React.useEffect(() => {
    setShown(null)
    if (current.length)
      listRef.current.scrollToIndex({ index: 0 })
  }, [tab, tabRefresh])

  const onCancel = (order: any) => {
    let msg = lang.ORDER_CANCEL_MSG_PICK_UP

    if (order.delivery) {
      const startSeconds = order.pro.pick_up_start_second || 0
      const now = Time.moment(new Date())
      const dateStart = Time.moment(new Date()).startOf('day').seconds(startSeconds)
      const diff = now.diff(dateStart, 'seconds')
      if (diff > 0) {
        msg = (lang.ORDER_CANCEL_MSG_DELIVERY_TOO_LATE || '').replace('%AMOUNT%', order.price)
      } else {
        const deliveryTime = Time.addAMIfNeeded(dateStart, langId)
        msg = (lang.ORDER_CANCEL_MSG_DELIVERY || '').replace('%TIME%', deliveryTime)
      }
    }

    Alert.alert(
      lang.ORDER_CANCEL,
      msg,
      [
        {
          text: 'Non',
          style: 'cancel',
        },
        {text: 'Oui, annuler', style: 'destructive', onPress: () => {
          cancel(order)
        }},
      ],
      {cancelable: false},
    );
  }

  const onRate = (order: any) => {
    Modal.show('rating', {
      content: () => <RateModal order={order} onRated={refresh} />
    })
  }

  const cancel = async (order: any) => {
    Loader.show(lang.ORDER_CANCELLING)
    try {
      const ref = Fire.store().collection('orders').doc(order.id)
      const history = order.history || []
      history.push({
        status: OrderStatus.ORDER_CANCELED_BY_USER,
        date: new Date()
      })
      await ref.update({
        cancelledAt: new Date(),
        status: OrderStatus.ORDER_CANCELED_BY_USER,
        history: history
      })
      await refresh()
      setShown(null)
      Flash.show(lang.ORDER_WAS_CANCELLED)
    } catch (err) {

    }
    Loader.hide()
  }

  const renderItem = (order: any) => {
    return (
      <OrderItem
        order={order}
        expanded={shown && shown.id === order.id}
        disabled={shown && shown.id !== order.id}
        past={tab === 0}
        onRate={() => onRate(order)}
        onCancel={() => onCancel(order)}
        onPress={() => setShown(shown && shown.id === order.id ? null : order)}
        />
    )
  }

  const current = orders.filter(item => {

    if (tab === 1 && (
      !item.status ||
      item.status === OrderStatus.ORDER_PENDING ||
      item.status === OrderStatus.ORDER_PREPARING ||
      item.status === OrderStatus.ORDER_READY_TO_TAKE ||
      item.status === OrderStatus.ORDER_DELIVERING
    ))
      return true
    if (tab === 0 && (
      item.status === OrderStatus.ORDER_CANCELED_BY_PRO ||
      item.status === OrderStatus.ORDER_CANCELED_BY_USER ||
      item.status === OrderStatus.ORDER_DELIVERED
    ))
      return true

    return false 
  })

  return (
    <View style={styles.container}>
      <HeaderBar
        title='Mes commandes'
        logo
        />
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 0 ? styles.selected : {}]}
          onPress={() => dispatch(switchOrderTab(0))}
          >
          <MyText style={styles.tabTxt}>{lang.ORDERS_PAST}</MyText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 1 ? styles.selected : {}]}
          onPress={() => dispatch(switchOrderTab(1))}
          >
          <MyText style={styles.tabTxt}>{lang.ORDERS_PROGRESS}</MyText>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={listRef}
        data={current}
        renderItem={({item, index}) => renderItem(item)}
        contentContainerStyle={{ paddingBottom: 20, }}
        ListEmptyComponent={() => (
          <ListEmpty
            text={loading ? lang.GLOBAL_LOADING : lang.ORDERS_NONE}
            image={require('../../images/noorder.png')}
            btnTxt={lang.ORDERS_NONE_BTN}
            onPressBtn={() => dispatch(switchTab(0))}
            />
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            tintColor='#fff'
            refreshing={loading}
            onRefresh={refresh}
          />
        }
        />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainStyle.themeColor,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: mainStyle.themeColor,
    borderBottomWidth: 3,
    borderRadius: 1,
  },
  selected: {
    borderBottomColor: '#fff',
  },
  tabTxt: {
    ...mainStyle.montBold,
    fontSize: 16,
    color: '#fff'
  },
});

export default OrdersScreen
