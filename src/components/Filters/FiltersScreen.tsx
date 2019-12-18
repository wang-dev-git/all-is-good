import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { BottomButton, HeaderBar } from '../Reusable'

import FilterList from './FilterList'
import ColorsList from './ColorsList'

import Slider from "react-native-slider-custom"

import { Fire } from '../../services'
import { switchTab } from '../../actions/tab.action'
import { saveFilters } from '../../actions/filters.action'
import { Actions } from 'react-native-router-flux'

import CategoryLink from '../Category/CategoryLink'

import { sortings, brands, sizes, shoes, states, colors } from '../../filters'

import { mainStyle } from '../../styles'

type Props = {
  selectedFilters: any;

  onReady: () => void;
  switchTab: (tab: number) => void;
  saveFilters: (filters: any) => void;
}
type State = {
  filters: any;
  price_max: number;
}

const MAX_PRICE = 1000
class FiltersScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    //alert(JSON.stringify(props.selectedFilters))

    const price = props.selectedFilters.price_max

    this.state = {
      price_max: (price || price === 0) ? price : MAX_PRICE,
      filters: props.selectedFilters
    }
  }

  onSelectItem(key: string, idx: number, item: any) {
    const { filters } = this.state
    if (key == 'sorting') {
      // Only one choice allowed
      filters.sorting = item.key
    } else {
      // Multiple choices allowed
      if (!filters[key])
        filters[key] = []

      const idx = filters[key].indexOf(item.key)
      if (idx == -1)
        filters[key].push(item.key)
      else
        filters[key].splice(idx, 1)
    }

    this.save(filters)
  }

  save(filters: any) {
    this.setState({ filters })
    this.props.saveFilters(filters)
  }

  onSelectBudget(price: number) {
    const { filters } = this.state
    const budget = Number(price.toFixed(0))
    filters.price_max = budget
    this.setState({ price_max: budget })
    this.save(filters)
  }

  redirect() {
    const { onReady } = this.props
    onReady()
  }

  showBrands() {
    const cat: any = {
      title: 'Marques',
      key: 'brands',
      data: brands,
    }
    Actions.category({
      title: cat.title,
      category: cat.key,
      data: cat.data,
      multi: cat.multi || false,
      selectedIds: this.state.filters.brands || [],
      search: cat.key == 'brands',

      onSelectedChanged: (changedIds: any[], item) => {
        const { filters } = this.state
        filters.brands = changedIds
        this.save(filters)
      }
    })
  }

  getSelectedValueForBrands() {
    const cat: any = {
      title: 'Marques',
      key: 'brands',
      data: brands,
    }
    const selected = this.state.filters.brands
    if (selected && selected.length > 0) {
      let value = ''
      for (let i = 0; i < selected.length; ++i) {
        const selectedKey = selected[i]
        if (i != 0)
          value += ', '
        for (const obj of cat.data) {
          if (obj.key == selectedKey) {
            value += obj.value
          }
        }
      }
      return value
    }
    return ''
  }

  render() {
    const { filters, price_max } = this.state

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
          <FilterList
            title='Trier par'
            selectedIds={filters.sorting ? [filters.sorting] : []}
            data={sortings}
            onSelectItem={(idx: number, item: any) => this.onSelectItem('sorting', idx, item)}
            />

          <View style={styles.budgetWrapper}>
            <Text style={styles.budgetTxt}>Votre budget: {price_max}€{price_max === MAX_PRICE ? '(+)' : ''}</Text>
            <Slider
              value={price_max}
              onValueChange={(value: number) => this.onSelectBudget(value)}
              minimumValue={0}
              maximumValue={MAX_PRICE}
              thumbTintColor='#fff'
              thumbStyle={{borderWidth: 1, borderColor: mainStyle.themeColor, ...mainStyle.circle(36)}}
              minimumTrackTintColor={mainStyle.themeColor}
              maximumTrackTintColor={mainStyle.themeColor}
            />
            <View style={styles.budgetIndicator}>
              <Text>0€</Text>
              <Text>{MAX_PRICE}€(+)</Text>
            </View>
          </View>

          <FilterList
            title='Taille'
            selectedIds={filters.sizes || []}
            data={sizes}
            fixed
            onSelectItem={(idx: number, item: any) => this.onSelectItem('sizes', idx, item)}
            />

          <FilterList
            title='Pointure'
            fixed
            selectedIds={filters.shoes || []}
            data={shoes}
            onSelectItem={(idx: number, item: any) => this.onSelectItem('shoes', idx, item)}
            />

          <FilterList
            title={'é'.toUpperCase() + 'tat'}
            selectedIds={filters.states || []}
            data={states}
            onSelectItem={(idx: number, item: any) => this.onSelectItem('states', idx, item)}
            />

          <View style={{borderTopWidth: 1, borderTopColor: '#ddd', marginTop: 20,}}>
            <CategoryLink
              title={'Marques'}
              value={this.getSelectedValueForBrands()}
              right
              onPress={() => this.showBrands()}
              />
          </View>

          <ColorsList
            title='Couleurs'
            selectedIds={filters.colors || []}
            data={colors}
            onSelectItem={(idx: number, item: any) => this.onSelectItem('colors', idx, item)}
            />

          <BottomButton
            style={{ marginTop: 40 }}
            backgroundColor={mainStyle.themeColor}
            title='Voir les résultats'
            onPress={() => this.redirect()}
            />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  budgetWrapper: {
    padding: 20,
    paddingBottom: 0
  },
  budgetTxt: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  budgetIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = (state: any) => ({
  selectedFilters: state.filtersReducer.filters,
  toggle: state.filtersReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  saveFilters: (filters: any) => dispatch(saveFilters(filters)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FiltersScreen)

