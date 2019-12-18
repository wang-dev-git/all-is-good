import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage } from '../Reusable'
import { Fire, Flash } from '../../services'

import { addWish, removeWish, isInWishes } from '../../actions/wishes.action'
import { switchTab } from '../../actions/tab.action'
import AntDesign from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'

import { getBrandName } from '../../filters'
import { mainStyle } from '../../styles'

interface Props {
  index: number;
  product: any;
  wishes: any;

  switchTab: (tab: number) => void;
  addWish: (product: any) => void;
  removeWish: (product: any) => void;
  onPress: () => void;
  isInWishes: (product: any) => boolean;
}
const ProductItem: React.FC<Props> = (props: Props) => {
  
  const toggleWish = () => {
    const { addWish, removeWish, product, isInWishes } = props
    const onPress = () => {
      props.switchTab(3)
      Actions.reset('root')
    }

    if (isInWishes(product)) {
      removeWish(product)
      Flash.show('Supprimé des favoris !')
    } else {
      addWish(product)
      Flash.show('Ajouté aux favoris !', 'Cliquez pour voir vos favoris', onPress)
    }
  }

  const getPrice = () => {
    const { product } = props
    const digits = (parseFloat(product.price) - parseInt(product.price)) != 0
    if (digits)
      return Number(product.price).toFixed(2)
    return parseInt(product.price)
  }

  const { product, index, onPress, isInWishes } = props
  const inWishes = isInWishes(product)
  const name = product.name && product.name.length > 22 ? (product.name.substr(0, 18) + '...') : product.name
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.shadow, index % 2 == 0 ? {marginLeft: 14, marginRight: 6} : {marginLeft: 6, marginRight: 14}]}>
          <View style={styles.content}>
            <View style={styles.picture}>
              <AssetImage src={product.pictures ? {uri: product.pictures[0]} : require('../../images/user.png')} resizeMode='cover' />
            </View>
            <View style={styles.info}>
              <View style={[mainStyle.row, { height: 32, justifyContent: 'space-between'}]}>
                <Text numberOfLines={1} style={styles.brand}>{getBrandName(product.brand).toUpperCase()}</Text>
                {product.certified &&
                  <View style={styles.cert}>
                    <AntDesign name="check" size={18} color={mainStyle.greenColor} />
                  </View>
                }
              </View>
              <Text numberOfLines={1} style={styles.name}>{product.size ? product.size + ' - ' : product.shoe ? product.shoe + ' - ' : '38 - '}{name}</Text>
              <View style={styles.row}>
                <Text style={[styles.name, styles.price]}>{getPrice()}€</Text>
               
              </View>
            </View>

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
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width / 2,
  },
  shadow: {
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
    height: 166,
  },

  info: {
    padding: 10,
    backgroundColor: '#fff',
  },
  brand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: mainStyle.darkColor
  },
  name: {
    marginTop: 5,
    fontSize: 13,
    color: mainStyle.darkColor,
  },
  row: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    color: mainStyle.darkColor,
    fontSize: 16,
    paddingBottom: 2,
    flex: 0.8,
  },
  addBtn: {
    width: 82,
    flex: 1.2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: mainStyle.themeColor,

    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 7,
  },
  addBtnTxt: {
    color: '#fff',
    fontSize: 14,
  },
  wishBtn: {
    ...mainStyle.abs,
    bottom: undefined, left: undefined,
    top: 4, right: 4,
    width: 28,
    height: 28,
    padding: 3,
  },
  cert: {
    ...mainStyle.circle(28),
    borderColor: mainStyle.greenColor,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const mapStateToProps = (state: any) => ({
  wishes: state.wishesReducer.list,
  wishesToggle: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  addWish: (product: any) => dispatch(addWish(product)),
  removeWish: (product: any) => dispatch(removeWish(product)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  isInWishes: (product: any) => dispatch(isInWishes(product)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem)