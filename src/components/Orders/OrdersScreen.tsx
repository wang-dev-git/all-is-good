import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { HeaderBar } from '../Reusable'

import OrderItem from './OrderItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash } from '../../services'

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

  const renderItem = (order: any) => {
    return (
      <OrderItem
        order={order}
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
          <Text style={styles.tabTxt}>Passé</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 1 ? styles.selected : {}]}
          onPress={() => setTab(1)}
          >
          <Text style={styles.tabTxt}>En cours</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={current}
        renderItem={({item, index}) => renderItem(item)}
        /*ListHeaderComponent={() => (
          <TouchableOpacity onPress={() => this.clear()}>
            <Text>Clear</Text>
          </TouchableOpacity>
        )}*/
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyTxt}>{loading ? 'Chargement...' : 'AUCUNE COMMANDE'}</Text>
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
