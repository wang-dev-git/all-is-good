import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, RefreshControl, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, AssetImage } from '../Reusable'
import { Fire } from '../../services'

import { Actions } from 'react-native-router-flux'

import CategoryLink from './CategoryLink'

import Icon from '@expo/vector-icons/FontAwesome'

import { fetchNotifs } from '../../actions/notifs.action'
import { updateUser } from '../../actions/auth.action'

import moment from 'moment'
import 'moment/locale/fr'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  notifs: any[];
  loading: boolean;

  fetchNotifs: () => void;
  updateUser: (info: any) => void;
}
interface State {

}

class NotifsScreen extends React.Component<Props, State>  {

  componentDidMount() {
    this.props.fetchNotifs()

    this.props.updateUser({ unread: false })
  }

  selectItem(item: any) {
    const payload = item.payload
    if (!payload)
      return
    switch (payload.redirect) {
      case 'orders':
        Actions.orders()
        break
      case 'sales':
        Actions.sales()
        break
      case 'wallet':
        Actions.wallet()
        break
      default:

        break;
    }
  }

  renderItem(item: any, index: number) {
    const { user } = this.props

    const date = Fire.getDateFor(item.createdAt)
    const formatted = moment(date).fromNow()
    return (
      <TouchableOpacity onPress={() => this.selectItem(item)}>
        <View style={styles.item}>
          <View style={mainStyle.row}>
            <View style={styles.rowPicture}>
              <AssetImage src={item.picture ? {uri: item.picture} : user.pictures && user.pictures.length ? { uri: user.pictures[0] } : require('../../images/user.png')} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTxt}>{item.message}</Text>
              <Text style={styles.rowSubtitle}>{formatted}</Text>
            </View>
            <View style={styles.chevron} >
              <Icon name="chevron-right" size={18} color={mainStyle.darkColor} />  
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { notifs, loading, fetchNotifs } = this.props
    return (
      <View style={styles.container}>
        <HeaderBar
          title={'Notifications'}
          back
          />
        <FlatList
          contentContainerStyle={{paddingBottom: 150}}
          data={notifs || []}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          ListEmptyComponent={() => this.renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchNotifs}
            />
          }
          />
      </View>
    );
  }

  renderEmpty() {
    const { loading } = this.props
    return (
      <View style={styles.empty}>
        <Text>{ loading ? 'Chargement en cours... ' : 'Aucune notification'}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingRight: 16,
    paddingLeft: 20,
  },
  rowPicture: {
    ...mainStyle.circle(50),
  },
  rowContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 5,
  },
  rowTxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: mainStyle.darkColor,
  },
  rowSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: mainStyle.lightColor,
  },
  chevron: {
    justifyContent: 'center',
  },
  box: {
    ...mainStyle.circle(40),
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingTop: 20,
    paddingBottom: 20,
    top: undefined, 
  },

  empty: {
    flex: 1,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  notifs: state.notifsReducer.list,
  loading: state.notifsReducer.loading,
})
const mapDispatchToProps = (dispatch: any) => ({
  fetchNotifs: () => dispatch(fetchNotifs()),
  updateUser: (info: any) => dispatch(updateUser(info))
})
export default connect(mapStateToProps, mapDispatchToProps)(NotifsScreen)
