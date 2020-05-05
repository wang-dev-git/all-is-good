import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Keyboard, Text, Image, FlatList, View, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, StatusBar, Dimensions, TextInput } from 'react-native';

import { Fire, Modal, Tools, Maps } from '../../services'

import { Actions } from 'react-native-router-flux'

import SearchBar from '../Search/SearchBar'
import MapItem from './MapItem'
import MapBubble from './MapBubble'
import FiltersModal from '../Search/FiltersModal'

import { HeaderBar, FadeInView, MyText } from '../Reusable'

import Icon from '@expo/vector-icons/FontAwesome'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AntIcon from '@expo/vector-icons/AntDesign'

import useAddresses from './addresses.hook'
import useLocation from './location.hook'

import { mainStyle } from '../../styles'

interface Props {
  selected: any;
  onSelect: (address: any) => void;
}
const AddressesScreen: React.FC<Props> = (props) => {
  
  const [search, setSearch] = React.useState(props.selected ? props.selected.formatted_address : '')
  const [selectedAddress, selectAddress] = React.useState(null)
  const [currentAddress, setCurrentAddress] = React.useState(null)
  const { addresses, clearAddresses } = useAddresses(search)

  const user = useSelector(state => state.authReducer.user)
  const lang = useSelector(state => state.langReducer.lang)
  const userLocation = useLocation(user)

  React.useEffect(() => {
    if (userLocation) {
      const coords = userLocation.coords
      const fetch = async () => {
        const addr = await Maps.getAddress(coords.latitude, coords.longitude)
        if (addr.length) {
          addr[0].isCurrent = true
          setCurrentAddress(addr[0])
        }
      }
      fetch()
    }
  }, [userLocation])

  const renderAddress = (address: any) => {
    return (
      <TouchableOpacity style={styles.address} onPress={() => {props.onSelect(address); Actions.pop()}}>
        <MaterialIcons name="place" size={19} />
        <View style={{flex: 1}}>
          { address.isCurrent &&
            <MyText style={[styles.addressTxt, {marginBottom: 4}]}>{lang.ADDRESSES_CURRENT_LOCATION}</MyText>
          }
          <MyText style={[styles.addressTxt, address.isCurrent ? { color: mainStyle.lightColor } : {}]}>{address.formatted_address}</MyText>
        </View>
      </TouchableOpacity>
    )
  }

  const all = currentAddress ? [currentAddress].concat(addresses) : addresses
  return (
    <View style={styles.container}>
      <HeaderBar
        title={lang.ADDRESSES_TITLE}
        back
        />
      <View>
        <TextInput
          value={search}
          style={styles.search}
          placeholder={lang.ADDRESSES_PLACEHOLDER}
          onChange={(evt) => setSearch(evt.nativeEvent.text)}
          />
        { search.length > 0 &&
          <TouchableOpacity style={styles.clearIcon} onPress={() => setSearch('')}>
            <AntIcon name="close" color='#000' size={16} />
          </TouchableOpacity>
        }
      </View>
      <FlatList
        style={{flex: 1}}
        data={all}
        contentContainerStyle={{paddingBottom: 20, paddingTop: 0,}}
        renderItem={({ item }) => renderAddress(item)}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <MyText style={styles.emptyTxt}>{lang.ADDRESSES_EMPTY}</MyText>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  address: {
    paddingVertical: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  addressTxt: {
    ...mainStyle.montText,
    marginLeft: 6,
    flex: 1,
  },
  empty: {
    alignItems: 'center',
  },
  emptyTxt: {
    marginTop: 40,
    textAlign: 'center',
  }
});


export default AddressesScreen