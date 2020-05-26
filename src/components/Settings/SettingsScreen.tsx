import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Alert, ScrollView, Linking, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, MyText , VeilView, PageLoader } from '../Reusable'
import { Fire, Flash } from '../../services'

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';
import Icon from '@expo/vector-icons/Entypo'
import AntDesign from '@expo/vector-icons/AntDesign'

import MenuLink from '../Profile/MenuLink'
import { updateLang } from '../../actions/lang.action'
import { updateUser } from '../../actions/auth.action'

import { mainStyle } from '../../styles'

type Props = {}
const SettingsScreen: React.FC<Props> = (props) => {
  
  const user = useSelector(state => state.authReducer.user)
  const lang = useSelector(state => state.langReducer.lang)
  const id = useSelector(state => state.langReducer.id)
  const [info, setInfo] = React.useState(user)
  const dispatch = useDispatch()

  const opts = [
    {key: 'fr', name: 'Français'},
    {key: 'en', name: 'English'},
    {key: 'es', name: 'Español'},
    {key: 'pt', name: 'Português'},
  ]

  const onChange = async (key: string, value: any) => {
    info[key] = value
    setInfo({ ...info })

    try {
      await dispatch(updateUser(info))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title={lang.SETTINGS_TITLE}
        back
        />
      
      <ScrollView style={styles.scroll} contentContainerStyle={{paddingBottom: 40}}>
        <MyText style={styles.groupTitle}>{lang.SETTINGS_LANG}</MyText>
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
                  <MyText style={styles.title}>{opt.name}</MyText>
                </View>

                { /*opt.key === id &&
                  <AntDesign name="check" size={14} color='#E3E4EE' />
                */}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <MyText style={styles.groupTitle}>{lang.SETTINGS_NOTIFS}</MyText>
        <View style={styles.group}>
          <TouchableOpacity style={styles.option} onPress={() => onChange('notifOrders', !info.notifOrders)}>
            <View style={styles.content}>
              <View style={styles.row}>
                <View style={styles.icon}>
                  { info.notifOrders &&
                    <Icon name={'check'} size={18} color={mainStyle.themeColor} />
                  }
                </View>
                <MyText style={styles.title}>{lang.SETTINGS_NOTIFS_ORDERS}</MyText>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => onChange('notifAIG', !info.notifAIG)}>
            <View style={styles.content}>
              <View style={styles.row}>
                <View style={styles.icon}>
                  { info.notifAIG &&
                    <Icon name={'check'} size={18} color={mainStyle.themeColor} />
                  }
                </View>
                <MyText style={styles.title}>{lang.SETTINGS_NOTIFS_AIG}</MyText>
              </View>
            </View>
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
  groupTitle: {
    ...mainStyle.montBold,
    color: mainStyle.themeColor,
    paddingLeft: 20,
    paddingTop: 22,
    paddingBottom: 6,
    fontSize: 18
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