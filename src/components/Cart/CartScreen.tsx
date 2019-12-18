import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Alert, Text, View, FlatList } from 'react-native';

import { HeaderBar, BottomButton, FadeInView } from '../Reusable'

import CartItem from './CartItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash } from '../../services'

import { switchTab } from '../../actions/tab.action'
import { removeFromCart } from '../../actions/cart.action'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  cart: any;
  
  removeFromCart: (product: any) => void;
  switchTab: (tab: number) => void;
}
interface State {}
class CartScreen extends React.Component<Props, State>  {
  
  componentDidMount() {
    /*
    Actions.recap({
      items: [{
        product: {name: 'Tshirt Rouge', price: 22},
        paid: true,
      }, {
        product: {name: 'Pantalon Rose', price: 33},
        paid: false,
      }]
    })
    */
  }

  viewProduct(product: any) {
    Actions.product({ product })
  }

  purchase() {
    const { user } = this.props
    if (!user.address || user.address === '' ||
      !user.postal_code || user.postal_code === '' ||
      !user.city || user.city === '')
      Actions.userInfo()
    else
      Actions.relays()
  }

  getTotal() {
    const { cart } = this.props
    let total = 0
    if (!cart || !cart.products)
      return total
    for (const item of cart.products)
      total += Number(item.price)
    return Number(Number(total).toFixed(2))
  }

  keepSearching() {
    this.props.switchTab(0)
  }

  removeProduct(product: any) {
    Alert.alert(
      'Supprimer',
      'Enlever le produit du panier ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {text: 'Supprimer', style: 'destructive', onPress: () => {
          const { removeFromCart } = this.props
          removeFromCart(product)
        }},
      ],
      {cancelable: false},
    );
  }

  render() {
    const { cart } = this.props
    
    const hasProducts = cart && cart.products && cart.products.length > 0
    const products = hasProducts ? cart.products : []
    const price = this.getTotal()
    return (
      <View style={styles.container}>
        <HeaderBar
          title='Votre Panier'
          main
          />

        <FadeInView style={styles.container}>
          <FlatList
            contentContainerStyle={{paddingBottom: 150}}
            data={products || []}
            ListHeaderComponent={() => (
              <View style={styles.totalWrapper}>
                <Text style={styles.total}>TOTAL TTC:</Text>
                <Text style={styles.price}>{price}€</Text>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Text>Vous n'avez sélectionné aucun produit !</Text>
              </View>
            )}
            renderItem={({ item }) =>
              <CartItem
                product={item}
                onPress={() => this.viewProduct(item)}
                onRemove={() => this.removeProduct(item)}
                />
            }
            keyExtractor={(item, index) => index.toString()}
            />
          <View style={styles.floating}>
            { hasProducts &&
              <BottomButton
                backgroundColor={mainStyle.themeColor}
                title={"Acheter (" + price + "€)"}
                
                onPress={() => this.purchase()}
                />
            }
            
            <BottomButton
              titleColor={mainStyle.themeColor}
              backgroundColor='#fff'
              title={"Continuer mes achats"}
              style={{
                borderColor: mainStyle.themeColor,
                borderWidth: 1,
              }}
              onPress={() => this.keepSearching()}
              />
          </View>
        </FadeInView>
      </View>
    );
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
  },
  floating: {
    paddingTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute', left: 0, right: 0, bottom: 0,
  },
  totalWrapper: {
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000000',
    opacity: 0.64,
  },
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  cart: state.cartReducer.cart,
  toggle: state.cartReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  removeFromCart: (product: any) => dispatch(removeFromCart(product)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen)
