import React from 'react';
import { connect, useSelector } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import AssetImage from './AssetImage'
import MyText from './MyText'
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

interface ListProps {
  card: any;

  pick: (card: any) => void;
}
const ListCards: React.FC<ListProps> = (props) => {
  const { card } = props
  const lang = useSelector(state => state.langReducer.lang)
  const cards = useSelector(state => state.cardsReducer.list)
  const cardsToggle = useSelector(state => state.cardsReducer.toggle)

  return (
    <ScrollView style={{maxHeight: 500}}>
      <MyText style={styles.title}>{lang.PICK_CARD_TITLE}</MyText>
      {cards.map((c: any, index: number) => (
        <TouchableOpacity key={index} onPress={() => props.pick(c)}>
          <View style={[styles.cardRecap]}>
            <View style={styles.picture}>
              <AssetImage style={{width: 60, height: 40, flex: undefined}} src={getImageForType(c.type)} />
              <MyText style={[styles.cardName]}>XXXX XXXX XXXX {c.last4}</MyText>
            </View>
            { c.cardId == card.cardId && <AntDesign name="check" size={18} color={mainStyle.lightColor} />}
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.addCardBtn} onPress={Actions.addCard}>
        <MyText style={styles.addCardTxt}>{lang.PICK_CARD_ADD}</MyText>
        <AntDesign name="right" size={18} color={mainStyle.themeColor} />
      </TouchableOpacity>
    </ScrollView>
  );
}

interface Props {
  cardSelected: (cardId: string) => void;
}
const SelectCreditCard: React.FC<Props> = (props) => {
 
  const cards = useSelector(state => state.cardsReducer.list)
  const { cardSelected } = props
  const [card, setCard] = React.useState(cards.length ? cards[0] : null)
  const lang = useSelector(state => state.langReducer.lang)

  React.useEffect(() => {
    if (card)
      cardSelected(card.cardId)
  }, [card])

  const pickCard = (card: any) => {
    Modal.hide('show_cards')
    setCard(card)
  }

  const showCards = () => {
    Modal.show('show_cards', { local: true, content: () => (
      <ListCards
        card={card}
        pick={(card) => pickCard(card)}
        />
    )})
  }

  return card ? (
    <TouchableOpacity style={styles.container} onPress={() => showCards()}>
      <View style={styles.cardChosen}>
        <View style={styles.cardContent}>
          <AssetImage style={{width: 40, height: 30, flex: undefined}} src={getImageForType(card.type)} />
          <MyText style={styles.cardName}>XXXX XXXX XXXX {card.last4}</MyText>
          <AntDesign name="down" size={18} color={mainStyle.lightColor} />
        </View>
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.container} onPress={() => { Modal.hide('show_cards'); Actions.addCard({ added: (c) => setCard(c) }) } }>
      <View style={styles.cardChosen}>
        <View style={styles.cardContent}>
          <MyText style={styles.cardName}>{lang.PICK_CARD_NONE}</MyText>
          <AntDesign name="down" size={18} color={mainStyle.lightColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {

  },
  title: {
    ...mainStyle.montText,
    fontSize: 17,
    marginTop: 24,
    marginBottom: 22,
    paddingHorizontal: 20,
  },
  
  cardChosen: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cardContent: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 22,

    paddingHorizontal: 12,
    paddingVertical: 6,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRecap: {
    flex: 1,
    borderRadius: 6,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  picture: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  cardName: {
    ...mainStyle.montText,
    fontSize: 13,
    marginRight: 10,
    marginLeft: 5,
  },
  
  addCardBtn: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',

    ...ifIphoneX({
      marginBottom: 40
    }, {
      marginBottom: 20
    }),

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addCardTxt: {
    ...mainStyle.montText,
    color: mainStyle.themeColor,
    fontSize: 15,
  },
});

export default SelectCreditCard
