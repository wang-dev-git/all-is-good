import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Alert, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { HeaderBar, MyText } from '../Reusable'

import OrderItem from './OrderItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash, Loader } from '../../services'

import { fetchOrders } from '../../actions/orders.action'

import { mainStyle } from '../../styles'

import OrderStatus from '../../types/order_status'

interface Props {
  user: any;
}
const OrdersScreen: React.FC<Props> = (props) => {
  
  const [tab, setTab] = React.useState(1)
  const orders = useSelector(state => state.ordersReducer.list)
  const loading = useSelector(state => state.ordersReducer.loading)
  const dispatch = useDispatch()
  const [shown, setShown] = React.useState<any>(null)
  const listRef = React.useRef<FlatList<any[]>>()

  const refresh = async () => {
    try {
      await dispatch(fetchOrders())
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
    listRef.current.scrollToIndex({ index: 0 })
  }, [tab])

  const onCancel = (order: any) => {
    Alert.alert(
      'Annuler',
      'Souhaitez-vous vraiment annuler cette commande ? Vous ne serez pas remboursé',
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

  const cancel = async (order: any) => {
    Loader.show('Annulation...')
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
      Flash.show('Commande annulée')
    } catch (err) {

    }
    Loader.hide()
  }

  const renderItem = (order: any) => {
    return (
      <OrderItem
        order={order}
        expanded={shown && shown.id === order.id}
        canCancel={tab === 1}
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
          onPress={() => setTab(0)}
          >
          <MyText style={styles.tabTxt}>Passé</MyText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 1 ? styles.selected : {}]}
          onPress={() => setTab(1)}
          >
          <MyText style={styles.tabTxt}>En cours</MyText>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={listRef}
        data={current}
        renderItem={({item, index}) => renderItem(item)}
        contentContainerStyle={{ paddingBottom: 20, }}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <MyText style={styles.emptyTxt}>{loading ? 'Chargement...' : 'AUCUNE COMMANDE'}</MyText>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
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
    backgroundColor: '#fff',
  },
  empty: {
    flex: 1,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTxt: {
    ...mainStyle.montLight,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 28,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    height: 56,
    opacity: 0.6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 3,
    borderRadius: 1,
  },
  selected: {
    opacity: 1,
    borderBottomColor: mainStyle.themeColor,
  },
  tabTxt: {
    ...mainStyle.montLight,
    fontSize: 16,
  },
});

export default OrdersScreen
