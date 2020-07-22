import React from 'react';
import { connect, useSelector } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage, MyText, Rating, VeilView, ProQuantity } from '../Reusable'
import { Fire, Flash, Time, Tools } from '../../services'

import { addWish, removeWish, isInWishes } from '../../actions/wishes.action'
import { switchTab } from '../../actions/tab.action'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntIcon from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'

import { mainStyle } from '../../styles'

interface Props {
  index: number;
  pro: any;
  wishes: any;
  isWish?: boolean;

  switchTab: (tab: number) => void;
  addWish: (pro: any) => void;
  removeWish: (pro: any) => void;
  onPress: () => void;
  isInWishes: (pro: any) => boolean;
}
const ProItem: React.FC<Props> = (props: Props) => {
  
  const lang = useSelector(state => state.langReducer.lang)
  const toggleWish = () => {
    const { addWish, removeWish, pro, isInWishes } = props
    const onPress = () => {
      props.switchTab(3)
      Actions.popTo('tabs')
    }

    if (isInWishes(pro)) {
      removeWish(pro)
      Flash.show(lang.FAVORITE_REMOVED)
    } else {
      addWish(pro)
      Flash.show(lang.FAVORITE_ADDED, lang.FAVORITE_ADDED_SUBTITLE, onPress)
    }
  }

  const { pro, index, onPress, isInWishes } = props
  const inWishes = isInWishes(pro)
  const name = pro.name && pro.name.length > 22 ? (pro.name.substr(0, 18) + '...') : pro.name
  const langId = useSelector(state => state.langReducer.id)
  const opening = Time.getOpenRange(pro, langId)
  const position = useSelector(state => state.authReducer.position)
  const distance = position ? Tools.getDistance(position.geometry.location.lat, position.geometry.location.lng, pro.lat, pro.lng) : null
  const closed = Tools.isClosed(pro)
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container]}>
        <View style={[styles.shadow]}>
          <View style={styles.content}>

            <View style={styles.picture}>
              <AssetImage src={pro.picture ? {uri: pro.picture} : require('../../images/noimage.png')} resizeMode='cover' />
            </View>

            <View style={styles.topWrapper}>
              { !props.isWish &&
                <View style={styles.quantityWrapper}>
                  <ProQuantity pro={pro} />
                </View>
              }

              <TouchableOpacity
                style={styles.wishBtn}
                onPress={() => toggleWish()}>
                { inWishes ? (
                  <AssetImage src={require('../../images/like.png')} />
                ) : (
                  <AssetImage src={require('../../images/like_empty.png')} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.infoWrapper}>
              <View style={styles.info}>
                <MyText numberOfLines={2} style={styles.name}>{name}</MyText>
                <Rating pro={pro} style={{marginLeft: 6, marginBottom: 4}} />
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <View>
                    {!props.isWish && opening !== null &&
                      <View style={styles.row}>
                        <View style={styles.icon}>
                          <AntIcon size={14} name="clockcircle" />
                        </View>
                        <MyText style={[styles.open]}> {lang.GLOBAL_TODAY} {opening}</MyText>
                      </View>
                    }

                    { distance !== null &&
                      <View style={styles.row}>
                        <View style={styles.icon}>
                          <MaterialIcon size={18} name="map-marker" />  
                        </View>
                        <MyText style={[styles.open]}>{Tools.showDistance(distance, langId)}</MyText>               
                      </View>
                    }
                  </View>
                  <View style={{alignItems: 'flex-end', paddingRight: 10,}}>
                    { pro.initial_price !== undefined &&
                      <MyText style={[styles.oldPrice]}>{Number(pro.initial_price).toFixed(2)}$</MyText>
                    }
                    <MyText style={styles.price}>{Number(pro.price).toFixed(2)}$</MyText>
                  </View>
                </View>
              </View>

              <View style={styles.logoWrapper}>
                <View style={styles.logo}>
                  <AssetImage src={pro.logo ? {uri: pro.logo} : require('../../images/noimage.png')} resizeMode='cover' />
                </View>
              </View>
            </View>
            {(!pro.quantity || closed) &&
              <VeilView abs start='rgba(0,0,0,0.3)' end='rgba(0,0,0,0.3)' />
            } 
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
    borderColor: '#ddd',
  },
  picture: {
    height: 110,
  },
  logoWrapper: {
    position: 'absolute',
    top: -32,
    right: 8,
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    ...mainStyle.circle(72),
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  infoWrapper: {
    backgroundColor: '#fff',
  },
  info: {
    paddingLeft: 6,
    paddingVertical: 6,
  },

  topWrapper: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityWrapper: {
  },
  wishBtn: {
    width: 28,
    height: 28,
    padding: 3,
  },

  price: {
    ...mainStyle.montBold,
    fontSize: 15,
    height: 26,
  },
  oldPrice: {
    ...mainStyle.montBold,
    fontSize: 15,
    color: '#aaa',
    textDecorationLine: 'line-through'
  },
  name: {
    ...mainStyle.montBold,
    fontSize: 20,
    marginLeft: 6,
    marginRight: 82,
    marginBottom: 2,
    minHeight: 38,
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

const mapStateToProps = (state: any) => ({
  wishes: state.wishesReducer.list,
  wishesToggle: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  addWish: (pro: any) => dispatch(addWish(pro)),
  removeWish: (pro: any) => dispatch(removeWish(pro)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  isInWishes: (pro: any) => dispatch(isInWishes(pro)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProItem)