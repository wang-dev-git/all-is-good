import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Keyboard, Text, Image, View, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, StatusBar, Dimensions, TextInput } from 'react-native';

import { Fire, Modal } from '../../services'
import { Notifications } from 'expo';

import MapView, { Marker } from 'react-native-maps';
import SearchBar from '../Search/SearchBar'

import { HeaderBar } from '../Reusable'

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
    latitude: 48.80002469999999,
    longitude: 2.1887221,
    latitudeDelta: 0.03358723958820065,
    longitudeDelta: 0.04250270688370961,
  })

  const userLocation = useLocation(user)

  React.useEffect(() => {
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
  }, [userLocation])

  const [selectedAddress, selectAddress] = React.useState(null)

  const [address, setAddress] = React.useState("1 rue de l'Ermitage, Sèvres")
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
      setPros(pros)
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
            {selectedAddress &&
              <Marker coordinate={{
                longitude: selectedAddress.geometry.location.lng,
                latitude: selectedAddress.geometry.location.lat
              }} />
            }
          </MapView>

          <View style={styles.floating}>
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    ...mainStyle.montBold,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1.3,
  },
  content: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    marginBottom: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    color: '#333',

    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  addressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingVertical: 12,
  },

  clear: {
    width: 30,
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
