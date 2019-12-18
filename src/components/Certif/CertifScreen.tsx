import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, PageLoader, AssetImage, SelectCreditCard } from '../Reusable'
import { Fire, Flash, AppConfig } from '../../services'

import { Actions } from 'react-native-router-flux'

import Icon from '@expo/vector-icons/FontAwesome'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import Stripe from 'react-native-stripe-api';

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  product: any;

  onFinish: () => void;
}
interface State {
  pictures: any[];
  loading: boolean;
  toggle: boolean;
}

class CertifScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    this.state = {
      pictures: [],
      loading: false,
      toggle: false,
    }
  }

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
        const pictures = this.state.pictures
        pictures[id].img = result.uri
        this.setState({ pictures: pictures, toggle: !this.state.toggle })
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
    this.setState({ pictures: pics, toggle: !this.state.toggle })
  }
  removePic(index: number) {
    const pics = this.state.pictures
    pics.splice(index, 1)
    this.setState({ pictures: pics, toggle: true })
  }

  async save() {
    const { product } = this.props
    const pics: string[] = []
    for (const picture of this.state.pictures) {
      pics.push(picture.img)
    }
    const uploaded = await this.uploadPictures('expertise', pics)
    
    this.setState({loading: true})
    try {
      await Fire.cloud("addExpertPhotos", {
        productId: product.id,
        pictures: uploaded
      })
      Actions.pop()
      Flash.show("Vos photos ont été correctement envoyées")
      this.props.onFinish()
    } catch (err) {
      console.log(err)
      Flash.error("Une erreur est survenue")
    }
    this.setState({loading: true})  
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

  render() {
    const { product } = this.props
    const { pictures, loading } = this.state
    return (
      <View style={styles.container}>
        <HeaderBar
          title="Certification"
          back
          />
        { product.expert.status === 'declined' ? (
          <View>
            <Text style={styles.intro}>Désolé, nous sommes au regrès de vous annoncer que votre produit n'a pas été certifé.</Text>
          </View>
        ) : (
          <ScrollView style={{flex: 1}}>
            <Text style={styles.intro}>Veuillez ajouter plus de photos nécessaires à votre certification</Text>
            
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
              
            <View style={{marginTop: 12}}>
              <BottomButton
                title={'Envoyer les photos'}
                backgroundColor={mainStyle.themeColor}

                onPress={() => this.save()}
                />
            </View>
          </ScrollView>
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
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  introTxt: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
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

export default connect(mapStateToProps, mapDispatchToProps)(CertifScreen)
