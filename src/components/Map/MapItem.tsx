import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage } from '../Reusable'
import { Fire, Flash } from '../../services'

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
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.shadow]}>
          <View style={styles.content}>

            <View style={styles.picture}>
              <AssetImage src={pro.pictures ? {uri: pro.pictures[0]} : require('../../images/user.png')} resizeMode='cover' />
            </View>

            <View style={styles.info}>
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <Text numberOfLines={1} style={styles.name}>{name}</Text>
                <View style={styles.row}>
                  <View style={styles.icon}>
                    <MaterialIcon size={18} color='#fff' name="map-marker" />  
                  </View>
                  <Text style={[styles.open]}>4 km</Text> 
                </View> 
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
    marginVertical: 12,
    marginHorizontal: 10,

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
    height: 120,
  },
  info: {
    padding: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
});

const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(MapItem)