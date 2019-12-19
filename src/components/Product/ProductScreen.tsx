import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, LinkButton, ImageSlider, VeilView } from '../Reusable'
import { Fire, Flash, Modal } from '../../services'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { switchTab } from '../../actions/tab.action'
import { addWish, removeWish, isInWishes } from '../../actions/wishes.action'

import PaymentModal from './PaymentModal'

import ImageViewer from 'react-native-image-zoom-viewer';

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  product: any;
  wishes: any;

  switchTab: (tab: number) => void;
  addWish: (product: any) => void;
  removeWish: (product: any) => void;
  isInWishes: (product: any) => boolean;
}

class ProductScreen extends React.Component<Props>  {

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

  render() {
    const { user, product, isInWishes } = this.props

    const inWishes = isInWishes(product)
    const hasDesc = product.description != undefined && product.description != ''
    const seller = product.seller

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
              height={ifIphoneX({height: 260}, {height: 200}).height}
              pictures={product.pictures || []}
              onSelect={(index: number) => this.setState({ showZoom: true, zoomIndex: index })}
              />
            <VeilView abs start='rgba(0, 0, 0, 0.23)' end='rgba(0, 0, 0, .06)' />
            
            <TouchableOpacity
              style={styles.wishBtn}
              onPress={() => this.toggleWish()}>
              { inWishes ? (
                <AssetImage src={require('../../images/like.png')} />
              ) : (
                <AssetImage src={require('../../images/like_empty.png')} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backBtn} onPress={Actions.pop}>
              <AntDesign name="close" size={23} color='#fff' />
            </TouchableOpacity>
          </View>

          <View style={styles.logoWrapper}>
            <View style={styles.shadow}>
              <View style={styles.logo}>
                <AssetImage src={product.pictures ? { uri: product.pictures[0]} : undefined} resizeMode="cover" />
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <View>
              <Text style={styles.title}>Restaurant</Text>
              <Text>Aujourd'hui 21:40 - 22:20</Text>
            </View>
            <View>
              <Text>5,90€</Text>
            </View>
          </View>

          { hasDesc &&
            <View style={styles.descriptionWrapper}>
              <Text style={styles.descriptionTitle}>Ce que tu peux avoir</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          }
          
          <View style={styles.location}>
            { product.place &&
              <Text style={styles.place}>{product.place.toUpperCase()}</Text>
            }
            <Text style={styles.address}>{product.address + ', ' + product.postal_code + ' ' + product.city}</Text>
            { (product.lat && product.lng) &&
              <View style={styles.map}>
                <MapView
                  style={{flex: 1}}
                  zoomEnabled={false}
                  scrollEnabled={false}
                  initialRegion={{
                    latitude: product.lat,
                    longitude: product.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                  }}
                  >
                  <Marker
                    onPress={() => this.showOptions()}
                    coordinate={{latitude: product.lat, longitude: product.lng}}
                  />
                </MapView>
              </View>
            }
          </View>

        </ScrollView>

        <BottomButton
          title="Réserver"
          backgroundColor={mainStyle.themeColor}
          onPress={() => Modal.show({ component: <PaymentModal /> })}
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
  content: {
    flex: 1,
    overflow: 'hidden',
  },

  title: {
    ...mainStyle.montBold,
    fontSize: 15,
    marginBottom: 3,
  },

  logoWrapper: {
    marginTop: -60,
    marginLeft: 15,
  },
  shadow: {
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    ...mainStyle.circle(80),
  },

  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 12,
    marginHorizontal: 20,
  },

  descriptionWrapper: {
    ...mainStyle.montBold,
    marginHorizontal: 20,
    marginVertical: 30,
  },
  descriptionTitle: {
    ...mainStyle.montBold,
    color: '#131414',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  description: {
    ...mainStyle.montText,
    color: '#696969',
    fontSize: 17,
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

  wishBtn: {
    ...mainStyle.abs,
    bottom: undefined, left: undefined,
    width: 28,
    height: 28,
    padding: 3,
    
    right: 16,
    ...ifIphoneX({
      top: 46,
    }, {
      top: 26
    })
  },

  location: {
    flex: 1,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  place: {
    ...mainStyle.montBold,
    fontSize: 13,
    color: mainStyle.darkColor
  },
  address: {
    marginTop: 12,
    marginBottom: 16,
    ...mainStyle.montLight,
    fontSize: 14,
    color: mainStyle.darkColor,
  },
  map: {
    flex: 1,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
  },

});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  wishes: state.wishesReducer.list,
  toggleWishes: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  addWish: (product: any) => dispatch(addWish(product)),
  removeWish: (product: any) => dispatch(removeWish(product)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  isInWishes: (product: any) => dispatch(isInWishes(product)),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen)
