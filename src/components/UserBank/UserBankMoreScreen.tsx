import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, PageLoader, AssetImage } from '../Reusable'
import { Fire, Flash, AppConfig, Stripe } from '../../services'

import { Actions } from 'react-native-router-flux'

import Icon from '@expo/vector-icons/FontAwesome'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  info: any;
}
interface State {
  rib: string;
  uploading: boolean;
  loading: boolean;
  idVerso: string;
  idRecto: string;
}

class UserBankMoreScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    this.state = {
      rib: props.info.rib,//'FR1420041010050500013M02606',
      uploading: false,
      loading: false,
      idRecto: '',
      idVerso: '',
    }
  }

  componentDidMount() {

  }

  onChange(key: string, value: string) {
    this.setState({ rib: value })
  }
  
  async uploadStripe(uri: string) {
    try {
      this.setState({ uploading: true })
      const fileId = await Stripe.uploadFile(uri)
      this.setState({ uploading: false })
      return fileId
    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)  
    }
    this.setState({ uploading: false })  
    return null
  }

  files: any = {}
  async pickFile(id: string) {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted')
      await Permissions.askAsync(Permissions.CAMERA_ROLL)

    try {
      const result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 3],
      });

      if (!result.cancelled) {
        const uri = result.uri
        const state = this.state
        state[id] = uri
        this.setState(state)

        this.files[id] = await this.uploadStripe(uri)
        console.log(this.files[id])
      }

    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
  }

  async save() {
    const { info } = this.props
    const { rib } = this.state

    try {
      this.setState({ loading: true })
      
      let selectedRib: any = undefined
      if (rib && rib.length && !rib.includes('*'))
        selectedRib = rib.split(' ').join('')

      let doc: any = undefined
      if (this.files.idRecto) {
        if (!doc)
          doc = {}
        doc.front_id = this.files.idRecto
      }
      if (this.files.idVerso) {
        if (!doc)
          doc = {}
        doc.back_id = this.files.idVerso
      }

      await Stripe.updateAccount(info, selectedRib, doc)
      Flash.show('Compte enregistré !')
      Actions.pop()
      Actions.pop()
    } catch (err) {
      Flash.error("Une erreur est survenue")
      console.log(err)
    }
    this.setState({ loading: false })
  }

  render() {
    const { user, info } = this.props
    const { rib, uploading, loading, idRecto, idVerso } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title='Compte créé !'
          close
          backAction={() => {Actions.pop(); Actions.pop()}}
          />
        <KeyboardAwareScrollView>
            { (info.verified || info.verifying) ? (
              <Text style={[
                styles.valid,
                info.verified ? { color: mainStyle.greenColor } : { color: mainStyle.orangeColor }
              ]}>
                {info.verified ? 'Votre compte a été correctement vérifié' : 'Votre compte est en cours de validation'}
              </Text>
            ) : (
              <View>
                <View style={styles.intro}>
                  <Text style={styles.introTitle}>Félicitation !</Text>
                  <Text style={styles.introTxt}>Vous pouvez dès maintenant mettre en ligne vos produits</Text>
                </View>

                <View style={styles.intro}>
                  <Text style={styles.introTitle}>Une dernière étape</Text>
                  <Text style={styles.introTxt}>Afin de pouvoir récupérer vos gains, nous avons besoin de votre RIB et d'une pièce d'identité.{'\n\n'}Vous pouvez remplir ces informations plus tard dans "Votre compte vendeur"</Text>
                </View>

                <View style={styles.docs}>
                  <View style={styles.doc}>
                    <Text style={styles.docTitle}>Pièce d'identité (Recto)</Text>
                    <TouchableOpacity style={styles.docImg} onPress={() => this.pickFile('idRecto')}>
                      { idRecto ? (
                        <AssetImage src={{uri: idRecto}} resizeMode='cover' />
                      ) : (
                        <View style={styles.docNone}>
                          <Text style={styles.docNoneTxt}>+ Ajouter</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.doc]}>
                    <Text style={styles.docTitle}>Pièce d'identité (Verso)</Text>
                    <TouchableOpacity style={styles.docImg} onPress={() => this.pickFile('idVerso')}>
                      { idVerso ? (
                        <AssetImage src={{uri: idVerso}} resizeMode='cover' />
                      ) : (
                        <View style={styles.docNone}>
                          <Text style={styles.docNoneTxt}>+ Ajouter</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            <TitledInput
              title={'RIB'}
              value={rib}
              placeholder='ex: FR74 **** **** **** **74'
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('rib', nativeEvent.text)}
              />

            {/* Save Button */}
            <View>
              <BottomButton
                disabled={uploading}
                style={{marginTop: 40, marginBottom: 30,}}
                title={uploading ? 'Upload en cours' : 'Enregistrer'}
                backgroundColor={mainStyle.themeColor}

                onPress={() => this.save()}
                />
            </View>
          </KeyboardAwareScrollView>

        <PageLoader
          title={'Validation...'}
          loading={loading}
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
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  introTitle: {
    ...mainStyle.montBold,
    fontSize: 20,
    marginTop: 14,
    textAlign: 'center',
  },
  introTxt: {
    ...mainStyle.montLight,
    fontSize: 17,
    lineHeight: 22,
    marginTop: 14,
    textAlign: 'center',
  },
  valid: {
    marginTop: 20,
    ...mainStyle.montBold,
    textAlign: 'center',
    color: mainStyle.greenColor,
  },

  docs: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  doc: {
    marginTop: 20,
    width: Dimensions.get('window').width / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docNone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docNoneTxt: {
    ...mainStyle.montBold,
    fontSize: 14,
    textAlign: 'center',
  },
  docTitle: {
    ...mainStyle.montLight,
    fontSize: 14,
    marginBottom: 18,
    textAlign: 'center',
  },
  docImg: {
    width: 140,
    height: 140,
    overflow: 'hidden',

    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(UserBankMoreScreen)
