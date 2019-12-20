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
  pastOrders: any[];
  pendingOrders: any[];
  loading: boolean;
  tab: number;
}

class OrdersScreen extends React.Component<Props, State>  {
  
  state = {
    pastOrders: [],
    pendingOrders: [],
    loading: false,
    tab: 1,
  }

  componentDidMount() {
    this.fetchOrders() 
  }

  async fetchOrders() {
    const { user } = this.props

    this.setState({ loading: true })

    try {
      const pendingOrdersRef = Fire.store().collection('orders')
        .where('userId', '==', user.id)
        .where('validated', '==', false)
        .orderBy('createdAt', 'desc')
      const pendingOrders = await Fire.list(pendingOrdersRef)
      const pastOrdersRef = Fire.store().collection('orders')
        .where('userId', '==', user.id)
        .where('validated', '==', true)
        .orderBy('createdAt', 'desc')
      const pastOrders = await Fire.list(pastOrdersRef)
      this.setState({ loading: false, pastOrders, pendingOrders })
    } catch (err) {
      this.setState({ loading: false })
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
    const { pastOrders, pendingOrders, loading, tab } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title='Mes Commandes'
          back
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
          data={tab === 0 ? pastOrders : pendingOrders}
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
