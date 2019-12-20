import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Keyboard, Text, Image, FlatList, View, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, StatusBar, Dimensions, TextInput } from 'react-native';

import { Fire, Modal } from '../../services'
import { Notifications } from 'expo';

import { Actions } from 'react-native-router-flux'

import MapView, { Marker } from 'react-native-maps';
import SearchBar from '../Search/SearchBar'
import MapItem from './MapItem'
import FiltersModal from '../Search/FiltersModal'

import { HeaderBar, FadeInView } from '../Reusable'

import Icon from '@expo/vector-icons/FontAwesome'
import AntIcon from '@expo/vector-icons/AntDesign'

import { Maps } from '../../services'
import useAddresses from './addresses.hook'
import useLocation from './location.hook'

interface Props {
  user: any;
  fireUser: any;
}

import { mainStyle } from '../../styles'

const MapScreen: React.FC<Props> = (props) => {
  
  const { user } = props
  
  const [region, setRegion] = React.useState({
    latitude: 48.8240021,
    longitude: 2.21,
    latitudeDelta: 0.03358723958820065,
    longitudeDelta: 0.04250270688370961,
  })

  const userLocation = useLocation(user)

  /*React.useEffect(() => {
    if (userLocation) {
      const coords = userLocation.coords
      const fetch = async () => {
        const addr = await Maps.getAddress(coords.latitude, coords.longitude)
        if (addr.length) {
          setAddress(addr[0].formatted_address)
          setRegion({
            ...region,
            latitude: coords.latitude,
            longitude: coords.longitude
          })
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

  const addresses = useAddresses(selectedAddress)
  
  const onAddressTap = (item) => {
    selectAddress(item)
    setRegion({
      ...region,
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng
    })
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
    refresh()
  }, [address])

  const showFilters = () => {
    Keyboard.dismiss()
    Modal.show('filters', {
      component: <FiltersModal />,
      onClose: () => refresh()
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <HeaderBar
          title="Autour de vous"
          />
        <View style={styles.container}>
          <MapView
            showsUserLocation
            style={styles.map}
            region={region}
          >
            { pros.map((item, index) => (
              <Marker
                key={index}
                onPress={() => selectPro(item.id)}
                coordinate={{
                  longitude: item.lng,
                  latitude: item.lat,
                }}
              />
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
              <View style={styles.listHeader}>
                <View style={styles.listClose}>
                  <AntIcon name="close" size={22} color='#fff' />
                </View>
              </View>
              <FlatList
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
    marginTop: 80,
    padding: 10,
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
