import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage } from '../Reusable'
import { Fire, Flash } from '../../services'

import { switchTab } from '../../actions/tab.action'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntIcon from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'

import { getBrandName } from '../../filters'
import { mainStyle } from '../../styles'

interface Props {
  order: any;

  onPress?: () => void;
}
const OrderItem: React.FC<Props> = (props: Props) => {
  
  const { order, onPress } = props
  const pro = order.pro
  const name = pro.name && pro.name.length > 22 ? (pro.name.substr(0, 18) + '...') : pro.name
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.shadow]}>
          <View style={styles.content}>

            <View style={styles.picture}>
              <AssetImage src={pro.pictures ? {uri: pro.pictures[0]} : require('../../images/user.png')} resizeMode='cover' />
            </View>

            <View style={styles.info}>
              <Text numberOfLines={1} style={styles.name}>{name}</Text>
              <View style={styles.row}>
                <View style={styles.icon}>
                  <AntIcon size={14} name="clockcircle" />
                </View>
                <Text style={[styles.open]}> Aujourd'hui 21:40 - 22:05</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.icon}>
                  <MaterialIcon size={18} name="map-marker" />  
                </View>
                <Text style={[styles.open]}>4 km</Text>               
              </View>
            </View>


            <View style={styles.logoWrapper}>
              <View style={styles.logo}>
                <AssetImage src={pro.logo ? {uri: pro.logo} : require('../../images/user.png')} resizeMode='cover' />
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const margin = 20
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  shadow: {
    width: Dimensions.get('window').width - margin * 2,
    marginTop: 18,

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
    height: 110,
  },
  logoWrapper: {
    position: 'absolute',
    top: 95,
    left: 12,

    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    ...mainStyle.circle(42),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  info: {
    padding: 10,
    backgroundColor: '#fff',
  },
  name: {
    ...mainStyle.montBold,
    fontSize: 16,
    marginLeft: 60,
    color: mainStyle.darkColor
  },
  open: {
    ...mainStyle.montText,
    fontSize: 13,
    color: mainStyle.darkColor,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
});


export default OrderItem