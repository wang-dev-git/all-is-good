import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome'

import { AssetImage } from '../Reusable'
import { Fire } from '../../services'

import { mainStyle } from '../../styles'

type Props = {
  product: any;

  onPress: () => void;
}
type State = {

}

class OrderItem extends React.Component<Props, State>  {
  
  getTitledStatus() {
    const { product } = this.props

    switch (product.status) {
      case "selling":
        return 'En vente'
        break;
    }
    return 'Inconnu'
  }

  render() {
    const { product, onPress } = this.props

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.picture}>
            <AssetImage src={require('../../images/cooker.png')} resizeMode='cover' style={{ width: undefined, height: undefined }} />
          </View>
          <View style={styles.content}>
            <View style={styles.info}>
              <Text style={styles.name}>{(product.brand || '').toUpperCase()}</Text>
              <Text style={[styles.name, styles.subtitle]}>{product.name}</Text>   
            </View>

            <View style={styles.price}>
              <Text></Text>
              <Text style={styles.priceTxt}>{product.price}€</Text>
            </View>

            <View style={styles.status}>
              <Text style={styles.statusTxt}>{this.getTitledStatus().toUpperCase()}</Text>
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
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    marginLeft: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  picture: {
    width: 120,
    height: 90,
    padding: 10,
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
    paddingRight: 10,
  },
  priceTxt: {
    marginTop: 7,
    fontSize: 12,
    fontWeight: 'bold',
    color: mainStyle.darkColor
  },
  status: {
    flex: 1,
    paddingRight: 10,
  },
  statusTxt: {
    fontSize: 15,
    fontWeight: 'bold',
  }
});


const mapStateToProps = (state: any) => ({
})
const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem)
