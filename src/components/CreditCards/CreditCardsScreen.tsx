import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Alert, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { HeaderBar, SmallButton, MyText, AssetImage } from '../Reusable'

import { Actions } from 'react-native-router-flux'
import { Fire } from '../../services'

import { removeCard } from '../../actions/cards.action'
import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'

type Props = {
  lang: any;
  cards: any;

  removeCard: (index: number) => void;
}
type State = {
}

class CreditCardsScreen extends React.Component<Props, State>  {
  
  remove(card: any, index: number) {
    const { lang } = this.props
    Alert.alert(
      lang.CARDS_REMOVE_TITLE,
      lang.CARDS_REMOVE_MSG,
      [
        {
          text: lang.GLOBAL_CANCEL,
          style: 'cancel',
        },
        {text: lang.GLOBAL_REMOVE, style: 'destructive', onPress: () => {
          const { removeCard } = this.props
          removeCard(index)
        }},
      ],
      {cancelable: false},
    );
  }

  renderCard(card: any, index: number) {
    console.log(card.cardId)
    return (
      <View style={styles.card}>
        <View style={mainStyle.row}>
          <View style={styles.picture}>
            <AssetImage src={this.getImageForType(card.type)} />
          </View>
          <MyText style={styles.number}>XXXX XXXX XXXX {card.last4}</MyText>
        </View>
        <View style={[mainStyle.row, {marginRight: 1}]}>
          <MyText style={styles.expiry}>{card.expiry}</MyText>
          <TouchableOpacity onPress={() => this.remove(card, index)}>
            <Icon name="trash" size={22} color={mainStyle.lightColor} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { cards, lang } = this.props
    return (
      <View style={styles.container}>
        <HeaderBar
          title={lang.CARDS_TITLE}
          back
          />
        <FlatList
          contentContainerStyle={{paddingBottom: 80}}
          data={cards || []}
          renderItem={({ item, index }) => this.renderCard(item, index)}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <MyText style={styles.emptyTxt}>{lang.CARDS_NONE}</MyText>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          />
        <View style={styles.floatingBottom}>
          <SmallButton
            title={lang.CARDS_ADD}
            onPress={Actions.addCard}
            />
        </View>
      </View>
    );
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
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  empty: {
    flex: 1,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTxt: {
    textAlign: 'center',
    lineHeight: 28,
  },
  card: {
    ...mainStyle.row,
    flex: 1,
    justifyContent: 'space-between',
    height: 80,
    paddingLeft: 20,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginRight: 10,
  },
  floatingBottom: {
    ...mainStyle.abs,
    top: undefined,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  picture: {
    width: 30,
  },
  number: {
    color: mainStyle.darkColor,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 1,
  },
  expiry: {
    color: mainStyle.darkColor,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});


const mapStateToProps = (state: any) => ({
  lang: state.langReducer.lang,
  cards: state.cardsReducer.list,
  toggle: state.cardsReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  removeCard: (index: number) => dispatch(removeCard(index))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardsScreen)
