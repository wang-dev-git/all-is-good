import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Alert, ScrollView, Platform, Linking, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, FloatingButton, MyText, LinkButton, ImageSlider, VeilView, SuccessModal } from '../Reusable'
import { Fire, Flash, Modal, Time, Loader, Tools } from '../../services'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { switchTab } from '../../actions/tab.action'
import { fetchOrders } from '../../actions/orders.action'
import { addWish, removeWish, isInWishes } from '../../actions/wishes.action'

import ModalContainer from '../Modal/ModalContainer'
import PaymentModal from './PaymentModal'

import { mainStyle } from '../../styles'

import { getIcon } from '../../types/pro_icons'

interface Props {
  pro: any;
}

const ProScreen: React.FC<Props> = (props) => {

  const user = useSelector(state => state.authReducer.user)
  const lang = useSelector(state => state.langReducer.lang)
  const langId = useSelector(state => state.langReducer.id)
  const wishesToggle = useSelector(state => state.wishesReducer.toggle)
  const position = useSelector(state => state.authReducer.position)
  const pro = props.pro
  const dispatch = useDispatch()

  const toggleWish = () => {
    const onPress = () => {
      dispatch(switchTab(3))
      Actions.popTo('tabs')
    }

    if (dispatch(isInWishes(pro))) {
      dispatch(removeWish(pro))
      Flash.show(lang.FAVORITE_REMOVED)
    } else {
      dispatch(addWish(pro))
      Flash.show(lang.FAVORITE_ADDED, lang.FAVORITE_ADDED_SUBTITLE, onPress)
    }
  }

  const onPay = async (counter: number, card: string) => {
    const price = Number(pro.price * counter).toFixed(2)
    try {
      Loader.show(lang.PAYMENT_PROCEEDING)
      const res = await Fire.cloud('proceedOrder', { proId: pro.id, quantity: counter, card: card })
      Loader.hide()
      if (res.status === 'success') {
        await dispatch(fetchOrders())
        Modal.hide('payment')
        Modal.show('payment_success', { local: true, content: () => (
          <SuccessModal success={true} message={lang.PAYMENT_SUCCESS} subtitle={"Total " + price + "$"} />
        ), onTerminate: () => {
          Modal.terminate('payment')
          Modal.terminate('payment_success')
        }})
      } else {
        let error = ''
        switch (res.error) {
          case "sold_out":
            error = lang.PAYMENT_SOLD_OUT
            break;

          case "currently_unavailable":
            error = lang.PAYMENT_FAIL_UNAVAILABLE
            break;

          case "internal_error":
            error = lang.PAYMENT_FAIL_INTERNAL
            break;

          case "payment_declined":
            error = lang.PAYMENT_DECLINE
            break;
          
          default:
            error = lang.PAYMENT_FAIL_INTERNAL
            break;
        }
        Modal.show('payment_failure', { local: true, content: () => (
          <SuccessModal success={false} message={error} subtitle={lang.PAYMENT_ERROR} />
        ), onTerminate: () => {
          Modal.terminate('payment')
          Modal.terminate('payment_failure')
        }})
      }

    } catch (err) {
      Loader.hide()
      console.log(err)
      Flash.error(lang.GLOBAL_INTERNET)
    }
  }

  const checkout = () => {
    Modal.show('payment', { onTerminate: () => void 0, local: true, content: () => (
      <PaymentModal
        pro={pro}
        onPay={onPay}
        />
    )})
  }

  const showOptions = () => {
    Alert.alert(
      lang.PRO_OPEN_MAPS_TITLE,
      lang.PRO_OPEN_MAPS_SUBTITLE,
      [
        {
          text: lang.GLOBAL_CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => showMaps()},
      ],
      {cancelable: true},
    );
  }

  const showMaps = () => {
    const { address, postal_code, city } = pro

    const daddr = encodeURIComponent(`${address} ${postal_code}, ${city}`);
    if (Platform.OS === 'ios') {
      Linking.openURL(`http://maps.apple.com/?daddr=${daddr}`);
    } else {
      Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
    }
  }

  const inWishes = dispatch(isInWishes(pro))
  const hasDesc = pro.descriptions != undefined && pro.descriptions[langId] != undefined
  const hasOffer = pro.offers != undefined && pro.offers[langId] != undefined
  const hasAllergens = pro.allergens != undefined && pro.allergens[langId] != undefined
  const seller = pro.seller

  const pics: any = []
  if (pro.picture) {
    pics.push(pro.picture)
  }

  const soldOut = !pro.quantity || pro.quantity < 0
  const opening = Time.getPickUpRange(pro, langId)

  const icons = pro.icons || []
  const distance = position ? Tools.getRoundedDistance(position.geometry.location.lat, position.geometry.location.lng, pro.lat, pro.lng) : null

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />
      <ScrollView contentContainerStyle={ifIphoneX({ paddingBottom: 110 }, { paddingBottom: 90 })}>
        <View>
          <ImageSlider
            width={Dimensions.get('window').width}
            height={ifIphoneX({height: 260}, {height: 200}).height}
            pictures={pics}
            />
          <VeilView abs start='rgba(0, 0, 0, 0.23)' end='rgba(0, 0, 0, .46)' />
          
          <TouchableOpacity
            style={styles.wishBtn}
            onPress={toggleWish}>
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
              <AssetImage src={pro.logo ? { uri: pro.logo} : require('../../images/noimage.png')} resizeMode="cover" />
            </View>
          </View>
        </View>

        <View style={styles.topWrapper}>
          <View style={styles.info}>
            <View style={{flex: 0.8}}>
              <MyText style={styles.title}>{pro.name}</MyText>

              <View style={[styles.row, { marginBottom: 6 }]}>
                <View style={styles.icon}><AntDesign size={14} name="clockcircle" /></View>
                <MyText style={styles.open}>{lang.GLOBAL_TODAY} {opening}</MyText>
              </View>

              { distance !== null &&
                <View style={[styles.row, { marginBottom: 6 }]}>
                  <View style={styles.icon}><MaterialIcon size={22} name="map-marker" /></View>
                  <MyText style={styles.open}>{distance} km</MyText>
                </View>
              }
            </View>

            <View style={{flex: 0.2, alignItems: 'flex-end'}}>
              <MyText style={[styles.oldPrice]}>{Number(Number(pro.price) * 1.7).toFixed(2)}$</MyText>
              <MyText style={styles.price}>{Number(pro.price).toFixed(2)}$</MyText>
            </View>

          </View>

          { icons.length > 0 &&
            <View style={styles.bigRow}>
              { icons.map((iconId, index) => (
                <View key={index} style={styles.proIcon}>
                  <AssetImage src={getIcon(iconId)} />
                </View>
              )) }
            </View>
          }

          <View style={{alignItems: 'flex-start'}}>
            <View style={styles.quantity}>
              <MyText style={styles.quantityTxt}>{pro.quantity > 0 ? (lang.PRO_TO_SAVE || '').replace('%COUNT%', pro.quantity) : lang.PRO_NONE_TO_SAVE}</MyText>            
            </View>
          </View>
        </View>

        { hasDesc &&
          <View style={styles.descriptionWrapper}>
            <MyText style={styles.descriptionTitle}>{lang.PRO_DESCRIPTION_TITLE}</MyText>
            <MyText style={styles.description}>{pro.descriptions[langId]}</MyText>
          </View>
        }

        { hasOffer &&
          <View style={styles.descriptionWrapper}>
            <MyText style={styles.descriptionTitle}>{lang.PRO_PACKAGE_CONTENT_TITLE}</MyText>
            <MyText style={styles.description}>{pro.offers[langId]}</MyText>
          </View>
        }

        { hasAllergens &&
          <View style={styles.descriptionWrapper}>
            <MyText style={styles.descriptionTitle}>{lang.PRO_PACKAGE_ALLERGENS_TITLE}</MyText>
            <MyText style={styles.description}>{pro.allergens[langId]}</MyText>
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
                    <View style={{...mainStyle.circle(60), padding: 6, backgroundColor: '#fff'}}>
                      <AssetImage resizeMode='cover' src={require('../../images/logo.png')} />
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

          <View style={[styles.row, { marginBottom: 0, marginTop: 16, marginLeft: 16 }]}>
            { distance !== null &&
              <React.Fragment>
                <View style={styles.icon}><MaterialIcon size={22} name="map-marker" /></View>
                <MyText style={styles.open}>{distance} km</MyText>
              </React.Fragment>
            }
          </View>

          <View style={styles.addr}>
            <MyText style={styles.address}>{pro.address + ', ' + pro.postal_code + ' ' + pro.city}</MyText>
            <View style={styles.trip}>
              <TouchableOpacity onPress={showOptions}>
                <MyText style={styles.tripTxt}>{lang.PRO_GO_TO_BTN}</MyText>
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
        onPress={checkout}
        />

      <ModalContainer />
    </View>
  );
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
    marginTop: -60,
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
    ...mainStyle.circle(84),
  },

  quantity: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: mainStyle.orangeColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
    marginBottom: 12,
  },
  quantityTxt: {
    ...mainStyle.montBold,
    color: '#fff',
    textTransform: 'uppercase'
  },

  topWrapper: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },

  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 12,
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
    marginVertical: 20,
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
    marginBottom: 20,
  },
  place: {
    ...mainStyle.montBold,
    fontSize: 13,
    color: mainStyle.darkColor
  },
  address: {
    flex: 1,
    ...mainStyle.montLight,
    fontSize: 15,
    color: mainStyle.lightColor,
  },
  trip: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
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
  },
  bigRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  icon: {
    width: 20,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proIcon: {
    width: 27,
    height: 27,
    marginRight: 12,
    marginTop: 4,
    marginBottom: 4,
  }

});

export default ProScreen
