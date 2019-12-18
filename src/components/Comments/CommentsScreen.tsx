import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView, RefreshControl } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, PageLoader } from '../Reusable'
import { Fire, Flash } from '../../services'

import CommentItem from './CommentItem'

import { Actions } from 'react-native-router-flux'

import { mainStyle } from '../../styles'

type Props = {
  user: any;
  product: any;
}
type State = {
  value: string;
  loading: boolean;
  fetching: boolean;
  comments: any;
}

class CommentsScreen extends React.Component<Props, State>  {
  
  state = {
    value: '',
    comments: [],
    loading: false,
    fetching: false,
  }

  async componentDidMount() {
    this.fetchComments()
  }

  async remove(comment: any) {
    const { product } = this.props
    
    this.setState({ loading: true })  

    try {
      await Fire.store()
        .collection('products').doc(product.id)
        .collection('comments').doc(comment.id)
        .delete()
      Flash.show('Commentaire supprimé !')
      this.setState({ loading: false })
      this.fetchComments()
    } catch (err) {
      this.setState({ loading: false })
      Flash.show('Erreur lors de la suppression')
    }
  }

  async fetchComments() {
    const { product } = this.props

    this.setState({ fetching: true })

    try {
      const comments = await Fire.list(Fire.store()
        .collection('products').doc(product.id)
        .collection('comments').orderBy('createdAt', 'desc'))
      this.setState({ fetching: false, comments })
    } catch (err) {
      console.log(err)
      Flash.error('Impossible de récupérer les commentaires')
      this.setState({ fetching: false })
    }
  }

  async send() {
    const { product, user } = this.props
    const { value } = this.state

    if (!value) {
      Flash.error("Vous n'avez rien écrit")
    }

    const newComment = {
      message: value,
      createdAt: new Date(),
      sender: {
        name: user.first_name,
        picture: user.picture || '',
        id: user.id,
      }
    }

    this.setState({ loading: true })
    try {
      await Fire.cloud('addComment', { productId: product.id, message: value })
      Flash.show('Commentaire ajouté !')
      this.setState({ loading: false, value: '' })
      this.fetchComments()
    } catch (err) {
      console.log(err)
      Flash.error("Impossible d'ajouter un commentaire")
      this.setState({ loading: false })
    }
  }

  render() {
    const { user, product } = this.props
    const { value, loading, comments } = this.state
    const isSeller = user.id == product.seller.id
    return (
      <View style={styles.container}>
        <HeaderBar
          title='Commentaires'
          back
          />

        <FlatList
          contentContainerStyle={{ paddingBottom: 220, }}
          data={comments || []}
          ListEmptyComponent={() => this.renderEmpty()}
          renderItem={({ item, index }) => (
            <CommentItem
              comment={item}
              index={index}

              canRemove={isSeller}
              onRemove={() => this.remove(item)}
              />
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => this.fetchComments()}
            />
          }
          />

        <KeyboardAvoidingView enabled behavior='padding' style={[mainStyle.abs, {top: undefined}, styles.inputWrapper]}>
          <TitledInput
            title='Laissez un commentaire (255 max)'
            placeholder='ex: Pouvez-vous ajouter une photo du côté inverse SVP'
            value={value}
            multiline
            maxLength={255}
            maxLines={3}
            autocorrect={false}

            onChange={({ nativeEvent }) => this.setState({ value: nativeEvent.text})}
            />
          <BottomButton
            title={'Envoyer'}
            backgroundColor={mainStyle.themeColor}

            onPress={() => this.send()}
            />
        </KeyboardAvoidingView>

        <PageLoader
          title='Envoi...'
          loading={loading}
          />
      </View>
    );
  }

  renderEmpty() {
    const { fetching } = this.state
    return (
      <View style={styles.empty}>
        <Text>{ fetching ? 'Chargement en cours... ' : 'Aucun commentaire'}</Text>
      </View>
    )
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
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    paddingBottom: 16,
  }
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(CommentsScreen)
