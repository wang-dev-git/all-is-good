import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome'

import { AssetImage } from '../Reusable'
import { Fire } from '../../services'

import { mainStyle } from '../../styles'

type Props = {
  order: any;
  cart: any;

  onPress: () => void;
}
type State = {

}

class SaleItem extends React.Component<Props, State>  {
  
  getOrderStatus() {
    const { order } = this.props

    switch (order.status) {
      case "pending":
        return 'En attente'
        break;

      case "in_transit":
        return 'En transit'
        break;

      case "delivered":
        return 'Livré'
        break;

      case "failed":
        return 'Problème survenu'
        break;
    }
    return 'Inconnu'
  }
  
  getOrderStatusColor() {
    const { order } = this.props

    switch (order.status) {
      case "pending":
        return mainStyle.orangeColor
        break;

      case "in_transit":
        return mainStyle.themeColor
        break;

      case "delivered":
        return mainStyle.greenColor
        break;

      case "failed":
        return mainStyle.redColor
        break;
    }
    return mainStyle.redColor
  }

  download() {
    const { order } = this.props
    if (order.expeditionEtiquette)
      Linking.openURL(order.expeditionEtiquette)
  }

  render() {
    const { order, onPress } = this.props
    const product = order.product
    console.log(order.status === 'pending')
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={styles.picture}>
          <AssetImage src={product.pictures && product.pictures.length ? { uri: product.pictures[0] } : require('../../images/user.png')} resizeMode='cover' style={{ width: undefined, height: undefined }} />
        </View>
        <View style={{flex: 1}}>
          <View style={styles.content}>
            <View style={styles.info}>
              <Text style={styles.name}>{(product.brand || '').toUpperCase()}</Text>
              <Text style={[styles.name, styles.subtitle]}>{product.name}</Text>   
            </View>
            <View style={styles.price}>
              <Text style={styles.priceTxt}>{product.price}€</Text>
            </View>
          </View>
          <View style={styles.bottom}>
            { order.status === 'pending' ? (
              <TouchableOpacity style={styles.downloadBtn} onPress={() => this.download()}>
                <Text style={[styles.statusTxt]}>{"Télécharger l'étiquette".toUpperCase()}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.statusTxt, { color: this.getOrderStatusColor() }]}>{this.getOrderStatus().toUpperCase()}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 90,

    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    padding: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bottom: {
    flex: 1,
    padding: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  picture: {
    width: 100,
    height: 90,
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  info: {
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: mainStyle.lightColor
  },
  price: {
    flex: 1,
  },
  priceTxt: {
    flex: 1,
    ...mainStyle.montBold,
    fontSize: 16,
    color: mainStyle.darkColor,
    textAlign: 'right',
  },
  downloadBtn: {
    paddingHorizontal: 16,
    backgroundColor: mainStyle.themeColor,
    borderRadius: 6,
    overflow: 'hidden',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 3,
  },
  statusTxt: {
    ...mainStyle.montBold,
    fontSize: 11,
    color: '#fff'
  },
});


const mapStateToProps = (state: any) => ({
})
const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SaleItem)
