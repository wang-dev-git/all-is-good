import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, FadeInView, BottomButton, AssetImage, VeilView } from '../Reusable'
import { Fire } from '../../services'
import { Searchbar } from 'react-native-paper'
import { Actions } from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import FiltersScreen from '../Filters/FiltersScreen'

import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'

import { saveFilters } from '../../actions/filters.action'

import { types, subtypes } from '../../filters'

interface Props {
  loading: boolean;
  query: string;
  filters: any;

  saveFilters: (filters: any) => void;
}
interface State {
  category: string;
  subcategory: string;
  forcedShow: boolean;
}

class SearchScreen extends React.Component<Props, State>  {

  state = {
    category: 'women',
    subcategory: '',
    forcedShow: false,
  }

  constructor(props) {
    super(props)

  }

  selectCategory(key: string) {
    this.setState({ category: key })
  }

  async selectSubcategory(key: any) {
    const { filters, saveFilters } = this.props
    this.setState({ subcategory: key })
    filters.type = this.state.category
    filters.subtype = key
    saveFilters(filters)
  }

  async search(query: string) {
    const { filters } = this.props
    filters.search = query
    this.props.saveFilters(filters)
    this.setState({ forcedShow: false })
  }

  backToCategories() {
    if (this.state.subcategory) {
      const { filters, saveFilters } = this.props
      filters.type = ''
      filters.subtype = ''
      saveFilters(filters)
      this.setState({ subcategory: '', forcedShow: false })
    }
  }

  renderCategory(item: any, index: number) {
    const selected = this.state.category == item.key
    return (
      <TouchableOpacity onPress={() => this.selectCategory(item.key)}>
        <View style={[styles.category, selected ? styles.categorySelected : {}]}>
          <Text style={[styles.categoryTxt, selected ? styles.categoryTxtSelected : {}]}>{item.title.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderSubcategory(item: any, index: number) {

    return (
      <TouchableOpacity onPress={() => this.selectSubcategory(item.key)}>
        <View style={[styles.subcategory, index % 2 != 0 ? { marginLeft: 1 } : {}]}>
          <View style={[mainStyle.abs, {backgroundColor: item.color}]}></View>
          <View style={styles.subPicture}>
            <AssetImage src={item.image} resizeMode='cover' />
          </View>
          <Text style={styles.subTxt}>{item.title.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  makeFilteredSearch() {
    //this.setState({ forcedShow: true })
    this.setState({ category: 'women' })
  }

  render() {
    const { category, subcategory, forcedShow } = this.state
    const { query, loading } = this.props
    return (
      <View style={styles.container}>
        <Searchbar
          autoCorrect={false}
          placeholder="Rechercher un article..."
          onChangeText={(query: string) => this.search(query)}
          value={query}
          style={styles.searchbar}
          icon={subcategory == '' ? undefined : 'chevron-left'}
          onIconPress={() => this.backToCategories()}
        />
        
        <FadeInView style={styles.content}>
          { (query == '' && subcategory == '' && !forcedShow) ? (
            <View style={[styles.content, {marginTop: 20}]}>
              { /* Categories */ }
              <FlatList
                style={{flexGrow: 0}}
                data={types}
                renderItem={({ item, index }) => this.renderCategory(item, index)}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                />

              { category != 'filters' ? (
                <FlatList
                  style={{flexGrow: 1,}}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  contentContainerStyle={{paddingTop: 30}}
                  data={subtypes[this.state.category]}
                  renderItem={({ item, index }) => this.renderSubcategory(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                  />
              ) : (
                <FiltersScreen
                  onReady={() => this.makeFilteredSearch()}
                  />
              )}
            </View>

          ) : (
            <View style={styles.content}>
              
              { /* Results */ }
              
            </View>
          )}
        </FadeInView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  searchbar: {
    ...ifIphoneX({
      paddingTop: 44

    }, {
      paddingTop: 14
    }),
  },
  category: {
    width: 90,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#eee',
  },
  categorySelected: {
    borderBottomColor: '#545051',
  },
  categoryTxt: {
    fontSize: 14,
  },
  categoryTxtSelected: {
    fontWeight: 'bold',
  },
  subcategory: {
    width: Dimensions.get('window').width / 2 - 1,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  subPicture: {
    ...mainStyle.abs,
    opacity: 0.45,
  },
  subTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  }
});


const mapStateToProps = (state: any) => ({
  query: state.filtersReducer.filters.search,
  filters: state.filtersReducer.filters,
  toggle: state.filtersReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  saveFilters: (filters: any) => dispatch(saveFilters(filters)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)