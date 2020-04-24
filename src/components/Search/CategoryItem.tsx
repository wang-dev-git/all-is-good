import React from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome'

import { TouchableBounce } from '../Reusable'

import { mainStyle } from '../../styles'

interface Props {
  category: any;
  index: number;

  onPress?: () => void;
}
const CategoryItem: React.FC<Props> = (props) => {
  return (
    <View style={styles.shadow}>
      <TouchableBounce width={width} height={width} onPress={props.onPress} style={[styles.container, props.index % 2 == 0 ? {marginLeft: margin, marginRight: margin / 2} : {marginLeft: margin / 2}]}>
        <ImageBackground style={{flex: 1, borderRadius: 2, overflow: 'hidden'}} source={{uri: props.category.picture}}>
          <View style={styles.veil}>
            <Text style={styles.title}>{props.category.name}</Text>
          </View>
        </ImageBackground>
      </TouchableBounce>
    </View>
  )
}

const margin = 10
const marginBottom = 18
const width = (Dimensions.get('window').width / 2) - (margin + margin / 2)
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  container: {
    width: width,
    height: width,
    borderRadius: width / 2,
    borderColor: '#fff',
    borderWidth: 4,
    overflow: 'hidden',
    marginBottom: marginBottom,
    backgroundColor: 'red',
  },
  veil: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.53)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...mainStyle.montBold,
    fontSize: 13,
    color: '#fff',
    textTransform: 'uppercase',
  }
});

export default CategoryItem