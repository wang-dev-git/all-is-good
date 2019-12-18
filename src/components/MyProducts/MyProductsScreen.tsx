import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { HeaderBar } from '../Reusable'

import MyProductItem from './MyProductItem'

import { Actions } from 'react-native-router-flux'
import { Fire } from '../../services'

type Props = {
  fireUser: any;
}
type State = {
  sales: any;
  loading: boolean;
}

class MyProductsScreen extends React.Component<Props, State>  {
  
  state = {
    sales: null,
    loading: false,
  }

  componentDidMount() {
    this.fetchMyProducts() 
  }

  async fetchMyProducts() {
    const { fireUser } = this.props

    this.setState({ loading: true })

    try {
      const sales = await Fire.list(Fire.store().collection('products')
          .where('seller.id', '==', fireUser.uid)
          .where('available', '==', true)
          .orderBy('createdAt', 'desc'))
      this.setState({ loading: false, sales })
    } catch (err) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { sales, loading } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title='Mes articles en ligne'
          back
          />
        <FlatList
          data={sales || []}
          renderItem={({ item }) =>
            <MyProductItem
              product={item}
              onPress={() => Actions.product({ product: item })}
              onPressExpert={() => Actions.certif({ product: item, onFinish: () => this.fetchMyProducts()})}
              />
          }
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyTxt}>Vous n'avez encore mis aucun{'\n'}article en vente</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => this.fetchMyProducts()}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyProductsScreen)
