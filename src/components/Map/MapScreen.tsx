import React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Keyboard, Text, Image, AppState, FlatList, View, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, StatusBar, Dimensions, TextInput } from 'react-native';

import { Fire, Modal, Tools } from '../../services'
import { Notifications } from 'expo';

import { Actions } from 'react-native-router-flux'

import MapView from "react-native-map-clustering";
const { Marker } = require('react-native-maps')

import SearchBar from '../Search/SearchBar'
import MapItem from './MapItem'
import MapBubble from './MapBubble'
import MapMarker from './MapMarker'
import FiltersModal from '../Search/FiltersModal'

import { HeaderBar, FadeInView, MyText } from '../Reusable'

import Icon from '@expo/vector-icons/FontAwesome'
import AntIcon from '@expo/vector-icons/AntDesign'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { loadMap } from '../../actions/filters.action'

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
  
  const [appState, setAppState] = React.useState(AppState.currentState);
  const mapRef = React.useRef<any>(null)
  const position = useSelector(state => state.authReducer.position)
  const mapPros = useSelector(state => state.filtersReducer.mapPros)
  const initialRegion = {
    latitude: position ? position.geometry.location.lat : 25.761681,
    longitude: position ? position.geometry.location.lng : -80.191788,
    latitudeDelta: 0.3358723958820065,
    longitudeDelta: 0.4250270688370961,
  }

  const [selectedAddress, selectAddress] = React.useState(null)
  const [selectedPro, selectPro] = React.useState(null)
  const userLocation = useLocation()

  const listRef = React.useRef<FlatList<any[]>>()
  const [center, setCenter] = React.useState(position)
  const [address, setAddress] = React.useState("")
  const [pros, setPros] = React.useState([])
  const [prosList, setProsList] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [scrollPos, setScrollPos] = React.useState(0)
  const [cancelScrollingListening, setCancelScrollingListening] = React.useState(false)
  const [showOverlay, setShowOverlay] = React.useState(false)
  const dispatch = useDispatch()

  const { addresses, clearAddresses } = useAddresses(address)
  
  const animateTo = (lat, lng) => {
    if (!mapRef)
      return;
    const tempCoords = {
      latitude: Number(lat),
      longitude: Number(lng),
    }
    mapRef.current.animateCamera({center: tempCoords, pitch: 0, heading: 0, altitude: 2000, zoom: 100}, 420)
  }

  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    AppState.addEventListener("change", _handleAppStateChange);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _keyboardDidShow = () => {
    setShowOverlay(true)
  };

  const _keyboardDidHide = () => {
    setShowOverlay(false)
  };

  const _handleAppStateChange = async nextAppState => {
    if (nextAppState === 'active') {
      dispatch(loadMap())
    }
    setAppState(nextAppState);
  };

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
      for (const pro of mapPros) {
        if (center)
          pro.distance = Tools.getRoundedDistance(pro.lat, pro.lng, center.geometry.location.lat, center.geometry.location.lng)
        else
          pro.distance = 0
      }
      setPros(mapPros.sort((a, b) => a.distance - b.distance))
      if (mapPros.length)
        selectPro(mapPros[0])
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
    refresh()
  }, [mapPros])

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
    if (index >= prosList.length)
      return;
    const proIndex = prosList[index].properties.index
    if (proIndex >= pros.length)
      return;
    const p = pros[proIndex]
    if (!p)
      return;
    if (!selectedPro || (selectedPro.id !== p.id)) {
      redirectToPro(p)
    }
  }, [scrollPos, cancelScrollingListening])


  const showFilters = () => {
    Keyboard.dismiss()
    Modal.show('filters', {
      content: () => <FiltersModal />,
      onClose: () => refresh()
    })
  }

  const animateRegion = (lat, lng) => {
    if (!mapRef)
      return;
    const region = {
      latitude: Number(lat),
      longitude: Number(lng),
      latitudeDelta: 0.3358723958820065,
      longitudeDelta: 0.4250270688370961,
    }
    mapRef.current.animateToRegion(region, 420)
  }

  const recenter = () => {
    if (userLocation) {
      animateRegion(userLocation.coords.latitude, userLocation.coords.longitude)
    } else if (position) {
      animateRegion(position.geometry.location.lat, position.geometry.location.lng)
    }
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

  const renderCluster = (data) => {
    const coords = data.geometry.coordinates
    const count = data.properties.point_count
    return (
      <Marker
        key={data.id}
        coordinate={{
          latitude: coords[1],
          longitude: coords[0],
        }}
        onPress={data.onPress}
      >
        <MapMarker selected={false} count={count} />
      </Marker>
    )
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title=""
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
          renderCluster={renderCluster}
        >
          { pros.map((item, index) => (
            <Marker
              key={index}
              onPress={() => {
                selectPro(item)

                for (let index = 0; index < prosList.length; ++index) {
                  const proIndex = prosList[index].properties.index
                  if (proIndex >= pros.length)
                    return;
                  const pro = pros[proIndex]
                  if (!pro)
                    return;
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
              <MapMarker
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
          { position !== null &&
            <View style={styles.recenter}>
              <TouchableOpacity style={styles.recenterBtn} onPress={recenter}>
                <MaterialIcons name="place" color='#fff' size={22} />
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

      { showOverlay &&
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}></View>
        </TouchableWithoutFeedback>
      }
    </View>
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
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
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
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: mainStyle.themeColor,
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
