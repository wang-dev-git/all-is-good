import React from 'react';
import { connect, useSelector } from 'react-redux';
import { StyleSheet, Keyboard, Text, Image, FlatList, View, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, StatusBar, Dimensions, TextInput } from 'react-native';

import { Fire, Modal, Tools } from '../../services'
import { Notifications } from 'expo';

import { Actions } from 'react-native-router-flux'

import MapView from "react-native-map-clustering";
const { Marker } = require('react-native-maps')

import SearchBar from '../Search/SearchBar'
import MapItem from './MapItem'
import MapBubble from './MapBubble'
import FiltersModal from '../Search/FiltersModal'

import { HeaderBar, FadeInView, MyText } from '../Reusable'

import Icon from '@expo/vector-icons/FontAwesome'
import AntIcon from '@expo/vector-icons/AntDesign'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import { Maps } from '../../services'
import useAddresses from './addresses.hook'
import useLocation from './location.hook'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  fireUser: any;
}
const MapScreen: React.FC<Props> = (props) => {
  
  const { user } = props
  
  const mapRef = React.useRef<any>(null)
  const position = useSelector(state => state.authReducer.position)
  const initialRegion = {
    latitude: position ? position.geometry.location.lat : 48.8240021,
    longitude: position ? position.geometry.location.lat : 2.21,
    latitudeDelta: 0.03358723958820065,
    longitudeDelta: 0.04250270688370961,
  }

  const userLocation = useLocation(user)

  const [selectedAddress, selectAddress] = React.useState(null)
  const [selectedPro, selectPro] = React.useState(null)

  const listRef = React.useRef<FlatList<any[]>>()
  const [center, setCenter] = React.useState(position)
  const [address, setAddress] = React.useState("")
  const [pros, setPros] = React.useState([])
  const [prosList, setProsList] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [scrollPos, setScrollPos] = React.useState(0)
  const [cancelScrollingListening, setCancelScrollingListening] = React.useState(false)

  const { addresses, clearAddresses } = useAddresses(address)
  
  const animateTo = (lat, lng) => {
    if (!mapRef)
      return;
    const tempCoords = {
      latitude: Number(lat),
      longitude: Number(lng)
    }
    mapRef.current.animateCamera({center: tempCoords, pitch: 2, heading: 20, altitude: 8000, zoom: 100}, 420)
  }

  const onAddressTap = (item) => {
    selectAddress(item)
    setCenter(item)
    setAddress(item.formatted_address)
    clearAddresses()
    animateTo(item.geometry.location.lat, item.geometry.location.lng)
    Keyboard.dismiss()
  }

  const getGeoZoom = (zoom: number) => {
    let base = zoom
    if (base > 11)
      base = 11
    if (base < 6)
      base = 6

    if (base >= 6 && base < 8)
      return 2
    if (base >= 8 && base < 9)
      return 3
    if (base <= 9 && base < 11)
      return 4
    return 5
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const prosRef = Fire.store().collection('pros')
      const pros = await Fire.list(prosRef)
      const ordered = pros.filter((item) => item.lat !== undefined).sort((a, b) => a.distance - b.distance)
      for (const pro of ordered) {
        if (center)
          pro.distance = Tools.getRoundedDistance(pro.lat, pro.lng, center.geometry.location.lat, center.geometry.location.lng)
        else
          pro.distance = 0
      }
      setPros(ordered)
      if (ordered.length)
        selectPro(ordered[0])
    } catch (err) {
      setPros([])
    }
    setLoading(false)
  }

  const redirectToPro = (pro: any) => {
    selectPro(pro)
    animateTo(pro.lat, pro.lng)
  }

  React.useEffect(() => {
    if (center)
      refresh()
  }, [center])

  React.useEffect(() => {
    if (cancelScrollingListening)
      return;
    const index = Math.round((scrollPos - 10) / 220)
    if (index < 0 || index > prosList.length - 1)
      return;
    if (!selectedPro || selectedPro.id !== pros[prosList[index].properties.index].id) {
      redirectToPro(pros[prosList[index].properties.index])
    }
  }, [scrollPos, cancelScrollingListening])


  const showFilters = () => {
    Keyboard.dismiss()
    Modal.show('filters', {
      content: () => <FiltersModal />,
      onClose: () => refresh()
    })
  }

  const recenter = () => {
    animateTo(position.geometry.location.lat, position.geometry.location.lng)
  }

  const renderMapItem = (item) => {
    const pro = pros[item.properties.index]
    if (!pro)
      return (null)
    return (
      <MapItem
        pro={pro}
        onPress={() => Actions.pro({ pro: pro })}
        />
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <HeaderBar
          title="Autour de vous"
          logo
          />
        <View style={styles.container}>
          <MapView
            mapRef={(ref) => mapRef.current = ref}
            showsUserLocation
            style={styles.map}
            initialRegion={initialRegion}
            onRegionChangeComplete={(r, markers) => {
              setProsList(markers)
            }}
            onRegionChange={(r) => {

            }}
          >
            { pros.map((item, index) => (
              <Marker
                key={index}
                onPress={() => {
                  selectPro(item)

                  for (let index = 0; index < prosList.length; ++index) {
                    const pro = pros[prosList[index].properties.index]
                    if (pro.id === item.id) {
                      if (listRef && listRef.current) {
                        setCancelScrollingListening(true)
                        listRef.current.scrollToIndex({ index: index })
                        setTimeout(() => {
                          setCancelScrollingListening(false)
                        }, 600)
                      }
                      break
                    }
                  }
                }}
                coordinate={{
                  longitude: item.lng,
                  latitude: item.lat,
                }}
              >
                <MapBubble
                  selected={selectedPro && item.id == selectedPro.id}
                  color={mainStyle.themeColor}
                  />
              </Marker>
            ))}
          </MapView>

          <View style={styles.floatingTop}>
            <SearchBar
              query={address}
              onChange={(addr) => {setAddress(addr); selectAddress(null)}}
              onClear={() => setAddress('')}
              />
            { userLocation !== null &&
              <View style={styles.recenter}>
                <TouchableOpacity style={styles.recenterBtn} onPress={recenter}>
                  <MaterialIcons name="place" color='#000' size={22} />
                </TouchableOpacity>
              </View>
            }
            { addresses.length > 0 && !selectedAddress &&
              <View style={styles.content}>
                { addresses.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => onAddressTap(item)}
                    style={styles.addressWrapper}
                    >
                    <MyText>{item.formatted_address}</MyText>
                  </TouchableOpacity>
                )) }
              </View>
            }
          </View>
          { selectedPro &&
            <FadeInView style={styles.floatingBottom}>
              <FlatList
                ref={listRef}
                scrollEventThrottle={0.16}
                onScroll={(evt) => setScrollPos(evt.nativeEvent.contentOffset.x)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 40}}
                data={prosList || []}
                renderItem={({ item }) => renderMapItem(item)}
                keyExtractor={(item, index) => index.toString()}
                />
              <View style={styles.listHeader}>
                <TouchableOpacity style={styles.listClose} onPress={() => selectPro(null)}>
                  <AntIcon name="close" size={22} color='#fff' />
                </TouchableOpacity>
              </View>
            </FadeInView>
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    margin: 20,
    marginTop: 30,
    padding: 10,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  floatingTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  floatingBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  recenter: {
    position: 'absolute',
    right: 16,
    top: 50,
    alignItems: 'flex-end',
  },
  recenterBtn: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  addressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingVertical: 12,
  },
  listHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  listClose: {
    ...mainStyle.circle(36),
    backgroundColor: mainStyle.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


const mapStateToProps = (state: any) => ({
  fireUser: state.authReducer.fireUser,
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
