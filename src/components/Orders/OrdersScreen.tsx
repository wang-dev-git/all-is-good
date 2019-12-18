import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity, RefreshControl } from 'react-native';

import { HeaderBar } from '../Reusable'

import OrderItem from './OrderItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash } from '../../services'

import { mainStyle } from '../../styles'

type Props = {
  user: any;
}
type State = {
  orders: any;
  loading: boolean;
}

class OrdersScreen extends React.Component<Props, State>  {
  
  state = {
    orders: null,
    loading: false,
  }

  componentDidMount() {
    this.fetchOrders() 
  }

  async fetchOrders() {
    const { user } = this.props

    this.setState({ loading: true })

    try {
      const ref = Fire.store().collection('payments')
        .where('userId', '==', user.id)
        .orderBy('createdAt', 'desc')
      const orders = await Fire.list(ref)
      this.setState({ loading: false, orders })
    } catch (err) {
      this.setState({ loading: false })
      Flash.error('Une erreur est survenue')
      console.warn(err)
    }
  }

  renderItem(order: any) {
    return (
      <OrderItem
        order={order}
        product={order.product}

        onPress={() => Actions.tracking({ order: order })}
        />
    )
  }

  render() {
    const { orders, loading } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title='Vos Commandes'
          back
          />
        <FlatList
          ListHeaderComponent={() => (
            <Text style={styles.intro}>Cliquez sur l'état d'une commande pour voir le suivi de votre colis</Text>
          )}
          data={orders || []}
          renderItem={(item) => this.renderItem(item.item)}
          /*ListHeaderComponent={() => (
            <TouchableOpacity onPress={() => this.clear()}>
              <Text>Clear</Text>
            </TouchableOpacity>
          )}*/
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyTxt}>Vous n'avez pas de commande{'\n'}en cours</Text>
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
    textAlign: 'center',
    lineHeight: 28,
  },
  intro: {
    ...mainStyle.montLight,
    paddingVertical: 20,
    paddingHorizontal: 28,
    lineHeight: 26,
    fontSize: 14,
    textAlign: 'center',
  }
});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen)
