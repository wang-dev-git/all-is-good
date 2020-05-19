import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { CreditCardInput } from "react-native-credit-card-input";

import Stripe from 'react-native-stripe-api';

import { HeaderBar, MyText, TitledInput, SmallButton, PageLoader, KeyboardScrollView } from '../Reusable'
import { Actions } from 'react-native-router-flux'
import { Fire, Flash, AppConfig } from '../../services'

import { addCard } from '../../actions/cards.action'

import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'

type Props = {
  user: any;
  lang: any;

  addCard: (card: any) => void;
  added?: (card: any) => void;
}
type State = {
  card: any;
  loading: boolean;
}

class AddCardScreen extends React.Component<Props, State>  {
  
  state = {
    card: {},
    loading: false,
  }

  componentDidMount() {
    if (!AppConfig.isProd())
      this.refs.CCInput.setValues({ number: "4242 4242 4242 4242", expiry: "02/22", cvc: "123" });
  }

  onChange(form: any) {
    this.setState({ card: form })
  }

  async proceed() {
    this.setState({ loading: true })
    try {
      const newCard = await this.createNewCard()
      this.setState({ loading: false })
      Actions.pop()
      Flash.show('Carte ajoutée !')
      if (this.props.added)
        this.props.added(newCard)
    } catch (err) {
      Flash.error('Erreur d\'ajout')

      console.warn(err)
      this.setState({ loading: false })
    }
  }

  async createNewCard() {
    const { user, addCard } = this.props
    const { card } = this.state

    const values = card.values
    
    const token = await this.requestStripeToken(values)
    const cardId = await Fire.cloud('addCard', { token: token.id })
    const newCards = await addCard({
      last4: values.number.substr(-4),
      expiry: values.expiry,
      cvc: values.cvc,
      type: values.type,
      cardId: cardId,
    })
    console.log(cardId)
    console.log(values.type)
    const lastAdded = newCards[newCards.length - 1]
    return lastAdded
  }

  async requestStripeToken(card: any) {
    const apiKey = AppConfig.get().stripeAPIKey;
    const client = new Stripe(apiKey);

    const split = card.expiry.split('/')
    const month = split[0]
    const year = split[1]

    return await client.createToken({
      number: card.number,
      exp_month: month, 
      exp_year: year, 
      cvc: card.cvc,
    });
  }

  render() {
    const { card, loading } = this.state
    const { lang } = this.props
    return (
      <View style={styles.container}>
        <HeaderBar
          title={lang.ADD_CARD_TITLE}
          back
          />
        <KeyboardScrollView contentContainerStyle={{paddingTop: 30, paddingBottom: 20}}>
          <CreditCardInput
            color={"blue"}
            ref="CCInput"
            onChange={(form: any) => this.onChange(form)}
            cardImageFront={require('../../images/cards/front.jpeg')}
            cardImageBack={require('../../images/cards/back.jpeg')}
            />


          <View style={{marginTop: 40, alignItems: 'center'}}>
          <SmallButton
            title={lang.ADD_CARD_CONFIRM}
            disabled={!card.valid}

            onPress={() => this.proceed()}
            />
          </View>

          <MyText style={styles.noStoring}>{lang.ADD_CARD_LEGAL}</MyText>
        </KeyboardScrollView>

        <PageLoader
          title={lang.ADD_CARD_LOADING}
          loading={loading}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switcher: {
    marginTop: 20,
    marginLeft: 20,
  },
  switcherTxt: {
    color: 'rgb(100, 100, 222)'
  },
  noStoring: {
    color: mainStyle.lightColor,
    paddingHorizontal: 20,
    marginTop: 20,
    lineHeight: 23,
    textAlign: 'center',
  }
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  lang: state.langReducer.lang,
})
const mapDispatchToProps = (dispatch: any) => ({
  addCard: (card: any) => dispatch(addCard(card)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddCardScreen)
