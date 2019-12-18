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
  fixed?: boolean;

  onSelectItem: (idx: number, item: any) => void;
}
type State = {

}

export default class FiltersList extends React.Component<Props, State>  {
  
  renderItem(index: number, item: any) {
    const { selectedIds, fixed } = this.props
    const isSelected = selectedIds.indexOf(item.key) != -1

    if (item.key === 'SUBCAT')
      return (null)

    return (
      <TouchableOpacity onPress={() => this.props.onSelectItem(index, item)}>
        <View style={[styles.box, isSelected ? styles.boxSelected : {}, fixed ? {width: boxSize} : {}]}>
          <Text style={[styles.boxTxt, isSelected ? styles.boxTxtSelected : {}]}>{item.value}</Text>
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
    borderColor: mainStyle.themeColor,
    height: boxSize,
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 20,

    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  boxSelected: {
    backgroundColor: mainStyle.themeColor
  },

  boxTxt: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 13,
  },
  boxTxtSelected: {
    color: '#fff',
  },
});
