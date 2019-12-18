import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';

import { HeaderBar } from '../Reusable'

import ProductItem from './ProductItem'

import { Actions } from 'react-native-router-flux'
import { Fire } from '../../services'

import { mainStyle } from '../../styles'

type Props = {
  products: any;
  loading: boolean;
  header?: any;

  onRefresh: () => void;
}
type State = {

}

class ProductsList extends React.Component<Props, State>  {
  
  viewProduct(product: any) {
    Actions.product({ product })
  }

  render() {
    const { products, loading, header, onRefresh } = this.props
    return (
      <FlatList
        contentContainerStyle={{paddingBottom: 20,}}
        data={products || []}
        numColumns={2}
        ListHeaderComponent={header}
        ListEmptyComponent={() => this.renderEmpty()}
        renderItem={({ item, index }) => (
          <ProductItem
            product={item}
            index={index}
            onPress={() => this.viewProduct(item)}
            />
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
        />
    );
  }

  renderEmpty() {
    const { loading } = this.props
    return (
      <View style={styles.empty}>
        <Text>{ loading ? 'Chargement en cours... ' : 'Aucun produit'}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: any) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(ProductsList)
