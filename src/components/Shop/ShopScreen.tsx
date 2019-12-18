import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, ImageSlider, VeilView } from '../Reusable'
import { Fire, Flash } from '../../services'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import ProductsList from '../Products/ProductsList'

import { mainStyle } from '../../styles'
import { getStateName } from '../../filters'

interface Props {
  shop: any;
}
interface State {
  products: any;
  loading: any;
}

class ShopScreen extends React.Component<Props, State>  {
  
  state = {
    products: [],
    loading: false,
  }

  componentDidMount() {
    this.loadProducts()
  }

  async loadProducts() {
    const { shop } = this.props

    this.setState({ loading: true })
    try {
      const ref = Fire.store().collection('products')
        .where('available', '==', true)
        .where('seller.id', '==', shop.id)
      const products = await Fire.list(ref)
      this.setState({ loading: false, products: products })
    } catch (err) {
      Flash.error('Une erreur est survenue')
      this.setState({ loading: false })
    }
  }

  render() {
    const { shop } = this.props
    const { products, loading } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title={shop.shop}
          back
          />

        <ProductsList
          header={() => (
            <View style={styles.shopHeader}>
              <AssetImage style={styles.bgImg} src={shop.background ? {uri: shop.background} : require('../../images/bg-landing.jpg')} resizeMode='cover' />
              <View style={styles.logo}>
                <View style={styles.logoImg}>
                  <AssetImage src={shop.picture ? {uri: shop.picture} : require('../../images/bg-landing.jpg')} />
                </View>
              </View>
            </View>
          )}
          products={products || []}
          loading={loading}

          onRefresh={() => this.loadProducts()}
          />
      </View>
    );
  }
}

const logoSize = 90
const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  shopHeader: {
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImg: {
    ...mainStyle.abs,
    opacity: 0.8,
  },
  logo: {
    ...mainStyle.abs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    ...mainStyle.circle(logoSize),
  },
});


const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: any) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(ShopScreen)
