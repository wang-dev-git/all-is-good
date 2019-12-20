import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Keyboard, Text, View, TextInput, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { FadeInView } from '../Reusable'

import { Actions } from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'

interface Props {
  query: string;

  onChange: (query: string) => void;
  onFilters: () => void;
  onClear: () => void;
}
const SearchBar: React.FC<Props> = (props) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Rechercher..."
          style={styles.searchInput}
          value={props.query}
          onChange={(evt) => props.onChange(evt.nativeEvent.text)}
          autoCorrect={false}
          />
        <View style={styles.searchIcon}>
          <Icon name="search" color={mainStyle.themeColor} size={16} />
        </View>
        <TouchableOpacity style={styles.filtersIcon} onPress={() => props.onFilters()}>
          <Icon name="cog" color={'#fff'} size={16} />
        </TouchableOpacity>
        { props.query.length > 0 &&
          <TouchableOpacity style={styles.clearIcon} onPress={() => props.onClear()}>
            <Icon name="close" color={mainStyle.lightColor} size={12} />
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

const barHeight = 40
const searchBarMargin = 20
const styles = StyleSheet.create({
  container: {
    height: barHeight / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: mainStyle.themeColor,

    zIndex: 100,
  },
  searchBar: {
    marginTop: 20,

    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,

    width: Dimensions.get('window').width - searchBarMargin * 2,
    height: barHeight,
  },
  searchIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,

    width: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersIcon: {
    position: 'absolute',
    top: 1,
    right: 1,
    bottom: 1,

    backgroundColor: mainStyle.themeColor,
    borderRadius: (barHeight - 2) / 2,
    height: (barHeight - 2),
    width: (barHeight - 2),

    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    right: barHeight + 2,
    bottom: 0,

    width: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: barHeight / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',

    paddingLeft: 40,
    paddingRight: 55,
  },
});

export default SearchBar