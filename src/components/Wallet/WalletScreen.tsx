import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, ScrollView, RefreshControl } from 'react-native';

import { HeaderBar } from '../Reusable'

import Icon from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash, Time } from '../../services'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
}
interface State {
  loading: boolean;
  transactions: any[];
}

class WalletScreen extends React.Component<Props, State>  {
  
  state = {
    loading: false,
    transactions: []
  }

  componentDidMount() {
    this.fetchTransactions()
  }

  async transfer() {
    this.setState({ loading: true })
    try {
      const res = await Fire.cloud('transferMoney')
      if (res) {
        Flash.show('Transfer effectué')
        await this.fetchTransactions()
      }
      else {
        Flash.error('Veuillez compléter votre compte vendeur')
        Actions.userBank()
      }
    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
    this.setState({ loading: false })
  }

  async fetchTransactions() {
    try {
      const { user } = this.props
      const ref = Fire.store().collection('transactions').where('userId', '==', user.id).orderBy('createdAt', 'desc')
      const transactions = await Fire.list(ref)
      this.setState({ transactions })
    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
  }
  
  renderTransaction(item: any) {
    let nb = 0
    let title = ''
    let subtitle = ''
    if (item.type == 'sell') {
      nb = item.amount
      if (!item.product)
        return
      title = 'Vente "' + item.product.name + '"'
      subtitle = item.buyer
    } else {
      nb = -item.amount
      title = 'Transfert vers mon compte bancaire'
      subtitle = '**** **** **** **** ' + item.rib
    }
    const date = Time.date(item.createdAt).replace('.', '').replace('.', '').toUpperCase()

    return (
      <View style={styles.transaction}>
        <View>
          <Text style={styles.transactionTitle}>{title}</Text>
          <Text style={styles.transactionSubtitle}>{subtitle + ' . ' + date}</Text>
        </View>
        <Text style={[styles.transactionAmount, nb > 0 ? styles.up : styles.down]}>{nb > 0 ? '+' : ''}{nb.toFixed(2)}€</Text>
      </View>
    )
  }

  renderHeader() {
    const { user } = this.props
    const { loading } = this.state
    const wallet = Number(user.wallet || 0).toFixed(2)

    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.light}>Montant en attente</Text>
          <Text style={styles.light}>0,00€ <Icon name="infocirlceo" /></Text>
        </View>

        <View style={styles.available}>
          <Text style={styles.amount}>{wallet}€</Text>
          <Text style={styles.light}>Montant disponible</Text>
          <TouchableOpacity style={styles.transferBtn} disabled={!user.wallet} onPress={() => this.transfer()}>
            <Text style={styles.transferTxt}>{loading ? 'Transfert en cours...' : 'Transférer'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.intro}>Contrôlez vos ventes: après chaque transaction, la somme apparaîtra ici.</Text>
      </View>
    )
  }

  render() {
    const { transactions } = this.state
    
    return (
      <View style={styles.container}>
        <HeaderBar
          title='Votre Wallet'
          back
          />
        
        <FlatList
          data={transactions || []}
          ListHeaderComponent={() => this.renderHeader()}
          renderItem={({ item, index }) => this.renderTransaction(item)}
          ListEmptyComponent={() => this.renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          />
      </View>
    );
  }

  renderEmpty() {
    const { loading } = this.state
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTxt}>{ loading ? 'Chargement en cours... ' : 'Aucune transaction'}</Text>
      </View>
    )
  }
}

const sideMargin = 16
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sideMargin,
    paddingHorizontal: sideMargin,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  light: {
    color: mainStyle.darkColor,
    opacity: 0.8,
  },
  available: {
    paddingVertical: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount: {
    ...mainStyle.montText,
    color: 'black',
    fontSize: 26,
    marginBottom: 12,
  },
  transferBtn: {
    width: Dimensions.get('window').width - sideMargin * 2,
    paddingHorizontal: sideMargin,
    paddingVertical: 16,
    backgroundColor: '#8ad9de',
    borderRadius: 4,
    marginTop: 30,
  },
  transferTxt: {
    ...mainStyle.montBold,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  intro: {
    paddingTop: 20,
    paddingBottom: 26,
    paddingHorizontal: sideMargin,
    backgroundColor: '#eee',
    lineHeight: 22,
  },
  month: {
    paddingHorizontal: sideMargin,
    paddingVertical: 16,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sideMargin,
    paddingHorizontal: sideMargin,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  transactionTitle: {
    color: 'black',
    fontSize: 17,
    marginBottom: 6,
    marginRight: 10,
    opacity: 1,
  },
  transactionSubtitle: {
    color: mainStyle.darkColor,
    fontSize: 17,
    opacity: 0.8,
    marginRight: 10,
  },
  transactionAmount: {
    fontSize: 16,
  },
  up: {color: mainStyle.greenColor}, down: {color: mainStyle.redColor},

  empty: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTxt: {
    textAlign: 'center',
    lineHeight: 28,
  },
});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen)
