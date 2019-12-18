import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert, Platform, ScrollView, Dimensions } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'

import { HeaderBar, TitledInput, BottomButton, ImageSlider, AssetImage, VeilView, PageLoader, SelectCreditCard } from '../Reusable'
import { Fire, Flash, AppConfig } from '../../services'
import { Actions } from 'react-native-router-flux'

import CategoryLink from '../Category/CategoryLink'
import Certif from './Certif'

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import Icon from '@expo/vector-icons/AntDesign'

import { fetchProducts, fetchHomeProducts } from '../../actions/products.action'

import { categories } from '../../filters'
import { types, subtypes } from '../../filters'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import * as FileSystem from 'expo-file-system';

import { mainStyle } from '../../styles'

interface Props {
  user: any;

  fetchProducts: () => void;
  fetchHomeProducts: () => void;
}
interface State {
  product: any;
  pictures: any[];
  expertPictures: any[];
  selectedIds: any;
  loading: boolean;
  checked: boolean;
  expertCard: string;
  expertBrand: number;
}

const maxTitle = 60
const maxDescription = 255

class SellScreen extends React.Component<Props, State>  {
  
  state = {
    product: {
      name: '',
      description: '',
      price: '0',
      available: true
    },
    pictures: [],
    expertPictures: [],
    selectedIds: {
      type: '',
      subtype: '',
      states: [],
      brands: [],
      colors: [],
      sizes: [],
      shoes: [],
      packSizes: [],
    },
    loading: false,
    checked: false,
    expertCard: '',
    expertBrand: 0,
  }

  componentDidMount() {
    this.checkAccount()
    //setTimeout(() => this.showCategory(categories[4]), 200)
  }

  async checkAccount() {
    try {
      const res = await Fire.cloud("hasAccount")
      if (!res)
        Actions.userBank({ optionals: true })
    } catch (err) {
      console.log(err)
      Flash.error('Une erreur est survenue')
    }
  }

  onChange(key: string, value: string) {
    const { product } = this.state
    product[key] = value
    this.setState({ product: product })
  }

  getCurrentPrice() {
    const { product } = this.state
    const price = product.price.replace(',', '.')
    return Number(Number(price || 0).toFixed(2))
  }

  showCategory(cat: any) {
    if (cat.key == 'types') {
      Actions.pickType({
        category: 'types',
        
        onSelect: (type: string, subtype: string) => {
          const { selectedIds } = this.state
          selectedIds.type = type
          selectedIds.subtype = subtype
          this.setState({ selectedIds })
        }
      })
      return
    }

    Actions.category({
      title: cat.title,
      category: cat.key,
      data: cat.data,
      multi: cat.multi || false,
      selectedIds: this.state.selectedIds[cat.key] || [],
      search: cat.key == 'brands',

      onSelectedChanged: (changedIds: any[], item) => {
        const { selectedIds } = this.state
        selectedIds[cat.key] = changedIds
        this.setState({ selectedIds })
      }
    })
  }

  getSelectedValueForType() {
    const { selectedIds } = this.state

    const type: string = selectedIds.type
    const subtype: string = selectedIds.subtype

    if (!subtype || subtype.length == 0)
      return ''

    let typeName: string = ''
    let subtypeName: string = ''
    for (const t of types) {
      if (t.key == type) {
        typeName = t.title
        break
      }
    }

    const possibleSubtypes = subtypes[type]
    for (const sub of possibleSubtypes) {
      if (sub.key == subtype) {
        subtypeName = sub.title
        break
      }
    }

    return subtypeName + ' - ' + typeName
  }

  getSelectedValueForCategory(cat: any) {
    if (cat.key == 'types')
      return this.getSelectedValueForType()
    
    const selected = this.state.selectedIds[cat.key]
    if (selected && selected.length > 0) {
      let value = ''
      let found = false
      for (let i = 0; i < selected.length; ++i) {
        const selectedKey = selected[i]
        if (i != 0)
          value += ', '
        for (const obj of cat.data) {
          if (obj.key == selectedKey) {
            found = true
            switch (cat.key) {
              case "sizes":
              case "shoes":
                value += "Taille " + obj.value
                break;

              case "colors":
                value += obj.name
                break;

              default:
                value += obj.value
                break;
            }
          }
        }
      }
      if (!found)
        value = selected[0]
      return value
    }
    return ''
  }

  openSettings() {
    if (Platform.OS !== 'ios')
      return;
    Linking.openURL('app-settings://')
  }

  async addPicture() {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      const res = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (res.status !== 'granted') {
        alert("Veuillez activer la permissions Photos dans vos réglages pour vous permettre d'uploader vos photos")
        this.openSettings()
      }
    }

    Actions.imagePicker({
      callback: async (info) => {

        const pictures = this.state.pictures
        for (const img of info) {
          try {
            const forcedWidth = 800
            const forcedHeight = img.height * forcedWidth / img.width
            const res = await ImageManipulator.manipulateAsync(img.uri, [
              { resize: { width: forcedWidth, height: forcedHeight } }
            ], {
              compress: 1,
              format: ImageManipulator.SaveFormat.PNG
            });
            //const file = await FileSystem.readAsStringAsync(res.uri, { encoding: 'base64' })
            pictures.push(res.uri)
          } catch (err) {
            console.log(err)
          }
        }
        Flash.show('Photos ajoutées !')
        this.setState({ pictures: pictures });
        Actions.pop()
      }
    })
    
  }

  removePicture(index: number) {
    const pictures = this.state.pictures
    pictures.splice(index, 1)

    this.setState({ pictures: pictures })
      Flash.show('Photo supprimée !')
  }

  async sell() {
    const { user, fetchProducts } = this.props
    const { product, selectedIds, checked } = this.state

    const sizes = selectedIds.sizes
    const shoes = selectedIds.shoes
    if (!sizes.length && !shoes.length) {
      alert("Vous devez saisir une Taille ou une Pointure")
      return;
    }

    const data: any = {
      ...this.state.product,
      price: this.getCurrentPrice() / (1 - AppConfig.applicationFee)
    }

    const brand = selectedIds.brands && selectedIds.brands[0]
    const size = selectedIds.sizes && selectedIds.sizes[0]
    const shoe = selectedIds.shoes && selectedIds.shoes[0]
    const state = selectedIds.states && selectedIds.states[0]
    const packSize = selectedIds.packSizes && selectedIds.packSizes[0]
    const colors = selectedIds.colors
    data.type = selectedIds.type
    data.subtype = selectedIds.subtype
    data.packSize = packSize
    data.state = state
    data.brand = brand
    if (shoe)
      data.shoe = shoe
    if (size)
      data.size = size
    if (colors)
      data.colors = colors

    data.pictures = this.state.pictures

    const payload: any = {
      product: data,
    }
    if (checked) {
      payload.expert = {
        pictures: this.state.expertPictures,
        card: this.state.expertCard,
        brand: this.state.expertBrand,
      }
      payload.expert.pictures = await this.uploadPictures('expertise', this.state.expertPictures)
    }


    this.setState({ loading: true })
    try {
      payload.product.pictures = await this.uploadPictures('products', this.state.pictures)
      await Fire.cloud('sellProduct', payload)
      Flash.show('Produit ajouté au catalogue !', 'Cliquez pour voir votre produit', () => Actions.product({ product: data }))
      fetchProducts()
      fetchHomeProducts()
      Actions.pop()
    } catch (err) {
      this.setState({ loading: false })
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
  }

  async uploadPictures(folder: string, pictures: any[]) {
    const uploaded: string[] = []
    const userId = this.props.user.id
    try {
      for (const pic of pictures) {
        const name = Math.random()
        uploaded.push(await Fire.uploadFile('/users/' + folder + '/' + userId + '/' + name + '.png', pic))
      }
    } catch (err) {

    }
    return uploaded
  }

  onQuit() {
    Alert.alert(
      'Quitter',
      'Êtes-vous sûr de vouloir quitter maintenant ?',
      [
        {
          text: 'Annuler',
          onPress: () => void 0,
          style: 'cancel',
        },
        {text: 'OK', onPress: Actions.pop},
      ],
      {cancelable: false},
    );
  }

  canSell() {
    const { product, selectedIds, pictures, checked, expertBrand, expertCard } = this.state
    const states = selectedIds.states
    const packSizes = selectedIds.packSizes
    const price = this.getCurrentPrice()
    const brands = selectedIds.brands

    return (pictures.length > 1 &&
      product.name != '' &&
      product.description != '' &&
      price >= 2 &&
      (brands && brands.length) &&
      (packSizes && packSizes.length) &&
      (states && states.length) &&
      selectedIds.type != '' && selectedIds.subtype != '' &&
      (!checked || (checked && expertBrand && expertCard !== '')))
  }

  render() {
    const { user } = this.props
    const { product, loading, pictures, checked } = this.state 
    const noPictures = pictures.length == 0
    
    const nameRemaining = maxTitle - (product.name ? product.name.length : 0)
    const descRemaining = maxDescription - (product.description ? product.description.length: 0)

    if (user.shop && !user.validated) {
      return (
        <View style={styles.container}>
          <HeaderBar
            title='Vendre un article'
            close
            backAction={() => this.onQuit()}
            />
          <View style={{flex: 1, marginTop: 60, alignItems: 'center'}}>
            <Text style={{paddingHorizontal: 32, marginBottom: 30, fontSize: 18, textAlign: 'center', lineHeight: 22, fontWeight: 'bold',}}>En attente de vérification</Text>
            <Text style={{paddingHorizontal: 32, fontSize: 15, textAlign: 'center', lineHeight: 26}}>Vous ne pouvez pas encore ajouter d'articles à votre boutique</Text>
          </View>
        </View>
      )
    }

    const formatted = this.getCurrentPrice() >= 2 ? product.price.replace(',', '.') : ''
    const price = formatted !== '' ? parseFloat(formatted) : 0

    return (
      <View style={styles.container}>
        <HeaderBar
          title='Vendre un article'
          close
          backAction={() => this.onQuit()}
          />
        <View style={{flex: 1, paddingVertical: 1}}>
          <KeyboardAwareScrollView style={{flex: 1}}>
            {/* Pictures */}
            { noPictures ? (
              <View style={styles.noPictures}>
                <VeilView
                  start={mainStyle.themeGradient.start}
                  end={mainStyle.themeGradient.end}
                  startPos={{x: 0, y: -2}}
                  endPos={{x: 1, y: 3}}
                  abs
                  />
                <Text style={styles.noPicturesTxt}>Ajoutez jusqu'à 5 photos (2 minimum)</Text>
                <TouchableOpacity style={styles.addPicture} onPress={() => this.addPicture()}>
                  <View style={mainStyle.row}>
                    <Icon name="plus" size={20} color='#fff' />
                    <Text style={styles.addPictureTxt}>{'Ajoutez une photo'.toUpperCase()}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <ImageSlider
                  width={Dimensions.get('window').width}
                  height={220}
                  pictures={pictures}
                  onRemove={(index: number) => this.removePicture(index)}
                  />
                <TouchableOpacity style={[styles.addPicture]} onPress={() => this.addPicture()}>
                  <View style={mainStyle.row}>
                    <Icon name="plus" size={20} color='#fff' />
                    <Text style={styles.addPictureTxt}>{'Ajoutez une photo'.toUpperCase()}</Text>
                  </View>
                </TouchableOpacity>
                { pictures && pictures.length < 2 &&
                  <Text style={styles.minimum}>Ajoutez au minimum 2 photos</Text>
                }
              </View>
            )}

            {/* Info */}
            <TitledInput
              title={'Titre (' + (nameRemaining) + ')'}
              value={product.name}
              placeholder='ex: TShirt Calvin Klein Rouge'
              maxLength={maxTitle}
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('name', nativeEvent.text)}
              />
            <TitledInput
              title={'Description (' + (descRemaining) + ')'}
              value={product.description}
              placeholder='ex: taille correctement, léger, matière à traiter avec soin'
              multiline
              maxLength={maxDescription}
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('description', nativeEvent.text)}
              />
            <View>
              <TitledInput
                title={'Prix (€)'}
                value={product.price}
                autocorrect={false}
                keyboardType={'numeric'}
                placeholder='0€'

                onChange={({ nativeEvent }) => this.onChange('price', nativeEvent.text)}
                />
              { this.getCurrentPrice() >= 2 ? (
                <View style={styles.earning}>
                  <Text>Prix affiché: {Number(price / (1 - AppConfig.applicationFee)).toFixed(2)}€</Text>
                </View>
              ) : (
                <View style={styles.earning}>
                  <Text>Prix minimum: 2.00€</Text>
                </View>
              )}
            </View>
            
            { categories.map((cat: any, index: number) => (
              <CategoryLink
                key={index}
                title={cat.title + (cat.required && this.getSelectedValueForCategory(cat) === '' ? ' (requis)' : '')}
                value={this.getSelectedValueForCategory(cat)}
                right
                onPress={() => this.showCategory(cat)}
                />
            ))}

            {/*
            <TouchableOpacity style={styles.auth} onPress={() => {
                this.setState({ checked: !this.state.checked })
              }}>
              <View style={[styles.checkable]}>
                { checked &&
                  <Icon name="check" color={mainStyle.greenColor} size={22} />
                }
              </View>
              <Text style={{flex: 1}}>Cocher cette case si vous souhaitez demander une certification pour votre produit (18,90€)</Text>
            </TouchableOpacity>
            */}

            { checked &&
              <Certif
                updateCard={(expertCard: string) => this.setState({ expertCard })}
                updateBrand={(expertBrand: number) => this.setState({ expertBrand })}
                updatePictures={(pics: any[]) => this.setState({ expertPictures: pics })}
                />
            }

            {/* Sell Button */}
            <View style={{marginTop: 12}}>
              <BottomButton
                style={styles.sellBtn}
                title={'Mettre en vente' + (checked ? ' (18.90€)' : '')}
                backgroundColor={mainStyle.themeColor}
                disabled={!this.canSell()}

                onPress={() => this.sell()}
                />
            </View>
          </KeyboardAwareScrollView>
        </View>
        <PageLoader
          loading={loading}
          title='Ajout au catalogue...'
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
  pictures: {
    flex: 1,
  },
  noPictures: {
    flex: 1,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPicturesTxt: {
    fontSize: 17, fontWeight: 'bold', color: '#fff',
    marginTop: 35,
    marginBottom: 20,
  },
  addPicture: {
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: mainStyle.themeColor,

    margin: 10,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPictureTxt: {
    marginLeft: 16,
    color: '#fff',
    fontSize: 16,
  },
  minimum: {
    ...mainStyle.montLight,
    textAlign: 'center',
    color: mainStyle.redColor,
  },
  sellBtn: {
    marginTop: 40,
    ...ifIphoneX({
      marginBottom: 34
    }, {
      marginBottom: 20,
    })
  },
  earning: {
    position: 'absolute',
    top: 20,
    right: 20
  },

  auth: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  checkable: {
    width: 34,
    height: 34,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({
  fetchProducts: () => dispatch(fetchProducts()),
  fetchHomeProducts: () => dispatch(fetchHomeProducts()),
})
export default connect(mapStateToProps, mapDispatchToProps)(SellScreen)
