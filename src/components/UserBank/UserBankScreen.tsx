import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, PageLoader, AssetImage } from '../Reusable'
import { Fire, Flash, AppConfig, Stripe, Time } from '../../services'

import { Actions } from 'react-native-router-flux'
import DatePicker from 'react-native-datepicker'

import Icon from '@expo/vector-icons/FontAwesome'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  optionals: boolean;
}
interface State {
  info: any;
  uploading: boolean;
  loading: boolean;
  idVerso: string;
  idRecto: string;

  date: Date;
}

class UserBankScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    this.state = {
      info: {
        phone: '',//'+33642986844',
        birthday: '',//'02/08/1997',
        address: '',//"2 rue de l'Ermitage",
        city: '',//"Sèvres",
        postal_code: '',//'92310',
        rib: '',
        email: '',//"julien.brunet@gmail.com",
        verified: false,
        verifying: false,
      },
      date: '',
      uploading: false,
      loading: false,
      idRecto: '',
      idVerso: '',
    }
  }

  componentDidMount() {
    this.fetchInfo()
  }

  async fetchInfo() {
    this.setState({ loading: true })
    try {
      const res = await Fire.cloud("getStripeAccount")
      if (res && res.account) {
        const acc = res.account
        const bank = res.bankAccount

        console.log(acc)

        this.setState({
          loading: false,
          info: {
            first_name: acc.first_name,
            last_name: acc.last_name,
            email: acc.email,
            address: acc.address.line1,
            postal_code: acc.address.postal_code,
            city: acc.address.city,

            phone: acc.phone.replace('+33', '0'),
            
            //rib: 'FR1420041010050500013M02606',
            rib: bank ? '**** **** **** **** ' + bank.last4 : '',

            verified: acc.verification.status === 'verified',
            verifying: acc.verification.status === 'pending',
          },
          date: acc.dob.day + '/' + acc.dob.month + '/' + acc.dob.year
        })

        // TEST
        //Actions.userBankMore({ info: acc })
      } else {
        this.setState({ loading: false })
      }

    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
      this.setState({ loading: false })
    }
  }

  onChange(key: string, value: string) {
    const { info } = this.state
    if ((key === 'phone') && value.length > 10)
      return;
    info[key] = value
    this.setState({ info })
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
        const { user } = this.props
        const uri = result.uri
        const state = this.state
        state[id] = uri
        this.setState(state)
        this.files[id] = await this.uploadStripe(uri)
      }
    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
  }

  async save() {
    const { info, date } = this.state

    if (date === '') {
      Flash.error('Veuillez remplir votre date de naissance')
      return;
    }

    if (!info.email.length) {
      Flash.error("Veuillez remplir votre email")
      return
    }
    if (!info.first_name.length || !info.last_name.length) {
      Flash.error("Veuillez remplir votre nom et prénom")
      return
    }
    if (info.phone.length != 10) {
      Flash.error("Veuillez remplir votre numéro de téléphone")
      return;
    }

    try {
      this.setState({ loading: true })

      let rib: any = undefined
      if (info.rib && info.rib.length && !info.rib.includes('*'))
        rib = info.rib.split(' ').join('')

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

      info.birthday = date
      console.log(info.birthday)

      await Stripe.updateAccount(info, rib, doc)
      Flash.show('Compte enregistré !')
      this.setState({ loading: false })

      if (this.props.optionals) {
        Actions.userBankMore({ info: info })
      } else {
        Actions.pop()
      }
      
    } catch (err) {
      Flash.error("Une erreur est survenue")
      this.setState({ loading: false })
      console.log(err)
    }
  }

  render() {
    const { user, optionals } = this.props
    const { info, loading , uploading, idRecto, idVerso } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title='Compte Vendeur'
          back
          backAction={() => {
            if (this.props.optionals)
              Actions.pop();
            Actions.pop()
          }}
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
                  <Text style={styles.introTxt}>Afin d'ajouter votre produit au catalogue, nous avons besoin de plus d'informations sur vous</Text>
                  <Text style={styles.introTxt}>Merci de remplir soigneusement le formulaire ci-dessous</Text>
                </View>

                { !optionals &&
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
                }
              </View>
            )}

            <TitledInput
              title={'Prénom'}
              value={info.first_name}
              placeholder='ex: Marie'
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('first_name', nativeEvent.text)}
              />
            <TitledInput
              title={'Nom'}
              value={info.last_name}
              placeholder='ex: Dupont'
              autocorrect={false}
              
              onChange={({ nativeEvent }) => this.onChange('last_name', nativeEvent.text)}
              />

            <TitledInput
              title={'Email'}
              value={info.email}
              placeholder='ex: exemple@isclothing.fr'
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('email', nativeEvent.text)}
              />

            <TitledInput
              title={'Téléphone'}
              value={info.phone}
              placeholder='ex: 06 42 98 68 44'
              autocorrect={false}
              keyboardType='number-pad'

              onChange={({ nativeEvent }) => this.onChange('phone', nativeEvent.text)}
              />

            <View style={styles.datePicker}>
              <Text style={styles.dateTitle}>{'Date de naissance'.toUpperCase()}</Text>
              <DatePicker
                style={{ width: 200 }}
                date={this.state.date} //initial date from state
                mode="date" //The enum of date, datetime and time
                placeholder="select date"
                format="DD/MM/YYYY"
                minDate="01-01-1912"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                }}
                onDateChange={date => {
                  this.setState({ date: date });
                }}
              />
            </View>

            { !optionals &&
              <TitledInput
                title={'RIB'}
                value={info.rib}
                placeholder='ex: FR74 **** **** **** **74'
                autocorrect={false}

                onChange={({ nativeEvent }) => this.onChange('rib', nativeEvent.text)}
                />
            }

            <TitledInput
              title={'Adresse (Rue)'}
              value={info.address}
              placeholder='ex: 1 rue du Panier'
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('address', nativeEvent.text)}
              />

            <TitledInput
              title={'Ville'}
              value={info.city}
              placeholder='ex: Sèvres'
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('city', nativeEvent.text)}
              />

            <TitledInput
              title={'Code postal'}
              value={info.postal_code}
              placeholder='ex: 92310'
              autocorrect={false}
              keyboardType='number-pad'

              onChange={({ nativeEvent }) => this.onChange('postal_code', nativeEvent.text)}
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
  introTxt: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
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
  datePicker: {
    marginTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  dateTitle: {
    marginBottom: 20,
  }
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(UserBankScreen)
