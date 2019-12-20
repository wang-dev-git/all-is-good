import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, FadeInView, BottomButton, AssetImage, VeilView } from '../Reusable'
import { Fire } from '../../services'
import { Searchbar } from 'react-native-paper'
import { Actions } from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Icon from '@expo/vector-icons/FontAwesome'

import ProItem from '../Pros/ProItem'

import { mainStyle } from '../../styles'

import { saveFilters } from '../../actions/filters.action'

import { types, subtypes } from '../../filters'

interface Props {
  loading: boolean;
  filters: any;

  saveFilters: (filters: any) => void;
}
const SearchScreen: React.FC<Props> = (props) => {
  const [query, setQuery] = React.useState('')

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Rechercher"
        />
      <View style={styles.searchContainer}>
        <View style={styles.searchBackground}></View>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Rechercher..."
            style={styles.searchInput}
            value={query}
            onChange={(evt) => setQuery(evt.nativeEvent.text)}
            autoCorrect={false}
            />
          <View style={styles.searchIcon}>
            <Icon name="search" color={mainStyle.themeColor} size={16} />
          </View>
          <View style={styles.filtersIcon}>
            <Icon name="cog" color={'#fff'} size={16} />
          </View>
        </View>
      </View>
      <FadeInView style={styles.content}>
        <FlatList
          data={[]}
          renderItem={({ item }) =>
            <ProItem
              pro={item}
              onPress={() => Actions.pro({ pro: item })}
              />
          }

          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text>Aucun résultat</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          />
      </FadeInView>
    </View>
  )
}

const searchBarHeight = 40
const searchBarMargin = 20
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBackground: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: mainStyle.themeColor,
    height: 30,
  },
  searchBar: {

    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    borderRadius: (searchBarHeight - 2) / 2,
    height: (searchBarHeight - 2),
    width: (searchBarHeight - 2),

    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    width: Dimensions.get('window').width - searchBarMargin * 2,
    height: searchBarHeight,
    backgroundColor: '#fff',
    borderRadius: searchBarHeight / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',

    paddingLeft: 40,
    paddingRight: 55,
  },
  content: {
    flex: 1,
  },
  empty: {
    flex: 1,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


const mapStateToProps = (state: any) => ({
  filters: state.filtersReducer.filters,
  toggle: state.filtersReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  saveFilters: (filters: any) => dispatch(saveFilters(filters)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)