import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';

import { AssetImage } from '../Reusable'
import { Fire, Flash, Tools } from '../../services'

import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntIcon from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'

import { mainStyle } from '../../styles'

interface Props {
  pro: any;
  currentPos: any;

  onPress: () => void;
}
const MapItem: React.FC<Props> = (props: Props) => {
  
  const { pro, currentPos, onPress } = props
  const name = pro.name && pro.name.length > 22 ? (pro.name.substr(0, 18) + '...') : pro.name
  const distance = Math.floor(Tools.getDistance(pro.lat, pro.lng, currentPos.lat, currentPos.lng))
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.info}>
          <View style={{}}>
            <Text numberOfLines={1} style={styles.name}>{name}</Text>
          </View>
        </View>
        <View style={[styles.shadow]}>
          <ImageBackground source={pro.pictures ? {uri: pro.pictures[0]} : require('../../images/user.png')} resizeMode='cover' style={styles.picture}>
            <View style={{ position: 'absolute', flex: 1, top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
              <View style={styles.icon}>
                <MaterialIcon size={18} color='#fff' name="map-marker" />  
              </View>
              <Text style={[styles.open]}>{distance} km</Text> 
            </View>
          </ImageBackground>
          
        </View>
      </View>
    </TouchableOpacity>
  );
}

const width = 140
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  shadow: {
    marginVertical: 12,
    marginHorizontal: 10,

    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  picture: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    overflow: 'hidden',
  },
  info: {

  },
  name: {
    ...mainStyle.montBold,
    fontSize: 16,
    color: '#333',
    marginBottom: 0,
  },
  open: {
    ...mainStyle.montBold,
    fontSize: 13,
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 3,
  },
});

const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(MapItem)