import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome'

import { AssetImage } from '../Reusable'
import { Fire } from '../../services'

import { mainStyle } from '../../styles'
import { getBrandName } from '../../filters'

type Props = {
  product: any;

  onPress: () => void;
  onRemove: () => void;
}
type State = {

}

export default class CartItem extends React.Component<Props, State>  {

  render() {
    const { product, onPress, onRemove } = this.props

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.picture}>
            <AssetImage src={product.pictures ? {uri: product.pictures[0]} : require('../../images/user.png')} resizeMode='cover' />
          </View>
          <View style={styles.content}>
            <View style={styles.info}>
              <Text style={styles.name}>{getBrandName(product.brand).toUpperCase()}</Text>
              <Text style={[styles.subtitle]}>{product.name}</Text>   
            </View>

            <View style={styles.price}>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={onRemove}
                >
                <Icon name="trash" size={22} color='#777' />
              </TouchableOpacity>
              <Text style={styles.priceTxt}>{Number(product.price).toFixed(2)}€</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 10,

    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  picture: {
    width: 66,
    height: 66,
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: mainStyle.lightColor,
  },
  price: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  priceTxt: {
    color: '#1F333A',
    textAlign: 'center',
    fontSize: 16,
  },
  removeBtn: {
    width: 40,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
});
