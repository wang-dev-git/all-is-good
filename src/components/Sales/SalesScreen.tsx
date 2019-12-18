import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { HeaderBar } from '../Reusable'

import SaleItem from './SaleItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Cache } from '../../services'

type Props = {
  fireUser: any;
}
type State = {
  sales: any;
  loading: boolean;
}

class SalesScreen extends React.Component<Props, State>  {
  
  state = {
    sales: null,
    loading: false,
  }

  componentDidMount() {
    this.fetchSales() 
  }

  async fetchSales() {
    const { fireUser } = this.props

    this.setState({ loading: true })

    try {
      const sales = await Fire.list(Fire.store().collection('payments')
          .where('sellerId', '==', fireUser.uid)
          .orderBy('createdAt', 'desc'))
      for (const sale of sales) {
        sale.product.pictures = await Cache.save(sale.product.pictures)
      }
      this.setState({ loading: false, sales })
    } catch (err) {
      console.log(err)
      this.setState({ loading: false })
    }
  }

  render() {
    const { sales, loading } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title='Mes Ventes'
          back
          />
        <FlatList
          data={sales || []}
          renderItem={({ item }) =>
            <SaleItem
              order={item}

              onPress={() => Actions.tracking({ order: item })}
              />
          }
          /*ListHeaderComponent={() => (
            <TouchableOpacity onPress={() => this.clear()}>
              <Text>Clear</Text>
            </TouchableOpacity>
          )}*/
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyTxt}>Vous n'avez encore aucun{'\n'}article vendu</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => this.fetchSales()}
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
  }
});


const mapStateToProps = (state: any) => ({
  fireUser: state.authReducer.fireUser,
})
const mapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SalesScreen)
