import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, LinkButton, ImageSlider, VeilView, SuccessModal } from '../Reusable'
import { Fire, Flash, Modal, Time, Loader } from '../../services'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { switchTab } from '../../actions/tab.action'
import { addWish, removeWish, isInWishes } from '../../actions/wishes.action'

import ModalContainer from '../Modal/ModalContainer'
import PaymentModal from './PaymentModal'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  pro: any;
  wishes: any;
  lang: any;

  switchTab: (tab: number) => void;
  addWish: (pro: any) => void;
  removeWish: (pro: any) => void;
  isInWishes: (pro: any) => boolean;
}

class ProScreen extends React.Component<Props>  {

  componentDidMount() {
    /*
    setTimeout(() => {
      this.checkout()
    }, 500)
    */
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

  async onPay(counter: number, card: string) {
    const { pro } = this.props
    const price = Number(pro.price * counter).toFixed(2)

    console.log(card)

    try {
      Loader.show('Commande en cours...')
      const res = await Fire.cloud('proceedOrder', { proId: pro.id, quantity: counter, card: card })
      Loader.hide()
      if (res.status === 'success') {
        Modal.hide('payment')
        Modal.show('payment_success', { local: true, content: () => (
          <SuccessModal success={true} message="Paiement validé !" subtitle={"Total " + price + "$"} />
        )})
      } else {
        let error = ''
        switch (res.error) {
          case "currently_unavailable":
            error = "Cet établissement est actuellement indisponible."
            break;

          case "internal_error":
            error = "Une erreur est survenue, veuillez contacter l'assistance"
            break;

          case "payment_declined":
            error = "Vorte commande n'a pas pu aboutir, veuillez ré-essayer ultérieurement ou en saisissant une nouvelle carte."
            break;
          
          default: 
            error = "Erreur est survenue, veuillez contacter l'assistance"
            break;
        }
        Modal.show('payment_failure', { local: true, content: () => (
          <SuccessModal success={false} message={error} subtitle='Echec de la commande' />
        )})
      }

    } catch (err) {
      Loader.hide()
      console.log(err)
      Flash.error('Vérifiez votre connexion internet')
    }
  }

  checkout() {
    const { pro } = this.props
    Modal.show('payment', { local: true, content: () => (
      <PaymentModal
        pro={pro}
        onPay={(counter: number, card: string) => this.onPay(counter, card)}
        />
    )})
  }

  render() {
    const { user, pro, isInWishes, lang } = this.props

    const inWishes = isInWishes(pro)
    const hasDesc = pro.description != undefined && pro.description != ''
    const hasOffer = pro.offer != undefined && pro.offer != ''
    const seller = pro.seller

    const pics: any = []
    if (pro.pictures) {
      for (let i = 0; i < pro.pictures.length; ++i)
        pics.push({url: pro.pictures[i]})
    }

    const soldOut = !pro.quantity || pro.quantity < 0
    const opening = Time.getPickUpRange(pro)

    console.log(pro)

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <ScrollView contentContainerStyle={ifIphoneX({ paddingBottom: 80 }, { paddingBottom: 60 })}>
          <View>
            <ImageSlider
              width={Dimensions.get('window').width}
              height={ifIphoneX({height: 260}, {height: 200}).height}
              pictures={pro.pictures || []}
              />
            <VeilView abs start='rgba(0, 0, 0, 0.23)' end='rgba(0, 0, 0, .46)' />
            
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
              <Text style={styles.title}>{pro.name}</Text>

              <View style={styles.row}>
                <View style={styles.icon}><AntDesign size={14} name="clockcircle" /></View>
                <Text style={styles.open}>{lang.GLOBAL_TODAY} {opening}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.icon}><MaterialIcon size={22} name="map-marker" /></View>
                <Text style={styles.open}>4km</Text>
              </View>
            </View>

            <View>
              <Text style={[styles.oldPrice]}>{Number(Number(pro.price) * 1.7).toFixed(2)}$</Text>
              <Text style={styles.price}>{Number(pro.price).toFixed(2)}$</Text>
            </View>
          </View>

          { hasDesc &&
            <View style={styles.descriptionWrapper}>
              <Text style={styles.descriptionTitle}>{lang.PRO_DESCRIPTION_TITLE}</Text>
              <Text style={styles.description}>{pro.description}</Text>
            </View>
          }

          { hasOffer &&
            <View style={styles.descriptionWrapper}>
              <Text style={styles.descriptionTitle}>{lang.PRO_PACKAGE_CONTENT_TITLE}</Text>
              <Text style={styles.description}>{pro.offer}</Text>
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
                  { pro.logo ? (
                    <Marker
                      onPress={() => void 0}
                      coordinate={{latitude: pro.lat, longitude: pro.lng}}
                    >
                      <View style={{...mainStyle.circle(40)}}>
                        <AssetImage resizeMode='cover' src={{ uri: pro.logo }} />
                      </View>
                    </Marker>
                  ) : (
                    <Marker
                      onPress={() => void 0}
                      coordinate={{latitude: pro.lat, longitude: pro.lng}}
                    />
                  )}
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
          title={soldOut ? lang.PRO_SOLD_OUT : lang.PRO_BUY_BTN}
          disabled={soldOut}
          backgroundColor={mainStyle.themeColor}
          onPress={() => this.checkout()}
          />

        <ModalContainer />
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

  name: {
    ...mainStyle.montBold,
    color: '#fff',
    marginTop: 18,
    fontSize: 18,
  },
  logoWrapper: {
    marginTop: -50,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  shadow: {
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    ...mainStyle.circle(70),
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
    fontSize: 20,
    marginBottom: 9,
  },
  price: {
    ...mainStyle.montBold,
    fontSize: 15,
    height: 26,
  },
  oldPrice: {
    ...mainStyle.montBold,
    fontSize: 15,
    height: 26,
    color: '#aaa',
    textDecorationLine: 'line-through'
  },
  open: {
    ...mainStyle.montText,
    fontSize: 13,
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
    backgroundColor: mainStyle.themeColor,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    width: 20,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  }

});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  wishes: state.wishesReducer.list,
  toggleWishes: state.wishesReducer.toggle,
  lang: state.langReducer.lang,
})
const mapDispatchToProps = (dispatch: any) => ({
  addWish: (pro: any) => dispatch(addWish(pro)),
  removeWish: (pro: any) => dispatch(removeWish(pro)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  isInWishes: (pro: any) => dispatch(isInWishes(pro)),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProScreen)
