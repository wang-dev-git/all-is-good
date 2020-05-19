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
  const [region, setRegion] = React.useState({
    latitude: 48.8240021,
    longitude: 2.21,
    latitudeDelta: 0.03358723958820065,
    longitudeDelta: 0.04250270688370961,
  })

  const userLocation = useLocation(user)

  /*
  React.useEffect(() => {
    if (userLocation) {
      const coords = userLocation.coords
      const fetch = async () => {
        const addr = await Maps.getAddress(coords.latitude, coords.longitude)
        if (addr.length) {
          setAddress(addr[0].formatted_address)
          region.timing({
            latitude: coords.latitude,
            longitude: coords.longitude
          }).start()
        }
      }
      fetch()
    }
  }, [userLocation])*/

  const [selectedAddress, selectAddress] = React.useState(null)
  const [selectedPro, selectPro] = React.useState(null)

  const [address, setAddress] = React.useState("")
  const [pros, setPros] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [scrollPos, setScrollPos] = React.useState(0)
  const position = useSelector(state => state.authReducer.position)

  const { addresses, clearAddresses } = useAddresses(address)
  
  const onAddressTap = (item) => {
    selectAddress(item)
    clearAddresses()
    /*
    region.timing({
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng
    }).start()
    */
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
      for (const pro of pros) {
        if (position)
          pro.distance = Tools.getRoundedDistance(pro.lat, pro.lng, position.geometry.location.lat, position.geometry.location.lng)
        else
          pro.distance = 0
      }
      setPros(pros.filter((item) => item.lat !== undefined).sort((a, b) => a.distance - b.distance))
    } catch (err) {
      setPros([])
    }
    setLoading(false)
  }

  React.useEffect(() => {
    const index = Math.round((scrollPos - 10) / 220)
    if (index < 0 || index > pros.length - 1)
      return;
    if (!selectedPro || selectedPro.id !== pros[index].id)
      selectPro(pros[index])
  }, [scrollPos])

  React.useEffect(() => {
    refresh()
  }, [address])

  React.useEffect(() => {
    if (pros.length)
      selectPro(pros[0])
  }, [pros])

  React.useEffect(() => {
    if (selectedPro) {
      let tempCoords = {
        latitude: Number(selectedPro.lat),
        longitude: Number(selectedPro.lng)
      }
      mapRef.current.animateCamera({center: tempCoords, pitch: 2, heading: 20, altitude: 2000, zoom: 40}, 420)

      /*
      region.timing({
        latitude: selectedPro.lat,
        longitude: selectedPro.lng
      }).start()
      */
    }
  }, [selectedPro])

  const showFilters = () => {
    Keyboard.dismiss()
    Modal.show('filters', {
      content: () => <FiltersModal />,
      onClose: () => refresh()
    })
  }

  const recenter = () => {

    setRegion({...region})
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
            initialRegion={region}
            onRegionChangeComplete={(r) => {
              
            }}
            onRegionChange={(r) => {

            }}
          >
            { pros.map((item, index) => (
              <Marker
                key={index}
                onPress={() => selectPro(item)}
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
            )) }
            {selectedAddress &&
              <Marker
                coordinate={{
                  longitude: selectedAddress.geometry.location.lng,
                  latitude: selectedAddress.geometry.location.lat
                }}
              />
            }
          </MapView>

          <View style={styles.floatingTop}>
            <SearchBar
              query={address}
              onChange={setAddress}
              onClear={() => setAddress('')}
              />
            { userLocation !== null &&
              <View style={styles.recenter}>
                <TouchableOpacity style={styles.recenterBtn} onPress={recenter}>
                  <MaterialIcons name="place" color='#000' size={22} />
                </TouchableOpacity>
              </View>
            }
            { addresses.length > 0 &&
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
                scrollEventThrottle={0.16}
                onScroll={(evt) => setScrollPos(evt.nativeEvent.contentOffset.x)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 40}}
                data={pros || []}
                renderItem={({ item }) =>
                  <MapItem
                    pro={item}
                    onPress={() => Actions.pro({ pro: item })}
                    />
                }
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
