import React from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'

interface CategoryProps {
  category: any;
  index: number;
}
const CategoryItem: React.FC<CategoryProps> = (props) => {
  return (
    <View style={[styles.container, props.index % 2 == 0 ? {paddingRight: 1} : {paddingLeft: 1}]}>
      <ImageBackground style={{flex: 1}} source={props.category.picture}>
        <View style={styles.veil}>
          <Text style={styles.title}>{props.category.name}</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

const width = Dimensions.get('window').width / 2
const styles = StyleSheet.create({
  container: {
    width: width,
    height: width,
    marginBottom: 1,
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