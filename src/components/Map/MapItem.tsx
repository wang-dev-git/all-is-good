import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage, MyText } from '../Reusable'
import { Fire, Flash, Tools } from '../../services'

import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntIcon from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'

import { mainStyle } from '../../styles'

interface Props {
  pro: any;

  onPress: () => void;
}
const MapItem: React.FC<Props> = (props: Props) => {
  
  const { pro, onPress } = props
  const name = pro.name && pro.name.length > 22 ? (pro.name.substr(0, 18) + '...') : pro.name
  const distance = pro.distance
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.shadow]}>
          <View style={styles.content}>

            <View style={styles.picture}>
              <AssetImage src={pro.picture ? {uri: pro.picture} : require('../../images/noimage.png')} resizeMode='cover' />
            </View>

            <View style={styles.info}>
              <View style={[]}>
                <MyText numberOfLines={1} style={styles.name}>{name}</MyText>
                <View style={styles.row}>
                  <View style={styles.icon}>
                    <MaterialIcon size={18} color='#fff' name="map-marker" />  
                  </View>
                  <MyText style={[styles.open]}>{distance} km</MyText> 
                </View> 
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const width = 220
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  shadow: {
    width: width,
    marginVertical: 6,
    marginHorizontal: 6,

    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picture: {
    height: 84,
  },
  info: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: mainStyle.themeColor,
  },
  name: {
    ...mainStyle.montBold,
    fontSize: 16,
    color: '#fff'
  },
  open: {
    ...mainStyle.montText,
    fontSize: 13,
    color: '#fff',
  },
  row: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    marginLeft: -2,
  },
});

export default MapItem