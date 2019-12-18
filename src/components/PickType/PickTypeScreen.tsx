import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, AssetImage } from '../Reusable'
import { Fire } from '../../services'

import { Actions } from 'react-native-router-flux'

import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'
import { types, subtypes } from '../../filters'

type Props = {
  category: string;

  onSelect: (type: string, subtype: string) => void;
}
type State = {
}

export default class PickTypeScreen extends React.Component<Props, State>  {

  selectItem(item: any) {
    const { category, onSelect } = this.props
    if (category == 'types') {
      Actions.pickType({
        category: item.key,

        onSelect: (type: string, subtype: string) => {
          onSelect(type, subtype)
          Actions.pop()
          Actions.pop()
        }
      })
    } else {
      onSelect(category, item.key)
    }
  }

  renderItem(item: any, index: number) {
    const { category } = this.props
    if (item.key == 'filters')
      return (null)
    return (
      <TouchableOpacity onPress={() => this.selectItem(item)}>
        <View style={styles.item}>
          <View style={mainStyle.row}>
            <View style={styles.rowPicture}>
              <View style={{flex: 1, margin: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd'}}>
                <Text>{item.title.substr(0, 1).toUpperCase()}</Text>
              </View>  
            </View>
            <Text style={styles.rowTxt}>{item.title}</Text>
          </View>
          { category == 'types' ? (
            <Icon name="chevron-right" size={16} color={mainStyle.darkColor} />
          ) : (
            <Icon name="check" size={16} color={mainStyle.darkColor} />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { category } = this.props
    return (
      <View style={styles.container}>
        <HeaderBar
          title={'Choisissez la catégorie'}
          back
          />
          
          <FlatList
            contentContainerStyle={{paddingBottom: 20}}
            data={category == 'types' ? types : subtypes[category]}
            renderItem={({ item, index }) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});