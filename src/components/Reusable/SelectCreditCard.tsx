import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import AssetImage from './AssetImage'
import { Fire, Flash, AppConfig, Modal } from '../../services'

import { Actions } from 'react-native-router-flux'

import AntDesign from '@expo/vector-icons/AntDesign'

import { mainStyle } from '../../styles'

const getImageForType = (cardType: string) => {
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

interface Props {
  card: string;
  cards: any[];

  cardSelected: (cardId: string) => void;
}
const ListCards: React.FC<Props> = (props) => {
 
  const { cards } = props
  const card = props.card

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre moyen de paiement</Text>
      { cards && cards.length ? cards.map((c: any, index: number) => (
        <TouchableOpacity key={index} onPress={() => props.cardSelected(c.cardId)}>
          <View style={[styles.cardRecap]}>
            <View style={styles.picture}>
              <AssetImage style={{width: 60, height: 40, flex: undefined}} src={getImageForType(c.type)} />
              <Text style={[styles.cardName]}>XXXX XXXX XXXX {c.last4}</Text>
            </View>
            <View style={styles.checkable}>
              { c.cardId == card && <AntDesign name="check" size={22} color={mainStyle.greenColor} />}
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

interface Props {
  cards: any[];
  cardSelected: (cardId: string) => void;
}
const SelectCreditCard: React.FC<Props> = (props) => {
 
  const { cards } = props
  const [card, setCard] = React.useState(cards.length ? cards[0] : null)

  const pickCard = (card: string) => {
    setCard(card)
  }

  const showCards = () => {
    Modal.show('show_cards', {
      component: <ListCards cards={cards} card={card} cardSelected={(card) => pickCard(card)} />
    })
  }

  return cards.length ? (
    <TouchableOpacity style={styles.container} onPress={() => showCards()}>
      <View style={[styles.cardRecap]}>
        <View style={styles.picture}>
          <AssetImage style={{width: 60, height: 40, flex: undefined}} src={getImageForType(card.type)} />
          <Text style={[styles.cardName]}>XXXX XXXX XXXX {card.last4}</Text>
        </View>
        <AntDesign name="down" size={22} color={mainStyle.greenColor} />
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.container} onPress={Actions.addCard}>
      <View style={[styles.cardRecap]}>
        <Text style={[styles.cardName]}>Aucune carte enregistrée</Text>
        <AntDesign name="down" size={22} color={mainStyle.greenColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    ...mainStyle.montBold,
    textAlign: 'center',
    fontSize: 13,
    marginVertical: 12,
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
  cards: state.cardsReducer.list,
  cardsToggle: state.cardsReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectCreditCard)
