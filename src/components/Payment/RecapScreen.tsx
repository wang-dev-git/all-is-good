import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, BottomButton } from '../Reusable'
import { Fire, Flash } from '../../services'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { clearCart } from '../../actions/cart.action'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  items: any[];

  clearCart: () => void;
}
interface State {}

class RecapScreen extends React.Component<Props, State>  {
  
  componentDidMount() {
    const { items, clearCart } = this.props
    const allFailed = items.filter((item) => item.paid).length == 0
    if (!allFailed)
      clearCart()
  }

  getError(code: string) {
    switch (code) {
      case "PRODUCT_UNAVAILABLE":
        return "Article déjà vendu"
        break;
      
      default:
        return "Erreur de paiement"
        break;
    }
  }

  getTotal() {
    const { items } = this.props
    let total = 0
    for (const item of items) {
      if (item.paid)
        total += item.product.price + (item.product.fee || 0)
    }
    return Number(total).toFixed(2)
  }

  render() {
    const { items } = this.props

    const allFailed = items.filter((item) => item.paid).length == 0
    return (
      <View style={styles.container}>
        <HeaderBar
          title={'Confirmation'}
          close
          backAction={() => Actions.reset('root')}
          />

        <ScrollView>
          { !allFailed ? (
            <View style={styles.introWrapper}>
              <View style={[styles.icon, {borderColor: green}]}>
                <AntDesign name="check" color={green} size={44} />
              </View>
              <Text style={styles.intro}>{'Commande effectuée'.toUpperCase()}</Text>
            </View>
          ) : (
            <View style={styles.introWrapper}>
              <View style={[styles.icon, {borderColor: red}]}>
                <AntDesign name="close" color={red} size={44} />
              </View>
              <Text style={styles.intro}>{'Echec de la commande'.toUpperCase()}</Text>
            </View>
          )}
          { items.map((item: any, index: number) => (
            <View key={index} style={styles.recap}>
              <View>
                <Text style={styles.name}>{item.product.name}</Text>
                {!item.paid &&
                  <Text style={styles.error}>{this.getError(item.code)}</Text>
                }
              </View>
              <View>
                <View style={styles.right}>
                  <Text style={[styles.price, {color: !item.paid ? red : green}]}>
                    {Number(item.product.price + (item.product.fee || 0)).toFixed(2)}€
                  </Text>
                  {item.paid === true ? (
                    <AntDesign name="check" color={green} size={22} />
                  ) : (
                    <AntDesign name="close" color={red} size={22} />
                  )}
                </View>
              </View>
            </View>
          ))}
          <View style={styles.total}>
            <Text style={styles.totalTitle}>Total payé</Text>
            <Text style={styles.totalPrice}>{this.getTotal()}€</Text>
          </View>
          <BottomButton
            style={{marginTop: 40}}
            title='Fermer'
            onPress={() => Actions.reset('root')}
            backgroundColor={mainStyle.themeColor}
            />
        </ScrollView>
      </View>
    );
  }
}

const green = mainStyle.greenColor
const red = mainStyle.redColor
const iconSize = 80

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  introWrapper: {
    marginVertical: 32,
    alignItems: 'center',
  },
  icon: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  intro: {
    fontSize: 22,
    marginTop: 16,
    textAlign: 'center',
  },
  name: {
    ...mainStyle.montLight,
    fontSize: 15,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    marginRight: 10,
    fontSize: 16,
  },
  error: {
    marginTop: 6,
    color: red
  },
  total: {
    flexDirection: 'column',
    alignItems: 'flex-end',

    paddingTop: 20,
    paddingRight: 20,
  },
  totalTitle: {
    fontSize: 14,
    marginBottom: 6,
  },
  totalPrice: {
    fontSize: 22,
  }
});


const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: any) => ({
  clearCart: () => dispatch(clearCart()),
})
export default connect(mapStateToProps, mapDispatchToProps)(RecapScreen)
