import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome'

import { AssetImage } from '../Reusable'
import { Fire } from '../../services'

import { mainStyle } from '../../styles'

interface Props {
  order: any;
  product: any;

  onPress: () => void;
}
interface State {}

class OrderItem extends React.Component<Props, State>  {

  getNameForStep(step: string): string {
    switch (step) {
      case "pending":
        return "Payé"
        break;

      case "in_transit":
        return "En transit"
        break;

      case "delivered":
        return "Disponible en relai"
        break;

      case "failed":
        return "Erreur"
        break;
      
      default:
        return "Inconnu"
        break;
    }
  }

  getColorForStep(step: string) {
    switch (step) {
      case "pending":
        return mainStyle.orangeColor
        break;

      case "in_transit":
        return mainStyle.orangeColor
        break;

      case "delivered":
        return mainStyle.themeColor
        break;

      case "failed":
        return mainStyle.redColor
        break;
      
      default:
        return mainStyle.redColor
        break;
    }
  }

  render() {
    const { order, product, onPress } = this.props
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.picture}>
            <AssetImage src={product.pictures && product.pictures.length > 0 ? {uri: product.pictures[0]} : require('../../images/user.png')} resizeMode='cover' style={{ width: undefined, height: undefined }} />
          </View>
          <View style={styles.content}>
            <View style={styles.info}>
              <Text style={[styles.name]}>{product.name}</Text>   
              <Text style={styles.priceTxt}>{Number(product.price).toFixed(2)}€</Text>
            </View>
            <TouchableOpacity style={[styles.statusBtn, {backgroundColor: this.getColorForStep(order.status)}]} disabled>
              <Text style={[styles.statusTxt]}>{this.getNameForStep(order.status).toUpperCase()}</Text>
            </TouchableOpacity>
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
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingRight: 16,
    paddingLeft: 10,
  },
  content: {
    flex: 1,
    marginLeft: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  picture: {
    width: 80,
    height: 80,
    padding: 10,
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statusBtn: {
    width: 120,
    height: 40,
    borderRadius: 6,
    backgroundColor: mainStyle.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: mainStyle.darkColor,
  },
  price: {
    flex: 1,
    paddingRight: 10,
  },
  priceTxt: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  status: {
    flex: 1,
    paddingRight: 10,
  },
  statusTxt: {
    ...mainStyle.montBold,
    fontSize: 11,
    textAlign: 'center',
    color: '#fff',
  }
});


const mapStateToProps = (state: any) => ({
})
const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem)
