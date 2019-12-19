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
  pro: any;
  wishes: any;

  switchTab: (tab: number) => void;
  addWish: (pro: any) => void;
  removeWish: (pro: any) => void;
  isInWishes: (pro: any) => boolean;
}

class ProScreen extends React.Component<Props>  {

  componentDidMount() {
    //Actions.updatePrice({ pro: this.props.pro, onUpdate: (price: number) => this.updatedPrice(price) })
  }

  toggleWish() {
    const { addWish, removeWish, pro, isInWishes } = this.props
    const onPress = () => {
      this.props.switchTab(3)
      Actions.reset('root')
    }

    if (isInWishes(pro)) {
      removeWish(pro)
      Flash.show('Supprimé des favoris !')
    } else {
      addWish(pro)
      Flash.show('Ajouté aux favoris !', 'Cliquez pour voir vos favoris', onPress)
    }
  }

  onPay(counter: number) {
    console.log(counter)
    
  }

  render() {
    const { user, pro, isInWishes } = this.props

    const inWishes = isInWishes(pro)
    const hasDesc = pro.description != undefined && pro.description != ''
    const seller = pro.seller

    const pics: any = []
    if (pro.pictures) {
      for (let i = 0; i < pro.pictures.length; ++i)
        pics.push({url: pro.pictures[i]})
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <ScrollView contentContainerStyle={ifIphoneX({ paddingBottom: 80 }, { paddingBottom: 60 })}>
          <View>
            <ImageSlider
              width={Dimensions.get('window').width}
              height={ifIphoneX({height: 260}, {height: 200}).height}
              pictures={pro.pictures || []}
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
              <AntDesign name="arrowleft" size={23} color='#fff' />
            </TouchableOpacity>
          </View>

          <View style={styles.logoWrapper}>
            <View style={styles.shadow}>
              <View style={styles.logo}>
                <AssetImage src={pro.logo ? { uri: pro.logo} : undefined} resizeMode="cover" />
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <View>
              <Text style={styles.title}>Restaurant</Text>
              <Text style={styles.open}><AntDesign size={14} name="clockcircle" />  Aujourd'hui 21:40 - 22:20</Text>
            </View>
            <View>
              <Text style={styles.price}></Text>
              <Text style={styles.price}>{Number(pro.price).toFixed(2)}€</Text>
            </View>
          </View>

          { hasDesc &&
            <View style={styles.descriptionWrapper}>
              <Text style={styles.descriptionTitle}>Ce que tu peux avoir</Text>
              <Text style={styles.description}>{pro.description}</Text>
            </View>
          }
          
          <View style={styles.location}>
            { (pro.lat && pro.lng) &&
              <View style={styles.map}>
                <MapView
                  style={{flex: 1}}
                  zoomEnabled={false}
                  scrollEnabled={false}
                  initialRegion={{
                    latitude: pro.lat,
                    longitude: pro.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                  }}
                  >
                  <Marker
                    onPress={() => this.showOptions()}
                    coordinate={{latitude: pro.lat, longitude: pro.lng}}
                  />
                </MapView>
              </View>
            }
            <View style={styles.addr}>
              <Text style={styles.address}>{pro.address + ', ' + pro.postal_code + ' ' + pro.city}</Text>
              <View style={styles.trip}>
                <TouchableOpacity>
                  <Text style={styles.tripTxt}>Itinéraire</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </ScrollView>

        <BottomButton
          abs
          title="Réserver"
          backgroundColor={mainStyle.themeColor}
          onPress={() => Modal.show('payment', { component: <PaymentModal price={pro.price} onPay={(counter: number) => this.onPay(counter)} /> })}
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

  logoWrapper: {
    marginTop: -40,
    marginLeft: 15,
  },
  shadow: {
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    ...mainStyle.circle(60),
  },

  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,

    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },

  title: {
    ...mainStyle.montBold,
    fontSize: 15,
    height: 26,
  },
  price: {
    ...mainStyle.montBold,
    fontSize: 15,
    height: 26,
  },
  open: {
    ...mainStyle.montText,
    fontSize: 13,
    height: 26,
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


  location: {
    flex: 1,
    marginTop: 10,
  },
  map: {
    flex: 1,
    height: 200,
  },
  addr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginLeft: 20,
    marginVertical: 20,
  },
  place: {
    ...mainStyle.montBold,
    fontSize: 13,
    color: mainStyle.darkColor
  },
  address: {
    flex: 1,
    marginTop: 12,
    marginBottom: 16,
    ...mainStyle.montLight,
    fontSize: 15,
    lineHeight: 20,
    color: mainStyle.lightColor,
  },
  trip: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripTxt: {
    ...mainStyle.montText,
    backgroundColor: mainStyle.redColor,
    color: '#fff',
    textTransform: 'uppercase',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    borderRadius: 16,
    overflow: 'hidden'
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

});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  wishes: state.wishesReducer.list,
  toggleWishes: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  addWish: (pro: any) => dispatch(addWish(pro)),
  removeWish: (pro: any) => dispatch(removeWish(pro)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  isInWishes: (pro: any) => dispatch(isInWishes(pro)),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProScreen)
