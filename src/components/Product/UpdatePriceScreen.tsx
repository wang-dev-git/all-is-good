import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, VeilView, TitledInput, PageLoader } from '../Reusable'
import { Fire, Flash, AppConfig } from '../../services'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { switchTab } from '../../actions/tab.action'

import { mainStyle } from '../../styles'
import { getStateName } from '../../filters'

interface Props {
  user: any;
  product: any;

  onUpdate: (price: number) => void;
}
interface State {
  price: string;
  loading: boolean;
}
class UpdatePriceScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)
    
    this.state = {
      loading: false,
      price: Number((props.product.price || 0) * (1 - AppConfig.applicationFee)).toString()
    }
  }

  onChange(price: string) {
    const parsed = Number(price)
    if (Number.isNaN(parsed))
      return
    this.setState({
      price: price
    })
  }

  getCurrentPrice() {
    const { price } = this.state
    const escaped = price.replace(',', '.')
    return Number(escaped)
  }

  async update() {
    const { product } = this.props
    const productRef = Fire.store().collection('products').doc(product.id)
    
    const recentRefresh = await Fire.get(productRef)
    if (!recentRefresh.available) {
      Flash.error("Désolé, le produit est en cours de vente et ne peut pas être modifié")
      return
    }

    const price = this.getCurrentPrice() / (1 - AppConfig.applicationFee)
    if (price < 2) {
      Flash.error("Prix minimum 2€")
      return;
    }

    this.setState({ loading: true })
    try {
      await productRef.update({ price: price })
      this.props.onUpdate(price)
      await Fire.cloud('changedPrice', { productId: product.id })
      Actions.pop()
      Flash.show('Prix modifié !')
    } catch (err) {
      console.log(err)
      Flash.error('Une erreur est survenue')
    }
    this.setState({ loading: false })
  }

  render() {
    const { user } = this.props
    const { price, loading } = this.state

    const shownPrice = Number(this.getCurrentPrice() / (1 - AppConfig.applicationFee)).toFixed(2)
    return (
      <View style={styles.container}>
        <HeaderBar
          title="Modification"
          back
          />
        <View style={styles.inputs}>
          <TitledInput
            title="Prix du produit"
            value={price}
            onChange={({ nativeEvent }) => this.onChange(nativeEvent.text)}
            keyboardType='numeric'
            />
          <Text style={styles.shownPrice}>Prix affiché: {shownPrice}€</Text>
        </View>
        
        <View>
          <BottomButton
            title="Modifier le prix"
            backgroundColor={mainStyle.themeColor}
            onPress={() => this.update()}
            />
        </View>

        <PageLoader
          title='Modification...'
          loading={loading}
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
  inputs: {
    marginTop: 16,
    marginBottom: 20,
  },
  shownPrice: {
    ...mainStyle.montLight,
    textAlign: 'center',
    color: '#333',
    fontSize: 18,
    marginTop: 12,
    paddingHorizontal: 20,
  }
});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(UpdatePriceScreen)
