import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Keyboard, Text, View, TextInput, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, FadeInView, BottomButton, AssetImage, VeilView } from '../Reusable'
import { Fire, Modal, Lang } from '../../services'

import { Actions } from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Icon from '@expo/vector-icons/FontAwesome'

import ProItem from '../Pros/ProItem'
import CategoryItem from './CategoryItem'
import FiltersModal from './FiltersModal'
import SearchBar from './SearchBar'

import { mainStyle } from '../../styles'

import { searchByName, saveFilters } from '../../actions/filters.action'

interface Props {}
const SearchScreen: React.FC<Props> = (props) => {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [pros, setPros] = React.useState([])

  const searchable = useSelector(state => state.filtersReducer.searchable)
  const categories = useSelector(state => state.filtersReducer.categories)
  const loadingCategories = useSelector(state => state.filtersReducer.loadingCategories)
  const dispatch = useDispatch()

  const refresh = async () => {
    const filtered = searchable.filter((item) => {
      const nameMatches = item.name && item.name.toLowerCase().includes(query.toLowerCase())
      const typeMatches = item.type && item.type.name.toLowerCase().includes(query.toLowerCase())
      return nameMatches || typeMatches
    })
    setPros(filtered)
  }

  React.useEffect(() => {
    refresh()
  }, [query])

  const showFilters = () => {
    Keyboard.dismiss()
    Modal.show('filters', {
      component: <FiltersModal />,
      onClose: () => refresh()
    })
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Rechercher"
        logo
        />
      <SearchBar
        query={query}
        onChange={setQuery}
        onFilters={showFilters}
        onClear={() => setQuery('')}
        />
      <FadeInView style={styles.content}>
        { query !== '' ? (
          <FlatList
            data={pros}
            contentContainerStyle={{paddingBottom: 20, paddingTop: 50,}}
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
        ) : loadingCategories ? (
          <Text>
            Chargement en cours...
          </Text>
        ) : (
          <View>
            <FlatList
              data={categories}
              numColumns={2}
              contentContainerStyle={{paddingBottom: 20, paddingTop: 50 }}
              renderItem={(item: any) => 
                <CategoryItem
                  index={item.index}
                  category={item.item}
                  onPress={() => setQuery(item.item.name)}
                  />
              }
              ListEmptyComponent={() => (
                <View style={styles.empty}>
                  <Text>{loading ? 'Chargement ...' : '' }</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              />
          </View>
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

export default SearchScreen