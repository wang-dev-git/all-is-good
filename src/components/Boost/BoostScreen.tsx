import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, TitledInput, BottomButton, PageLoader, VeilView, SelectCreditCard } from '../Reusable'
import { Fire, Flash } from '../../services'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { fetchHomeProducts } from '../../actions/products.action'

import ProductsList from '../Products/ProductsList'

import { mainStyle } from '../../styles'
import { getStateName } from '../../filters'


const PRODUCT_WEEK_PRICE = 3.95
const PRODUCT_MONTH_PRICE = 7.95

interface Props {
  user: any;
  cards: any;
  product?: any;

  clearCart: () => void;
  fetchHomeProducts: () => void;
}
interface State {
  card: string;
  loading: boolean;
  weekOnly: boolean;
}

class BoostScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      card: '',
      weekOnly: true,
    }
  }

  getTotal() {
    const { product } = this.props
    return this.state.weekOnly ? PRODUCT_WEEK_PRICE : PRODUCT_MONTH_PRICE
  }

  async confirm() {
    const { user, product, fetchHomeProducts } = this.props
    const { card } = this.state

    this.setState({ loading: true })

    try {
      await Fire.cloud('boostProduct', {
        productId: product.id,
        card: card,
        weekOnly: this.state.weekOnly
      })
      this.setState({ loading: false })
      Flash.show('Boost effectué !')
      fetchHomeProducts()
      Actions.pop()
    } catch (err) {
      this.setState({ loading: false })
      Flash.error('Une erreur est survenue')
    }
  }

  render() {
    const { user, product, cards } = this.props
    const { card, weekOnly } = this.state

    const total = Number(this.getTotal()).toFixed(2)

    return (
      <View style={styles.container}>
        <HeaderBar
          title={'Boostez votre produit !'}
          close
          />

        <ScrollView>
          <SelectCreditCard
            cardSelected={(card: string) => this.setState({ card: card })}
            />

          <View style={styles.recap}>
            <Text style={styles.recapTitle}>Choisissez votre formule</Text>
            <View style={styles.propos}>
              <TouchableOpacity style={[styles.propo, weekOnly ? styles.selected : {}]} onPress={() => this.setState({ weekOnly: true})}>
                <Text style={[styles.propoTxt, weekOnly ? styles.selected : {}]}>7</Text>
                <Text style={[styles.propoTxt, styles.subTitle, weekOnly ? styles.selected : {}]}>jours</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.propo, !weekOnly ? styles.selected : {}]} onPress={() => this.setState({ weekOnly: false})}>
                <Text style={[styles.propoTxt, !weekOnly ? styles.selected : {}]}>30</Text>
                <Text style={[styles.propoTxt, styles.subTitle, !weekOnly ? styles.selected : {}]}>jours</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productRecap}>
              <Text style={styles.productName}>Boost - {product.name}</Text>
              <Text style={styles.productPrice}>{total}€</Text>
            </View>
            <View style={[styles.cardRecap, {marginTop: 14}]}>
              <Text style={[styles.productName, {fontSize: 18}]}>Total</Text>
              <Text style={[styles.productPrice, {fontSize: 18, fontWeight: 'bold'}]}>{total}€</Text>
            </View>
          </View>

          <BottomButton
            style={{marginTop: 40,}}
            disabled={card == ''}
            title={"Booster (" + total + "€)"}
            backgroundColor={mainStyle.themeColor}
            onPress={() => this.confirm()}
            />
        </ScrollView>

        <PageLoader
          loading={this.state.loading}
          title='Boost en cours...'
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

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
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
  propos: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propo: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 40,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  propoTxt: {
    ...mainStyle.montBold,
    fontSize: 18,
  },
  subTitle: {
    marginTop: 10,
    fontSize: 14,
  },
  selected: {
    backgroundColor: mainStyle.themeColor,
    color: '#fff',
  }
});


const mapStateToProps = (state: any) => ({
  cards: state.cardsReducer.list,
  toggle: state.cardsReducer.toggle,
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({
  fetchHomeProducts: () => dispatch(fetchHomeProducts()),
})
export default connect(mapStateToProps, mapDispatchToProps)(BoostScreen)
