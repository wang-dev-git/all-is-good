import React from 'react';

import { StyleSheet, View, Text, TextInput } from 'react-native';

import { mainStyle } from '../../styles'

interface Props {
  title: string;
  value: string;
  placeholder: string;
  maxLength?: number;
  maxLines?: number;
  multiline?: boolean;
  autocorrect?: boolean;
  keyboardType?: any;
  secure?: boolean;
  editable?: boolean;

  onChange: (event: any) => void;
}

const TitledInput: React.SFC<Props> = (props) => {
  const onChange = (event: any) => {
    const text = event.nativeEvent.text
    const lines = text.split("\n").length
    const max = props.maxLines
    if (!max || lines <= max)
      props.onChange(event)
  }
  return (
    <View style={[styles.container, props.editable === false ? {opacity: 0.42} : {}]}>
      <Text style={[styles.title, props.multiline ? {marginBottom: 8} : {}]}>{props.title}</Text>
      <TextInput
        value={props.value}
        placeholder={props.placeholder}
        onChange={onChange}
        multiline={props.multiline}
        style={[styles.input, props.multiline ? {minHeight: 60} : {height: 50}]}
        maxLength={props.maxLength || 500}
        keyboardType={props.keyboardType}
        underlineColorAndroid='transparent'
        secureTextEntry={props.secure}
        autoCorrect={props.autocorrect}
        editable={props.editable}
        />
    </View>
  )
}

// @refresh reset
const inputHeight = 22
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingLeft: mainStyle.sideMargin,
    paddingRight: mainStyle.sideMargin,
  },
  title: {
    ...mainStyle.montBold,
    fontSize: 13,
    color: mainStyle.themeColor,
  },
  input: {
    marginTop: 12,
    color: '#777',
    borderColor: '#ddd',
    paddingHorizontal: 22,
    borderWidth: 1,
    height: inputHeight,
    borderRadius: inputHeight,
  },
});

export default TitledInput