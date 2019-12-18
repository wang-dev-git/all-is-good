import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome'

import { Actions } from 'react-native-router-flux'

import { AssetImage } from '../Reusable'
import { Fire } from '../../services'

import { getBrandName } from '../../filters'
import { mainStyle } from '../../styles'

type Props = {
  product: any;
  cart: any;

  onPress: () => void;
}
type State = {

}

class MyProductItem extends React.Component<Props, State>  {
  
  getExpertStatus() {
    const { product } = this.props

    product.expert = {
      status: "declined",
      photos: ['url1', 'url2']
    }
    switch (product.expert.status) {
      case "validated":
        return 'Certifié'
        break;

      case "pending":
        return "En cours de certification..."
        break

      case "declined":
        return "Certification refusée"
        break

      case "need_more":
        return "Photos manquantes"
        break
    }
    return 'Inconnu'
  }

  getExpertStatusColor() {
    const { product } = this.props

    switch (product.expert.status) {
      case "validated":
        return mainStyle.greenColor
        break;

      case "waiting":
        return mainStyle.orangeColor
        break

      case "declined":
        return mainStyle.redColor
        break

      case "need_more":
        return mainStyle.redColor
        break
    }
    return 'black'
  }

  render() {
    const { product, onPress, onPressExpert } = this.props

    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={styles.picture}>
          <AssetImage src={product.pictures && product.pictures.length ? { uri: product.pictures[0] } : require('../../images/user.png')} resizeMode='cover' style={{ width: undefined, height: undefined }} />
        </View>
        <View style={{flex: 1}}>
          <View style={styles.content}>
            <View style={styles.info}>
              <Text style={styles.name}>{getBrandName(product.brand).toUpperCase()}</Text>
              <Text style={[styles.name, styles.subtitle]}>{product.name}</Text>   
            </View>
            <View style={styles.price}>
              <Text style={styles.priceTxt}>{product.price}€</Text>
            </View>
          </View>
          { product.expert &&
            <View style={styles.bottom}>
              <Text style={[styles.statusTxt, { color: this.getExpertStatusColor() }]}>{this.getExpertStatus().toUpperCase()}</Text>
              { product.expert && product.expert.status == 'declined' &&
                <TouchableOpacity style={styles.correctBtn} onPress={onPressExpert}>
                  <Text style={styles.correctTxt}>{'Corriger'.toUpperCase()}</Text>
                </TouchableOpacity>
              }
            </View>
          }
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
  statusTxt: {
    ...mainStyle.montBold,
    fontSize: 11,
    textAlign: 'right',
  },
  correctBtn: {
    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ddd',
  },
  correctTxt: {
    ...mainStyle.montLight,
    fontSize: 11,
  }
});


const mapStateToProps = (state: any) => ({
})
const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MyProductItem)
