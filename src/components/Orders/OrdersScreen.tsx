import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { HeaderBar } from '../Reusable'

import OrderItem from './OrderItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash } from '../../services'

import { fetchOrders } from '../../actions/orders.action'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  loading: boolean;
  orders: any;

  fetchOrders: () => void;
}
interface State {
  tab: number;
}

class OrdersScreen extends React.Component<Props, State>  {
  
  state = {
    tab: 1,
  }

  componentDidMount() {
    this.refresh() 
  }

  async refresh() {
    const { user, fetchOrders } = this.props

    try {
      await fetchOrders()
    } catch (err) {
      console.log(err)
      Flash.error('Vérifiez votre connexion internet')
    }
  }

  renderItem(order: any) {
    return (
      <OrderItem
        order={order}
        />
    )
  }

  render() {
    const { tab } = this.state
    const { orders, loading } = this.props

    return (
      <View style={styles.container}>
        <HeaderBar
          title='Mes Commandes'
          />
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 0 ? styles.selected : {}]}
            onPress={() => this.setState({ tab: 0 })}
            >
            <Text style={styles.tabTxt}>Passé</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 1 ? styles.selected : {}]}
            onPress={() => this.setState({ tab: 1 })}
            >
            <Text style={styles.tabTxt}>En cours</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={tab === 0 ? orders.past : orders.pending}
          renderItem={({ item }) => this.renderItem(item)}
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
              onRefresh={() => this.refresh()}
            />
          }
          />

      </View>
    );
  }
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


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  orders: state.ordersReducer.orders,
  loading: state.ordersReducer.loading,
})
const mapDispatchToProps = (dispatch: any) => ({
  fetchOrders: () => dispatch(fetchOrders())
})

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen)
