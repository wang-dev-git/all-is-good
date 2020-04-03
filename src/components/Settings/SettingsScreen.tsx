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
import AntDesign from '@expo/vector-icons/AntDesign'

import MenuLink from '../Profile/MenuLink'
import { updateLang } from '../../actions/lang.action'

import { mainStyle } from '../../styles'

type Props = {}
const SettingsScreen: React.FC<Props> = (props) => {
  
  const lang = useSelector(state => state.langReducer.lang)
  const id = useSelector(state => state.langReducer.id)
  const dispatch = useDispatch()

  const opts = [
    {key: 'fr', name: 'Français'},
    {key: 'en', name: 'English'},
  ]

  return (
    <View style={styles.container}>
      <HeaderBar
        title={lang.SETTINGS_TITLE}
        back
        />
      
      <ScrollView style={styles.scroll} contentContainerStyle={{paddingBottom: 40}}>
        
        <View style={styles.group}>
          { opts.map((opt, index) => (
            <TouchableOpacity key={index} style={styles.option} onPress={() => dispatch(updateLang(opt.key))}>
              <View style={styles.content}>
                <View style={styles.row}>
                  <View style={styles.icon}>
                    { opt.key === id &&
                      <Icon name={'check'} size={18} color={mainStyle.themeColor} />
                    }
                  </View>
                  <Text style={styles.title}>{opt.name}</Text>
                </View>

                { /*opt.key === id &&
                  <AntDesign name="check" size={14} color='#E3E4EE' />
                */}
              </View>
            </TouchableOpacity>
          ))}
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
  option: {
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E4EE',
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    ...mainStyle.circle(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E3E4EE',
    borderWidth: 1.4,
    marginLeft: 14,
  },
  title: {
    marginLeft: 14,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#444',
  },
  input: {
    color: '#777',
  },
});

export default SettingsScreen