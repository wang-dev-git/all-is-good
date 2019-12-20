import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, FadeInView, BottomButton, AssetImage, VeilView } from '../Reusable'
import { Fire } from '../../services'
import { Searchbar } from 'react-native-paper'
import { Actions } from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Icon from '@expo/vector-icons/FontAwesome'

import ProItem from '../Pros/ProItem'
import CategoryItem from './CategoryItem'

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
  const [pros, setPros] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const fetch = async () => {
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
    fetch()
  }, [query])

  const categories = [
    {
      name: 'Restaurant',
      picture: require('../../images/cooker.png'),
    },
    {
      name: 'Sushis',
      picture: require('../../images/cooker.png'),
    },
    {
      name: 'Burgers',
      picture: require('../../images/cooker.png'),
    },
    {
      name: 'Veggie',
      picture: require('../../images/cooker.png'),
    }
  ]

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Rechercher"
        />
      <View style={styles.searchContainer}>
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
        { query !== '' ? (
          <FlatList
            data={pros}
            contentContainerStyle={{paddingBottom: 20, paddingTop: 60,}}
            renderItem={({ item }) =>
              <ProItem
                pro={item}
                onPress={() => Actions.pro({ pro: item })}
                />
            }

            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Text>{loading ? 'Chargement ...' : 'Aucun résultat' }</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        ) : (
          <FlatList
            data={categories}
            contentContainerStyle={{paddingBottom: 20, paddingTop: 60, flexWrap: 'wrap', flexDirection: 'row'}}
            renderItem={({ item }) => <CategoryItem category={item} />}

            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Text>{loading ? 'Chargement ...' : 'Aucun résultat' }</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        )}
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
    height: searchBarHeight / 2,
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
    height: searchBarHeight,
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
    flex: 1,
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