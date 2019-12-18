import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar, Modal } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, LinkButton, ImageSlider, VeilView } from '../Reusable'
import { Fire, Flash } from '../../services'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { switchTab } from '../../actions/tab.action'
import { addWish, removeWish, isInWishes } from '../../actions/wishes.action'
import { addToCart, removeFromCart, isInCart } from '../../actions/cart.action'

import ImageViewer from 'react-native-image-zoom-viewer';

import { mainStyle } from '../../styles'
import { getStateName } from '../../filters'

interface Props {
  user: any;
  product: any;
  wishes: any;
  cart: any;

  switchTab: (tab: number) => void;
  addWish: (product: any) => void;
  removeWish: (product: any) => void;
  addToCart: (product: any) => void;
  removeFromCart: (product: any) => void;
  isInCart: (product: any) => boolean;
  isInWishes: (product: any) => boolean;
}
interface State {
  refresh: boolean;
  showZoom: boolean;
  zoomIndex: number;
}

class ProductScreen extends React.Component<Props, State>  {
  
  state = {
    refresh: false,
    showZoom: false,
    zoomIndex: 0
  }

  componentDidMount() {
    //Actions.updatePrice({ product: this.props.product, onUpdate: (price: number) => this.updatedPrice(price) })
  }

  toggleWish() {
    const { addWish, removeWish, product, isInWishes } = this.props
    const onPress = () => {
      this.props.switchTab(3)
      Actions.reset('root')
    }

    if (isInWishes(product)) {
      removeWish(product)
      Flash.show('Supprimé des favoris !')
    } else {
      addWish(product)
      Flash.show('Ajouté aux favoris !', 'Cliquez pour voir vos favoris', onPress)
    }
  }

  toggleCart() {
    const { addToCart, removeFromCart, product, isInCart } = this.props
    const onPress = () => {
      this.props.switchTab(4)
      Actions.reset('root')
    }

    if (isInCart(product)) {
      removeFromCart(product)
      Flash.show('Enlevé du panier !')
    } else {
      addToCart(product)
      Flash.show('Ajouté au panier !', 'Cliquez pour voir votre panier', onPress)
    }
  }

  showComments() {
    const { product } = this.props
    Actions.comments({ product })
  }

  async remove(product: any) {
    this.confirm('Êtes-vous sûr de vouloir supprimer cet article définitivement ?', 'Supprimer', async () => {
      const id = product.id
      try {
        const productRef = Fire.store().collection('products').doc(id)
        const product = await Fire.get(productRef)
        if (!product.available) {
          Flash.error("Désolé, le produit est en cours de vente et ne peut pas être supprimé")
          return
        }
        await productRef.delete()
        Actions.pop()
      } catch (err) {
        console.log(err)
        Flash.error('Une erreur est survenue')
      }
    })
  }

  async report(product: any) {
    this.confirm('Êtes-vous sûr de vouloir signaler cet article ?', 'Signaler', async () => {
      try {
        await Fire.cloud('reportProduct', { productId: product.id })
        alert('Merci pour votre signalement')
      } catch (err) {
        alert('Erreur, veuillez réessayer plus tard')
      }
    })
  }

  async block(product: any) {
    this.confirm('Êtes-vous sûr de vouloir bloquer ce vendeur ?', 'Bloquer', async () => {
      try {
        await Fire.cloud('blockSeller', { sellerId: product.seller.id })
        alert('Vendeur bloqué. Tous ses articles ont été désactivés')
      } catch (err) {
        alert('Erreur, veuillez réessayer plus tard')
      }
    })
  }

  confirm(title: string, btn: string, callback: () => void) {
    Alert.alert(
      'Confirmez',
      title,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {text: btn, style: 'destructive', onPress: callback},
      ],
      {cancelable: false},
    );
  }

  updatedPrice(price: number) {
    this.props.product.price = price
    this.setState({ refresh: !this.state.refresh })
  }

  render() {
    const { user, product, isInCart, isInWishes } = this.props

    const inCart = isInCart(product)
    const inWishes = isInWishes(product)
    const hasDesc = product.description != undefined && product.description != ''
    const seller = product.seller
    const state = getStateName(product.state)

    const pics: any = []
    if (product.pictures) {
      for (let i = 0; i < product.pictures.length; ++i)
        pics.push({url: product.pictures[i]})
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <ScrollView contentContainerStyle={ifIphoneX({ paddingBottom: 30 }, {})}>
          <View>
            <ImageSlider
              width={Dimensions.get('window').width}
              height={ifIphoneX({height: 300}, {height: 280}).height}
              pictures={product.pictures || []}
              onSelect={(index: number) => this.setState({ showZoom: true, zoomIndex: index })}
              />
            <VeilView abs start='rgba(0, 0, 0, 0.23)' end='rgba(0, 0, 0, .06)' />
            <TouchableOpacity
              style={[styles.favoriteBtn, {backgroundColor: '#eee'}]}
              onPress={() => this.toggleWish()}
              >
              <View style={styles.favoriteImg}>
                <AssetImage
                  src={inWishes ? require('../../images/like.png') : require('../../images/like_empty.png')}
                  />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backBtn} onPress={Actions.pop}>
              <AntDesign name="close" size={23} color='#fff' />
            </TouchableOpacity>
          </View>
          
          { this.props.user.admin &&
            <Text style={styles.userName}>{product.seller.email}</Text>
          }
          <View style={styles.userInfo}>
            <View style={mainStyle.row}>
              <View style={styles.userPicture}>
                <AssetImage src={seller.picture ? {uri: seller.picture} : require('../../images/user.png')} resizeMode='cover' />
              </View>
              <Text style={styles.userName}>{product.seller.name}</Text>
            </View>
          </View>

          <View style={styles.productInfo}>
            { product.certified &&
              <Text style={styles.certif}><AntDesign name="check" style={{marginTop: 10}} size={22} /> {'Produit certifié'.toUpperCase()}</Text>
            }
            <Text style={styles.productName}>{product.name.toUpperCase()}</Text>
            <Text style={styles.productState}>{state.toUpperCase()}</Text>
            { product.size &&
              <Text style={styles.productState}>Taille: {product.size}</Text>
            }
            { product.shoe &&
              <Text style={styles.productState}>Pointure: {product.shoe}</Text>
            }
            <View style={[mainStyle.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <Text style={styles.productPrice}>{Number(product.price).toFixed(2)}€</Text>
              { (product.available && product.seller.id === user.id) &&
                <TouchableOpacity onPress={() => {
                  Actions.updatePrice({
                    product: product,
                    onUpdate: (price: number) => this.updatedPrice(price),
                  })
                }}>
                  <Text style={styles.updatePrice}>Modifier</Text>
                </TouchableOpacity>
              }
            </View>
          </View>

          <BottomButton
            titleColor={mainStyle.themeColor}
            backgroundColor={'#fff'}
            title={'Posez vos questions'}
            style={{
              borderColor: mainStyle.themeColor,
              borderWidth: 1,
            }}
            onPress={() => this.showComments()}
          />

          { product.seller.id == user.id ? (
            <View style={{ justifyContent: 'center', }}>
              <BottomButton
                style={{marginTop: 10}}
                backgroundColor={mainStyle.themeColor}
                title={product.available ? 'Booster mon produit !' : 'Vendu !'}
                disabled={!product.available}
                onPress={() => Actions.boost({ product: product })}
              />
              {product.available && <Text style={styles.boostTitle}>Mettez en avant votre produit !</Text>}
            </View>
          ) : (
            <BottomButton
              style={{marginTop: 10}}
              backgroundColor={mainStyle.themeColor}
              title={product.available ? (inCart ? 'Ajouté au panier' : 'Ajouter au panier') : 'Vendu !'}
              disabled={!product.available || inCart}
              onPress={() => this.toggleCart()}
            />
          )}

          { hasDesc &&
            <Text style={styles.description}>{'Présentation de l\'article\n\n'}{product.description}</Text>
          }

          <View style={styles.links}>
            { (product.seller.id != user.id) &&
              <View style={styles.link}>
                <LinkButton
                  title="Signaler l'article"
                  color={mainStyle.themeColor}
                  onPress={() => this.report(product)}
                  />
              </View>
            }

            { product.available && (product.seller.id == user.id || user.admin) &&
              <View style={styles.link}>
                <LinkButton
                  title="Supprimer l'article"
                  color={mainStyle.redColor}
                  onPress={() => this.remove(product)}
                  />
              </View>
            }

            { user.admin &&
              <View style={styles.link}>
                <LinkButton
                  title="Bloquer le vendeur"
                  color={mainStyle.themeColor}
                  onPress={() => this.block(product)}
                  />
              </View>
            }
          </View>

        </ScrollView>
        <Modal
          visible={this.state.showZoom}
          transparent={false}
          onRequestClose={() => this.setState({ showZoom: false })}>
          <ImageViewer imageUrls={pics} index={this.state.zoomIndex} />
          <TouchableOpacity onPress={() => this.setState({ showZoom: false })} style={styles.quitZoom}>
            <AntDesign name="close" size={22} color='#fff' />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },

  userInfo: {
    padding: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  userName: {
    color: '#686868',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 20,
    marginRight: 20,
  },
  userPicture: {
    ...mainStyle.circle(60),
  },

  productInfo: {
    padding: 20,
  },
  productName: {
    ...mainStyle.montBold,
    fontSize: 20,
    color: '#686868',
  },
  certif: {
    ...mainStyle.montBold,
    fontSize: 13,
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: mainStyle.greenColor,
    marginBottom: 12,
  },
  productState: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: mainStyle.lightColor
  },
  productPrice: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: 'bold',
    color: mainStyle.darkColor,
  },
  updatePrice: {
    color: mainStyle.themeColor,
    fontSize: 15,
    paddingRight: 12,
  },
  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
    ...ifIphoneX({
      top: 46,
    }, {
      top: 26
    })
  },
  shareBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    
    position: 'absolute',
    right: 16,
    ...ifIphoneX({
      top: 46,
    }, {
      top: 26
    })
  },
  favoriteBtn: {
    padding: 14,
    borderRadius: 100 / 2,
    position: 'absolute',
    bottom: -20,
    right: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteImg: {
    width: 24,
    height: 24,
  },
  description: {
    color: '#686868',
    fontSize: 17,
    marginTop: 16,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
  },
  boostTitle: {
    color: mainStyle.lightColor,
    fontSize: 14,
    textAlign: 'center',
  },
  quitZoom: {
    position: 'absolute',
    ...ifIphoneX({
      top: 34,
    }, {
      top: 26,
    }),
    left: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  links: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  link: {
    marginTop: 14,
  }

});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  cart: state.cartReducer.cart,
  wishes: state.wishesReducer.list,
  toggleCart: state.cartReducer.toggle,
  toggleWishes: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  addWish: (product: any) => dispatch(addWish(product)),
  removeWish: (product: any) => dispatch(removeWish(product)),
  addToCart: (product: any) => dispatch(addToCart(product)),
  removeFromCart: (product: any) => dispatch(removeFromCart(product)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  isInCart: (product: any) => dispatch(isInCart(product)),
  isInWishes: (product: any) => dispatch(isInWishes(product)),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen)
