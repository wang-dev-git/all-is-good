import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, ImageSlider, VeilView } from '../Reusable'
import { Fire, Flash, Time } from '../../services'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  order: any;
}
interface State {

}

class TrackingScreen extends React.Component<Props, State>  {
  
  componentDidMount() {

  }

  getNameForStep(step: string): string {
    console.log(step)
    switch (step) {
      case "pending":
        return "Produit payé"
        break;

      case "in_transit":
        return "Produit pris en charge par Mondial Relay"
        break;

      case "delivered":
        return "Produit disponible en point relai"
        break;

      case "failed":
        return "Problème lors de la livraison, veuillez contacter le SAV"
        break;
      
      default:
        return "Etat inconnu"
        break;
    }
  }

  renderStep(item: any) {
    return (
      <View style={styles.step}>
        <Text style={styles.stepName}>{this.getNameForStep(item.name)}</Text>
        <Text style={styles.stepDate}>{Time.fullDate(item.date)}</Text>
      </View>
    )
  }

  renderHeader() {
    const { order } = this.props
    return (
      <View>
        <Text style={styles.intro}>Suivez en temps réel les étapes de votre colis</Text>
        <TouchableOpacity onPress={() => Actions.product({ product: order.product })}>
          <Text style={styles.productBtnTxt}>Voir la fiche produit</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { user, order } = this.props

    return (
      <View style={styles.container}>
        <HeaderBar
          title="Suivis du colis"
          back
          />
        <FlatList
          data={(order.steps || []).reverse()}
          contentContainerStyle={{ paddingBottom: 40, }}
          ListHeaderComponent={() => this.renderHeader()}
          renderItem={({ item, index }) => this.renderStep(item)}
          keyExtractor={(item, index) => index.toString()}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  intro: {
    marginTop: 20,
    marginBottom: 12,

    ...mainStyle.montLight,
    paddingHorizontal: 20,
    lineHeight: 24,
    fontSize: 14,
    textAlign: 'center',
  },
  step: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepName: {
    flex: 1,
    ...mainStyle.montBold,
    fontSize: 14
  },
  stepDate: {
    flex: 1,
    ...mainStyle.montLight,
    fontSize: 12,
    textAlign: 'right',
  },
  productBtnTxt: {
    ...mainStyle.montBold,
    color: mainStyle.themeColor,
    fontSize: 14,
    textAlign: 'center',
  }

});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(TrackingScreen)
