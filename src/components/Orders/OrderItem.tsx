import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage } from '../Reusable'
import { Fire, Flash } from '../../services'

import { switchTab } from '../../actions/tab.action'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntIcon from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'

import { mainStyle } from '../../styles'
import Collapsible from 'react-native-collapsible'

import OrderStatus from '../../types/order_status'

interface Props {
  order: any;

  onPress?: () => void;
}
const OrderItem: React.FC<Props> = (props: Props) => {
  
  const { order, onPress } = props

  const lang = useSelector(state => state.langReducer.lang)
  const langId = useSelector(state => state.langReducer.langId)
  const pro = order.pro || {}
  const name = pro.name.length > 22 ? (pro.name.substr(0, 18) + '...') : pro.name
  const [shown, setShown] = React.useState(false)

  const getStatus = () => {
    switch (order.status || OrderStatus.ORDER_PENDING) {
      case OrderStatus.ORDER_PENDING:
        return lang.ORDER_WAITING
        break;

      case OrderStatus.ORDER_PREPARING:
        return lang.ORDER_PREPARING
        break;

      case OrderStatus.ORDER_READY_TO_TAKE:
        return lang.ORDER_PICK_UP_READY
        break;

      case OrderStatus.ORDER_DELIVERING:
        return lang.ORDER_DELIVERING
        break;

      case OrderStatus.ORDER_DELIVERED:
        return lang.ORDER_DELIVERED
        break;

      case OrderStatus.ORDER_CANCELED_BY_PRO, OrderStatus.ORDER_CANCELED_BY_USER:
        return lang.ORDER_CANCELLED
        break;
    }
  }

  return (
    <TouchableOpacity onPress={() => setShown(!shown)}>
      <View style={styles.container}>
        <View style={[styles.shadow]}>
          <View style={styles.content}>

            <View style={styles.picture}>
              <AssetImage src={pro.picture ? {uri: pro.picture} : require('../../images/user.png')} resizeMode='cover' />
            </View>

            <View style={styles.infoWrapper}>
              <View style={styles.info}>
                <Text numberOfLines={1} style={styles.name}>{name}</Text>
                <View style={styles.row}>
                  <View style={styles.icon}>
                    <AntIcon size={14} name="clockcircle" />
                  </View>
                  <Text style={[styles.open]}> {getStatus()}</Text>
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
            
            <Collapsible collapsed={!shown}>
              <Text>Hello</Text>
            </Collapsible>
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
    marginRight: 12,
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    ...mainStyle.circle(52),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoWrapper: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    padding: 10,
  },
  name: {
    ...mainStyle.montBold,
    fontSize: 20,
    marginLeft: 6,
    marginRight: 12,
    marginBottom: 4,
    color: mainStyle.darkColor
  },
  open: {
    ...mainStyle.montText,
    fontSize: 13,
    color: mainStyle.darkColor,
  },
  row: {
    marginTop: 4,
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