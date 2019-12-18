import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome'

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
            <Icon name={props.icon} size={props.iconSize || 22} color='#333' />
          </View>
          <Text style={styles.title}>{props.title}</Text>
        </View>

        { props.right &&
          <Icon name="chevron-right" size={18} color='#333' />
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
    borderBottomColor: '#ddd',
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
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