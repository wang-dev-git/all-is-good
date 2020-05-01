import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Icon from '@expo/vector-icons/AntDesign'

import { mainStyle } from '../../styles'

import MyText from './MyText'

interface Props {
  active: boolean;
  title: string;

  onPress: () => void;
  onTapText: () => void;
}
const CheckBox: React.FC<Props> = (props) => {

  return (
    <TouchableOpacity
      style={[styles.container, props.active ? styles.active : {}]}
      onPress={props.onPress}
      >
      <View style={styles.box}>
        { props.active &&
          <Icon name="check" size={22} />
        }
      </View>
      <TouchableOpacity style={{flex: 1}} onPress={props.onTapText}>
        <MyText style={styles.title}>{props.title}</MyText>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const size = 32
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,

    flexDirection: 'row',
  },
  box: {
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  active: {

  },
  title: {
    ...mainStyle.montLight,
    fontSize: 13,
    color: mainStyle.lightColor,
    marginLeft: 16,
  },
});

export default CheckBox