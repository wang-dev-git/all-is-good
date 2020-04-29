import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Keyboard, Text, Image, FlatList, View, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, StatusBar, Dimensions, TextInput } from 'react-native';

import { Fire, Modal, Tools } from '../../services'

import { Actions } from 'react-native-router-flux'

import SearchBar from '../Search/SearchBar'
import MapItem from './MapItem'
import MapBubble from './MapBubble'
import FiltersModal from '../Search/FiltersModal'

import { HeaderBar, FadeInView } from '../Reusable'

import Icon from '@expo/vector-icons/FontAwesome'
import AntIcon from '@expo/vector-icons/AntDesign'

import useAddresses from './addresses.hook'

import { mainStyle } from '../../styles'

interface Props {
  selected: any;
  onSelect: (address: any) => void;
}
const AddressesScreen: React.FC<Props> = (props) => {
  
  const [search, setSearch] = React.useState('')
  const [selectedAddress, selectAddress] = React.useState(null)
  const { addresses, clearAddresses } = useAddresses(search)
  
  const lang = useSelector(state => state.langReducer.lang)

  const renderAddress = (address: any) => {
    return (
      <TouchableOpacity style={styles.address} onPress={() => {props.onSelect(address); Actions.pop()}}>
        <Text style={styles.addressTxt}>{address.formatted_address}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <HeaderBar
          title={lang.ADDRESSES_TITLE}
          back
          />
        <View>
          <TextInput
            value={search}
            style={styles.search}
            placeholder={props.selected ? props.selected.formatted_address : lang.ADDRESSES_PLACEHOLDER}
            onChange={(evt) => setSearch(evt.nativeEvent.text)}
            />
          { search.length > 0 &&
            <TouchableOpacity style={styles.clearIcon} onPress={() => setSearch('')}>
              <AntIcon name="close" color='#000' size={16} />
            </TouchableOpacity>
          }
        </View>
        <FlatList
          data={addresses}
          contentContainerStyle={{paddingBottom: 20, paddingTop: 50,}}
          renderItem={({ item }) => renderAddress(item)}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyTxt}>{lang.ADDRESSES_EMPTY}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          />
      </View>
    </TouchableWithoutFeedback>
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
  empty: {
    alignItems: 'center',
  },
  emptyTxt: {
    textAlign: 'center',
  }
});


export default AddressesScreen