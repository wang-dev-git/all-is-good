import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { HeaderBar } from '../Reusable'

import OrderItem from './OrderItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash } from '../../services'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
}
interface State {
  orders: any;
  loading: boolean;
  tab: number;
}

class OrdersScreen extends React.Component<Props, State>  {
  
  state = {
    orders: null,
    loading: false,
    tab: 0,
  }

  componentDidMount() {
    //this.fetchOrders() 
  }

  async fetchOrders() {
    const { user } = this.props

    this.setState({ loading: true })

    try {
      const snap = await Fire.store().collection('users').doc(user.id).collection('orders')
        .where('userId', '==', user.id)
        .orderBy('createdAt', 'desc')
        .get()
      const orders: any[] = []
      snap.forEach((doc: any) => {
        if (doc.exists) {
          orders.push({
            id: doc.id,
            ...doc.data(),
          })
        }
      })
      this.setState({ loading: false, orders })
    } catch (err) {
      this.setState({ loading: false })
      Flash.error('Impossible de récupérer les commandes')
    }
  }

  renderItem(order: any) {
    return (
      <OrderItem
        product={order.product}
        order={order}
        />
    )
  }

  render() {
    const { orders, loading, tab } = this.state

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
          data={orders || []}
          renderItem={({ item }) => this.renderItem(item)}
          /*ListHeaderComponent={() => (
            <TouchableOpacity onPress={() => this.clear()}>
              <Text>Clear</Text>
            </TouchableOpacity>
          )}*/
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyTxt}>AUCUNE COMMANDE</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => this.fetchOrders()}
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
})
const mapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen)
