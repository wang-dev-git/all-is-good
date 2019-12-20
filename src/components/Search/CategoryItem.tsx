import React from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'

interface CategoryProps {
  category: any;
}
const CategoryItem: React.FC<CategoryProps> = (props) => {
  return (
    <ImageBackground style={styles.container} source={props.category.picture}>
      <View style={styles.veil}>
        <Text style={styles.title}>{props.category.name}</Text>
      </View>
    </ImageBackground>
  )
}

const width = Dimensions.get('window').width / 2
const styles = StyleSheet.create({
  container: {
    width: width,
    height: width
  },
  veil: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...mainStyle.montBold,
    fontSize: 14,
    color: '#fff'
  }
});

export default CategoryItem