import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, AssetImage } from '../Reusable'
import { Fire } from '../../services'

import { Searchbar } from 'react-native-paper'

import { Actions } from 'react-native-router-flux'

import CategoryLink from './CategoryLink'

import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'

type Props = {
  title: string;
  data: any[];
  category: 'brands' | 'sizes' | 'colors' | 'shoes' | 'states';
  
  selectedIds: any[];
  multi?: boolean;
  search?: boolean;

  onSelectedChanged: (selectedIds: any[]) => any;
}
type State = {
  ids: any[]
  query: string;
  currentData: any[];
}

export default class CategoryScreen extends React.Component<Props, State>  {

  constructor(props) {
    super(props)

    const copiedData = [].concat(props.data)
    this.state = {
      query: '',
      ids: this.props.selectedIds,
      currentData: copiedData,
    }
  }

  selectItem(item: any) {
    const { multi, onSelectedChanged } = this.props
    let curr = this.state.ids
    if (!multi) {
      if (curr && curr.length > 0 && curr[0] == item.key)
        curr = []
      else
        curr = [item.key]
    }
    else {
      if (!curr)
        curr = [item.key]
      else {
        const idx = curr.indexOf(item.key)
        if (idx == -1)
          curr.push(item.key)
        else
          curr.splice(idx, 1)
      }
    }
    this.setState({ ids: curr })
    onSelectedChanged(curr)
  }

  isSelected(item) {
    for (const id of this.state.ids) {
      if (id == item.key)
        return true
    }
    return false
  }

  search(query: string) {
    const { data, category } = this.props
    if (query == '') {
      this.setState({ query: '', currentData: data })
      return
    }
    const newData: any[] = []
    for (let i = 0; i < data.length; ++i) {
      const value = data[i].value
      if (value.toLowerCase().includes(query.toLowerCase())) {
        newData.push(data[i])
      }
    }
    this.setState({ query: query, currentData: newData });
  }

  renderItem(item: any, index: number) {
    const { category } = this.props
    const selected = this.isSelected(item)
    return item.key == 'SUBCAT' ? (
      <View style={styles.subcat}>
        <Text style={styles.subcatTxt}>{item.value}</Text>
      </View>
    ) : (
      <TouchableOpacity onPress={() => this.selectItem(item)}>
        <View style={styles.item}>
          <View style={[mainStyle.row, {flex: 1, marginRight: 6, overflow: 'hidden'}]}>
            { category !== 'packSizes' &&
              <View style={styles.rowPicture}>
                { category == 'brands' ? (
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>{item.value.substr(0, 1).toUpperCase()}</Text>
                  </View>
                ) : category == 'colors' ? (
                  <View style={{flex: 1, backgroundColor: item.value}}></View>
                ) : (category == 'sizes' || category == 'shoes') ? (
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>{item.value}</Text>
                  </View>
                ) : category == 'states' ? (
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>{item.value.substr(0, 2).toUpperCase()}</Text>
                  </View>
                ) : (null)}
              </View>
            }
            { category == 'colors' ? (
              <Text style={styles.rowTxt}>{item.name}</Text>
            ) : (category == 'sizes' || category == 'shoes') ? (
              <Text style={styles.rowTxt}>Taille {item.value}</Text>
            ) : (
              <Text style={styles.rowTxt}>{item.value}</Text>
            )}
          </View>

          <View style={styles.box}>
            { selected &&
              <Icon name="check" size={22} color={mainStyle.themeColor} />
            }
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  createBrand() {
    const { query } = this.state
    this.props.onSelectedChanged([query])
    Actions.pop()
  }

  render() {
    const { title, search, category } = this.props
    const { query, currentData } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title={title}
          back
          />

          { search &&
            <Searchbar
              placeholder="Search"
              onChangeText={(query: string) => this.search(query)}
              value={query}
            />
          }
          
          { category === 'brands' && search && (currentData || []).length === 0 && query != '' &&
            <TouchableOpacity style={styles.addBrand} onPress={() => this.createBrand()}>
              <Text style={styles.addBrandTxt}>Choisir cette marque: "{query}"</Text>
            </TouchableOpacity>
          }

          <FlatList
            contentContainerStyle={{paddingBottom: 150}}
            data={currentData || []}
            renderItem={({ item, index }) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            />

          { (currentData || []).length > 0 &&
            <View style={[mainStyle.abs, styles.bottom]}>
              <BottomButton
                title={'Valider mon choix'}
                backgroundColor={mainStyle.themeColor}

                onPress={Actions.pop}
                />
            </View>
          }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subcat: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingRight: 20,
    paddingLeft: 20,
  },
  subcatTxt: {
    ...mainStyle.montBold,
    fontSize: 18,
    color: '#333',
  },
  addBrand: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  addBrandTxt: {
    ...mainStyle.montLight,
    textAlign: 'center'
  },
  item: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingRight: 20,
    paddingLeft: 20,
  },
  rowPicture: {
    ...mainStyle.circle(50),
    borderWidth: 1,
    borderColor: '#ddd'
  },
  rowTxt: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: 'bold',
    color: mainStyle.darkColor,
  },
  box: {
    ...mainStyle.circle(40),
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingTop: 20,
    paddingBottom: 20,
    top: undefined, 
  }
});