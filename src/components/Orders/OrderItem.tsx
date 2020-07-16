import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage, LinkButton, MyText, SmallButton } from '../Reusable'
import { Fire, Flash, Time } from '../../services'

import { switchTab } from '../../actions/tab.action'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntDesign from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'

import { mainStyle } from '../../styles'
import Collapsible from 'react-native-collapsible'

import OrderStatus from '../../types/order_status'

interface Props {
  order: any;
  past: boolean;
  expanded: boolean;
  disabled: boolean;

  onPress?: () => void;
  onCancel?: () => void;
  onRate?: () => void;
}
const OrderItem: React.FC<Props> = (props: Props) => {
  
  const { order, onPress } = props

  const lang = useSelector(state => state.langReducer.lang)
  const langId = useSelector(state => state.langReducer.id)
  const pro = order.pro || {}
  const name = pro.name.length > 22 ? (pro.name.substr(0, 18) + '...') : pro.name

  const getStatus = (item: any) => {
    switch (item.status || OrderStatus.ORDER_PENDING) {
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

  const getHour = (item: any) => {
    const date = Fire.getDateFor(item.date)
    if (langId === 'fr') {
      return Time.moment(date).format('HH:mm')
    }
    return Time.moment(date).format('h:mm A')
  }

  const quantity = order.quantity || 0
  const ref = order.ref || '#A123'
  const history = order.history || []
  const last = history.length ? history[history.length - 1] : null

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.container, props.disabled ? {opacity: 0.2} : {}]}>
        <View style={[styles.shadow]}>
          <View style={styles.content}>

            <View style={styles.picture}>
              <AssetImage src={pro.picture ? {uri: pro.picture} : require('../../images/noimage.png')} resizeMode='cover' />
            </View>

            <View style={styles.infoWrapper}>
              <View style={styles.info}>
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center'}}>
                  <MyText style={styles.quantity}>{lang.ORDER_QUANTITY}: {quantity}</MyText>
                  <MyText style={[styles.quantity, { textAlign: 'right' }]}>{order.price}$</MyText>
                </View>

                <MyText numberOfLines={1} style={styles.name}>{name}</MyText>
                <MyText style={styles.ref}>{ref}</MyText>

                { (props.past && !order.cancelledAt) &&
                  <View style={{alignItems: 'center', marginBottom: 12,}}>
                    { order.rating === undefined ? (
                      <SmallButton
                        title={lang.ORDER_RATE}
                        onPress={props.onRate}
                        />
                    ) : (
                      <View style={{flexDirection: 'row', justifyContent: 'center' }}>
                        {Array(order.rating).fill(0).map((_, index) => (
                          <MyText key={index}><AntDesign name="star" size={22} color={mainStyle.orangeColor} /></MyText>
                        ))}
                      </View>
                    )}
                  </View>
                }
                <MyText style={styles.date}>{Time.date(order.createdAt, langId)}</MyText>

                { last &&
                  <View style={styles.row}>
                    <MyText style={styles.statusTitle}>{getStatus(last)}</MyText>
                    <MyText style={styles.statusTime}>{getHour(last)}</MyText>
                  </View>
                }

                <Collapsible collapsed={!props.expanded}>
                  { history.length > 1 && history.slice(0).reverse().map((item, index) => index !== 0 ? (
                    <View key={index} style={styles.row}>
                      <MyText style={styles.statusTitle}>{getStatus(item)}</MyText>
                      <MyText style={styles.statusTime}>{getHour(item)}</MyText>
                    </View>
                  ) : null) }
                  
                  { !props.past &&
                    <View style={{alignItems: 'center', marginTop: 6,}}>
                      <LinkButton
                        title={lang.ORDER_CANCEL}
                        color={mainStyle.redColor}
                        textStyle={{fontSize: 16}}

                        onPress={props.onCancel}
                        />
                    </View>
                  }
                </Collapsible>
              </View>
            </View>
            
          </View>

          <View style={{position: 'absolute', top: 80, left: 0, right: 0, alignItems: 'center'}}>
            <View style={styles.logoWrapper}>
              <View style={styles.logo}>
                <AssetImage src={pro.logo ? {uri: pro.logo} : require('../../images/noimage.png')} resizeMode='cover' />
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
  date: {
    textAlign: 'center',
    marginBottom: 10,
  },
  logoWrapper: {
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  quantity: {
    fontSize: 15,
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
    flex: 1,
    padding: 10,
  },
  name: {
    ...mainStyle.montText,
    fontSize: 18,
    marginTop: 12,
    textAlign: 'center',
    color: mainStyle.darkColor
  },
  ref: {
    marginTop: 3,
    ...mainStyle.montBold,
    fontSize: 18,
    textAlign: 'center',
    color: mainStyle.darkColor,
    marginBottom: 12,
  },
  statusTitle: {
    ...mainStyle.montBold,
    fontSize: 15,
  },
  open: {
    ...mainStyle.montText,
    fontSize: 13,
    color: mainStyle.darkColor,
  },
  row: {
    paddingHorizontal: 3,
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
});


export default OrderItem