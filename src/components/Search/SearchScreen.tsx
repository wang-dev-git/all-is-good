import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Keyboard, Text, View, TextInput, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, FadeInView, BottomButton, AssetImage, VeilView } from '../Reusable'
import { Fire, Modal } from '../../services'

import { Actions } from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Icon from '@expo/vector-icons/FontAwesome'

import ProItem from '../Pros/ProItem'
import CategoryItem from './CategoryItem'
import FiltersModal from './FiltersModal'
import SearchBar from './SearchBar'

import { mainStyle } from '../../styles'

import { searchByName, saveFilters } from '../../actions/filters.action'

interface Props {
  loading: boolean;
  filters: any;

  saveFilters: (filters: any) => void;
}
const SearchScreen: React.FC<Props> = (props) => {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const searchable = useSelector(state => state.filtersReducer.searchable)
  const categories = useSelector(state => state.filtersReducer.categories)
  const loadingCategories = useSelector(state => state.filtersReducer.loadingCategories)
  const dispatch = useDispatch()

  const refresh = async () => {
    dispatch(searchByName(query))
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
            data={searchable}
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


const mapStateToProps = (state: any) => ({
  filters: state.filtersReducer.filters,
  toggle: state.filtersReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  saveFilters: (filters: any) => dispatch(saveFilters(filters)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)