import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';

import { Fire } from '../../services'
import { saveFilters } from '../../actions/filters.action'

import { mainStyle } from '../../styles'

type Props = {
  title: string;
  selectedIds: any[];
  data: any[];

  onSelectItem: (idx: number, item: any) => void;
}
type State = {

}

export default class ColorsList extends React.Component<Props, State>  {
  
  renderItem(index: number, item: any) {
    const { selectedIds, onSelectItem } = this.props
    const selected = selectedIds.indexOf(item.key) != -1
    return (
      <TouchableOpacity onPress={() => onSelectItem(index, item)}>
        <View
          style={[
            styles.box,
            { backgroundColor: item.value },
            selected ? {borderWidth: 5, borderColor: mainStyle.themeColor} : {borderWidth: 1, borderColor: '#ddd'}
          ]}>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { title, data } = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <FlatList
          data={data}
          contentContainerStyle={{paddingRight: 20}}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({item, index}) => this.renderItem(index, item)}
          />
      </View>
    );
  }
}

const boxSize = 60
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingBottom: 15,
  },
  box: {
    ...mainStyle.circle(boxSize),
    marginLeft: 20,
  },
});
