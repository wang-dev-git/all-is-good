import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, TitledInput, BottomButton, PageLoader, VeilView, SelectCreditCard } from '../Reusable'
import { Fire, Flash, Chrono } from '../../services'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { fetchHomeProducts } from '../../actions/products.action'

import ProductsList from '../Products/ProductsList'

import { mainStyle } from '../../styles'
import { getStateName } from '../../filters'

interface Props {
  user: any;
  cart: any;
  cards: any;
  relay: any;

  fetchHomeProducts: () => void;
}
interface State {
  card: string;
  loading: boolean;
  pricesChanged: boolean;
}

class PaymentScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      card: '',
      pricesChanged: false,
    }
  }

  getTotal() {
    const { cart } = this.props
    let total = 0
    if (!cart || !cart.products)
      return total
    for (const item of cart.products) {
      total += Number(item.price) + Number(item.fee || 0)
    }
    return Number(Number(total).toFixed(2))
  }

  async confirm() {
    const { cart, relay, user, fetchHomeProducts } = this.props
    const { card } = this.state

    if (card === '') {
      alert('Veuillez sélectionner un moyen de paiement')
      return
    }
    this.setState({ loading: true })

    const products: string[] = []
    for (const item of cart.products)
      products.push(item.id)
    
    try {
      // Check prices first
      for (const product of cart.products) {
        const ref = Fire.store().collection('products').doc(product.id)
        const res = await Fire.get(ref)
        if (res.price !== product.price) {
          Flash.error("Le prix d'un produit a changé, vérifiez qu'il vous convient")
          this.setState({ pricesChanged: true, loading: false })
          return
        }
      }

      const payload = {
        cart: {
          products: products,
          relay: relay,
          card: card,
        },
      }
      const res = await Fire.cloud('payCart', payload)
      this.setState({ loading: false })
      fetchHomeProducts()
      Actions.recap({ items: res })
    } catch (err) {
      this.setState({ loading: false })
      Flash.error('Une erreur est survenue')
    }
  }

  render() {
    const { user, cart, cards, relay } = this.props
    const { card, pricesChanged } = this.state

    const total = Number(this.getTotal()).toFixed(2)

    return (
      <View style={styles.container}>
        <HeaderBar
          title={'Finalisez votre commande'}
          back
          />

        <ScrollView>
          <View style={styles.recap}>
            <Text style={styles.recapTitle}>Votre point relais</Text>
            <View style={styles.productRecap}>
              <View>
                <Text style={styles.relayName}>{relay.name}</Text>
                <Text style={styles.relayAddr}>{relay.address}</Text>
              </View>
            </View>
          </View>

          <SelectCreditCard
            cardSelected={(card: string) => this.setState({ card: card })}
            />

          <View style={styles.recap}>
            <Text style={styles.recapTitle}>Récap</Text>
            { cart && cart.products && cart.products.map((product: any, index: number) => (
              <View key={index} style={styles.productRecap}>
                <View style={styles.rowContent}>
                  <View style={mainStyle.row}>
                    <AssetImage style={{width: 60, height: 60, marginRight: 6, borderRadius: 3, overflow:'hidden', maxWidth: 60, maxHeight: 60}} src={product.pictures && product.pictures.length ? {uri: product.pictures[0]} : require('../../images/user.png')} resizeMode='cover' />
                    <Text style={styles.productName}>{product.name}</Text>
                  </View>
                  <Text style={styles.productPrice}>{Number(product.price).toFixed(2)}€</Text>
                </View>
                <View style={styles.rowContent}>
                  <Text></Text>
                  <Text style={styles.productFee}>Livraison +{Number(product.fee).toFixed(2)}€</Text>
                </View>
              </View>
            ))}
            <View style={[styles.cardRecap, {marginTop: 14}]}>
              <Text style={[styles.productName, {fontSize: 18}]}>Total</Text>
              <Text style={[styles.productPrice, {fontSize: 18, fontWeight: 'bold'}]}>{total}€</Text>
            </View>
          </View>

          { pricesChanged &&
            <Text style={styles.pricesChanged}>Vérifierz que les nouveaux prix{'\n'}vous conviennent</Text>
          }
          <BottomButton
            style={{marginTop: 40,}}
            title={"Je paye (" + total + "€)"}
            backgroundColor={mainStyle.themeColor}
            onPress={() => this.confirm()}
            />
        </ScrollView>

        <PageLoader
          loading={this.state.loading}
          title='Achat en cours...'
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recap: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  recapTitle: {
    ...mainStyle.montLight,
    fontSize: 20,
    marginBottom: 18,
  },
  picture: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  cardRecap: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingRight: 6,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productRecap: {
    paddingVertical: 18,
    paddingRight: 6,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricesChanged: {
    ...mainStyle.montLight,
    fontSize: 16,
    marginTop: 20,
    color: mainStyle.redColor,
    lineHeight: 22,
    textAlign: 'center',
  },
  productName: {
    fontSize: 16,
  },
  productFee: {
    marginTop: 2,
    color: mainStyle.redColor,
    fontSize: 13,
  },
  productPrice: {
    fontSize: 16,
  },
  total: {
    paddingHorizontal: 16,
    paddingVertical: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relayName: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  relayAddr: {
  }
});


const mapStateToProps = (state: any) => ({
  cards: state.cardsReducer.list,
  cardsToggle: state.cardsReducer.toggle,
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({
  fetchHomeProducts: () => dispatch(fetchHomeProducts()),
})
export default connect(mapStateToProps, mapDispatchToProps)(PaymentScreen)
