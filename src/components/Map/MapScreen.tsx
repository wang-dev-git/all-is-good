import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Keyboard, Text, Image, FlatList, View, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, StatusBar, Dimensions, TextInput } from 'react-native';

import { Fire, Modal } from '../../services'
import { Notifications } from 'expo';

import { Actions } from 'react-native-router-flux'

const MapView = require('react-native-maps')

import SearchBar from '../Search/SearchBar'
import MapItem from './MapItem'
import MapBubble from './MapBubble'
import FiltersModal from '../Search/FiltersModal'

import { HeaderBar, FadeInView } from '../Reusable'

import Icon from '@expo/vector-icons/FontAwesome'
import AntIcon from '@expo/vector-icons/AntDesign'

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
  
  const [region, setRegion] = React.useState(new MapView.AnimatedRegion({
    latitude: 48.8240021,
    longitude: 2.21,
    latitudeDelta: 0.03358723958820065,
    longitudeDelta: 0.04250270688370961,
  }))

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

  const [address, setAddress] = React.useState("1 rue de l'Ermitage Sèvres")
  const [pros, setPros] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [scrollPos, setScrollPos] = React.useState(0)

  const { addresses, clearAddresses } = useAddresses(address)
  
  const onAddressTap = (item) => {
    selectAddress(item)
    clearAddresses()
    region.timing({
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng
    }).start()
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const prosRef = Fire.store().collection('pros')
      const pros = await Fire.list(prosRef)
      setPros(pros.filter((item) => item.lat !== undefined))
    } catch (err) {
      setPros([])
    }
    setLoading(false)
  }

  React.useEffect(() => {
    const index = Math.round(scrollPos / 220)
    selectPro(pros[index])
  }, [scrollPos])

  React.useEffect(() => {
    console.log('refreshed')
    refresh()
  }, [address])

  React.useEffect(() => {
    if (selectedPro) {
      region.timing({
        latitude: selectedPro.lat,
        longitude: selectedPro.lng
      }).start()
    }
  }, [selectedPro])

  const showFilters = () => {
    Keyboard.dismiss()
    Modal.show('filters', {
      component: <FiltersModal />,
      onClose: () => refresh()
    })
  }

  console.log(region)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <HeaderBar
          title="Autour de vous"
          />
        <View style={styles.container}>
          <MapView.Animated
            showsUserLocation
            style={styles.map}
            region={region}
            onRegionChange={(r) => region.setValue(r)}
          >
            { pros.map((item, index) => (
              <MapView.Marker
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
              </MapView.Marker>
            )) }
            {selectedAddress &&
              <MapView.Marker
                coordinate={{
                  longitude: selectedAddress.geometry.location.lng,
                  latitude: selectedAddress.geometry.location.lat
                }}
              />
            }
          </MapView.Animated>

          <View style={styles.floatingTop}>
            <SearchBar
              query={address}
              onChange={setAddress}
              onFilters={showFilters}
              onClear={() => setAddress('')}
              />
            { addresses.length > 0 &&
              <View style={styles.content}>
                { addresses.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => onAddressTap(item)}
                    style={styles.addressWrapper}
                    >
                    <Text>{item.formatted_address}</Text>
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
