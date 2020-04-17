import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome'
import AntDesign from '@expo/vector-icons/AntDesign'

import { mainStyle } from '../../styles'

interface Props {
  title: string;
  icon: string;
  iconSize?: number;
  right?: boolean;

  onPress: () => void;
}

const MenuLink: React.SFC<Props> = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Icon name={props.icon} size={props.iconSize || 18} color={mainStyle.themeColor} />
          </View>
          <Text style={styles.title}>{props.title}</Text>
        </View>

        { props.right &&
          <AntDesign name="right" size={14} color='#666' />
        }
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
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

export default MenuLink