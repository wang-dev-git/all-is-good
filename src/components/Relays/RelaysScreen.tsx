import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, ImageSlider, VeilView } from '../Reusable'
import { Fire, Flash, Chrono } from '../../services'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
}
interface State {
  relays: any[];
  relay: any;
  fetching: boolean;
}

class RelaysScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    this.state = {
      fetching: false,
      relays: [],
      relay: null,
    }
  }

  componentDidMount() {
    this.fetchRelays()
  }

  async fetchRelays() {
    const { user } = this.props
    this.setState({ fetching: true })

    try {
      const relays = await Chrono.getRelays(user.postal_code)
      this.setState({ relays: relays, fetching: false })
    } catch (err) {
      this.setState({ fetching: false })
      Flash.error("Une erreur est survenue")
    }
  }

  confirm() {
    Actions.payment({
      relay: this.state.relay
    })
  }

  render() {
    const { user } = this.props
    const { fetching, relays, relay } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title={'Trouvez un point relais'}
          back
          />
        <StatusBar barStyle='light-content' />
        <ScrollView contentContainerStyle={ifIphoneX({ paddingBottom: 130 }, { paddingBottom: 110 })}>
          <View style={styles.recap}>
            <Text style={styles.recapTitle}>Choisissez un point relais</Text>
            
            { fetching ? (
              <Text>Chargement des points relai....</Text>
            ) : relays.length == 0 ? (
              <Text>Aucun point relai à disposition</Text>
            ) : relays.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => this.setState({ relay: item })} style={[styles.relay]}>
                <View style={styles.relayInfo}>
                  <Text style={styles.relayName}>{item.name}</Text>
                  <Text style={styles.relayAddr}>{item.address}</Text>
                </View>
                <View style={styles.checkable}>
                  { relay && item.id === relay.id &&
                    <AntDesign name="check" color={mainStyle.greenColor} size={22} />
                  }
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={mainStyle.floatingBottom}>
          <BottomButton
            disabled={!relay}
            style={{marginBottom: 20 }}
            title={"Continuer"}
            backgroundColor={mainStyle.themeColor}
            onPress={() => this.confirm()}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  recap: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  recapTitle: {
    ...mainStyle.montLight,
    fontSize: 20,
    marginBottom: 18,
  },

  relay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  relayInfo: {
    flex: 1,
  },
  relayName: {
    ...mainStyle.montBold,
    marginBottom: 6,
  },
  relayAddr: {
    ...mainStyle.montLight
  },
  checkable: {
    width: 36,
    height: 36,
    borderRadius: 3,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }

});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(RelaysScreen)
