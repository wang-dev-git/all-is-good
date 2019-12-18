import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'

interface Props {
  title: string;
  value: string;

  iconSize?: number;
  right?: boolean;

  onPress: () => void;
}

const CategoryLink: React.SFC<Props> = (props) => {
  const max = 22
  const value = props.value.length > max ? props.value.substr(0, max) + '...' : props.value
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title}>{props.title}</Text>
        </View>

        <View style={mainStyle.row}>
          <Text style={styles.value}>{value}</Text>
          { props.right &&
            <Icon name="chevron-right" size={14} color='#333' />
          }
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    paddingBottom: 16,
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
    marginLeft: 0,
    fontSize: 15,
    color: '#444',
  },
  value: {
    marginRight: 8,
    fontSize: 14,
    color: mainStyle.darkColor,
    fontWeight: 'bold',
  },
  input: {
    color: '#777',
  },
});

export default CategoryLink