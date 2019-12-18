import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, PageLoader, AssetImage, SelectCreditCard } from '../Reusable'
import { Fire, Flash, AppConfig, Expert } from '../../services'

import { Actions } from 'react-native-router-flux'

import Icon from '@expo/vector-icons/AntDesign'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import Stripe from 'react-native-stripe-api';

import { mainStyle } from '../../styles'

interface Props {
  user: any;

  updateBrand: (brand: string) => void;
  updateCard: (card: string) => void;
  updatePictures: (pictures: string[]) => void;
}
interface State {
  pictures: any[];

  shown: boolean;
  brands: any[];
  toggle: boolean;
  card: string;
  brand: any;
}

class Certif extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    this.state = {
      toggle: false,
      brand: null,
      shown: false,
      brands: [],
      pictures: [
        {
          title: 'Photo Face',
          img: null,
        },
        {
          title: 'Photo Arrière',
          img: null,
        },
        {
          title: 'Photo profil droit',
          img: null,
        },
        {
          title: 'Photo profil gauche',
          img: null,
        },
        {
          title: 'Photo de l\'étiquette',
          img: null,
        },
        {
          title: 'Photo du logo',
          img: null,
        },
      ],
      card: null,
    }
  }

  componentDidMount() {
    this.loadBrands()
  }

  async loadBrands() {
    try {
      const brands = await Expert.getBrands()
      this.setState({ brands: brands })
    } catch (err) {
      console.log(err)
    }
  }

  selectBrand(brand: any) {
    const selectedBrand = this.state.brand
    if (selectedBrand) {
      this.setState({ brand: null, shown: false })
      if (selectedBrand.ID === brand.ID) {
        this.props.updateBrand('')
        return;
      }
    }
    this.setState({ brand: brand })
    setTimeout(() => {
      this.setState({ shown: true })
    }, 800)
    this.props.updateBrand(brand.ID)
  }

  selectCard(cardId: string) {
    this.setState({ card: cardId })
    this.props.updateCard(cardId)
  }

  async pickFile(id: number) {
    const { user } = this.props
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
        const pictures = this.state.pictures
        pictures[id].img = result.uri
        this.setState({ pictures: pictures })

        const tabPics: string[] = []
        for (const index in pictures) {
          tabPics.push(pictures[index].img)
        }
        this.props.updatePictures(tabPics)
      }
    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
  }

  addPicture() {
    const pics = this.state.pictures
    pics.push({
      title: 'Photo supplémentaire',
      img: null,
    })
    this.setState({ pictures: pics, toggle: true })
  }
  removePic(index: number) {
    const pics = this.state.pictures
    pics.splice(index, 1)
    this.setState({ pictures: pics, toggle: true })
  }

  renderBrand(item: any, index: number) {
    const { brand } = this.state
    return (
      <TouchableOpacity key={index} style={styles.brand} onPress={() => this.selectBrand(item)}>
        <Text>{item.Marque}</Text>
        <View>
          { brand && item.ID === brand.ID &&
            <Icon name="check" />
          }
        </View>
      </TouchableOpacity>
    )
  }

  renderHeader() {
    return (
      <View>
        <Text>Veuillez sélectionner la marque de votre produit à faire certifier</Text>
      </View>
    )
  }

  render() {
    const { user } = this.props
    const { pictures, card, brands, brand } = this.state

    if (brands.length === 0) {
      return (
        <View>
          <Text style={{textAlign: 'center', paddingVertical: 16,}}>Chargement des marques ...</Text>
        </View>
      )
    }

    const sorted = brands.sort((a: any, b: any) => a.Marque.localeCompare(b.Marque))

    return (
      <View style={styles.container}>
        <View>
          { !brand ? (
            <Text style={styles.expertIntro}>Choisissez votre marque</Text>
          ) : (
            <Text style={styles.expertIntro}>Cliquez pour changer</Text>
          )}
          { !brand ? brands.map((item: any, index: number) => this.renderBrand(item, index)) : this.renderBrand(brand, 0)}
        </View>

        { this.state.shown && (
          <View>
            <Text style={styles.intro}>En demandant l’expertise de votre bien, vous acceptez la transmission des photos et éléments
    caractéristiques du bien à l’expert partenaire</Text>
            
            <View style={styles.docs}>
              { pictures.map((pic, index) => (
                <View key={index} style={styles.doc}>
                  <Text style={styles.docTitle}>{pic.title}</Text>
                  <TouchableOpacity style={styles.docImg} onPress={() => this.pickFile(index)}>
                    { pic.img ? <AssetImage src={{uri: pic.img}} resizeMode='cover' /> : (
                      <View style={styles.docNone}>
                        <Text style={styles.docNoneTxt}>+ Ajouter</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  { index >= 6 &&
                    <TouchableOpacity style={styles.close} onPress={() => this.removePic(index)}>
                      <Icon name="close" size={20} />
                    </TouchableOpacity>
                  }
                </View>
              )) }
            </View>

            <TouchableOpacity onPress={() => this.addPicture()}>
              <Text style={styles.addPic}>Ajouter une photo supplémentaire</Text>
            </TouchableOpacity>

            <SelectCreditCard
              cardSelected={(card: string) => this.selectCard(card)}
              />
              
            <Text style={styles.outro}>En demandant l'expertise de votre produit, la mise en ligne de votre produit revient à 18.90€</Text>
          </View>
        )}

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
    fontSize: 14,
    lineHeight: 22,

    marginTop: 20,
    marginBottom: 22,
    paddingLeft: 20,
    paddingRight: 20,
  },
  expertIntro: {
    ...mainStyle.montBold,
    marginTop: 22,
    marginBottom: 22,
    textAlign: 'center',
  },
  brand: {
    ...mainStyle.row,
    height: 53,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
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
  outro: {
    marginTop: 12,
    paddingHorizontal: 25,
    lineHeight: 26,
    textAlign: 'center',
    color: mainStyle.lightColor
  },
  close: {
    position: 'absolute',
    top: 32,
    right: 20,
    padding: 10,
  },
  addPic: {
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: mainStyle.themeColor,
  }
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Certif)
