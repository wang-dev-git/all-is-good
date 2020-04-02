import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Alert, ScrollView, Linking, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, VeilView, PageLoader } from '../Reusable'
import { Fire, Flash, Lang } from '../../services'

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';
import Icon from '@expo/vector-icons/Entypo'

import MenuLink from '../Profile/MenuLink'
import { updateLang } from '../../actions/lang.action'

import { mainStyle } from '../../styles'

type Props = {}
const SettingsScreen: React.FC<Props> = (props) => {
  
  const lang = useSelector(state => state.langReducer.lang)
  const id = useSelector(state => state.langReducer.id)
  const dispatch = useDispatch()

  return (
    <View style={styles.container}>
      <HeaderBar
        title={lang.SETTINGS_TITLE}
        back
        />
      
      <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 40}}>
        
        <View style={styles.group}>
          <TouchableOpacity onPress={() => dispatch(updateLang('fr'))}>
            <Text>Français {id === 'fr' ? 'OK' : ''}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => dispatch(updateLang('en'))}>
            <Text>English {id === 'en' ? 'OK' : ''}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

});

export default SettingsScreen