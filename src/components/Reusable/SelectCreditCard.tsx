import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import AssetImage from './AssetImage'
import { Fire, Flash, AppConfig } from '../../services'

import { Actions } from 'react-native-router-flux'

import FontAwesome from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  cards: any[];

  cardSelected: (cardId: string) => void;
}
interface State {
  card: string;
}
class SelectCreditCard extends React.Component<Props, State>  {
  
  state = {
    card: null,
  }

  getImageForType(cardType: string) {
    switch (cardType) {
      case 'visa':
        return require('../../images/cards/visa.png')
        break

      case 'master-card':
        return require('../../images/cards/master-card.png')
        break

      case 'american-express':
        return require('../../images/cards/american-express.png')
        break
    }
    return require('../../images/cards/american-express.png')
  }

  selectCard(card: any) {
    this.setState({ card: card.cardId })
    this.props.cardSelected(card.cardId)
  }

  render() {
    const { user, cards } = this.props
    const { card } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mode de paiement</Text>
        { cards && cards.length ? cards.map((c: any, index: number) => (
          <TouchableOpacity key={index} onPress={() => this.selectCard(c)}>
            <View style={[styles.cardRecap]}>
              <View style={styles.picture}>
                <AssetImage style={{width: 60, height: 40, flex: undefined}} src={this.getImageForType(c.type)} />
                <Text style={[styles.cardName]}>XXXX XXXX XXXX {c.last4}</Text>
              </View>
              <View style={styles.checkable}>
                { c.cardId == card && <FontAwesome name="check" size={22} color={mainStyle.greenColor} />}
              </View>
            </View>
          </TouchableOpacity>
        )) : (
          <TouchableOpacity style={styles.addCardBtn} onPress={Actions.addCard}>
            <Text style={styles.addCardTxt}>{'Ajouter une Carte Bancaire'.toUpperCase()}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    ...mainStyle.montLight,
    fontSize: 20,
    marginBottom: 18,
  },
  picture: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  
  cardRecap: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingRight: 6,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 16,
  },
  
  addCardBtn: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ddd',
  },
  addCardTxt: {
    ...mainStyle.montLight,
    fontSize: 13,
  },
  checkable: {
    width: 36,
    height: 36,
    borderRadius: 3,
    borderColor: '#999',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,

  cards: state.cardsReducer.list,
  cardsToggle: state.cardsReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectCreditCard)
